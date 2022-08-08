import { Artifact, ArtifactId, BuildableArtifact, Ctx, LinkableArtifact, TaskBuilder } from "../artifact";
import { Stage } from "../config";


export class AppWasm extends BuildableArtifact {

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        out.push(...ctx.artifacts.findAllOfType(LinkableArtifact).map(e => e.artifactId));
    }

    computeBuild(ctx: Ctx, tasks: TaskBuilder): void {
        if (ctx.stage >= Stage.Link) {
            const linkableArtifacts = ctx.artifacts.findAllOfType(LinkableArtifact);

            tasks.emitExecution("Link",
                "wasm-ld", [
                ...this.config.wasmldArguments,
                ...linkableArtifacts.map(e => e.file.asString),
                "-o", this.file.asString
            ]);
        }
    }
}