
export module rendering.resource_manager;
import api;
import core;
import webgpu;

export struct ResourceManager {

    Array<Texture<rgba<u8>>, Heap> atlas{ 0, nullptr };
    
    static Array<Texture<rgba<u8>>, Heap> CreateAtlas(GPU const* pGpu, Atlas* pAtlas, Image<Borrow>* pAtlasImg) {
        Scope scope{ 32 };

        auto hQueue{ pGpu->_hDevice->Queue(&scope) };
        Array<Texture<rgba<u8>>, Heap> textures{ pAtlas->textures.Length() };

        for (u32 iTexture = 0; iTexture < pAtlas->textures.Length(); iTexture++) {
            auto pTexture = &pAtlas->textures[iTexture];

            u32 numLayers = 0;
            for (u32 iSheet = 0; iSheet < pTexture->spriteSheets.Length(); iSheet++) {
                auto pSheet = &pTexture->spriteSheets[iSheet];
                numLayers += pSheet->sprites.Length();
            }

            auto texture = pGpu->CreateTexture<rgba<u8>>({pTexture->width, pTexture->height }, numLayers);
            Format::Log("[Atlas:CreateTexture]", "width=", pTexture->width, "height=", pTexture->height);

            textures[iTexture] = texture;

            for (u32 iSheet = 0; iSheet < pTexture->spriteSheets.Length(); iSheet++) {
                auto pSheet = &pTexture->spriteSheets[iSheet];

                for (u32 iSprite = 0; iSprite < pSheet->sprites.Length(); iSprite++) {
                    auto pSprite = &pSheet->sprites[iSprite];

                    Image<Heap> spriteImg = pAtlasImg->CreateSubImage(
                        pSprite->x, pSprite->y, pTexture->width, pSprite->height, true);

                    pGpu->WriteTexture(&texture, &spriteImg, pSheet->spriteIndexOffset + iSprite);
                }
            }
        }

        return textures;
    }
};