
export module webgpu.sampler;
import api;
import core;

export struct Sampler {
    PersistentHandle<IGPUSampler> _hSampler;
};
