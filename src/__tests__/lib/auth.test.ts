import { describe, it, expect } from "vitest";

describe("Auth Config", () => {
  it("exports auth function", async () => {
    const { auth } = await import("@/lib/auth/auth");
    expect(typeof auth).toBe("function");
  });

  it("auth returns null when not authenticated", async () => {
    const { auth } = await import("@/lib/auth/auth");
    const session = await auth();
    // In test environment without cookies, should return null
    expect(session).toBeNull();
  });
});
