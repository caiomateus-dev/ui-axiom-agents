import { describe, expect, it } from "vitest";

import { maskKey } from "./mask-key";

describe("maskKey", () => {
  it("returns key unchanged when length <= 8", () => {
    expect(maskKey("abcd1234")).toBe("abcd1234");
    expect(maskKey("short")).toBe("short");
  });

  it("masks a long key showing first 4 and last 4 chars", () => {
    const key = "sk-abc1234567890xyz";
    const result = maskKey(key);
    expect(result.startsWith("sk-a")).toBe(true);
    expect(result.endsWith("0xyz")).toBe(true);
    expect(result).toContain("\u2022");
  });

  it("returns exactly first4 + 16 bullets + last4", () => {
    const key = "abcdefghijklmnopqrstuvwxyz";
    const result = maskKey(key);
    expect(result).toBe("abcd" + "\u2022".repeat(16) + "wxyz");
  });
});
