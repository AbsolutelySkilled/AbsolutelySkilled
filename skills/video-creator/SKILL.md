---
name: video-creator
version: 0.1.0
description: >
  Use this skill when creating complete videos from scratch - product demos,
  explainers, social clips, or announcements. Orchestrates the full workflow:
  deep interview, script generation, visual verification, Remotion project
  build, audio design, narration, and 4K rendering. Triggers on "make me a
  video", "create a video about", video production, and end-to-end video
  creation requests.
category: video
tags: [video-creation, orchestrator, remotion, programmatic-video, 4k, production]
recommended_skills: [remotion-video, video-scriptwriting, video-audio-design, video-analyzer]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
license: MIT
maintainers:
  - github: maddhruv
---

When this skill is activated, always start your first response with the :movie_camera: emoji.

# Video Creator

This is the **orchestrator skill** for end-to-end video creation. It coordinates
a complete 7-step workflow that takes a user from "I need a video" to a finished
4K render. Each step delegates to companion skills (remotion-video,
video-scriptwriting, video-audio-design, video-analyzer) while this skill
manages sequencing, approval gates, and handoffs between stages.

You do NOT need to know Remotion internals or audio engineering - those are
handled by companion skills. This skill's job is to run the process, ask the
right questions, and make sure nothing gets skipped.

---

## When to use this skill

Trigger this skill when the user:
- Says "make me a video", "create a video about", or "I need a video for"
- Wants a product demo, explainer, social clip, or announcement video
- Asks for end-to-end video production from concept to render
- Needs help turning an idea into a finished video file
- Mentions wanting a programmatic video with Remotion
- Has a reference video and wants to create something similar

Do NOT trigger this skill for:
- Editing an existing video file (use video-analyzer or ffmpeg skills)
- Writing a script only without producing a video (use video-scriptwriting)
- Audio-only production like podcasts (use video-audio-design for music/SFX)
- Remotion coding questions without a production context (use remotion-video)
- Analyzing or reviewing a video (use video-analyzer)

---

## Key principles

1. **Visual-first**: Get visuals approved before spending money on audio.
   Narration costs real dollars via ElevenLabs - never generate it until the
   visual layer is locked.

2. **Interview exhaustively**: Ask up to 30 questions to capture all context
   about the product, audience, goals, tone, assets, and visual preferences.
   Incomplete context leads to expensive re-work.

3. **Structured handoff**: The `video-script.yaml` file is the single source of
   truth between all steps. Every scene, frame count, narration line, and SFX
   cue lives in this file.

4. **User approval gates**: Explicit approval is required at each major step.
   Never auto-advance. The user must say "approved" or "looks good" before the
   next step begins.

5. **4K default**: Always render at 3840x2160 unless the user specifies
   otherwise. Downscaling is easy; upscaling is not.

---

## The 7-Step Workflow

### Step 1: Deep Interview

Gather all context needed to write a complete script. Ask questions **one at a
time** using an interactive conversational approach.

**Question categories** (aim for 15-30 questions total):

| Category | Example Questions |
|---|---|
| Product/subject | What does the product do? What is the core value prop? |
| Audience | Who is the target viewer? Technical level? |
| Video goals | What should the viewer do after watching? |
| Tone/style | Playful or professional? Fast or slow-paced? |
| Assets | Do you have logos, screenshots, brand colors, fonts? |
| Content | What are the key features or messages to cover? |
| Visual preferences | Any reference videos? Preferred animation style? |
| Duration | How long should the video be? Where will it be published? |

**Rules for Step 1:**
- Ask one question at a time - do not dump a questionnaire
- If the user provides a reference video, analyze it FIRST using the
  video-analyzer skill before asking questions
- Summarize what you know after every 5-8 questions
- Do not proceed until you have enough context for every scene
- End with: "I have enough context to write the script. Ready to proceed?"

**Exit criteria:** User confirms you have enough context.

---

### Step 2: Generate Script (YAML)

Use patterns from the video-scriptwriting skill to produce a structured YAML
script.

**Frame count formula:**
```
frames = duration_seconds * 30
```
All Remotion compositions use 30fps by default.

