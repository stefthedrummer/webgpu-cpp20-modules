import { SourceCodeArtifact, ArtifactId, ArtifactIds, Ctx, Artifact } from "../artifact";
import { Stage } from "../config";
import { FileInfo } from "../file";
import { artifact } from "../meta";
import { CppDescriptor, parseCppDescriptor } from "./cpp-common";
import { O, OCompilableArtifactTrait } from "./o";


@artifact([/*"cpp",*/ "c"])
export class Cpp extends SourceCodeArtifact implements OCompilableArtifactTrait {

    getCppDescriptor(): CppDescriptor {
        return this.cache.query("cpp", parseCppDescriptor);
    }

    getCompilationArguments(ctx: Ctx): string[] {
        return [
            ... (this.file.extension == "c"
                ? this.config.clangCArguments
                : this.config.clangCppArguments),
            ...this.config.srcDirs
                .map(e => `--include-directory=${e}`)
        ]
    }

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        const desc = this.getCppDescriptor();
        out.push(...desc.includeHeaders.map(e => ArtifactIds.create(e, "hpp")));
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
}
