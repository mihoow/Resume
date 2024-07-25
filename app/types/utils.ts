export type ExcludeUndefined<T> = {
    [P in keyof T]?: Exclude<T[P], null | undefined>;
};

export type MakeItemsNullable<T extends unknown[]> = {
    [K in keyof T]?: T[K] | null;
};

export type Nullable<T> = { [K in keyof T]: T[K] | null };

export type ArrayItem<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type NoReadonlyKeys<T> = { [P in keyof T]: 'readonly' extends keyof T[P] ? never : P }[keyof T];
