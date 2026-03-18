<!-- Part of the Super Brainstorm AbsolutelySkilled skill. Load this file when writing or reviewing design spec documents. -->

# Spec Writing

Complete reference for producing design spec documents during the super-brainstorm workflow. Covers the document template, section scaling rules, writing style, decision logging, and the reviewer checklist.

---

## Spec Document Template

Every spec is written to `docs/plans/YYYY-MM-DD-<topic>-design.md` where `<topic>` is a short kebab-case slug (e.g. `2026-03-18-commenting-system-design.md`).

```markdown
# [Topic] Design Spec

## Summary
<!-- 2-3 sentences. What is being built and why. -->

## Context
<!-- What exists today. Why this change is needed. Link to relevant code paths. -->

## Design

### Architecture
<!-- High-level diagram or description of how the pieces fit together. -->

### Components
<!-- Each new or modified component, with its responsibility. -->

### Data Model
<!-- Schemas, tables, types. Use code blocks for definitions. -->

### Interfaces / API Surface
<!-- Endpoints, function signatures, event contracts. Use code blocks. -->

### Data Flow
<!-- Step-by-step description of how data moves through the system for key operations. -->

## Error Handling
<!-- Failure modes, retry strategies, user-facing error states. -->

## Testing Strategy
<!-- What to test, how, and what level (unit, integration, e2e). -->

## Migration Path
<!-- Steps to move from current state to new state. Remove this section if not applicable. -->

## Open Questions
<!-- Unresolved items that need follow-up. Remove this section if none remain. -->

## Decision Log
<!-- Key decisions made during the interview phase. See Decision Log Format below. -->
```

---

## Section Scaling Rules

Not every spec needs every section at full depth. Scale based on complexity.

### Simple (config change, utility function, small fix)

**Target length**: ~1 page

| Section | Include? | Depth |
|---|---|---|
| Summary | Yes | 2-3 sentences |
| Context | Yes | 1-2 sentences |
| Architecture | No | - |
| Components | Yes | Bullet list of what changes |
| Data Model | Only if changed | Schema diff |
| Interfaces / API Surface | Only if changed | Signature only |
| Data Flow | No | - |
| Error Handling | One sentence if relevant | - |
| Testing Strategy | Yes | Which tests to add/update |
| Migration Path | No | - |
| Open Questions | No | - |
| Decision Log | No | - |

### Medium (new component, API endpoint, moderate feature)

**Target length**: 2-3 pages

| Section | Include? | Depth |
|---|---|---|
| Summary | Yes | 2-3 sentences |
| Context | Yes | 1 paragraph |
| Architecture | Yes | Brief description, no diagram needed |
| Components | Yes | Table with name, responsibility, file path |
| Data Model | Yes | Full schema in code block |
| Interfaces / API Surface | Yes | Full signatures with request/response shapes |
| Data Flow | Yes | Numbered steps for the primary flow |
| Error Handling | Yes | Table of failure modes and responses |
| Testing Strategy | Yes | Specific test cases listed |
| Migration Path | If applicable | Steps only |
| Open Questions | If any remain | Bullet list |
| Decision Log | Yes | Key choices made |

### Complex (new system, migration, cross-cutting change)

**Target length**: 4-6 pages

| Section | Include? | Depth |
|---|---|---|
| Summary | Yes | 2-3 sentences |
| Context | Yes | Multiple paragraphs, link existing code |
| Architecture | Yes | Diagram (ASCII or described), component relationships |
| Components | Yes | Table with name, responsibility, file path, dependencies |
| Data Model | Yes | Full schemas, relationships, indexes |
| Interfaces / API Surface | Yes | All endpoints/functions, full request/response types |
| Data Flow | Yes | Numbered steps for primary + secondary flows |
| Error Handling | Yes | Comprehensive table, retry logic, circuit breakers |
| Testing Strategy | Yes | Test matrix by type, coverage targets |
| Migration Path | Yes | Phased plan with rollback steps |
| Open Questions | If any remain | Bullet list with owners and deadlines |
| Decision Log | Yes | All significant choices |

### Complexity Detection Heuristic

| Signal | Simple | Medium | Complex |
|---|---|---|---|
| Files touched | 1-2 | 3-8 | 8+ |
| New components | 0 | 1-2 | 3+ |
| External dependencies | 0 | 0-1 | 2+ |
| Data model changes | None or trivial | New table/type | Schema migration |
| Cross-cutting concerns | No | Maybe | Yes |

---

## Writing Style Guide

### Be concrete, not abstract

