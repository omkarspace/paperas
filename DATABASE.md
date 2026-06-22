# Database Schema Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Schema File](#2-schema-file)
3. [Models](#3-models)
4. [Relations](#4-relations)
5. [Indexes](#5-indexes)
6. [Seed Data](#6-seed-data)
7. [Migrations](#7-migrations)

---

## 1. Overview

- **ORM**: Prisma
- **Database**: PostgreSQL
- **Location**: `prisma/schema.prisma`

---

## 2. Schema File

```bash
prisma/
└── schema.prisma
```

---

## 3. Models

### User

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| email | String | @unique | Unique email |
| name | String? | optional | Display name |
| password | String? | optional | Hashed password |
| image | String? | optional | Avatar URL |
| role | UserRole | @default(AUTHOR) | User role |
| institution | String? | optional | Affiliation |
| bio | String? | optional | Short bio |
| orcid | String? | optional | ORCID ID |
| googleId | String? | @unique | OAuth ID |
| emailVerified | DateTime? | optional | Verification date |
| createdAt | DateTime | @default(now()) | Created timestamp |
| updatedAt | DateTime | @updatedAt | Updated timestamp |

**Roles**: GUEST, AUTHOR, REVIEWER, EDITOR, ADMIN

**Default Role**: AUTHOR (for new registrations)

---

### Paper

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| paperId | String | @unique | ISSN (RVJ-2026-XXXX) |
| title | String | required | Paper title |
| abstract | String | @db.Text | Full abstract |
| keywords | String[] | optional | Keyword array |
| pdfUrl | String? | optional | S3 PDF URL |
| supplementaryUrls | String[] | optional | Additional files |
| status | PaperStatus | @default(DRAFT) | Current status |
| submissionDate | DateTime? | optional | Submitted date |
| publicationDate | DateTime? | optional | Published date |
| volume | Int? | optional | Journal volume |
| issue | Int? | optional | Journal issue |
| categoryId | String? | optional | FK to Category |
| authorId | String | required | FK to User |
| createdAt | DateTime | @default(now()) | Created timestamp |
| updatedAt | DateTime | @updatedAt | Updated timestamp |

**Paper Status Flow**:

```
DRAFT → SUBMITTED → UNDER_REVIEW → REVISION_REQUESTED → ACCEPTED → PUBLISHED
                                                    ↘ REJECTED
```

---

### Review

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| paperId | String | required | FK to Paper |
| reviewerId | String | required | FK to User |
| comments | String | @db.Text | Review text |
| recommendation | ReviewRecommendation | required | Decision |
| isBlind | Boolean | @default(false) | Blind review |
| rating | Int? | optional | 1-5 scale |
| originalityRating | Int? | optional | 1-5 scale |
| qualityRating | Int? | optional | 1-5 scale |
| createdAt | DateTime | @default(now()) | Created timestamp |
| updatedAt | DateTime | @updatedAt | Updated timestamp |

**Recommendations**: ACCEPT, MINOR_REVISION, MAJOR_REVISION, REJECT

---

### JournalIssue

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| volume | Int | required | Volume number |
| issue | Int | required | Issue number |
| publicationDate | DateTime | required | Pub date |
| isPublished | Boolean | @default(false) | Visibility |
| createdAt | DateTime | @default(now()) | Created timestamp |
| updatedAt | DateTime | @updatedAt | Updated timestamp |

**Unique Constraint**: `(volume, issue)`

---

### Category

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| name | String | @unique | Category name |
| createdAt | DateTime | @default(now()) | Created timestamp |

**Default Categories**: General, Science, Technology, Engineering, Medicine, Social Sciences, Arts, Literature

---

### Notification

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| userId | String | required | FK to User |
| type | NotificationType | required | Event type |
| title | String | required | Notification title |
| message | String | required | Notification body |
| link | String? | optional | Related link |
| read | Boolean | @default(false) | Read status |
| createdAt | DateTime | @default(now()) | Created timestamp |

**Types**: SUBMISSION_RECEIVED, REVIEW_COMPLETED, REVISION_REQUESTED, PAPER_ACCEPTED, PAPER_PUBLISHED, REVIEWER_ASSIGNED, USER_REGISTERED

---

### PaperAnalytics

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| paperId | String | @unique | FK to Paper |
| views | Int | @default(0) | View count |
| downloads | Int | @default(0) | Download count |
| createdAt | DateTime | @default(now()) | Created timestamp |
| updatedAt | DateTime | @updatedAt | Updated timestamp |

---

## 4. Relations

```
┌──────────────────────────────────────────────────────────────┐
│                         RELATIONS                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   User (1) ───────────────< Paper (N)                       │
│    │                           │                            │
│    │                           │                            │
│    ├────< Notification (N)     │                            │
│    │                           │                            │
│    │                      Category (1)                      │
│    │                           │                            │
│    │                           ▼                            │
│    │                      < Review (N)                       │
│    │                           │                            │
│    │                      Reviewer (N)                       │
│    │                           │                            │
│    └──────────────────────────┘                            │
│                                                              │
│   Paper (1) ───────────────< PaperAnalytics (1)             │
│                                                              │
│   Paper (N) ───────────────> JournalIssue (1)               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Relation Details

| Relation | Type | Description |
|----------|------|-------------|
| User → Paper | 1:N | Author has many papers |
| User → Review | 1:N | Reviewer writes many reviews |
| User → Notification | 1:N | User receives notifications |
| Paper → Review | 1:N | Paper has many reviews |
| Paper → Category | N:1 | Paper belongs to category |
| Paper → PaperAnalytics | 1:1 | Each paper has analytics |
| Paper → JournalIssue | N:1 | Paper belongs to issue |

---

## 5. Indexes

### Auto-Created Indexes

| Model | Field | Type |
|-------|-------|------|
| User | id | Primary |
| User | email | Unique |
| User | googleId | Unique |
| Paper | id | Primary |
| Paper | paperId | Unique |
| Paper | authorId | Index |
| Paper | status | Index |
| Review | id | Primary |
| JournalIssue | id | Primary |
| JournalIssue | (volume, issue) | Unique |
| Category | id | Primary |
| Category | name | Unique |
| Notification | id | Primary |
| PaperAnalytics | id | Primary |
| PaperAnalytics | paperId | Unique |

### Query Patterns

Optimize with additional indexes:

```prisma
// Paper queries by date
@@index([createdAt(sort: Desc)])

// Paper queries by publication
@@index([publicationDate])

// Review queries by status
@@index([paperId, reviewerId])
```

### PostgreSQL Optimization

```sql
-- EXPLAIN ANALYZE for performance analysis
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT p.title, p.status, p.created_at
FROM papers p
WHERE p.status = 'PUBLISHED'
ORDER BY p.created_at DESC;
```

```sql
-- Composite indexes for multi-column queries
CREATE INDEX idx_papers_status_date ON papers(status, created_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX idx_papers_published ON papers(paper_id) WHERE status = 'PUBLISHED';
```

**Connection Pooling**: Use PgBouncer for high-concurrency applications. Default pool size: 10-20 connections.

---

## 6. Seed Data

### Create Admin User

```typescript
// prisma/seed.ts
import { hash } from 'bcrypt'

export default async function seed() {
  const adminPassword = await hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@researchverse.com' },
    update: {},
    create: {
      email: 'admin@researchverse.com',
      name: 'Admin',
      role: 'ADMIN',
      password: adminPassword,
    },
  })
}
```

### Create Default Categories

```typescript
const categories = [
  'General',
  'Science',
  'Technology',
  'Engineering',
  'Medicine',
  'Social Sciences',
  'Arts',
  'Literature',
]

for (const name of categories) {
  await prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  })
}
```

---

## 7. Migrations

### Commands

```bash
# Generate client
npx prisma generate

# Push schema (development)
npx prisma db push

# Create migration
npx prisma migrate dev --name init

# Apply migrations (production)
npx prisma migrate deploy

# Open GUI
npx prisma studio
```

### Environment Setup

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/paperas"

# Supabase
DATABASE_URL="postgresql://postgres:password@project.supabase.co:5432/postgres"
```

### Reset Database

```bash
# WARNING: Deletes all data
npx prisma migrate reset
```

---

## Enums Reference

### UserRole

```prisma
enum UserRole {
  GUEST
  AUTHOR
  REVIEWER
  EDITOR
  ADMIN
}
```

### PaperStatus

```prisma
enum PaperStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  REVISION_REQUESTED
  ACCEPTED
  PUBLISHED
  REJECTED
}
```

### ReviewRecommendation

```prisma
enum ReviewRecommendation {
  ACCEPT
  MINOR_REVISION
  MAJOR_REVISION
  REJECT
}
```

### NotificationType

```prisma
enum NotificationType {
  SUBMISSION_RECEIVED
  REVIEW_COMPLETED
  REVISION_REQUESTED
  PAPER_ACCEPTED
  PAPER_PUBLISHED
  REVIEWER_ASSIGNED
  USER_REGISTERED
}
```

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Technical specification
- [API.md](./API.md) - API documentation
- [DEPLOY.md](./DEPLOY.md) - Deployment guide