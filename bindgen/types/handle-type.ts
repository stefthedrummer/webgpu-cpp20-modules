import { Interface } from "./interface-type";
import { Val } from "./interop";
import { Type, Kind } from "./type";

export class HandleType<T> extends Type<T> {

    constructor(public readonly iface: Interface<T>, private readonly cppHandletype: string) {
        super({
            sizeOf: 4,
            alignOf: 4,
            kind: Kind.Handle,
            cppName: `${cppHandletype}<I${iface.name}>`,
            cppInteropName: "u32",
            tsName: iface.name,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cppCast2interop(val: string): string { return `${val}->handle`; }
    cpp2js(val: Val): string {
        return `Engine.externref_table.get(${val.u32}) as ${this.iface.handleType_any.tsName}`;
    }
    js2cpp(ptr: Val, val: string): string {
        return `missing`;
    }
}