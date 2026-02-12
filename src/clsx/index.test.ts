import { describe, expect, it } from "bun:test";
import { clsx } from "./index";

describe("clsx", () => {
  it("should keep object keys only with truthy values", () => {
    const out = clsx({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 });
    expect(out).toBe("a f");
  });

  it("should join arrays of class names and ignore falsy values", () => {
    const out = clsx("a", 0, null, undefined, true, 1, "b");
    expect(out).toBe("a 1 b");
  });

  it("should support heterogenous arguments", () => {
    expect(clsx({ a: true }, "b", 0)).toBe("a b");
  });

  it("should trim empty strings", () => {
    expect(clsx("   ", "b", {}, "")).toBe("b");
  });

  it("should return an empty string for an empty configuration", () => {
    expect(clsx({})).toBe("");
  });

  it("should support an array of class names", () => {
    expect(clsx(["a", "b"])).toBe("a b");
  });

  it("should join array arguments with string arguments", () => {
    expect(clsx(["a", "b"], "c")).toBe("a b c");
    expect(clsx("c", ["a", "b"])).toBe("c a b");
  });

  it("should handle multiple array arguments", () => {
    expect(clsx(["a", "b"], ["c", "d"])).toBe("a b c d");
  });

  it("should handle arrays that include falsy and true values", () => {
    expect(clsx(["a", 0, null, undefined, false, true, "b"])).toBe("a b");
  });

  it("should handle arrays that include arrays", () => {
    expect(clsx(["a", ["b", "c"]])).toBe("a b c");
  });

  it("should handle arrays that include objects", () => {
    expect(clsx(["a", { b: true, c: false }])).toBe("a b");
  });

  it("should handle deep array recursion", () => {
    expect(clsx(["a", ["b", ["c", { d: true }]]])).toBe("a b c d");
  });

  it("should handle empty arrays", () => {
    expect(clsx("a", [])).toBe("a");
  });

  it("should handle nested arrays that have empty nested arrays", () => {
    expect(clsx("a", [[]])).toBe("a");
  });

  it("should handle all types of truthy and falsy property values as expected", () => {
    const out = clsx({
      // falsy:
      null: null,
      emptyString: "",
      noNumber: NaN,
      zero: 0,
      negativeZero: -0,
      false: false,
      undefined: undefined,
      // truthy (literally anything else):
      nonEmptyString: "foobar",
      whitespace: " ",
      function: Object.prototype.toString,
      emptyObject: {},
      nonEmptyObject: { a: 1, b: 2 },
      emptyList: [],
      nonEmptyList: [1, 2, 3],
      greaterZero: 1,
    });

    expect(out).toBe(
      "nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero",
    );
  });
});
