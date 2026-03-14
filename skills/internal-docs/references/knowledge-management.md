<!-- Part of the internal-docs AbsolutelySkilled skill. Load this file when
     working with knowledge bases, documentation culture, or team wikis. -->

# Knowledge Management

## The documentation quadrant

Adapt the Divio documentation framework to organize internal knowledge into four
distinct categories, each with its own purpose, style, and audience:

| Category | Orientation | Written like | Example |
|---|---|---|---|
| **Tutorials** | Learning | A lesson (do this, then this) | "Your first week: setting up local dev" |
| **How-to guides** | Task | A recipe (to accomplish X, do Y) | "How to deploy a canary release" |
| **Reference** | Information | An encyclopedia (X is defined as...) | "Service catalog with owners and SLAs" |
| **Explanation** | Understanding | An essay (the reason we chose X is...) | "Why we migrated from monolith to microservices" |

### Why this matters

The most common documentation problem is mixing categories. A tutorial that stops
to explain architectural history loses the reader. A reference page that tries to
teach concepts becomes unusable for quick lookups. Keep categories separate and
link between them.

## Information architecture

### Organizing by system, not by team

Teams change. Systems persist. Organize documentation around systems and domains,
not org chart structure.

**Bad structure:**
```
/docs
  /backend-team
  /frontend-team
  /platform-team
```

**Good structure:**
```
/docs
  /services
    /checkout-service
    /user-service
    /payment-gateway
  /infrastructure
    /kubernetes
    /databases
    /ci-cd
  /guides
    /onboarding
    /deployment
    /incident-response
  /decisions
    /rfcs
    /adrs
```

### Naming conventions

- Use lowercase with hyphens: `checkout-service-runbook.md` not `CheckoutServiceRunbook.md`
- Prefix with document type when browsing matters: `rfc-002-new-auth-flow.md`
- Include dates for time-sensitive docs: `2024-03-postmortem-checkout-outage.md`
- Use index files for directories: every folder gets a `README.md` or `index.md`

### Search and discoverability

Documentation that can't be found doesn't exist. Improve discoverability with:

1. **Tags/labels** - Consistent tagging taxonomy across all docs (system, team, type)
2. **Cross-links** - Every doc links to related docs. Post-mortems link to runbooks.
   RFCs link to ADRs. How-to guides link to reference pages.
3. **A single entry point** - One "documentation home" page that links to all
   categories with brief descriptions
4. **Search optimization** - Use descriptive titles, include synonyms in the first
   paragraph, use standard terminology

## Documentation culture

### The documentation-as-code approach

Treat docs like code:

- **Version controlled** - Store in git alongside the code they describe
- **Reviewed** - Documentation changes go through PR review
- **Tested** - Links are checked, code examples are validated
- **Deployed** - Published automatically via CI/CD to a docs site

### Making documentation a habit

Documentation doesn't happen by default. Build it into workflows:

| Trigger | Documentation action |
|---|---|
| New feature merged | Update or create how-to guide |
| Architecture decision made | Write an ADR |
| Incident resolved | Write post-mortem within 48 hours |
| New team member joins | Note gaps in onboarding docs and fix them |
| Quarterly review | Audit and archive stale docs |

### Ownership model

Every document needs an owner. Without ownership, docs rot.

| Ownership model | How it works | Best for |
|---|---|---|
| Individual owner | One person responsible for keeping it current | ADRs, RFCs, post-mortems |
| Team owner | A team collectively maintains a set of docs | Service docs, runbooks |
| Rotating owner | Ownership rotates on a schedule | Knowledge base sections, onboarding |

### Reducing friction

The biggest enemy of documentation is friction. Reduce it with:

- **Templates** - Pre-built templates for every doc type (RFC, post-mortem, runbook, ADR)
- **Automation** - Auto-generate reference docs from code (API specs, config schemas)
- **Low ceremony** - A rough doc today is better than a perfect doc never written
- **Visible wins** - Celebrate when documentation prevents an incident or speeds up onboarding

## Onboarding documentation

### The 30-60-90 day guide

Structure onboarding docs around what a new hire needs at each stage:

**Week 1 (Day 1-5): Setup and orientation**
- Local dev environment setup (step-by-step, tested monthly)
- Key tools and access: list every tool with how to request access
- Team norms: communication channels, meeting schedule, PR conventions
- Architecture overview: one-page system diagram with brief descriptions

**Month 1 (Day 6-30): First contributions**
- "Good first issues" labeled in the issue tracker
- Code walkthrough of the main service the team owns
- Key contacts: who to ask about what
- Common workflows: how to deploy, how to run tests, how to debug

**Month 2-3 (Day 31-90): Independence**
- On-call training and runbook orientation
- Deep dives into complex subsystems
- Cross-team collaboration guides
- Contributing to documentation themselves (closing the loop)

## Managing documentation debt

### Documentation audit checklist

Run quarterly:

- [ ] Identify docs with "Last updated" > 6 months ago
- [ ] Check all links for 404s (automate this)
- [ ] Verify code examples still compile/run
- [ ] Remove docs for decommissioned systems
- [ ] Merge duplicate docs covering the same topic
- [ ] Update ownership for docs owned by people who left

### The archive decision

Not everything needs to be kept current. Use this framework:

| Condition | Action |
|---|---|
| Doc describes a current system/process | Keep and maintain |
| Doc describes a deprecated system still in use | Mark as "legacy" with migration pointer |
| Doc describes a decommissioned system | Archive (move to /archive, keep for history) |
| Doc is a finalized decision record (RFC, ADR) | Keep as-is, never edit (it's a historical record) |
| Doc is a duplicate of another, better doc | Redirect to the canonical version and delete |

## Tooling recommendations

Choose tools that reduce friction and support the documentation-as-code approach:

| Need | Recommended approach |
|---|---|
| Engineering docs | Markdown in git repo, rendered via static site generator |
| Runbooks | Markdown in git, linked from alert definitions |
| RFCs/ADRs | Markdown in a dedicated `/decisions` directory in the main repo |
| Knowledge base | Wiki tool (Notion, Confluence) or git-based wiki |
| API reference | Auto-generated from OpenAPI/GraphQL schema |
| Diagrams | Mermaid or PlantUML in markdown (version-controlled, no binary files) |
