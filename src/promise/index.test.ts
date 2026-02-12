import { describe, expect, it } from "bun:test";
import { retry, sleep, tryCatch } from ".";

describe("promise", () => {
  describe("sleep", () => {
    it("should resolve after the specified delay", async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some tolerance
      expect(elapsed).toBeLessThan(200);
    });

    it("should resolve immediately for 0 delay", async () => {
      const start = Date.now();
      await sleep(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10);
    });

    it("should throw TypeError for non-number input", () => {
      expect(() => sleep("100" as any)).toThrow(TypeError);
      expect(() => sleep(null as any)).toThrow(TypeError);
      expect(() => sleep(undefined as any)).toThrow(TypeError);
      expect(() => sleep({} as any)).toThrow(TypeError);
    });

    it("should throw RangeError for negative numbers", () => {
      expect(() => sleep(-1)).toThrow(RangeError);
      expect(() => sleep(-100)).toThrow(RangeError);
    });

    it("should throw RangeError for non-finite numbers", () => {
      expect(() => sleep(Infinity)).toThrow(RangeError);
      expect(() => sleep(-Infinity)).toThrow(RangeError);
      expect(() => sleep(NaN)).toThrow(TypeError);
    });
  });
  describe("retry", () => {
    it("should succeed on first try", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        return "success";
      };
      const result = await retry(func, 3);
      expect(result).toBe("success");
      expect(attempts).toBe(1);
    });

    it("should retry on failure and eventually succeed", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("fail");
        }
        return "success";
      };
      const result = await retry(func, 3);
      expect(result).toBe("success");
      expect(attempts).toBe(3);
    });

    it("should throw error after max retries", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        throw new Error("always fail");
      };
      await expect(retry(func, 2)).rejects.toThrow("always fail");
      expect(attempts).toBe(3); // Initial attempt + 2 retries
    });

    it("should respect delay between retries", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error("fail");
        }
        return "success";
      };
      const start = Date.now();
      const result = await retry(func, 3, 50);
      const elapsed = Date.now() - start;
      expect(result).toBe("success");
      expect(attempts).toBe(2);
      expect(elapsed).toBeGreaterThanOrEqual(40); // At least one delay
      expect(elapsed).toBeLessThan(200);
    });

    it("should work with 0 retries (fail immediately)", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        throw new Error("fail");
      };
      await expect(retry(func, 0)).rejects.toThrow("fail");
      expect(attempts).toBe(1); // Only initial attempt
    });

    it("should work with 0 delay", async () => {
      let attempts = 0;
      const func = async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error("fail");
        }
        return "success";
      };
      const start = Date.now();
      const result = await retry(func, 3, 0);
      const elapsed = Date.now() - start;
      expect(result).toBe("success");
      expect(attempts).toBe(2);
      expect(elapsed).toBeLessThan(50); // Should be very fast with 0 delay
    });
  });
  describe("tryCatch", () => {
    it("should return [value, undefined] on success with promise", async () => {
      const promise = Promise.resolve("success");
      const [value, error] = await tryCatch(promise);
      expect(value).toBe("success");
      expect(error).toBeUndefined();
    });

    it("should return [null, error] on failure with promise", async () => {
      const promise = Promise.reject(new Error("test error"));
      const [value, error] = await tryCatch(promise);
      expect(value).toBeNull();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("test error");
    });

    it("should return [value, undefined] on success with function", async () => {
      const func = async () => "success";
      const [value, error] = await tryCatch(func);
      expect(value).toBe("success");
      expect(error).toBeUndefined();
    });

    it("should return [null, error] on failure with function", async () => {
      const func = async () => {
        throw new Error("test error");
      };
      const [value, error] = await tryCatch(func);
      expect(value).toBeNull();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("test error");
    });

    it("should handle synchronous functions", async () => {
      const func = () => "sync success";
      const [value, error] = await tryCatch(func);
      expect(value).toBe("sync success");
      expect(error).toBeUndefined();
    });

    it("should handle synchronous functions that throw", async () => {
      const func = () => {
        throw new Error("sync error");
      };
      const [value, error] = await tryCatch(func);
      expect(value).toBeNull();
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("sync error");
    });

    it("should preserve error type", async () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = "CustomError";
        }
      }
      const promise = Promise.reject(new CustomError("custom"));
      const [value, error] = await tryCatch(promise);
      expect(value).toBeNull();
      expect(error).toBeInstanceOf(CustomError);
      expect((error as CustomError).name).toBe("CustomError");
    });

    it("should handle non-Error thrown values", async () => {
      const promise = Promise.reject("string error");
      const [value, error] = await tryCatch<string, string | Error>(promise);
      expect(value).toBeNull();
      expect(error).toBe("string error");
    });
  });
});
