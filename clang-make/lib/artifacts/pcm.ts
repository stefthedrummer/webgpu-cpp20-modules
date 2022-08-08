import { resolveObjectURL } from "buffer";
import { Artifact, ArtifactId, ArtifactIds, BuildableArtifact, Ctx, TaskBuilder } from "../artifact";
import { Stage } from "../config";
import { FileInfo } from "../file";
import { artifact } from "../meta";
import { Cppm } from "./cppm";
import { O, OCompilableArtifactTrait } from "./o";

export class Pcm extends BuildableArtifact implements OCompilableArtifactTrait {

    constructor(
        artifactId: ArtifactId,
        file: FileInfo,
        public readonly cppm: Cppm) {
        super(artifactId, file);
    }

    getCompilationArguments(ctx: Ctx): string[] {
        return this.cppm.getCompilationArguments(ctx);
    }

    computeDerivedArtifacts(ctx: Ctx, out: Artifact[]): void {
        if (ctx.stage >= Stage.Compile) {
            out.push(new O(
                ArtifactIds.withExtension(this.artifactId, "o"),
                FileInfo.create(
                    `${this.config.buildDir}/bin`,
                    this.file.name,
                    "o"
                ),
                this)
            );
        }
    }

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        out.push(this.cppm.artifactId);
        out.push(...this.cppm.getImportedModuleArtifactsIds());
        out.push(...this.cppm.getIncludedHeaderArtifacIds());
    }

    computeBuild(ctx: Ctx, tasks: TaskBuilder): void {
        this.file.mkdir();

        tasks.emitExecution("Precompile",
            "clang", [
            "--precompile",
            ...this.config.clangCppArguments,
            ...this.cppm.getPreCompilationArguments(ctx),
            "-o", this.file.asString,
            this.cppm.file.asString
        ]);
    }
}