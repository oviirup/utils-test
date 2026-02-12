import { describe, expect, it } from "bun:test";
import { AbbreviationSymbols, abbreviate } from "./index";

describe("abbreviate", () => {
  it.each([
    [1_742, "1.7K"],
    [1_8364, "18.4K"],
    [1_0701, "10.7K"],
    [1_500_000, "1.5M"],
    [9_876_543, "9.9M"],
    [1_234_567_890, "1.2B"],
    [5_876_543_210, "5.9B"],
    [3_500_000_000_000, "3.5T"],
    [7_654_321_987_654, "7.7T"],
  ])("positive values: %d > %s", (value, expected) => {
    expect(abbreviate(value)).toBe(expected);
  });

  it.each([
    [-2_345, "-2.3K"],
    [-15_432, "-15.4K"],
    [-43_600, "-43.6K"],
    [-3_892_400, "-3.9M"],
    [-24_187_543, "-24.2M"],
    [-4_584_321_987, "-4.6B"],
    [-98_000_000_101, "-98.0B"],
    [-1_700_234_567_890, "-1.7T"],
    [-3_190_000_000_000, "-3.2T"],
  ])("negative values: %d -> %s", (value, expected) => {
    expect(abbreviate(value)).toBe(expected);
  });

  it("should handle custom precision", () => {
    expect(abbreviate(1234, 0)).toBe("1K");
    expect(abbreviate(1500, 2)).toBe("1.50K");
    expect(abbreviate(9_876_543, 3)).toBe("9.877M");
    expect(abbreviate(56_789, 2)).toBe("56.79K");
    expect(abbreviate(-1_234_567, 0)).toBe("-1M");
    expect(abbreviate(-2_345_678, 2)).toBe("-2.35M");
  });

  it("should handle custom precision options", () => {
    expect(abbreviate(1234567, { precision: 3 })).toBe("1.235M");
    expect(abbreviate(999500, { precision: 0 })).toBe("1M");
    expect(abbreviate(-8765432, { precision: 2 })).toBe("-8.77M");
  });

  it("should handle custom symbols", () => {
    const bytes_symbol: AbbreviationSymbols = {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    };
    expect(abbreviate(1234567, { symbols: bytes_symbol })).toBe("1.2MB");
    expect(abbreviate(999500, { symbols: bytes_symbol })).toBe("1.0MB");
    expect(abbreviate(8765432, { symbols: bytes_symbol })).toBe("8.4MB");

    const mass_symbols: AbbreviationSymbols = {
      g: 1,
      kg: 1e3,
      ton: 1e6,
    };
    expect(abbreviate(500, { symbols: mass_symbols })).toBe("500.0g");
    expect(abbreviate(1500, { symbols: mass_symbols })).toBe("1.5kg");
    expect(abbreviate(1234567, { symbols: mass_symbols })).toBe("1.2ton");
    expect(abbreviate(-1500, { symbols: mass_symbols })).toBe("-1.5kg");
  });
});
