import { Val } from "./interop";
import { Type, Kind } from "./type";

export class StringType extends Type<string> {

    constructor() {
        super({
            sizeOf: -1,
            alignOf: -1,
            kind: Kind.ValueType,
            cppName: `char`,
            cppInteropName: null,
            tsName: `string`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return `cpp_decode_String(${val.address.u32})`;
    }
    js2cpp(ptr: Val, val: string): string {
        return `missing`;
    }
}