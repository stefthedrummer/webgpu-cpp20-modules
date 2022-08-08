import { size_t, Val } from "./interop";
import { PointerType } from "./pointer-type";
import { Type, Kind } from "./type";

export class PointerAsRValueRefType<T> extends Type<T> {

    constructor(
        public readonly poiterType: PointerType<T>) {

        super({
            sizeOf: size_t,
            alignOf: size_t,
            kind: Kind.ReferenceType,
            cppName: `${poiterType.cppName}&&`,
            cppInteropName: "u32",
            tsName: poiterType.tsName,
            isOptionalAllowed: false,
            isConst: true
        });
    }

    cppArg(arg: string): string { return `&${arg}`; }
    cpp2js(val: Val): string { throw new Error("Unsupported"); }
    js2cpp(ptr: Val, val: string): string { throw new Error("Unsupported"); }
    cppParam(param: string): string { return `${this.poiterType.valType.cppName}&& ${param}`; }
}