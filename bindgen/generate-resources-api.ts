import { BindGen } from "./bindgen";
import { FieldDef, StructTypeFlags } from "./types/struct-type";
import { TypeFlags } from "./types/type";
import { t_StringType, t_RawPointerType, t_U32Type, BaseFormat } from "./types/types";

export const generate_resources = () => { };

const bindGen = new BindGen({
    moduleName: "api.resources",
    cppOut: "../engine/src-cpp/api/resources.cppm",
    tsOut: "../engine/src-ts/resources-api.ts",
    cppImports: [
        "core.wasm",
        "core.types",
        "core.buffer",
        "api.bindgen"
    ],
    tsImports: {
        "./engine": ["Engine"]
    }
});

export enum ResourceType {
    Text = 1,
    Image = 2,
    Json = 3,
};

const t_ResourceType = bindGen.defineEnumOrdinals<ResourceType>("ResourceType", BaseFormat, ResourceType
).config({
    flags: TypeFlags.GenerateTypescriptInterface
});

bindGen.defineStruct<any>("ResourceDescriptor", [
    new FieldDef("type", t_ResourceType),
    new FieldDef("url", t_StringType.pointer()),
    new FieldDef("jsonType", t_StringType.pointer()),
    new FieldDef("pData", t_RawPointerType),
    new FieldDef("dataLength", t_U32Type),
    new FieldDef("width", t_U32Type),
    new FieldDef("height", t_U32Type)
]).config({
    addressField: "ptr",
    flags: StructTypeFlags.GenerateEncode | StructTypeFlags.GenerateDecode | TypeFlags.GenerateTypescriptInterface
});

bindGen.generate();
