# Development Agents Configuration

## Overview

Guidelines and configuration for development agents working on the Research Verse Journal platform.

**IMPORTANT**: This is a plan-only phase. DO NOT make any edits or system changes until explicitly instructed by the user.

---

## Core Principles

### Think Before Coding

- **Don't assume. Don't hide confusion. Surface tradeoffs.**
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First

- **Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical Changes

- **Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If your changes create orphans, remove unused imports/variables.

### Goal-Driven Execution

- **Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals:
  - "Add validation" → "Write tests for invalid inputs, then make them pass"
  - "Fix the bug" → "Write a test that reproduces it, then make it pass"
- For multi-step tasks, state a brief plan with verification steps.

---

## 1. Project Context

### Journal Name

Research Verse Journal And Publication House Of India

### Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI (default theme only)
- **Database**: PostgreSQL + Prisma
- **Auth**: Auth.js (NextAuth v5)
- **Storage**: AWS S3
- **Search**: Typesense
- **AI**: Gemini

### ISSN Format

`RVJ-{YYYY}-{XXXX}` (e.g., RVJ-2026-0001)

---

## 2.1 TypeScript Standards

### Type Safety

```typescript
// Prefer interfaces for object shapes
interface Paper {
  id: string
  title: string
  status: PaperStatus
}

// Use type for unions and complex types
type UserRole = 'AUTHOR' | 'REVIEWER' | 'EDITOR' | 'ADMIN'

// Discriminated unions for state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### Generic Types

```typescript
// Generic utility for API responses
interface ApiResponse<T> {
  data: T
  message?: string
}

// Generic database operations
async function getById<T extends keyof Prisma.ModelName>(
  model: T,
  id: string
): Promise<Prisma.ModelType[T] | null>
```

### Type Guards

```typescript
function isAuthor(user: User): user is Author {
  return user.role === 'AUTHOR'
}

function isPaperStatus(value: string): value is PaperStatus {
  return ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'PUBLISHED', 'REJECTED'].includes(value)
}
```

---

## 2.2 Next.js App Router Patterns

### Server vs Client Components

```typescript
// Server Component (default) - for data fetching, SEO
// app/dashboard/page.tsx
async function getPapers() {
  const papers = await db.paper.findMany({
    where: { authorId: session.user.id },
    include: { category: true },
  })
  return papers
}

export default async function DashboardPage() {
  const papers = await getPapers()
  return <PaperList papers={papers} />
}

// Client Component - only when hooks/interactivity needed
// components/SearchBar.tsx
'use client'

import { useState } from 'react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  // interactive logic here
}
```

### Server Actions

```typescript
// app/actions/papers.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitPaper(formData: FormData) {
  const title = formData.get('title') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  const paper = await db.paper.create({
    data: { title, status: 'SUBMITTED' },
  })

  revalidatePath('/dashboard/submissions')
  redirect(`/papers/${paper.id}`)

  return { success: true, paperId: paper.id }
}
```

### Streaming with Suspense

```typescript
import { Suspense } from 'react'

