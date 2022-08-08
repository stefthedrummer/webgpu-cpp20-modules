

export type ResolveAllResult<T> = {
    [K in keyof T]: T[K] extends Promise<infer V> ? V : T[K];
}


export function resolveAll<T>(input: T): Promise<ResolveAllResult<T>> {
    const promiseKeys: (keyof T)[] = []
    const promises: Promise<any>[] = [];
    for (const key in input) {
        const val = input[key];
        if (val instanceof Promise) {
            promiseKeys.push(key);
            promises.push(val);
        }
    }
    return new Promise<ResolveAllResult<T>>((resolve, reject) => {
        const allPromise = Promise.all(promises).then(resolved => {
            const output = { ...input } as ResolveAllResult<T>;
            for (let i = 0; i < promiseKeys.length; i++) {
                output[promiseKeys[i]] = resolved[i];
            }
            resolve(output);
        });
    });
}

/* 
type _PromiseKeys<T> = {
    [K in keyof T]: T[K] extends Promise<any> ? K : never
}[keyof T];
type _PromiseTypeOf<T> = T extends Promise<infer E> ? E : never;
export type ResolveAllOutput<I, IE, P extends _PromiseKeys<IE>> = {
    [K in keyof I]: Omit<IE, P> & { [$P in P]: _PromiseTypeOf<IE[P]> }
};

export function resolveAll<I, IE, P extends _PromiseKeys<IE>>(input: I & Record<string, IE>, promiseKey: P): Promise<ResolveAllOutput<I, IE, P>> {
    const entries = Object.entries(input);
    const promises = entries.map(e => e[1][promiseKey]);

    return new Promise<ResolveAllOutput<I, IE, P>>((resolve, reject) => {
        Promise.all(promises).then(resolvedValues => {
            const resolvedEntries = entries.map((e, i) => {
                const element = { ...e[1] };
                element[promiseKey] = resolvedValues[i];
                return [e[0], element];
            })
            const output = Object.fromEntries(resolvedEntries);
            resolve(output);
        });
    });
};
export type MapAllOutput<I, IE, P extends keyof IE, Q> = {
    [K in keyof I]: Omit<IE, P> & { [$P in P]: Q }
};

export function mapAll<I, IE, P extends keyof IE, Q>(input: I & Record<string, IE>, key: P, map: (e: IE[P]) => Q): MapAllOutput<I, IE, P, Q> {
    return Object.fromEntries(Object.entries(input)
        .map(e => {
            const element = { ...e[1] } as any;
            element[key] = map(e[1][key]);
            return [e[0], element];
        })) as MapAllOutput<I, IE, P, Q>;
}*/