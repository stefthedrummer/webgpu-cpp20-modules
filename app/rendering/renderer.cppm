#pragma clang diagnostic ignored "-Wreorder-init-list"

export module rendering.renderer;
import api;
import core;
import webgpu;
import rendering.camera;

export using DefaultBindingLayoutSignature = Signature<
    SamplerBinding,
    SamplerBinding,
    TextureBinding,
    TextureBinding,
    TextureBinding,
    BufferBinding
>;
export using DefaultBindingSignature = Signature<
    Sampler,
    Sampler,
    Texture<rgba<u8>>,
    Texture<u8>,
    Texture<vec2<snorm8>>,
    GPUBuffer<Camera>
>;

export struct Vertex {
    vec2<f32> pos;
    vec2<f32> uv;
};

export struct Instance {
    vec2<f32> pos;
    i32 sprite;
    i32 __padding0;
};

export struct Renderer {

    Camera camera{};

    GPU gpu{};
    GPUBuffer<Camera> cameraBuffer{};
    Sampler linearSampler{};
    Sampler pointSampler{};

    BindGroupLayout defaultBindGroupLayout{};
    ShaderModule shaderModule{};
    RenderPipelineLayout defaultPipelineLayout{};
    RenderPipeline renderPipeline_Terrain{};
    RenderPipeline renderPipeline_Highlight{};

    void Setup(char const* pShaderSource) {
        Scope scope{ 32 };

        gpu = GPU::Create();
        gpu.Configure();

        this->cameraBuffer =  gpu.CreateBuffer<Camera>(1, UniformBuffer);
        this->linearSampler = gpu.CreateSampler(GPUFilterMode::Linear, GPUAddressMode::Repeat);
        this->pointSampler = gpu.CreateSampler(GPUFilterMode::Nearest);

        this->defaultBindGroupLayout = gpu.CreateBindGroupLayout(DefaultBindingLayoutSignature{},
            SamplerBinding  { .sampleType = GPUSamplerBindingType::Filtering },
            SamplerBinding  { .sampleType = GPUSamplerBindingType::Non_Filtering },
            TextureBinding  { .viewDimension = GPUTextureViewDimension::_2d_Array },
            TextureBinding  { .viewDimension = GPUTextureViewDimension::_2d, .sampleType = GPUTextureSampleType::Uint },
            TextureBinding  { .viewDimension = GPUTextureViewDimension::_2d, .sampleType = GPUTextureSampleType::Float },
            BufferBinding   { .type = GPUBufferBindingType::Uniform }
        );

        this->defaultPipelineLayout = gpu.CreateRenderPipelineLayout(this->defaultBindGroupLayout);
        this->shaderModule = gpu.CreateShaderModule(pShaderSource);

        this->renderPipeline_Terrain = this->CreateRenderPipeline(&this->defaultPipelineLayout, "vertex_default", "fragment_terrain", scope);
        this->renderPipeline_Highlight = this->CreateRenderPipeline(&this->defaultPipelineLayout, "vertex_default", "fragment_highlight", scope); 
    };

    RenderPipeline CreateRenderPipeline(
        RenderPipelineLayout* pPipelineLayout,
        char const* pVertexShader,
        char const* pFragmentShader,
        Scope& scope) {
        
        return gpu.CreateRenderPipeline(
            pPipelineLayout,
            {
                .topology = GPUPrimitiveTopology::Triangle_Strip,
                .frontFace = GPUFrontFace::Cw,
                .cullMode = GPUCullMode::Back
            },
            GPUVertexState {
                .module_ = this->shaderModule,
                .pEntryPoint = pVertexShader,
                .buffers = scope[{
                    GPUVertexBufferLayout{
                          .arrayStride = sizeof(Vertex),
                          .stepMode = GPUVertexStepMode::Vertex,
                          .attributes = scope[{
                                GPUVertexAttribute{ GPUVertexFormat::Float32x2, offsetOf(&Vertex::pos), 0 },
                                GPUVertexAttribute{ GPUVertexFormat::Float32x2, offsetOf(&Vertex::uv), 1 }
                          }]
                    },
                    GPUVertexBufferLayout{
                          .arrayStride = sizeof(Instance),
                          .stepMode = GPUVertexStepMode::Instance,
                          .attributes = scope[{
                                GPUVertexAttribute{ GPUVertexFormat::Float32x2, offsetOf(&Instance::pos), 4 },
                                GPUVertexAttribute{ GPUVertexFormat::Sint32, offsetOf(&Instance::sprite), 5 }
                          }]
                    }
                }]
            },
            GPUFragmentState{
                .module_ = this->shaderModule,
                .pEntryPoint = pFragmentShader,
                .targets = scope[{
                    GPUColorTargetState {
                        .format = GPUTextureFormat::BGRA8UNorm,
                        .blend = RenderPipeline::GPUBlendState_AlphaBlend
                    }
                }]
            });
    }

    inline void WriteCamera() {
        this->gpu.WriteBuffer(&cameraBuffer, &camera);
    }
};
