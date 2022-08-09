export module api.sprite_atlas;
import core.types;
import core.allocator;
import core.array;
#define wasm_import(name) __attribute__((import_name(name)))
export  {
struct AtlasSprite {
	u32 x;
	u32 y;
	u32 height;
};
struct AtlasSheet {
	u32 spriteIndexOffset;
	Array<AtlasSprite, Heap> sprites;
};
struct AtlasTexture {
	char const* pId;
	u32 width;
	u32 height;
	Array<AtlasSheet, Heap> spriteSheets;
};
struct Atlas {
	Array<AtlasTexture, Heap> textures;
};
}