import { Artifact, ArtifactId, Ctx } from "./artifact";
import { FileInfo } from "./file";
import { Colors, logArtifact } from "./logging";
import { Project } from "./project";

export type Cachable = { errors?: string[]; timeStamp: number; }
type ArtifactCacheJson = Record<string, Cachable>;
type BuildJson = { timeSta: ArtifactId[]; };

export class ArtifactCache<A extends Artifact> {
    constructor(
        public readonly artifact: A,
        public readonly json: ArtifactCacheJson
    ) { }

    /*getLastBuild() {
        return this.query("build", (a: Artifact, ts: number) => ({
            timeStamp: -1,
            errors: undefined
        }));
    }*/

    getLastEdit() {
        return this.query("edit", (a: Artifact, ts: number) => ({
            timeStamp: -1,
            errors: undefined
        }));
    }

    query<D>(key: string, compute: (a: A, timeStamp: number) => D & Cachable): D & Cachable {
        const curTimeStampe = this.artifact.file.timeStamp;
        let data = this.json[key];
        if (data == undefined || data.timeStamp < curTimeStampe) {
            data = compute(this.artifact, curTimeStampe);
            this.json[key] = data;
            if (data.errors) {
                for (const err of data.errors) {
                    logArtifact(console.error, this.artifact.artifactId, Colors.error, err);
                }
            }
        }
        return data as unknown as (D & Cachable);
    }
}

export class BuildCache {

    private file: FileInfo;
    private cache: Map<ArtifactId, ArtifactCacheJson> = new Map();

    constructor(
        public readonly project: Project
    ) {
        this.file = FileInfo.create(project.config.buildDir, "clang-make-cache", "json");
    }

    load() {
        if (this.file.exists) {
            const cacheJson = JSON.parse(this.file.textContent) as Record<string, ArtifactCacheJson>;
            this.cache = new Map(Object.entries(cacheJson));
        }
    }

    save() {
        for (const [artifactId, entry] of this.cache) {
            for (const key in entry) {
                const val = entry[key];
                if (val.errors) {
                    delete entry[key];
                }
            }
        }

        const cacheJson: Record<string, ArtifactCacheJson> = Object.fromEntries(this.cache);
        this.file.mkdir();
        this.file.save(JSON.stringify(cacheJson, null, 4));
    }

    getArtifactCache<A extends Artifact>(artifact: A): ArtifactCache<A> {
        let json = this.cache.get(artifact.artifactId) as undefined | ArtifactCacheJson;
        if (json == undefined) {
            this.cache.set(artifact.artifactId, json = {})
        }
        return new ArtifactCache(artifact, json);
    }
} 