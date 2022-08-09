import { spawn } from "child_process";
import { Artifact, ArtifactId, BuildableArtifact, Ctx, SourceCodeArtifact, TaskBuilder } from "./artifact";
import { Colors, log, logArtifact, logDiagnostics, logExecution } from "./logging";

export enum JobResult {
    None = 0,
    HasChanges = 1 << 0,
    HasErrors = 1 << 1,
}

type Task = (resolve: (result: JobResult) => void) => void;

class TaskChain extends Array<Task> {

    schedule(then: (result: JobResult) => void, curTaskNumber: number = 0, accumulatedResult: JobResult = JobResult.None) {
        if (curTaskNumber >= this.length) {
            then(accumulatedResult);
        } else {
            this[curTaskNumber]((result) => this.schedule(then, curTaskNumber + 1, accumulatedResult | result));
        }
    }
}

export abstract class Job<A extends Artifact> {

    protected _dependencies: Job<any>[] = null!;
    protected _resolveJob: (res: JobResult) => void;
    public readonly promise: Promise<JobResult>;

    constructor(
        public readonly artifact: A) {
        this._resolveJob = null!;
        this.promise = new Promise(resolve => {
            this._resolveJob = resolve;
        });
    }

    resolve(ctx: Ctx): void {
        const dependencyIds: ArtifactId[] = [];
        this.artifact.computeDependencies(ctx, dependencyIds);
        this._dependencies = ctx.jobs.tryFindAll(dependencyIds);
    }

    abstract schedule(ctx: Ctx): void;

}

export class SourceJob<A extends SourceCodeArtifact> extends Job<A> {

    schedule(ctx: Ctx): void {
        const prerequisites = Promise.all(this._dependencies.map(e => e.promise));

        ctx.jobs.runningJobs.add(this);

        prerequisites.then(preResults => {
            let preResultMask: JobResult = JobResult.None;
            for (const r of preResults) {
                preResultMask |= r;
            }

            const lastEdit = this.artifact.cache.getLastEdit();
            const curTimeStamp = this.artifact.file.timeStamp;

            const hasChanges = curTimeStamp > lastEdit.timeStamp || ctx.clean;
            const result = hasChanges ? JobResult.HasChanges : JobResult.None;

            if ((preResultMask & JobResult.HasErrors) == 0) {
                lastEdit.timeStamp = this.artifact.file.timeStamp;
            }

            ctx.jobs.runningJobs.delete(this);
            this._resolveJob(preResultMask | result);
        });
    }
}

export class BuildJob<A extends BuildableArtifact> extends Job<A> implements TaskBuilder {

    private _taskChain: TaskChain = new TaskChain();

    schedule(ctx: Ctx) {
        const prerequisites = Promise.all(this._dependencies.map(e => e.promise));

        ctx.jobs.runningJobs.add(this);

        prerequisites.then(preResults => {
            let preResultMask: JobResult = JobResult.None;
            for (const r of preResults) {
                preResultMask |= r;
            }

            if (((preResultMask & JobResult.HasErrors) == 0) &&
                (!this.artifact.file.exists || ((preResultMask & JobResult.HasChanges) != 0))) {
                this.artifact.computeBuild(ctx, this);

                this._taskChain.schedule((result) => {
                    ctx.jobs.runningJobs.delete(this);
                    this._resolveJob(JobResult.HasChanges | preResultMask | result);
                });

            } else {
                ctx.jobs.runningJobs.delete(this);
                this._resolveJob(preResultMask);
            }
        });
    }

    emitTask(task: Task) {
        this._taskChain.push(task);
    }

    emitExecution(msg: string, program: string, args: string[]): void {
        this.emitTask(resolveTask => {

            const startTime = Date.now();
            const proc = spawn(program, args);

            proc.on("exit", code => {
                const finishTime = Date.now();

                logExecution(console.log, this.artifact.artifactId, Colors.compile, msg, finishTime - startTime);

                const err = proc.stderr.read();
                if (code == 0) {
                    if (err)
                        logDiagnostics(console.log, Colors.warning, Colors.note, err.toString())
                    resolveTask(JobResult.None);
                } else {
                    logArtifact(console.error, this.artifact.artifactId, Colors.info, `Execution was: ${program} ${args.join(" ")}`);
                    if (err)
                        logDiagnostics(console.error, Colors.error, Colors.note, err.toString());
                    resolveTask(JobResult.HasErrors);
                }
            });
        });
    }
}

export class Jobs extends Map<ArtifactId, Job<any>>  {

    public runningJobs: Set<Job<any>> = new Set();

    tryFindAll(artifactIds: ArtifactId[]): Job<any>[] {
        const jobs: Job<any>[] = [];

        for (const id of artifactIds) {
            const job = this.get(id);
            if (job == undefined) {
                logArtifact(console.log, id, Colors.warning, `Unknown artifact ${id}`);
            } else {
                jobs.push(job);
            }
        }

        return jobs;
    }
}
