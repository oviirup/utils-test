import { MaybePromise } from "@/types";
import { isNumber } from "../assertions";

/**
 * Delays execution for a specified number of milliseconds
 * @param delay The delay in milliseconds (must be a positive finite number)
 * @returns A promise that resolves after the specified delay
 * @category promise
 */
export function sleep(delay: number): Promise<void> {
  if (!isNumber(delay)) {
    throw new TypeError("sleep: delay must be a number");
  } else if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError("sleep: delay must be a positive finite number");
  }
  if (delay === 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Retries a function until it succeeds or the maximum number of retries is reached
 * @param func The function to retry
 * @param retries The number of retries
 * @param delay The delay between retries (optional)
 * @returns The result of the function
 * @category promise
 */
export async function retry<T>(
  func: () => Promise<T>,
  retries: number,
  delay: number = 0,
): Promise<T> {
  try {
    return await func();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(func, retries - 1, delay);
    }
    throw error;
  }
}

/**
 * Wraps a promise or function and returns a result object with discriminated union
 * @param input A promise or function that returns a promise/value
 * @returns A tuple [value, error] where value is the result or null, and error is undefined or the error
 * @category promise
 */
export async function tryCatch<T, E = Error>(
  input: Promise<T> | (() => MaybePromise<T>),
) {
  try {
    const value = typeof input === "function" ? await input() : await input;
    return [value, undefined] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
