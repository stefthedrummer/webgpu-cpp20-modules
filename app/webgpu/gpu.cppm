

export module webgpu.gpu;
import api;
import core;
import webgpu.sampler;
import webgpu.texture;
import webgpu.buffer;
import webgpu.shader_module;
import webgpu.bind_group;
import webgpu.render_pipeline;
import webgpu.command_encoder;

export struct GPU {
    PersistentHandle<IGPU> _hGPU;
    PersistentHandle<IGPUDevice> _hDevice;
    PersistentHandle<IGPUCanvasContext> _hCanvasContext;
    PersistentHandle<IGPUQueue> _hQueue;
    PersistentHandle<IGPUTexture> _hCurrentTexture;
    PersistentHandle<IGPUTextureView> _hCurrentTextureView;

    static GPU Create() {
        Scope scope{ 1 };

        auto hGPU = Engine::GetGPU();
        auto hDevice = Engine::GetDevice();
        auto hCanvasContext =Engine::GetCanvasContext();

        return GPU{
            ._hGPU = hGPU,
            ._hDevice = hDevice,
            ._hCanvasContext = hCanvasContext,
            ._hQueue = !hDevice->Queue(&scope),
            ._hCurrentTexture = PersistentHandle<IGPUTexture>::Allocate(),
            ._hCurrentTextureView = PersistentHandle<IGPUTextureView>::Allocate(),
        };
    }

    void Configure(GPUTextureFormat format = GPUTextureFormat::BGRA8UNorm) {
        this->_hCanvasContext->Configure({
            .device = this->_hDevice,
            .format = format,
            .usage = GPUTextureUsageFlags::RENDER_ATTACHMENT,
            .alphaMode = GPUCanvasAlphaMode::Opaque,
            });
    }

    Texture<void> GetCurrentTexture() {
        Scope scope{ 2 };

        auto hCurrentTexture = this->_hCanvasContext->GetCurrentTexture(&scope);
        auto hCurrentTextureView= hCurrentTexture->CreateView(&scope);

        this->_hCurrentTexture.Set(hCurrentTexture);
        this->_hCurrentTextureView.Set(hCurrentTextureView);

        return {
            ._hTexture = this->_hCurrentTexture,
            ._hView = this->_hCurrentTextureView,
        };
    }

    Sampler CreateSampler(GPUSamplerDescriptor&& desc) const {
        Scope scope{ 1 };

        auto hSampler = !this->_hDevice->CreateSampler(&desc, &scope);

        return Sampler {
            ._hSampler = hSampler  
        };
    }

    Sampler CreateSampler(GPUFilterMode filter = GPUFilterMode::Linear, GPUAddressMode addressMode = GPUAddressMode::Clamp_To_Edge) const {
        Scope scope{ 1 };

        auto hSampler = !this->_hDevice->CreateSampler(GPUSamplerDescriptor{
            .addressModeU = addressMode,
            .addressModeV = addressMode,
            .addressModeW = addressMode,
            .magFilter = filter,
            .minFilter = filter
            }, &scope);

        return Sampler {
            ._hSampler = hSampler  
        };
    }

    template<typename T>
    Texture<T> CreateTexture(GPUTextureFormat format, GPUTextureViewDimension dimension, vec2<u32> size, u32 depth) const {
        Scope scope{ 2 };

        auto hTexture = !this->_hDevice->CreateTexture(GPUTextureDescriptor{
            .size = {.width = size.x, .height = size.y, .depthOrArrayLayers = depth },
            .format = format,
            .usage = GPUTextureUsageFlags::TEXTURE_BINDING | GPUTextureUsageFlags::COPY_DST
            }, &scope);

        return Texture<T> {
            ._hTexture = hTexture,
            ._hView = !hTexture->CreateView(GPUTextureViewDescriptor{
                .dimension = dimension
                },&scope),
            .format = format,
            .size = size,
            .depth = depth
        };
    }

