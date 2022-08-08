import * as fs from "fs";
import { Artifact, ArtifactIds, Artifacts, ArtifactsCollection, Ctx } from "./artifact";
import { BuildCache } from "./build-cache";
import { ArtifactCtor, Config, Stage } from "./config";
import { FileInfo } from "./file";
import { Job, JobResult, Jobs } from "./job";
import { Colors, log, logArtifact } from "./logging";
import { ArtifactMeta, Constructor } from "./meta";

export const g_curDir = process.cwd().replace(/\\/g, "/")

export class Project {

    private _artifactCtors: Map<string, ArtifactCtor<any>> = new Map();
    private _artifacts: ArtifactsCollection = new ArtifactsCollection();
    private readonly _cache = new BuildCache(this);

    public artifacts: Artifacts = this._artifacts;

    constructor(
        public readonly config: Config) {

        this._cache.load();
    }

    collectSources() {
        for (const src of this.config.srcDirs) {
            this.addSrcDir(src);
        }
        return this;
    }

    addSourceArtifacts(...artifactTypes: ArtifactCtor<any>[]) {
        for (const e of artifactTypes) {
            const meta = e as any as ArtifactMeta;
            for (const extention of meta.extensions) {
                this._artifactCtors.set(extention, e);
            }
        }
        return this;
    }

    addSrcDir(dir: string) {
        this.recursiveAddSrcDir([], dir);
        return this;
    }

    private recursiveAddSrcDir(pckg: string[], dir: string) {
        const elements = fs.readdirSync(dir);
        for (const e of elements) {
            const subPath = `${dir}/${e}`;
            const stats = fs.lstatSync(subPath);
            const isDir = stats.isDirectory();

            if (isDir) {
                this.recursiveAddSrcDir([...pckg, e], subPath);
            } else {
                const file = FileInfo.parse(subPath);
                const ctor = this._artifactCtors.get(file.extension);
                if (ctor)
                    this.emitArtifact(new ctor(ArtifactIds.createA([...pckg, file.name], file.extension), file));
            }
        }
    }

    emitArtifact(artifact: Artifact) {
        artifact.config = this.config;
        artifact.cache = this._cache.getArtifactCache(artifact);
        this._artifacts.push(artifact);
        return this;
    }

    computeDerivedArtifacts(ctx: Ctx) {
        const derivedArtifacts: Artifact[] = [];

        for (const e of this._artifacts) {
            derivedArtifacts.length = 0;
            e.computeDerivedArtifacts(ctx, derivedArtifacts);
            for (const a of derivedArtifacts) {
                this.emitArtifact(a);
            };
        }
    }

    registerJobDeadLockListener(ctx: Ctx) {
        process.on("exit", () => {
            for (const job of ctx.jobs.runningJobs) {
                logArtifact(console.error, job.artifact.artifactId, Colors.error, `Job did not finish - you may have circular dependencies!`);
            }
        });
    }

    build(stage: Stage, clean: boolean = false) {
        const jobs: Jobs = new Jobs();
        const ctx: Ctx = {
            stage: stage,
            clean: clean,
            artifacts: this.artifacts,
            jobs: jobs
        };

        this.computeDerivedArtifacts(ctx);

        for (const e of this.artifacts) {
            jobs.set(e.artifactId, e.createJob());
        }
        for (const e of jobs.values()) {
            e.resolve(ctx);
        }
        for (const e of jobs.values()) {
            e.schedule(ctx);
        }

        this.registerJobDeadLockListener(ctx);

        const finishedPromise = Promise.all([...jobs.values()].map(e => e.promise));
        finishedPromise.then((results) => {
            let resultMask: JobResult = JobResult.None;
            for (const r of results) {
                resultMask |= r;
            }

            const wasSuccessful = (resultMask & JobResult.HasErrors) == 0;

            log(console.log, wasSuccessful ? Colors.success : Colors.warning, wasSuccessful ? "Success" : "Build has errors");
            this._cache.save();
        });

        return this;
    }
}

