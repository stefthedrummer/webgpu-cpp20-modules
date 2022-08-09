import { BaseFormatter } from "../formatter";
import { BoolType } from "./bool-type";
import { BufferSourceType } from "./buffersource-type";
import { F32Type, I32Type, U32Type, U8Type } from "./number-types";
import { RawPointerType } from "./raw-pointer-type";
import { StringType } from "./string-type";
import { VoidType } from "./void-type";


export const t_U8Type = new U8Type();
export const t_U32Type = new U32Type();
export const t_I32Type = new I32Type();
export const t_F32Type = new F32Type();
export const t_StringType = new StringType();
export const t_VoidType = new VoidType();
export const t_BoolType = new BoolType();
export const t_BufferSourceType = new BufferSourceType();
export const t_RawPointerType = new RawPointerType();
export const BaseFormat = new BaseFormatter();