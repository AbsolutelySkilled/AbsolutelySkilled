<!-- Part of the customer-research AbsolutelySkilled skill. Load this file when
     planning, conducting, or analyzing user interviews. -->

# Interview Protocol Reference

## Interview types

| Type | Duration | Best for | Sample size |
|---|---|---|---|
| Semi-structured | 45-60 min | Exploratory research, understanding workflows | 8-12 participants |
| Structured | 30 min | Consistent data across many participants | 15-20 participants |
| Contextual inquiry | 60-90 min | Observing real behavior in natural environment | 5-8 participants |
| Diary study + debrief | 1-2 weeks + 30 min | Longitudinal behavior, habits, pain points | 10-15 participants |

Semi-structured is the default choice for most product research. Use structured
only when you need quantifiable comparisons across a larger sample.

## Recruiting

### Screener design

A screener filters applicants to ensure you interview the right people. Structure:

1. **Disqualifying questions first** - Eliminate non-targets early to respect their time
2. **Behavioral questions over self-reported** - "How many times did you [action]
   last month?" is better than "Are you a frequent user?"
3. **Include a trick question** - Add one question where only one answer is correct
   to catch professional survey-takers
4. **Quota tracking** - Define how many of each segment you need before recruiting starts

### Screener template

```
1. What is your role? [Single-select: target roles + "Other"]
   -> Disqualify: "Other"

2. How often do you use [product/category] in a typical week?
   [Never / 1-2 times / 3-5 times / Daily / Multiple times daily]
   -> Disqualify: "Never" (unless studying non-adopters)

3. Which of these tools do you currently use? [Multi-select]
   -> Include 2-3 fake tool names to catch inattentive respondents

4. When was the last time you [key behavior]?
   [This week / This month / 1-3 months ago / Longer / Never]
   -> Target based on research question

5. Would you be available for a 45-minute video interview in the next 2 weeks?
   Compensation: [amount]
   [Yes / No]
```

### Sample size guidance

Pattern saturation typically occurs at 8-12 interviews for a homogeneous
population. If interviewing across 3 distinct segments, aim for 5-6 per segment
(15-18 total). Diminishing returns start after 12 interviews per segment.

## Consent and ethics

Every interview requires informed consent covering:

1. **Purpose** - What the research is about (high level, not hypotheses)
2. **Recording** - Will you record audio/video? Can they decline recording?
3. **Confidentiality** - How data will be stored, who will access it, how long retained
4. **Voluntary** - They can stop at any time without consequence
5. **Compensation** - Amount, form, and when they will receive it

### Consent script template

```
Before we begin, I want to share a few things:

- This interview is about understanding how you [topic]. There are no right or
  wrong answers - I'm here to learn from your experience.
- With your permission, I'd like to record this session. The recording will only
  be used by our research team and will not be shared externally. You can ask me
  to stop recording at any time.
- Your participation is completely voluntary. You can skip any question or end
  the interview at any time.
- You'll receive [compensation] within [timeframe] after our conversation.

Do you have any questions before we start? Do I have your permission to record?
```

## Interview guide structure

### Block 1: Introduction (5 minutes)

- Deliver consent script (above)
- Set expectations: "This will take about 45 minutes. I'll ask about your
  experience with [topic]. I'm interested in your honest perspective."
- Build rapport: "Before we dive in, can you tell me a bit about your role and
  what a typical day looks like?"

### Block 2: Context (10 minutes)

Goal: Understand the participant's environment before diving into specifics.

Starter questions:
- "Walk me through how you currently handle [workflow]."
- "What tools or processes do you rely on for [activity]?"
- "How has your approach to [topic] changed over the past year?"

### Block 3: Core exploration (25 minutes)

Goal: Deep-dive into the research questions. Use open-ended questions and follow-up
probes.

Question patterns:
- **Behavioral recall**: "Tell me about the last time you [action]. Walk me through
  what happened step by step."
- **Pain point discovery**: "What's the most frustrating part of [workflow]? What
  makes it frustrating?"
- **Workaround detection**: "Is there anything you've built or hacked together
  because existing tools don't do what you need?"
