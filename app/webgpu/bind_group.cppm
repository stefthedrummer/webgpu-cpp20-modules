
export module webgpu.bind_group;
import api;
import core;
import webgpu.sampler;
import webgpu.texture;
import webgpu.buffer;

export struct Binding {
    GPUShaderStageFlags visibility{GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT};
};

export struct SamplerBinding : Binding {
    GPUSamplerBindingType sampleType{GPUSamplerBindingType::Filtering};
};

export struct TextureBinding : Binding {
    GPUTextureSampleType sampleType{GPUTextureSampleType::Float};
	GPUTextureViewDimension viewDimension{GPUTextureViewDimension::_2d};
};

export struct BufferBinding : Binding {
    GPUBufferBindingType type{GPUBufferBindingType::Uniform};
};

export struct BindGroupLayout {
    PersistentHandle<IGPUBindGroupLayout> _hLayout;
};

export struct BindGroup {
    PersistentHandle<IGPUBindGroup> _hBindGroup;

    inline void Release() {
        _hBindGroup.Release();
    }
};
