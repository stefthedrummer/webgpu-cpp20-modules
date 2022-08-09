import { Engine } from "./engine";

export const size_t = 4;
const t_Memory_length = 0;
const t_Memory_pElements = 4;
const t_Optional_val = 4;

export class cpp_enum_literals<E> extends Array<E> {
    public readonly lookup: Map<string, number> = new Map();
}

export function cpp_enum_define_literals<E extends string>(...literals: E[]) {
    const lit = new cpp_enum_literals<E>();
    lit.push(...literals);
    for (let i = 0; i < literals.length; i++) {
        lit.lookup.set(literals[i], i);
    }
    return lit;
}

export function cpp_decode_optional<E>(ptr: number, decodeElement: (ptr: number) => E): (E | undefined) {
    const isPresent = Engine.mem_u8[(ptr)];
    const pElement = ptr + t_Optional_val;
    return (isPresent > 0) ? decodeElement(pElement) : undefined;
}

export function cpp_getArrayLength(ptr: number,): number {
    return Engine.mem_u32[(ptr + 4) >> 2];
}

export function cpp_decode_Array<E>(ptr: number, stride: number, decodeElement: (ptr: number) => E): E[] {
    const length = Engine.mem_u32[(ptr + t_Memory_length) >> 2];
    const pElements = Engine.mem_u32[(ptr + t_Memory_pElements) >> 2];

    const array: E[] = new Array(length);
    let elementPtr = pElements;
    for (let i = 0; i < length; i++) {
        array[i] = decodeElement(elementPtr);
        elementPtr += stride;
    }
    return array;
}

export function cpp_encode_Array_Heap<E>(ptr: number, val: E[], stride: number, decodeElement: (ptr: number, val: E) => void) {
    const pElements = Engine.wasmModuleExports.cpp_malloc(val.length * stride);

    Engine.mem_u32[(ptr + t_Memory_length) >> 2] = val.length;
    Engine.mem_u32[(ptr + t_Memory_pElements) >> 2] = pElements;

    for (let i = 0; i < val.length; i++) {
        decodeElement(pElements + i * stride, val[i]);
    }
}

export function cpp_encode_Array_Borrow<E>(ptr: number, val: E[], stride: number, decodeElement: (ptr: number, val: E) => void) {
    const maxLength = Engine.mem_u32[(ptr + t_Memory_length) >> 2];
    const pElements = Engine.mem_u32[(ptr + t_Memory_pElements) >> 2];

    if (val.length > maxLength) {
        throw new Error("Borrowed Array not large enough");
    }

    for (let i = 0; i < val.length; i++) {
        decodeElement(pElements + i * stride, val[i]);
    }
}


export function cpp_decode_BufferSource(ptr: number): Uint8Array {
    const length = Engine.mem_u32[(ptr + t_Memory_length) >> 2];
    const pData = Engine.mem_u32[(ptr + t_Memory_pElements) >> 2];

    return Engine.mem_u8.subarray(pData, pData + length);
}

export function cpp_decode_Record<V>(ptr: number, stride: number, parseVal: (ptr: number) => V): Record<string, V> {
    const length = Engine.mem_u32[(ptr + t_Memory_length) >> 2];
    const pEntries = Engine.mem_u32[(ptr + t_Memory_pElements) >> 2];

    const record: Record<string, V> = {};
    let entryPtr = pEntries;
    for (let i = 0; i < length; i++) {
        const key = cpp_decode_String(Engine.mem_u32[(entryPtr) >> 2]);
        const val = parseVal(entryPtr + size_t)
        record[key] = val;
        entryPtr += stride;
    }
    return record;
}

const g_charDecoder = new TextDecoder();
const g_charEncode = new TextEncoder();
export function cpp_decode_String(ptr: number) {
    if (ptr == 0) return null!;

    const mem_u8 = Engine.mem_u8;
    let pStringEnd = ptr;
    while (mem_u8[pStringEnd] != 0)
        pStringEnd++;

    const string = g_charDecoder.decode(mem_u8.subarray(ptr, pStringEnd));
    return string;
}
export function cpp_encode_String(text: string, pChars: number, maxSize: number) {
    const chars = g_charEncode.encode(text);
    if (chars.length > maxSize) throw new Error("Buffer Overflow");
    Engine.mem_u8.set(chars, pChars);
}

export function cpp_memcpy2pp(destOffset: number, src: Uint8Array | Uint8ClampedArray) {
    Engine.mem_u8.set(src, destOffset);
}