**Generate a `video-script.yaml` file** with this structure:
```yaml
title: "Product Demo - Acme Widget"
fps: 30
resolution: { width: 3840, height: 2160 }
total_duration_seconds: 60
scenes:
  - id: scene-01
    title: "Hook"
    duration_seconds: 5
    frames: 150
    narration: "Ever wished your widgets could think for themselves?"
    visuals: "Dark background, glowing Acme logo fades in, particles"
    animation_notes: "Logo scale 0->1 with spring, particles emit from center"
    music_cue: "Ambient synth pad, low energy"
    sfx: "Subtle whoosh on logo reveal"
    transition_out: "crossfade"
  - id: scene-02
    # ... continue for all scenes
```

**Rules for Step 2:**
- Every scene must have `duration_seconds`, `frames`, `narration`, `visuals`,
  `animation_notes`, `music_cue`, and `sfx` fields
- Frame counts must equal `duration_seconds * 30`
- Total scene durations must sum to `total_duration_seconds`
- Present the full script to the user for review
- Iterate on feedback until the user explicitly approves

**Exit criteria:** User approves the script.

---

### Step 3: Visual Verification

Build a **minimal** Remotion project with visuals only - no audio layer yet.

**What to build:**
- Remotion compositions for each scene (visuals, animations, typography, colors)
- Scene transitions matching the script
- Correct frame counts per scene
- Basic layout and spacing at 4K resolution

**What NOT to build yet:**
- Audio integration
- Narration sync
- Volume ducking
- Final render pipeline

**Process:**
1. Create the minimal Remotion project structure
2. Build visual compositions for each scene
3. Launch Remotion Studio: `npx remotion studio`
4. Tell the user to preview at `http://localhost:3000`
5. Iterate on visual feedback (colors, timing, animations, transitions)
6. Get EXPLICIT visual approval before proceeding

**Exit criteria:** User explicitly approves the visuals.

---

### Step 4: Build Full Remotion Project

Now that visuals are approved, flesh out the complete project.

**Tasks:**
- Finalize all compositions with polished animations
- Wire up scene-to-scene transitions
- Add Zod schemas for parametrization (titles, colors, durations)
- Ensure frame counts match the script exactly
- Organize project structure cleanly:

```
src/
  compositions/
    Scene01Hook.tsx
    Scene02Feature.tsx
    ...
  components/
    AnimatedLogo.tsx
    TransitionWipe.tsx
    ...
  Root.tsx
  index.ts
  video-script.yaml
```

**Rules for Step 4:**
- Each scene should be its own composition file
- Shared components go in `components/`
- All magic numbers should be replaced with Zod schema props
- Frame counts must still match `video-script.yaml`

**Exit criteria:** Full project builds without errors and matches approved visuals.

---

### Step 5: Add Background Audio + SFX

Use patterns from the video-audio-design skill.

**Tasks:**
1. Source or select background music (user-provided or from documented sources)
2. Place SFX at trigger points from the script (clicks, typing, whooshes, etc.)
3. Set base volume levels for music and SFX
4. Implement ducking infrastructure - prepare volume curves that will lower
   music during narration segments in Step 6
5. Preview audio-visual sync in Remotion Studio

**Volume guidelines:**
| Layer | Base Volume | During Narration |
|---|---|---|
| Background music | 0.3-0.5 | 0.1-0.15 |
| SFX | 0.5-0.8 | 0.4-0.6 |
| Narration | N/A (Step 6) | 1.0 |

**Exit criteria:** User approves audio-visual sync.

---

### Step 6: Add Narration (Deferred - costs money)

This step involves paid API calls to ElevenLabs. Always confirm before
proceeding.

**Setup:**
1. Check if user has an ElevenLabs API key
2. If not, guide them through signup at `https://elevenlabs.io`
3. Ask voice preference questions:
   - Gender preference?
   - Age range (young, middle, mature)?
   - Accent preference?
   - Energy level (calm, moderate, energetic)?
   - Warmth (warm and friendly, neutral, authoritative)?

**Process:**
1. Generate narration audio for each scene via ElevenLabs API
2. Calculate exact audio durations from generated files
3. Adjust frame counts if narration is longer/shorter than planned
4. Update `video-script.yaml` with actual audio durations
5. Sync narration with visual timing
6. Activate volume ducking on background music during narration segments
7. Preview complete audio mix in Remotion Studio

**Rules for Step 6:**
- Always confirm costs before making API calls
- If user wants to skip narration, that is fine - proceed to Step 7 without it
- If user prefers a different TTS provider, support that
- Re-sync all timing if audio durations differ from script estimates

**Exit criteria:** User approves narration sync (or explicitly skips this step).

---

