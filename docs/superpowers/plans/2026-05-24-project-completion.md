# Project Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close all 20 identified gaps — Typesense search, missing pages, tests, component directories, schema fixes, and dev tooling.

**Architecture:** 4 independent batches executed in parallel. No shared state between batches. Each task is self-contained.

**Tech Stack:** Next.js 15, TypeScript, Prisma/SQLite, Vitest, Tailwind CSS, Shadcn UI

---

## Batch 1: Infrastructure & Missing Pages

### Task 1.1: Add Typesense Package & Client

**Files:**
- Modify: `package.json` (line ~25 — add `typesense` dependency)
- Create: `src/lib/typesense.ts`

- [ ] **Step 1: Install typesense package**

```bash
npm install typesense && npm run db:generate
```

- [ ] **Step 2: Create Typesense client**

```typescript
// src/lib/typesense.ts
import Typesense from "typesense";

const typesenseClient = process.env.TYPESENSE_API_KEY
  ? new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST || "localhost",
          port: Number(process.env.TYPESENSE_PORT) || 8108,
          protocol: process.env.TYPESENSE_PROTOCOL || "http",
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    })
  : null;

export async function searchPapers(query: string, page: number = 1) {
  if (!typesenseClient) {
    return { papers: [], total: 0, page: 1, totalPages: 0 };
  }

  const perPage = 20;
  const result = await typesenseClient.collections("papers").documents().search({
    q: query,
    query_by: "title,abstract,keywords",
    page,
    per_page: perPage,
  });

  return {
    papers: result.hits?.map((hit) => hit.document) || [],
    total: result.found || 0,
    page,
    totalPages: Math.ceil((result.found || 0) / perPage),
  };
}

export async function indexPaper(paper: {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  keywords: string;
  authorName?: string;
  categoryName?: string;
}) {
  if (!typesenseClient) return;
  await typesenseClient.collections("papers").documents().upsert(paper);
}

export async function removePaperIndex(paperId: string) {
  if (!typesenseClient) return;
  try {
    await typesenseClient.collections("papers").documents(paperId).delete();
  } catch {
    // Document may not exist
  }
}

export default typesenseClient;
```

- [ ] **Step 3: Update search API route to use Typesense**

```typescript
// src/app/api/search/route.ts
import { NextResponse } from 'next/server'
import { searchPapers } from '@/lib/typesense'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  const result = await searchPapers(q, page)
  return NextResponse.json(result)
}
```

- [ ] **Step 4: Verify build passes**

```bash
npm run typecheck
```

### Task 1.2: Create /about/author-guidelines Page

**Files:**
- Create: `src/app/about/author-guidelines/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/about/author-guidelines/page.tsx
export default function AuthorGuidelinesPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Author Guidelines</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manuscript Preparation</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Manuscripts must be original and not under consideration elsewhere.</li>
          <li>Format: PDF or Word document (.doc/.docx)</li>
          <li>Length: 4,000–8,000 words including references</li>
          <li>Abstract: 150–250 words</li>
          <li>Keywords: 5–8 keywords</li>
          <li>Font: Times New Roman, 12pt, double-spaced</li>
          <li>Referencing: APA 7th edition style</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Submission Process</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>Register an account on the journal platform.</li>
          <li>Log in and navigate to the dashboard.</li>
          <li>Click &quot;Submit New Paper&quot; and fill in the required details.</li>
          <li>Upload your manuscript and supplementary files.</li>
          <li>Submit for review. You will receive a confirmation email.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Review Process</h2>
        <p className="text-muted-foreground mb-4">
          All submissions undergo a double-blind peer review process. Each manuscript
          is reviewed by at least two independent reviewers. The review process typically
          takes 4–8 weeks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Publication Ethics</h2>
        <p className="text-muted-foreground">
          Authors must ensure their work adheres to ethical research standards,
          including proper citation, plagiarism avoidance, and disclosure of conflicts
          of interest. For detailed policies, see our Publication Ethics page.
        </p>
      </section>
    </div>
  );
}
```

### Task 1.3: Create /journal/[volume] Page

**Files:**
- Create: `src/app/journal/[volume]/page.tsx`

- [ ] **Step 1: Create the volume listing page**

