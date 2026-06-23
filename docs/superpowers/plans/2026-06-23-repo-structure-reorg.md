# Repo Structure Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `lib/` into subdirectories, add barrel exports to components, split types into domain files.

**Architecture:** Move flat `lib/` files into `auth/`, `services/`, `storage/`, `utils/` subdirectories with barrel exports. Add `index.ts` barrel files to each component directory. Split `types/index.ts` into `paper.ts`, `user.ts`, `review.ts`, `category.ts`, `api.ts`, `misc.ts`.

**Tech Stack:** TypeScript, Next.js App Router, Prisma, Auth.js

---

## File Structure

### New Files to Create

```
src/lib/auth/index.ts
src/lib/services/index.ts
src/lib/storage/index.ts
src/lib/utils/index.ts
src/lib/index.ts
src/components/ui/index.ts
src/components/shared/index.ts
src/components/papers/index.ts
src/components/admin/index.ts
src/components/dashboard/index.ts
src/components/reviewer/index.ts
src/components/search/index.ts
src/types/paper.ts
src/types/user.ts
src/types/review.ts
src/types/category.ts
src/types/api.ts
src/types/misc.ts
```

### Files to Move

```
src/lib/auth.ts → src/lib/auth/auth.ts
src/lib/next-auth.d.ts → src/lib/auth/next-auth.d.ts
src/lib/email.ts → src/lib/services/email.ts
src/lib/gemini.ts → src/lib/services/gemini.ts
src/lib/typesense.ts → src/lib/services/typesense.ts
src/lib/citations.ts → src/lib/services/citations.ts
src/lib/crossref.ts → src/lib/services/crossref.ts
src/lib/oai-pmh.ts → src/lib/services/oai-pmh.ts
src/lib/jats.ts → src/lib/services/jats.ts
src/lib/s3.ts → src/lib/storage/s3.ts
src/lib/utils.ts → src/lib/utils/utils.ts
src/lib/rate-limit.ts → src/lib/utils/rate-limit.ts
```

### Files Staying in Place

```
src/lib/db.ts (top-level, core dependency)
src/lib/analytics.ts (top-level, used by API routes)
```

---

## Task 1: Create lib/ Subdirectories and Move Files

**Files:**
- Create: `src/lib/auth/`, `src/lib/services/`, `src/lib/storage/`, `src/lib/utils/`
- Move: 12 files from `src/lib/` to subdirectories

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/lib/auth src/lib/services src/lib/storage src/lib/utils
```

- [ ] **Step 2: Move auth files**

```bash
mv src/lib/auth.ts src/lib/auth/auth.ts
mv src/lib/next-auth.d.ts src/lib/auth/next-auth.d.ts
```

- [ ] **Step 3: Move service files**

```bash
mv src/lib/email.ts src/lib/services/email.ts
mv src/lib/gemini.ts src/lib/services/gemini.ts
mv src/lib/typesense.ts src/lib/services/typesense.ts
mv src/lib/citations.ts src/lib/services/citations.ts
mv src/lib/crossref.ts src/lib/services/crossref.ts
mv src/lib/oai-pmh.ts src/lib/services/oai-pmh.ts
mv src/lib/jats.ts src/lib/services/jats.ts
```

- [ ] **Step 4: Move storage files**

```bash
mv src/lib/s3.ts src/lib/storage/s3.ts
```

- [ ] **Step 5: Move utility files**

```bash
mv src/lib/utils.ts src/lib/utils/utils.ts
mv src/lib/rate-limit.ts src/lib/utils/rate-limit.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "refactor: move lib files into subdirectories"
```

---

## Task 2: Create lib/ Barrel Exports

**Files:**
- Create: `src/lib/auth/index.ts`, `src/lib/services/index.ts`, `src/lib/storage/index.ts`, `src/lib/utils/index.ts`, `src/lib/index.ts`

- [ ] **Step 1: Create auth barrel**

```typescript
// src/lib/auth/index.ts
export { auth, handlers, signIn, signOut } from "./auth"
export type { Session } from "next-auth"
```

- [ ] **Step 2: Create services barrel**

```typescript
// src/lib/services/index.ts
export { sendPasswordResetEmail, sendWelcomeEmail } from "./email"
export { generateWithGemini } from "./gemini"
export { searchPapers, indexPaper } from "./typesense"
export { formatCitation } from "./citations"
export { fetchCrossrefWork } from "./crossref"
export { generateListRecords } from "./oai-pmh"
export { generateJATS } from "./jats"
```

- [ ] **Step 3: Create storage barrel**

```typescript
// src/lib/storage/index.ts
export { uploadPDF, generateS3Key, deleteFile } from "./s3"
```

- [ ] **Step 4: Create utils barrel**

```typescript
// src/lib/utils/index.ts
export { cn, generatePaperId } from "./utils"
export { rateLimit } from "./rate-limit"
```

- [ ] **Step 5: Create top-level lib barrel**

```typescript
// src/lib/index.ts
export { db } from "./db"
export * from "./auth"
export * from "./services"
export * from "./storage"
export * from "./utils"
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: add barrel exports for lib subdirectories"
```

---

## Task 3: Update Internal lib/ Imports

**Files:**
- Modify: `src/lib/services/oai-pmh.ts`, `src/lib/services/jats.ts`

- [ ] **Step 1: Fix oai-pmh.ts import**

```typescript
// src/lib/services/oai-pmh.ts
// Change:
import { db } from "@/lib/db"
// To: (no change needed, db stays at top-level)
```

- [ ] **Step 2: Fix jats.ts import**

```typescript
// src/lib/services/jats.ts
// Change:
import { db } from "@/lib/db"
// To: (no change needed, db stays at top-level)
```

- [ ] **Step 3: Verify no broken internal imports**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/
git commit -m "fix: verify internal lib imports"
```

