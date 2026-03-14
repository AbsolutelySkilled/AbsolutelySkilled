<!-- Part of the developer-experience AbsolutelySkilled skill. Load this file when
     working with developer onboarding, quickstart guides, or portal structure. -->

# Developer Onboarding Framework

## The five-minute rule

A developer should go from "I have never used this tool" to "I got a working
result" in under five minutes. This is the single most important DX metric.

To achieve this:
- Installation must be a single command
- Authentication must be copy-paste (test key, sandbox, or local mode)
- The first example must produce a visible, meaningful result
- No account creation should be required for the first experience

## Quickstart template

Every quickstart follows this structure. Do not deviate.

```markdown
# Quickstart

<Tool Name> lets you <one-sentence value prop>.

## Prerequisites

- <Language> >= <version>
- A <Tool Name> account ([sign up free](link)) -- only if truly required

## Install

  <single install command>

## Set your API key

  export TOOL_API_KEY=your-test-key-here

Get a test key at: <link to dashboard>

## Send your first <thing>

  <5-15 lines of code that produce a visible result>

Run it:

  <command to execute>

You should see:

  <expected output>

## Next steps

- [Send a <thing> with custom options](/docs/guides/custom-options)
- [Handle errors and retries](/docs/guides/error-handling)
- [Go to production](/docs/guides/production-checklist)
```

### Quickstart anti-patterns

| Pattern | Problem | Fix |
|---|---|---|
| Requires Docker/infra setup | Adds 10+ min before the first line of code | Offer a hosted sandbox or mock mode |
| Shows 50+ lines of config | Overwhelms the developer before they see value | Show minimum config; link to full options |
| First example requires domain knowledge | Developer can't follow along without context | Use a universal example (hello world, send email) |
| No expected output shown | Developer can't verify success | Always show what success looks like |
| Links to "full documentation" without specifics | Developer gets lost in a docs maze | Link to 2-3 specific next-step guides |

## Tutorial structure

Tutorials go deeper than quickstarts. They teach one complete workflow.

### Template

```markdown
# <Verb> + <Noun> (e.g. "Send a transactional email")

In this tutorial you will:
1. <Step 1 outcome>
2. <Step 2 outcome>
3. <Step 3 outcome>

**Time:** ~10 minutes
**Prerequisites:** Completed the [Quickstart](/docs/quickstart)

## Step 1: <Action>

<1-2 sentences of context>

  <code block>

<Explain what happened and why>

## Step 2: <Action>
...

## What you built

<Summary of what the developer accomplished>

## Next steps

- <Related tutorial 1>
- <Related tutorial 2>
```

### Tutorial principles
- One tutorial = one workflow (don't combine "send email" and "set up webhooks")
- Every step must produce a verifiable intermediate result
- Show the code first, explain after
- Time estimates must be honest - test them with a fresh developer

## Developer portal structure

### Information architecture

Organize docs by developer intent, not by product structure:

```
/docs
  /quickstart          - First 5 minutes
  /guides              - Task-oriented walkthroughs
    /authentication
    /sending-emails
    /handling-webhooks
    /going-to-production
  /api-reference       - Every method, parameter, type
  /changelog           - What changed and when
  /migration           - Upgrade guides for breaking changes
  /sdks                - Language-specific setup and quirks
  /examples            - Copy-paste recipes for common patterns
```

### Navigation principles
- Use task-oriented labels ("Send an email") not feature-oriented ("Email API")
- Put quickstart in the top-level navigation, never buried in a submenu
- Provide a search that covers docs, API reference, and changelog
- Show the most recent SDK version prominently with a version switcher

## Onboarding email sequence

For tools with accounts, design the onboarding email sequence around DX milestones:

| Email | Timing | Content |
|---|---|---|
| Welcome | Immediate | Link to quickstart, test API key, one-click sandbox |
| First success check | Day 1 | "Did you send your first X? Here's how" + quickstart link |
| Integration guide | Day 3 | "Ready to go deeper?" + top 3 guides for their use case |
| Production checklist | Day 7 | Security best practices, rate limits, monitoring setup |
| Community invite | Day 14 | Discord/Slack/forum link, office hours schedule |

### Segmentation
- Detect the developer's language/framework from their first API call
- Tailor follow-up emails with language-specific examples
- Track activation metrics: installed SDK, made first API call, integrated in app

## Measuring onboarding success

| Metric | Target | How to measure |
|---|---|---|
| Time to first API call | < 5 min | Timestamp between account creation and first request |
| Quickstart completion rate | > 60% | Track page scroll or step completion events |
| Day-7 retention | > 40% | Developer made API calls on 2+ distinct days in first week |
| Support ticket rate (first week) | < 10% | Tickets filed / new signups |
| Activation rate | > 30% | Developers who reach a defined "aha moment" within 14 days |

## Common onboarding pitfalls

1. **Requiring production credentials for sandbox** - Always offer test/sandbox keys
   that work immediately without approval workflows
2. **Docs lag behind SDK releases** - Automate doc generation from code; never let
   docs be more than one release behind
3. **No copy button on code blocks** - Small friction multiplied by every developer
   on every page
4. **Assuming framework knowledge** - Not every Node.js developer uses Express;
   show framework-agnostic examples first
5. **Hiding the pricing page** - Developers evaluate cost early; making them hunt
   for pricing destroys trust
