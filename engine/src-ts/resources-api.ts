import { Engine } from "./engine";
import { cpp_decode_optional, cpp_decode_Array, cpp_decode_String, cpp_decode_Record, cpp_decode_BufferSource, size_t, cpp_encode_Array_Borrow, cpp_encode_Array_Heap } from "./bindgen-api";
export enum ResourceType {
	Text = 1,
	Image = 2,
	Json = 3,
};
export type ResourceDescriptor = {
	ptr: number;
	type: ResourceType;
	url: string;
	jsonType: string;
	pData: number;
	dataLength: number;
	width: number;
	height: number;
};
export const cpp_sizeof_ResourceDescriptor = 28;
export function cpp_decode_ResourceDescriptor(ptr: number): ResourceDescriptor {
	return {
		ptr: ptr,
		type: Engine.mem_u32[(ptr + 0) >> 2],
		url: cpp_decode_String(Engine.mem_u32[(ptr + 4) >> 2]),
		jsonType: cpp_decode_String(Engine.mem_u32[(ptr + 8) >> 2]),
		pData: Engine.mem_u32[(ptr + 12) >> 2],
		dataLength: Engine.mem_u32[(ptr + 16) >> 2],
		width: Engine.mem_u32[(ptr + 20) >> 2],
		height: Engine.mem_u32[(ptr + 24) >> 2],
	};
};
export function cpp_encode_ResourceDescriptor(ptr: number, val: ResourceDescriptor): void {
		Engine.mem_u32[(ptr + 0) >> 2] = val.type;
		// url const;
		// jsonType const;
		Engine.mem_u32[(ptr + 12) >> 2] = val.pData;
		Engine.mem_u32[(ptr + 16) >> 2] = val.dataLength;
		Engine.mem_u32[(ptr + 20) >> 2] = val.width;
		Engine.mem_u32[(ptr + 24) >> 2] = val.height;
};
export const cpp_module_api_resources = [
];