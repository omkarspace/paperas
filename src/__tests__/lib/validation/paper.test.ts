import { describe, it, expect } from "vitest";
import { canTransition } from "@/lib/validation/paper";

describe("canTransition", () => {
  it("allows DRAFT → SUBMITTED", () => {
    expect(canTransition("DRAFT", "SUBMITTED")).toBe(true);
  });

  it("blocks DRAFT → PUBLISHED", () => {
    expect(canTransition("DRAFT", "PUBLISHED")).toBe(false);
  });

  it("allows UNDER_REVIEW → ACCEPTED", () => {
    expect(canTransition("UNDER_REVIEW", "ACCEPTED")).toBe(true);
  });

  it("blocks PUBLISHED → anything", () => {
    expect(canTransition("PUBLISHED", "DRAFT")).toBe(false);
    expect(canTransition("PUBLISHED", "SUBMITTED")).toBe(false);
  });

  it("allows REVISION_REQUESTED → SUBMITTED", () => {
    expect(canTransition("REVISION_REQUESTED", "SUBMITTED")).toBe(true);
  });
});
