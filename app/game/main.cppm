#define wasm_import(name) __attribute__((import_name(name)))
#define wasm_export(name) __attribute__((export_name(name)))
#pragma clang diagnostic ignored "-Wreorder-init-list"

export module game.main;
import api.bindgen;
import game.game;
import game.ui_event_handler;
import webgpu;
import rendering;

ResourceDescriptor res_shaders{ .type = ResourceType::Text, .pUrl = "assets/shaders.wgsl" };
ResourceDescriptor res_atlas{ .type = ResourceType::Image, .pUrl = "assets/sprite-atlas.png" };
ResourceDescriptor res_atlasJson{ .type = ResourceType::Json, .pJsonType = "Atlas", .pUrl = "assets/sprite-atlas.json" };
Texture<u8> terrainTexture;
Texture<vec2<snorm8>> noiseTexture;
u32 const noiseTexture_size = 32;
Game g_game{};

void Start();
void AppTick();

wasm_export("app_main") void AppMain() {/**/
    Scope scope{ 32 };

    Resources::LoadResources(scope[{
        &res_shaders,
            & res_atlas,
            & res_atlasJson
    }], &Start);
}

GPUBuffer<Vertex> vertexBuffer{};
GPUBuffer<Instance> instanceBuffer{};
GPUBuffer<Instance> hoverBuffer{};

auto instances = Array<Instance, Heap>(16*16);

void Start() { 
    Scope scope{};

    g_game.renderer.Setup((char const*)res_shaders.pData);

    Atlas* pAtlas = (Atlas*)res_atlasJson.pData;
    Image<Borrow> atlasImg = Image<Borrow>{&res_atlas};
    g_game.resourceManager.atlas <= g_game.resourceManager.CreateAtlas(&g_game.renderer.gpu, pAtlas, &atlasImg);
   
    auto vertices = scope[{
        Vertex{{0.0f, 0.0f}, {0.5f, 0.0f}},
        Vertex{{0.0f, 1.0f}, {0.0f, 0.25f}},
        Vertex{{1.0f, 0.0f}, {1.0f, 0.25f}},
        Vertex{{1.0f, 1.0f}, {0.5f, 0.5f}}
    }];

    for(i32 y = 0; y < 16; y++){
        for(i32 x = 0; x < 16; x++){
            instances[y*16+x] = Instance{ {(f32)x, (f32)y}, 37 + ((y*16+x))%4 };
        }
    }

    vertexBuffer = g_game.renderer.gpu.CreateBuffer<Vertex>(vertices.Length(), VertexBuffer);
    instanceBuffer = g_game.renderer.gpu.CreateBuffer<Instance>(instances.Length(), InstanceBuffer);
    hoverBuffer = g_game.renderer.gpu.CreateBuffer<Instance>(1, InstanceBuffer);

    g_game.renderer.gpu.WriteBuffer(&vertexBuffer, ~vertices);
    g_game.renderer.gpu.WriteBuffer(&instanceBuffer, ~instances);

    terrainTexture = g_game.renderer.gpu.CreateTexture<u8>(GPUTextureFormat::R8UInt, GPUTextureViewDimension::_2d, {16,16}, 1);
    noiseTexture = g_game.renderer.gpu.CreateTexture<vec2<snorm8>>(GPUTextureFormat::RG8SNorm, GPUTextureViewDimension::_2d, {16,16}, 1);

    auto terrainTextureData = scope.CreateArray<u8>(16*16);
    for(i32 y = 0; y < 16; y++){
        for(i32 x = 0; x < 16; x++){
            terrainTextureData[y*16+x] = 37 + (u8)(Perlin::Get_u8({(u8)x, (u8)y}) % 4); 
        }
    }
    g_game.renderer.gpu.WriteTexture(&terrainTexture, &terrainTextureData);

    auto noiseTextureData = scope.CreateArray<vec2<snorm8>>(noiseTexture_size * noiseTexture_size);
    for(u32 y = 0; y < noiseTexture_size; y++){
        for(u32 x = 0; x < noiseTexture_size; x++){
            noiseTextureData[y*noiseTexture_size+x] = Perlin::Get_vec2_u8({(u8)x,(u8)y}).Map<snorm8>( [](auto v){ return snorm8::From_i8(v); });
        }
    }

    g_game.renderer.gpu.WriteTexture(&noiseTexture, &noiseTextureData);

    AppTick();
}

void AppTick() {
    Scope scope{ 32 };

    g_game.uiEventHandler.PollUIEvents();
    g_game.renderer.camera.Update();
    g_game.renderer.WriteCamera();

    CommandEncoder commandEncoder = g_game.renderer.gpu.CreateCommandEncoder(&scope);

    BindGroup bindGroup = g_game.renderer.gpu.CreateBindGroup(&g_game.renderer.defaultBindGroupLayout, DefaultBindingSignature{},
        &g_game.renderer.linearSampler,
        &g_game.renderer.pointSampler,
        &g_game.resourceManager.atlas[1],
        &terrainTexture,
        &noiseTexture,
        &g_game.renderer.cameraBuffer);

    RenderPassEncoder cmd = commandEncoder.BeginRenderPass(scope[{
            GPURenderPassColorAttachment{
              .view = g_game.renderer.gpu.GetCurrentTexture(),
              .clearValue = {.r = 0.8f, .g = 0.8f, .b = 0.8f, .a = 1.0f},
              .loadOp = GPULoadOp::Clear,
              .storeOp = GPUStoreOp::Store,
            }
        }]);

    g_game.renderer.gpu.WriteBuffer(&hoverBuffer, ~scope[{
        Instance{(vec2<f32>)g_game.uiEventHandler.hoveredCell, 0}
    }]);

    cmd.SetBindGroup(0, &bindGroup);
    cmd.SetVertexBuffer(0, &vertexBuffer);
    {
        cmd.SetPipeline(&g_game.renderer.renderPipeline_Terrain);
        cmd.SetVertexBuffer(1, &instanceBuffer);
        cmd.Draw(4, instances.Length());
    }
    {
        cmd.SetPipeline(&g_game.renderer.renderPipeline_Highlight);
        cmd.SetVertexBuffer(1, &hoverBuffer);
        cmd.Draw(4, 1);
    }
    cmd.End();

    g_game.renderer.gpu.Submit(&commandEncoder);

    bindGroup.Release();

    Engine::RequestAnimationFrame(20, &AppTick);
}
