import { SourceCodeArtifact, ArtifactIds, Ctx, Artifact } from "../artifact";
import { Stage } from "../config";
import { FileInfo } from "../file";
import { artifact } from "../meta";
import { WatWasm } from "./wat-wasm";

@artifact(["wat"])
export class Wat extends SourceCodeArtifact {

    getCompilationArguments(ctx: Ctx): string[] {
        return [
            ...this.config.wat2wasmArguments,
        ]
    }

    computeDerivedArtifacts(ctx: Ctx, out: Artifact[]): void {
        if (ctx.stage >= Stage.Compile) {
            out.push(new WatWasm(
                ArtifactIds.withExtension(this.artifactId, "wasm"),
                FileInfo.create(
                    `${this.config.buildDir}/bin`,
                    this.file.name,
                    "wasm"
                ),
                this)
            );
        }
    }
}
