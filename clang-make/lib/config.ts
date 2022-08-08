import { Artifact, ArtifactId } from "./artifact";
import { FileInfo } from "./file"

export enum Stage {
    IntelliSense = 1,
    Compile = 2,
    Link = 3
}

export type ArtifactCtor<A extends Artifact> = (new (artifactId: ArtifactId, file: FileInfo) => A);
export type AnyArtifactCtor<A extends Artifact> = (new (artifactId: ArtifactId, file: FileInfo, ...args: any[]) => A);

export type Config = {
    srcDirs: string[],
    buildDir: string,
    distDit: string,
    clangCppArguments: string[],
    clangCArguments: string[],
    clangdArguments: string[],
    wasmldArguments: string[],
    wat2wasmArguments: string[]
}
