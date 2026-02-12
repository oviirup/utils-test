import { isEmptyArray } from "@/assertions";

/**
 * Converts a given value to represent itself in an array
 * @param value The value to convert to an array
 * @category Array
 */
export function toArray<T>(array: T | T[]): T[] {
  array = array ?? [];
  return Array.isArray(array) ? array : [array];
}

type Matcher<T> = (left: T, right: T) => boolean;

/**
 * Create an array with all unique items
 * @param value The array to make unique
 * @param equals The matcher function to use to determine if two items are the same
 * @category Array
 */
export function unique<T>(value: T[]): T[];
export function unique<T>(value: T[], equals: Matcher<T>): T[];
export function unique<T>(value: T[], equals?: Matcher<T>): T[] {
  if (typeof equals !== "function") {
    return Array.from(new Set(value));
  }
  return value.reduce<T[]>((acc, item) => {
    const index = acc.findIndex((e) => equals(e, item));
    if (index === -1) acc.push(item);
    return acc;
  }, []);
}

/**
 * Get nth item of Array. Negative for backward
 * @param array The array to get the item from
 * @param index The index of the item to get.
 * @category Array
 */
export function at(array: readonly [], index: number): undefined;
export function at<T>(array: readonly T[], index: number): T;
export function at<T>(array: readonly T[] | [], index: number): T | undefined {
  const len = array.length;
  if (!len) return undefined;
  if (index < 0) index += len;
  return array[index];
}

/**
 * Get last item
 * @category Array
 */
export function last(array: readonly []): undefined;
export function last<T>(array: readonly T[]): T;
export function last<T>(array: readonly T[]): T | undefined {
  return at(array, -1);
}

/**
 * Get first item
 * @category Array
 */
export function first(array: readonly []): undefined;
export function first<T>(array: readonly T[]): T;
export function first<T>(array: readonly T[]): T | undefined {
  return at(array, 0);
}

/**
 * Generate a range array of numbers.
 * @category Array
 */
export function range(stop: number): number[];
export function range(start: number, stop: number, step?: number): number[];
export function range(...args: [number] | [number, number, number?]): number[] {
  let start = 0;
  let stop: number;
  let step = 1;
  if (args.length === 1) {
    [stop] = args;
  } else {
    [start, stop, step = 1] = args;
  }
  const array: number[] = [];
  let current = start;
  while (current < stop) {
    array.push(current);
    current += step;
  }
  return array;
}

type Predicate<T> = (item: T, index: number, array: T[]) => boolean;

/**
 * Filter an array in place (faster than Array.filter)
 * @param array The array to filter
 * @param predicate The predicate function to use to filter the array
 * @category Array
 */
export function toFiltered<T>(array: T[], predicate: Predicate<T>): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i], i, array)) array.splice(i, 1);
  }
  return array;
}

/**
 * Move an item in an array to a new position
 * @param array The array to move the item in
 * @param from The index of the item to move
 * @param to The index to move the item to
 * @category Array
 */
export function move<T>(array: T[], from: number, to: number): T[] {
  if (isEmptyArray(array)) return array;
  if (from === to) return array;
  const item = array[from];
  array.splice(from, 1);
  array.splice(to, 0, item);
  return array;
}

/**
 * Chunk an array into smaller arrays of a given size
 * @param array The array to chunk
 * @param size The size of the chunks
 * @category Array
 */
export function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce<T[][]>((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(item);
    return acc;
  }, []);
}
