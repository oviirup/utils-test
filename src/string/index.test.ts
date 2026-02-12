import { describe, expect, it } from "bun:test";
import * as string from "./index";

describe("string", () => {
  describe("truncate", () => {
    it("should return the original string if its length is under specified length", () => {
      const text = "Short text";
      const length = 20;
      expect(string.truncate(text, length)).toBe(text);
    });
    it('should truncate the string and add "..." at end', () => {
      const text = "This is a very long text that needs truncation";
      const length = 20;
      expect(string.truncate(text, length)).toBe("This is a very lo...");
    });
    it("should handle strings with exact length equal to the specified length", () => {
      const text = "Exact length text";
      const length = text.length;
      expect(string.truncate(text, length)).toBe(text);
    });
    it("should handle empty strings", () => {
      expect(string.truncate("", 10)).toBe("");
    });
    it("should handle negative length by using the ellipsis length", () => {
      const text = "Negative length example";
      const length = -5;
      expect(string.truncate(text, length)).toBe("...");
    });
  });
  describe("slash", () => {
    it.each([
      { input: "\\123", expected: "/123" },
      { input: "\\\\", expected: "//" },
      { input: "\\h\\i", expected: "/h/i" },
      { input: "C:\\Users\\John", expected: "C:/Users/John" },
    ])("should convert $input to $expected", ({ input, expected }) => {
      expect(string.slash(input)).toEqual(expected);
    });
  });
});
