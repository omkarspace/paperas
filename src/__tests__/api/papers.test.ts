import { describe, it, expect } from "vitest";
import { z } from "zod";

const paperSchema = z.object({
  title: z.string().min(1).max(200),
  abstract: z.string().min(150).max(5000),
  keywords: z.string().min(3).max(200),
});

describe("Papers API Validation", () => {
  it("accepts valid paper submission data", () => {
    const data = {
      title: "Advances in Machine Learning Research",
      abstract:
        "This paper presents a comprehensive study of recent advances in machine learning. We analyze state-of-the-art techniques and their applications across various domains. Our findings suggest significant improvements in model efficiency and accuracy.",
      keywords: "machine learning, deep learning, AI",
    };
    expect(paperSchema.safeParse(data).success).toBe(true);
  });

  it("rejects empty title", () => {
    const data = {
      title: "",
      abstract: "x".repeat(150),
      keywords: "test, data",
    };
    expect(paperSchema.safeParse(data).success).toBe(false);
  });

  it("rejects abstract too short", () => {
    const data = {
      title: "Valid Title",
      abstract: "Too short",
      keywords: "test, data",
    };
    expect(paperSchema.safeParse(data).success).toBe(false);
  });

  it("rejects empty keywords", () => {
    const data = {
      title: "Valid Title",
      abstract: "x".repeat(150),
      keywords: "",
    };
    expect(paperSchema.safeParse(data).success).toBe(false);
  });
});
