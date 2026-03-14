<!-- Part of the product-strategy AbsolutelySkilled skill. Load this file when
     scoring or comparing features with RICE, ICE, MoSCoW, or Kano. -->

# Prioritization Frameworks

Detailed guides for RICE, ICE, MoSCoW, and Kano - the four frameworks that cover
95% of product prioritization situations. Each section includes the formula or
method, a worked example, and guidance on when to use it.

---

## RICE Scoring

RICE is a quantitative scoring model designed at Intercom to reduce prioritization
debates by converting estimates into a comparable score.

**Formula:**

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

### Component definitions

**Reach** - How many users will this initiative affect in a given time period (typically
one quarter)? Use real data: DAU, MAU, or the number of users who touch the relevant
flow. Be specific about the denominator.

- Count users (or transactions, sessions) per quarter
- Example: 1,200 users per quarter hit the onboarding step this affects

**Impact** - How much will this move the needle for each user who is reached?
Use a fixed scale to maintain comparability across items.

| Score | Meaning |
|---|---|
| 3 | Massive - drives significant metric movement |
| 2 | High - clear measurable improvement |
| 1 | Medium - noticeable improvement |
| 0.5 | Low - small improvement |
| 0.25 | Minimal - marginal at best |

**Confidence** - How confident are you in your Reach and Impact estimates? If you have
user research and data to back the estimates, confidence is high. If the estimate is
a gut feeling, it is low.

| Score | Meaning |
|---|---|
| 100% | High - data or strong research supports the estimate |
| 80% | Medium - some evidence, some assumption |
| 50% | Low - mostly assumption, little validation |

**Effort** - Total person-months required from all roles (product, design, engineering,
QA). Use half-months if needed. Effort does not use a scale - it is a direct count.

- Example: 1 designer x 0.5 months + 2 engineers x 1 month = 2.5 person-months

### Worked example

Three initiatives competing for Q3:

| Initiative | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Onboarding redesign | 1,200 | 2 | 80% | 3 | (1200 x 2 x 0.8) / 3 = **640** |
| Bulk CSV import | 500 | 3 | 80% | 2 | (500 x 3 x 0.8) / 2 = **600** |
| Dark mode | 2,000 | 0.5 | 100% | 1.5 | (2000 x 0.5 x 1.0) / 1.5 = **667** |

Despite affecting fewer users, dark mode scores highest because the effort is low.
However, RICE scores are inputs to a decision - not the decision itself. If dark mode
does not contribute to the north star metric and onboarding does, deprioritize dark
mode regardless of score.

### When to use RICE

- Quarterly planning sessions with 5-15 competing initiatives
- When stakeholder opinions are competing and you need a neutral framework
- When you have enough data to make estimates meaningful (not for early discovery)
- When team size is large enough that informal prioritization breaks down

### RICE pitfalls

- **Gaming the scores** - teams inflate Reach and Impact to get their favorite feature
  prioritized. Require that estimates cite a source (analytics pull, user research note).
- **Ignoring strategic fit** - a high RICE score does not mean the initiative aligns
  with the current strategy. Always filter by "does this serve this quarter's theme?"
  before scoring.
- **Treating estimates as facts** - RICE creates false precision. Use it to rank order,
  not to predict exact impact.

---

## ICE Scoring

ICE is a faster, lighter-weight scoring model created by Sean Ellis (of GrowthHackers).
It trades RICE's precision for speed. Use it for rapid triage of large backlogs.

**Formula:**

```
ICE Score = Impact x Confidence x Ease
```

Each dimension is scored 1-10.

### Component definitions

**Impact (1-10)** - How much will this move the target metric if it works? 10 = game
changing, 1 = negligible.

**Confidence (1-10)** - How confident are you that this will work as expected? 10 = proven
by data or prior experiments, 1 = pure hypothesis.

**Ease (1-10)** - How easy is this to implement? 10 = can be done in a day, 1 = requires
months of engineering effort. (Note: this is the inverse of Effort in RICE.)

### Worked example

| Initiative | Impact | Confidence | Ease | ICE Score |
|---|---|---|---|---|
| Add email reminder for incomplete onboarding | 7 | 8 | 9 | **504** |
| Redesign dashboard home | 6 | 5 | 3 | **90** |
| Add Google SSO | 8 | 9 | 7 | **504** |
| Build native mobile app | 9 | 4 | 2 | **72** |

Email reminder and Google SSO tie on score - resolve ties by asking which one unblocks
more other work, or which one the team has more context on.

### When to use ICE vs. RICE

| Scenario | Use |
|---|---|
| Large backlog triage (20+ items) | ICE - faster to score |
| Quarterly planning with stakeholders | RICE - more defensible |
| Growth experiment queue | ICE - built for experiment prioritization |
| Cross-functional initiative trade-offs | RICE - shared language across roles |
| Solo PM, small team, low ceremony | ICE - lightweight enough to use weekly |

### ICE pitfalls

- **Ease overweights low-hanging fruit** - high-ease items may not move strategic
  metrics. Balance ICE scores with a "does this serve the strategy?" filter.
- **No separation of Reach from Impact** - ICE cannot distinguish "affects 10 users
  massively" from "affects 10,000 users minimally." When reach matters, use RICE.

---

## MoSCoW

MoSCoW is a categorization method, not a scoring model. It is best used for scoping
a specific release or sprint, not for general backlog ordering.

The name is an acronym: **M**ust Have, **S**hould Have, **C**ould Have, **W**on't Have.

### Category definitions

**Must Have** - The release cannot ship without this. If it is missing, the release
fails. Criteria:
- Legal or compliance requirement
- Core function without which the product does not work
- Agreed contract commitment to a customer
- Blocks another Must Have item

