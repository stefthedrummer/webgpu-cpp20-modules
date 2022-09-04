
struct VertexOut {
    @builtin(position)
    vertPos : vec4<f32>,

    @location(0)
    vertUV : vec2<f32>,

    @location(1)
    worldPos : vec2<f32>,

    @location(2) @interpolate(flat)
    instanceSprite : i32
};



struct Camera {
    size: vec2<f32>,
    aspectRatio: f32,
    zoom: f32,
    pos: vec2<f32>,
    world2vp: vec2<f32>,
};

@group(0) @binding(0) var linearSpr: sampler;
@group(0) @binding(1) var pointSpr: sampler;
@group(0) @binding(2) var myTex: texture_2d_array<f32>;
@group(0) @binding(3) var terrainTex: texture_2d<u32>;
@group(0) @binding(4) var terrainNoiseTex: texture_2d<f32>;
@group(0) @binding(5) var<uniform> camera : Camera;

const c_terrainNoiseFactor : f32 = 0.15f;

@vertex
fn vertex_default(
    @location(0) vertPos         : vec2<f32>,
    @location(1) vertUV          : vec2<f32>,
    @location(4) instancePos     : vec2<f32>,
    @location(5) instanceSprite  : i32) -> VertexOut
{
    let pos         : vec2<f32>   = vertPos.xy + instancePos.xy - camera.pos;
    let isoPos      : vec2<f32>   = vec2<f32>(pos.x - pos.y, (pos.x + pos.y) * 0.5f);
    let worldPos    : vec2<f32>   = instancePos.xy + vertPos.xy;

    var v : VertexOut;
    v.vertPos          = vec4<f32>(isoPos * camera.world2vp, 0.0f, 1.0f );
    v.vertUV           = vertUV.xy;
    v.worldPos         = worldPos;
    v.instanceSprite   = instanceSprite;
    return v;
} 

@fragment
fn fragment_terrain(v: VertexOut) -> @location(0) vec4<f32>
{
    let terrainNoiseTexDim : vec2<i32> = textureDimensions(terrainNoiseTex, 0);

    var grad : vec2<f32> = textureSample(terrainNoiseTex, linearSpr, v.worldPos / 4.0f).xy;

    let terrainCoord : vec2<f32> = v.worldPos + grad * c_terrainNoiseFactor;
    let terrainXY : vec2<i32> = vec2<i32>(terrainCoord); 
    let terrainData : vec4<u32> = textureLoad(terrainTex, terrainXY, 0);
    var texel : vec4<f32> = textureSample(myTex, linearSpr, v.vertUV.xy, i32(terrainData.r));

    return texel;
}

@fragment
fn fragment_highlight(v: VertexOut) -> @location(0) vec4<f32>
{
    return vec4<f32>(0.0f, 0.5f, 0.0f, 0.5f);
} 