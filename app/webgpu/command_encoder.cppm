
export module webgpu.command_encoder;
import core;
import api;
import webgpu.render_pipeline;
import webgpu.bind_group;
import webgpu.buffer;

export struct RenderPassEncoder {
    LocalHandle<IGPURenderPassEncoder> _renderPassEncoder;

    inline void SetPipeline(RenderPipeline const* pRenderPipeline) const {
        this->_renderPassEncoder->SetPipeline(pRenderPipeline->_hRenderPipeline);
    }

    inline void SetBindGroup(u32 index, BindGroup const* pBindGroup) const {
        this->_renderPassEncoder->SetBindGroup(index, pBindGroup->_hBindGroup);
    }

    template<typename T>
    inline void SetVertexBuffer(u32 index, GPUBuffer<T> const* pBuffer, u32 offset, u32 size) const {
        this->_renderPassEncoder->SetVertexBuffer(index, pBuffer->_hBuffer, offset, size);
    }

    template<typename T>
    inline void SetVertexBuffer(u32 index, GPUBuffer<T> const* pBuffer) const {
        this->_renderPassEncoder->SetVertexBuffer(index, pBuffer->_hBuffer, 0, pBuffer->length * sizeof(T));
    }

    inline void Draw(u32 vertexCount, u32 instanceCount = 1, u32 firstVertex = 0, u32 firstInstance = 0) const {
        this->_renderPassEncoder->Draw(vertexCount, instanceCount, firstVertex, firstInstance);
    }

    inline void End() const {
        this->_renderPassEncoder->End();
    }
};

export struct CommandEncoder {
    LocalHandle<IGPUCommandEncoder> _commandEncoder;
    Scope* _pScope;

    inline RenderPassEncoder BeginRenderPass(Array<GPURenderPassColorAttachment, Borrow>&& attachments) const {
        return {
            ._renderPassEncoder = _commandEncoder->BeginRenderPass(GPURenderPassDescriptor{
                .colorAttachments = attachments
            }, this->_pScope)
        };
    }
};