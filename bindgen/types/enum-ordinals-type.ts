import { Formatter } from "../formatter";
import { Val } from "./interop";
import { Type, Kind, TypeFlags } from "./type";

export class EnumOrdinalsType<T> extends Type<T> {

    flags: TypeFlags = 0;

    constructor(
        name: string,
        private readonly formatter: Formatter,
        private readonly values: Record<number, string>) {

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

    generateTs(srcTs: string[]): void {
        if ((this.flags & TypeFlags.GenerateTypescriptInterface) != 0) {
            srcTs.push(`export enum ${this.cppName} {`);
            for (const key in this.values) {
                const val = this.values[key];
                if (typeof val === "number") {
                    srcTs.push(`\t${this.formatter.apply(key)} = ${val},`);
                }
            }
            srcTs.push(`};`);
        }
    }

    generateCpp(srcCpp: string[]): void {
        srcCpp.push(`enum class ${this.cppName}: u32 {`);
        for (const key in this.values) {
            const val = this.values[key];
            if (typeof val === "number") {
                srcCpp.push(`\t${this.formatter.apply(key)} = ${val},`);
            }
        }
        srcCpp.push(`};`);
    }

    cpp2js(val: Val): string {
        return val.u32;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.u32} = ${val}`;
    }

    generateDefaultValExpr(val: T): string { return `${val}`; }

    config(config: {
        flags?: TypeFlags;
    }) {
        this.flags = this.flags | (config.flags || 0);
        return this;
    }
}