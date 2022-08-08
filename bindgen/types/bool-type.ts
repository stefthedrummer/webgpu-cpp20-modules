import { BindGen } from "../bindgen";
import { Val } from "./interop";
import { Type, Kind } from "./type";

export class BoolType extends Type<boolean> {

    constructor() {
        super({
            sizeOf: 1,
            alignOf: 1,
            kind: Kind.ValueType,
            cppName: `bool`,
            cppInteropName: "u32",
            tsName: `boolean`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return `(${val.u8} > 0)`;
    }
    js2cpp(ptr: Val, val: string): string { throw new Error("Unsupported"); }

    generateDefaultValExpr(val: boolean): string { return val ? "true" : "false"; }
}