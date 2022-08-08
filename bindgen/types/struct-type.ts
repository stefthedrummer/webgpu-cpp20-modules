import { g_reserved_words as g_cpp_reserved_words } from "../bindgen";
import { calcPadding, HeapVal, ImmVal, Val } from "./interop";
import { Type, Kind, AnyDef, TypeFlags } from "./type";

export enum FieldDefFlags {
    Deprecated = 1 << 0
}

export class FieldDef<T, P extends keyof T & string> implements AnyDef {

    public offset = 0;

    constructor(
        public readonly prop: P,
        public readonly retType: Type<T[P]>,
        public readonly defaultVal: T[P] | null = null,
        public readonly flags: FieldDefFlags = 0) {
    }
};

export enum StructTypeFlags {
    None = 0,
    GenerateEncode = 1 << 0,
    GenerateDecode = 1 << 1,
}

export class StructType<T> extends Type<T> {

    private addressField: string | null = null;

    constructor(
        name: string,
        public fieldDefs: FieldDef<T, any>[],
        public flags: TypeFlags | StructTypeFlags = StructTypeFlags.GenerateDecode) {

        super({
            sizeOf: -1,
            alignOf: -1,
            kind: Kind.ValueType,
            cppName: name,
            cppInteropName: null,
            tsName: name,
            isOptionalAllowed: true,
            isConst: false
        });

        let offset = 0;
        let alignOfStruct = 1;
        for (const p of fieldDefs) {
            const alignOfParam = p.retType.alignOf;
            const padding = calcPadding(offset, alignOfParam);

            offset += padding;
            p.offset = offset;

            offset += p.retType.sizeOf;
            alignOfStruct = Math.max(alignOfStruct, alignOfParam);
        }
        this._sizeOf = offset + calcPadding(offset, alignOfStruct);;
        this._alignOf = alignOfStruct;
    }

    config(config: {
        addressField?: keyof T & string,
        flags?: TypeFlags | StructTypeFlags;
    }) {
        this.addressField = config.addressField || null;
        this.flags = this.flags | (config.flags || 0);
        return this;
    }

    extend<E>(): FieldDef<E, any>[] {
        return this.fieldDefs as any[] as FieldDef<E, any>[];
    }

    generateCpp(srcCpp: string[]): void {
        srcCpp.push(`struct ${this.cppName} {`);
        for (let i = 0; i < this.fieldDefs.length; i++) {
            const deprecated = ((this.fieldDefs[i].flags & FieldDefFlags.Deprecated) != 0) ? "[[deprecated]] " : "";
            const defaultVal = this.fieldDefs[i].defaultVal;
            const defaultValExpr = (defaultVal != null) ? `{${this.fieldDefs[i].retType.generateDefaultValExpr(defaultVal)}}` : "";

            let prop = this.fieldDefs[i].prop;
            prop = g_cpp_reserved_words.has(prop) ? `${prop}_` : prop

            srcCpp.push(`\t${deprecated}${this.fieldDefs[i].retType.cppParam(prop)}${defaultValExpr};`);
        }
        srcCpp.push(`};`);
    }


    generateTs(srcTs: string[]): void {
        if ((this.flags & TypeFlags.GenerateTypescriptInterface) != 0) {
            srcTs.push(`export type ${this.cppName} = {`);
            if (this.addressField) {
                srcTs.push(`\t${this.addressField}: number;`);
            }
            for (let i = 0; i < this.fieldDefs.length; i++) {
                srcTs.push(`\t${this.fieldDefs[i].retType.jsParam(this.fieldDefs[i].prop)};`);
            }
            srcTs.push(`};`);
        }

        srcTs.push(`export const cpp_sizeof_${this.tsName} = ${this.sizeOf};`);

        if ((this.flags & StructTypeFlags.GenerateDecode) != 0) {
            srcTs.push(`export function cpp_decode_${this.tsName}(ptr: number): ${this.tsName} {`);
            srcTs.push(`\treturn {`);

            if (this.addressField) {
                srcTs.push(`\t\t${this.addressField}: ptr,`);
            }
            for (let i = 0; i < this.fieldDefs.length; i++) {
                const propDef = this.fieldDefs[i];
                srcTs.push(`\t\t${propDef.prop}: ${propDef.retType.cpp2js(new HeapVal(new ImmVal(`ptr + ${propDef.offset}`)))},`);
            }

            srcTs.push(`\t};`);
            srcTs.push(`};`);
        }

        if ((this.flags & StructTypeFlags.GenerateEncode) != 0) {

            srcTs.push(`export function cpp_encode_${this.tsName}(ptr: number, val: ${this.tsName}): void {`);
            for (let i = 0; i < this.fieldDefs.length; i++) {
                const propDef = this.fieldDefs[i];
                if (!propDef.retType.isConst) {
                    srcTs.push(`\t\t${propDef.retType.js2cpp(new HeapVal(new ImmVal(`ptr + ${propDef.offset}`)), `val.${propDef.prop}`)};`);
                } else {
                    srcTs.push(`\t\t// ${propDef.prop} const;`);
                }
            }
            srcTs.push(`};`);
        }
    }

    cpp2js(val: Val): string {
        return `cpp_decode_${this.tsName}(${val.address.u32})`;
    }

    js2cpp(ptr: Val, val: string): string {
        return `cpp_encode_${this.tsName}(${ptr.address.u32}, ${val})`;
    }
};