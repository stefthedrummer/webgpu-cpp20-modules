import { Val } from "./interop";
import { Type, Kind } from "./type";


export class RawPointerType extends Type<number> {

    constructor() {
        super({
            sizeOf: 1,
            alignOf: 1,
            kind: Kind.ValueType,
            cppName: `u8*`,
            cppInteropName: "u32",
            tsName: `number`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return val.u32;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.u32} = ${val}`;
    }

    generateDefaultValExpr(val: number): string { return val.toString(); }
}