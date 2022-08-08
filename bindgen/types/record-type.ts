import { ArrayType } from "./array-type";
import { size_t, Val, HeapVal, ImmVal } from "./interop";
import { Type, Kind, Allocator } from "./type";

export class RecordType<V> extends Type<Record<string, V>> {

    constructor(
        public readonly valType: Type<V>,
        public readonly allocator: Allocator) {

        super({
            sizeOf: ArrayType.sizeOf_header + size_t,
            alignOf: size_t,
            kind: Kind.ValueType,
            cppName: `Array<RecordEntry<${valType.cppName}>${allocator ? `, ${allocator}` : ""}>`,
            cppInteropName: null,
            tsName: `Record<string, ${valType}>`,
            isOptionalAllowed: true,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return `cpp_decode_Record(${val.address.u32}, size_t + ${this.valType.sizeOf}, (e_ptr) => ${this.valType.cpp2js(new HeapVal(new ImmVal("e_ptr")))})`;
    }
    js2cpp(ptr: Val, val: string): string { throw new Error("Unsupported"); }
}