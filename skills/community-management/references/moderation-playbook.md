<!-- Part of the community-management AbsolutelySkilled skill. Load this file when
     working with moderation policies, escalation procedures, or edge case handling. -->

# Moderation Playbook

Moderation is the operational backbone of a healthy community. This playbook
covers staffing, escalation procedures, response templates, automation rules,
and moderator well-being. Use it when writing or auditing community guidelines
or when designing a moderation workflow from scratch.

---

## Moderation team structure

Scale moderator coverage to community size:

| Community size | Volunteer mods | Staff mods | Coverage target |
|---|---|---|---|
| Under 500 | 1-2 | 1 | Business hours |
| 500-2,000 | 3-5 | 1-2 | 16 hours/day |
| 2,000-10,000 | 6-10 | 2-3 | 20 hours/day |
| Over 10,000 | 10+ | 3-5 | 24/7 |

Minimum team size rule: never rely on a single moderator. Any community over 200
members needs at least 2 people who can act, so coverage survives vacations and
burnout.

---

## Moderator selection criteria

Select moderators who demonstrate:
- Active community membership for at least 3 months
- Consistently constructive and positive tone in their own posts
- History of helping other members without being asked
- Ability to remain calm and neutral in heated discussions
- Availability for at least 5 hours per week
- Passed a brief scenario-based assessment (see below)

Avoid selecting moderators who are primarily motivated by status or who have a
history of arguing with other members. Empathy is non-negotiable.

---

## Moderator calibration scenarios

Use these during moderator selection and quarterly calibration sessions:

1. **The popular rule-bender** - A well-liked member consistently posts content
   that technically violates guidelines but generates high engagement. How do you
   handle it?
   - Good answer: apply the same standard as any other member; favoritism destroys
     trust faster than losing a popular member.

2. **The escalating debate** - Two respected members are arguing and the tone is
   deteriorating. Neither has technically violated rules yet. What do you do?
   - Good answer: intervene early with a de-escalation message in the thread before
     rules are broken, not after.

3. **The angry appeal** - You removed a post and the author DMs you claiming bias.
   How do you respond?
   - Good answer: acknowledge their frustration, cite the specific guideline, offer
     to escalate to the community lead if they disagree.

4. **The dogpile** - Multiple members are piling on to criticize one person's
   question. The original poster has not violated any rules. What action do you take?
   - Good answer: defend the original poster publicly, redirect the thread, message
     the pile-on participants privately.

---

## Violation tiers and enforcement ladder

### Tier 1 - Immediate removal (no warning)
Content in this tier is removed without warning and typically results in a permanent
ban on first offense:
- Harassment, hate speech, or threats directed at any person
- Doxxing or sharing private information without consent
- Sexual content involving minors
- Coordinated spam or phishing
- Impersonation of staff, moderators, or public figures

### Tier 2 - Warning then suspension
These violations receive a private warning on first offense. A second offense
within 90 days results in a 7-day suspension. A third offense results in a
permanent ban:
- Personal attacks or insults directed at other members
- Repeated off-topic posting after a redirect
- Deliberate spread of misinformation
- Undisclosed promotion or affiliate links
- Tone that is consistently dismissive or contemptuous

### Tier 3 - Gentle redirect (no formal action)
These are addressed publicly with a redirect, not a warning:
- Low-effort posts or questions that belong in a different channel
- Duplicate questions already answered in the last 30 days
- Minor tone issues in otherwise constructive posts
- Posts missing required information (e.g., bug reports without reproduction steps)

---

## Escalation response templates

### Tier 3 - Gentle redirect

```
Hey [name] - great question! This topic is a better fit for [channel/thread].
I've moved the post there so it gets the right eyes on it. Feel free to continue
the conversation in the new spot.
```

### Tier 2 - First warning (private message)

```
Hi [name],

I wanted to reach out about your recent [post/comment] in [location]. It doesn't
quite align with our community guidelines - specifically [cite specific rule with
a link to guidelines].

We want this space to work well for everyone. Could you [specific ask: edit the
post / adjust the tone / move it to the right channel]?

This is a friendly heads-up, not a formal action. If you have questions about the
guidelines, DM me or any moderator - we're happy to help.
```

### Tier 2 - Second warning (pre-suspension)

```
Hi [name],

This is a follow-up to our conversation on [date] about [specific guideline].
We've noticed [describe specific behavior], which is a repeat of the same pattern.

Per our guidelines, a second warning triggers a 7-day posting suspension. You'll
still be able to read the community during this time.

After the suspension, we'd love to have you back as a contributor. If you'd like
to discuss this, please reach out to [community lead name] at [contact].
```

