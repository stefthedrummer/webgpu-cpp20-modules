import { ArtifactId, ArtifactIds } from "./artifact";

export const Colors = {
    error: "\x1b[31m",
    warning: "\x1b[33m",
    compile: "\x1b[34m",
    info: "\x1b[30m",
    success: "\x1b[32m",
    note: "\x1b[36m"
}

export function logExecution(stream: (msg: string) => void, artifactId: ArtifactId, color: string, msg: string, milliseconds: number = 0) {
    const id = ArtifactIds.split(artifactId);
    stream(`${color}[${id[0].padEnd(24)}:${id[1].padEnd(4)}]\x1b[0m[${milliseconds.toString().padStart(5)} ms]  >  ${msg}`);
}


export function logArtifact(stream: (msg: string) => void, artifactId: ArtifactId, color: string, msg: string) {
    const id = ArtifactIds.split(artifactId);
    stream(`${color}[${id[0].padEnd(24)}:${id[1].padEnd(4)}]\x1b[0m            >  ${msg}`);
}

export function log(stream: (msg: string) => void, color: string, msg: string) {
    stream(`${color}${msg}\x1b[0m`);
}

const g_clangNotePattern = /^.*note:(?:.|[\n\r])+?\^/gm;
const g_newLinePattern = /\r?\n/gm;

export function logDiagnostics(stream: (msg: string) => void, color: string, noteColor: string, msg: string) {
    const prettyMsg = msg.replace(g_clangNotePattern, note => {
        return note.split(g_newLinePattern).map(line => `${noteColor}\t${line}${color}`).join("\n");
    });
    stream(`${color}${prettyMsg}\x1b[0m`);
}
