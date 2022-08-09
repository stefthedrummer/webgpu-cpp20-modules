
export module webgpu.shader_module;
import api;
import core;


export struct Shader {
    PersistentHandle<IGPUShaderModule> _hShaderModule;
    char const* _pEntryPoint;
};

export struct ShaderModule {
    PersistentHandle<IGPUShaderModule> _hShaderModule;

    constexpr Shader operator[](char const* pEntryPoint) {
        return {
            ._hShaderModule = _hShaderModule,
            ._pEntryPoint = pEntryPoint
        };
    }

    inline operator Handle<IGPUShaderModule>() { return _hShaderModule; }
};