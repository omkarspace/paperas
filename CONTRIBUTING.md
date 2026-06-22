# Contributing to Paperas

First off, thanks for taking the time to contribute!

## Quick Start

```bash
git clone https://github.com/[YOUR_USERNAME]/paperas.git
cd paperas
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

## Development Setup

- **Node.js** 20+
- **PostgreSQL** 14+ (or SQLite for local dev — update `DATABASE_URL` in `.env.local`)
- **npm** or **pnpm**

### Code Quality

Every PR must pass:

```bash
npm run typecheck   # TypeScript strict mode
npm run lint        # ESLint
npm run test        # Vitest
```

## Pull Request Process

1. Create a branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run quality checks
4. Commit with conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
5. Push and open a PR
6. Ensure the CI checks pass

## Code Standards

- TypeScript strict mode — no `any` types
- Tailwind CSS for styling — no inline styles
- Server Components by default, `"use client"` only for interactivity
- Prefer smaller focused files over large ones
- Follow existing patterns in the codebase

## Getting Help

Open a discussion or issue if you have questions.
