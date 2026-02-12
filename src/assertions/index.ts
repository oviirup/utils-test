import { AnyFunction, Dictionary, NegatePredicate, Predicate } from "@/types";

/** Check if given value is a string */
export function isString(val: unknown): val is string {
  return typeof val === "string";
}

/** Check if the given value is a number */
export function isNumber(val: unknown): val is number {
  return typeof val === "number" && !Number.isNaN(val);
}

/** Check if the given value is an integer */
export function isInteger(val: unknown): val is number {
  return isNumber(val) && Number.isInteger(val);
}

/** Check if the given value is a float */
export function isFloat(val: unknown): val is number {
  return isNumber(val) && !Number.isInteger(val);
}

/** Check if given value is an array */
export function isArray<T = any>(val: unknown): val is T[] {
  return Array.isArray(val);
}

/** Check if given array is empty */
export function isEmptyArray<T = unknown>(val: T[]): boolean {
  return isArray(val) && val.length === 0;
}

/** Check if given value is an object */
export function isObject<T extends object = Dictionary>(val: any): val is T {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/** Check if given object is empty */
export function isEmptyObject<T extends object = Dictionary>(val: T): boolean {
  return Object.keys(val).length === 0;
}

/** Check if the given value is empty, null, undefined, or a string with no content */
export function isEmpty(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "string" && val.trim() === "") return true;
  if (isArray(val)) return isEmptyArray(val);
  if (isObject(val)) return isEmptyObject(val);
  return false;
}

/** Check if the given object is a function */
export function isFunction(val: any): val is AnyFunction<any> {
  return typeof val === "function";
}

/** Check if the given value is a regex */
export function isRegex(val: unknown): val is RegExp {
  return val instanceof RegExp;
}

/** Check if the given value is truthy */
export function isTruthy(val: unknown): boolean {
  return !!val;
}

/** Check if the code is running in a browser environment */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Negate an assertion function, returning a new function with the opposite boolean result */
export function not<T extends Predicate>(fn: T): NegatePredicate<T> {
  return ((val: unknown) => !fn(val)) as NegatePredicate<T>;
}
