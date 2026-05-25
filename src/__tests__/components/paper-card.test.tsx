import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaperCard } from "@/components/papers/paper-card";

const mockPaper = {
  id: "1",
  paperId: "RVJ-2026-0001",
  title: "Test Paper Title",
  abstract: "This is a test abstract for the paper card component to verify rendering.",
  keywords: "test, paper",
  pdfUrl: null,
  supplementaryUrls: "",
  status: "PUBLISHED" as const,
  submissionDate: null,
  publicationDate: new Date("2026-01-15"),
  volume: null,
  issue: null,
  authorId: "author-1",
  author: { id: "author-1", name: "John Doe", email: "john@example.com", role: "AUTHOR" as const, image: null, institution: "Test Univ" },
  category: { id: "cat-1", name: "Computer Science" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("PaperCard", () => {
  it("renders paper title", () => {
    render(<PaperCard paper={mockPaper as Parameters<typeof PaperCard>[0]["paper"]} />);
    expect(screen.getByText("Test Paper Title")).toBeDefined();
  });

  it("renders author name", () => {
    render(<PaperCard paper={mockPaper as Parameters<typeof PaperCard>[0]["paper"]} />);
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders category badge", () => {
    render(<PaperCard paper={mockPaper as Parameters<typeof PaperCard>[0]["paper"]} />);
    expect(screen.getByText("Computer Science")).toBeDefined();
  });

  it("renders link to paper detail page", () => {
    render(<PaperCard paper={mockPaper as Parameters<typeof PaperCard>[0]["paper"]} />);
    const link = screen.getByText("Test Paper Title").closest("a");
    expect(link?.getAttribute("href")).toBe("/research/RVJ-2026-0001");
  });
});
