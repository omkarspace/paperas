# Paperas — Open Source Rebrand & Community Launch

## Overview

Rebrand "Research Verse Journal Platform" to **Paperas** and open source it under MIT License to attract contributors, build credibility, and establish recognition.

## License: MIT

- Copyright holder: Omkar (individual)
- Maximizes adoption and contributions
- Retains full ownership (license grants permissions, not transfer of ownership)
- No CLA required — contributions are accepted under the same MIT license

## Rebrand: Research Verse → Paperas

### All replacements

| Location | Change |
|----------|--------|
| `package.json` | `name: "research-verse"` → `"paperas"`, remove `"private": true` |
| README.md | Full rewrite with Paperas branding |
| `src/app/layout.tsx` | Site title, meta tags, description |
| README.md, SPEC.md, DESIGN.md, AGENTS.md, QUICKSTART.md, COMPONENT.md, API.md, WORKFLOW.md, DEPLOY.md | Any hardcoded "Research Verse" strings |
| `.env.example` | `DATABASE_URL` DB name if referencing `research_verse` |
| Journal defaults in docs | Brand name, ISSN references |

### What stays

- ISSN format `RVJ-YYYY-XXXX` (rename prefix to `PAP-YYYY-XXXX` or keep — user choice)
- Code architecture, routes, components — no functional changes
- AGENTS.md — move internal/AI guidance to `.github/` with "(Internal)" marker

## Files to Create

| File | Content |
|------|---------|
| `LICENSE` | MIT License full text with copyright notice |
| `CONTRIBUTING.md` | Setup guide, code standards, PR workflow, development setup |
| `CODE_OF_CONDUCT.md` | Contributor Covenant v2.1 |
| `SECURITY.md` | How to report vulnerabilities |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report form |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request form |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist template |

## Community Setup

- **Labels:** `good first issue`, `help wanted`, `bug`, `enhancement`, `documentation`
- **Badges in README:** License, build status, PRs welcome, contributors
- **Contribution ladder:** typo fix → bug → feature → reviewer → maintainer

## Implementation Order

1. Create LICENSE + CODE_OF_CONDUCT.md + SECURITY.md
2. Create GitHub issue/PR templates
3. Rebrand code and docs (find-and-replace "Research Verse" → "Paperas")
4. Rewrite README.md with new brand, badges, contributor info
5. Update CONTRIBUTING.md
6. Final cleanup pass

## Success Criteria

- MIT License file present with correct copyright
- No "Research Verse" references remain in source or docs
- CONTRIBUTING.md provides clear 5-minute onboarding
- GitHub templates ready for community interaction
- `npm run dev` still works after changes
