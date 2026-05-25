import { describe, it, expect } from "vitest";
import { z } from "zod";

const reviewSchema = z.object({
  paperId: z.string().min(1),
  comments: z.string().min(50).max(5000),
  recommendation: z.enum(["ACCEPT", "MINOR_REVISION", "MAJOR_REVISION", "REJECT"]),
  rating: z.number().min(1).max(5).optional(),
});

describe("Reviews API Validation", () => {
  it("accepts valid review data", () => {
    const data = {
      paperId: "paper-123",
      comments:
        "This is a well-written paper with clear methodology and strong results. The authors have addressed the research questions effectively. I recommend minor revisions to improve clarity.",
      recommendation: "MINOR_REVISION" as const,
      rating: 4,
    };
    expect(reviewSchema.safeParse(data).success).toBe(true);
  });

  it("rejects short comments", () => {
    const data = {
      paperId: "paper-123",
      comments: "Good paper",
      recommendation: "ACCEPT" as const,
    };
    expect(reviewSchema.safeParse(data).success).toBe(false);
  });

  it("rejects invalid recommendation", () => {
    const data = {
      paperId: "paper-123",
      comments: "x".repeat(50),
      recommendation: "INVALID",
    };
    expect(reviewSchema.safeParse(data as Record<string, unknown>).success).toBe(false);
  });

  it("rejects rating out of range", () => {
    const data = {
      paperId: "paper-123",
      comments: "x".repeat(50),
      recommendation: "ACCEPT" as const,
      rating: 10,
    };
    expect(reviewSchema.safeParse(data).success).toBe(false);
  });
});
