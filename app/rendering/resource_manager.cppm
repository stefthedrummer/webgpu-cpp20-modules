
export module rendering.resource_manager;
import api;
import core;

export struct Vertex {
    vec2<f32> pos;
    f32 __padding0{};
    f32 w{1.0f};
    vec2<f32> uv;
    f32 __padding2{};
    f32 __padding3{};

    Vertex(vec2<f32> pos, vec2<f32> uv) : pos{pos}, uv{uv} {} 
};

export struct ResourceManager {

    Array<PersistentHandle<GPUTexture>, Heap> hTextures{ 0, nullptr };
    
    template<typename TVertex>
    PersistentHandle<GPUBuffer> CreateVertexBuffer(Array<TVertex> vertices, Handle<GPUDevice> hDevice) {
        Scope scope{ 4 };

        auto hVertexBuffer = !hDevice->CreateBuffer(GPUBufferDescriptor{
            .size = vertices.length() * sizeof(TVertex),
            .usage = GPUBufferUsageFlags::VERTEX | GPUBufferUsageFlags::COPY_DST
            }, &scope);

        hDevice->Queue(&scope)->WriteBuffer(WriteBufferParamStruct{
            .buffer = hVertexBuffer,
            .bufferOffset = 0,
            .data = Array<u8>{ vertices.length() * sizeof(TVertex), (u8*)vertices.mem.pElements},
            .dataOffset = 0,
            .size = vertices.length() * sizeof(Vertex)
            });

        return hVertexBuffer;
    }

    void CreateAtlas(Atlas* pAtlas, Image<Borrow>* pAtlasImg, Handle<GPUDevice> hDevice) {
        Scope scope{ 32 };

        auto hQueue{ hDevice->Queue(&scope) };
        Array<PersistentHandle<GPUTexture>, Heap> hTextures{ pAtlas->textures.length() };

        for (u32 iTexture = 0; iTexture < pAtlas->textures.length(); iTexture++) {
            auto pTexture = &pAtlas->textures[iTexture];

            u32 numLayers = 0;
            for (u32 iSheet = 0; iSheet < pTexture->spriteSheets.length(); iSheet++) {
                auto pSheet = &pTexture->spriteSheets[iSheet];
                numLayers += pSheet->sprites.length();
            }

            auto hTexture = !hDevice->CreateTexture(GPUTextureDescriptor{
                .size = {.width = pTexture->width, .height = pTexture->height, .depthOrArrayLayers = numLayers },
                .format = GPUTextureFormat::RGBA8UNorm,
                .usage = GPUTextureUsageFlags::TEXTURE_BINDING | GPUTextureUsageFlags::COPY_DST
                }, &scope);

            Format::Log("[Atlas:CreateTexture]", "width=", pTexture->width, "height=", pTexture->height);

            hTextures[iTexture] = hTexture;

            for (u32 iSheet = 0; iSheet < pTexture->spriteSheets.length(); iSheet++) {
                auto pSheet = &pTexture->spriteSheets[iSheet];

                for (u32 iSprite = 0; iSprite < pSheet->sprites.length(); iSprite++) {
                    auto pSprite = &pSheet->sprites[iSprite];

                    Image<Heap> spriteImg = pAtlasImg->CreateSubImage(
                        pSprite->x, pSprite->y, pTexture->width, pSprite->height, true);

                    hQueue->WriteTexture(WriteTextureParamStruct{
                        .destination = GPUImageCopyTexture{
                            .texture = hTexture,
                            .origin = {.z = pSheet->spriteIndexOffset + iSprite}
                        },
                        .data = Array<u8>{
                            spriteImg.width * spriteImg.height * (u32)sizeof(Texel),
                            (u8*)spriteImg.mem.pElements,
                        },
                        .dataLayout = GPUImageDataLayout{
                            .bytesPerRow = spriteImg.width * (u32)sizeof(Texel),
                            .rowsPerImage = spriteImg.height
                        },
                        .size = GPUExtent3DDict{
                            .width = spriteImg.width,
                            .height = spriteImg.height
                        }
                        });
                }
            }
        }

        this->hTextures = move(hTextures);
    }
};