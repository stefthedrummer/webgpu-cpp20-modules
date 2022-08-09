import { Engine } from "./engine";
import { cpp_decode_optional, cpp_decode_Array, cpp_decode_String, cpp_decode_Record, cpp_decode_BufferSource, size_t, cpp_encode_Array_Borrow, cpp_encode_Array_Heap, cpp_enum_literals, cpp_enum_define_literals } from "./bindgen-api";
export type AtlasSprite = {
	x: number;
	y: number;
	height: number;
};
export const cpp_sizeof_AtlasSprite = 12;
export function cpp_decode_AtlasSprite(ptr: number): AtlasSprite {
	return {
		x: Engine.mem_u32[(ptr + 0) >> 2],
		y: Engine.mem_u32[(ptr + 4) >> 2],
		height: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export function cpp_encode_AtlasSprite(ptr: number, val: AtlasSprite): void {
		Engine.mem_u32[(ptr + 0) >> 2] = val.x;
		Engine.mem_u32[(ptr + 4) >> 2] = val.y;
		Engine.mem_u32[(ptr + 8) >> 2] = val.height;
};
export type AtlasSheet = {
	spriteIndexOffset: number;
	sprites: AtlasSprite[];
};
export const cpp_sizeof_AtlasSheet = 16;
export function cpp_decode_AtlasSheet(ptr: number): AtlasSheet {
	return {
		spriteIndexOffset: Engine.mem_u32[(ptr + 0) >> 2],
		sprites: cpp_decode_Array(ptr + 4, 12, (e_ptr) => cpp_decode_AtlasSprite(e_ptr)),
	};
};
export function cpp_encode_AtlasSheet(ptr: number, val: AtlasSheet): void {
		Engine.mem_u32[(ptr + 0) >> 2] = val.spriteIndexOffset;
		cpp_encode_Array_Heap(ptr + 4, val.sprites, 12, (e_ptr, e_val) => cpp_encode_AtlasSprite(e_ptr, e_val));
};
export type AtlasTexture = {
	id: string;
	width: number;
	height: number;
	spriteSheets: AtlasSheet[];
};
export const cpp_sizeof_AtlasTexture = 24;
export function cpp_decode_AtlasTexture(ptr: number): AtlasTexture {
	return {
		id: cpp_decode_String(Engine.mem_u32[(ptr + 0) >> 2]),
		width: Engine.mem_u32[(ptr + 4) >> 2],
		height: Engine.mem_u32[(ptr + 8) >> 2],
		spriteSheets: cpp_decode_Array(ptr + 12, 16, (e_ptr) => cpp_decode_AtlasSheet(e_ptr)),
	};
};
export function cpp_encode_AtlasTexture(ptr: number, val: AtlasTexture): void {
		// id const;
		Engine.mem_u32[(ptr + 4) >> 2] = val.width;
		Engine.mem_u32[(ptr + 8) >> 2] = val.height;
		cpp_encode_Array_Heap(ptr + 12, val.spriteSheets, 16, (e_ptr, e_val) => cpp_encode_AtlasSheet(e_ptr, e_val));
};
export type Atlas = {
	textures: AtlasTexture[];
};
export const cpp_sizeof_Atlas = 12;
export function cpp_decode_Atlas(ptr: number): Atlas {
	return {
		textures: cpp_decode_Array(ptr + 0, 24, (e_ptr) => cpp_decode_AtlasTexture(e_ptr)),
	};
};
export function cpp_encode_Atlas(ptr: number, val: Atlas): void {
		cpp_encode_Array_Heap(ptr + 0, val.textures, 24, (e_ptr, e_val) => cpp_encode_AtlasTexture(e_ptr, e_val));
};
export const cpp_module_api_sprite_atlas = [
];