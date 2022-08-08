import { ArtifactId, ArtifactIds, Ctx, SourceCodeArtifact } from "../artifact";
import { artifact } from "../meta";
import { CppDescriptor, parseCppDescriptor } from "./cpp-common";

@artifact(["hpp", "h"])
export class Hpp extends SourceCodeArtifact {

    getCppDescriptor(): CppDescriptor {
        return this.cache.query("cpp", parseCppDescriptor);
    }

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        const desc = this.getCppDescriptor();
        out.push(...desc.includeHeaders.map(e => ArtifactIds.create(e, "hpp")));
    }
}