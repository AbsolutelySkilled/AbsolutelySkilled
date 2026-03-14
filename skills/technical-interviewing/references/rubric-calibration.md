<!-- Part of the technical-interviewing AbsolutelySkilled skill. Load this file
     when running interviewer calibration sessions or training new interviewers. -->

# Rubric Calibration Guide

## Why calibrate

Without calibration, interviewers develop personal definitions of "strong" and
"weak." One interviewer's "Hire" is another's "Strong Hire." This inconsistency
means your hiring bar depends on which interviewer the candidate gets - not on
the candidate's actual ability. Calibration fixes this by aligning everyone on
what each rubric level looks like in practice.

**Target:** Interviewers agree within 1 point on a 4-point scale at least 80%
of the time after calibration.

---

## Calibration session format

**Frequency:** Quarterly, or when onboarding 3+ new interviewers
**Duration:** 90 minutes
**Participants:** 4-8 interviewers who use the same question
**Facilitator:** Interview program lead or senior interviewer

### Pre-session preparation

1. Select 3-4 candidate responses to calibrate on:
   - 1 clearly strong response
   - 1 clearly weak response
   - 2 borderline responses (these generate the most useful discussion)
2. Anonymize all responses (remove candidate names, companies, schools)
3. Distribute the rubric being calibrated (not the responses) 1 week before
4. Prepare scoring sheets with the rubric criteria pre-filled

### Session agenda

```
0:00 - 0:05  Context setting
  - State the goal: align on what each rubric level means
  - Remind: no "right" answers - we're calibrating the rubric, not the candidates

0:05 - 0:15  Review rubric together
  - Read each level's behavioral anchors aloud
  - Ask: "Any criteria that are unclear or ambiguous?"
  - Note ambiguous items (these are calibration opportunities)

0:15 - 0:30  Score Response #1 (clear strong)
  - Everyone reads silently and scores independently (5 min)
  - Facilitator collects scores simultaneously (raise fingers or digital poll)
  - Discuss: "Why did you give this score? Which criteria did you weight?"
  - Outcome: should be mostly aligned; if not, rubric needs clarification

0:30 - 0:50  Score Response #2 (borderline)
  - Same process: read, score independently, reveal simultaneously
  - This is where disagreements surface
  - For each disagreement: "Which specific rubric criterion led to different scores?"
  - Update rubric language where ambiguity caused divergence

0:50 - 1:10  Score Response #3 (borderline)
  - Same process
  - Focus on whether rubric updates from Response #2 help alignment

1:10 - 1:20  Score Response #4 (clear weak)
  - Quick alignment check
  - Discuss: "What separates No Hire from Strong No Hire?"

1:20 - 1:30  Wrap-up
  - Summarize rubric changes decided during session
  - Assign someone to update the canonical rubric document
  - Schedule next calibration session
```

---

## Facilitator guidelines

### Preventing anchoring

The biggest risk in calibration is anchoring - where one person's opinion
influences everyone else.

**Rules:**
- Never ask "Who wants to go first?" - use simultaneous reveal
- If a senior person speaks first, explicitly ask others to share before
  responding
- Use anonymous digital polling if available (Slido, Google Forms)
- If someone says "I agree with [person]" - ask them to articulate their own
  reasoning independently

### Handling persistent disagreement

If two interviewers consistently disagree by 2+ points:

1. Identify which rubric criteria they weight differently
2. Ask: "Which of these criteria is more predictive of on-the-job performance?"
3. If the group can't resolve it, add specificity to the rubric (more behavioral
   anchors, clearer must-haves vs nice-to-haves)
4. Document the disagreement and revisit with data after 1-2 hiring cycles

### Common calibration discoveries

| Discovery | Resolution |
|---|---|
| "Clean code" means different things to different people | Add specific examples: "functions under 20 lines, no nested callbacks deeper than 2 levels" |
| Some interviewers penalize for asking questions | Clarify: questions show maturity, not weakness. Add to rubric as positive signal |
| Interviewers give bonus points for using specific tech | Remove technology-specific criteria. Test concepts, not brand loyalty |
| "Communication" is scored inconsistently | Split into sub-criteria: explains approach before coding, responds to hints, asks clarifying questions |
| Strong candidates who are nervous score low | Add explicit note: evaluate peak demonstrated ability, not average. Nerves are not signal |

---

## New interviewer onboarding

### Shadow program (2-4 weeks)

```
Week 1: Observe 2 interviews
  - Shadow an experienced interviewer
  - Take notes using the rubric
  - After each: compare your score with the interviewer's and discuss gaps

Week 2: Reverse shadow 2 interviews
  - You run the interview, experienced interviewer observes
  - Experienced interviewer gives feedback on:
    - Question delivery and pacing
    - Hint-giving calibration (too many? too few?)
    - Score accuracy vs rubric

Week 3-4: Solo with review
  - Run interviews independently
  - Submit scores with written justification
  - Interview lead reviews justifications for first 3-4 interviews
  - Graduate to independent when scores align within 1 point consistently
```

### Common new interviewer mistakes

| Mistake | Coaching point |
|---|---|
| Giving too many hints | Let candidate struggle for 2-3 minutes before hinting. Struggling is signal. |
| Not giving enough hints | If stuck for 5+ minutes, a targeted hint prevents wasting the whole session |
| Asking leading questions | "Would you use a hash map here?" is leading. "How would you optimize lookup?" is not |
| Scoring based on personality | Introverts who code well should score the same as extroverts who code well |
| Comparing to themselves | "I would have done X" is not a rubric criterion. Only score against the rubric |
| Writing vague feedback | "Seemed okay" is not useful. Write specific observations: "Solved base case in 15 min, needed 2 hints for extension, did not discuss edge cases" |

---

## Measuring calibration effectiveness

Track these metrics over time:

- **Inter-rater reliability (IRR):** Percentage of interviews where all
  interviewers agree within 1 point. Target: 80%+
- **Score distribution:** If one interviewer gives 90% "Hire" and another gives
  50%, there is a calibration problem
- **Offer-to-accept ratio by interviewer:** If candidates who interview with
  specific interviewers accept less often, investigate the experience quality
- **New hire performance correlation:** Do interview scores predict 6-month
  performance ratings? If not, the rubric (not just calibration) needs work
