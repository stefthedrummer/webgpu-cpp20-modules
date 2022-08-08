import { ArtifactIds, Ctx, SourceCodeArtifact } from "../artifact";
import { Cachable } from "../build-cache";
import { logArtifact, Colors } from "../logging";
import { path2QualifiedName } from "../meta";

export const g_moduleDecl = /\s*?(export)?\s*?module\s*?([\w.]+);/gm
export const g_moduleImport = /\s*?import\s*?([\w.]+);/gm;
export const g_includeHeader = /\s*?#include\s*?"([\w.\/\-_]+)[.]([\w]+)"/gm;

export type CppDescriptor = Cachable & {
    includeHeaders: string[];
}

export function parseCppDescriptor(src: SourceCodeArtifact, timeStamp: number): CppDescriptor {
    logArtifact(console.log, src.artifactId, Colors.info, "Parse Includes");

    const errors: string[] = [];
    const file = src.file;
    const textContent = file.textContent;

    const includeHeadersMatches = textContent.matchAll(g_includeHeader);
    const includeHeaders = [...includeHeadersMatches].map(e => path2QualifiedName(e[1]));

    return {
        timeStamp: timeStamp,
        errors: (errors.length) ? errors : undefined,
        includeHeaders: includeHeaders,
    };
}