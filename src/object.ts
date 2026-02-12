import { toArray } from "./array";
import { isObject } from "./assertions";
import { Dictionary } from "./types";

/**
 * Checks if a given object has a specified key
 * @category Object
 */
export function keyInObject<T extends object = Dictionary>(
  val: T,
  key: keyof T | (string & {}),
): boolean {
  return isObject(val) && key in val;
}

/**
 * Picks a set of keys from an object
 * @category Object
 */
export function pick<T extends object, K extends keyof T = keyof T>(
  input: T,
  keys: K | K[],
): Pick<T, K> {
  const picked = {} as Pick<T, K>;
  for (const key of toArray(keys)) {
    if (key in input) picked[key] = input[key];
  }
  return picked;
}

/**
 * Omits a set of keys from an object
 * @category Object
 */
export function omit<T extends object, K extends keyof T = keyof T>(
  input: T,
  keys: K | K[],
): Omit<T, K> {
  const partial = { ...input } as T;
  for (const key of toArray(keys)) {
    if (key in input) delete partial[key];
  }
  return partial as Omit<T, K>;
}
