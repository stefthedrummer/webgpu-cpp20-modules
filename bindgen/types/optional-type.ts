import { Val, HeapVal, ImmVal } from "./interop";
import { Type, Kind } from "./type";

export class OptionalType<T> extends Type<T | undefined> {

    static sizeOf_header = 4;

    constructor(private readonly valType: Type<T>) {
        super({
            sizeOf: OptionalType.sizeOf_header + valType.sizeOf,
            alignOf: valType.alignOf,
            kind: Kind.ValueType,
            cppName: `Optional<${valType.cppName}>`,
            cppInteropName: null,
            tsName: `${valType.tsName} | undefined`,
            isOptionalAllowed: false,
            isConst: valType.isConst
        });
    }

    cpp2js(val: Val): string {
        return `cpp_decode_optional(${val.address.u32}, (e_ptr) => ${this.valType.cpp2js(new HeapVal(new ImmVal("e_ptr")))})`;
    }
    js2cpp(ptr: Val, val: string): string { throw new Error("Unsupported"); }
}