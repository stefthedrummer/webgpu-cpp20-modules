import { Val, HeapVal, ImmVal } from "./interop";
import { Type, Kind } from "./type";
import { t_U32Type } from "./types";

export class UnionType<T> extends Type<T> {

    constructor(
        public readonly name: string,
        public readonly unionTypes: Type<T>[]) {

        super({
            sizeOf: 4 + unionTypes.map(e => e.sizeOf).reduce((a, b) => Math.max(a, b), 0),
            alignOf: Math.max(4, unionTypes.map(e => e.alignOf).reduce((a, b) => Math.max(a, b), 0)),
            kind: Kind.ValueType,
            cppName: name,
            cppInteropName: null,
            tsName: unionTypes.map(e => e.tsName).join(" | "),
            isOptionalAllowed: false,
            isConst: true
        });
    }

    cpp2js(val: Val): string {
        return `cpp_parse_${this.name}(${val.address.u32})`;
    }
    js2cpp(ptr: Val, val: string): string {
        throw new Error("Method not implemented.");
    }

    generateFieldName(type: Type<any>) {
        return type.cppName.replace(/[<>]/g, "_").toLowerCase();
    }

    generateTs(srcTs: string[]): void {
        srcTs.push(`export function cpp_parse_${this.name}(ptr: number): ${this.tsName} {`);
        srcTs.push(`\tconst tag = ${t_U32Type.cpp2js(new HeapVal(new ImmVal("ptr + 0")))};`);
        srcTs.push(`\tswitch(tag) {`);

        for (let i = 0; i < this.unionTypes.length; i++) {
            const type = this.unionTypes[i];
            srcTs.push(`\t\tcase ${i}: return ${type.cpp2js(new HeapVal(new ImmVal("ptr + 4")))}`);
        }
        srcTs.push(`\t\tdefault: throw new Error("Unknown union-tag");`);

        srcTs.push(`\t};`);
        srcTs.push(`};`)
    }

    generateCpp(srcCpp: string[]): void {
        srcCpp.push(`struct ${this.name} {`);

        srcCpp.push(`\tu32 tag;`);
        srcCpp.push(`\tunion {`);
        for (let i = 0; i < this.unionTypes.length; i++) {
            const type = this.unionTypes[i];
            srcCpp.push(`\t\t${type.cppName} ${this.generateFieldName(type)};`);
        }
        srcCpp.push(`\t};`);
        for (let i = 0; i < this.unionTypes.length; i++) {
            const type = this.unionTypes[i];
            srcCpp.push(`\t${this.name}(${type.cppParam("val")}) : tag{${i}}, ${this.generateFieldName(type)}{val} {};`);
        }
        srcCpp.push(`};`);
    }
}