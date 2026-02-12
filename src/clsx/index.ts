import { isArray, isNumber, isObject, isString } from "@/assertions";
import { ClassNameValue } from "@/types";

function toClassValue(value: ClassNameValue): string {
  let names = "";
  let temp: string;
  if (isString(value) || isNumber(value)) {
    if (value) {
      names += value.toString().trim();
    }
  } else if (isArray(value)) {
    for (const item of value) {
      temp = toClassValue(item);
      if (!temp) continue;
      if (names) names += " ";
      names += temp;
    }
  } else if (isObject(value)) {
    for (const key in value) {
      if (!value[key]) continue;
      if (names) names += " ";
      names += key;
    }
  }
  return names;
}

/**
 * Utility function to construct class names conditionally
 * @category ClassNames
 */
export function clsx(...inputs: ClassNameValue[]): string {
  let result = "";
  let temp: string | undefined;
  for (const arg of inputs) {
    if (!arg) continue;
    temp = toClassValue(arg);
    if (!temp) continue;
    if (result) result += " ";
    result += temp;
  }
  return result;
}

export type { ClassNameValue };
