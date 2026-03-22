<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file when
     writing the markdown body of a new skill's SKILL.md. -->

# Body Structure Template

Write the SKILL.md body in this exact order. Each section is required unless
marked optional. Target lengths are guidelines, not hard limits.

```markdown
When this skill is activated, always start your first response with the 🧢 emoji.

# <Tool Name>

<One-paragraph overview. What the tool is, what problem it solves, and why
an agent would interact with it. 3-5 sentences max. Do not copy the
frontmatter description.>

---

## When to use this skill

Trigger this skill when the user:
- <specific action, e.g. "wants to create a payment intent">
- <specific action, e.g. "needs to handle a webhook from Stripe">
- <specific action, e.g. "asks about subscriptions, invoices, or billing">
- <...add 5-8 bullets covering the main trigger cases>

Do NOT trigger this skill for:
- <anti-trigger, e.g. "general questions about pricing or business logic">
- <anti-trigger - helps prevent false positives>

---

## Setup & authentication

<How to install the SDK / configure credentials. Use code blocks.
Cover the minimum viable setup an agent needs to start working.>

### Environment variables

```env
TOOL_API_KEY=your-key-here
# ... any other required vars
```

### Installation

```bash
# npm / pip / go get / etc.
```

### Basic initialisation

```<language>
// Minimal working setup
```

---

## Core concepts

<2-5 paragraphs or a small table explaining the domain model. What are
the key entities? How do they relate? This section builds the agent's
mental model before it starts calling APIs.

Example for Stripe: Payment Intent -> Charge -> Customer -> Invoice chain.
Example for GitHub: Repo -> Branch -> PR -> Review -> Merge flow.

Keep this concise - just enough to prevent category errors.>

---

## Common tasks

For each of the 5-8 most frequent agent tasks, write a subsection with:
- What it does (1 sentence)
- The exact API call / SDK method
- A working code example
- Any important edge cases or gotchas

### <Task 1>

<description>

```<language>
// working example
```

> <gotcha or rate-limit note if relevant>

### <Task 2>
...

---

## Error handling

<Cover the 3-5 most common errors an agent will encounter and how to
handle them. Include error codes or exception types where known.>

| Error | Cause | Resolution |
|---|---|---|
| `<ErrorType>` | <why it happens> | <what to do> |

---

## Setup & configuration (optional)

<If the skill needs user-specific configuration (API keys, Slack channels,
project IDs, service names), use this pattern. Store setup info in a
config.json in the skill directory. If the config doesn't exist, the
agent asks the user for it on first run using AskUserQuestion with
multiple-choice options where possible.>

```json
{
  "slack_channel": "#engineering-standup",
  "team_name": "Platform",
  "ticket_tracker": "linear",
  "project_id": "PLAT"
}
```

<Skip this section if the skill needs no user-specific configuration.>

---

## Scripts & helpers (optional)

<Provide composable code the agent can import and build on. Instead of
having it reconstruct boilerplate every time, give it helper functions.
Place these in scripts/ or assets/ in the skill folder.>

```python
# scripts/data_helpers.py
def fetch_events(event_type: str, start: str, end: str) -> pd.DataFrame:
    """Fetch events from the warehouse for the given date range."""
    # ... implementation
```

<Skip this section if no reusable code is needed.>

---

## Memory & logging (optional)

<If the skill benefits from remembering previous runs, describe the
logging pattern. An append-only log, a SQLite database, or a simple
JSON file can help the agent reference its own history.>

**Important:** Data stored in the skill directory may be deleted on
upgrades. Use a stable folder path for persistent data.

<Skip this section if the skill is stateless.>

---

## On-demand hooks (optional)

<Skills can register hooks that are only active when the skill is
invoked. Use this for opinionated guardrails you don't want running
all the time.>

**Examples:**
- Block dangerous commands (`rm -rf`, `DROP TABLE`, force-push) when
  touching production
- Prevent edits outside a specific directory during debugging

<Skip this section if no guardrails are needed.>

---

## References

For detailed content on specific sub-domains, read the relevant file
from the `references/` folder:

- `references/api.md` - full endpoint reference
- `references/webhooks.md` - webhook event types and payloads (if applicable)
- `references/errors.md` - complete error code list (if applicable)
- `references/<subfeature>.md` - <description> (add as needed)

Only load a references file if the current task requires it - they are
long and will consume context.
```

## Domain skill variant

For non-code / knowledge skills (marketing, sales, design patterns, etc.),
replace sections 3 and 6 with domain-appropriate alternatives:

```markdown
## Key principles

<3-5 foundational rules of the domain. These are the "laws" that govern
good work in this field. Be specific and actionable, not generic.>

1. **<Principle>** - <1-2 sentence explanation + why it matters>
2. ...

---

## Anti-patterns / common mistakes

<What to avoid. More useful than generic "error handling" for knowledge skills.>

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| `<pattern>` | <consequence> | <better approach> |
```

For "Common tasks", domain skills may use:
- Prose workflows instead of code blocks
- Templates (email templates, document structures, checklist formats)
- Frameworks (e.g. AIDA for copywriting, MEDDIC for sales)
- Decision trees or checklists

---

## Target lengths per section

| Section | Target lines | Notes |
|---|---|---|
| Title + overview | 5-8 | Distinct from frontmatter description |
| When to use | 12-15 | 5-8 triggers + 2 anti-triggers |
| Setup & auth / Key principles | 20-30 | Code skills: env vars, install. Domain: foundational rules |
| Core concepts | 15-25 | Domain model, key entities |
| Common tasks | 80-120 | 5-8 tasks with code or prose, gotchas inline |
| Error handling / Anti-patterns | 15-20 | Code: error table. Domain: mistakes table |
| Setup & configuration (optional) | 10-15 | Only if user-specific config needed |
| Scripts & helpers (optional) | 10-20 | Only if reusable code benefits the agent |
| Memory & logging (optional) | 5-10 | Only if the skill is stateful |
| On-demand hooks (optional) | 5-10 | Only if guardrails needed during invocation |
| References | 10-15 | Pointer to references/ folder |

Total SKILL.md body target: 160-280 lines (plus frontmatter).
Hard limit: 500 lines total including frontmatter.
Optional sections should only be included when genuinely useful - most
skills will use 2-3 of the 4 optional sections at most.
