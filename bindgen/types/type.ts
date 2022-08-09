import { Val } from "./interop";
import { Item } from "./item";
import type { RecordType } from "./record-type";

export type TypeInit = {
    sizeOf: number;
    alignOf: number;
    kind: Kind,
    cppName: string,
    cppInteropName: string | null,
    tsName: string,
    isOptionalAllowed: boolean,
    isConst: boolean
}

export interface AnyDef {
    readonly prop: string;
    readonly retType: Type<any>;
}

export enum Kind {
    Void, ValueType, ReferenceType, Handle
}

export enum TypeFlags {
    GenerateTypescriptInterface = 1 << 16
}

export type Allocator = "Borrow" | "Heap";

export abstract class Type<T> extends Item {

    protected _sizeOf: number;
    protected _alignOf: number;
    public readonly isOptionalAllowed: boolean;
    public readonly kind: Kind;
    public readonly cppName: string;
    public readonly _cppInteropName: string | null;
    public readonly tsName: string;
    public readonly isConst: boolean;

    get sizeOf() {
        if (this._sizeOf == -1) {
            throw Error(`sizeOf unknown: ${this.cppName}`);
        }
        return this._sizeOf;
    }
    get alignOf() {
        if (this._alignOf == -1) {
            throw Error(`align unknown: ${this.cppName}`);
        }
        return this._alignOf;
    }
    get cppInteropName() {
        if (!this._cppInteropName) {
            throw Error(`type has no cppInteropName: ${this.cppName}`);
        }
        return this._cppInteropName;
    }
    generateDefaultValExpr(val: T): string {
        throw Error(`defaultValExpr unsupported on ${this.cppName}`);
    }

    constructor(
        init: TypeInit) {

        super();

        this._sizeOf = init.sizeOf;
        this._alignOf = init.alignOf;

        this.kind = init.kind;
        this.cppName = init.cppName;
        this._cppInteropName = init.cppInteropName;
        this.tsName = init.tsName;
        this.isOptionalAllowed = init.isOptionalAllowed;
        this.isConst = init.isConst;
    }

    cppArg(arg: string): string { return `${arg}`; };
    cppParam(param: string): string { return `${this.cppName} ${param}`; };
    jsParam(param: string): string { return `${param}: ${this.tsName}`; };
    cppCast2interop(val: string): string { return (this.cppInteropName == this.cppName) ? val : `(${this.cppInteropName})${val}`; }

    generateCpp(srcCpp: string[]): void { }
    generateTs(srcTs: string[]): void { }

    abstract cpp2js(val: Val): string;
    abstract js2cpp(ptr: Val, val: string): string;

    array(allocator: Allocator = "Borrow"): Type<T[]> { throw "Stub" }
    pointer(isConst = true): Type<T> { throw "Stub" }
    record(allocator: Allocator = "Borrow"): RecordType<T> { throw "Stub" }
    tryRValueRef(): Type<T> { throw "Stub" }
    optional(): Type<T | undefined> { throw "Stub" }
    markAsOptional(): Type<T | undefined> {
        return this;
    }

    __typeGuard__(e: T): T { return null!; };
};

