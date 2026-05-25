# User Workflows & State Transitions

## Table of Contents

1. [Paper Status Flow](#1-paper-status-flow)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [Author Workflow](#3-author-workflow)
4. [Copyediting Stage](#4-copyediting-stage)
5. [Reviewer Workflow](#5-reviewer-workflow)
6. [Editor/Admin Workflow](#6-editoradmin-workflow)
7. [State Transitions](#7-state-transitions)
8. [Notifications](#8-notifications)
9. [Email Templates](#9-email-templates)
10. [Dashboard Views](#10-dashboard-views)
11. [Search & Discovery](#11-search--discovery)

---

## 1. Paper Status Flow

```
┌─────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────────────┐
│  DRAFT  │────►│SUBMITTED │────►│UNDER_REVIEW │────►│  ACCEPTED        │
└─────────┘     └──────────┘     └─────────────┘     └────────┬─────────┘
     │              │                  │                      │
     │              │                  │                      ▼
     │              │                  │               ┌───────────┐
     │              │                  │               │ PUBLISHED │
     │              │                  │               └───────────┘
     │              │                  │
     │              │                  ▼
     │              │         ┌──────────────────┐
     │              │         │REVISION_REQUESTED│
     │              │         └────────┬─────────┘
     │              │                  │
     │              │                  ▼
     │              │         ┌─────────────┐
     │              │         │UNDER_REVIEW │
     │              │         └─────────────┘
     │              │                  │
     ▼              ▼                  ▼
┌─────────┐   ┌───────────┐      ┌───────────┐
│ DELETED │   │ REJECTED  │      │ REJECTED  │
└─────────┘   └───────────┘      └───────────┘
```

### Status Definitions

| Status | Description |
|--------|-------------|
| DRAFT | Initial state, not submitted |
| SUBMITTED | Submitted for review |
| UNDER_REVIEW | Reviewers assigned |
| REVISION_REQUESTED | Changes requested |
| ACCEPTED | Approved for publication |
| PUBLISHED | Live in journal |
| REJECTED | Not accepted |
| DELETED | Removed |

---

## 2. User Roles & Permissions

### Roles

| Role | Description |
|------|-------------|
| GUEST | Unauthenticated visitor |
| AUTHOR | Can submit papers |
| REVIEWER | Can review assigned papers |
| EDITOR | Can manage submissions |
| ADMIN | Full access |

### Permission Matrix

| Action | Guest | Author | Reviewer | Editor | Admin |
|--------|:-----:|:------:|:--------:|:------:|:-----:|
| Browse papers | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search papers | ✓ | ✓ | ✓ | ✓ | ✓ |
| View paper details | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register/Login | - | ✓ | ✓ | ✓ | ✓ |
| Submit paper | - | ✓ | - | - | - |
| View own submissions | - | ✓ | ✓ | ✓ | ✓ |
| Submit reviews | - | - | ✓ | - | - |
| Receive reviews | - | ✓ | - | - | - |
| Assign reviewers | - | - | - | ✓ | ✓ |
| Manage submissions | - | - | - | ✓ | ✓ |
| Publish papers | - | - | - | ✓ | ✓ |
| Manage issues | - | - | - | ✓ | ✓ |
| Manage users | - | - | - | - | ✓ |
| Site settings | - | - | - | - | ✓ |
| View analytics | - | Own | - | ✓ | ✓ |

---

## 3. Author Workflow

### Registration

```
1. Fill registration form
2. Validate email/password
3. Create user (AUTHOR role)
4. (Optional) Email verification
```

### Paper Submission

```
1. Login to dashboard
2. Click "Submit Paper"
3. Fill details:
   ├── Title
   ├── Abstract
   ├── Keywords
   └── Category
4. Upload PDF (optional)
5. Choose action:
   ├── Save as Draft
   └── Submit for Review
6. Receive confirmation
7. Track status in dashboard
```

### Revision Process

```
1. Receive notification: "Revision Requested"
2. View reviewer comments
3. Edit paper details
4. Upload revised PDF
5. Resubmit
6. Status returns to UNDER_REVIEW
```

### Publication

```
1. Paper status → ACCEPTED
2. Editor assigns to issue
3. Paper status → PUBLISHED
4. Author receives notification
5. Paper appears in archive
```

---

## 4. Copyediting Stage

After review acceptance and before publication:

1. **Metadata Review**
   - Verify all author information
   - Check keyword accuracy
   - Validate reference formatting

2. **Proof Generation**
   - PDF generated with watermarks
   - Author proof approval workflow
   - Corrections tracked via system

3. **Final Metadata Synchronization**
   - PDF metadata = Database metadata
   - No placeholder text in any field
   - Publication date set

---

## 5. Reviewer Workflow

### Assignment

```
1. Editor assigns paper
2. Reviewer receives notification
3. Reviewer sees paper in dashboard
4. Reviewer accepts/declines assignment
```

### Review Process

```
1. Open assigned paper
2. Download and read PDF
3. Fill review form:
   ├── Comments (required)
   ├── Recommendation (required)
   └── Ratings (optional)
4. Submit review
5. (Blind review: author name hidden)
```

### Recommendations

| Recommendation | Description | Paper Status |
|----------------|-------------|--------------|
| ACCEPT | Ready for publication | ACCEPTED |
| MINOR_REVISION | Small changes needed | REVISION_REQUESTED |
| MAJOR_REVISION | Significant changes needed | REVISION_REQUESTED |
| REJECT | Not suitable for journal | REJECTED |

---

## 5. Editor/Admin Workflow

### Submission Management

```
1. View all submissions
2. Filter by status
3. Open submission details
4. Assign reviewers
5. Review comments
6. Make decision:
   ├── Request revision
   ├── Accept paper
   └── Reject paper
```

### Reviewer Assignment

```
1. Open submission
2. Click "Assign Reviewers"
3. Select reviewers:
   ├── Filter by expertise
   └── Check availability
4. Send invitations
5. Track review progress
6. Collect final recommendations
```

### Publication Process

```
1. Navigate to Issues
2. Create/select issue
3. Assign accepted papers
4. Review issue contents
5. Publish issue
6. Papers go live
```

---

## 6. State Transitions

### Valid Transitions

```typescript
const transitions = {
  DRAFT: ['SUBMITTED', 'DELETED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['REVISION_REQUESTED', 'ACCEPTED', 'REJECTED'],
  REVISION_REQUESTED: ['UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
  ACCEPTED: ['PUBLISHED'],
  PUBLISHED: [],  // Terminal
  REJECTED: [],    // Terminal
  DELETED: [],     // Terminal
}
```

### Transition Conditions

| From | To | Required Conditions |
|------|-----|---------------------|
| DRAFT | SUBMITTED | title, abstract, keywords, category |
| SUBMITTED | UNDER_REVIEW | at least 1 reviewer assigned |
| UNDER_REVIEW | REVISION_REQUESTED | comments provided |
| UNDER_REVIEW | ACCEPTED | all reviews recommend ACCEPT or MINOR_REVISION |
| UNDER_REVIEW | REJECTED | any review recommends REJECT |
| REVISION_REQUESTED | UNDER_REVIEW | author uploads revision |
| ACCEPTED | PUBLISHED | assigned to published issue |

---

## 7. Notifications

### Notification Types

| Event | Recipients | Trigger |
|-------|-----------|---------|
| SUBMISSION_RECEIVED | Editor | Paper submitted |
| REVIEWER_ASSIGNED | Reviewer | Editor assigns paper |
| REVIEW_COMPLETED | Author, Editor | Review submitted |
| REVISION_REQUESTED | Author | Editor requests revision |
| PAPER_ACCEPTED | Author | Paper accepted |
| PAPER_PUBLISHED | Author | Paper published |
| USER_REGISTERED | Admin | New user signs up |

### Notification Payload

```json
{
  "id": "clx123",
  "type": "PAPER_PUBLISHED",
  "title": "Your Paper is Published",
  "message": "Congratulations! Your paper has been published.",
  "link": "/research/RVJ-2026-0001",
  "read": false,
  "createdAt": "2026-01-15T00:00:00Z"
}
```

---

## 8. Email Templates

### Submission Received

```
Subject: Submission Received - [Paper ID]

Dear [Author Name],

We have received your submission "[Paper Title]".

Paper ID: RVJ-2026-0001
Status: Under Review

Our editorial team will review your paper and assign reviewers.
You will be notified when a decision has been made.

Best regards,
Research Verse Journal Editorial Team
```

### Review Completed

```
Subject: Review Completed - [Paper ID]

Dear [Author Name],

A review has been completed for your paper "[Paper Title]".

Recommendation: [ACCEPT/MINOR_REVISION/MAJOR_REVISION/REJECT]

Please log in to view the detailed review comments.

Best regards,
Research Verse Journal Editorial Team
```

### Revision Requested

```
Subject: Revision Requested - [Paper ID]

Dear [Author Name],

Reviewers have requested revisions for your paper "[Paper Title]".

Key areas to address:
- [Comment 1]
- [Comment 2]

Please log in to view the complete review comments.

Deadline: [Date]

Best regards,
Research Verse Journal Editorial Team
```

### Paper Published

```
Subject: Your Paper Has Been Published - [Paper ID]

Dear [Author Name],

Your paper "[Paper Title]" has been published!

Issue: Volume [X], Issue [Y]
Publication Date: [Date]

View your paper: [Link]

Thank you for your contribution.

Best regards,
Research Verse Journal Editorial Team
```

---

## 9. Dashboard Views

### Author Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Welcome, [Name]                                        │
├─────────────────────────────────────────────────────────┤
│  [Stats Cards]                                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │Submissions│ │Published │ │ Views   │ │Downloads│       │
│  │   5     │ │   2     │ │  1,234  │ │   567   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  [My Submissions Table]                                  │
│  ┌──────┬──────────────┬────────┬────────┐              │
│  │ID    │Title         │Status  │Date    │              │
│  ├──────┼──────────────┼────────┼────────┤              │
│  │RVJ...│Paper Title   │Published│2026-01│              │
│  └──────┴──────────────┴────────┴────────┘              │
│                                                         │
│  [Quick Actions]                                        │
│  [Submit New Paper]                                    │
└─────────────────────────────────────────────────────────┘
```

### Reviewer Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Reviewer Dashboard                                     │
├─────────────────────────────────────────────────────────┤
│  [Pending Reviews]                                      │
│  ┌──────┬──────────────┬────────┬────────┐              │
│  │ID    │Paper         │Assigned│ Due    │              │
│  ├──────┼──────────────┼────────┼────────┤              │
│  │RVJ...│Paper Title   │2 days  │[Review]│              │
│  └──────┴──────────────┴────────┴────────┘              │
│                                                         │
│  [Completed Reviews]                                    │
│  ┌──────┬──────────────┬────────┐                       │
│  │RVJ...│Paper Title   │ACCEPTED │                       │
│  └──────┴──────────────┴────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Admin Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard                                        │
├─────────────────────────────────────────────────────────┤
│  [Platform Stats]                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │Total   │ │Pending  │ │Published│ │ Users  │         │
│  │  150   │ │   25    │ │   85    │ │  320   │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  [Recent Submissions]                                   │
│  ┌──────┬──────────────┬────────┬────────┐              │
│  │ID    │Author        │Status  │Action  │              │
│  └──────┴──────────────┴────────┴────────┘              │
│                                                         │
│  [Navigation]                                          │
│  • Submissions    • Issues                              │
│  • Users          • Analytics                           │
│  • Settings                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Search & Discovery

### Trending Papers

Score formula:

```
trending_score = (views × 1) + (downloads × 3) + (citations × 5)
```

### Related Papers

Based on:
1. Matching keywords (highest weight)
2. Same category
3. Same author
4. Similar publication date

### Search Filters

| Filter | Type | Description |
|--------|------|-------------|
| Query | text | Full-text search |
| Category | select | Filter by category |
| Year | number | Publication year |
| Author | text | Author name |
| Status | select | Paper status |

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Technical specification
- [API.md](./API.md) - API documentation
- [DATABASE.md](./DATABASE.md) - Database schema