
export module webgpu.texture;
import api;
import core;

export template<typename T>
struct Texture {
    PersistentHandle<IGPUTexture> _hTexture;
    PersistentHandle<IGPUTextureView> _hView;
    GPUTextureFormat format;
    vec2<u32> size;
    u32 depth;

    inline operator Handle<IGPUTexture>() { return _hTexture; }
    inline operator Handle<IGPUTextureView>() { return _hView; }
};