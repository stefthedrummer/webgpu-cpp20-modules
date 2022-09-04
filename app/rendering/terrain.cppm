
export module rendering.terrain;
import core;
import webgpu.texture;

export struct TerrainResources {
    static constexpr u32 c_noiseTextureSize = 32;

    Texture<u8> terrainTexture;
    Texture<vec2<snorm8>> terrainNoiseTexture;
};

export struct TerrainProps {
    vec2<f32> invTerrainTexSize;
    vec2<f32> invTerrainNoiseTexSize;

    void Update(TerrainResources* pResources) {
        this->invTerrainTexSize = vec2<f32>{1.0f, 1.0f} / pResources->terrainTexture.size;
        this->invTerrainNoiseTexSize = vec2<f32>{1.0f, 1.0f} / pResources->terrainNoiseTexture.size;
    }
};
