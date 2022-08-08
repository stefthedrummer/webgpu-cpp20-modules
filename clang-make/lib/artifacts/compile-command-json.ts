import { Artifact, ArtifactId, ArtifactIds, BuildableArtifact, Ctx, SourceCodeArtifact, TaskBuilder } from "../artifact";
import { Colors, logArtifact } from "../logging";
import { g_curDir } from "../project";
import { Cpp } from "./cpp";
import { Cppm } from "./cppm";
import { Pcm } from "./pcm";

type CompileCommandJson = {
    directory: string,
    file: string;
    arguments: string[];
}


export class CompileCommandsJson extends BuildableArtifact {

    computeDependencies(ctx: Ctx, out: ArtifactId[]): void {
        out.push(...ctx.artifacts.findAllOfType(SourceCodeArtifact).map(e => e.artifactId));
    }

    computeBuild(ctx: Ctx, tasks: TaskBuilder): void {
        const all_cppm = ctx.artifacts.findAllOfType(Cppm);
        const all_cpp = ctx.artifacts.findAllOfType(Cpp);
        //const all_pcm = ctx.artifacts.findAllOfType(Pcm);

        /*
        const moduleFileArguments = all_pcm
            .map(e => ({
                pcm: e,
                cppm: e.cppm,
                desc: e.cppm.getModuleDescriptor()
            }))
            .filter(e => e.desc.moduleName != null)
            .map(e => `-fmodule-file=${e.desc.moduleName}=${e.pcm.file.asString}`);
        */

        const includeArguments = this.config.srcDirs
            .map(e => `--include-directory=${e}`);

        const compileCommandsJson: CompileCommandJson[] = [
            ...all_cppm.map(cppm => ({
                directory: g_curDir,
                file: cppm.file.asString,
                arguments: [
                    "clang", "--precompile",
                    ...this.config.clangdArguments,
                    `-fprebuilt-module-path=${this.config.buildDir}/modules`,
                    ...includeArguments
                ]
            })),
            ...all_cpp.map(cpp => ({
                directory: g_curDir,
                file: cpp.file.asString,
                arguments: [
                    "clang", "-c",
                    ...this.config.clangdArguments,
                    ...includeArguments
                ]
            }))
        ]

        logArtifact(console.log, this.artifactId, Colors.compile, "Regenerate");

        this.file.mkdir();
        this.file.save(JSON.stringify(compileCommandsJson, null, 4));
    }
}
