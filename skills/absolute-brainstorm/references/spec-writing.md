<!-- Part of the Absolute Brainstorm AbsolutelySkilled skill. Load this file when writing or reviewing design spec documents. -->

# Spec Writing

Complete reference for producing design spec documents during the absolute-brainstorm workflow. Covers the document template, section scaling rules, writing style, decision logging, and the reviewer checklist.

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

## Scored Spec Review Protocol

After writing the spec, a separate reviewer subagent grades it against scored criteria. This uses generator-evaluator separation - the agent that wrote the spec does NOT review it.

### Scoring Rubric

| Criterion | Weight | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|-----------|--------|----------|-----------------|----------------|
| **Completeness** | 25% | TODOs, placeholders, missing sections | Required sections present but thin | Every section substantive for its tier |
| **Consistency** | 20% | Names/types contradict across sections | Mostly consistent, minor mismatches | All names, types, paths match perfectly |
| **Clarity** | 20% | Ambiguous, requires author to interpret | Clear to someone with project context | Unfamiliar developer can build from this |
| **Scope** | 15% | Scope creep or missing agreed features | Covers discussed topics | Exactly what was discussed, no more/less |
| **Testability** | 20% | Vague "test the happy path" | Test cases listed but generic | Specific, actionable test cases with inputs/outputs |

### Score Thresholds

| Weighted Score | Verdict | Action |
|----------------|---------|--------|
| **4.0 - 5.0** | Approved | Proceed to user review |
| **3.0 - 3.9** | Needs Work | Fix issues, re-dispatch reviewer (max 3 iterations) |
| **Below 3.0** | Major Gaps | Surface to user immediately, do not iterate |

### Reviewer Prompt Template

```
You are an independent spec reviewer. Grade this spec skeptically.
Do not give benefit of the doubt on vague sections.

Spec complexity tier: [SIMPLE | MEDIUM | COMPLEX]

--- BEGIN SPEC ---
{spec_content}
--- END SPEC ---

--- BEGIN INTERVIEW CONTEXT ---
{interview_summary}
--- END INTERVIEW CONTEXT ---

Score each criterion 1-5 using the rubric. Output format (STRICT):

## Spec Review
- **Completeness**: {score}/5 - {justification}
- **Consistency**: {score}/5 - {justification}
- **Clarity**: {score}/5 - {justification}
- **Scope**: {score}/5 - {justification}
- **Testability**: {score}/5 - {justification}
- **Weighted Score**: {calculated}/5.0
- **Verdict**: Approved | Needs Work | Major Gaps

## Specific Issues (required if score < 4.0)
For each criterion below 4:
- [Section]: what is wrong and how to fix it

## What Was Done Well
- {1-2 strengths}
```

---

## Example Spec (Abbreviated)

A medium-complexity commenting system spec, condensed to show structure:

```markdown
# Commenting System Design Spec

## Summary
Add threaded comments (one level deep) to blog posts for logged-in users.

## Context
Blog at `src/app/blog/` uses Prisma + PostgreSQL. No commenting today.

## Design

### Architecture
New API routes at `/api/posts/:postId/comments`, new `comments` table,
React components in `src/components/comments/`.

### Components
| Component | Responsibility | File Path |
|---|---|---|
| CommentThread | Renders comments + replies | `src/components/comments/CommentThread.tsx` |
| CommentForm | Input form | `src/components/comments/CommentForm.tsx` |
| comments API | CRUD endpoints | `src/app/api/posts/[postId]/comments/route.ts` |

### Data Model
Comment model with: id, body, postId, authorId, parentId (nullable for threading),
createdAt, updatedAt. Indexes on [postId, createdAt] and [parentId].

### Interfaces / API Surface
- POST `/api/posts/:postId/comments` - Create (201, 401, 422)
- GET `/api/posts/:postId/comments?cursor=<id>&limit=20` - List with pagination
- DELETE `/api/posts/:postId/comments/:commentId` - Delete (204, 403)

## Error Handling
Auth failures redirect to login. Validation errors return 422 with error codes.
Nesting violations return `nesting_too_deep`. Rate limiting returns 429.

## Testing Strategy
11 tests: 8 integration (CRUD + auth + pagination + nesting), 2 unit (render +
form submit), 1 E2E (full comment flow).

## Decision Log
| Decision | Chosen | Rationale |
|---|---|---|
| Nesting depth | 2-level | Avoids recursive queries, covers 90% of use cases |
| Pagination | Cursor-based | Reliable with concurrent inserts |
| Real-time | Polling (30s) | Simplest, sufficient for blog velocity |
| Deletion | Hard delete + cascade | No audit needed, GDPR-friendly |
```