### Step 7: Final Preview + 4K Render

**Process:**
1. Launch full preview with all layers in Remotion Studio
2. Tell user to review the complete video (visuals + music + SFX + narration)
3. Get final approval
4. Render at 4K:
```bash
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160
```

**Format guidance:**
| Format | Use Case |
|---|---|
| MP4 (H.264) | Web, social media, general sharing |
| MP4 (H.265) | Smaller file size, modern device playback |
| ProRes | Further editing in Premiere, Final Cut, DaVinci |
| WebM (VP9) | Web embedding with transparency support |

**Exit criteria:** Rendered video file delivered to user.

---

## Orchestration rules

1. Each step requires explicit user approval before advancing to the next step
2. Explain what you are doing and why at each step
3. If the user provides a reference video, run video-analyzer FIRST before
   starting Step 1
4. Always create a `video-script.yaml` as the single source of truth
5. The Remotion project structure must be clean and well-organized
6. If the user wants to skip narration (Step 6), proceed directly to Step 7
7. If the user wants a different TTS provider, adapt Step 6 accordingly
8. Never generate narration audio before visual approval (Step 3 complete)
9. Never skip visual verification - it prevents expensive re-work
10. Always default to 4K (3840x2160) unless the user specifies otherwise

---

## Supported video types

| Type | Duration | Scenes | Per Scene |
|---|---|---|---|
| Product demo | 30-120s | 6-15 | 5-10s |
| Explainer | 60-180s | 8-20 | 5-12s |
| Social clip | 15-60s | 3-8 | 3-8s |
| Announcement | 15-45s | 3-6 | 4-8s |

---

## Anti-patterns / common mistakes

| Anti-pattern | Why it fails | Correct approach |
|---|---|---|
| Generating narration before visual approval | Wastes money if visuals change | Complete Steps 1-4 first, then narration |
| Skipping the interview | Script lacks context, scenes feel generic | Ask 15-30 targeted questions |
| No YAML script file | No source of truth, timing drifts | Always generate `video-script.yaml` |
| Auto-advancing without approval | User loses control, re-work is expensive | Wait for explicit "approved" at each gate |
| Hardcoding values in Remotion | Cannot parametrize or reuse | Use Zod schemas for all configurable values |
| Rendering at 1080p by default | Cannot upscale later | Always default to 4K (3840x2160) |
| Building audio and visuals simultaneously | Makes iteration painful | Visual-first, audio after approval |

---

## Gotchas

1. **Frame count math matters.** 60 seconds at 30fps = 1800 frames exactly. If
   scene durations do not sum correctly, the video will be too short or too long.
   Always verify: `sum(scene.duration_seconds) == total_duration_seconds`.

2. **Remotion Studio needs a running dev server.** After building compositions,
   you must run `npx remotion studio` and tell the user to open
   `http://localhost:3000`. Do not assume they can preview without this.

3. **ElevenLabs narration durations are unpredictable.** A 5-second script line
   might produce 4.2s or 6.1s of audio. Always measure actual durations after
   generation and adjust frame counts accordingly.

4. **Volume ducking requires knowing narration timing.** The ducking curves for
   background music depend on knowing exactly when narration starts and stops in
   each scene. This is why Step 5 sets up ducking infrastructure but Step 6
   activates it.

5. **4K rendering is slow.** A 60-second video at 3840x2160 can take 10-30
   minutes depending on complexity. Warn the user about render time before
   starting, and suggest a 1080p test render first if they want a quick check.

---

## References

- `references/workflow-checklist.md` - Detailed checklist for each of the 7
  steps with sub-tasks, expected outputs, and approval criteria
- `references/project-templates.md` - Starter Remotion project structures for
  each video type with file trees and component scaffolds
- `references/troubleshooting.md` - Common issues and fixes for Remotion
  rendering, audio sync, FFmpeg, ElevenLabs API, and performance

---

## Companion check

> On first activation of this skill in a conversation: check which companion skills are installed by running `ls ~/.claude/skills/ ~/.agent/skills/ ~/.agents/skills/ .claude/skills/ .agent/skills/ .agents/skills/ 2>/dev/null`. Compare the results against the `recommended_skills` field in this file's frontmatter. For any that are missing, mention them once and offer to install:
> ```
> npx skills add AbsolutelySkilled/AbsolutelySkilled --skill <name>
> ```
> Skip entirely if `recommended_skills` is empty or all companions are already installed.