    template<typename T>
    Texture<T> CreateTexture(vec2<u32> size, u32 depth = 1) const {
        return CreateTexture<T>(
            GPUTextureFormat::RGBA8UNorm,
            depth == 1 ? GPUTextureViewDimension::_2d : GPUTextureViewDimension::_2d_Array,
            size,
            depth);
    }

    template<typename T>
    GPUBuffer<T> CreateBuffer(u32 length, GPUBufferUsageFlags usage) const {
        Scope scope{ 1 };

        auto hBuffer = !this->_hDevice->CreateBuffer(GPUBufferDescriptor{
            .size = length * sizeof(T),
            .usage = usage
            }, &scope);

        return GPUBuffer<T>{ hBuffer, length };
    }

    ShaderModule CreateShaderModule(char const* pCode) const {
        Scope scope{ 1 };

        auto hShaderModule = !this->_hDevice->CreateShaderModule(GPUShaderModuleDescriptor{
            .pCode = pCode
            }, &scope);

        return {
            ._hShaderModule = hShaderModule
        };
    }

    template<typename... Tn>
    BindGroupLayout CreateBindGroupLayout(Signature<Tn...>&&, Tn... entries) const {
        Scope scope{1};

        auto transformedEntries = CreatePack(entries...).TransformIndiced(meta::overloads{
            [](SamplerBinding binding, u32 index) {
                return GPUBindGroupLayoutEntry{
                    .binding = index,
                    .visibility = binding.visibility,
                    .sampler = GPUSamplerBindingLayout{
                        .type = binding.sampleType
                    }
                };
            },
            [](TextureBinding binding, u32 index) {
                return GPUBindGroupLayoutEntry{
                    .binding = index,
                    .visibility = binding.visibility,
                    .texture = GPUTextureBindingLayout{
                        .sampleType = binding.sampleType,
                        .viewDimension = binding.viewDimension
                    }
                };
            },
            [](BufferBinding binding, u32 index) {
                return GPUBindGroupLayoutEntry{
                    .binding = index,
                    .visibility = binding.visibility,
                    .buffer = GPUBufferBindingLayout{
                        .type = binding.type
                    }
                };
            }
        });

        auto hBindGroupLayout = !this->_hDevice->CreateBindGroupLayout(
            GPUBindGroupLayoutDescriptor{ .entries = transformedEntries.template ToArray<GPUBindGroupLayoutEntry, Scope>(&scope) },
        & scope);

        return {
            ._hLayout = hBindGroupLayout
        };
    };

    template<typename... Tn>
    BindGroup CreateBindGroup(BindGroupLayout const* pBindGroupLayout, Signature<Tn...>&&, Tn const*... pBindings) {
        Scope scope{1};

        auto transformedEntries = CreatePack(pBindings...).TransformIndiced(meta::overloads{
            [](Sampler const* pSampler, u32 index) {
                return GPUBindGroupEntry{
                    .binding = index,
                    .resource = (Handle<IGPUSampler>)pSampler->_hSampler
                };
            },
            []<typename E>(Texture<E> const* pTexture, u32 index) {
                return GPUBindGroupEntry{
                    .binding = index,
                    .resource = (Handle<IGPUTextureView>)pTexture->_hView
                };
            },
            []<typename E>(GPUBuffer<E> const* pBuffer, u32 index) {
                return GPUBindGroupEntry{
                    .binding = index,
                    .resource = GPUBufferBinding {
                        .buffer = pBuffer->_hBuffer
                    }
                };
            },
        });

        auto hBindGroup = !this->_hDevice->CreateBindGroup(
            GPUBindGroupDescriptor{
                .layout = pBindGroupLayout->_hLayout,
                .entries = transformedEntries.template ToArray<GPUBindGroupEntry, Scope>(&scope)
            },
        & scope);

        return {
            ._hBindGroup = hBindGroup
        };
    }

