export enum TimeInSeconds {
    MINUTE = 60,
    HOUR = 3600,
    DAY = 86400,
    WEEK = 604800,
    MONTH = 2592000,
    YEAR = 31104000
}

export type ExcludeUndefined<T> = {
    [P in keyof T]?: Exclude<T[P], null | undefined>;
};

export type MakeItemsNullable<T extends unknown[]> = {
    [K in keyof T]?: T[K] | null;
};

export type ArrayItem<ArrayType extends readonly unknown[]> =
ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;