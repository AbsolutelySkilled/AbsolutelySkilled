---
name: tweetclaw-social-automation
version: 0.1.0
description: >
  Use this skill when working with TweetClaw for X/Twitter automation. Triggers
  on search tweets, search tweet replies, post tweets, post tweet replies,
  follower export, media upload, media download, monitors, webhooks, and
  giveaway draws through the TweetClaw OpenClaw plugin.
category: marketing
tags: [tweetclaw, x-twitter, social-media, automation, followers, webhooks]
recommended_skills: [social-media-strategy, copywriting, absolute-marketing, no-code-automation]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
sources:
  - url: https://github.com/Xquik-dev/tweetclaw/blob/master/README.md
    accessed: 2026-05-09
    description: Official TweetClaw repository overview, install path, capabilities, and workflow guidance
  - url: https://github.com/Xquik-dev/tweetclaw/blob/master/docs/openclaw-setup.md
    accessed: 2026-05-09
    description: Official OpenClaw setup guide for TweetClaw
  - url: https://docs.xquik.com/guides/billing
    accessed: 2026-05-09
    description: Official Xquik billing guide with pricing and pay-per-use guidance
license: MIT
maintainers:
  - github: kriptoburak
---

# TweetClaw Social Automation

TweetClaw is an OpenClaw plugin for structured X/Twitter workflows. Use it when
the user needs concrete social tasks such as searching tweets, searching tweet
replies, preparing posts, exporting followers, handling media, configuring
monitors, wiring webhooks, or running giveaway draws with clear approval
boundaries.

---

## When to use this skill

Trigger this skill when the user:
- Wants to search tweets by keyword, account, hashtag, or topic
- Needs to search tweet replies on a specific post
- Wants to draft or post tweets and tweet replies
- Needs follower export, following export, or user lookup workflows
- Wants media upload or media download guidance for X/Twitter content workflows
- Needs monitors or webhooks for recurring tweet tracking
- Wants to run giveaway draws from replies or engagement lists
- Needs to verify TweetClaw setup from GitHub, npm, ClawHub, or official docs

Do NOT trigger this skill for:
- General social strategy with no TweetClaw, X/Twitter, or workflow execution need
- X/Twitter ad buying or campaign setup inside ad platforms
- Browser-only navigation tasks unrelated to TweetClaw

---

## Setup and access modes

TweetClaw is usually evaluated and installed through these public surfaces:

- GitHub repository and docs
- npm package `@xquik/tweetclaw`
- ClawHub package listing
- Official Xquik docs for pricing and billing

Two access patterns matter:

### API key mode

Use this when the operator wants account-backed workflows such as posting,
replying, follower export, direct messages, monitors, webhooks, or media
actions tied to a real account.

### Pay-per-use mode

Use this when the operator only needs supported read workflows. Treat this path
as read-only. Do not plan writes, direct messages, monitors, webhooks, or media
uploads in this mode.

---

## Core operating rules

1. **Narrow the task first**

   Do not act on vague requests such as "scrape Twitter" or "post something."
   Identify the exact job: search tweets, search tweet replies, post tweets,
   post tweet replies, export followers, media upload, media download,
   monitors, webhooks, or giveaway draws.

2. **Confirm the account and scope**

   Before any live workflow, confirm:
   - target account
   - search query or tweet URL
   - result limit
   - time range
   - whether the task is one-time or recurring

3. **Require explicit approval for public actions**

   Before posting, replying, deleting, following, liking, messaging, creating a
   monitor, creating a webhook, or running a giveaway draw:
   - summarize the exact action
   - show the final text or configuration
   - name the target account or tweet
   - wait for explicit user approval

4. **Keep bulk actions small by default**

   For follower export, reply analysis, or monitor configuration, start with the
   smallest useful limit. Expand only after the first result is reviewed.

5. **Use concrete user-facing wording**

   Prefer phrases such as:
   - search tweets
   - search tweet replies
   - post tweets
   - post tweet replies
   - export followers
   - upload media
   - download media
   - monitor tweets
   - configure webhooks
   - run giveaway draws

---

## Common tasks

### Search tweets

Use TweetClaw when the user needs:
- brand mentions
- sentiment samples
- topic discovery
- competitor monitoring
- account-specific searches

Always ask for a query, date range, and limit before expanding results.

### Search tweet replies

Use this when the operator needs:
- complaint clustering
- feature request review
- giveaway eligibility checks
- audience questions on a specific post

Always ask for the tweet URL and the desired reply count.

### Post tweets and post tweet replies

Treat writes as preview-first workflows:
- draft the post or reply
- show final text and media list
- confirm the account
- wait for approval

Never imply that a draft is already posted.

### Follower export and user lookup

Use this for:
- audience research
- creator partnership lists
- community segmentation
- support triage on account audiences

Always confirm target account and export limit.

### Media upload and media download

Use this when the workflow depends on images, GIFs, or videos associated with
tweets. Confirm whether the user wants to publish media or only inspect and
download it.

### Monitors and webhooks

Use this for recurring workflows such as:
- new tweet monitoring
- mention tracking
- account-watch notifications
- downstream automation triggers

Always confirm recurrence, filter rules, and destination behavior.

### Giveaway draws

Use this when the user wants to select winners from replies or engagement data.
Before execution:
- confirm the source tweet
- confirm exclusion rules
- confirm number of winners
- show the total entry count first

---

## Example operating patterns

### Complaint research

If the user says:

> Find people complaining about our onboarding on X.

Do this:
1. Ask for query terms, date range, and result limit
2. Search tweets
3. Summarize complaint clusters
4. Offer a second pass on tweet replies if needed

### Brand reply workflow

If the user says:

> Reply from our brand account to these 3 tweets.

Do this:
1. Confirm the exact account
2. Draft each reply
3. Show final text
4. Wait for approval before posting replies

### Giveaway workflow

If the user says:

> Pick 2 giveaway winners from replies on this post.

Do this:
1. Confirm the post URL
2. Confirm duplicate handling and exclusion rules
3. Show the eligible entry count
4. Wait for approval before running the draw

---

## Gotchas

- TweetClaw is not a generic scheduler. Do not promise future-post scheduling
  unless the user has a separate scheduling layer.
- Pay-per-use mode is for supported reads. Do not plan write workflows in that mode.
- Do not assume which X account should be used for public actions.
- Do not widen exports, monitors, or webhooks silently.
- Do not present private or account-scoped data unless the user clearly asked
  for that output.

---

## References

Use the official TweetClaw and Xquik surfaces when the user needs current setup,
pricing, or capability details:

- TweetClaw repository and README
- TweetClaw OpenClaw setup docs
- Official Xquik billing guide