Test: "If we removed this, would we have to delay the release entirely?" If yes, it is
a Must Have.

**Should Have** - Important, valuable, and expected - but the release can function
without it in a degraded form. Include if capacity allows. Move to next release if
needed without risk.

**Could Have** - Nice to have. Improves experience but not expected by users. Cut first
when scope is tight. Sometimes called "wish list" items.

**Won't Have (this time)** - Explicitly out of scope for this release cycle. Not
rejected permanently - just parked. Writing these down is critical: it prevents the
same items from being re-raised in every planning meeting.

### MoSCoW in practice

Run MoSCoW as a workshop: list all candidate items, then vote them into categories.
Require that Must Haves account for no more than 60% of available capacity, leaving
room for Should Haves and buffer for risk.

| Category | Target capacity allocation |
|---|---|
| Must Have | 60% |
| Should Have | 20% |
| Could Have | 10% |
| Buffer / risk | 10% |

### Worked example (mobile app v1.0 release scope)

**Must Have:**
- User authentication (login, logout, password reset)
- Core task creation and completion flow
- Push notification for due dates
- Offline read access

**Should Have:**
- Search across tasks
- File attachment support
- Dark mode

**Could Have:**
- Custom notification sounds
- Widget for home screen
- Keyboard shortcuts

**Won't Have (this release):**
- Team collaboration features
- Calendar integration
- AI task suggestions

### When to use MoSCoW

- Scoping a specific release or sprint with a fixed deadline
- Aligning with stakeholders on what is and is not included
- Release planning for external commitments (customer demos, conference deadlines)
- When the question is "what ships now?" not "what do we build next year?"

### MoSCoW pitfalls

- **Everything becomes Must Have** - stakeholders lobby to upgrade their item. Enforce
  the 60% rule strictly. If adding a Must Have means removing another, make the trade
  explicit.
- **Won't Have items get forgotten** - document them in a visible backlog location.
  They are candidates for the next cycle, not the trash.

---

## Kano Model

The Kano model maps features to customer satisfaction curves to identify which features
are expected (must-haves), which create linear satisfaction (performance features), and
which delight beyond expectations (delighters / exciters).

### The three core Kano categories

**Basic needs (Must-be / Dissatisfiers)**
Features customers expect as table stakes. Their presence does not increase
satisfaction, but their absence causes strong dissatisfaction. Customers do not mention
these in research because they assume they exist.

Examples: password reset, HTTPS, mobile responsiveness, 99.9% uptime.

Rule: Invest enough to meet baseline expectations, then stop. Over-investing here does
not move satisfaction - it just avoids disaster.

**Performance needs (One-dimensional / Satisfiers)**
Features where more is better in a linear relationship. The more capability you
provide, the more satisfied the customer. These show up clearly in customer surveys
and competitive differentiation.

Examples: search quality, page load speed, report depth, storage limits.

Rule: Invest proportionally to how much customers value the metric. Benchmark against
competitors. Marginal returns exist here, but it takes longer to hit them than with
Basic needs.

**Excitement needs (Attractive / Delighters)**
Features customers did not expect and did not know to ask for, but react to with
genuine delight. When absent, customers are not dissatisfied (they did not expect
them). When present, they drive strong positive word-of-mouth and differentiation.

Examples: Spotify Wrapped, Notion's confetti on task completion, Figma's multiplayer
cursors.

Rule: A few well-chosen delighters differentiate more than dozens of performance
improvements. Invest selectively. Over time, delighters decay into performance features
and eventually into basic needs (Kano decay).

### Additional Kano categories

**Indifferent** - Features that neither satisfy nor dissatisfy regardless of presence.
Stop building these. They consume capacity without moving user sentiment.

**Reverse** - Features that actually decrease satisfaction when present. Some users
dislike features that others love (e.g., autoplay, gamification elements).

### Running a Kano survey

For each candidate feature, ask two questions:

1. **Functional form:** "If this feature were present, how would you feel?"
2. **Dysfunctional form:** "If this feature were NOT present, how would you feel?"

Response options: Delighted / Expected it / Neutral / Could live with it / Dislike it

Plot responses on the Kano matrix to categorize each feature.

| Functional reaction | Dysfunctional reaction | Category |
|---|---|---|
| Delighted | Dislike | Excitement (Delighter) |
| Expected it | Dislike | Performance |
| Neutral | Dislike | Basic need |
| Neutral | Neutral | Indifferent |
| Dislike | Delighted | Reverse |

### Kano + RICE combined approach

Use Kano to categorize features, then use RICE to sequence within each category:
1. Ship all unfulfilled Basic needs first (table stakes - no scoring needed)
2. RICE-score Performance features to find the highest-leverage investments
3. Select 1-2 Excitement features per release cycle to differentiate

### When to use Kano

- Understanding which features to invest in vs. just maintain
- Pre-launch research to scope a new product's MVP correctly
- Post-launch when satisfaction scores are flat despite shipping features
- Competitive analysis: mapping competitor features to Kano categories reveals gaps

---

## Framework selection guide

| Question | Best framework |
|---|---|
| "What do we build in Q3?" (quarterly planning) | RICE |
| "Which experiments should growth run this sprint?" | ICE |
| "What ships in the v2 release?" (release scoping) | MoSCoW |
| "Which features make customers happy vs. expected?" | Kano |
| "Quick triage of 30 backlog items" | ICE |
| "Stakeholder alignment on scope" | MoSCoW |
| "Cross-team initiative trade-offs" | RICE |
| "MVP feature selection for a new product" | Kano + MoSCoW |
