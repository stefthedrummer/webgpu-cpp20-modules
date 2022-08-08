import { ArrayType } from "./array-type";
import { size_t, Val } from "./interop";
import { Type, Kind } from "./type";

export class BufferSourceType extends Type<Uint8Array> {

    constructor() {
        super({
            sizeOf: ArrayType.sizeOf_header + size_t,
            alignOf: size_t,
            kind: Kind.ValueType,
            cppName: `Array<u8>`,
            cppInteropName: null,
            tsName: `BufferSource`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return `cpp_decode_BufferSource(${val.address.u32})`;
    }
    js2cpp(ptr: Val, val: string): string {
        return `cpp_encode_BufferSource(${ptr.address.u32}, ${val})`;
    }
}