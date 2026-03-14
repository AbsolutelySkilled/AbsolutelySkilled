<!-- Part of the ux-research AbsolutelySkilled skill. Load this file when
     selecting or comparing UX research methods for a study. -->

# UX Research Methods Catalog

A catalog of 18 UX research methods with when to use each, appropriate sample
sizes, and effort level. Use this to match a research question to the right method
rather than defaulting to whatever method feels familiar.

---

## How to read this catalog

- **When to use** - The research question or project stage this method fits best
- **Sample size** - Typical number of participants for valid results
- **Effort** - Relative cost in time and resources (Low / Medium / High)
- **Output** - What the method produces

---

## Generative Methods

### 1. In-depth User Interviews

One-on-one conversations exploring a user's behaviors, mental models, and motivations
in depth. The gold standard for qualitative discovery.

- **When to use**: Early discovery; understanding why users behave a certain way; building empathy before design begins
- **Sample size**: 5-8 per user segment
- **Effort**: Medium (30-90 min per session + synthesis)
- **Output**: Themes, quotes, behavioral patterns, opportunity areas

**Tips**: Always ask about past behavior, not hypothetical preferences. Record with consent.
Use probing techniques (silence, echo, elaboration) to go deeper than surface answers.

---

### 2. Contextual Inquiry

Observation in the user's natural environment while they work, with the researcher
asking questions as behaviors occur. Surfaces tacit knowledge that users cannot
articulate in interviews.

- **When to use**: Understanding a complex or unfamiliar workflow; enterprise software; physical environments
- **Sample size**: 5-8 participants
- **Effort**: High (travel + long sessions + analysis)
- **Output**: Workflow diagrams, observed pain points, workarounds, environmental constraints

**Tips**: Use the master-apprentice model - the user teaches you their work, you observe
and ask "why" when something unexpected happens.

---

### 3. Diary Studies

Participants self-report experiences, behaviors, or emotions at regular intervals over
days or weeks using a structured log. Captures longitudinal behavior that a single
session cannot.

- **When to use**: Behaviors that unfold over time; infrequent events; tracking emotional arc of an experience
- **Sample size**: 10-20 participants
- **Effort**: High (long duration; participant compliance management)
- **Output**: Time-series behavioral data, longitudinal patterns, moment-of-experience quotes

**Tips**: Keep the logging task under 5 minutes per entry. Use in-app prompts or SMS
reminders to improve compliance. Compensate participants well - they are doing ongoing work.

---

### 4. Focus Groups

Moderated group discussion (6-8 participants) exploring attitudes, perceptions, and
reactions to concepts. Better for social opinions than individual behavior.

- **When to use**: Concept reactions; brand perception; understanding shared social norms
- **Sample size**: 6-8 per group; run 2-3 groups
- **Effort**: Medium
- **Output**: Range of opinions, shared language, social dynamics around a topic

**Tips**: Focus groups reveal what people say in social contexts, not what they do alone.
Never use them as a substitute for individual interviews or usability testing. Dominant
personalities can skew group opinion.

---

### 5. Card Sorting

Participants group and label content items, revealing their mental models of how
information should be organized.

- **When to use**: Information architecture design; navigation structure; labeling decisions
- **Sample size**: 15-30 for open sort; 20-30 for closed sort
- **Effort**: Low to Medium
- **Output**: Dendrogram, similarity matrix, category names participants generate

| Variant | Description |
|---|---|
| **Open sort** | Participants create their own groups and labels. Use for new IA design. |
| **Closed sort** | Participants sort into predefined categories. Use to validate existing IA. |
| **Hybrid** | Participants sort then suggest alternate category names. |

**Tools**: Optimal Workshop Optimal Sort, Maze, Miro.

---

### 6. Surveys

Structured questionnaires delivered at scale to measure attitudes, behaviors, and
satisfaction. Quantifies what qualitative research surfaces.

- **When to use**: Measuring baseline satisfaction; validating qualitative themes at scale; tracking metrics over time
- **Sample size**: 100+ for basic segmentation; 400+ for statistical significance across subgroups
- **Effort**: Low to Medium (design is hard; fielding is cheap)
- **Output**: Frequencies, cross-tabs, satisfaction scores, NPS, net sentiment

