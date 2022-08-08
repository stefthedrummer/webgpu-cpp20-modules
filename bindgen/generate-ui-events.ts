import { BindGen } from "./bindgen";
import { FieldDef, StructTypeFlags } from "./types/struct-type";
import { TypeFlags } from "./types/type";
import { t_StringType, t_RawPointerType, t_U32Type, BaseFormat } from "./types/types";

export const generate_uiEvents = () => { };

const bindGen = new BindGen({
    moduleName: "api.ui_events",
    cppOut: "../engine/src-cpp/api/ui_events.cppm",
    tsOut: "../engine/src-ts/ui-events-api.ts",
    cppImports: [
        "core.types",
    ],
    tsImports: {
        "./engine": ["Engine"]
    }
});

export enum UIEventType {
    CanvasResize = 1,
};

const t_ResourceType = bindGen.defineEnumOrdinals<UIEventType>("UIEventType", BaseFormat, UIEventType
).config({
    flags: TypeFlags.GenerateTypescriptInterface
});

bindGen.defineStruct<any>("UIEvent", [
    new FieldDef("type", t_ResourceType),
    new FieldDef("x", t_U32Type),
    new FieldDef("y", t_U32Type),
]).config({
    flags: StructTypeFlags.GenerateEncode | TypeFlags.GenerateTypescriptInterface
});

bindGen.generate();
