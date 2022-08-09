export module api.ui_events;
import core.types;
#define wasm_import(name) __attribute__((import_name(name)))
export  {
enum class UIEventType: u32 {
	CanvasResize = 1,
	MouseMove = 2,
	MouseDown = 3,
	MouseUp = 4,
	MouseWheel = 5,
};
struct UIEvent {
	UIEventType type;
	i32 x;
	i32 y;
	u32 button;
};
}