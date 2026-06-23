# Repo Structure Reorganization — Design Spec

**Date**: 2026-06-23
**Status**: Approved
**Approach**: Option C — Hybrid (lib reorg + barrel exports + types split)

## Goal

Improve code organization and discoverability by:
1. Grouping `lib/` flat files into logical subdirectories
2. Adding barrel exports to component directories
3. Splitting monolithic `types/index.ts` into domain-specific files

## Current State

```
src/
├── app/           # 68 route files (well organized)
├── components/    # 7 dirs, 18 components
├── lib/           # 15 flat files
├── types/         # 1 index.ts (all types)
└── __tests__/     # 2 test files
```

## Target State

### 1. lib/ Reorganization

```
src/lib/
├── auth/
│   ├── index.ts
│   ├── auth.ts
│   └── next-auth.d.ts
├── services/
│   ├── index.ts
│   ├── email.ts
│   ├── gemini.ts
│   ├── typesense.ts
│   ├── citations.ts
│   ├── crossref.ts
│   └── oai-pmh.ts
├── storage/
│   ├── index.ts
│   └── s3.ts
├── utils/
│   ├── index.ts
│   ├── utils.ts
│   └── rate-limit.ts
├── db.ts
└── index.ts
```

**Import paths**:
- `import { db } from "@/lib/db"` — unchanged
- `import { sendEmail } from "@/lib/services"` — new
- `import { authOptions } from "@/lib/auth"` — unchanged (barrel re-export)

### 2. Component Barrel Exports

Add `index.ts` to each component directory:

```
src/components/ui/index.ts
src/components/shared/index.ts
src/components/papers/index.ts
src/components/admin/index.ts
src/components/dashboard/index.ts
src/components/reviewer/index.ts
src/components/search/index.ts
```

**Import paths**: Both old (`@/components/ui/button`) and new (`@/components/ui`) work.

### 3. Types Reorganization

```
src/types/
├── index.ts       # re-exports all
├── paper.ts       # Paper, PaperStatus, PaperWithRelations
├── user.ts        # User, UserRole, Session
├── review.ts      # Review, ReviewStatus
├── category.ts    # Category
├── api.ts         # ApiResponse<T>, PaginatedResponse<T>
└── misc.ts        # Shared utility types
```

**Import paths**: `import { Paper } from "@/types"` — unchanged (barrel re-export).

## Implementation Steps

1. Create `src/lib/auth/`, `src/lib/services/`, `src/lib/storage/`, `src/lib/utils/` directories
2. Move files to new locations
3. Create barrel `index.ts` files for each lib subdirectory
4. Create `src/lib/index.ts` top-level barrel
5. Create barrel `index.ts` for each component directory
6. Split `src/types/index.ts` into domain files
7. Update all import paths across codebase
8. Run `npm run typecheck` and `npm run lint`
9. Run `npm run build` to verify

## Risks

- **Import path churn**: Many files will need import updates. Mitigated by barrel exports keeping old paths working.
- **Build breakage**: Mitigated by typecheck + build verification at each step.

## Verification

- `npm run typecheck` passes
- `npm run lint` passes
- `npm run build` succeeds
- All existing tests pass
