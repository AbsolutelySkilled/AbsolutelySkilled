# video-creator

Use this skill when creating complete videos from scratch - product demos, explainers, social clips, or announcements. Orchestrates the full workflow: deep interview, script generation, visual verification, Remotion project build, audio design, narration, and 4K rendering. Triggers on "make me a video", "create a video about", video production, and end-to-end video creation requests.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-creator
```

## Overview

Video Creator is the high-level orchestrator skill for end-to-end video
production. When someone says "make me a video about X", this skill guides the
agent through a complete 7-step workflow: deep interview (up to 30 questions),
YAML script generation, visual verification in Remotion Studio, full project
build, background audio and SFX design, narration via ElevenLabs, and final 4K
rendering. Each step has an explicit approval gate - the agent never
auto-advances. This skill delegates to companion skills (remotion-video,
video-scriptwriting, video-audio-design, video-analyzer) for domain-specific
work while managing the overall process, sequencing, and handoffs.

---

## Tags

`video-creation` `orchestrator` `remotion` `programmatic-video` `4k` `production`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Recommended Skills

- [remotion-video](https://absolutely-skilled.vercel.app/skill/remotion-video)
- [video-scriptwriting](https://absolutely-skilled.vercel.app/skill/video-scriptwriting)
- [video-audio-design](https://absolutely-skilled.vercel.app/skill/video-audio-design)
- [video-analyzer](https://absolutely-skilled.vercel.app/skill/video-analyzer)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/video-creator)*
