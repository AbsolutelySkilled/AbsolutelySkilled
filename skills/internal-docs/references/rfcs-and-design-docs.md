<!-- Part of the internal-docs AbsolutelySkilled skill. Load this file when
     working with RFCs, design documents, or architecture decision records. -->

# RFCs and Design Docs

## RFC vs Design Doc vs ADR

These terms are often used interchangeably but serve different purposes:

| Document | Scope | Lifespan | Decision weight |
|---|---|---|---|
| RFC (Request for Comments) | Cross-team or org-wide changes | Weeks of review | High - needs broad consensus |
| Design doc | Single team or feature | Days to a week of review | Medium - team lead approval |
| ADR (Architecture Decision Record) | One specific decision | Written once, never edited | Low - records what was decided |

**Rule of thumb:** If the change affects more than one team's codebase or introduces
a new technology, it's an RFC. If it's a complex feature within one team, it's a
design doc. If it's a focused architectural choice, it's an ADR.

## RFC lifecycle

```
Draft -> In Review -> Approved / Rejected / Withdrawn
                  \-> Needs Revision -> In Review (loop)
```

### Draft phase

- Author writes the initial proposal using the RFC template
- Share early with 1-2 trusted reviewers for a "pre-review" before formal circulation
- Include a decision deadline (typically 1-2 weeks from circulation)

### Review phase

- Circulate to all stakeholders via the team's standard channel (email, Slack, doc comments)
- Reviewers leave inline comments on specific sections
- Author responds to every comment - either incorporate feedback or explain why not
- Schedule a synchronous review meeting only if async comments reveal fundamental disagreements

### Decision phase

- The designated decision-maker (tech lead, architect, or committee) makes the call
- Document the decision and reasoning at the top of the RFC
- If rejected, explain why clearly - rejected RFCs are valuable institutional knowledge

## Writing effective motivation sections

The motivation section is the most important part of an RFC. It must answer three questions:

1. **What problem exists today?** Describe the pain concretely with data if possible.
   "API latency p99 has increased from 200ms to 800ms over the last quarter due to
   N+1 queries in the order service" is better than "performance is degrading."

2. **Why does it matter?** Connect the problem to business or engineering outcomes.
   "This latency increase has caused a 12% drop in checkout completion rate."

3. **Why now?** Explain the urgency. Is there a deadline, a scaling cliff, or a
   dependency that makes this the right time?

## Alternatives section best practices

The alternatives section proves you've done your homework. For each alternative:

- **Name it clearly** - "Alternative A: Migrate to GraphQL" not "Another option"
- **Give it a fair shot** - Describe it as if you were proposing it
- **List honest pros and cons** - If an alternative has no pros, you haven't thought hard enough
- **Explain why you didn't choose it** - Be specific about the deciding factor

Minimum: 2 alternatives. If you can only think of one alternative ("do nothing"),
you haven't explored the solution space enough.

## Design doc specifics

Design docs are lighter than RFCs. Key differences:

- **Shorter review cycle** - 2-5 days instead of 1-2 weeks
- **Narrower audience** - Team members and direct stakeholders
- **More implementation detail** - Include API schemas, data models, sequence diagrams
- **Less process** - No formal approval committee, team lead signs off

### Design doc template additions (beyond RFC template)

```markdown
## API design
<Endpoint definitions, request/response schemas>

## Data model
<Schema changes, new tables/collections, migration plan>

## Sequence diagram
<Key flows showing component interactions>

## Testing strategy
<How will this be tested? Unit, integration, E2E coverage plan>

## Observability
<What metrics, logs, and alerts will be added?>
```

## Review etiquette

### For reviewers

- **Be specific** - "This doesn't handle the case where X" is useful. "I don't like this" is not.
- **Distinguish blocking vs non-blocking** - Prefix with "Blocking:" or "Nit:" or "Question:"
- **Suggest, don't prescribe** - "Have you considered X?" not "You should do X"
- **Focus on the proposal, not the person** - "This approach has a scalability risk" not "You didn't think about scale"
- **Respond within the deadline** - No response is implicit approval in most RFC processes

### For authors

- **Respond to every comment** - Even if just "Acknowledged, updated section 3"
- **Don't be defensive** - Reviewers are improving the proposal, not attacking you
- **Update the doc, not just the comment thread** - The doc is the source of truth
- **Call out material changes** - If review feedback significantly changes the proposal, re-notify reviewers

## Common RFC anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| The Novel | 20+ page RFC that nobody reads | Keep to 3-5 pages. Move detail to appendices |
| The Fait Accompli | RFC written after implementation started | Write the RFC first. If urgent, be transparent that implementation is underway |
| The Straw Man | Alternatives listed are obviously terrible to make the proposal look good | Include genuinely competitive alternatives |
| The Infinite Review | RFC stays "In Review" for months | Set a hard deadline. No decision by deadline = author's proposal wins |
| The Ghost RFC | Approved but never referenced again | Link to RFC from implementation PRs and ADRs |
| Missing constraints | No mention of timeline, budget, team capacity | Include a "Constraints" section covering real-world limits |