    template<typename... TLayouts>
    RenderPipelineLayout CreateRenderPipelineLayout(TLayouts... bindGroupLayouts) const {
        Scope scope{ 1 };

        auto _bindGroupLayouts = Array<Handle<IGPUBindGroupLayout>, Scope>::From({ bindGroupLayouts._hLayout..., }, &scope);

        auto hPipelineLayout = !this->_hDevice->CreatePipelineLayout(GPUPipelineLayoutDescriptor{
            .bindGroupLayouts =  _bindGroupLayouts
        }, &scope);

        return {
            ._hPipelineLayout = hPipelineLayout
        };
    }

    RenderPipeline CreateRenderPipeline(
        RenderPipelineLayout* pRenderPipelineLayout,
        GPUPrimitiveState&& primitiveState,
        GPUVertexState&& vertexState,
        GPUFragmentState&& fragmentState) const  {

        Scope scope{ 1 };

        auto hRenderPipeline = !this->_hDevice->CreateRenderPipeline(
            GPURenderPipelineDescriptor{
                .layout = { *pRenderPipelineLayout },
                .vertex = vertexState,
                .primitive = primitiveState,
                .fragment = fragmentState
            }, & scope);

        return {
            ._hRenderPipeline = hRenderPipeline
        };
    }

    CommandEncoder CreateCommandEncoder(Scope* pScope) {
        return {
            ._commandEncoder = this->_hDevice->CreateCommandEncoder(pScope),
            ._pScope = pScope
        };
    }

    template<typename T>
    void WriteTexture(Texture<T> const* pTexture, Array<T, Borrow> const* pData, u32 destLayer = 0) const {
         this->_hQueue->WriteTexture(WriteTextureParamStruct{
            .destination = GPUImageCopyTexture{
                .texture = pTexture->_hTexture,
                .origin = {.z = destLayer}
            },
            .data = pData->AsRawMemory(),
            .dataLayout = GPUImageDataLayout{
                .bytesPerRow = pTexture->size.x * sizeof(T),
                .rowsPerImage = pTexture->size.y
            },
            .size = GPUExtent3DDict{
                .width = pTexture->size.x,
                .height = pTexture->size.y
            }
        });
    }

    void WriteTexture(Texture<rgba<u8>> const* pTexture, Image<Borrow> const* pData, u32 destLayer = 0) const {
         this->_hQueue->WriteTexture(WriteTextureParamStruct{
            .destination = GPUImageCopyTexture{
                .texture = pTexture->_hTexture,
                .origin = {.z = destLayer}
            },
            .data = pData->AsRawMemory(),
            .dataLayout = GPUImageDataLayout{
                .bytesPerRow = pData->size.x * sizeof(rgba<u8>),
                .rowsPerImage = pData->size.y
            },
            .size = GPUExtent3DDict{
                .width = pData->size.x,
                .height = pData->size.y
            }
        });
    }
    
    template<typename T>
    void WriteBuffer(GPUBuffer<T> const* pBuffer, T* pData, u32 offset = 0) const {
        this->_hQueue->WriteBuffer(WriteBufferParamStruct{
            .buffer = pBuffer->_hBuffer,
            .bufferOffset = 0,
            .data = Array<u8, Borrow>{ sizeof(T), (u8*)pData },
            .dataOffset = offset * sizeof(T),
            .size = sizeof(T)
            });
    }

    template<typename T>
    void WriteBuffer(GPUBuffer<T> const* pBuffer, Array<T, Borrow> data, u32 offset = 0) const {
        auto const asRawMemory = data.AsRawMemory();

        this->_hQueue->WriteBuffer(WriteBufferParamStruct{
            .buffer = pBuffer->_hBuffer,
            .bufferOffset = 0,
            .data = asRawMemory,
            .dataOffset = offset * sizeof(T),
            .size = asRawMemory.length
            });
    }

    void Submit(CommandEncoder const* pCommandEncoder) const {
        Scope scope{ 1 };

        this->_hQueue->Submit(scope[{
            ~pCommandEncoder->_commandEncoder->Finish(&scope)
        }]);
    }
};
 