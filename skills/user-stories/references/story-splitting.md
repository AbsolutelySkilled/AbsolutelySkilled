<!-- Part of the User Stories AbsolutelySkilled skill. Load this file when
     a story is too large to fit in one sprint or an epic needs to be broken
     down into independently deliverable stories. -->

# Story Splitting Patterns

Large stories (epics, 13+ point stories) must be split before entering a sprint.
The goal is to produce stories that are independently deliverable - each one
shippable on its own, providing real value. Below are 10 patterns, ordered from
most broadly applicable to most specialized.

---

## Pattern 1: Workflow Steps

**When to use:** The story covers a multi-step user process end to end.

**How:** Identify each discrete step in the workflow and make each step a story.
Deliver steps in order so the workflow is usable (even if incomplete) after
each sprint.

**Example:**
> Original: As a job applicant, I want to apply for a job so that I can be considered.

Split into:
1. As an applicant, I want to upload my resume so that it is stored for my application.
2. As an applicant, I want to fill in my personal and contact details so that the employer can reach me.
3. As an applicant, I want to submit a cover letter so that I can explain my interest.
4. As an applicant, I want to review and submit my application so that it is sent to the employer.

---

## Pattern 2: Business Rule Variations

**When to use:** A single story handles multiple business rules or conditions
that each require distinct logic.

**How:** Implement the simplest rule first. Add each additional rule variant
as a follow-on story.

**Example:**
> Original: As a shopper, I want to apply discount codes at checkout.

Split into:
1. As a shopper, I want to apply a percentage-off discount code.
2. As a shopper, I want to apply a fixed-amount discount code.
3. As a shopper, I want to apply a free-shipping discount code.
4. As a shopper, I want to apply a buy-one-get-one discount code.

---

## Pattern 3: Happy Path First

**When to use:** Any story where error handling, edge cases, and unhappy paths
are significantly expanding scope.

**How:** Deliver the success scenario first. Create a separate story for error
states, validation failures, and edge cases.

**Example:**
> Original: As a user, I want to reset my password so that I can regain access to my account.

Split into:
1. Happy path: request reset email, click link, set new password, log in.
2. Edge cases: expired link, already-used link, invalid email address entered, password
   does not meet policy.

**Rule:** Never defer the happy path. Always defer the edge cases.

---

## Pattern 4: Data Complexity / Input Variations

**When to use:** A story must handle many types or formats of input data, and
supporting each type requires distinct work.

**How:** Start with the most common or simplest data type. Add types in follow-on
stories ordered by usage frequency.

**Example:**
> Original: As a content editor, I want to embed media in articles so that posts are richer.

Split into:
1. Embed YouTube videos by URL.
2. Embed images by URL or file upload.
3. Embed Twitter/X posts by URL.
4. Embed audio files.

---

## Pattern 5: Operations (CRUD)

**When to use:** A story covers full create/read/update/delete functionality for
a resource.

**How:** Each CRUD operation is a separate story. Deliver in dependency order:
Create first, then Read, then Update, then Delete.

**Example:**
> Original: As an admin, I want to manage team members so that I can control access.

Split into:
1. As an admin, I want to invite a new team member by email.
2. As an admin, I want to view the list of current team members and their roles.
3. As an admin, I want to change a team member's role.
4. As an admin, I want to remove a team member from the team.

---

## Pattern 6: Acceptance Criteria Separation

**When to use:** A single story has so many acceptance criteria that it clearly
covers multiple behaviors.

**How:** Group related acceptance criteria together. Each group becomes its own story.

**Example:**
> Original story has 14 acceptance criteria covering: search input behavior,
> result display, pagination, filtering, and sorting.

Split into:
1. Search and display results (input + basic result list).
2. Filter results by category and date range.
3. Sort results by relevance, date, and price.
4. Paginate through search results.

---

## Pattern 7: Defer Performance

**When to use:** A story has both a functional requirement and a non-functional
performance requirement that significantly increases complexity.

**How:** Deliver functional correctness first. Make performance optimization a
separate story with explicit SLA acceptance criteria.

**Example:**
> Original: As a user, I want product search results to appear in under 200ms
> even with 10M products in the catalog.

Split into:
1. As a user, I want to search for products by name and see matching results.
2. As the platform, we need search to respond in under 200ms at p99 for 10M products
   (spike/tech story with defined load test as acceptance criteria).

---

## Pattern 8: Spike Before Story

**When to use:** The team cannot estimate a story because there are too many
unknowns about the technical approach.

**How:** Create a time-boxed spike to resolve the unknowns. The spike output
is a decision or prototype. The real implementation story follows the spike.

**Spike template:**
```
Spike: [Question to answer]
Timebox: [hours]
Output: [Concrete deliverable - ADR, prototype, recommendation doc]
```

**Example:**
> Original: Integrate with the third-party payroll API (no estimate possible - API
> is undocumented).

Split into:
1. Spike (8h): Explore the payroll API. Output: list of available endpoints,
   auth mechanism, rate limits, and recommended integration approach.
2. Story: Implement payroll sync using the integration approach from the spike.

---

## Pattern 9: User Role Variations

**When to use:** A story involves multiple user roles that each have different
permissions, views, or behaviors for the same feature.

**How:** Implement one role's experience per story, starting with the role that
delivers the most value or unblocks other work.

**Example:**
> Original: As a user, I want to view the analytics dashboard so that I can track performance.

Split into:
1. As a content creator, I want to see views and engagement metrics on my own posts.
2. As a team manager, I want to see aggregated metrics across all team members' posts.
3. As an admin, I want to see platform-wide metrics and export reports.

---

## Pattern 10: Platform / Device Variations

**When to use:** A story must work across multiple platforms or device types with
meaningfully different implementations for each.

**How:** Implement the primary platform first. Add additional platforms as
follow-on stories.

**Example:**
> Original: As a user, I want to receive push notifications for new messages.

Split into:
1. Push notifications on web (browser notifications).
2. Push notifications on iOS.
3. Push notifications on Android.

---

## Choosing the right pattern

| Situation | Pattern to try first |
|---|---|
| Story covers a user journey with steps | Workflow Steps (#1) |
| Story has complex business logic branches | Business Rule Variations (#2) |
| Story scope keeps growing with edge cases | Happy Path First (#3) |
| Story handles many data types or formats | Data Complexity (#4) |
| Story is "manage a thing" CRUD | Operations (#5) |
| Story has too many acceptance criteria | AC Separation (#6) |
| Story has a performance requirement | Defer Performance (#7) |
| Team can't estimate due to unknowns | Spike First (#8) |
| Feature behaves differently per role | User Role Variations (#9) |
| Feature needed on multiple platforms | Platform Variations (#10) |

A story can be split using more than one pattern. Start with the pattern that
removes the most uncertainty, then re-evaluate each resulting story against
INVEST criteria.