- **Priority mapping**: "If you could change one thing about [product/process],
  what would it be and why?"
- **Unmet needs**: "What would your ideal [solution] look like? What would it
  let you do that you can't do today?"

### Block 4: Reactions (10 minutes)

Goal: Get feedback on specific concepts, prototypes, or ideas. Optional - skip if
the research is purely exploratory.

Rules:
- Show, don't describe - use mockups, prototypes, or competitor screenshots
- Ask for initial reaction before explaining anything
- "What do you think this does?" tests comprehension
- "Would you use this? When?" tests intent (but take answers with skepticism -
  stated intent does not equal future behavior)

### Block 5: Wrap-up (5 minutes)

- "Is there anything I didn't ask about that you think is important?"
- "Is there anyone else you'd recommend I speak with about this?"
- Thank them and explain next steps: "We'll be synthesizing feedback from several
  interviews over the next few weeks. I may follow up with a brief clarification."
- Confirm compensation delivery

## Interviewer technique guide

### The five rules

1. **Listen more than you talk** - Target an 80/20 split (participant/interviewer).
   If you're talking more than 20%, you're over-steering.
2. **Embrace silence** - After a participant answers, count to 5 silently. They will
   often elaborate, correct themselves, or surface deeper thoughts.
3. **Follow the energy** - When a participant shows emotion (frustration, excitement,
   confusion), follow that thread. "You seem frustrated by that - tell me more."
4. **Never suggest answers** - "So you found it difficult?" is leading. Instead:
   "How did you find that experience?"
5. **Mirror and probe** - Repeat their last few words as a question to get them to
   elaborate. Participant: "It was really confusing." You: "Confusing?"

### Probing techniques

| Technique | When to use | Example |
|---|---|---|
| Silence (5 sec) | After any answer | (just wait) |
| Echo | When you want elaboration | "You mentioned it was 'clunky'..." |
| "Tell me more" | When the surface answer is too thin | "Can you tell me more about that?" |
| "Walk me through" | For process/workflow understanding | "Walk me through exactly what you did" |
| "Why" ladder | To get to root cause (ask why 3-5 times) | "Why was that important?" -> "Why?" -> "Why?" |
| Contrast | To surface unspoken preferences | "How does that compare to [alternative]?" |
| Hypothetical | To test priorities | "If that didn't exist, what would you do instead?" |

## Thematic analysis framework

After interviews are complete, analyze transcripts using this process:

### Step 1: First-pass coding

Read each transcript and highlight notable quotes. Tag each with a descriptive
code - a short phrase capturing the idea. Examples:
- "workaround-spreadsheet" - participant built a spreadsheet to compensate
- "trust-issue-data" - participant doesn't trust the data they see
- "time-pressure-reporting" - reporting takes too long under deadline pressure

### Step 2: Code consolidation

After coding all transcripts, list all codes and merge synonyms. Aim for 30-50
unique codes across all interviews.

### Step 3: Affinity clustering

Group related codes into 5-8 themes. Name each theme with an actionable phrase:
- "Users don't trust dashboard data because refresh timing is unclear"
- "Manual workarounds fill gaps in export functionality"
- "Onboarding fails to address the first critical workflow"

### Step 4: Pattern quantification

For each theme, count:
- **Frequency** - How many participants mentioned it? (e.g., 7 of 10)
- **Intensity** - How strongly did they feel? (mild annoyance vs. blocking pain)
- **Spontaneity** - Did they bring it up unprompted, or only when asked directly?

### Step 5: Insight generation

Transform themes into insight statements:

Format: "[X out of Y] participants [observation] because [reason], which means
[implication for product decisions]."

Example: "8 of 10 participants built manual spreadsheet workarounds for reporting
because the export feature doesn't support custom date ranges, which means adding
flexible date filtering would eliminate the #1 workaround and reduce time-to-report
by an estimated 30 minutes per week."

### Step 6: Prioritization matrix

Plot insights on a 2x2 matrix:
- X-axis: Business impact (low to high)
- Y-axis: Frequency / severity (low to high)

Top-right quadrant = act on immediately. Bottom-left = deprioritize or monitor.
