import { BindGen } from "./bindgen";
import { FieldDef, StructTypeFlags } from "./types/struct-type";
import { TypeFlags } from "./types/type";
import { t_StringType, t_U32Type } from "./types/types";

export const generate_sprite_atlas = () => { };

const bindGen = new BindGen({
    moduleName: "api.sprite_atlas",
    cppOut: "../engine/src-cpp/api/sprite_atlas.cppm",
    tsOut: "../engine/src-ts/sprite-atlas-api.ts",
    cppImports: [
        "core.types",
        "core.allocator",
        "core.array"
    ],
    tsImports: {
        "./engine": ["Engine"]
    }
});


const t_AtlasSprite = bindGen.defineStruct<any>("AtlasSprite", [
    new FieldDef("x", t_U32Type),
    new FieldDef("y", t_U32Type),
    new FieldDef("height", t_U32Type)
]).config({ flags: StructTypeFlags.GenerateEncode | StructTypeFlags.GenerateDecode | TypeFlags.GenerateTypescriptInterface });

const t_AtlasSheet = bindGen.defineStruct<any>("AtlasSheet", [
    new FieldDef("spriteIndexOffset", t_U32Type),
    new FieldDef("sprites", t_AtlasSprite.array("Heap")),
]).config({ flags: StructTypeFlags.GenerateEncode | StructTypeFlags.GenerateDecode | TypeFlags.GenerateTypescriptInterface });

const t_AtlasTexture = bindGen.defineStruct<any>("AtlasTexture", [
    new FieldDef("id", t_StringType.pointer()),
    new FieldDef("width", t_U32Type),
    new FieldDef("height", t_U32Type),
    new FieldDef("spriteSheets", t_AtlasSheet.array("Heap"))
]).config({ flags: StructTypeFlags.GenerateEncode | StructTypeFlags.GenerateDecode | TypeFlags.GenerateTypescriptInterface });

const t_Atlas = bindGen.defineStruct<any>("Atlas", [
    new FieldDef("textures", t_AtlasTexture.array("Heap")),
]).config({ flags: StructTypeFlags.GenerateEncode | StructTypeFlags.GenerateDecode | TypeFlags.GenerateTypescriptInterface });

bindGen.generate();
