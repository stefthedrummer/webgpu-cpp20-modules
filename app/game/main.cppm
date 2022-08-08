#define wasm_import(name) __attribute__((import_name(name)))
#define wasm_export(name) __attribute__((export_name(name)))
#pragma clang diagnostic ignored "-Wreorder-init-list"

export module game.main;
import game.game;
import game.ui_event_handler;
import rendering;

ResourceDescriptor res_shaders{ .type = ResourceType::Text, .pUrl = "assets/shaders.wgsl" };
ResourceDescriptor res_test1{ .type = ResourceType::Image, .pUrl = "assets/test1.jpg" };
ResourceDescriptor res_atlas{ .type = ResourceType::Image, .pUrl = "assets/sprite-atlas.png" };
ResourceDescriptor res_atlasJson{ .type = ResourceType::Json, .pJsonType = "Atlas", .pUrl = "assets/sprite-atlas.json" };
Game g_game{};


void Start();
void AppTick();

wasm_export("app_main") void AppMain() {/**/
    Scope scope{ 32 };

    Resources::LoadResources(scope[{
        &res_shaders,
            & res_test1,
            & res_atlas,
            & res_atlasJson
    }], &Start);
}

 PersistentHandle<GPUBuffer> hVertexBuffer{};

void Start() {
    Scope scope{ 32 };
    auto hDevice = g_game.hDevice = Engine::GetDevice();
    auto hCanvasContext = g_game.hCanvasContext = Engine::GetCanvasContext();
    auto hQueue = hDevice->Queue(&scope);

    g_game.renderer.Setup(hDevice, hCanvasContext, (char const*)res_shaders.pData);

    Atlas* pAtlas = (Atlas*)res_atlasJson.pData;
    Image<Borrow> atlasImg = Images::FromResourceDescriptor(&res_atlas);
    g_game.resourceManager.CreateAtlas(pAtlas, &atlasImg, hDevice);
   
    auto vertices1 = scope[{
        Vertex{{-0.5f, -0.5f}, {0.0f, 0.0f}},
        Vertex{{-0.5f, +0.5f}, {0.0f, 1.0f}},
        Vertex{{+0.5f, -0.5f}, {1.0f, 0.0f}},
        Vertex{{+0.5f, +0.5f}, {1.0f, 1.0f}}
    }];

    hVertexBuffer = g_game.resourceManager.CreateVertexBuffer(~vertices1, hDevice);

    AppTick();
}

void AppTick() {
    Scope scope{ 32 };
    auto hDevice = g_game.hDevice = Engine::GetDevice();
    auto hCanvasContext = g_game.hCanvasContext = Engine::GetCanvasContext();
    auto hQueue = hDevice->Queue(&scope);

    g_game.uiEventHandler.PollUIEvents();

    g_game.renderer.UpdateCameraBuffer(hQueue);

    auto hCommandEncoder = hDevice->CreateCommandEncoder(&scope);
    auto hCurrentTextureView = hCanvasContext->GetCurrentTexture(&scope)->CreateView(&scope);

    auto hBindGroup = hDevice->CreateBindGroup(GPUBindGroupDescriptor{
        .layout = g_game.renderer.hBindGroupLayout0,
        .entries = Array<GPUBindGroupEntry, Scope>{{
            GPUBindGroupEntry{
                .binding = 0,
                .resource = ~g_game.renderer.hLinearSampler
            },
            GPUBindGroupEntry{
                .binding = 1,
                .resource = ~g_game.resourceManager.hTextures[0]->CreateView(GPUTextureViewDescriptor{.dimension = GPUTextureViewDimension::_2d_Array }, &scope)
            },
            GPUBindGroupEntry{
                .binding = 2,
                .resource = GPUBufferBinding{
                    .buffer = ~g_game.renderer.hCameraBuffer
                }
            }}, &scope}
        }, &scope);

    auto encoder = hCommandEncoder->BeginRenderPass(GPURenderPassDescriptor{
        .colorAttachments = scope[{
            GPURenderPassColorAttachment{
              .view = hCurrentTextureView,
              .clearValue = {.r = 0.8f, .g = 0.8f, .b = 0.8f, .a = 1.0f},
              .loadOp = GPULoadOp::Clear,
              .storeOp = GPUStoreOp::Store,
            }
        }]
        }, & scope);

    encoder->SetPipeline(g_game.renderer.hRenderPipeline0);
    encoder->SetBindGroup(0, hBindGroup);
    encoder->SetVertexBuffer(0, hVertexBuffer, 0, 4*sizeof(Vertex));
    encoder->Draw(4);
    encoder->End();

    hQueue->Submit(scope[{ ~hCommandEncoder->Finish(&scope)}]);


    Engine::RequestAnimationFrame(20, &AppTick);
}
