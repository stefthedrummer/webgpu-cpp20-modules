import { Formatter } from "../formatter";
import { Val } from "./interop";
import { Type, Kind } from "./type";

export class EnumLiteralsType<T extends string> extends Type<T> {

    constructor(name: string, private readonly formatter: Formatter, private values: string[]) {
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
        srcCpp.push(`enum class ${this.cppName} {`);
        for (let i = 0; i < this.values.length; i++) {
            srcCpp.push(`\t${this.formatter.apply(this.values[i])} = ${i + 1},`);
        }
        srcCpp.push(`};`);
    }

    generateTs(srcTs: string[]): void {
        srcTs.push(`const cpp_enum_${this.tsName} = cpp_enum_define_literals<${this.tsName}>(`);
        srcTs.push(`\tundefined!, ${this.values.map(e => `"${e}"`).join(", ")}`);
        srcTs.push(`);`);
    }

    generateDefaultValExpr(val: T): string {
        return `${this.cppName}::${this.formatter.apply(val)}`;
    }

    cpp2js(val: Val): string {
        return `cpp_enum_${this.tsName}[${val.u32}]`;
    }
    js2cpp(ptr: Val, val: string): string {
        return ptr.set_u32(`cpp_enum_${this.tsName}.lookup.get(${val}) || 0`);
    }
};