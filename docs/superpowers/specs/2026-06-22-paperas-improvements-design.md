# Paperas Platform Improvement Plan

> Comprehensive improvements across DevEx, integrations, UI/UX, and advanced features for the Paperas open-source academic publishing platform.

## Phases

### Phase 1: DevEx & Infrastructure

**Goal:** Make the project trivially easy for any developer to run and contribute to.

#### Docker Setup

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage Node.js 20 build for the Next.js app |
| `docker-compose.yml` | App + PostgreSQL + Typesense (optional) |
| `.dockerignore` | Exclude node_modules, .next, coverage |
| `docker-entrypoint.sh` | Wait for DB, run prisma generate, start app |

#### CI/CD (GitHub Actions)

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | PR + push to main | Install → Lint → Typecheck → Test |
| `deploy.yml` | Push to main | Build → Deploy (user configures target) |

#### Quality Automation

- Dependabot config for npm auto-updates
- `.github/labeler.yml` auto-label PRs
- `.editorconfig` for consistent formatting

---

### Phase 2: Critical Integrations

**Goal:** Achieve parity with platforms like OJS and Janeway for discoverability.

#### ORCID Sign-In
- Add ORCID to Auth.js providers
- `orcidId` field on User model
- "Sign in with ORCID" button on login/register
- Fetch name + affiliation from ORCID API on sign-up

#### DOI/Crossref Integration
- `doi` field on Paper model
- Server action registers DOI via Crossref API when paper status → `PUBLISHED`
- DOI prefix configurable in admin settings
- DOI badge displayed on paper detail page

#### OAI-PMH Endpoint
- Route: `GET /oai`
- Supports `ListRecords` verb with `oai_dc` metadata prefix
- Returns Dublin Core XML for all published papers
- Required by Google Scholar and DOAJ for indexing

---

### Phase 3: UI/UX Overhaul

**Goal:** Modern, accessible, mobile-friendly interface that attracts contributors and users.

#### Dark Mode
- `next-themes` with `<ThemeProvider>`
- Navbar toggle button (sun/moon icon)
- Persistent preference + system default
- Tailwind `class` dark mode strategy

#### Mobile-First Responsive
- Audit all pages at 375px, 768px, 1024px, 1440px
- Fix overflowing tables, small touch targets, broken layouts
- Bottom navigation bar on mobile

#### PWA
- Manifest + service worker via `serwist`
- Install prompt for mobile/desktop
- Offline fallback page

#### Drag-and-Drop Submission Wizard
- Multi-step: Upload → Metadata → Review → Submit
- PDF drag-and-drop zone with validation (50MB, PDF only)
- Auto-extract title/authors from PDF metadata

#### Page Transitions
- Framer Motion for route transitions (fade/slide)
- Loading skeletons instead of spinners

---

### Phase 4: Advanced Features

**Goal:** Differentiate Paperas with features that attract both users and contributors.

#### JATS XML Export
- Generate JATS XML for any published paper
- Download button on paper detail page
- Standard format for PubMed Central, Crossref

#### Citation Export
- Dropdown with BibTeX, RIS, APA, MLA, Chicago, IEEE
- String templates (no heavy library)

#### Enhanced Analytics
- Line charts for views/downloads via Recharts
- Geographic breakdown
- Top papers ranking
- Editorial stats: acceptance rate, avg time to decision

#### SEO & Sitemap
- Dynamic XML sitemap: `/sitemap.xml`
- Auto-generate for papers, issues, static pages
- Per-page meta tags + OG images
- JSON-LD structured data for Google Scholar

## Implementation Order

Phase 1 → Phase 2 → Phase 3 → Phase 4. Each phase is independently deployable.
