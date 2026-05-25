# Research Verse Journal Platform

> An ISSN-Licensed Academic Publishing Platform for Research Verse Journal And Publication House Of India

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)

---

## Overview

**Research Verse Journal Platform** is a comprehensive academic publishing system designed for scholarly journals. It provides a complete workflow from paper submission to publication, including peer review, editorial management, and public archive access.

### ISSN Format

```
RVJ-YYYY-XXXX (e.g., RVJ-2026-0001)
```

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **9 Public Pages** | Home, About, Aim & Scope, Editorial Board, Author Guidelines, Publication Ethics, Contact, Archives |
| **Paper Submission** | Multi-step form with PDF upload, draft management, revisions |
| **Peer Review System** | Blind review support, reviewer assignment, recommendations (Accept/Reject/Revise) |
| **Authentication** | Email/password + Google OAuth with role-based access |
| **Admin Dashboard** | Manage submissions, users, issues, settings, analytics |
| **Search & Archive** | Full-text search, filters, categorized browsing |
| **Email Notifications** | Automated alerts for submission, review, publication |

### User Roles

| Role | Permissions |
|------|-------------|
| **Author** | Submit papers, track status, view analytics |
| **Reviewer** | Access assigned papers, submit reviews |
| **Editor** | Manage submissions, assign reviewers, publish issues |
| **Admin** | Full system access, user management, settings |

### Paper Workflow

```
DRAFT → SUBMITTED → UNDER_REVIEW → REVISION_REQUESTED → ACCEPTED → PUBLISHED
                                                      ↘ REJECTED
```

---

## Tech Stack

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  Next.js 15 (App Router) + TypeScript + Tailwind CSS + Shadcn │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                   │
│           Next.js API Routes + Server Actions                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  PostgreSQL  │ │    AWS S3    │ │   Typesense  │
            │  (Prisma)   │ │  (Storage)   │ │  (Search)    │
            └──────────────┘ └──────────────┘ └──────────────┘
```

### Tech Stack Details

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.3 |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Database** | PostgreSQL 16 + Prisma ORM |
| **Auth** | Auth.js (NextAuth v5) |
| **Storage** | AWS S3 |
| **Search** | Typesense (optional) |
| **AI** | Gemini (optional) |

---

## Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 14+ database
- **npm** or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/research-verse.git
cd research-verse

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your database URL and secrets

# 5. Initialize database
npx prisma generate
npx prisma db push

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | This file - project overview |
| [SPEC.md](./SPEC.md) | Technical specification, routes, models |
| [DESIGN.md](./DESIGN.md) | Design system, UI/UX guidelines |
| [DATABASE.md](./DATABASE.md) | Database schema, relations |
| [API.md](./API.md) | API endpoints documentation |
| [WORKFLOW.md](./WORKFLOW.md) | User workflows, state transitions |
| [COMPONENT.md](./COMPONENT.md) | UI component library |
| [DEPLOY.md](./DEPLOY.md) | Deployment guide |
| [AGENTS.md](./AGENTS.md) | Development guidelines for AI agents |
| [QUICKSTART.md](./QUICKSTART.md) | New developer quick start |

---

## Project Structure

```
research-verse/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public pages
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── journal/       # Journal archive
│   │   │   ├── research/      # Research papers
│   │   │   ├── about/         # About pages
│   │   │   └── contact/       # Contact page
│   │   ├── (auth)/           # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Author dashboard
│   │   │   ├── dashboard/
│   │   │   └── papers/
│   │   ├── (reviewer)/        # Reviewer dashboard
│   │   ├── (admin)/           # Admin panel
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── ui/               # Shadcn components
│   │   ├── shared/           # Navbar, Footer
│   │   ├── papers/           # Paper components
│   │   ├── search/           # Search components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── reviewer/          # Review components
│   │   └── admin/            # Admin components
│   └── lib/
│       ├── db.ts             # Prisma client
│       ├── auth.ts           # Auth.js config
│       ├── s3.ts             # AWS S3 utils
│       ├── typesense.ts      # Typesense client
│       ├── gemini.ts         # Gemini AI
│       └── utils.ts          # Utilities
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/research_verse"

# Auth.js (required)
AUTH_SECRET="your-secret-key-minimum-32-characters"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION=""

# Typesense (optional)
TYPESENSE_API_KEY=""

# Gemini AI (optional)
GEMINI_API_KEY=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Journal Defaults

| Setting | Value |
|---------|-------|
| Journal Name | Research Verse Journal And Publication House Of India |
| ISSN Format | `RVJ-YYYY-XXXX` |
| Default Category | General |
| Max PDF Size | 50MB |
| Pagination | 20 items per page |

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run test` | Run tests |

### Database Commands

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma migrate dev` | Create migration |
| `npx prisma migrate deploy` | Apply migrations |
| `npx prisma studio` | Open Prisma Studio |

### Code Quality

```bash
# Check for linting issues
npm run lint

# Type check
npm run typecheck

# Run tests
npm run test
```

---

## Contributing

### Development Workflow

1. **Create a branch**: `git checkout -b feature/my-feature`
2. **Make changes**: Edit files following the guidelines in `AGENTS.md`
3. **Run quality checks**: `npm run lint && npm run typecheck`
4. **Commit changes**: `git commit -m "feat: add my feature"`
5. **Push**: `git push origin feature/my-feature`
6. **Create PR**: Open a pull request on GitHub

### Code Standards

- Follow TypeScript strict mode
- Use ESLint + Prettier
- No inline styles - use Tailwind classes only
- Follow existing code patterns
- Add tests for new functionality

### Documentation

- Update relevant docs when adding features
- Document API changes in `API.md`
- Update schema in `DATABASE.md`
- Add component examples in `COMPONENT.md`

---

## License

Proprietary - Research Verse Journal And Publication House Of India

All rights reserved. Unauthorized copying, distribution, or modification is prohibited.

---

## Support

For questions or issues, refer to the documentation or contact the project lead."# paperas" 
