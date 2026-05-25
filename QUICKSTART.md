# Quick Start Guide

## For New Developers

This guide gets you up and running with the Research Verse Journal platform in 10 minutes.

---

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] PostgreSQL database (local or cloud)
- [ ] Git installed

---

## Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/your-repo/research-verse.git
cd research-verse

# Install dependencies
npm install
```

---

## Step 2: Environment Setup

```bash
# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/research_verse"
AUTH_SECRET="generate-a-random-32-char-string"

# Optional (for now, leave empty)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION=""
GEMINI_API_KEY=""
```

Generate AUTH_SECRET:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) )
```

---

## Step 3: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

---

## Step 4: Start Development

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Tour

### Key Files

| File | Purpose |
|------|---------|
| `SPEC.md` | Technical specification |
| `prisma/schema.prisma` | Database schema |
| `src/app/` | Next.js pages |
| `src/components/` | UI components |
| `src/lib/` | Utilities |

### Folder Structure

```
src/
├── app/
│   ├── (public)/     # Public pages
│   ├── (auth)/       # Login/Register
│   ├── (dashboard)/   # Author dashboard
│   └── api/         # API routes
├── components/
│   ├── ui/          # Shadcn components
│   └── shared/      # Shared components
└── lib/
    ├── db.ts        # Prisma client
    ├── auth.ts      # Auth.js config
    └── utils.ts     # Utilities
```

---

## Common Tasks

### Add a New Page

1. Create route: `src/app/(public)/example/page.tsx`
2. Add to `SPEC.md` routes section

### Add Database Model

1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Use in code: `import { db } from '@/lib/db'`

### Add API Endpoint

1. Create: `src/app/api/example/route.ts`
2. Implement GET/POST handlers

### Add Component

```bash
# Use Shadcn
npx shadcn@latest add button

# Or create custom
# src/components/example/my-component.tsx
```

---

## Testing Your Changes

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Test
npm run test
```

---

## Development Workflow

1. **Create branch**: `git checkout -b feature/my-feature`
2. **Make changes**: Edit files
3. **Test**: Run `npm run typecheck && npm run lint`
4. **Commit**: `git add . && git commit -m "feat: add my feature"`
5. **Push**: `git push origin feature/my-feature`
6. **PR**: Create pull request on GitHub

---

## Troubleshooting

### "Prisma Client not found"

```bash
npx prisma generate
```

### "Cannot connect to database"

- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check firewall settings

### "Module not found"

```bash
npm install
npx prisma generate
```

---

## Next Steps

1. Read [SPEC.md](./SPEC.md) for architecture
2. Read [DATABASE.md](./DATABASE.md) for schema
3. Read [API.md](./API.md) for endpoints
4. Read [AGENTS.md](./AGENTS.md) for guidelines

---

## Getting Help

- Check existing code patterns
- Ask before implementing major changes
- Follow the principles in AGENTS.md