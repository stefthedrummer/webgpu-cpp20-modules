import { Engine } from "./engine";
import { cpp_decode_optional, cpp_decode_Array, cpp_decode_String, cpp_decode_Record, cpp_decode_BufferSource, size_t, cpp_encode_Array_Borrow, cpp_encode_Array_Heap } from "./bindgen-api";
export enum UIEventType {
	CanvasResize = 1,
};
export type UIEvent = {
	type: UIEventType;
	x: number;
	y: number;
};
export const cpp_sizeof_UIEvent = 12;
export function cpp_decode_UIEvent(ptr: number): UIEvent {
	return {
		type: Engine.mem_u32[(ptr + 0) >> 2],
		x: Engine.mem_u32[(ptr + 4) >> 2],
		y: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export function cpp_encode_UIEvent(ptr: number, val: UIEvent): void {
		Engine.mem_u32[(ptr + 0) >> 2] = val.type;
		Engine.mem_u32[(ptr + 4) >> 2] = val.x;
		Engine.mem_u32[(ptr + 8) >> 2] = val.y;
};
export const cpp_module_api_ui_events = [
];