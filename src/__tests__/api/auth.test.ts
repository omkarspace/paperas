import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

describe("Auth API Validation", () => {
  describe("Registration", () => {
    it("accepts valid registration data", () => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        password: "securePassword123",
      };
      expect(registerSchema.safeParse(data).success).toBe(true);
    });

    it("rejects short password", () => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        password: "short",
      };
      expect(registerSchema.safeParse(data).success).toBe(false);
    });

    it("rejects invalid email", () => {
      const data = {
        name: "John Doe",
        email: "not-an-email",
        password: "securePassword123",
      };
      expect(registerSchema.safeParse(data).success).toBe(false);
    });
  });

  describe("Login", () => {
    it("accepts valid login data", () => {
      const data = {
        email: "john@example.com",
        password: "password123",
      };
      expect(loginSchema.safeParse(data).success).toBe(true);
    });

    it("rejects empty password", () => {
      const data = {
        email: "john@example.com",
        password: "",
      };
      expect(loginSchema.safeParse(data).success).toBe(false);
    });
  });
});
