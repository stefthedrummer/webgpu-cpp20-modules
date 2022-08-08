import { BindGen } from "../bindgen";
import { cppifyName } from "../formatter";
import { EnumFlagsType } from "./enum-flags-type";
import { HandleType } from "./handle-type";
import { HeapVal, ImmVal } from "./interop";
import { Item } from "./item";
import { FieldDef, StructType, StructTypeFlags } from "./struct-type";
import { Type, Kind, AnyDef } from "./type";

export abstract class MemberDef<IFace, Prop extends keyof IFace & string> implements AnyDef {
    constructor(
        public readonly prop: Prop,
        public readonly retType: Type<any>) { }
}

export class PropertyDef<IFace, Prop extends keyof IFace & string> extends MemberDef<IFace, Prop>{
    constructor(
        prop: Prop,
        retType: Type<IFace[Prop]>) {
        super(prop, retType);
    }
};

export type ReturnOfFunction<Fn> =
    Fn extends ((...args: any[]) => infer TReturn) ? Type<TReturn> : Type<Fn>;

export class ParamDef<T> implements AnyDef {
    constructor(
        public readonly prop: string,
        public readonly retType: Type<T>,
        public readonly defaultVal: T | null = null) { }
};
export type ParamDefArray<Fn> =
    Fn extends ((...args: infer TParams) => any) ? { [i in keyof TParams]: ParamDef<TParams[i]> } : never;

export enum FunctionDefFlags {
    ParamStruct = 1 << 0
}

export class FunctionDef<IFace, FnProp extends keyof IFace & string> extends MemberDef<IFace, FnProp>{

    paramDefs: ParamDefArray<IFace[FnProp]>;

    paramStruct: StructType<any> | null = null;
    paramStructFunction: FunctionDef<any, string> | null = null;

    constructor(
        prop: FnProp,
        retType: ReturnOfFunction<IFace[FnProp]> | Type<void>,
        paramDefs: ParamDefArray<IFace[FnProp]>,
        paramStructDefs: ParamDefArray<IFace[FnProp]> | null = null) {

        super(prop, retType);
        this.paramDefs = paramDefs.filter(e => e != null) as ParamDefArray<IFace[FnProp]>;

        if (paramStructDefs) {
            const paramStruct = new StructType(
                `${cppifyName(this.prop)}ParamStruct`,
                paramStructDefs.map(p => new FieldDef<any, string>(
                    p.prop, p.retType, p.defaultVal)),
                StructTypeFlags.None);

            const paramStructFunction = new FunctionDef<any, string>(
                this.prop,
                this.retType,
                [new ParamDef("params", paramStruct.pointer())],
            );

            this.paramStructFunction = paramStructFunction;
            paramStructFunction.paramStruct = paramStruct;
        }
    }
};

function mangeFunctionName(def: AnyDef): string {
    if (def instanceof FunctionDef) {
        return `${def.prop}${def.paramDefs.length.toString()}`;
    } else {
        return `${def.prop}`;
    }
}

export class Interface<T> extends Item {

    public handleType_any: Type<T> = new HandleType(this, "Handle");
    public handleType_local: Type<T> = new HandleType(this, "LocalHandle");
    private assignableFrom: Interface<any>[] = [];
    private readonly memberDefs: MemberDef<T, any>[] = [];

    constructor(
        bindgen: BindGen,
        public readonly name: string,
        memberDefs: MemberDef<T, any>[]) {
        super();

        for (const memberDef of memberDefs) {
            this.memberDefs.push(memberDef);

            if (memberDef instanceof FunctionDef) {
                for (const paramDef of memberDef.paramDefs) {
                    if (paramDef.retType.sizeOf != 4) {
                        throw new Error(`type ${paramDef.retType.cppName} is not valid as a parameter in ${memberDef.prop}()`);
                    }
                }

                if (memberDef.paramStructFunction) {
                    this.memberDefs.push(memberDef.paramStructFunction!);
                    bindgen.items.push(memberDef.paramStructFunction.paramStruct!);
                }
            }
        }
    }

    generateTs(srcTs: string[]): void {
        srcTs.push(`export class cpp_${this.name} {`);

        for (const memberDef of this.memberDefs) {
            const paramList: string[] = [];

            // params:
            paramList.push(`_this: number`);
            if (memberDef instanceof FunctionDef) {
                paramList.push(...memberDef.paramDefs.map(p => `${p.prop}: number`))
            }
            if (memberDef.retType.kind == Kind.Handle) {
                paramList.push(`_retHandle: number`);
            }

            // ret:
            const fnParams = paramList.join(", ");
            const fnRet = memberDef.retType.kind == Kind.ValueType ? "number" : "void";

            srcTs.push(`\tstatic cpp_${mangeFunctionName(memberDef)}(${fnParams}): ${fnRet} {`);
            {
                srcTs.push(`\t\tconst arg_this = ${this.handleType_any.cpp2js(new ImmVal("_this"))};`);

                // args:
                let args = "";
                if (memberDef instanceof FunctionDef) {
                    if (memberDef.paramStruct) {
                        const param = memberDef.paramDefs[0];
                        const paramStruct = memberDef.paramStruct;
                        for (const p of paramStruct.fieldDefs) {
                            srcTs.push(`\t\tconst arg_${p.prop} = ${p.retType.cpp2js(new HeapVal(new ImmVal(`${param.prop} + ${p.offset}`)))};`);
                        }
                        args = `(${paramStruct.fieldDefs.map(p => `arg_${p.prop}`).join(", ")})`;
                    } else {
                        for (const p of memberDef.paramDefs) {
                            srcTs.push(`\t\tconst arg_${p.prop} = ${p.retType.cpp2js(new ImmVal(p.prop))};`);
                        }
                        args = `(${memberDef.paramDefs.map(p => `arg_${p.prop}`).join(", ")})`;
                    }
                }

                const retVal = (memberDef.retType.kind == Kind.Void) ? "" : `const ret = `;
                srcTs.push(`\t\t${retVal}arg_this.${memberDef.prop}${args};`);

                if (memberDef.retType.kind == Kind.ValueType) {
                    throw new Error("Unimplemented")
                } else if (memberDef.retType.kind == Kind.Handle) {
                    srcTs.push(`\t\tEngine.externref_table.set(_retHandle, ret);`);
                }
            }
            srcTs.push(`\t}`);
        }

        srcTs.push(`};`);
    }

