<!-- Part of the customer-research AbsolutelySkilled skill. Load this file when
     building, refining, or validating user personas. -->

# Persona Building Reference

## Persona template

Use this template for each persona. Every field must be grounded in observed data -
never fill a field from assumption alone.

```
# Persona: [Realistic Name]

## Role & context
- **Job title**: [Actual title from research]
- **Company size**: [Range observed in research sample]
- **Industry**: [If relevant to behavior differences]
- **Technical skill**: [Low / Medium / High - based on observed tool usage]

## Goals
1. [Primary goal - what they are trying to achieve with the product]
2. [Secondary goal]
3. [Tertiary goal, if applicable]

## Pain points
1. [Primary frustration - the thing that causes the most friction]
2. [Secondary pain point]
3. [Tertiary pain point]

## Behavioral patterns
- **Usage frequency**: [Daily / Weekly / Monthly - from analytics data]
- **Primary workflow**: [The main thing they do in the product]
- **Feature affinity**: [Which features they use most and least]
- **Channel preference**: [How they prefer to interact - self-serve, support, community]

## JTBD statement
"When [situation they find themselves in], I want to [motivation / action],
so I can [desired outcome]."

## Key quote
> "[Verbatim quote from an interview that captures this persona's mindset]"
> - [Participant ID, role, tenure]

## Data sources
- Interviews: [N] participants matching this profile
- Survey responses: [N] respondents in this segment
- Analytics segment: [Description of behavioral cohort]
```

## Persona development process

### Step 1: Gather raw data

Combine data from multiple sources. Never build personas from a single method.

| Source | What it provides | Minimum for personas |
|---|---|---|
| Interviews | Goals, pain points, workflows, quotes | 8-12 interviews |
| Survey data | Scale of patterns, demographics, preferences | 100+ responses |
| Behavioral analytics | Usage frequency, feature adoption, retention | 30+ days of data |
| Support tickets | Common issues, frustration intensity | 3+ months of tickets |
| Sales/CS notes | Purchase motivations, objections, churn reasons | 10+ account notes |

### Step 2: Affinity mapping

1. **Extract data points** - Pull individual observations from each source onto
   sticky notes (physical or digital). One observation per note.
   - "Uses the product daily but only for reporting" (analytics)
   - "Frustrated by lack of API access" (interview)
   - "Selected 'ease of use' as top priority" (survey)

2. **Cluster silently** - Group related notes without labels first. Let the clusters
   emerge from the data rather than forcing them into pre-existing categories.

3. **Name the clusters** - Once groups stabilize, give each a descriptive name:
   - "Power users who want automation and API access"
   - "Occasional users who need quick answers from dashboards"
   - "Admins who configure for others but rarely use the product directly"

4. **Identify axes** - Find the 2-3 dimensions that most strongly differentiate
   the clusters. Common differentiating axes:
   - Technical skill level (low to high)
   - Usage frequency (occasional to daily)
   - Use case complexity (simple to advanced)
   - Team size (individual to large team)
   - Decision-making role (user vs. buyer vs. influencer)

### Step 3: Define persona boundaries

Plot clusters on a 2D grid using your top 2 differentiating axes. Each occupied
quadrant (or distinct cluster) becomes a candidate persona.

Rules:
- **3-5 personas maximum** - More than 5 means you haven't found the real
  differentiators. Merge until you have distinct, memorable archetypes.
- **Each persona must be different in behavior, not just demographics** - "Young
  marketer" vs. "Senior marketer" is not a valid distinction unless their product
  behavior actually differs.
- **Include at least one underserved persona** - The user your product currently
  fails. This prevents your persona set from being a mirror of your best customers.

### Step 4: Draft and review

Write each persona using the template above. Then review:

**Peer review checklist:**
- [ ] Can a product manager read this persona and make a different decision than
  they would without it?
- [ ] Does every attribute trace back to observed data (interview quote, survey
  stat, analytics metric)?
- [ ] Are the personas distinct enough that a feature request would clearly
  matter more to one persona than another?
- [ ] Does the JTBD statement feel specific, not generic?
- [ ] Are pain points stated as problems, not feature requests?

### Step 5: Validate

**Holdout validation** - If you have enough data, build personas from 70% of your
research and test them against the remaining 30%. Can you classify the holdout
participants into the right persona?

**Stakeholder validation** - Share personas with customer-facing teams (sales, CS,
support). Ask: "Do you recognize these people? Who is missing?" Front-line teams
interact with customers daily and catch blind spots.

**Behavioral validation** - Map personas to analytics segments. Do users in each
analytics segment actually behave the way the persona predicts? If Persona A
"uses the product daily for reporting," verify that the corresponding analytics
segment shows daily login + report views.

## Keeping personas alive

Personas rot if they are not maintained. Treat them as living documents:

### Quarterly review

1. Check analytics segments - have the behavioral patterns shifted?
2. Review recent interview and survey data - any new pain points or goals?
3. Talk to 2-3 CS reps - "Is this persona still accurate? What has changed?"
4. Update the persona document with changes and a changelog entry

### Persona adoption tactics

- **Name them in meetings** - "How does [Persona Name] feel about this?" is more
  concrete than "How do our users feel about this?"
- **Hang them on walls** - Physical or virtual posters in team spaces
- **Include in PRDs** - Every product requirement should name which persona it serves
- **Use in prioritization** - When debating features, ask which persona benefits
  and how many of that persona exist in your user base

## Worked example

Below is a condensed example for a B2B project management tool.

### Persona: Priya the Project Lead

**Role & context**
- Job title: Senior Project Manager
- Company size: 50-200 employees
- Technical skill: Medium

**Goals**
1. Keep cross-functional projects on track without micromanaging
2. Generate status reports for leadership with minimal manual effort
3. Standardize workflows across her 3 direct-report PMs

**Pain points**
1. Spends 2+ hours/week compiling status updates from multiple sources
2. Cannot enforce consistent task structure across teams
3. Notifications are overwhelming - no way to filter by priority

**Behavioral patterns**
- Usage: daily, 4-5 sessions, avg 12 min per session
- Primary workflow: check dashboard -> review overdue tasks -> update status
- Feature affinity: high use of dashboards and reports; low use of time tracking
- Channel: prefers self-serve; rarely contacts support

**JTBD statement**
"When I'm preparing for Monday leadership sync, I want to pull a consolidated
status across all active projects, so I can brief executives in 5 minutes without
chasing updates from 6 different team leads."

**Key quote**
> "I just need one place where I can see red/yellow/green for every project
> without asking anyone. That's literally all I want."
> - P07, Senior PM, 14-month customer

**Data sources**
- Interviews: 4 of 10 participants matched this profile
- Survey: 38% of respondents selected "status reporting" as top use case
- Analytics: Cohort with daily login + 3+ dashboard views/week (22% of MAU)
