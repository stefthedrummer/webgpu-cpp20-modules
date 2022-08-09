
export module webgpu.render_pipeline;
import core;
import api;
import api.webgpu;
import webgpu.shader_module;

export struct RenderPipelineLayout {
    PersistentHandle<IGPUPipelineLayout> _hPipelineLayout{};

    inline operator Handle<IGPUPipelineLayout>() { return _hPipelineLayout; }
};

export struct RenderPipeline {
    PersistentHandle<IGPURenderPipeline> _hRenderPipeline;

    static constexpr GPUBlendState GPUBlendState_AlphaBlend = {
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
    };

    inline operator Handle<IGPURenderPipeline>() { return _hRenderPipeline; }
};