---

## Task 4: Update App Imports for lib/auth

**Files:**
- Modify: All files importing from `@/lib/auth`

**Import map (old → new):**
```
@/lib/auth → @/lib/auth (barrel re-export, no change needed)
```

Since `src/lib/auth/index.ts` re-exports from `./auth`, the import path `@/lib/auth` still works. **No changes needed for auth imports.**

- [ ] **Step 1: Verify auth imports work**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 5: Update App Imports for lib/services

**Files:**
- Modify: `src/components/papers/citation-dialog.tsx`, `src/app/api/oai/route.ts`, `src/app/api/papers/[id]/jats/route.ts`, `src/app/api/analytics/[paperId]/view/route.ts`, `src/app/api/analytics/[paperId]/download/route.ts`, `src/app/api/auth/forgot-password/route.ts`, `src/app/api/upload/route.ts`

**Import map (old → new):**
```
@/lib/citations → @/lib/services
@/lib/oai-pmh → @/lib/services
@/lib/jats → @/lib/services
@/lib/analytics → @/lib/services (move analytics.ts to services/)
@/lib/email → @/lib/services
@/lib/s3 → @/lib/storage
```

- [ ] **Step 1: Move analytics.ts to services**

```bash
mv src/lib/analytics.ts src/lib/services/analytics.ts
```

- [ ] **Step 2: Update services barrel**

```typescript
// src/lib/services/index.ts
export { sendPasswordResetEmail, sendWelcomeEmail } from "./email"
export { generateWithGemini } from "./gemini"
export { searchPapers, indexPaper } from "./typesense"
export { formatCitation } from "./citations"
export { fetchCrossrefWork } from "./crossref"
export { generateListRecords } from "./oai-pmh"
export { generateJATS } from "./jats"
export { incrementPaperView, incrementPaperDownload } from "./analytics"
```

- [ ] **Step 3: Update citation-dialog.tsx**

```typescript
// src/components/papers/citation-dialog.tsx
// Change:
import { formatCitation } from "@/lib/citations"
// To:
import { formatCitation } from "@/lib/services"
```

- [ ] **Step 4: Update oai route**

```typescript
// src/app/api/oai/route.ts
// Change:
import { generateListRecords } from "@/lib/oai-pmh"
// To:
import { generateListRecords } from "@/lib/services"
```

- [ ] **Step 5: Update jats route**

```typescript
// src/app/api/papers/[id]/jats/route.ts
// Change:
import { generateJATS } from "@/lib/jats"
// To:
import { generateJATS } from "@/lib/services"
```

- [ ] **Step 6: Update analytics routes**

```typescript
// src/app/api/analytics/[paperId]/view/route.ts
// Change:
import { incrementPaperView } from "@/lib/analytics"
// To:
import { incrementPaperView } from "@/lib/services"

// src/app/api/analytics/[paperId]/download/route.ts
// Change:
import { incrementPaperDownload } from "@/lib/analytics"
// To:
import { incrementPaperDownload } from "@/lib/services"
```

- [ ] **Step 7: Update forgot-password route**

```typescript
// src/app/api/auth/forgot-password/route.ts
// Change:
import { sendPasswordResetEmail } from "@/lib/email"
// To:
import { sendPasswordResetEmail } from "@/lib/services"
```

- [ ] **Step 8: Update upload route**

