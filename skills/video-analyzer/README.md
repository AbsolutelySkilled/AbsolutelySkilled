# video-analyzer

Use this skill when analyzing existing video files using FFmpeg and AI vision, extracting frames for design system generation, detecting scene boundaries, analyzing animation timing, extracting color palettes, or understanding audio-visual sync. Triggers on video analysis, frame extraction, scene detection, ffprobe, motion analysis, and AI vision analysis of video content.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill video-analyzer
```

## Overview

Video analysis is the practice of extracting structured information from video
files - metadata, keyframes, scene boundaries, color palettes, motion data,
and audio characteristics. A well-built video analysis pipeline combines
FFmpeg for frame extraction and signal processing with AI vision models for
semantic understanding of visual content.

This skill covers the full workflow from raw video files to actionable data:
using ffprobe for metadata inspection, FFmpeg filter graphs for frame extraction
and scene detection, audio analysis for silence and volume detection, and AI
vision for design system extraction and content understanding.

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

## Recommended Skills

- [remotion-video](https://absolutely-skilled.vercel.app/skill/remotion-video)
- [video-creator](https://absolutely-skilled.vercel.app/skill/video-creator)
- [video-scriptwriting](https://absolutely-skilled.vercel.app/skill/video-scriptwriting)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/video-analyzer)*
