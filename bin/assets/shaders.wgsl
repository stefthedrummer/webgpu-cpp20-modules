struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) color : vec4<f32>
};

struct Camera {
    size: vec2<f32>,
    aspectRatio: f32,
    zoom: f32,
    pos: vec2<f32>,
    world2vp: vec2<f32>,
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d_array<f32>;
@group(0) @binding(2) var<uniform> camera : Camera;

@stage(vertex)
fn vertex_main(
    @location(0) position : vec4<f32>,
    @location(1) color : vec4<f32>) -> VertexOut
{
    var pos : vec2<f32> = position.xy;
    var isoPos = vec2<f32>(pos.x - pos.y, pos.x + pos.y);

    var output : VertexOut;
    output.position = vec4<f32>(isoPos * camera.world2vp, 0.0f, 1.0f );
    output.color = color * 1.0f;
    return output;
} 

@stage(fragment)
fn fragment_main(fragData: VertexOut) -> @location(0) vec4<f32>
{
    var texel : vec4<f32> = textureSample(myTexture, mySampler, vec2<f32>(fragData.color.x, fragData.color.y), 6);
    return texel;
} 