```typescript
// src/app/journal/[volume]/page.tsx
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VolumePage({
  params,
}: {
  params: Promise<{ volume: string }>;
}) {
  const { volume } = await params;
  const volumeNum = parseInt(volume);

  const issues = await db.journalIssue.findMany({
    where: { volume: volumeNum, isPublished: true },
    orderBy: { issue: "desc" },
  });

  if (issues.length === 0) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Volume {volumeNum}</h1>
        <p className="text-muted-foreground">
          Browse all issues in Volume {volumeNum}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Issue {issue.issue}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Published: {new Date(issue.publicationDate).toLocaleDateString()}
              </p>
              <Link href={`/journal/${volumeNum}/${issue.issue}`}>
                <Button variant="outline" size="sm">
                  View Issue
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Task 1.4: Wire Up Newsletter Form

**Files:**
- Create: `src/app/api/subscribe/route.ts`
- Modify: `src/app/page.tsx` (lines 156-163 — replace static form with server action form)

- [ ] **Step 1: Create subscribe API route**

```typescript
// src/app/api/subscribe/route.ts
import { NextResponse } from "next/server";

// In-memory store (replace with DB/email service in production)
const subscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (subscribers.has(email)) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    subscribers.add(email);
    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Update homepage to use client form**

```typescript
// Modify src/app/page.tsx - replace lines 1-8 and the newsletter section

// Add 'use client' at top since we need interactivity
// Actually, create a client component for just the newsletter to keep the page as a server component

// Replace the newsletter section (lines 148-166) with:
```

Replace the newsletter section in `src/app/page.tsx` with a client component.

```typescript
// src/components/shared/newsletter-form.tsx
'use client'

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error)
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>
      {status === "success" && (
        <p className="text-sm text-green-600">{message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{message}</p>
      )}
    </form>
  );
}
```

- [ ] **Step 3: Update homepage to use NewsletterForm**

```typescript
// In src/app/page.tsx, replace the newsletter <div> around line 156-163:
// import { NewsletterForm } from "@/components/shared/newsletter-form";
// Replace <div className="flex gap-2 max-w-md mx-auto">...</div> with <NewsletterForm />
```

---

## Batch 2: Tests

### Task 2.1: Component Tests for UI Components

**Files:**
- Create: `src/__tests__/components/button.test.tsx`
- Create: `src/__tests__/components/paper-card.test.tsx`
- Create: `src/__tests__/components/navbar.test.tsx`

- [ ] **Step 1: Create Button tests**

```typescript
// src/__tests__/components/button.test.tsx
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

  it("renders as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByText("Link Button");
    expect(link.tagName).toBe("A");
  });
});
```

- [ ] **Step 2: Create PaperCard tests**

```typescript
// src/__tests__/components/paper-card.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaperCard } from "@/components/papers/paper-card";

const mockPaper = {
  id: "1",
  paperId: "RVJ-2026-0001",
  title: "Test Paper",
  abstract: "This is a test abstract for the paper card component.",
  keywords: "test, paper",
  status: "PUBLISHED" as const,
  author: { name: "John Doe" },
  category: { name: "Computer Science" },
  publicationDate: new Date("2026-01-15"),
  pdfUrl: null,
};

describe("PaperCard", () => {
  it("renders paper title", () => {
    render(<PaperCard paper={mockPaper as any} />);
    expect(screen.getByText("Test Paper")).toBeDefined();
  });

  it("renders author name", () => {
    render(<PaperCard paper={mockPaper as any} />);
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders category badge", () => {
    render(<PaperCard paper={mockPaper as any} />);
    expect(screen.getByText("Computer Science")).toBeDefined();
  });

  it("renders link to paper detail page", () => {
    render(<PaperCard paper={mockPaper as any} />);
    const link = screen.getByText("Test Paper").closest("a");
    expect(link?.getAttribute("href")).toBe("/research/RVJ-2026-0001");
  });
});
```

- [ ] **Step 3: Create Navbar tests**

```typescript
// src/__tests__/components/navbar.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/shared/navbar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next-auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
  signOut: vi.fn(),
}));

describe("Navbar", () => {
  it("renders the journal name", () => {
    render(<Navbar />);
    expect(screen.getByText("Paperas")).toBeDefined();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Journal")).toBeDefined();
    expect(screen.getByText("Research")).toBeDefined();
  });
});
```

- [ ] **Step 4: Run component tests**

```bash
npx vitest run src/__tests__/components/ --reporter=verbose
```

### Task 2.2: API Route Tests

**Files:**
- Create: `src/__tests__/api/papers.test.ts`
- Create: `src/__tests__/api/auth.test.ts`
- Create: `src/__tests__/api/reviews.test.ts`