    generateCpp(srcCpp: string[]): void {

        srcCpp.push(`struct ${this.name} {`);
        srcCpp.push(`private:`);

        for (const memberDef of this.memberDefs) {
            if (memberDef.retType.kind == Kind.ReferenceType)
                throw "Return-type must not be a reference-type";

            const paramList = [];
            paramList.push("u32"); // this
            if (memberDef instanceof FunctionDef) {
                paramList.push(...memberDef.paramDefs.map(e => e.retType._cppInteropName))
            }
            if (memberDef.retType.kind == Kind.Handle) {
                paramList.push("u32");
            }

            const params = paramList.join(", ");
            const ret = memberDef.retType.kind == Kind.ValueType ? "u32" : "void";

            srcCpp.push(`\tstatic wasm_import("cpp_${mangeFunctionName(memberDef)}") ${ret} cpp_${memberDef.prop}(${params});`);
        }

        srcCpp.push(`public:`);
        srcCpp.push(`\tstatic inline constexpr char const* Name = "${this.name}";`);
        srcCpp.push(`\tu32 handle;`);


        for (const memberDef of this.memberDefs) {

            // params:
            const paramList: string[] = [];
            const argList: string[] = [];

            argList.push(`this->handle`)

            if (memberDef instanceof FunctionDef) {
                paramList.push(...memberDef.paramDefs.map(p => {
                    const defaultValExpr = (p.defaultVal != null) ? ` = ${p.retType.generateDefaultValExpr(p.defaultVal)}` : "";
                    return `${p.retType.cppParam(p.prop)}${defaultValExpr}`;
                }));
                argList.push(...memberDef.paramDefs.map(p => {
                    return p.retType.cppCast2interop(p.retType.cppArg(p.prop))
                }));
            }
            if (memberDef.retType.kind == Kind.Handle) {
                paramList.push(`Scope* pScope`);
                argList.push(`_retHandle`);
            }

            const params = paramList.join(", ");
            const args = argList.join(", ");

            srcCpp.push(`\tinline ${memberDef.retType.cppName} ${cppifyName(memberDef.prop)}(${params}) {`);
            if (memberDef.retType.kind == Kind.Handle) {
                srcCpp.push(`\t\tu32 const _retHandle = pScope->externrefScope.AcquireLocal();`);
            }
            srcCpp.push(`\t\t${this.name}::cpp_${memberDef.prop}(${args});`);
            if (memberDef.retType.kind == Kind.Handle) {
                srcCpp.push(`\t\treturn ${memberDef.retType.cppName}{_retHandle};`);
            }
            srcCpp.push(`\t}`);

            const hasReferenceTypeParams = memberDef instanceof FunctionDef
                && memberDef.paramDefs.filter(e => e.retType.kind == Kind.ReferenceType).length > 0

            if (hasReferenceTypeParams) {
                // params:
                const paramList: string[] = [];
                const argList: string[] = [];

                if (memberDef instanceof FunctionDef) {
                    paramList.push(...memberDef.paramDefs.map(p => p.retType.tryRValueRef().cppParam(p.prop)));
                    argList.push(...memberDef.paramDefs.map(p => p.retType.tryRValueRef().cppArg(p.prop)));
                }
                if (memberDef.retType.kind == Kind.Handle) {
                    paramList.push(`Scope* pScope`);
                    argList.push(`pScope`);
                }

                const params = paramList.join(", ");
                const args = argList.join(", ");
                const ret = (memberDef.retType.kind != Kind.Void) ? "return " : "";

                srcCpp.push(`\tinline ${memberDef.retType.cppName} ${cppifyName(memberDef.prop)}(${params}) {`);
                srcCpp.push(`\t\t${ret}this->${cppifyName(memberDef.prop)}(${args});`);
                srcCpp.push(`\t}`);
            }
        }
        srcCpp.push(`};`);

        for (const iface of this.assignableFrom) {
            srcCpp.push(`template<> inline constexpr bool InterfaceCompatibilityTable<${iface.name}, ${this.name}> = true;`);
        }
    }

    addAssignableFrom(...assignableFrom: Interface<any>[]) {
        this.assignableFrom = assignableFrom;
        return this;
    }
}