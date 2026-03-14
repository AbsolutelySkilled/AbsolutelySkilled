<!-- Part of the customer-research AbsolutelySkilled skill. Load this file when
     designing, reviewing, or distributing a customer survey. -->

# Survey Design Reference

## Question type catalog

### Closed-ended questions

**Single-select (radio)** - Use when answers are mutually exclusive.
- "What is your primary role?" (PM, Engineer, Designer, Other)
- Best for: demographics, categorical data, filtering

**Multi-select (checkbox)** - Use when respondents may choose multiple options.
- "Which of these features do you use regularly?" (select all that apply)
- Best for: feature usage, channel discovery, pain point identification
- Always include "Other (please specify)" and "None of the above"

**Likert scale (5-point)** - Use for attitude and agreement measurement.
- "How satisfied are you with [feature]?" (Very dissatisfied to Very satisfied)
- Standard anchors: Strongly disagree / Disagree / Neutral / Agree / Strongly agree
- Always use odd numbers (5 or 7) to allow a neutral midpoint
- Label every point, not just the endpoints

**Rating scale (1-10 or 1-5)** - Use for intensity or likelihood.
- "How likely are you to recommend us?" (0-10, NPS format)
- "How important is [capability] to your workflow?" (1-5)
- Label endpoints clearly ("Not at all likely" to "Extremely likely")

**Ranking** - Use sparingly; cognitively expensive for respondents.
- "Rank these 5 features by importance to your daily work"
- Limit to 5-7 items maximum
- Consider MaxDiff (best-worst scaling) for longer lists

### Open-ended questions

**Short text** - Use for brief qualitative input.
- "What is the single biggest thing we could improve?"
- Limit to 2-3 per survey; response quality drops after that

**Long text** - Use for detailed feedback on specific experiences.
- "Describe a recent situation where [product] did not meet your needs."
- Place after a related closed-ended question for context priming

## Scale design rules

1. **Consistency** - Use the same scale direction throughout (always low-to-high or
   always high-to-low, never mix)
2. **Balanced** - Equal number of positive and negative options with a neutral center
3. **Labeled** - Label every scale point, not just endpoints; this reduces
   interpretation variance by 15-20%
4. **No more than 7 points** - 5-point scales are sufficient for most purposes;
   7-point scales add marginal precision but increase cognitive load
5. **Avoid "N/A" as a scale point** - Use a separate "Not applicable" option outside
   the scale if needed

## Question writing checklist

- [ ] One concept per question (no double-barreled: "How satisfied are you with
  speed and reliability?" is two questions)
- [ ] No leading language ("Don't you agree..." or "How much do you love...")
- [ ] No loaded terms ("Do you waste time on..." implies the answer)
- [ ] No absolutes ("Do you always..." or "Do you never...")
- [ ] No jargon unless your audience definitely knows the terms
- [ ] Response options are exhaustive and mutually exclusive
- [ ] Question order moves from general to specific (funnel structure)
- [ ] Sensitive questions are placed late in the survey, after rapport is built

## Sampling strategy

### Sample size guidelines

| Precision needed | Confidence level | Population size | Minimum sample |
|---|---|---|---|
| Directional insights | 80% | Any | 50-100 |
| Reliable segments | 90% | <10,000 | 200-300 |
| Statistical significance | 95% | >10,000 | 380-400 |
| Sub-group analysis | 95% | >10,000 | 100 per sub-group |

For most product research surveys, 200-400 responses provide actionable data.
Below 50, switch to interviews instead.

### Recruitment channels

| Channel | Best for | Watch out for |
|---|---|---|
| In-app intercept | Active users, feature feedback | Interruption fatigue; excludes churned users |
| Email to customer list | Broad reach, segmentable | Low response rates (5-15%); email fatigue |
| Post-interaction (support, purchase) | Experience-specific feedback | Recency bias; captures extreme experiences |
| Panel / third-party | Non-customers, market research | Quality varies; screen carefully |
| Community / social | Engaged users, qualitative richness | Self-selection bias; skews toward power users |

### Reducing non-response bias

1. Keep surveys under 7 minutes (12-15 questions)
2. Send reminders at 3 days and 7 days (two reminders max)
3. Offer an incentive proportional to effort (gift card, product credit)
4. Time sends for Tuesday-Thursday, 10am-2pm local time
5. Personalize the invitation (name, specific product context)
6. Compare early vs. late respondent demographics to check for bias

## Distribution best practices

**Pre-launch checklist:**
- Pilot with 5-10 internal respondents; fix confusing questions
- Test on mobile devices (40-60% of respondents will be on mobile)
- Set a close date and communicate it in the invitation
- Define analysis plan before sending (what will you cross-tab? what segments?)

**During collection:**
- Monitor completion rate daily; if below 80%, identify where people drop off
- Check for straight-lining (same answer for every Likert question) and flag suspicious responses
- Do not change questions mid-collection; if you must, start a new wave

**After collection:**
- Clean data: remove responses under 2 minutes (speed-runners) and straight-liners
- Weight responses if sample demographics skew from known population
- Analyze open-ended responses with thematic coding (see SKILL.md synthesis section)
- Report margin of error alongside all percentage findings
