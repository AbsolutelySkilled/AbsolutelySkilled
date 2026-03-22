# video-creator

video-creator is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex. Creating complete videos from scratch - product demos, explainers, social clips, or announcements. Orchestrates the full workflow: deep interview, script generation, visual verification, Remotion project build, audio design, narration, and 4K rendering.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | video |
| Version | 0.1.0 |
| Platforms | claude-code, gemini-cli, openai-codex |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-creator
```

3. The video-creator skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

This is the **orchestrator skill** for end-to-end video creation. It coordinates
a complete 7-step workflow that takes a user from "I need a video" to a finished
4K render. Each step delegates to companion skills (remotion-video,
video-scriptwriting, video-audio-design, video-analyzer) while this skill
manages sequencing, approval gates, and handoffs between stages.

You do NOT need to know Remotion internals or audio engineering - those are
handled by companion skills. This skill's job is to run the process, ask the
right questions, and make sure nothing gets skipped.

---

## Tags

`video-creation` `orchestrator` `remotion` `programmatic-video` `4k` `production`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Related Skills

Pair video-creator with these complementary skills:

- [remotion-video](https://www.absolutelyskilled.pro/skill/remotion-video)
- [video-scriptwriting](https://www.absolutelyskilled.pro/skill/video-scriptwriting)
- [video-audio-design](https://www.absolutelyskilled.pro/skill/video-audio-design)
- [video-analyzer](https://www.absolutelyskilled.pro/skill/video-analyzer)

## Frequently Asked Questions

### What is video-creator?

Use this skill when creating complete videos from scratch - product demos, explainers, social clips, or announcements. Orchestrates the full workflow: deep interview, script generation, visual verification, Remotion project build, audio design, narration, and 4K rendering. Triggers on "make me a video", "create a video about", video production, and end-to-end video creation requests.


### How do I install video-creator?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-creator` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support video-creator?

This skill works with claude-code, gemini-cli, openai-codex. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/video-creator)*