| Bad | Good |
|---|---|
| "An endpoint for comments" | `POST /api/posts/:postId/comments` |
| "A component that shows comments" | `src/components/CommentThread.tsx` |
| "Some kind of database table" | `comments` table with columns `id`, `post_id`, `author_id`, `body`, `created_at` |
| "We'll need to handle errors" | Return `422` with `{ error: "body_required" }` when comment body is empty |

### Include file paths when referencing code

Always use paths relative to the repo root:

```
The auth middleware at `src/middleware/auth.ts` validates the JWT
before the request reaches `src/api/comments/create.ts`.
```

### Use tables for comparisons

When evaluating options, always present them in a table rather than prose:

| Option | Pros | Cons |
|---|---|---|
| PostgreSQL | ACID, familiar, existing infra | Needs schema migration |
| MongoDB | Flexible schema, easy nesting | New dependency, no existing infra |

### Use code blocks for interfaces, schemas, and API shapes

```typescript
interface CreateCommentRequest {
  postId: string;
  body: string;
  parentId?: string; // for threaded replies
}

interface CreateCommentResponse {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
}
```

### YAGNI

Remove anything not directly needed for the work being designed:

- Do not spec future phases unless they constrain the current design
- Do not add "nice to have" sections
- Do not include sections that only say "N/A" - remove them entirely
- If a section has one sentence, consider folding it into another section

---

## Decision Log Format

Every spec includes a Decision Log at the bottom. Record decisions made during the brainstorm interview that shaped the design.

### Format

| Decision | Options Considered | Chosen | Rationale |
|---|---|---|---|
| Database for comments | PostgreSQL, MongoDB, SQLite | PostgreSQL | Already in the stack, supports full-text search, ACID transactions needed for comment threading |
| Comment nesting depth | Unlimited, flat, 2-level | 2-level | Keeps UI simple, covers reply-to-reply which is 90% of use cases, avoids recursive query complexity |
| Auth for commenting | Anonymous, logged-in only, mixed | Logged-in only | Reduces spam, simplifies moderation, matches existing auth system |

### Guidelines

- Record every decision where more than one reasonable option existed
- The "Rationale" column is the most important - it explains why the choice was made and prevents future re-litigation
- Include decisions the user made explicitly (e.g. "user chose PostgreSQL") and decisions you recommended (e.g. "recommended 2-level nesting because...")
- Keep each cell concise - one to two sentences maximum

---

## Spec Review Checklist

After writing the spec, a reviewer subagent checks it against these criteria before delivering the final document.

### Criteria

| Criterion | What to Check |
|---|---|
| **Completeness** | Every section required by the scaling tier is present and substantive. No placeholders or TODOs remain. |
| **Consistency** | Names, types, and paths used in one section match their usage in all other sections. API shapes in Interfaces match the Data Model. |
| **Clarity** | A developer unfamiliar with the project can read the spec and understand what to build. No ambiguous pronouns ("it", "this") without clear antecedents. |
| **Scope** | The spec covers exactly what was discussed during the interview - no more, no less. No scope creep into adjacent systems. |
| **YAGNI** | No speculative features, future phases (unless they constrain current design), or unnecessary sections. |
| **Concrete** | All endpoints have method + path. All schemas have field names + types. All file references use repo-relative paths. |
| **Testable** | The Testing Strategy section contains specific, actionable test cases - not vague statements like "test the happy path". |

### Reviewer Prompt Template

The following prompt is used by the reviewer subagent:

```
You are a design spec reviewer. Read the spec below and evaluate it against
these criteria: Completeness, Consistency, Clarity, Scope, YAGNI, Concrete,
and Testable.

For each criterion, output one of:
  PASS - meets the bar
  NEEDS WORK - explain what is missing or wrong

If any criterion is NEEDS WORK, write a corrected version of the affected
section(s) at the end of your review.

Spec complexity tier: [SIMPLE | MEDIUM | COMPLEX]

--- BEGIN SPEC ---
{spec_content}
--- END SPEC ---

--- BEGIN INTERVIEW CONTEXT ---
{interview_summary}
--- END INTERVIEW CONTEXT ---
```

---

## Example Spec

A complete example for a medium-complexity feature.

