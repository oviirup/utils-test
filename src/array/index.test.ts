import { describe, expect, it, test } from "bun:test";
import * as array from "./index";

describe("array", () => {
  // biome-ignore format: off
  describe("toArray", () => {
    it.each([
      [1, [1]],
      [[1, 2, 3], [1, 2, 3],],
      [null, []],
      [undefined, []],
      ["foo", ["foo"]],
      [["foo"], ["foo"]],
    ])("should convert %p to %p", (input, output) => {
      expect(array.toArray(input)).toEqual(output);
    });
  });

  test("range", () => {
    expect(array.range(0)).toEqual([]);
    expect(array.range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(array.range(2, 5)).toEqual([2, 3, 4]);
    expect(array.range(2, 10, 2)).toEqual([2, 4, 6, 8]);
  });

  describe("chunk", () => {
    it("returns empty array for empty input", () => {
      expect(array.chunk([], 2)).toEqual([]);
    });
    it("splits array into chunks of given size", () => {
      expect(array.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("returns single chunk when size is greater than array length", () => {
      expect(array.chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
    });
    it("returns one element per chunk when size is 1", () => {
      expect(array.chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
    it("produces equal-sized chunks when length is divisible by size", () => {
      expect(array.chunk([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
    it("works with string arrays", () => {
      expect(array.chunk(["a", "b", "c", "d"], 2)).toEqual([
        ["a", "b"],
        ["c", "d"],
      ]);
    });
  });
});
