# Research Verse Journal Platform - Technical Specification

## Table of Contents

1. [Overview](#1-overview)
2. [Configuration](#2-configuration)
3. [Database Schema](#3-database-schema)
4. [Application Structure](#4-application-structure)
5. [Development Phases](#5-development-phases)
6. [API Endpoints](#6-api-endpoints)
7. [Component Library](#7-component-library)
8. [Key Integrations](#8-key-integrations)
9. [Security Requirements](#9-security-requirements)
9.1. [Accessibility Requirements (WCAG 2.2 AA)](#91-accessibility-requirements-wcag-22-aa)
9.2. [Performance Requirements](#92-performance-requirements)
10. [Content Pages](#10-content-pages)
11. [Metadata Standards](#11-metadata-standards)
12. [Testing](#12-testing)
13. [Timeline](#13-timeline)
14. [Appendix](#appendix)

---

## 1. Overview

- **Project Name**: Research Verse Journal And Publication House Of India
- **Type**: Academic Publishing Platform (ISSN-Licensed Journal)
- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Prisma, PostgreSQL, Auth.js, AWS S3, Typesense, Gemini AI
- **Base Theme**: Shadcn default (DO NOT MODIFY)

### Features

| Feature | Description |
|---------|-------------|
| 9 Public Pages | Home, About, Aim & Scope, Editorial Board, Author Guidelines, Publication Ethics, Contact, Archives |
| Paper Submission | Multi-step form with PDF upload, draft management, revisions |
| Peer Review | Blind review, reviewer assignment, recommendations |
| Authentication | Email/password + Google OAuth with role-based access |
| Admin Dashboard | Manage submissions, users, issues, settings, analytics |
| Search & Archive | Full-text search, filters, categorized browsing |

---

## 2. Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Auth.js (required)
AUTH_SECRET=your-secret-key-minimum-32-chars

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

# Typesense Search (optional)
TYPESENSE_API_KEY=

# Gemini AI (optional)
GEMINI_API_KEY=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Journal Defaults

| Setting | Value |
|---------|-------|
| Journal Name | Research Verse Journal And Publication House Of India |
| ISSN Format | `RVJ-YYYY-XXXX` (e.g., RVJ-2026-0001) |
| Default Category | General |
| Max PDF Size | 50MB |

---

## 3. Database Schema

### ER Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│    Paper    │────<│   Review    │
│             │     │             │     │             │
│ id          │     │ id          │     │ id          │
│ email       │     │ paperId     │     │ paperId     │
│ role        │     │ title       │     │ reviewerId  │
│ ...         │     │ ...         │     │ ...         │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│Notification │     │  Category   │     │JournalIssue │
│             │     │             │     │             │
│ id          │     │ id          │     │ id          │
│ userId      │     │ name        │     │ volume      │
│ ...         │     │ ...         │     │ issue       │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Models

```prisma
// prisma/schema.prisma

enum UserRole {
  GUEST
  AUTHOR
  REVIEWER
  EDITOR
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String   @unique
  name          String?
  password      String?
  image         String?
  role          UserRole @default(AUTHOR)
  institution   String?
  bio           String?
  orcid         String?
  googleId      String?  @unique
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  papers        Paper[]
  reviews       Review[]
  notifications Notification[]
}

enum PaperStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  REVISION_REQUESTED
  ACCEPTED
  PUBLISHED
  REJECTED
}

model Paper {
  id                String      @id @default(cuid())
  paperId           String      @unique  // RVJ-2026-XXXX
  title             String
  abstract          String      @db.Text
  keywords          String[]
  pdfUrl            String?
  supplementaryUrls String[]
  status            PaperStatus @default(DRAFT)
  submissionDate    DateTime?
  publicationDate   DateTime?
  volume            Int?
  issue             Int?
  categoryId        String?
  authorId          String
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  author    User         @relation(fields: [authorId], references: [id])
  category  Category?    @relation(fields: [categoryId], references: [id])
  reviews   Review[]
}

enum ReviewRecommendation {
  ACCEPT
  MINOR_REVISION
  MAJOR_REVISION
  REJECT
}

model Review {
  id                 String               @id @default(cuid())
  paperId            String
  reviewerId         String
  comments           String               @db.Text
  recommendation     ReviewRecommendation
  isBlind            Boolean              @default(false)
  rating             Int?                 // 1-5
  originalityRating  Int?
  qualityRating      Int?
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt

  paper    Paper @relation(fields: [paperId], references: [id])
  reviewer User  @relation(fields: [reviewerId], references: [id])
}

model JournalIssue {
  id              String   @id @default(cuid())
  volume          Int
  issue           Int
  publicationDate DateTime
  isPublished     Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([volume, issue])
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())
}

enum NotificationType {
  SUBMISSION_RECEIVED
  REVIEW_COMPLETED
  REVISION_REQUESTED
  PAPER_ACCEPTED
  PAPER_PUBLISHED
  REVIEWER_ASSIGNED
  USER_REGISTERED
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  link      String?
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
}

model PaperAnalytics {
  id         String   @id @default(cuid())
  paperId    String   @unique
  views      Int      @default(0)
  downloads  Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## 4. Application Structure

### Routes Overview

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Homepage | Public |
| `/journal` | Journal archive | Public |
| `/journal/[volume]/[issue]` | Issue detail | Public |
| `/research` | Research archive | Public |
| `/research/[paperId]` | Paper detail | Public |
| `/about` | About journal | Public |
| `/about/aim-scope` | Aim and scope | Public |
| `/about/editorial-board` | Editorial board | Public |
| `/about/author-guidelines` | Author guidelines | Public |
| `/about/publication-ethics` | Publication ethics | Public |
| `/contact` | Contact page | Public |
| `/auth/login` | Login | Public |
| `/auth/register` | Register | Public |
| `/dashboard` | Author dashboard | Author |
| `/dashboard/submit` | Submit paper | Author |
| `/dashboard/submissions` | My submissions | Author |
| `/papers/[id]/edit` | Edit paper | Author |
| `/papers/[id]/revisions` | Upload revision | Author |
| `/reviewer` | Reviewer dashboard | Reviewer |
| `/reviewer/reviews` | Assigned reviews | Reviewer |
| `/reviewer/[reviewId]` | Review form | Reviewer |
| `/admin` | Admin panel | Admin |
| `/admin/submissions` | Manage submissions | Admin |
| `/admin/issues` | Journal issues | Admin |
| `/admin/users` | User management | Admin |
| `/admin/settings` | Site settings | Admin |
| `/admin/analytics` | Platform analytics | Admin |

### File Organization

```
src/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Homepage
│   │   ├── journal/
│   │   ├── research/
│   │   ├── about/
│   │   └── contact/
│   ├── (auth)/             # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/        # Author dashboard
│   │   ├── dashboard/
│   │   └── papers/[id]/
│   ├── (reviewer)/         # Reviewer dashboard
│   │   └── reviewer/
│   ├── (admin)/            # Admin panel
│   │   └── admin/
│   └── api/                # API routes
│       ├── auth/
│       ├── papers/
│       ├── reviews/
│       └── admin/
├── components/
│   ├── ui/                 # Shadcn components
│   ├── shared/             # Navbar, Footer, etc.
│   ├── papers/             # Paper components
│   ├── search/             # Search components
│   ├── dashboard/          # Dashboard components
│   ├── reviewer/           # Review components
│   └── admin/              # Admin components
└── lib/
    ├── db.ts               # Prisma client
    ├── auth.ts             # Auth.js config
    ├── s3.ts               # AWS S3 utils
    ├── typesense.ts         # Typesense client
    ├── gemini.ts            # Gemini AI
    └── utils.ts            # Utilities
```

---

## 5. Development Phases

### Phase 1: Foundation (2-3 Weeks)

| Task | Description |
|------|-------------|
| Setup | Next.js 15, TypeScript, shadcn/ui, Prisma, Auth.js |
| Database | PostgreSQL schema, migrations |
| Authentication | Email/password, Google OAuth, role-based access |
| Public Website | All 9 pages, responsive design |
| Admin Panel | Basic submission and user management |

### Phase 2: Publishing Workflow (2-3 Weeks)

| Task | Description |
|------|-------------|
| Submission System | Multi-step form, PDF upload, drafts |
| Review System | Assignment, review form, blind review |
| Editorial Workflow | Issue management, publication workflow |
| Search | Typesense integration, advanced filters |

### Phase 3: Production Features (2-4 Weeks)

| Task | Description |
|------|-------------|
| AI Features | Abstract summary, keyword extraction (Gemini) |
| Notifications | Email (Resend), in-app notifications |
| Security | File validation, rate limiting, audit logs |
| Optimization | Performance, SEO, analytics |

---

## 6. API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/session` | Get current session |

### Papers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/papers` | List papers (paginated) |
| GET | `/api/papers/[id]` | Get paper details |
| POST | `/api/papers` | Create submission |
| PATCH | `/api/papers/[id]` | Update paper |
| DELETE | `/api/papers/[id]` | Delete draft |
| POST | `/api/papers/[id]/submit` | Submit for review |
| POST | `/api/papers/[id]/upload` | Upload PDF |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | List assigned reviews |
| GET | `/api/reviews/[id]` | Get review details |
| POST | `/api/reviews` | Submit review |
| PATCH | `/api/reviews/[id]` | Update review |
| POST | `/api/reviews/[id]/assign` | Assign reviewer |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/submissions` | All submissions |
| PATCH | `/api/admin/submissions/[id]` | Update status |
| GET/POST | `/api/admin/issues` | Journal issues |
| GET/POST/PATCH | `/api/admin/users` | User management |
| GET/POST | `/api/admin/categories` | Categories |
| GET | `/api/admin/analytics` | Platform analytics |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=` | Search papers |
| GET | `/api/search/advanced` | Advanced filters |

---

## 7. Component Library

### Shadcn Components

```bash
# Layout
npx shadcn@latest add button card navigation-menu sheet avatar dropdown-menu

# Forms
npx shadcn@latest add input textarea form label select

# Feedback
npx shadcn@latest add toast alert dialog badge

# Data
npx shadcn@latest add table tabs

# Utilities
npx shadcn@latest add separator scroll-area skeleton
```

### Custom Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Navbar` | `components/shared/` | Main navigation |
| `Footer` | `components/shared/` | Site footer |
| `PaperCard` | `components/papers/` | Paper preview card |
| `PaperList` | `components/papers/` | Paginated list |
| `PaperUpload` | `components/papers/` | PDF upload |
| `StatusBadge` | `components/papers/` | Status indicator |
| `SearchBar` | `components/search/` | Main search |
| `FilterPanel` | `components/search/` | Advanced filters |
| `ReviewForm` | `components/reviewer/` | Review submission |
| `StatsCard` | `components/dashboard/` | Statistics card |
| `SubmissionTable` | `components/admin/` | Admin table |

---

## 8. Key Integrations

### AWS S3

```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function uploadPDF(file: Buffer, key: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: 'application/pdf',
  }))
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
```

### Typesense

```typescript
// lib/typesense.ts
import Typesense from 'typesense'

export const typesense = new Typesense({
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  apiKey: process.env.TYPESENSE_API_KEY!,
})
```

### Gemini AI

```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function summarizeAbstract(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(`Summarize: ${text}`)
  return result.response.text()
}
```

---

## 9. Security Requirements

### OWASP Top 10 Checklist

| # | Category | Implementation |
|---|----------|----------------|
| A01 | Broken Access Control | RBAC middleware, authorization checks |
| A02 | Cryptographic Failures | HTTPS, secure cookies, JWT |
| A03 | Injection | Parameterized queries (Prisma), input validation (Zod) |
| A04 | Insecure Design | Security-first architecture |
| A05 | Security Misconfiguration | Default secure settings, error handling |
| A06 | Vulnerable Components | npm audit, regular updates |
| A07 | Authentication Failures | Strong auth, session management |
| A08 | Data Integrity Failures | CSRF protection, audit logs |
| A09 | Logging Failures | Security event logging |
| A10 | SSRF | Validate outbound requests |

### Security Headers

```typescript
// middleware.ts - Apply security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth | 5 requests | 1 minute |
| Paper Submission | 10 requests | 1 minute |
| Search | 60 requests | 1 minute |
| General API | 100 requests | 1 minute |

### File Upload Security

```typescript
const MAX_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = ['application/pdf']

export function validatePDF(file: File) {
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error('Only PDF files allowed')
  if (file.size > MAX_SIZE)
    throw new Error('File size must be less than 50MB')
  // Additional: malware scanning in production
}
```

### Session Security

- JWT tokens with 7-day expiry
- Refresh token rotation
- HTTP-only cookies
- Secure flag in production

---

## 9.1 Accessibility Requirements (WCAG 2.2 AA)

### WCAG Success Criteria

| Level | Criterion | Description |
|-------|----------|-------------|
| A | 1.1.1 | Non-text content has text alternatives |
| A | 1.3.1 | Info and relationships programmatically determinable |
| A | 2.1.1 | All functionality keyboard accessible |
| A | 2.4.1 | Skip to main content mechanism |
| AA | 1.4.3 | Contrast ratio 4.5:1 (text), 3:1 (large text) |
| AA | 1.4.11 | Non-text contrast 3:1 |
| AA | 2.4.7 | Focus visible |
| AA | 2.5.8 | Target size minimum 24x24px |

### Accessibility Patterns

```tsx
// Skip Navigation Link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-primary">
  Skip to main content
</a>

// Accessible Form Field
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium">
    Email address<span className="text-destructive ml-1" aria-hidden="true">*</span>
    <span className="sr-only">(required)</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : "email-hint"}
    className="w-full px-3 py-2 border rounded-md"
  />
  {errors.email && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      {errors.email}
    </p>
  )}
</div>

// Focus Ring
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

// Touch Target Size
min-h-[44px] min-w-[44px] // iOS minimum
```

### ARIA Guidelines

- Use semantic HTML elements first
- Add `aria-label` for icon-only buttons
- Use `aria-live` for dynamic content announcements
- Maintain proper heading hierarchy (h1 → h6, no level skip)
- Color must not be the only indicator of meaning

---

## 9.2 Performance Requirements

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Optimize images, critical CSS, server response |
| FID | < 100ms | Code splitting, defer non-critical JS |
| CLS | < 0.1 | Reserve space for async content, aspect-ratio |

### Optimization Checklist

- [ ] Use WebP/AVIF images
- [ ] Lazy load below-the-fold images
- [ ] Preload critical fonts
- [ ] Code splitting by route
- [ ] Virtualize lists with 50+ items
- [ ] Debounce high-frequency events
- [ ] Use skeleton screens for async content
- [ ] Reserve space to prevent layout shift

---

## 10. Content Pages

| Page | Route | Content |
|------|-------|---------|
| Home | `/` | Hero, stats, latest papers, newsletter |
| About | `/about` | History, mission, ISSN info |
| Aim & Scope | `/about/aim-scope` | Objectives, subject areas, article types |
| Editorial Board | `/about/editorial-board` | Chief Editor, Managing Editors, Board members |
| Author Guidelines | `/about/author-guidelines` | Preparation, formatting, checklist |
| Publication Ethics | `/about/publication-ethics` | Plagiarism policy, COPE guidelines |
| Contact | `/contact` | Office address, email, phone, hours |
| Archives | `/journal` | Volume/issue listing, search |

---

## 11. Metadata Standards

### Required Metadata Fields

Each published paper must include complete metadata for discoverability and indexing:

| Field | Required | Validation | Notes |
|-------|----------|------------|-------|
| Title | ✓ | 1-200 chars | Clear, concise |
| Abstract | ✓ | 150-5000 chars | Avoid undefined acronyms |
| Keywords | 3-8 | Lowercase | Research domain terms |
| Author Affiliations | ✓ | Verified | Institution names |
| References | ✓ | DOI when available | Complete bibliography |
| Publication Date | ✓ | ISO format | YYYY-MM-DD |
| ISSN Identifier | ✓ | RVJ-YYYY-XXXX | Auto-generated |

### Metadata Validation Rules

```typescript
// Metadata validation schema
const metadataSchema = {
  title: { min: 1, max: 200, required: true },
  abstract: { min: 150, max: 5000, required: true },
  keywords: { min: 3, max: 8, required: true },
  references: { doiRequired: false }, // Encourage but not required
}
```

### Discoverability Requirements

| Platform | Metadata Format | Notes |
|----------|-----------------|-------|
| Google Scholar | Standard SEO | Title, abstract, authors |
| Crossref (future) | DOI metadata | XML deposit |
| ORCID | Author IDs | Link author profiles |

---

## 12. Testing

### Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint code
npm run typecheck # TypeScript check
npm run test     # Run tests
```

### Database Commands

```bash
npx prisma generate   # Generate client
npx prisma db push    # Push schema (dev)
npx prisma migrate dev # Create migration
npx prisma studio     # Open Prisma Studio
```

---

## 13. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | 2-3 weeks | Public site, Auth, Admin |
| Phase 2 | 2-3 weeks | Review workflow, Search |
| Phase 3 | 2-4 weeks | AI, Notifications, Security |

**Total: 6-10 weeks**

---

## Appendix

### Quick Reference

| Item | Value |
|------|-------|
| ISSN Format | `RVJ-YYYY-XXXX` |
| Default Role | AUTHOR |
| Max PDF Size | 50MB |
| Pagination | 20 items per page |
| Session Expiry | 7 days |

### Related Documentation

- [DATABASE.md](./DATABASE.md) - Database schema details
- [API.md](./API.md) - API documentation
- [WORKFLOW.md](./WORKFLOW.md) - User workflows
- [COMPONENT.md](./COMPONENT.md) - UI components
- [DEPLOY.md](./DEPLOY.md) - Deployment guide