```markdown
# Commenting System Design Spec

## Summary

Add a commenting system to blog posts that supports threaded replies (one
level deep), real-time updates, and moderation. Comments are only available
to logged-in users.

## Context

The blog at `src/app/blog/` currently supports posts with markdown content
rendered via `src/lib/markdown.ts`. Posts are stored in the `posts` table
in PostgreSQL via Prisma (`prisma/schema.prisma`). There is no commenting
functionality today. Users have requested the ability to discuss posts, and
engagement metrics show readers spend an average of 4 minutes per post,
suggesting they would interact with comments.

## Design

### Architecture

The commenting system adds a new API route group under `/api/posts/:postId/comments`,
a new `comments` table in PostgreSQL, and a React component tree mounted in the
existing post page at `src/app/blog/[slug]/page.tsx`.

### Components

| Component | Responsibility | File Path |
|---|---|---|
| CommentThread | Renders top-level comments and their replies | `src/components/comments/CommentThread.tsx` |
| CommentForm | Input form for new comments and replies | `src/components/comments/CommentForm.tsx` |
| CommentItem | Single comment with author, timestamp, reply button | `src/components/comments/CommentItem.tsx` |
| comments API | CRUD endpoints for comments | `src/app/api/posts/[postId]/comments/route.ts` |
| Comment model | Prisma model and validation | `prisma/schema.prisma` |

### Data Model

```prisma
model Comment {
  id        String   @id @default(cuid())
  body      String   @db.Text
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([postId, createdAt])
  @@index([parentId])
}
```

### Interfaces / API Surface

**Create comment**

POST `/api/posts/:postId/comments`

```typescript
// Request
{ body: string; parentId?: string }

// Response 201
{ id: string; body: string; authorId: string; parentId: string | null; createdAt: string }

// Error 422
{ error: "body_required" | "parent_not_found" | "nesting_too_deep" }

// Error 401
{ error: "unauthorized" }
```

**List comments**

GET `/api/posts/:postId/comments?cursor=<id>&limit=20`

```typescript
// Response 200
{
  comments: Array<{
    id: string;
    body: string;
    author: { id: string; name: string; avatarUrl: string };
    parentId: string | null;
    replies: Array<{ /* same shape without nested replies */ }>;
    createdAt: string;
  }>;
  nextCursor: string | null;
}
```

**Delete comment** (author or admin only)

DELETE `/api/posts/:postId/comments/:commentId`

```typescript
// Response 204 (no body)

// Error 403
{ error: "forbidden" }
```

### Data Flow

**Creating a comment (primary flow)**:
1. User types in `CommentForm` and submits
2. Client sends `POST /api/posts/:postId/comments` with auth cookie
3. API validates auth via `src/middleware/auth.ts`
4. API validates request body (non-empty, parentId exists if provided, parent is not itself a reply)
5. API inserts row into `comments` table via Prisma
6. API returns the created comment
7. Client prepends the comment to `CommentThread` state

## Error Handling

| Failure | Behavior |
|---|---|
| User not authenticated | Redirect to login, preserve draft in localStorage |
| Comment body empty | Client-side validation prevents submission; server returns 422 |
| Parent comment not found | Server returns 422 with `parent_not_found` |
| Nesting too deep (reply to a reply) | Server returns 422 with `nesting_too_deep` |
| Post not found | Server returns 404 |
| Rate limit exceeded | Server returns 429, client shows "Please wait before commenting again" |

## Testing Strategy

| Test | Type | What It Verifies |
|---|---|---|
| Create comment with valid body | Integration | 201 response, comment appears in DB |
| Create comment without auth | Integration | 401 response |
| Create comment with empty body | Integration | 422 response |
| Reply to existing comment | Integration | 201, parentId set correctly |
| Reply to a reply (nesting too deep) | Integration | 422 with `nesting_too_deep` |
| List comments with pagination | Integration | Cursor-based pagination returns correct pages |
| Delete own comment | Integration | 204, comment removed from DB |
| Delete another user's comment | Integration | 403 response |
| CommentThread renders comments | Unit | Renders list of CommentItem components |
| CommentForm submits on enter | Unit | Calls onSubmit with body text |
| Full comment flow | E2E | Login, navigate to post, create comment, see it appear, reply, delete |

## Decision Log

| Decision | Options Considered | Chosen | Rationale |
|---|---|---|---|
| Nesting depth | Unlimited, flat, 2-level | 2-level (comment + reply) | Keeps UI manageable, avoids recursive queries, covers the majority of discussion patterns |
| Pagination | Offset, cursor | Cursor-based | More reliable with concurrent inserts, better performance on large comment threads |
| Real-time updates | WebSocket, polling, SSE | Polling (30s interval) | Simplest to implement, sufficient for blog comment velocity, no infra changes needed |
| Soft delete vs hard delete | Soft delete, hard delete | Hard delete with cascading replies | Blog context does not require audit trail, simpler data model, GDPR-friendly |
| Comment editing | Allow edits, no edits | No edits in v1 | Reduces complexity, avoids edit history UI, can add later without migration |
```
