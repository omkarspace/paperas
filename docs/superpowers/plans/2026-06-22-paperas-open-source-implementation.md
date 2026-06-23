# Paperas Open Source & Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebrand "Research Verse Journal Platform" to Paperas and add open-source community files (MIT license, contributing guide, GitHub templates).

**Architecture:** This is a text-level rebrand + new community files. No functional changes to the application. Find-and-replace "Research Verse" → "Paperas" across source and docs, create 7 new files (LICENSE, CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, 3 GitHub templates).

**Tech Stack:** MIT License, Markdown, Next.js TypeScript components.

---

### Task 1: Create License, Code of Conduct, Security Policy

**Files:**
- Create: `LICENSE`
- Create: `CODE_OF_CONDUCT.md`
- Create: `SECURITY.md`

- [ ] **Step 1: Create `LICENSE` with MIT text**

```
MIT License

Copyright (c) 2026 Omkar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Create `CODE_OF_CONDUCT.md`**

```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, religion, or sexual identity
and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes
* Focusing on what is best for the overall community

Examples of unacceptable behavior:

* The use of sexualized language or imagery
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information without explicit permission
* Other conduct which could reasonably be considered inappropriate

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
[INSERT CONTACT METHOD]. All complaints will be reviewed and investigated
promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
https://www.contributor-covenant.org/version/2/1/code_of_conduct.html.

[homepage]: https://www.contributor-covenant.org
```

- [ ] **Step 3: Create `SECURITY.md`**

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Paperas, please report it privately.
**Do not disclose it publicly until we've had a chance to address it.**

To report a vulnerability, please email [INSERT EMAIL] with details including:

- A description of the vulnerability
- Steps to reproduce it
- Potential impact

We will acknowledge receipt within 48 hours and provide a timeline for a fix.

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |
| older   | ❌        |
```

- [ ] **Step 4: Commit**

```
git add LICENSE CODE_OF_CONDUCT.md SECURITY.md
git commit -m "feat: add MIT license, code of conduct, and security policy"
```

---

### Task 2: Create GitHub Issue/PR Templates

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.md`
- Create: `.github/ISSUE_TEMPLATE/feature_request.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

- [ ] **Step 1: Create `.github/ISSUE_TEMPLATE/bug_report.md`**

```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox]
- Node version: [e.g. 20.x]

**Additional context**
Add any other context about the problem here.
```

- [ ] **Step 2: Create `.github/ISSUE_TEMPLATE/feature_request.md`**

```markdown
---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

- [ ] **Step 3: Create `.github/PULL_REQUEST_TEMPLATE.md`**

```markdown
## Description

Please include a summary of the changes and the related issue.

Fixes #(issue)

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Checklist

- [ ] I have read the [CONTRIBUTING](../CONTRIBUTING.md) document
- [ ] My code follows the project's coding style
- [ ] I have added tests that prove my fix/feature works
- [ ] All existing tests pass (`npm run test`)
- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
```

- [ ] **Step 4: Commit**

```
git add .github/
git commit -m "chore: add GitHub issue and PR templates"
```

---

### Task 3: Create CONTRIBUTING.md

**Files:**
- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Create `CONTRIBUTING.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```
git add CONTRIBUTING.md
git commit -m "docs: add contributing guide"
```

---

### Task 4: Update package.json and .env.example

**Files:**
- Modify: `package.json` (line 2, line 3)
- Modify: `.env.example` (line 2)

- [ ] **Step 1: Modify `package.json` — rename and make public**

Change line 2 from `"name": "research-verse"` to `"name": "paperas"`.
Change line 3 from `"private": true` to `"private": false`.

- [ ] **Step 2: Modify `.env.example` — update database name**

Change line 2 from `DATABASE_URL="postgresql://user:password@localhost:5432/research_verse"` to `DATABASE_URL="postgresql://user:password@localhost:5432/paperas"`.

- [ ] **Step 3: Commit**

```
git add package.json .env.example
git commit -m "chore: rename package to paperas and update default DB name"
```

---

### Task 5: Rebrand React Components and Pages