```typescript
// src/app/api/upload/route.ts
// Change:
import { uploadPDF, generateS3Key } from "@/lib/s3"
// To:
import { uploadPDF, generateS3Key } from "@/lib/storage"
```

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: update service and storage imports"
```

---

## Task 6: Update App Imports for lib/utils

**Files:**
- Modify: All files importing `cn` from `@/lib/utils`, `generatePaperId` from `@/lib/utils`, `rateLimit` from `@/lib/utils`

**Import map:** `@/lib/utils` still works via barrel re-export. **No changes needed.**

- [ ] **Step 1: Verify utils imports work**

Run: `npx tsc --noEmit`
Expected: No errors

---

## Task 7: Add Component Barrel Exports

**Files:**
- Create: `src/components/ui/index.ts`, `src/components/shared/index.ts`, `src/components/papers/index.ts`, `src/components/admin/index.ts`, `src/components/dashboard/index.ts`, `src/components/reviewer/index.ts`, `src/components/search/index.ts`

- [ ] **Step 1: Create ui barrel**

```typescript
// src/components/ui/index.ts
export { Button } from "./button"
export { Card, CardContent, CardHeader, CardTitle } from "./card"
export { Badge } from "./badge"
export { Input } from "./input"
export { Textarea } from "./textarea"
export { Label } from "./label"
export { Select } from "./select"
export { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./menubar"
export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu"
export { CTASection } from "./hero-dithering-card"
```

- [ ] **Step 2: Create shared barrel**

```typescript
// src/components/shared/index.ts
export { Navbar } from "./navbar"
export { Footer } from "./footer"
export { ThemeToggle } from "./theme-toggle"
export { NotificationBell } from "./notification-bell"
export { NewsletterForm } from "./newsletter-form"
export { PageTransition } from "./page-transition"
```

- [ ] **Step 3: Create papers barrel**

```typescript
// src/components/papers/index.ts
export { PaperCard, StatusBadge } from "./paper-card"
export { SubmissionWizard } from "./submission-wizard"
export { FileUpload } from "./file-upload"
export { DownloadButton } from "./download-button"
export { CitationDialog } from "./citation-dialog"
export { PaperViewTracker } from "./paper-view-tracker"
```

- [ ] **Step 4: Create admin barrel**

```typescript
// src/components/admin/index.ts
export { StatsCard } from "./stats-card"
export { AnalyticsCharts } from "./analytics-charts"
```

- [ ] **Step 5: Create dashboard barrel**

```typescript
// src/components/dashboard/index.ts
export { SubmissionList } from "./submission-list"
```

- [ ] **Step 6: Create reviewer barrel**

```typescript
// src/components/reviewer/index.ts
export { ReviewCard } from "./review-card"
```

- [ ] **Step 7: Create search barrel**

```typescript
// src/components/search/index.ts
export { SearchBar } from "./search-bar"
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: Commit**

```bash
git add src/components/*/index.ts
git commit -m "feat: add barrel exports for component directories"
```

---

## Task 8: Split Types into Domain Files

**Files:**
- Read: `src/types/index.ts`
- Create: `src/types/paper.ts`, `src/types/user.ts`, `src/types/review.ts`, `src/types/category.ts`, `src/types/api.ts`, `src/types/misc.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Read current types**

Read `src/types/index.ts` to understand all type definitions.

- [ ] **Step 2: Create paper.ts**

```typescript
// src/types/paper.ts
export type PaperStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "REVISION_REQUESTED" | "ACCEPTED" | "PUBLISHED" | "REJECTED"

export interface Paper {
  id: string
  paperId: string
  title: string
  abstract: string
  keywords: string[]
  pdfUrl: string | null
  supplementaryUrls: string[]
  doi: string | null
  status: PaperStatus
  submissionDate: Date
  publicationDate: Date | null
  volume: number | null
  issue: number | null
  categoryId: string | null
  authorId: string
  createdAt: Date
  updatedAt: Date
  author?: User
  category?: Category
  coAuthors?: CoAuthor[]
}

export interface CoAuthor {
  id: string
  name: string
  email: string
  affiliation: string | null
  paperId: string
}

export interface PaperWithRelations extends Paper {
  author: User
  category: Category | null
  coAuthors: CoAuthor[]
  reviews: Review[]
}
```

- [ ] **Step 3: Create user.ts**

```typescript
// src/types/user.ts
export type UserRole = "AUTHOR" | "REVIEWER" | "EDITOR" | "ADMIN"

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: {
    id: string
    name: string | null
    email: string
    role: UserRole
  }
  expires: string
}
```

- [ ] **Step 4: Create review.ts**

```typescript
// src/types/review.ts
export type ReviewStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export interface Review {
  id: string
  paperId: string
  reviewerId: string
  status: ReviewStatus
  recommendation: string | null
  comments: string | null
  submittedAt: Date | null
  createdAt: Date
  updatedAt: Date
  reviewer?: User
}
```

- [ ] **Step 5: Create category.ts**

```typescript
// src/types/category.ts
export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}
```

- [ ] **Step 6: Create api.ts**

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

- [ ] **Step 7: Create misc.ts**

```typescript
// src/types/misc.ts
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export interface EditorialBoardMember {
  id: string
  name: string
  title: string
  affiliation: string
  bio: string | null
  image: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}
```

- [ ] **Step 8: Update types/index.ts barrel**

```typescript
// src/types/index.ts
export * from "./paper"
export * from "./user"
export * from "./review"
export * from "./category"
export * from "./api"
export * from "./misc"
```

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 10: Commit**

```bash
git add src/types/
git commit -m "refactor: split types into domain-specific files"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No new errors (pre-existing warnings OK)

- [ ] **Step 3: Clean build and rebuild**

```bash
Remove-Item -Recurse -Force .next
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify build after repo reorganization"
```