**Tips**: Limit surveys to 5-10 questions. Each question must map to a specific decision.
Include one open-ended question at the end. Pilot-test with 3-5 people before distributing.
Avoid Likert scales without a clear neutral midpoint.

---

### 7. Stakeholder Interviews

Internal interviews with product managers, engineers, sales, and support to surface
existing knowledge, constraints, and organizational assumptions.

- **When to use**: Project kick-off; understanding internal constraints; auditing existing research before doing new work
- **Sample size**: 3-8 stakeholders
- **Effort**: Low
- **Output**: Existing knowledge inventory, business goals, known assumptions, research gaps

**Tips**: Ask what decisions they need research to inform, not just what they already
believe. Surface gaps between what stakeholders assume and what users actually do.

---

## Evaluative Methods

### 8. Moderated Usability Testing

A researcher watches participants attempt realistic tasks on a product, identifying
usability issues through observation and think-aloud narration.

- **When to use**: Before launch; after major redesign; when you suspect specific task flows have issues
- **Sample size**: 5 per distinct user segment
- **Effort**: Medium (recruiting + 60-90 min sessions + synthesis)
- **Output**: Task completion rates, error patterns, pain point quotes, prioritized issue list

**Tips**: Write task scenarios, not task instructions. "Find a flight from NYC to LA
for next Friday" not "Click the search field and enter a departure city." Debrief with
open questions after all tasks are complete.

---

### 9. Unmoderated Remote Usability Testing

Participants complete tasks independently using an automated platform. Faster and
cheaper than moderated testing; loses the ability to probe unexpected behavior.

- **When to use**: Quick validation; high-volume testing; when budget for moderated sessions is limited
- **Sample size**: 20-50 (more participants compensate for lost depth)
- **Effort**: Low to Medium
- **Output**: Task completion rates, time-on-task, screen recordings, click paths

**Tools**: UserTesting, Maze, Lookback, Userbrain.

**Tips**: Write very clear task scenarios - you cannot clarify in real time. Include
attention-check questions to filter low-quality responses.

---

### 10. A/B Testing

Randomized experiment serving two or more variants to traffic simultaneously and
measuring outcome differences using statistical inference.

- **When to use**: Optimizing a specific conversion or engagement metric when you have sufficient traffic
- **Sample size**: Calculated from baseline rate, MDE, power (80%), and significance (95%). Typically thousands per variant.
- **Effort**: Medium to High (requires engineering instrumentation)
- **Output**: Statistically significant lift or null result on primary metric

**Tips**: Test one variable at a time. Define primary metric, guardrail metrics, and
test duration before starting. Never stop a test early because it reached significance
(peeking problem). Always validate that instrumentation works before starting.

---

### 11. First-Click Testing

Participants are shown a screen and asked where they would click to complete a goal.
Reveals whether navigation and calls-to-action are findable.

- **When to use**: Evaluating navigation labels; testing landing page hierarchy; quick IA validation
- **Sample size**: 20-40 participants
- **Effort**: Low
- **Output**: Click heatmap, first-click accuracy rate, time-to-first-click

**Tips**: First-click accuracy of 80%+ indicates strong findability. Below 60% signals
a labeling or layout problem worth redesigning before full usability testing.

---

### 12. Tree Testing

Participants navigate a text-only site hierarchy to find items, isolating IA problems
from visual design noise.

- **When to use**: Validating navigation structure before implementing visual design; testing redesigned IA
- **Sample size**: 30-50 participants
- **Effort**: Low to Medium
- **Output**: Directness score, success rate, time per task, where users go wrong

**Tools**: Optimal Workshop Treejack, Maze.

**Tips**: Run tree testing before card sorting if you want to audit existing navigation.
Pair results with card sorting data to see both how users organize content and whether
they can find it in your proposed structure.

---

### 13. Concept Testing

Showing early-stage concepts (sketches, storyboards, low-fi mockups) to users and
collecting reactions before significant design investment.

- **When to use**: Validating multiple directions early; testing messaging and positioning; checking comprehension of a new idea
- **Sample size**: 5-8 per concept
- **Effort**: Low to Medium
- **Output**: Preference data, comprehension rates, emotional reactions, deal-breaker concerns

