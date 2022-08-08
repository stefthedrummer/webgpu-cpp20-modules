import { Val } from "./interop";
import { Type, Kind } from "./type";

export class VoidType extends Type<void> {

    constructor() {
        super({
            sizeOf: 0,
            alignOf: 0,
            kind: Kind.Void,
            cppName: `void`,
            cppInteropName: null,
            tsName: `void`,
            isOptionalAllowed: false,
            isConst: true
        });
    }

    cpp2js(val: Val): string { throw new Error("Unsupported"); }
    js2cpp(ptr: Val, val: string): string { throw new Error("Unsupported"); }
}