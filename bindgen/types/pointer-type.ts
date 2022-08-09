import { cppifyName } from "../formatter";
import { size_t, Val } from "./interop";
import { PointerAsRValueRefType } from "./pointer-as-rvaluereference-type";
import { Type, Kind } from "./type";

export class PointerType<T> extends Type<T> {

    constructor(
        public readonly valType: Type<T>,
        public readonly isConst: boolean) {

        super({
            sizeOf: size_t,
            alignOf: size_t,
            kind: Kind.ReferenceType,
            cppName: `${valType.cppName}${isConst ? " const" : ""}*`,
            cppInteropName: `${valType.cppName}${isConst ? " const" : ""}*`,
            tsName: valType.tsName,
            isOptionalAllowed: false,
            isConst: isConst
        });
    }

    cpp2js(val: Val): string {
        return this.valType.cpp2js(val.deref);
    }
    js2cpp(ptr: Val, val: string): string {
        return this.valType.js2cpp(ptr.deref, val);
    }

    cppArg(arg: string): string { return `p${cppifyName(arg)}`; }
    cppParam(param: string): string { return `${this.cppName} p${cppifyName(param)}`; }
    tryRValueRef(): Type<T> { return new PointerAsRValueRefType(this); }
}