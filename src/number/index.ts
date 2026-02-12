import { isNumber, isObject } from "@/assertions";
import { AbbreviateOptions, AbbreviationSymbols, Dictionary } from "@/types";

/**
 * Checks if a number is within a range
 * @param val The number to check
 * @param min Minimum value
 * @param max Maximum value
 * @category Number
 */
export function inRange(val: number, min: number, max: number): boolean {
  return val >= min && val <= max;
}

/**
 * Clamps a number between a minimum and maximum value
 * @param val The number to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @category Number
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

const baseAbbreviationSymbols = ["", "K", "M", "B", "T"];

/**
 * Abbreviates a number to a string with a symbol and a precision
 * @param value - The number to abbreviate
 * @param arg - The precision or options to use for the abbreviation
 * @category Number
 */
export function abbreviate(value: number, precision?: number): string;
export function abbreviate(value: number, options?: AbbreviateOptions): string;
export function abbreviate(
  value: number,
  arg?: number | AbbreviateOptions | undefined,
): string {
  if (!isNumber(value)) return "0";
  // parse arguments
  let precision = 1;
  let symbols: AbbreviationSymbols = baseAbbreviationSymbols;
  if (typeof arg === "number") {
    precision = arg;
  } else if (typeof arg === "object") {
    precision = arg.precision ?? 1;
    symbols = arg.symbols ?? baseAbbreviationSymbols;
  }
  // get threshold symbols as tuples
  const thresholds: [string, number][] = isObject<Dictionary<number>>(symbols)
    ? Object.entries(symbols)
    : symbols.map((symbol, i) => [symbol, 10 ** (i * 3)]);
  // sort thresholds from largest to smallest
  thresholds.sort((a, b) => b[1] - a[1]);
  // handle negative values
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  // find the appropriate symbol
  for (const [symbol, threshold] of thresholds) {
    const frac = (abs / threshold).toFixed(precision);
    if (Number(frac) < 1) continue;
    return `${sign}${frac}${symbol}`;
  }
  // if the number is an integer, return it as is
  if (Math.floor(abs) === abs) return value.toString();
  return `${sign}${abs.toFixed(precision)}`;
}

export type { AbbreviateOptions, AbbreviationSymbols };