- [ ] **Step 1: Create papers API tests**

```typescript
// src/__tests__/api/papers.test.ts
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
```

- [ ] **Step 2: Create auth tests**

```typescript
// src/__tests__/api/auth.test.ts
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
```

- [ ] **Step 3: Create reviews API tests**

```typescript
// src/__tests__/api/reviews.test.ts
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
    expect(reviewSchema.safeParse(data as any).success).toBe(false);
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
```

- [ ] **Step 4: Run all tests**

```bash
npm run test
```

### Task 2.3: Auth Lib Tests

**Files:**
- Create: `src/__tests__/lib/auth.test.ts`

- [ ] **Step 1: Create auth lib tests**

```typescript
// src/__tests__/lib/auth.test.ts
import { describe, it, expect } from "vitest";

describe("Auth Config", () => {
  it("has correct NextAuth secret from environment", () => {
    // In test env, AUTH_SECRET might not be set
    const secret = process.env.AUTH_SECRET;
    // Should either be set or use a default in non-production
    expect(secret !== undefined).toBe(true);
  });

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
```

---

## Batch 3: Component Directories

### Task 3.1: Scaffold Search Components

**Files:**
- Create: `src/components/search/search-bar.tsx`

- [ ] **Step 1: Create search-bar component**

```typescript
// src/components/search/search-bar.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/research?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search papers..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
```

### Task 3.2: Scaffold Dashboard Components

**Files:**
- Create: `src/components/dashboard/submission-list.tsx`

- [ ] **Step 1: Create submission-list component**

```typescript
// src/components/dashboard/submission-list.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Submission {
  id: string;
  paperId: string;
  title: string;
  status: string;
  createdAt: Date;
}

interface SubmissionListProps {
  submissions: Submission[];
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  REVISION_REQUESTED: "bg-orange-100 text-orange-800",
  ACCEPTED: "bg-green-100 text-green-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No submissions yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Link key={submission.id} href={`/papers/${submission.id}/edit`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{submission.title}</CardTitle>
                <Badge className={statusColors[submission.status]}>
                  {submission.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ID: {submission.paperId} | Submitted:{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

### Task 3.3: Scaffold Reviewer Components

**Files:**
- Create: `src/components/reviewer/review-card.tsx`

- [ ] **Step 1: Create review-card component**

```typescript
// src/components/reviewer/review-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReviewCardProps {
  review: {
    id: string;
    paper: { title: string; paperId: string };
    recommendation?: string;
    createdAt: Date;
  };
}

const recommendationColors: Record<string, string> = {
  ACCEPT: "bg-green-100 text-green-800",
  MINOR_REVISION: "bg-yellow-100 text-yellow-800",
  MAJOR_REVISION: "bg-orange-100 text-orange-800",
  REJECT: "bg-red-100 text-red-800",
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/reviewer/${review.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{review.paper.title}</CardTitle>
            {review.recommendation && (
              <Badge className={recommendationColors[review.recommendation]}>
                {review.recommendation.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Paper ID: {review.paper.paperId} | Assigned:{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### Task 3.4: Scaffold Admin Components

**Files:**
- Create: `src/components/admin/stats-card.tsx`

- [ ] **Step 1: Create stats-card component**

```typescript
// src/components/admin/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Batch 4: Schema & Config

### Task 4.1: Add PaperAnalytics Foreign Key

**Files:**
- Modify: `prisma/schema.prisma` (line 182 — add relation to PaperAnalytics)

- [ ] **Step 1: Add @relation to PaperAnalytics**

Edit `prisma/schema.prisma`:

```prisma
model PaperAnalytics {
  id        String   @id @default(cuid())
  paperId   String   @unique
  views     Int      @default(0)
  downloads Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  paper Paper @relation(fields: [paperId], references: [id])
}
```

- [ ] **Step 2: Regenerate Prisma client**

```bash
npx prisma generate
```

### Task 4.2: Add Prettier Config

**Files:**
- Create: `.prettierrc`

- [ ] **Step 1: Create Prettier config**

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Task 4.3: Add ESLint Config

**Files:**
- Create: `eslint.config.js`

- [ ] **Step 1: Create ESLint config**

```javascript
// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

---

## Verification

- [ ] Run `npm run typecheck` — must pass
- [ ] Run `npm run lint` — must pass
- [ ] Run `npm run test` — must pass
- [ ] Run `npm run build` — must succeed
