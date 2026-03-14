<!-- Part of the Video Production AbsolutelySkilled skill. Load this file when
     working with video editing, cut types, pacing, or NLE software workflows. -->

# Editing Workflows

This reference covers editing techniques, cut types, pacing strategies, and
software-specific workflows for YouTube video production. The goal of every edit
decision is to serve retention - keeping the viewer engaged without drawing
attention to the editing itself.

---

## Cut types and when to use them

### Hard cut (straight cut)
The most basic cut - one clip ends, another begins. Use for:
- Removing mistakes, pauses, or filler ("um", "uh", dead air)
- Jumping between talking head segments
- Transitioning between clearly distinct topics

Rule: if the subject and background don't change, keep cuts tight (under 0.5s gap)
to maintain energy. Avoid leaving dead frames.

### Jump cut
A hard cut within the same shot that creates a visible "jump." Use for:
- Condensing a talking-head segment by removing pauses
- Creating a fast-paced, energetic feel (common in YouTube culture)
- Signaling "I'm getting to the point" to the viewer

Limit: more than 4-5 consecutive jump cuts without a visual break feels jarring.
Insert B-roll or a graphic every 3-4 jump cuts to reset.

### J-cut (audio leads video)
The audio from the next clip starts before the video transitions. Use for:
- Introducing a new topic while still showing the previous visual
- Creating smooth, professional transitions between segments
- Narration over B-roll where the speaker's voice leads into the next shot

This is the single most underused cut on YouTube. It makes edits feel cinematic
without any extra production cost.

### L-cut (video leads audio)
The video transitions to the next clip while audio from the previous clip
continues. Use for:
- Showing what the speaker is describing (screen recordings, product shots)
- Maintaining audio continuity while changing the visual
- Reaction shots where you show the result while still hearing the explanation

### Cutaway (B-roll insert)
Cut to supplementary footage while the main audio continues. Use for:
- Pattern interrupts every 30-60 seconds
- Illustrating what the speaker is describing
- Hiding jump cuts in the main footage
- Adding visual variety to talking-head content

Rule of thumb: B-roll inserts should be 3-8 seconds. Shorter feels choppy,
longer loses connection to the speaker.

### Match cut
A transition where the composition, movement, or subject in one shot matches
the next. Use for:
- Before/after reveals
- Thematic connections between different scenes
- High-production storytelling moments

Use sparingly - more than 1-2 per video makes them lose impact.

### Smash cut
An abrupt, jarring transition for comedic or dramatic effect. Use for:
- Humor (serious setup, absurd payoff)
- Contrast ("I thought it would be easy" - smash cut to chaos)
- Pattern interrupts at key moments

---

## Pacing map by video type

### Tutorial (10-15 min)

| Timestamp | Pacing | Shots per minute | Visual style |
|---|---|---|---|
| 0:00-0:30 | Fast | 8-12 | Mixed: face + B-roll + text |
| 0:30-2:00 | Medium | 4-6 | Talking head + graphics |
| 2:00-10:00 | Steady | 3-5 | Screen recording + face cutbacks |
| 10:00-end | Accelerating | 5-8 | Quick demo + results + face |

### Commentary / opinion (8-12 min)

| Timestamp | Pacing | Shots per minute | Visual style |
|---|---|---|---|
| 0:00-0:30 | Fast | 10-15 | Clips + text overlays |
| 0:30-2:00 | Medium-fast | 6-8 | Face + referenced clips |
| 2:00-8:00 | Variable | 4-8 | Face + B-roll + graphics |
| 8:00-end | Fast | 8-12 | Recap clips + energy finish |

### Vlog / story (10-20 min)

| Timestamp | Pacing | Shots per minute | Visual style |
|---|---|---|---|
| 0:00-0:30 | Fast montage | 10-15 | Highlight reel |
| 0:30-2:00 | Slow | 2-3 | Establishing shots + narration |
| 2:00-15:00 | Natural rhythm | 3-6 | Mixed footage, follows story |
| 15:00-end | Building | 5-10 | Climax + resolution |

