import { describe, expect, it } from "bun:test";
import { charset, nanoid } from "./index";

describe("nanoid", () => {
  it("should be ready for 0 size", () => {
    expect(nanoid(0)).toBe("");
  });

  it("should generates URL-friendly IDs", () => {
    const charset = `abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789`;
    for (let i = 0; i < 100; i++) {
      const id = nanoid();
      expect(id.length).toBe(21);
      expect(typeof id).toBe("string");
      for (const char of id) expect(charset.includes(char)).toBe(true);
    }
  });

  it("should generate IDs with with given length", () => {
    expect(nanoid(10).length).toBe(10);
  });

  it("should not have any collisions", () => {
    const ids = new Set<string>();
    const iterations = 100_000;
    for (let i = 0; i < iterations; i++) {
      const id = nanoid();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }
    expect(ids.size).toBe(iterations);
  });

  it("should generate IDs with with given alphabet", () => {
    const alphabet = "0123456789abcdef";
    const id = nanoid(21, alphabet);
    expect(id.length).toBe(21);
    for (const char of id) expect(alphabet.includes(char)).toBe(true);
  });

  it("should avoid pool pollution, infinite loop", () => {
    nanoid(2.1);
    const second = nanoid();
    const third = nanoid();
    expect(second).not.toBe(third);
  });

  it("should have flat distribution", () => {
    const length = 21;
    const iterations = 100_000;
    const charCounts: Record<string, number> = {};
    // Initialize counts
    for (const char of charset) {
      charCounts[char] = 0;
    }
    // Generate IDs and count character occurrences
    for (let i = 0; i < iterations; i++) {
      const id = nanoid(length, charset);
      for (const char of id) charCounts[char]++;
    }
    // Calculate expected frequency (each character should appear roughly equally)
    const totalChars = iterations * length;
    const expectedFrequency = totalChars / charset.length;
    const tolerance = expectedFrequency * 0.1; // 10% tolerance
    // Check that each character appears roughly equally
    for (const char of charset) {
      const actualFrequency = charCounts[char];
      expect(actualFrequency).toBeGreaterThan(expectedFrequency - tolerance);
      expect(actualFrequency).toBeLessThan(expectedFrequency + tolerance);
    }
    // Check that the distribution is uniform
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    for (const char of charset) {
      const observed = charCounts[char];
      const dist = (observed * charset.length) / (iterations * length);
      if (dist > max) max = dist;
      if (dist < min) min = dist;
    }
    expect(max - min).toBeLessThan(0.06);
  });
});
