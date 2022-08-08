import { LinkableArtifact, ArtifactId, Ctx, TaskBuilder } from "../artifact";
import { Stage } from "../config";
import { FileInfo } from "../file";
import { artifact } from "../meta";
import { Wat } from "./wat";

@artifact(["wat"])
export class WatWasm extends LinkableArtifact {

    constructor(
        artifactId: ArtifactId,
        file: FileInfo,
        public readonly wat: Wat) {
        super(artifactId, file);
    }

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        out.push(this.wat.artifactId);
    }

    computeBuild(ctx: Ctx, tasks: TaskBuilder): void {
        this.file.mkdir();

        tasks.emitExecution("Wat2Wasm",
            "wat2wasm", [
            ...this.config.wat2wasmArguments,
            "-o", this.file.asString,
            this.wat.file.asString
        ]);
    }
}