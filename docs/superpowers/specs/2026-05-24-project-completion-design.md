# Project Completion Plan

> **Goal:** Close all gaps identified in the codebase scan — missing pages, Typesense integration, test coverage, component directories, schema fixes, and dev tooling.

**Architecture:** The existing Next.js 15 + App Router structure remains unchanged. Each gap is addressed surgically — touch only what's missing, don't refactor what works.

**Execution:** Parallel batches dispatched via sub-agents, with no dependencies between tasks within a batch.

---

## Batch 1: Infrastructure & Routing (High Priority)

### 1.1 Typesense Client + Package
- **Files:**
  - Create: `src/lib/typesense.ts`
  - Modify: `package.json` (add `typesense` dependency)
- **What:** Typesense client singleton with search helpers. Imported by existing search API routes.
- **Outcome:** Search API switches from Prisma `contains` to proper full-text search.

### 1.2 `/about/author-guidelines/page.tsx`
- **Files:**
  - Create: `src/app/about/author-guidelines/page.tsx`
- **What:** Landing page for author guidelines (currently 404). Content aligned with existing `author-guidelines` top-level page or provided placeholder.

### 1.3 `/journal/[volume]/page.tsx`
- **Files:**
  - Create: `src/app/journal/[volume]/page.tsx`
- **What:** Lists all issues for a given volume. Links to `/[volume]/[issue]`.

### 1.4 Newsletter Form Handler
- **Files:**
  - Modify: `src/app/page.tsx` (homepage) — wire form to a server action or API route
  - Create: `src/app/api/subscribe/route.ts` (POST handler)
- **What:** Functional newsletter subscription saving to DB or external service.

---

## Batch 2: Tests (High Priority)

### 2.1 Component Tests
- **Files:**
  - Create: `src/__tests__/components/button.test.tsx`
  - Create: `src/__tests__/components/paper-card.test.tsx`
  - Create: `src/__tests__/components/navbar.test.tsx`
- **What:** Render + interaction tests for key UI components using Vitest + Testing Library.

### 2.2 API Route Tests
- **Files:**
  - Create: `src/__tests__/api/papers.test.ts`
  - Create: `src/__tests__/api/auth.test.ts`
  - Create: `src/__tests__/api/reviews.test.ts`
- **What:** Test request/response for major API routes with mocked Prisma.

### 2.3 Auth Tests
- **Files:**
  - Create: `src/__tests__/lib/auth.test.ts`
- **What:** Test auth config, session handling, role checks.

---

## Batch 3: Component Directories (Medium)

### 3.1 Component Scaffolding
- **Files:**
  - Create: `src/components/search/search-bar.tsx`
  - Create: `src/components/dashboard/submission-list.tsx`
  - Create: `src/components/reviewer/review-card.tsx`
  - Create: `src/components/admin/stats-card.tsx`
- **What:** Initial components with props interfaces. Minimal but structurally complete.

---

## Batch 4: Schema & Config (Medium/Low)

### 4.1 PaperAnalytics Foreign Key
- **Files:**
  - Modify: `prisma/schema.prisma` — add `@relation` to `PaperAnalytics.paperId`
- **What:** Database-level referential integrity.

### 4.2 Prettier + ESLint Config
- **Files:**
  - Create: `.prettierrc`
  - Create: `eslint.config.js`
- **What:** Consistent formatting and lint rules.

### 4.3 PostgreSQL Migration Prep
- **Files:**
  - Work with: `prisma/schema.postgresql.prisma`
- **What:** Ensure schema is production-ready for PostgreSQL switch.

---

## Success Criteria

- [ ] All 20 todo items completed
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (≥70% coverage)
- [ ] `npm run build` succeeds
- [ ] No new 404 routes
