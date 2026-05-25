# Deployment Guide

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development](#2-local-development)
3. [Production Deployment](#3-production-deployment)
4. [Service Setup](#4-service-setup)
5. [Domain & SSL](#5-domain--ssl)
6. [Database Migrations](#6-database-migrations)
7. [Monitoring](#7-monitoring)
8. [Troubleshooting](#8-troubleshooting)
9. [Checklists](#9-checklists)
10. [Cost Estimates](#10-cost-estimates)

---

## 1. Prerequisites

### Required Accounts

| Service | Purpose | Required |
|---------|---------|----------|
| GitHub | Code hosting | Yes |
| Vercel | Hosting | Yes |
| PostgreSQL | Database | Yes |
| AWS S3 | File storage | Yes |
| Google Cloud | OAuth | Optional |
| Typesense | Search | Optional |
| Gemini | AI features | Optional |

### Software Requirements

```bash
node --version  # 20+
npm --version
git --version
```

---

## 2. Local Development

### Step 1: Clone & Install

```bash
git clone https://github.com/your-repo/research-verse.git
cd research-verse
npm install
```

### Step 2: Environment Setup

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/research_verse"

# Auth.js (required)
AUTH_SECRET="your-32-char-secret-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate AUTH_SECRET:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 3: Database Setup

**Option A: Docker**

```bash
docker run -d \
  --name research-verse-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=research_verse \
  -p 5432:5432 \
  postgres:16
```

**Option B: Supabase**

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Update DATABASE_URL

**Initialize Database:**

```bash
npx prisma generate
npx prisma db push
```

### Step 4: Start Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 3. Production Deployment

### Option A: Vercel (Recommended)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "feat: initial commit"
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub
4. Select repository
5. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| DATABASE_URL | Your PostgreSQL connection string |
| AUTH_SECRET | Generate with `openssl rand -base64 32` |
| GOOGLE_CLIENT_ID | From Google Cloud Console |
| GOOGLE_CLIENT_SECRET | From Google Cloud Console |
| AWS_ACCESS_KEY_ID | From AWS IAM |
| AWS_SECRET_ACCESS_KEY | From AWS IAM |
| AWS_BUCKET_NAME | e.g., `research-verse-papers` |
| AWS_REGION | e.g., `us-east-1` |
| NEXT_PUBLIC_APP_URL | Your production URL |

#### Step 4: Deploy

Push to main branch → Vercel auto-deploys.

---

### Option B: Railway

```bash
npm install -g railway
railway init
railway up
```

---

## 4. Service Setup

### AWS S3

#### Create Bucket

1. Go to [S3 Console](https://s3.console.aws.amazon.com)
2. Click "Create bucket"
3. Name: `research-verse-papers`
4. Region: Choose closest
5. Uncheck "Block all public access"
6. Enable versioning

#### CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://your-domain.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Add in bucket → Permissions → CORS

#### IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::research-verse-papers/*"
    }
  ]
}
```

Create IAM user → Attach policy → Get credentials

---

### Google OAuth

#### Create Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Go to APIs & Services → OAuth consent screen
4. Choose "External"
5. Fill app details

#### Create Credentials

1. Go to APIs & Services → Credentials
2. Create OAuth client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`
5. Copy Client ID and Secret

---

### Typesense (Optional)

#### Cloud Setup

1. Go to [typesense.io/cloud](https://typesense.io/cloud)
2. Create cluster
3. Copy API key and host

#### Self-Hosted

```bash
docker run -d \
  -p 8108:8108 \
  -v typesense-data:/data \
  typesense/typesense:0.25.0 \
  --api-key=your-api-key \
  --data-dir=/data
```

---

## 5. Domain & SSL

### Configure Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Update App URL

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 6. Database Migrations

### First Deployment

```bash
npx prisma migrate deploy
```

### Subsequent Deployments

Migrations run automatically on Vercel deploy.

### Reset Database

```bash
# WARNING: Deletes all data
npx prisma migrate reset
```

---

## 7. Monitoring

### Vercel Analytics

Built-in at [vercel.com/analytics](https://vercel.com/analytics)

### Error Tracking (Optional)

```bash
npm install @sentry/nextjs
```

Configure:
- `sentry.client.config.ts`
- `sentry.edge.config.ts`
- `sentry.server.config.ts`

---

## 8. Troubleshooting

### Database Connection Failed

```
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check firewall rules
- Verify connection string
```

### S3 Access Denied

```
- Verify IAM credentials
- Check bucket policy
- Verify CORS settings
- Check bucket is in same region
```

### Google OAuth Error

```
- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure HTTPS in production
```

### Auth Secret Error

```
- Generate AUTH_SECRET: openssl rand -base64 32
- Restart server
```

### Build Failed

```bash
# Clear cache
rm -rf .next node_modules/.cache

# Regenerate
npm install
npm run build
```

---

## 9. Checklists

### Pre-Deployment

- [ ] All environment variables set
- [ ] Database schema pushed
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Tests passing

### Service Setup

- [ ] PostgreSQL connected
- [ ] S3 bucket created with CORS
- [ ] Google OAuth configured
- [ ] Typesense cluster ready (if using)

### Production

- [ ] Environment variables in Vercel
- [ ] AUTH_SECRET generated (production)
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Migrations applied

### Post-Launch

- [ ] Test login flow
- [ ] Test paper submission
- [ ] Verify email notifications
- [ ] Check error logs
- [ ] Monitor performance

---

## 10. Cost Estimates

### Monthly Costs (MVP)

| Service | Free Tier | Estimated |
|---------|-----------|-----------|
| Vercel | 100GB bandwidth | $0-20 |
| Supabase | 500MB DB | $0-25 |
| AWS S3 | 5GB storage | $0-5 |
| Google Cloud | Free | $0 |
| Typesense Cloud | 1M docs | $0-10 |
| Gemini API | Free tier | $0-10 |
| **Total** | | **$0-70/mo** |

### Reducing Costs

- Use Supabase free tier
- Use Cloudflare CDN
- Enable Vercel caching
- Use PostgreSQL full-text search (skip Typesense)

---

## Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run typecheck    # TypeScript check

# Database
npx prisma generate   # Generate client
npx prisma db push    # Push schema (dev)
npx prisma migrate dev # Create migration
npx prisma migrate deploy # Apply migrations
npx prisma studio     # Open Prisma Studio

# Tests
npm run test          # Run tests
npm run test:watch    # Watch mode
```

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Technical specification
- [DATABASE.md](./DATABASE.md) - Database schema
- [QUICKSTART.md](./QUICKSTART.md) - New developer guide