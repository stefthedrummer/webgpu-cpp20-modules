

export type Constructor<T> = new (...args: any[]) => T;

export type ArtifactMeta = {
    extensions: string[]
}

export function artifact(extensions: string[]) {
    return function <TFunction extends Function>(target: TFunction) {
        const meta = target as any as ArtifactMeta;
        meta.extensions = extensions;
    }
}

const g_shlashes = /\//g;
export function path2QualifiedName(path: string) {
    return path.replace(g_shlashes, ".");
}

