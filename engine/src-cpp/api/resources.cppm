export module api.resources;
import core.wasm;
import core.types;
import core.buffer;
import api.bindgen;
#define wasm_import(name) __attribute__((import_name(name)))
export {
enum class ResourceType: u32 {
	Text = 1,
	Image = 2,
	Json = 3,
};
struct ResourceDescriptor {
	ResourceType type;
	char const* pUrl;
	char const* pJsonType;
	u8* pData;
	u32 dataLength;
	u32 width;
	u32 height;
};
}