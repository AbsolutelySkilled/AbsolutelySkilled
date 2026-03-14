# Governance Models

This reference covers open source governance structures, decision-making processes,
and templates for GOVERNANCE.md. Load this file only when the user needs detailed
guidance on setting up or evolving project governance.

---

## Governance spectrum

Governance models range from centralized to fully distributed:

```
BDFL -----> Meritocratic -----> Foundation-backed -----> DAO/Cooperative
(1 person)   (earned trust)     (legal entity)          (token/vote-based)
```

Most projects start at the left and move right as they grow. There is no
universally "best" model - the right choice depends on project size,
contributor count, and organizational needs.

---

## Model 1: BDFL (Benevolent Dictator for Life)

One person makes all final decisions. Other contributors provide input but the
BDFL has the last word.

**When to use:**
- Early-stage projects with 1-3 core contributors
- Projects with a strong creative vision (programming languages, frameworks)
- When speed of decision-making matters more than consensus

**Examples:** Python (Guido van Rossum, retired), Linux (Linus Torvalds), Vim (Bram Moolenaar)

**Strengths:**
- Fast decisions, no committee overhead
- Clear accountability
- Consistent vision

**Weaknesses:**
- Bus factor of 1
- Can become a bottleneck as project grows
- Risk of alienating contributors who disagree with decisions

**Template:**

```markdown
# Governance

## Overview

[Project Name] is led by [Your Name] (@handle), who makes all final decisions
about the project's direction, features, and releases.

## Decision Making

- Day-to-day decisions (bug fixes, minor features) are made by any maintainer
- Significant changes (new features, API changes, architectural decisions) require
  approval from the project lead
- Anyone can propose changes by opening an issue or pull request
- The project lead will respond to proposals within [timeframe]

## Maintainers

| Name | GitHub | Area |
|---|---|---|
| [Your Name] | @handle | Project lead, all areas |
| [Name] | @handle | [specific area] |

## Succession

If the project lead is unable to continue, maintainership transfers to
[designated successor or process for choosing one].
```

---

## Model 2: Meritocratic / Consensus-based

Decision-making power is earned through sustained, quality contributions.
Decisions are made by consensus among those with earned authority.

**When to use:**
- Projects with 3-10+ active contributors
- When you want to distribute decision-making to reduce bottlenecks
- Community-driven projects without strong corporate backing

**Examples:** Apache projects, Node.js, Rust

**Strengths:**
- Distributes power and responsibility
- Motivates contributors with a path to influence
- More resilient than BDFL (no single point of failure)

**Weaknesses:**
- Consensus can be slow
- "Merit" can be biased toward certain types of contributions
- Governance process itself requires maintenance

**Template:**

```markdown
# Governance

## Roles

### Contributors
Anyone who has had a pull request merged. Contributors are listed in
[CONTRIBUTORS.md](CONTRIBUTORS.md).

### Committers
Contributors who have demonstrated sustained, high-quality contributions
and deep understanding of a project area. Committers can:
- Merge pull requests in their area of ownership
- Triage and label issues
- Vote on project decisions

Committers are nominated by existing committers and approved by lazy
consensus (no objections within 7 days).

### Technical Steering Committee (TSC)
A group of 3-7 committers who make project-wide decisions. The TSC:
- Sets project roadmap and priorities
- Approves architectural changes (via RFC process)
- Manages releases
- Resolves disputes between committers

TSC members are elected annually by committers.

## Decision Making

### Lazy consensus
Most decisions use lazy consensus: a proposal is announced, and if no one
objects within 7 days, it is accepted. This applies to:
- Merging pull requests
- Adding committers
- Minor process changes

### RFC process
Significant changes require a Request for Comments (RFC):
1. Author opens an RFC issue/PR using the template
2. Community discussion period of 14 days minimum
3. TSC reviews and makes a decision
4. Decision is documented in the RFC

RFCs are required for:
- Breaking API changes
- New major features
- Changes to governance or processes
- Deprecation of existing features

### Voting
When lazy consensus fails, the TSC votes. Decisions require a simple majority.
Votes are recorded publicly.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
The TSC is responsible for enforcement.
```

---

## Model 3: Foundation-backed

A legal entity (foundation) stewards the project. The foundation provides
governance structure, legal protection, and often funding.

**When to use:**
- Large projects with corporate contributors from multiple companies
- Projects that need trademark protection
- When neutral governance is important (no single company controls the project)
- Projects seeking sustainable funding through membership fees