### Tier 1 - Immediate ban notification

```
Your account has been suspended from [community name] for violating our community
guidelines regarding [specific violation type].

This action is effective immediately and permanently.

If you believe this was made in error, you may submit an appeal to [email or form
link] within 14 days. Appeals are reviewed by [community lead] and you will receive
a response within 5 business days.
```

### Appeal response - upheld

```
Hi [name],

Thank you for submitting an appeal. We reviewed the moderation action taken on
[date] against your account.

After review, we have decided to uphold the decision. The action was taken because
[brief, factual reason citing specific guideline]. Our review confirmed this
assessment.

The suspension/ban will remain in place. You are welcome to create a new account
after [timeframe if applicable] provided you agree to abide by the community
guidelines going forward.
```

### Appeal response - overturned

```
Hi [name],

Thank you for submitting an appeal. We reviewed the moderation action taken on
[date] and have decided to overturn it.

Upon review, we found that [brief explanation of why the decision was incorrect].
We apologize for the inconvenience. Your account has been restored.

We're committed to consistent and fair moderation. Thank you for bringing this
to our attention.
```

---

## Automation rules

Automation handles volume; humans handle nuance. Set up these automated rules
for communities above ~1,000 members:

### Auto-remove triggers (no human review needed)
- Messages containing terms from a maintained slur list (review list monthly)
- Links to known spam or phishing domains
- Messages from accounts created less than 1 hour ago containing external links
- Identical or near-identical messages posted to 3+ channels within 5 minutes

### Auto-flag for human review (within 1 hour)
- Content that has received 3+ member reports
- Messages containing keywords on a weekly-updated watch list
- First-time posters with messages over 500 characters in help or support channels
- Messages with more than 50% uppercase characters
- Links from domains not on an allowlist in channels where links are moderated

### Auto-respond triggers
- New member joins: send welcome DM with guidelines link and "introduce yourself" thread
- First post in a help channel: prompt to include context/version/repro steps
- Question with no response after 24 hours: flag to moderator queue for attention
- Mention of specific keywords (e.g., "cancel", "refund", "legal"): route to staff

---

## Moderation action log template

Log every formal moderation action (Tier 1 and Tier 2). Do not log Tier 3 redirects
unless a pattern is developing.

```
Date:        YYYY-MM-DD HH:MM UTC
Moderator:   [username]
Member:      [username of affected member]
Action:      [redirect / warning / content removal / temp ban / permanent ban]
Tier:        [1 / 2 / 3]
Guideline:   [specific rule violated, quoted from guidelines]
Evidence:    [link to message or screenshot ID]
Prior log:   [link to any previous entries for this member, or "first offense"]
Notes:       [any context - tone of interaction, appeal risk, escalation path]
```

Review the log monthly for:
- Repeat offenders approaching the next enforcement tier
- Patterns in violation type (may signal unclear guidelines or a new bad-actor wave)
- Moderator consistency (similar violations should receive similar responses)
- Time-of-day or day-of-week patterns (may indicate coverage gaps)

---

## Edge case guidance

**Public figures and brand accounts** - Apply the same rules as any other member.
Do not give special treatment. If a brand is self-promoting without disclosure,
warn them like anyone else. Document the interaction carefully.

**Coordinated harassment campaigns** - If multiple accounts target a single member
in a short window, treat it as a coordinated attack. Escalate immediately to
community lead. Ban the accounts. Consider a temporary post freeze on the affected
thread. Contact the targeted member directly to check on them.

**Controversial but on-topic discussions** - Not every heated thread is a moderation
problem. Disagreement is healthy. Intervene when tone becomes personal, not when
the topic is uncomfortable. Pin a note at the top of volatile threads: "This is a
sensitive topic. Please keep replies constructive and on-topic."

**Moderator conflict of interest** - If a moderator has a personal relationship with
a member involved in an incident, they must recuse and hand off to another moderator.
Log the recusal.

**Moderator error** - If a moderator makes a wrong call, acknowledge it quickly and
publicly if the original action was public. Overturn the decision, apologize to the
affected member, and update moderator training to prevent recurrence. Do not delete
evidence of the error.

---

## Moderator well-being

Moderation is emotionally taxing work, especially at scale. Protect your team:

- Rotate who reviews Tier 1 content - no single moderator handles all severe cases
- Hold monthly private moderator check-ins to debrief difficult situations
- Give explicit permission to step away and hand off when overwhelmed
- Recognize contributions publicly and privately - moderation is often invisible work
- Set a clear boundary between community hours and personal time; on-call schedules
  prevent the expectation of 24/7 availability from single individuals
- Provide access to the same mental health support resources available to staff
