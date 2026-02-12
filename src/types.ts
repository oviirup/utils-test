export type Dictionary<T = any> = Record<string, T>;

export type AnyFunction<T = any> = (...args: any[]) => T;

type ClassValue = string | number | bigint | null | boolean | undefined;
type ClassArray = ClassValue[];
type ClassRecord = Record<string, any>;

export type ClassNameValue = ClassValue | ClassArray | ClassRecord;

export type AbbreviationSymbols = Dictionary<number> | string[];
export type AbbreviateOptions = {
  symbols?: AbbreviationSymbols;
  precision?: number;
};

export type Predicate =
  | ((val: unknown) => boolean)
  | ((val: unknown) => val is unknown);

export type NegatePredicate<T> = T extends (val: unknown) => val is infer U
  ? <V>(val: V) => val is Exclude<V, U>
  : T extends (val: unknown) => boolean
    ? (val: unknown) => boolean
    : never;

export type MaybePromise<T> = T | Promise<T>;