**Examples:** Kubernetes (CNCF), Node.js (OpenJS), Linux (Linux Foundation)

**Major foundations:**
- **Linux Foundation** - Umbrella for many sub-foundations (CNCF, OpenJS, etc.)
- **Apache Software Foundation** - Strong governance model, incubator program
- **CNCF (Cloud Native Computing Foundation)** - Cloud-native projects
- **OpenJS Foundation** - JavaScript ecosystem projects
- **Eclipse Foundation** - Enterprise Java and IoT projects
- **Python Software Foundation** - Python language and ecosystem

**Strengths:**
- Neutral governance - no single company controls the project
- Legal protection for contributors and the project trademark
- Funding through corporate memberships
- Established processes and best practices

**Weaknesses:**
- Bureaucratic overhead
- Foundation membership fees can be expensive
- Project may lose some autonomy
- Not suitable for small projects

**Template:**

```markdown
# Governance

## Overview

[Project Name] is a project of the [Foundation Name]. The foundation provides
legal, financial, and governance support.

## Governing Board

The Governing Board oversees the project's strategic direction:
- 2 seats appointed by the foundation
- 3 seats elected by committers
- 1 seat for the Technical Lead

The board meets monthly. Minutes are published within 7 days.

## Technical Oversight Committee (TOC)

The TOC makes technical decisions:
- Reviews and approves architectural proposals
- Manages the release process
- Oversees sub-projects and working groups
- Resolves technical disputes

TOC members are elected by active committers for 2-year terms.

## Working Groups

Working groups focus on specific areas:
- **Core** - Runtime, API, and core functionality
- **Documentation** - Docs, tutorials, and examples
- **Ecosystem** - Plugins, integrations, and tooling
- **Security** - Vulnerability management and security reviews

Anyone can participate in working groups. Each WG has 1-2 leads
appointed by the TOC.

## Intellectual Property

All contributions are made under the [license]. Contributors sign
the [Foundation] CLA before their first contribution.
```

---

## RFC (Request for Comments) process

An RFC process is essential for any project beyond the BDFL stage:

### RFC template

```markdown
# RFC: [Title]

## Summary
One paragraph explanation of the proposed change.

## Motivation
Why are we doing this? What problem does it solve?

## Detailed Design
Technical details of how this will be implemented.

## Drawbacks
Why should we NOT do this? What are the risks?

## Alternatives
What other approaches were considered? Why were they rejected?

## Unresolved Questions
What aspects of the design are still TBD?
```

### RFC lifecycle

1. **Draft** - Author creates RFC as a PR or issue
2. **Discussion** - Minimum 14-day comment period
3. **Final Comment Period (FCP)** - 7 days of last call before decision
4. **Accepted / Rejected / Postponed** - Decision recorded with rationale
5. **Implemented** - Linked to implementing PRs

---

## Conflict resolution

Every governance model needs a conflict resolution process:

1. **Discussion** - Attempt to resolve through open discussion on the issue/PR
2. **Mediation** - A neutral maintainer facilitates a resolution
3. **Vote** - If mediation fails, the TSC/governing body votes
4. **Escalation** - For code of conduct violations, follow the CoC enforcement process

### Code of Conduct enforcement

Adopt the Contributor Covenant and define enforcement:

| Violation | Response |
|---|---|
| First minor offense | Private warning with explanation |
| Repeated minor offense | Temporary ban from community spaces (7-30 days) |
| Serious offense | Permanent ban, PR/issue privileges revoked |
| Threat of violence or harassment | Immediate permanent ban |

Enforcement decisions are made by the CoC committee (at least 2 people)
and documented privately.

---

## Transitioning governance models

### BDFL to Meritocratic

This transition usually happens when the BDFL wants to step back:

1. Identify 2-3 trusted contributors for a proto-TSC
2. Write GOVERNANCE.md documenting the new process
3. Run both models in parallel for 3-6 months
4. BDFL gradually delegates decisions to the TSC
5. Formally announce the transition

### Meritocratic to Foundation

This usually happens when corporate interest grows:

1. Evaluate foundations that align with your project's ecosystem
2. Apply to the foundation's project intake/incubation process
3. Transfer trademark and assets to the foundation
4. Adopt the foundation's CLA and governance requirements
5. Announce to community with clear explanation of what changes and what stays the same
