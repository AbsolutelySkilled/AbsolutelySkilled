# video-analyzer

video-analyzer is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex. Analyzing existing video files using FFmpeg and AI vision, extracting frames for design system generation, detecting scene boundaries, analyzing animation timing, extracting color palettes, or understanding audio-visual sync.

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
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-analyzer
```

3. The video-analyzer skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

Video analysis is the practice of extracting structured information from video
files - metadata, keyframes, scene boundaries, color palettes, motion data,
and audio characteristics. A well-built video analysis pipeline combines
FFmpeg for frame extraction and signal processing with AI vision models for
semantic understanding of visual content. This skill covers the full workflow
from raw video files to actionable data: using ffprobe for metadata inspection,
FFmpeg filter graphs for frame extraction and scene detection, audio analysis
for silence and volume detection, and AI vision for design system extraction
and content understanding.

The two pillars of video analysis are FFmpeg (the Swiss Army knife of media
processing) and AI vision models (for understanding what is in each frame).
FFmpeg handles the mechanical work - splitting video into frames, detecting
scene changes via pixel difference thresholds, extracting audio waveforms.
AI vision handles the semantic work - identifying UI components, reading text,
extracting color values, and understanding layout patterns.

---

## Tags

`ffmpeg` `video-analysis` `frame-extraction` `ai-vision` `scene-detection` `design-system`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Related Skills

Pair video-analyzer with these complementary skills:

- [remotion-video](https://www.absolutelyskilled.pro/skill/remotion-video)
- [video-creator](https://www.absolutelyskilled.pro/skill/video-creator)
- [video-scriptwriting](https://www.absolutelyskilled.pro/skill/video-scriptwriting)

## Frequently Asked Questions

### What is video-analyzer?

Use this skill when analyzing existing video files using FFmpeg and AI vision, extracting frames for design system generation, detecting scene boundaries, analyzing animation timing, extracting color palettes, or understanding audio-visual sync. Triggers on video analysis, frame extraction, scene detection, ffprobe, motion analysis, and AI vision analysis of video content.


### How do I install video-analyzer?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-analyzer` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support video-analyzer?

This skill works with claude-code, gemini-cli, openai-codex. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/video-analyzer)*
