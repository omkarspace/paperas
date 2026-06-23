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

### Paper Workflow

```
DRAFT → SUBMITTED → UNDER_REVIEW → REVISION_REQUESTED → ACCEPTED → PUBLISHED
                                                      ↘ REJECTED
```

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
| [SPEC.md](./docs/SPEC.md) | Technical specification, routes, models |
| [DESIGN.md](./docs/DESIGN.md) | Design system, UI/UX guidelines |
| [API.md](./docs/API.md) | API endpoints documentation |
| [DATABASE.md](./docs/DATABASE.md) | Database schema |
| [DEPLOY.md](./docs/DEPLOY.md) | Deployment guide |
| [QUICKSTART.md](./docs/QUICKSTART.md) | New developer quick start |

## License

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 Omkar