export default async function PaperPage({ params }: { params: { id: string } }) {
  const paper = await getPaper(params.id) // blocking - loads first

  return (
    <div>
      <PaperHeader paper={paper} />
      {/* Stream these in parallel */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews paperId={paper.id} />
      </Suspense>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <PaperAnalytics paperId={paper.id} />
      </Suspense>
    </div>
  )
}
```

### Route Handlers

```typescript
// app/api/papers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paperSchema = z.object({
  title: z.string().min(1).max(200),
  abstract: z.string().min(1),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page')) || 1

  const papers = await db.paper.findMany({
    where: { status: 'PUBLISHED' },
    take: 20,
    skip: (page - 1) * 20,
  })

  return NextResponse.json({ papers, page })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const data = paperSchema.parse(body)
    const paper = await db.paper.create({ data })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

---

## 2. Development Standards

### Code Style

- Follow existing code patterns in codebase
- Use TypeScript strict mode
- Use ESLint + Prettier
- No inline styles - use Tailwind classes only

### Shadcn Usage

- **NEVER modify shadcn default theme**
- Only use: `button`, `card`, `input`, `textarea`, `select`, `dialog`, `table`, `badge`, `avatar`, `dropdown-menu`
- Custom components: create in `components/` directories

### Testing

- Use Vitest for unit tests
- Minimum coverage: 70%
- Test auth, API routes, utils

---

## 3. File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   ├── (auth)/           # Auth routes
│   ├── (dashboard)/       # Protected dashboard
│   ├── (admin)/         # Admin routes
│   └── api/             # API routes
├── components/
│   ├── ui/              # Shadcn components
│   ├── shared/          # Shared components
│   ├── papers/          # Paper components
│   ├── search/         # Search components
│   ├── dashboard/       # Dashboard components
│   ├── reviewer/        # Reviewer components
│   └── admin/          # Admin components
├── lib/
│   ├── db.ts           # Prisma client
│   ├── auth.ts         # Auth.js config
│   ├── s3.ts         # AWS S3 utils
│   ├── typesense.ts    # Typesense client
│   ├── gemini.ts      # Gemini AI
│   └── utils.ts       # Utility functions
├── types/
│   └── index.ts        # TypeScript types
└── styles/
    └── globals.css     # Global styles
```

---

## 4. Database Guidelines

### Prisma Operations

```bash
# Generate Prisma client
npx prisma generate

# Push schema (dev only)
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

### Adding New Models

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma generate`
3. Create migration: `npx prisma migrate dev --name new_model`
4. Use generated client in code

---

## 5. API Routes

### Route Structure

```typescript
// app/api/[resource]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

// GET /api/papers
export async function GET(request: Request) {
  // Public endpoint
}

// POST /api/papers
export async function POST(request: Request) {
  // Protected endpoint
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Request Validation

Use Zod for validation:

```typescript
import { z } from 'zod'

const paperSchema = z.object({
  title: z.string().min(1).max(200),
  abstract: z.string().min(1).max(5000),
  keywords: z.array(z.string()).min(1),
})

export async function POST(request: Request) {
  const body = await request.json()
  const data = paperSchema.parse(body)
  // ...
}
```

---

## 6. Authentication

### Route Protection

```typescript
// middleware.ts
import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  if (nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  if (nextUrl.pathname.startsWith('/admin') && req.auth?.user?.role !== 'ADMIN') {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

### Role Check

```typescript
function requireRole(roles: UserRole[]) {
  return (req: Request) => {
    const session = getSession()
    if (!session || !roles.includes(session.user.role)) {
      throw new Error('Forbidden')
    }
  }
}
```

---

## 7. File Upload

### S3 Upload

```typescript
import { s3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function uploadPDF(file: Buffer, filename: string) {
  const key = `papers/${Date.now()}-${filename}`
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'application/pdf',
  }))

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
```

### Validation

```typescript
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

function validatePDF(file: File) {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files allowed')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 50MB')
  }
}
```

---

## 8. Components

### Creating Components

Use Shadcn for base UI:

```bash
# Add shadcn component
npx shadcn@latest add button
```

Create custom component:

```typescript
// components/papers/paper-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{paper.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{paper.abstract}</p>
      </CardContent>
    </Card>
  )
}
```

---

## 9. Testing

### Unit Tests

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/
│   ├── lib/
│   │   ├── auth.test.ts
│   │   ├── db.test.ts
│   │   └── utils.test.ts
│   └── components/
│       ├── paper-card.test.tsx
│       └── search-bar.test.tsx
```

---

## 10. Performance

### Guidelines

- Use Server Components by default
- Use `use client` only for interactivity
- Implement pagination for lists (20 items)
- Use Optimistic Updates for mutations
- Cache API responses with Next.js caching
- Optimize images with next/image

### Lazy Loading

```typescript
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/papers/pdf-viewer'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

---

## 11. Security

### Requirements

- Sanitize all user inputs
- Use parameterized queries (Prisma handles this)
- Validate file types server-side
- Implement rate limiting
- Log security events

### Rate Limiting

```typescript
import { rateLimit } from '@/lib/utils'

export async function POST(request: Request) {
  const { success } = await rateLimit.limit(request.ip!)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ...
}
```

---

## 12. Build & Deploy

### Local Build

```bash
npm run build
npm run start
```

### Production Check

```bash
# TypeScript
npm run typecheck

# Lint
npm run lint

# Tests
npm run test
```

### Deployment

Push to main branch → Vercel auto-deploys

---

## 13. Common Tasks

### Add New API Route

1. Create `app/api/[resource]/route.ts`
2. Implement handlers
3. Add validation schema
4. Add tests
5. Test locally

### Add New Component

1. Use Shadcn or create custom
2. Follow naming conventions
3. Add to proper directory
4. Add tests

### Add Database Model

1. Update `prisma/schema.prisma`
2. Create migration
3. Generate types
4. Add API routes

---

## 14. Troubleshooting

### "Prisma Client not found"

```bash
npx prisma generate
```

### "Middleware error"

Check `.next` folder is clean:

```bash
rm -rf .next
npm run dev
```

### "Auth error"

Verify AUTH_SECRET is set:

```bash
echo $AUTH_SECRET
```

---

## 15. Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run linting |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run tests |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma studio` | Open database UI |

---

## 16. Quality Assurance Checklist

### Pre-Publication QA

- [ ] All metadata fields populated (no placeholders)
- [ ] Abstract free of undefined acronyms
- [ ] Keywords lowercase, no duplicates
- [ ] Author affiliations verified
- [ ] References include DOIs when available
- [ ] PDF metadata matches database

### Code Review Checklist

- [ ] TypeScript strict mode passes
- [ ] ESLint no errors
- [ ] No `any` types used
- [ ] All API endpoints documented
- [ ] All components have ARIA labels
- [ ] No console.log statements
- [ ] Proper error handling

---

## 17. Contact

For issues or questions, contact the project lead.

**NEVER make changes without explicit user instruction.**