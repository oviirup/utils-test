import { randomBytes } from "node:crypto";

export const charset = `abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789`;

/**
 * Generate a secure nanoid string using Node.js crypto module.
 * @param length - Length of the ID (default: 21)
 * @param alphabets - Alphabet to use for the ID
 * @returns A cryptographically secure unique ID string
 * @source https://github.com/ai/nanoid
 */
export function nanoid(length = 21, alphabets = charset): string {
  const size = alphabets.length;
  if (size === 0 || size > 255) {
    throw new Error("Alphabet must contain less than 255 characters");
  }
  const mask = (2 << Math.floor(Math.log2(size - 1))) - 1;
  const step = Math.ceil((1.6 * mask * length) / size);
  let id = "";
  while (id.length < length) {
    const bytes = randomBytes(step);
    for (let i = 0; i < step && id.length < length; i++) {
      const index = bytes[i] & mask;
      if (index < size) id += alphabets[index];
    }
  }
  return id;
}