**Tips**: Present concepts as options, not finished products. Ask "what do you think
this does?" before asking "would you use this?" Never ask "do you like it?" - preference
without task context is not actionable.

---

### 14. Desirability Testing

Participants select from a set of adjectives to describe their reaction to a design.
Surfaces emotional and brand alignment data.

- **When to use**: Brand redesigns; evaluating visual design tone; comparing multiple design directions
- **Sample size**: 20-30 per design direction
- **Effort**: Low
- **Output**: Word frequency distribution; comparison across variants

**Method**: Use Microsoft's Product Reaction Cards (118 adjectives, ~60% positive).
Present the design, then ask users to pick 5 words that describe it. Compare distributions
across variants or against brand target.

---

### 15. Heuristic Evaluation

Expert reviewers evaluate an interface against established usability heuristics
(typically Nielsen's 10) and rate the severity of violations.

- **When to use**: Quick audit before user research; identifying obvious issues without recruiting participants; small teams with limited research budget
- **Sample size**: 3-5 expert evaluators (not a substitute for testing with real users)
- **Effort**: Low
- **Output**: Prioritized issue list with severity ratings (0-4 scale)

**Severity scale**: 0 = not a usability problem; 1 = cosmetic; 2 = minor; 3 = major; 4 = catastrophic.

**Tips**: Heuristic evaluation finds different issues than usability testing - experts
miss problems that confuse novices and vice versa. Use both for comprehensive coverage.

---

### 16. Eye Tracking

Technology measures where users look on a screen, producing fixation maps and scan
paths. Shows attention patterns that click data alone cannot reveal.

- **When to use**: Optimizing visual hierarchy; evaluating advertising placement; studying reading patterns on dense content
- **Sample size**: 30-40 for reliable heatmaps
- **Effort**: High (equipment cost, lab setup, analysis complexity)
- **Output**: Fixation heatmaps, gaze plots, areas of interest dwell time, scan path analysis

**Tips**: Eye tracking reveals where attention goes, not whether comprehension occurred.
Always pair with verbal probing or comprehension questions to interpret fixation data.

---

### 17. Session Recording Analysis

Watching recordings of real user sessions in production to identify rage clicks,
error loops, and abandonment patterns at scale.

- **When to use**: Post-launch investigation; identifying where users struggle in the live product; complementing quantitative analytics
- **Sample size**: 50-200 sessions per flow being analyzed
- **Effort**: Low to Medium
- **Output**: Friction points, error patterns, rage-click hotspots, abandonment moments

**Tools**: FullStory, Hotjar, LogRocket, PostHog.

**Tips**: Filter for sessions with specific behaviors (rage clicks, error states,
task abandonment) rather than watching random sessions. Pair findings with funnel
analytics to understand scale.

---

### 18. Accessibility Audit

Systematic evaluation of an interface against WCAG guidelines, using automated
scanning tools plus manual testing with assistive technologies.

- **When to use**: Before launch; after major UI changes; compliance requirements; inclusive design review
- **Sample size**: Automated tools + 2-3 assistive technology users
- **Effort**: Medium
- **Output**: WCAG violation list by severity, screen reader compatibility report, keyboard navigation assessment

**Tips**: Automated tools catch ~30% of accessibility issues. Manual testing with
screen readers (NVDA, VoiceOver, JAWS) and keyboard-only navigation is required for
full coverage. Include users with disabilities in usability testing whenever possible.

---

## Method Selection Guide

| Research question | Recommended method |
|---|---|
| Why do users abandon this flow? | Moderated usability test + session recording |
| What are users' core needs we haven't addressed? | In-depth interviews + contextual inquiry |
| Where should we put this feature in the navigation? | Card sorting + tree testing |
| Which variant converts better? | A/B test |
| How satisfied are users overall? | Survey (NPS, CSAT, or SUS) |
| Does our new design feel like our brand? | Desirability testing |
| Is this early concept worth building? | Concept testing |
| What usability issues exist before we recruit users? | Heuristic evaluation |
| How does this feature perform over weeks of use? | Diary study |
| Where are users actually looking on this page? | Eye tracking or first-click test |
