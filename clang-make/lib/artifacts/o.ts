import { Artifact, ArtifactId, Ctx, LinkableArtifact, TaskBuilder } from "../artifact";
import { FileInfo } from "../file";

export interface OCompilableArtifactTrait {
    getCompilationArguments(ctx: Ctx): string[];
}

export class O extends LinkableArtifact {

    constructor(
        artifactId: ArtifactId,
        file: FileInfo,
        public readonly src: Artifact & OCompilableArtifactTrait) {
        super(artifactId, file);
    }

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        out.push(this.src.artifactId);
    }

    computeBuild(ctx: Ctx, tasks: TaskBuilder): void {
        this.file.mkdir();

        tasks.emitExecution("Compile",
            "clang", [
            "-c",
            ...this.src.getCompilationArguments(ctx),
            "-o", this.file.asString,
            this.src.file.asString
        ]);
    }
}