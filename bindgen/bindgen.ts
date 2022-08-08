import { writeFileSync } from "fs";
import { Formatter } from "./formatter";
import { ArrayType } from "./types/array-type";
import { EnumFlagsType } from "./types/enum-flags-type";
import { EnumLiteralsType } from "./types/enum-literals-type";
import { EnumOrdinalsType } from "./types/enum-ordinals-type";
import { PropertyDef, FunctionDef, Interface } from "./types/interface-type";
import { Item } from "./types/item";
import { OptionalType } from "./types/optional-type";
import { PointerType } from "./types/pointer-type";
import { RecordType } from "./types/record-type";
import { FieldDef, StructType } from "./types/struct-type";
import { Allocator, Type } from "./types/type";
import { UnionType } from "./types/union-type";

Type.prototype.array = function <T>(this: Type<T>, allocator: Allocator = "Borrow") {
    return new ArrayType(this, allocator);
}
Type.prototype.pointer = function <T>(this: Type<T>, isConst = true) {
    return new PointerType(this, isConst);
}
Type.prototype.record = function <T>(this: Type<T>, allocator: Allocator = "Borrow") {
    return new RecordType(this, allocator);
}
Type.prototype.tryRValueRef = function <T>(this: Type<T>) {
    return this;
}
Type.prototype.optional = function <T>(this: Type<T>) {
    return new OptionalType(this);
}

export const g_reserved_words = new Set<string>([
    "module"
]);

export type BindGenConfig = {
    cppOut: string,
    tsOut: string,
    cppImports: string[],
    tsImports: Record<string, string[]>,
    moduleName: string
};

export class BindGen {

    moduleName: string;

    private srcTs: string[];
    private srcCpp: string[];
    private srcCppHeader: string[];
    private srcCppFooter: string[];
    public items: Item[] = [];

    constructor(private readonly config: BindGenConfig) {
        config.tsImports["./bindgen-api"] = [
            "cpp_decode_optional",
            "cpp_decode_Array",
            "cpp_decode_String",
            "cpp_decode_Record",
            "cpp_decode_BufferSource",
            "size_t",
            "cpp_encode_Array_Borrow",
            "cpp_encode_Array_Heap"
        ];

        this.srcCpp = [];
        this.srcCppHeader = [
            `export module ${config.moduleName};`,
            ...config.cppImports.map(e => `import ${e};`),
            "#define wasm_import(name) __attribute__((import_name(name)))",
            "export {"
        ];
        this.srcCppFooter = [
            "}"
        ];

        this.srcTs = [];
        for (const tsModule in config.tsImports) {
            const tsDefs = config.tsImports[tsModule];
            this.srcTs.push(`import { ${tsDefs.join(", ")} } from "${tsModule}";`);
        }

        this.moduleName = config.moduleName;
    }

    private define<T extends Item>(type: T): T {
        this.items.push(type);
        return type;
    }

    defineEnumLiterals<T extends string>(name: string, formatter: Formatter, values: (T)[]): Type<T> {
        return this.define(new EnumLiteralsType(name, formatter, values));
    }

    defineEnumFlags<T extends number>(name: string, formatter: Formatter, values: Record<string, number>): Type<T> {
        return this.define(new EnumFlagsType(name, formatter, values));
    }

    defineEnumOrdinals<T>(name: string, formatter: Formatter, values: Record<number, string>): EnumOrdinalsType<T> {
        return this.define(new EnumOrdinalsType(name, formatter, values));
    }

    defineStruct<T>(name: string, fieldDefs: (FieldDef<T, any>)[]): StructType<T> {
        return this.define(new StructType(name, fieldDefs));
    }

    defineInterface<T>(name: string, memberDefs: (PropertyDef<T, any> | FunctionDef<T, any>)[]): Interface<T> {
        return this.define(new Interface(this, name, memberDefs));
    }

    defineUnion<T>(name: string, unionTypes: Type<T>[]): Type<T> {
        return this.define(new UnionType<T>(name, unionTypes));
    }

    generate() {
        const ifaces: Interface<any>[] = this.items.filter(e => e instanceof Interface) as Interface<any>[];

        for (const item of this.items) {
            item.generateCpp(this.srcCpp);
            item.generateTs(this.srcTs);
        }

        this.srcTs.push(`export const cpp_module_${this.moduleName.replace(/[.]/g, "_")} = [`);
        for (const iface of ifaces) {
            this.srcTs.push(`\tcpp_${iface.name},`);
        }
        this.srcTs.push(`];`);

        writeFileSync(this.config.cppOut, [...this.srcCppHeader, ...this.srcCpp, ...this.srcCppFooter].join("\n"));
        writeFileSync(this.config.tsOut, this.srcTs.join("\n"));
    }
};