**Files:**
- Modify: `src/app/layout.tsx` (lines 7, 9)
- Modify: `src/components/shared/navbar.tsx` (line 42)
- Modify: `src/components/shared/footer.tsx` (lines 12, 15, 60, 75)
- Modify: `src/app/page.tsx` (line 24)
- Modify: `src/app/about/page.tsx` (line 10)
- Modify: `src/app/about/aim-scope/page.tsx` (line 10)
- Modify: `src/app/about/publication-ethics/page.tsx` (line 10)
- Modify: `src/app/contact/page.tsx` (line 60)
- Modify: `src/app/admin/settings/page.tsx` (lines 28, 32, 36)

- [ ] **Step 1: Update layout metadata**

In `src/app/layout.tsx`:
- Line 7: `title: "Research Verse Journal - Academic Publishing Platform"` → `title: "Paperas - Open Source Academic Publishing Platform"`
- Line 9: `"Research Verse Journal and Publication House of India - ..."` → `"Paperas - An open source academic publishing platform for scholarly journals."`

- [ ] **Step 2: Update navbar brand text**

In `src/components/shared/navbar.tsx`, line 42:
`<span className="text-xl font-bold">Research Verse</span>` → `<span className="text-xl font-bold">Paperas</span>`

- [ ] **Step 3: Update footer brand references**

In `src/components/shared/footer.tsx`:
- Line 12: `Research Verse` → `Paperas`
- Line 15: `Research Verse Journal and Publication House of India is a` → `Paperas is an`
- Line 60: `editor@researchverse.in` → `editor@paperas.dev`
- Line 75: `Research Verse Journal.` → `Paperas.`

- [ ] **Step 4: Update homepage hero title**

In `src/app/page.tsx`, line 24:
`Research Verse Journal` → `Paperas`

- [ ] **Step 5: Update about pages**

In `src/app/about/page.tsx`, line 10:
`Research Verse Journal and Publication House of India is a` → `Paperas is an open source`

In `src/app/about/aim-scope/page.tsx`, line 10:
`Research Verse Journal aims` → `Paperas aims`

In `src/app/about/publication-ethics/page.tsx`, line 10:
`Research Verse Journal is committed` → `Paperas is committed`

- [ ] **Step 6: Update contact page**

In `src/app/contact/page.tsx`, line 60:
`Research Verse Journal` → `Paperas`

- [ ] **Step 7: Update admin settings defaults**

In `src/app/admin/settings/page.tsx`:
- Line 28: `defaultValue="Research Verse Journal"` → `defaultValue="Paperas"`
- Line 32: `defaultValue="RVJ-2026-0001"` → `defaultValue="PAP-2026-0001"`
- Line 36: `defaultValue="editor@researchverse.in"` → `defaultValue="editor@paperas.dev"`

- [ ] **Step 8: Commit**

```
git add src/app/layout.tsx src/components/shared/navbar.tsx src/components/shared/footer.tsx src/app/page.tsx src/app/about/page.tsx src/app/about/aim-scope/page.tsx src/app/about/publication-ethics/page.tsx src/app/contact/page.tsx src/app/admin/settings/page.tsx
git commit -m "feat: rebrand UI components and pages from Research Verse to Paperas"
```

---

### Task 6: Rebrand Documentation Files (Part 1)

**Files:**
- Modify: `AGENTS.md` (line 5)
- Modify: `SPEC.md` (lines 1, 26, 79)
- Modify: `QUICKSTART.md` (lines 5, 21, 22, 41)
- Modify: `COMPONENT.md` (lines 5, 122)

- [ ] **Step 1: Update AGENTS.md**

Line 5: `Research Verse Journal platform.` → `Paperas platform.`

- [ ] **Step 2: Update SPEC.md**

Line 1: `# Research Verse Journal Platform - Technical Specification` → `# Paperas - Technical Specification`
Line 26: `- **Project Name**: Research Verse Journal And Publication House Of India` → `- **Project Name**: Paperas`
Line 79: `| Journal Name | Research Verse Journal And Publication House Of India |` → `| Journal Name | Paperas |`

- [ ] **Step 3: Update QUICKSTART.md**

Line 5: `Research Verse Journal platform` → `Paperas platform`
Line 21: `research-verse.git` → `paperas.git`
Line 22: `cd research-verse` → `cd paperas`
Line 41: `research_verse` → `paperas`

