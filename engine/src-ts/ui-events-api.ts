import { Engine } from "./engine";
import { cpp_decode_optional, cpp_decode_Array, cpp_decode_String, cpp_decode_Record, cpp_decode_BufferSource, size_t, cpp_encode_Array_Borrow, cpp_encode_Array_Heap, cpp_enum_literals, cpp_enum_define_literals } from "./bindgen-api";
export enum UIEventType {
	CanvasResize = 1,
	MouseMove = 2,
	MouseDown = 3,
	MouseUp = 4,
	MouseWheel = 5,
};
export type UIEvent = {
	type: UIEventType;
	x: number;
	y: number;
	button: number;
};
export const cpp_sizeof_UIEvent = 16;
export function cpp_decode_UIEvent(ptr: number): UIEvent {
	return {
		type: Engine.mem_u32[(ptr + 0) >> 2],
		x: Engine.mem_u32[(ptr + 4) >> 2],
		y: Engine.mem_u32[(ptr + 8) >> 2],
		button: Engine.mem_u32[(ptr + 12) >> 2],
	};
};
export function cpp_encode_UIEvent(ptr: number, val: UIEvent): void {
		Engine.mem_u32[(ptr + 0) >> 2] = val.type;
		Engine.mem_u32[(ptr + 4) >> 2] = val.x;
		Engine.mem_u32[(ptr + 8) >> 2] = val.y;
		Engine.mem_u32[(ptr + 12) >> 2] = val.button;
};
export const cpp_module_api_ui_events = [
];