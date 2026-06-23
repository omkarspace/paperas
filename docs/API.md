# API Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Papers](#3-papers)
4. [Reviews](#4-reviews)
5. [Admin](#5-admin)
6. [Search](#6-search)
7. [Notifications](#7-notifications)
8. [Issues](#8-issues)
9. [Categories](#9-categories)
10. [Errors](#10-errors)

---

## 1. Overview

### Base URL

```
http://localhost:3000/api
```

### Request Format

- Content-Type: `application/json`
- Authorization: `Bearer <token>` (when required)

### Response Format

```json
{
  "data": { },
  "message": "Success"
}
```

### Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 2. Authentication

### Register User

```
POST /api/auth/register
```

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "institution": "University of Example"
}
```

**Response (201):**

```json
{
  "id": "clx1234567890",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "AUTHOR"
}
```

**Validation:**
- Email: valid email format, unique
- Password: minimum 8 characters
- Name: 1-100 characters

---

### Login

```
POST /api/auth/login
```

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "clx1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "AUTHOR"
  },
  "token": "jwt-token..."
}
```

---

### Get Session

```
GET /api/auth/session
```

**Response (200):**

```json
{
  "user": {
    "id": "clx1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "AUTHOR"
  }
}
```

---

### Logout

```
POST /api/auth/logout
```

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 3. Papers

### List Papers (Public)

```
GET /api/papers
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| status | string | PUBLISHED | Filter by status |
| category | string | - | Category ID |
| author | string | - | Author ID |
| year | number | - | Publication year |
| q | string | - | Search query |

**Response (200):**

```json
{
  "papers": [
    {
      "id": "clx1234567890",
      "paperId": "RVJ-2026-0001",
      "title": "Sample Research Paper",
      "abstract": "This is a sample abstract...",
      "keywords": ["machine learning", "AI"],
      "status": "PUBLISHED",
      "publicationDate": "2026-01-15T00:00:00Z",
      "author": {
        "id": "clx1234567890",
        "name": "John Doe",
        "institution": "University"
      },
      "category": {
        "id": "clx0987654321",
        "name": "Technology"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Get Paper Details

```
GET /api/papers/[id]
```

**Response (200):**

```json
{
  "id": "clx1234567890",
  "paperId": "RVJ-2026-0001",
  "title": "Sample Research Paper",
  "abstract": "This is a sample abstract...",
  "keywords": ["machine learning", "AI"],
  "pdfUrl": "https://s3.amazonaws.com/bucket/papers/uuid/file.pdf",
  "status": "PUBLISHED",
  "submissionDate": "2025-12-01T00:00:00Z",
  "publicationDate": "2026-01-15T00:00:00Z",
  "volume": 1,
  "issue": 1,
  "author": {
    "id": "clx1234567890",
    "name": "John Doe",
    "institution": "University",
    "orcid": "0000-0000-0000-0000"
  },
  "category": {
    "id": "clx0987654321",
    "name": "Technology"
  }
}
```

---

### Create Paper (Author)

```
POST /api/papers
```

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "title": "Sample Research Paper",
  "abstract": "This is a sample abstract...",
  "keywords": ["machine learning", "AI"],
  "categoryId": "clx0987654321"
}
```

**Response (201):**

```json
{
  "id": "clx1234567890",
  "paperId": "RVJ-2026-0001",
  "title": "Sample Research Paper",
  "status": "DRAFT"
}
```

---

### Update Paper

```
PATCH /api/papers/[id]
```

**Headers:** `Authorization: Bearer <token>`

**Request:**

```json
{
  "title": "Updated Title",
  "abstract": "Updated abstract...",
  "keywords": ["updated", "keywords"]
}
```

**Response (200):**

```json
{
  "id": "clx1234567890",
  "title": "Updated Title",
  "status": "DRAFT"
}
```

---

### Submit Paper for Review

```
POST /api/papers/[id]/submit
```

**Headers:** `Authorization: Bearer <token>`

**Requirements:**
- Paper must be in DRAFT status
- Title, abstract, keywords required
- PDF must be uploaded

**Response (200):**

```json
{
  "id": "clx1234567890",
  "status": "SUBMITTED",
  "submissionDate": "2026-01-15T00:00:00Z"
}
```

---

### Upload PDF

```
POST /api/papers/[id]/upload
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: PDF file (max 50MB)

**Response (200):**

```json
{
  "pdfUrl": "https://s3.amazonaws.com/bucket/papers/uuid/file.pdf"
}
```

---

### Delete Paper

```
DELETE /api/papers/[id]
```

**Headers:** `Authorization: Bearer <token>`

**Requirements:**
- Paper must be in DRAFT or REJECTED status
- Only author or admin can delete

**Response (204):** No content

---

### Get Citations

```
GET /api/papers/[id]/cite
```

**Query Parameters:**

| Parameter | Type | Default |
|-----------|------|---------|
| format | string | apa |

**Formats:** `apa`, `mla`, `ieee`, `chicago`, `harvard`

**Response (200):**

```json
{
  "apa": "Doe, J. (2026). Sample Research Paper. Paperas, 1(1), 1-15.",
  "mla": "Doe, John. \"Sample Research Paper.\" Paperas, vol. 1, no. 1, 2026, pp. 1-15.",
  "ieee": "J. Doe, \"Sample Research Paper,\" Paperas, vol. 1, no. 1, pp. 1-15, Jan. 2026.",
  "chicago": "Doe, John. \"Sample Research Paper.\" Paperas 1, no. 1 (2026): 1-15.",
  "harvard": "Doe, J., 2026. Sample Research Paper. Paperas, 1(1), pp.1-15."
}
```

---

## 4. Reviews

### List Assigned Reviews

```
GET /api/reviews
```

**Headers:** `Authorization: Bearer <token>` (Reviewer role)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | pending/completed |

**Response (200):**

```json
{
  "reviews": [
    {
      "id": "clx1234567890",
      "paper": {
        "id": "clx0987654321",
        "paperId": "RVJ-2026-0001",
        "title": "Sample Paper"
      },
      "status": "PENDING",
      "assignedAt": "2026-01-10T00:00:00Z"
    }
  ]
}
```

---

### Submit Review

```
POST /api/reviews
```

**Headers:** `Authorization: Bearer <token>` (Reviewer role)

**Request:**

```json
{
  "paperId": "clx0987654321",
  "comments": "This is a comprehensive review...",
  "recommendation": "ACCEPT",
  "rating": 4,
  "originalityRating": 4,
  "qualityRating": 5
}
```

**Recommendations:** ACCEPT, MINOR_REVISION, MAJOR_REVISION, REJECT

**Response (201):**

```json
{
  "id": "clx1234567890",
  "status": "COMPLETED",
  "recommendation": "ACCEPT"
}
```

---

### Update Review

```
PATCH /api/reviews/[id]
```

**Headers:** `Authorization: Bearer <token>` (Reviewer role)

**Request:**

```json
{
  "comments": "Updated review comments...",
  "recommendation": "MINOR_REVISION"
}
```

**Note:** Can only update before final submission.

---

### Assign Reviewer

```
POST /api/reviews/[id]/assign
```

**Headers:** `Authorization: Bearer <token>` (Admin/Editor role)

**Request:**

```json
{
  "reviewerId": "clx0987654321"
}
```

**Response (200):**

```json
{
  "id": "clx1234567890",
  "reviewerId": "clx0987654321",
  "status": "ASSIGNED"
}
```

---

## 5. Admin

### Get All Submissions

```
GET /api/admin/submissions
```

**Headers:** `Authorization: Bearer <token>` (Editor/Admin)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| page | number | Page number |
| limit | number | Items per page |

**Response (200):**

```json
{
  "submissions": [
    {
      "id": "clx1234567890",
      "paperId": "RVJ-2026-0001",
      "title": "Sample Paper",
      "status": "SUBMITTED",
      "author": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "submissionDate": "2026-01-15T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### Update Submission Status

```
PATCH /api/admin/submissions/[id]
```

**Headers:** `Authorization: Bearer <token>` (Editor/Admin)

**Request:**

```json
{
  "status": "UNDER_REVIEW",
  "reviewerIds": ["clx111", "clx222"],
  "comments": "Reviewers assigned"
}
```

**Status Transitions:**

| From | To | Conditions |
|------|-----|------------|
| SUBMITTED | UNDER_REVIEW | Reviewers assigned |
| UNDER_REVIEW | REVISION_REQUESTED | Comments provided |
| UNDER_REVIEW | ACCEPTED | All reviews recommend accept |
| UNDER_REVIEW | REJECTED | Any review recommends reject |
| REVISION_REQUESTED | UNDER_REVIEW | Author resubmits |
| ACCEPTED | PUBLISHED | Issue assigned |

---

### User Management

#### List Users

```
GET /api/admin/users
```

**Headers:** `Authorization: Bearer <token>` (Admin)

**Response:**

```json
{
  "users": [
    {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "AUTHOR",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Update User Role

```
PATCH /api/admin/users/[id]
```

**Headers:** `Authorization: Bearer <token>` (Admin)

**Request:**

```json
{
  "role": "REVIEWER"
}
```

**Response (200):**

```json
{
  "id": "clx1234567890",
  "role": "REVIEWER"
}
```

---

### Journal Issues

#### Create Issue

```
POST /api/admin/issues
```

**Headers:** `Authorization: Bearer <token>` (Admin)

**Request:**

```json
{
  "volume": 1,
  "issue": 2,
  "publicationDate": "2026-02-01T00:00:00Z"
}
```

#### Assign Papers to Issue

```
POST /api/admin/issues/[id]/assign
```

**Request:**

```json
{
  "paperIds": ["clx111", "clx222", "clx333"]
}
```

#### Publish Issue

```
PATCH /api/admin/issues/[id]
```

**Request:**

```json
{
  "isPublished": true
}
```

---

### Platform Analytics

```
GET /api/admin/analytics
```

**Headers:** `Authorization: Bearer <token>` (Editor/Admin)

**Response (200):**

```json
{
  "totalPapers": 150,
  "publishedPapers": 85,
  "totalUsers": 320,
  "totalAuthors": 280,
  "totalReviewers": 30,
  "totalDownloads": 15000,
  "totalViews": 50000,
  "submissionsThisMonth": 15,
  "acceptanceRate": 65,
  "averageReviewTime": "14 days",
  "viewsByMonth": [
    { "month": "2026-01", "views": 5000 },
    { "month": "2026-02", "views": 6200 }
  ]
}
```

---

## 6. Search

### Basic Search

```
GET /api/search?q=machine+learning
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |
| category | string | Category ID |
| author | string | Author ID |
| year | number | Publication year |
| page | number | Page number |

**Response (200):**

```json
{
  "results": [
    {
      "id": "clx1234567890",
      "paperId": "RVJ-2026-0001",
      "title": "Machine Learning Applications",
      "abstract": "This paper explores...",
      "score": 0.95
    }
  ],
  "total": 25,
  "page": 1,
  "took": 5
}
```

---

## 7. Notifications

### List Notifications

```
GET /api/notifications
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "notifications": [
    {
      "id": "clx1234567890",
      "type": "PAPER_PUBLISHED",
      "title": "Your Paper is Published",
      "message": "Congratulations! Your paper has been published.",
      "link": "/research/RVJ-2026-0001",
      "read": false,
      "createdAt": "2026-01-15T00:00:00Z"
    }
  ]
}
```

### Mark as Read

```
PATCH /api/notifications/[id]
```

**Response (200):**

```json
{
  "id": "clx1234567890",
  "read": true
}
```

---

## 8. Issues (Public)

### List Published Issues

```
GET /api/issues
```

**Response (200):**

```json
{
  "issues": [
    {
      "id": "clx1234567890",
      "volume": 1,
      "issue": 1,
      "publicationDate": "2026-01-15T00:00:00Z",
      "paperCount": 10
    }
  ]
}
```

---

### Get Issue Papers

```
GET /api/issues/[volume]/[issue]
```

**Response (200):**

```json
{
  "volume": 1,
  "issue": 1,
  "publicationDate": "2026-01-15T00:00:00Z",
  "papers": [...]
}
```

---

## 9. Categories

### List Categories

```
GET /api/categories
```

**Response (200):**

```json
{
  "categories": [
    { "id": "clx1234567890", "name": "Technology" },
    { "id": "clx0987654321", "name": "Science" }
  ]
}
```

---

## 10. Errors

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

### Error Examples

**400 Bad Request:**

```json
{
  "error": "Invalid request body",
  "code": "INVALID_REQUEST"
}
```

**401 Unauthorized:**

```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**403 Forbidden:**

```json
{
  "error": "You don't have permission",
  "code": "FORBIDDEN"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

**422 Validation Error:**

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**429 Rate Limited:**

```json
{
  "error": "Too many requests",
  "code": "RATE_LIMITED",
  "retryAfter": 60
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth | 5/minute |
| Paper Submission | 10/minute |
| Search | 60/minute |
| General API | 100/minute |

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Technical specification
- [DATABASE.md](./DATABASE.md) - Database schema
- [WORKFLOW.md](./WORKFLOW.md) - User workflows