import { Artifact, ArtifactId, ArtifactIds, Ctx, SourceCodeArtifact } from "../artifact";
import { Cachable } from "../build-cache";
import { Stage } from "../config";
import { FileInfo } from "../file";
import { Colors, logArtifact } from "../logging";
import { artifact, path2QualifiedName } from "../meta";
import { g_moduleDecl, g_moduleImport, g_includeHeader } from "./cpp-common";
import { Pcm } from "./pcm";


type ModuleDescriptor = Cachable & {
    moduleName: string | null;
    moduleImports: string[];
    includeHeaders: string[];
}

function parseModuleDescriptor(cppm: Cppm, timeStamp: number): ModuleDescriptor {
    logArtifact(console.log, cppm.artifactId, Colors.info, "Parse Module-Imports and Includes");

    const errors: string[] = [];
    const file = cppm.file;
    const textContent = file.textContent;

    const moduleDeclsMatches = textContent.matchAll(g_moduleDecl);
    const moduleName = [...moduleDeclsMatches].map(e => e[2]).at(0) || null;

    if (moduleName == null) {
        errors.push(`Module [${cppm.artifactId}] has no Module-Name`);
    } else if (moduleName != ArtifactIds.name(cppm.artifactId)) {
        errors.push(`Mismatching Module-Name - [${moduleName}] Should be [${ArtifactIds.name(cppm.artifactId)}]`);
    }

    const moduleImportsMatches = textContent.matchAll(g_moduleImport);
    const moduleImports: string[] = [...moduleImportsMatches].map(e => e[1]);

    const includeHeadersMatches = textContent.matchAll(g_includeHeader);
    const includeHeaders = [...includeHeadersMatches].map(e => path2QualifiedName(e[1]));

    return {
        timeStamp: timeStamp,
        errors: (errors.length) ? errors : undefined,
        moduleName: moduleName,
        moduleImports: moduleImports,
        includeHeaders: includeHeaders,
    };
}

@artifact(["cppm"])
export class Cppm extends SourceCodeArtifact {

    public static ModuleName_Unnamed = "<unnamed>";

    getModuleDescriptor(): ModuleDescriptor {
        return this.cache.query("modules", parseModuleDescriptor);
    }

    getIncludedHeaderArtifacIds(): ArtifactId[] {
        const desc = this.getModuleDescriptor();
        return desc.includeHeaders.map(e => ArtifactIds.create(e, "hpp"));
    }

    getImportedModuleArtifactsIds() {
        const desc = this.getModuleDescriptor();
        return desc.moduleImports.map(e => ArtifactIds.create(e, "pcm"));
    }

    getImportedModuleArtifacts(ctx: Ctx) {
        const desc = this.getModuleDescriptor();
        return ctx.artifacts.tryFindAll(Pcm, this.getImportedModuleArtifactsIds());
    }

    getCompilationArguments(ctx: Ctx): string[] {
        return [
            ...this.config.clangCppArguments
        ];
    }

    getPreCompilationArguments(ctx: Ctx): string[] {
        return [
            ...this.getImportedModuleArtifacts(ctx)
                .map(e => ({
                    pcm: e,
                    desc: e.cppm.getModuleDescriptor()
                }))
                .filter(e => e.desc.moduleName != null)
                .map(e => `-fmodule-file=${e.desc.moduleName}=${e.pcm.file.asString}`),
            ...this.config.srcDirs
                .map(e => `--include-directory=${e}`)
        ]
    }

    computeDerivedArtifacts(ctx: Ctx, out: Artifact[]): void {
        const desc = this.getModuleDescriptor();
        
        if (ctx.stage >= Stage.IntelliSense && desc.moduleName != null) {
            out.push(new Pcm(
                ArtifactIds.withExtension(this.artifactId, "pcm"),
                FileInfo.create(
                    `${this.config.buildDir}/modules`,
                    desc.moduleName,
                    "pcm"
                ),
                this)
            );
        }
    }
}
