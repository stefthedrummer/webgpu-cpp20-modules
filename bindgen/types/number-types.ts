import { Val } from "./interop";
import { Type, Kind } from "./type";


export class U8Type extends Type<number> {

    constructor() {
        super({
            sizeOf: 1,
            alignOf: 1,
            kind: Kind.ValueType,
            cppName: `u8`,
            cppInteropName: "u32",
            tsName: `number`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return val.u8;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.u8} = ${val}`;
    }

    generateDefaultValExpr(val: number): string { return val.toString(); }
}

export class U32Type extends Type<number> {

    constructor() {
        super({
            sizeOf: 4,
            alignOf: 4,
            kind: Kind.ValueType,
            cppName: `u32`,
            cppInteropName: "u32",
            tsName: `number`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return val.u32;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.u32} = ${val}`;
    }

    generateDefaultValExpr(val: number): string { return val.toString(); }
}

export class F32Type extends Type<number> {

    constructor() {
        super({
            sizeOf: 4,
            alignOf: 4,
            kind: Kind.ValueType,
            cppName: `f32`,
            cppInteropName: "f32",
            tsName: `number`,
            isOptionalAllowed: false,
            isConst: false
        });
    }

    cpp2js(val: Val): string {
        return val.f32;
    }
    js2cpp(ptr: Val, val: string): string {
        return `${ptr.f32} = ${val}`;
    }
}