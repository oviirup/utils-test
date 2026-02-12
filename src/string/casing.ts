import { isEmpty } from "@/assertions";

const reWords =
  /\p{Lu}?\p{Ll}+(?:[''](?:d|ll|m|re|s|t|ve))?(?=[\p{Z}\p{P}\p{S}_-]|\p{Lu}|$)|(?:\p{Lu}|[^\p{Z}\p{N}\p{Emoji_Presentation}\p{L}_-])+(?:[''](?:D|LL|M|RE|S|T|VE))?(?=[\p{Z}\p{P}\p{S}_-]|\p{Lu}(?:\p{Ll}|[^\p{Z}\p{N}\p{Emoji_Presentation}\p{L}_-])|$)|(?:\p{Lu}?[\p{Ll}\p{L}]+(?:[''](?:d|ll|m|re|s|t|ve))?|\p{Lu}+(?:[''](?:D|LL|M|RE|S|T|VE))?|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|\p{Lu})|\d+|\p{Emoji}+)/gu;

/**
 * Splits a string into an array of words using Unicode-aware matching.
 * @param str The input string to split into words.
 * @returns An array of words found in the input string.
 */
function words(str: string): string[] {
  return str.match(reWords) || [];
}

/**
 * Joins the words in a string with the specified delimiter and converts the result to lowercase.
 * @param str The input string to split into words and join.
 * @param d The delimiter to use when joining the words.
 * @returns The joined string in lowercase.
 */
function join(str: string, d: string): string {
  return words(str).join(d).toLowerCase();
}

/**
 * Capitalizes the first letter of a string
 * @param str The string to convert
 * @category String
 * @returns The string with the first letter capitalized
 */
function toUcFirst(str: string): string {
  if (isEmpty(str)) return "";
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Converts a string to `camelCase`
 * @param str The string to convert
 * @category String
 * @returns The CamelCase string
 */
export function toCamelCase(str: string): string {
  return words(str).reduce((acc, next, i) => {
    if (!next) return acc;
    if (i === 0) return next.toLowerCase();
    return acc + next[0].toUpperCase() + next.slice(1).toLowerCase();
  }, "");
}

/**
 * Converts a string to `PascalCase`
 * @param str The string to convert
 * @category String
 * @returns The PascalCase string
 */
export function toPascalCase(str: string): string {
  return toUcFirst(toCamelCase(str));
}

/**
 * Converts a string to `snake_case`
 * @param str The string to convert
 * @category String
 * @returns The SnakeCase string
 */
export function toSnakeCase(str: string): string {
  return join(str, "_");
}

/**
 * Converts a string to `kebab-case`
 * @param str The string to convert
 * @category String
 * @returns The KebabCase string
 */
export function toKebabCase(str: string): string {
  return join(str, "-");
}

/**
 * Converts a string to `Sentence case`
 * @param str The string to convert
 * @category String
 * @returns The SentenceCase string
 */
export function toSentenceCase(str: string): string {
  return toUcFirst(join(str, " "));
}

/**
 * Converts a string to `Title Case`
 * @param str The string to convert
 * @category String
 * @returns The TitleCase string
 */
export function toTitleCase(str: string): string {
  return words(str).map(toUcFirst).join(" ");
}
