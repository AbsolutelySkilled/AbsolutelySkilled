---
name: social-media-scheduling
version: 0.1.0
description: >
  Use this skill when planning and packaging a full period of social media
  content for scheduling. Triggers on content calendars, posting cadence,
  content pillars, launch campaigns, social post queues, approval-ready post
  packages, and adapting one source asset across platforms.
category: marketing
tags: [social-media, scheduling, content-calendar, campaign-planning, content-strategy]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
license: MIT
maintainers:
  - github: thijssmudde
---

# Social Media Scheduling

Plan a scheduling-ready period of social content. The goal is not just to write posts. The goal is to turn a campaign goal, audience, channels, and constraints into a coherent queue that can be reviewed, approved, and scheduled.

This skill works for SaaS, AI tools, creator businesses, agencies, launches, and founder-led marketing.

---

## When to use this skill

Use this skill when the user wants to:

- Plan a week, month, quarter, launch window, or recurring social calendar
- Decide posting cadence across X, LinkedIn, Threads, TikTok, Instagram, YouTube Shorts, Reddit, or other channels
- Create content pillars for a product, founder, brand, or campaign
- Turn one source asset into platform-native social posts
- Package drafts for approval and scheduling
- Build a calendar that an agent or scheduling tool can execute

Do NOT use this skill for:

- Generic marketing strategy with no social scheduling component
- Paid media planning, ad account setup, or performance bidding
- Legal review of claims, regulated content, or compliance-sensitive campaigns

---

## Core Principles

1. **Calendar before copy.** Establish the campaign arc, cadence, and pillar mix before writing individual posts.
2. **Platform-native over duplicated cross-posting.** Reuse facts and ideas, not identical wording.
3. **Sequence beats volume.** A good calendar introduces, deepens, proves, handles objections, and reminds.
4. **Approval is part of scheduling.** Every post needs a status, owner, asset, and risk note when relevant.
5. **State assumptions.** If timing, audience, or cadence data is missing, choose conservative defaults and label them.

---

## Required Inputs

Gather or infer:

- campaign goal
- date range or number of weeks
- audience
- target platforms
- content pillars or source material
- available assets
- review capacity and approval owner
- timezone, excluded dates, and required CTAs

If the user only provides a rough goal, start with a lightweight assumptions block and proceed.

---

## Workflow

### 1. Define the campaign system

Create or confirm:

- audience tension
- primary CTA
- campaign arc
- content pillars
- proof sources
- constraints

### 2. Plan cadence

Assign a realistic weekly rhythm:

| Platform | Weekly Posts | Role | Formats | Notes |
| --- | --- | --- | --- | --- |

Primary channels get original posts. Secondary channels get adapted or lighter posts. Do not recommend a high-volume video cadence unless production capacity exists.

### 3. Build the calendar

Create a scheduling-ready table:

| Date | Time | Platform | Pillar | Angle | Format | CTA | Asset | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use status values:

- `ready`
- `needs edit`
- `needs asset`
- `needs fact check`
- `blocked`

### 4. Draft or adapt posts

For each important slot, produce platform-native copy:

- X: compressed, specific, high information density
- LinkedIn: professional stakes, context, practical value
- Threads: conversational and founder/personality-led
- TikTok/Reels/Shorts: spoken hook plus visual beats
- Reddit: community-native, no sales framing unless appropriate

### 5. Package for approval

End with a reviewable package:

| ID | Date | Time | Platform | Copy Status | Asset | CTA | Review Note |
| --- | --- | --- | --- | --- | --- | --- | --- |

Then include final copy blocks by ID.

---

## Quality Bar

- No repeated CTA on consecutive posts unless it is launch day.
- No generic "excited to announce" without a specific audience tension.
- No fabricated metrics, user quotes, competitor claims, or platform best times.
- Every post should have one job: awareness, education, proof, objection, conversion, or community.
- Every calendar should include sequence notes and missing-input notes.

---

## Output Template

```markdown
## Strategy

- Period:
- Audience:
- Goal:
- Primary CTA:
- Cadence:
- Assumptions:

## Pillars

| Pillar | Purpose | Formats | Proof Source | Ratio |
| --- | --- | --- | --- | --- |

## Calendar

| Date | Time | Platform | Pillar | Angle | Format | CTA | Asset | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Final Copy

### [ID] [Platform]
[copy]

## Review Notes

- [claim, asset, or approval item]
```

---

## Compatible scheduling tools

The output can be used with any social scheduling workflow. It is especially useful with agent-driven posting pipelines and MCP-compatible schedulers such as AgentReacher, where the final table can become scheduled drafts or review tasks.
