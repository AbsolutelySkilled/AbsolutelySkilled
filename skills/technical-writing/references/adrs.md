<!-- Part of the technical-writing AbsolutelySkilled skill. Load this file when
     working with Architecture Decision Records (ADRs). -->

# Architecture Decision Records (ADRs)

## What is an ADR?

An ADR is a short document that captures a single architectural decision along
with its context and consequences. ADRs are the "commit history" of your
architecture - they explain why the system looks the way it does.

## When to write an ADR

Write an ADR when:
- Choosing a technology (database, language, framework, cloud service)
- Deciding on an architectural pattern (microservices vs monolith, sync vs async)
- Making a trade-off that future engineers will question
- Reversing or superseding a previous decision

Do NOT write an ADR for:
- Implementation details (use code comments or design docs)
- Bug fixes or routine changes
- Decisions that are easily reversible without architectural impact

## The Nygard format (recommended)

Michael Nygard's original format is the industry standard:

```markdown
# ADR-[NNN]: [Short title in imperative mood]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-NNN]

## Context

[What is the issue that we're seeing that is motivating this decision?
Describe the forces at play: technical constraints, business requirements,
team capabilities, timeline pressure. Be factual and neutral.]

## Decision

[What is the change that we're proposing and/or doing?
State the decision clearly in 1-3 sentences. Use active voice.]

## Consequences

[What becomes easier or more difficult to do because of this change?
List positive, negative, and neutral consequences. Be honest about
trade-offs - this is the most valuable section.]
```

## The MADR format (alternative)

Markdown Any Decision Records (MADR) adds more structure:

```markdown
# [Short title]

## Context and problem statement

[Describe the context and the problem in 2-3 sentences.]

## Decision drivers

- [Driver 1: e.g., "Team has deep experience with PostgreSQL"]
- [Driver 2: e.g., "Need ACID transactions for financial data"]
- [Driver 3]

## Considered options

1. [Option A]
2. [Option B]
3. [Option C]

## Decision outcome

Chosen option: "[Option B]", because [justification].

### Positive consequences

- [Consequence 1]
- [Consequence 2]

### Negative consequences

- [Consequence 1]
- [Consequence 2]

## Pros and cons of the options

### [Option A]

- Good, because [argument]
- Bad, because [argument]

### [Option B]
...
```

## ADR numbering and filing

Store ADRs in the repository:

```
docs/
  adr/
    README.md          # Index of all ADRs with title and status
    0001-use-postgresql.md
    0002-adopt-event-sourcing.md
    0003-choose-react-for-frontend.md
```

The README.md index should be a simple table:

```markdown
# Architecture Decision Records

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Use PostgreSQL for primary datastore | Accepted | 2025-01-15 |
| 002 | Adopt event sourcing for order processing | Accepted | 2025-02-01 |
| 003 | Choose React for the frontend | Superseded by 007 | 2025-02-10 |
```

## ADR lifecycle rules

1. **Immutability** - Once an ADR is accepted, never edit its content. If
   circumstances change, write a new ADR that supersedes the old one.

2. **Status transitions** - An ADR moves through: Proposed -> Accepted ->
   (optionally) Deprecated or Superseded.

3. **Superseding** - When writing a new ADR that reverses a previous decision,
   update the old ADR's status to "Superseded by ADR-NNN" and reference the
   old ADR in the new one's context section.

4. **Timing** - Write the ADR during the decision process, not after
   implementation. The context and rejected alternatives are freshest at
   decision time.

## Writing tips for ADRs

- **Context section:** Be specific about constraints. "We have 3 weeks" is
  better than "tight timeline." Include data when available.
- **Decision section:** State the decision in one clear sentence before
  elaborating. The reader should understand the choice in 5 seconds.
- **Consequences section:** Be honest about negatives. An ADR that lists only
  positives is not trustworthy. The negative consequences are what future
  engineers need most.
- **Keep it short:** An ADR should be 1-2 pages. If it's longer, the decision
  is probably too broad - split it into multiple ADRs.

## Tools for ADR management

- **adr-tools** (CLI) - `adr new "Use PostgreSQL"` creates a numbered file from template
- **Log4brains** - Generates a searchable ADR website from Markdown files
- **ADR Manager** (VS Code extension) - Create and browse ADRs from the editor
