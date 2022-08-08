export module api.ui_events;
import core.types;
#define wasm_import(name) __attribute__((import_name(name)))
export {
enum class UIEventType: u32 {
	CanvasResize = 1,
};
struct UIEvent {
	UIEventType type;
	u32 x;
	u32 y;
};
}