import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "./format-date";

describe("formatDate", () => {
  it("formats a valid ISO date to pt-BR", () => {
    const result = formatDate("2024-03-15T10:30:00Z");
    expect(result).toBe("15/03/2024");
  });

  it('returns "-" for null', () => {
    expect(formatDate(null)).toBe("-");
  });

  it('returns "-" for empty string', () => {
    expect(formatDate("")).toBe("-");
  });
});

describe("formatDateTime", () => {
  it("formats a valid ISO date with time to pt-BR", () => {
    const result = formatDateTime("2024-03-15T10:30:00Z");
    expect(result).toMatch(/15\/03\/2024/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
