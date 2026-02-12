/**
 * Replace backslash to slash
 * @category String
 */
export function slash(str: string): string {
  return str.replace(/\\/g, "/");
}

/**
 * Truncates a string to the specified length, adding "..." if it was longer.
 * @param text The string to truncate
 * @param length Maximum allowed length before truncation (default: 80)
 * @category String
 */
export function truncate(input: string, length = 80): string {
  if (!input) return input;
  const text = input.trim();
  const maxLength = Math.max(3, length);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