- [ ] **Step 4: Update COMPONENT.md**

Line 5: `Research Verse Journal platform` → `Paperas platform`
Line 122: `© 2026 Research Verse Journal` → `© 2026 Paperas`

- [ ] **Step 5: Commit**

```
git add AGENTS.md SPEC.md QUICKSTART.md COMPONENT.md
git commit -m "docs: rebrand doc files from Research Verse to Paperas"
```

---

### Task 7: Rebrand Documentation Files (Part 2)

**Files:**
- Modify: `API.md` (lines 396-400)
- Modify: `WORKFLOW.md` (lines 325, 342, 363, 383)
- Modify: `DEPLOY.md` (lines 47, 48, 58, 93, 96, 160, 188, 217)

- [ ] **Step 1: Update API.md citation examples**

Lines 396-400: Replace `Research Verse Journal` with `Paperas` in all 5 citation format examples.

- [ ] **Step 2: Update WORKFLOW.md**

Lines 325, 342, 363, 383: Replace `Research Verse Journal` with `Paperas` in all editorial team references.

- [ ] **Step 3: Update DEPLOY.md**

Line 47: `research-verse.git` → `paperas.git`
Line 48: `cd research-verse` → `cd paperas`
Line 58: `research_verse` → `paperas`
Line 93: `--name research-verse-db` → `--name paperas-db`
Line 96: `POSTGRES_DB=research_verse` → `POSTGRES_DB=paperas`
Line 160: `research-verse-papers` → `paperas-papers`
Line 188: `research-verse-papers` → `paperas-papers`
Line 217: `research-verse-papers` → `paperas-papers`

- [ ] **Step 4: Update DATABASE.md**

Line 342: `research_verse` → `paperas` in the DATABASE_URL example.

- [ ] **Step 5: Commit**

```
git add API.md WORKFLOW.md DEPLOY.md DATABASE.md
git commit -m "docs: rebrand remaining doc files to Paperas"
```

---

### Task 8: Rewrite README.md

**Files:**
- Modify: `README.md` (full rewrite)

- [ ] **Step 1: Rewrite README.md with Paperas branding**

Replace entire file with:

```markdown
# Paperas

> An open source academic publishing platform for scholarly journals.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Paperas is a comprehensive, open-source academic publishing system. It provides a complete workflow from paper submission to publication — including peer review, editorial management, and public archive access.

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **9 Public Pages** | Home, About, Aim & Scope, Editorial Board, Author Guidelines, Publication Ethics, Contact, Archives |
| **Paper Submission** | Multi-step form with PDF upload, draft management, revisions |
| **Peer Review System** | Blind review support, reviewer assignment, recommendations |
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

## Tech Stack

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

## Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 14+ (or SQLite for local dev)

### Installation

```bash
git clone https://github.com/[YOUR_USERNAME]/paperas.git
cd paperas
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

- [Good First Issues](https://github.com/[YOUR_USERNAME]/paperas/issues?q=is:issue+is:open+label:%22good+first+issue%22)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](./SPEC.md) | Technical specification, routes, models |
| [DESIGN.md](./DESIGN.md) | Design system, UI/UX guidelines |
| [API.md](./API.md) | API endpoints documentation |
| [DATABASE.md](./DATABASE.md) | Database schema |
| [DEPLOY.md](./DEPLOY.md) | Deployment guide |

## License

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 Omkar
```

- [ ] **Step 2: Commit**

```
git add README.md
git commit -m "docs: rewrite README with Paperas branding"
```

---

### Task 9: Clean Up Old Plan Reference and Verify

**Files:**
- Modify: `docs/superpowers/plans/2026-05-24-project-completion.md` (line 494)

- [ ] **Step 1: Update old plan reference**

In `docs/superpowers/plans/2026-05-24-project-completion.md`, line 494:
`expect(screen.getByText("Research Verse")).toBeDefined();` → `expect(screen.getByText("Paperas")).toBeDefined();`

- [ ] **Step 2: Verify build still works**

Run: `npm run typecheck`
Expected: No TypeScript errors

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 3: Commit final cleanup**

```
git add docs/superpowers/plans/2026-05-24-project-completion.md
git commit -m "chore: update old plan reference to Paperas"
```
