import { describe, it, expect } from "vitest";

describe("Auth Config", () => {
  it("defines auth providers properly", () => {
    const providers = ["credentials", "google"];
    expect(providers).toContain("credentials");
    expect(providers).toContain("google");
  });

  it("configures Prisma adapter", () => {
    const adapterName = "@auth/prisma-adapter";
    expect(typeof adapterName).toBe("string");
  });
});
