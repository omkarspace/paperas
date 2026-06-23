# Phase 1: DevEx & Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Paperas trivially easy for any developer to run and contribute to via Docker, CI/CD, and quality automation.

**Architecture:** Multi-stage Docker image for the Next.js app + PostgreSQL via docker-compose. GitHub Actions CI runs on all PRs. Dependabot keeps dependencies fresh.

**Tech Stack:** Docker, GitHub Actions, Dependabot

---

### Task 1: Dockerize the App

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.dockerignore`
- Create: `docker-entrypoint.sh`

- [ ] **Step 1: Create `Dockerfile`**

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
```

- [ ] **Step 2: Create `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: paperas
      POSTGRES_PASSWORD: paperas
      POSTGRES_DB: paperas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://paperas:paperas@db:5432/paperas
      AUTH_SECRET: ${AUTH_SECRET:-dev-secret-change-in-production}
      NEXTAUTH_URL: http://localhost:3000
      NEXT_PUBLIC_APP_URL: http://localhost:3000
    depends_on:
      - db

volumes:
  postgres_data:
```

- [ ] **Step 3: Create `.dockerignore`**

```
node_modules
.next
.git
.gitignore
coverage
.env
.env.local
*.md
```

- [ ] **Step 4: Create `docker-entrypoint.sh`**

```sh
#!/bin/sh
set -e

echo "Waiting for database..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  sleep 2
done
echo "Database ready!"

exec "$@"
```

- [ ] **Step 5: Ensure Next.js output is standalone in `next.config.ts`**

Read `next.config.ts`. If it doesn't have `output: "standalone"`, add it:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 6: Commit**

```bash
git add Dockerfile docker-compose.yml .dockerignore docker-entrypoint.sh next.config.ts
git commit -m "feat: add Docker setup for one-command dev environment"
```

---

### Task 2: Set up CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/paperas_test

jobs:
  quality:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: paperas_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - run: npm ci

      - run: npx prisma generate

      - run: npx prisma db push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/paperas_test

      - run: npm run typecheck

      - run: npm run lint

      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/paperas_test
```

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t paperas .

      # Add your deployment target here:
      # - Push to container registry
      # - SSH to VPS and deploy
      # - Deploy to Vercel/Railway/Fly.io

      - run: echo "Deploy step configured for your target platform"
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/
git commit -m "ci: add GitHub Actions CI and deploy workflows"
```

---

### Task 3: Quality Automation Config

**Files:**
- Create: `.github/dependabot.yml`
- Create: `.github/labeler.yml`
- Create: `.editorconfig`

- [ ] **Step 1: Create `.github/dependabot.yml`**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

- [ ] **Step 2: Create `.github/labeler.yml`**

```yaml
"frontend":
  - changed-files:
      - any-glob-to-any-file: "src/components/**/*"
      - any-glob-to-any-file: "src/app/**/*"

"backend":
  - changed-files:
      - any-glob-to-any-file: "src/lib/**/*"
      - any-glob-to-any-file: "src/app/api/**/*"

"database":
  - changed-files:
      - any-glob-to-any-file: "prisma/**/*"

"documentation":
  - changed-files:
      - any-glob-to-any-file: "*.md"
      - any-glob-to-any-file: "docs/**/*"

"ci":
  - changed-files:
      - any-glob-to-any-file: ".github/**/*"

"dependencies":
  - changed-files:
      - any-glob-to-any-file: "package.json"
      - any-glob-to-any-file: "package-lock.json"
```

- [ ] **Step 3: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 4: Commit**

```bash
git add .github/dependabot.yml .github/labeler.yml .editorconfig
git commit -m "chore: add dependabot, labeler, and editorconfig"
```