---

## Audio editing essentials

Audio quality matters more than video quality. Follow this checklist:

1. **Noise reduction first** - Apply noise reduction/gate before any other
   audio processing. Remove background hum, AC noise, keyboard clicks.
2. **Normalize levels** - Target -6dB to -3dB peak for voice. This leaves
   headroom while being loud enough for mobile speakers.
3. **Compression** - Light compression (2:1 to 4:1 ratio) evens out volume
   differences between loud and quiet passages. Threshold around -18dB.
4. **EQ for clarity** - High-pass filter at 80-100Hz removes rumble. Gentle
   boost at 2-4kHz adds presence/clarity to voice.
5. **Music bed levels** - Background music should sit at -20dB to -25dB below
   voice. Viewers should feel the music, not consciously hear it.
6. **Ducking** - Automate music volume to dip when voice is present and rise
   during pauses or transitions.

---

## Software-specific workflows

### Adobe Premiere Pro

Recommended workflow order:
1. Import and organize in bins (by scene/topic, not file type)
2. Rough cut on main timeline - lay down all talking head footage
3. Remove dead air and mistakes (Ripple Delete: Shift+Delete)
4. Add B-roll on V2 track above main footage
5. Graphics and text on V3
6. Color correction with Lumetri (apply one look to adjustment layer)
7. Audio: Essential Sound panel for voice leveling, then manual adjustments
8. Export: H.264, match source resolution, target bitrate 16-20 Mbps for 1080p

Key shortcuts: Q (ripple trim start), W (ripple trim end), Shift+D (default
transition on selected edit point).

### DaVinci Resolve

Recommended workflow order:
1. Media page: import and organize into bins
2. Cut page: rough assembly (faster than Edit page for initial cuts)
3. Edit page: fine-tune timing, add B-roll, graphics
4. Fusion page: motion graphics and complex titles (if needed)
5. Fairlight page: audio mixing and noise reduction
6. Color page: color correction and grading (Resolve's strongest feature)
7. Deliver page: YouTube preset, H.264, 16-20 Mbps

DaVinci Resolve's free version covers 95% of YouTube editing needs.

### CapCut (desktop and mobile)

Best for: short-form content, quick edits, creators who want speed over control.
1. Import footage and auto-captions (CapCut's auto-caption is fast and accurate)
2. Trim and arrange clips on timeline
3. Add text overlays and stickers from built-in library
4. Apply transitions (use sparingly - CapCut's templates encourage overuse)
5. Export at 1080p for YouTube, 1080x1920 for Shorts

---

## Export settings for YouTube

| Setting | Recommended value |
|---|---|
| Codec | H.264 (AVC) or H.265 (HEVC) |
| Resolution | 1920x1080 (1080p) minimum, 3840x2160 (4K) if source supports |
| Frame rate | Match source (typically 24, 30, or 60 fps) |
| Bitrate (1080p) | 16-20 Mbps VBR |
| Bitrate (4K) | 35-45 Mbps VBR |
| Audio codec | AAC |
| Audio bitrate | 320 kbps stereo |
| Color space | Rec. 709 (standard) |

Upload the highest quality file you can. YouTube will re-encode it regardless -
starting with a high-quality source gives the best result after YouTube's
compression.

---

## Common editing mistakes

| Mistake | Fix |
|---|---|
| Leaving 0.5-1s of dead air between cuts | Trim clips so the next word starts within 1-2 frames of the previous clip ending |
| B-roll doesn't match narration timing | Align B-roll entry with the moment the speaker mentions the subject |
| Music volume competes with voice | Keep music at -20dB to -25dB below voice; use audio ducking |
| Same camera angle for entire video | Use at least 2 angles or supplement with B-roll every 30-60 seconds |
| Overusing transitions | Default to hard cuts; use transitions only for major section changes |
| Not color-matching multi-camera footage | Apply base color correction to match skin tones across all angles first |
