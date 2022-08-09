
export const size_t = 4;

export abstract class Val {
    abstract readonly u8: string;
    abstract readonly u32: string;
    abstract readonly f32: string;
    abstract set_u8(val: string): string;
    abstract set_u32(val: string): string;
    abstract set_f32(val: string): string;
    abstract readonly address: Val;
    abstract readonly deref: Val;
}

export class ImmVal extends Val {
    constructor(private _imm: string) { super(); };
    get u8(): string { return this._imm; }
    get u32(): string { return this._imm; }
    get f32(): string { return this._imm; }
    set_u8(val: string): string { throw new Error("illegal set_* on ImmVal"); };
    set_u32(val: string): string { throw new Error("illegal set_* on ImmVal"); };
    set_f32(val: string): string { throw new Error("illegal set_* on ImmVal"); };
    get address(): Val { throw new Error("Cannot get address to parameter"); }
    get deref(): Val { return new HeapVal(this); }
}

export class HeapVal extends Val {
    constructor(private _address: Val) { super(); };
    get u8(): string { return `Engine.mem_u8[${this._address.u32}]`; }
    get u32(): string { return `Engine.mem_u32[(${this._address.u32}) >> 2]`; }
    get f32(): string { return `Engine.mem_f32[(${this._address.u32}) >> 2]`; }
    set_u8(val: string): string { return `Engine.mem_u8[${this._address.u32}] = ${val}`; };
    set_u32(val: string): string { return `Engine.mem_u32[(${this._address.u32}) >> 2] = ${val}`; };
    set_f32(val: string): string  { return `Engine.mem_f32[(${this._address.u32}) >> 2] = ${val}`; };
    get address(): Val { return this._address; }
    get deref(): Val { return new HeapVal(this); }
}

export function calcPadding(offset: number, alignOf: number) {
    const mod = offset % alignOf;
    return (mod == 0) ? 0 : (alignOf - mod);
}