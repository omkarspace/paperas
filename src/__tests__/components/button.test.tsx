import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("applies default variant classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByText("Default");
    expect(button.className).toContain("bg-primary");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText("Outline");
    expect(button.className).toContain("border-input");
  });

  it("applies size classes", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText("Large");
    expect(button.className).toContain("h-11");
  });
});
