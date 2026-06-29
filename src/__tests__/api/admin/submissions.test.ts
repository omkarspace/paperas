import { describe, it, expect } from "vitest";
import { canTransition, updatePaperStatusSchema } from "@/lib/validation/paper";

describe("Admin Submissions PATCH Validation", () => {
  it("accepts valid status values", () => {
    const data = { status: "ACCEPTED" };
    expect(updatePaperStatusSchema.safeParse(data).success).toBe(true);
  });

  it("rejects invalid status values", () => {
    const data = { status: "INVALID_STATUS" };
    expect(updatePaperStatusSchema.safeParse(data).success).toBe(false);
  });

  it("rejects missing status field", () => {
    const data = {};
    expect(updatePaperStatusSchema.safeParse(data).success).toBe(false);
  });
});

describe("Admin Submissions PATCH State Transitions", () => {
  it("allows valid transitions for submissions", () => {
    expect(canTransition("SUBMITTED", "UNDER_REVIEW")).toBe(true);
    expect(canTransition("UNDER_REVIEW", "ACCEPTED")).toBe(true);
    expect(canTransition("UNDER_REVIEW", "REJECTED")).toBe(true);
    expect(canTransition("UNDER_REVIEW", "REVISION_REQUESTED")).toBe(true);
  });

  it("blocks invalid transitions from terminal states", () => {
    expect(canTransition("PUBLISHED", "SUBMITTED")).toBe(false);
    expect(canTransition("REJECTED", "SUBMITTED")).toBe(false);
  });
});
