#pragma clang diagnostic ignored "-Wreorder-init-list"

export module rendering.renderer;
import api;
import core;
import rendering.camera;


export struct Renderer {

    Camera camera{};

    PersistentHandle<GPUBuffer> hCameraBuffer{};
    PersistentHandle<GPUSampler> hLinearSampler{};
    PersistentHandle<GPUBindGroupLayout> hBindGroupLayout0{};
    PersistentHandle<GPUPipelineLayout> hPipelineLayout{};
    PersistentHandle<GPUShaderModule> hShaderModule{};
    PersistentHandle<GPURenderPipeline> hRenderPipeline0{};

    void Setup(Handle<GPUDevice> hDevice, Handle<GPUCanvasContext> hCanvasContext, char const* pShaderSource) {
        Scope scope{ 32 };

        hCanvasContext->Configure({
            .device = hDevice,
            .format = GPUTextureFormat::BGRA8UNorm,
            .usage = GPUTextureUsageFlags::RENDER_ATTACHMENT,
            .alphaMode = GPUCanvasAlphaMode::Opaque,
            });

        this->hCameraBuffer = !hDevice->CreateBuffer(GPUBufferDescriptor{
            .size = sizeof(Camera),
            .usage = GPUBufferUsageFlags::UNIFORM | GPUBufferUsageFlags::COPY_DST
            }, &scope);

        this->hLinearSampler = !hDevice->CreateSampler(GPUSamplerDescriptor{
            .minFilter = GPUFilterMode::Linear,
            .magFilter = GPUFilterMode::Linear
            }, &scope);

        this->hBindGroupLayout0 = !hDevice->CreateBindGroupLayout(
            GPUBindGroupLayoutDescriptor{
            .entries = scope[{
                GPUBindGroupLayoutEntry{
                    .binding = 0,
                    .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
                    .sampler = GPUSamplerBindingLayout{}
                },
                GPUBindGroupLayoutEntry{
                    .binding = 1,
                    .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
                    .texture = GPUTextureBindingLayout{.viewDimension = GPUTextureViewDimension::_2d_Array }
                } ,
                GPUBindGroupLayoutEntry{
                    .binding = 2,
                    .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
                    .buffer = GPUBufferBindingLayout{
                        .type = GPUBufferBindingType::Uniform
                    }
                }
                }] }, & scope);

        this->hPipelineLayout = !hDevice->CreatePipelineLayout(GPUPipelineLayoutDescriptor{
            .bindGroupLayouts = scope[{
                ~this->hBindGroupLayout0
            }] }, & scope);

        this->hShaderModule = !hDevice->CreateShaderModule(GPUShaderModuleDescriptor{
            .pCode = pShaderSource
            }, &scope);

        this->hRenderPipeline0 = !hDevice->CreateRenderPipeline(GPURenderPipelineDescriptor{
            .layout = { hPipelineLayout },
            .vertex = {
                .module_ = hShaderModule,
                .pEntryPoint = "vertex_main",
                .buffers = scope[{
                    GPUVertexBufferLayout{
                        .arrayStride = 32,
                        .stepMode = GPUVertexStepMode::Vertex,
                        .attributes = scope[{
                            GPUVertexAttribute{
                                .shaderLocation = 0,
                                .offset = 0,
                                .format = GPUVertexFormat::Float32x4
                            },
                            GPUVertexAttribute{
                                .shaderLocation = 1,
                                .offset = 16,
                                .format = GPUVertexFormat::Float32x4
                            }
                        }]
                    }
                }]
            },
            .primitive = GPUPrimitiveState{
                .topology = GPUPrimitiveTopology::Triangle_Strip,
                .frontFace = GPUFrontFace::Cw,
                //.cullMode = GPUCullMode::Back
            },
            .fragment = GPUFragmentState{
                .module_ = hShaderModule,
                .pEntryPoint = "fragment_main",
                .targets = scope[{
                    GPUColorTargetState {
                        .format = GPUTextureFormat::BGRA8UNorm,
                        .blend = GPUBlendState{
                            .color = GPUBlendComponent{
                                .operation = GPUBlendOperation::Add,
                                .srcFactor = GPUBlendFactor::Src_Alpha,
                                .dstFactor = GPUBlendFactor::One_Minus_Src_Alpha
                            },
                            .alpha = GPUBlendComponent{
                                .operation = GPUBlendOperation::Add,
                                .srcFactor = GPUBlendFactor::One,
                                .dstFactor = GPUBlendFactor::Zero
                            }
                        }
                    }
                }]
            }
            }, & scope);
    };

    void UpdateCameraBuffer(Handle<GPUQueue> hQueue) {

        hQueue->WriteBuffer(WriteBufferParamStruct{
            .buffer = this->hCameraBuffer,
            .bufferOffset = 0,
            .data = Array<u8>{ sizeof(Camera), (u8*)&this->camera },
            .dataOffset = 0,
            .size = sizeof(Camera)
            });
    }
};
