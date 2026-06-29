import { describe, it, expect } from "vitest";
import { z } from "zod";

const settingsSchema = z.record(z.string(), z.string());

describe("Admin Settings PUT Validation", () => {
  it("accepts valid settings (all string values)", () => {
    const data = {
      siteName: "Research Verse",
      maintext: "Welcome to our journal",
    };
    expect(settingsSchema.safeParse(data).success).toBe(true);
  });

  it("accepts empty object", () => {
    expect(settingsSchema.safeParse({}).success).toBe(true);
  });

  it("rejects nested object values", () => {
    const data = {
      siteName: { nested: "value" },
    };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });

  it("rejects array values", () => {
    const data = {
      tags: ["a", "b"],
    };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });

  it("rejects numeric values", () => {
    const data = {
      count: 42,
    };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });

  it("rejects boolean values", () => {
    const data = {
      enabled: true,
    };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });

  it("rejects null values", () => {
    const data = {
      key: null,
    };
    expect(settingsSchema.safeParse(data).success).toBe(false);
  });
});
