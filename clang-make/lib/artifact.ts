import { FileInfo } from "./file";
import { ArtifactCache } from "./build-cache";
import { AnyArtifactCtor, ArtifactCtor, Config, Stage } from "./config";
import { BuildJob, Job as Job, Jobs, SourceJob } from "./job";
import { Colors, logArtifact } from "./logging";

export type ArtifactId = {} & string;

export namespace ArtifactIds {
    export function withExtension(artifactId: ArtifactId, withExtension: string): ArtifactId {
        return `${(artifactId as string).split(":")[0]}:${withExtension}` as ArtifactId;
    }
    export function createA(names: string[], extension: string): ArtifactId {
        return `${names.join(".")}:${extension}` as ArtifactId;
    }
    export function create(name: string, extension: string): ArtifactId {
        return `${name}:${extension}` as ArtifactId;
    }
    export function name(artifactId: ArtifactId): string {
        return (artifactId as string).split(":")[0];
    }
    export function split(artifactId: ArtifactId): [string, string] {
        return (artifactId as string).split(":") as [string, string];
    }
}

export interface Ctx {
    stage: Stage,
    clean: boolean,
    artifacts: Artifacts,
    jobs: Jobs
}

export interface TaskBuilder {
    emitExecution(msg: string, program: string, args: string[]): void;
}

export class Artifacts {
    protected readonly _list: Artifact[] = [];
    protected readonly _map: Map<string, Artifact> = new Map();

    [Symbol.iterator](): Iterator<Artifact> {
        return this._list[Symbol.iterator]();
    }

    findAllOfType<A extends Artifact>(type: new (...args: any) => A): A[] {
        return this._list.filter(e => e instanceof type) as A[];
    }

    tryFindAll<A extends Artifact>(filterType: AnyArtifactCtor<A>, artifactIds: ArtifactId[]) {
        const artifacts: A[] = [];
        for (const id of artifactIds) {
            const a = this._map.get(id as string);
            if (a == undefined) {
                logArtifact(console.log, id, Colors.warning, `Unknown artifact ${id}`);
            } else if (a instanceof filterType) {
                artifacts.push(a);
            }
        }
        return artifacts;
    }
}

export class ArtifactsCollection extends Artifacts {

    push(artifact: Artifact) {
        this._list.push(artifact);
        this._map.set(artifact.artifactId as string, artifact);
    }
}

export abstract class Artifact {

    public config: Config = null!;
    public cache: ArtifactCache<this> = null!;

    constructor(
        public readonly artifactId: ArtifactId,
        public readonly file: FileInfo) {
    }

    abstract createJob(): Job<this>;
    computeDerivedArtifacts(ctx: Ctx, out: Artifact[]): void { }
    computeDependencies(ctx: Ctx, out: ArtifactId[]): void { }
}

export class BuildableArtifact extends Artifact {

    createJob(): Job<this> { return new BuildJob<this>(this); }
    computeBuild(ctx: Ctx, tasks: TaskBuilder): void { }
}

export class LinkableArtifact extends BuildableArtifact {
}

export class SourceCodeArtifact extends Artifact {

    createJob(): Job<this> { return new SourceJob(this); }
}