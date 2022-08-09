import { size_t, Val, HeapVal, ImmVal } from "./interop";
import { Type, Kind, Allocator } from "./type";
import { t_BoolType } from "./types";

export class ArrayType<T> extends Type<T[]> {

    static t_Memory_sizeof = 8;
    static t_Array_sizeof = 12;
    static t_Array_pElement = 8;

    constructor(
        public readonly elementType: Type<T>,
        public readonly allocator: Allocator) {

        super({
            sizeOf: ArrayType.t_Array_sizeof,
            alignOf: size_t,
            kind: Kind.ValueType,
            cppName: `Array<${elementType.cppName}${allocator ? `, ${allocator}` : ""}>`,
            cppInteropName: null,
            tsName: `${elementType.tsName}[]`,
            isOptionalAllowed: false,
            isConst: elementType.isConst
        });
    }

    cpp2js(val: Val): string {
        return `cpp_decode_Array(${val.address.u32}, ${this.elementType.sizeOf}, (e_ptr) => ${this.elementType.cpp2js(new HeapVal(new ImmVal("e_ptr")))})`;
    }

    js2cpp(ptr: Val, val: string): string {
        return `cpp_encode_Array_${this.allocator}(${ptr.address.u32}, ${val}, ${this.elementType.sizeOf}, (e_ptr, e_val) => ${this.elementType.js2cpp(new HeapVal(new ImmVal("e_ptr")), "e_val")})`;
    }

}