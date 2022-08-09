import { Formatter } from "../formatter";
import { Val } from "./interop";
import { Type, Kind } from "./type";

export class EnumFlagsType<T extends number> extends Type<T> {

    constructor(name: string, private readonly formatter: Formatter, private values: Record<string, number>) {
        super({
            sizeOf: 4,
            alignOf: 4,
            kind: Kind.ValueType,
            cppName: name,
            cppInteropName: "u32",
            tsName: name,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    generateCpp(srcCpp: string[]): void {
        srcCpp.push(`enum class ${this.cppName}: u32 {`);
        for (const key in this.values) {
            const val = this.values[key];
            srcCpp.push(`\t${this.formatter.apply(key)} = ${val},`);
        }
        srcCpp.push(`};`);

        srcCpp.push(`inline constexpr ${this.cppName} operator |(${this.cppName} l, ${this.cppName} r) { return (${this.cppName})((u32)l | (u32)r); }`);
    }

    cpp2js(val: Val): string {
        return val.u32;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.u32} = ${val}`;
    }

    generateDefaultValExpr(val: number): string { return `0x${val.toString(16).toUpperCase()}`; }
}