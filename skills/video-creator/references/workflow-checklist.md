# Video Creator - Workflow Checklist

Detailed checklist for each of the 7 steps with sub-tasks, expected outputs,
and approval criteria.

---

## Step 1: Deep Interview

### Sub-tasks
- [ ] Check if user provided a reference video
- [ ] If reference video exists, run video-analyzer skill first
- [ ] Ask about the product/subject (what it does, core value prop, key features)
- [ ] Ask about the target audience (who, technical level, pain points)
- [ ] Ask about video goals (CTA, where it will be published, success metrics)
- [ ] Ask about tone and style (playful vs professional, pace, energy)
- [ ] Ask about existing assets (logos, screenshots, brand colors, fonts)
- [ ] Ask about content priorities (must-include features, messaging hierarchy)
- [ ] Ask about visual preferences (animation style, reference videos, layout)
- [ ] Ask about duration and format (target length, platform constraints)
- [ ] Summarize context after every 5-8 questions
- [ ] Confirm with user that you have enough context

### Expected output
- Complete understanding of product, audience, goals, tone, assets, and
  visual direction documented in conversation history

### Approval criteria
- User explicitly confirms: "You have enough context" or equivalent

### Common mistakes at this step
- Dumping all questions at once instead of asking one at a time
- Not analyzing a reference video when the user provides one
- Proceeding with only 3-4 questions and guessing the rest
- Not summarizing periodically to confirm understanding

---

## Step 2: Generate Script (YAML)

### Sub-tasks
- [ ] Determine video type (product demo, explainer, social clip, announcement)
- [ ] Calculate total duration and scene count based on type
- [ ] Write scene-by-scene breakdown with narration text
- [ ] Calculate frame counts: `duration_seconds * 30 = frames`
- [ ] Verify total duration: `sum(scene.duration_seconds) == total_duration_seconds`
- [ ] Add visual descriptions for every scene
- [ ] Add animation notes for every scene
- [ ] Add music cues and SFX markers
- [ ] Add transition types between scenes
- [ ] Write `video-script.yaml` file
- [ ] Present full script to user for review
- [ ] Iterate on feedback until approved

### Expected output
- `video-script.yaml` file with complete scene breakdown

### Required YAML fields per scene
```yaml
- id: scene-XX
  title: string
  duration_seconds: number
  frames: number  # duration_seconds * 30
  narration: string
  visuals: string
  animation_notes: string
  music_cue: string
  sfx: string
  transition_out: string
```

### Approval criteria
- User explicitly approves the script
- All frame counts are mathematically correct
- Scene durations sum to total duration

---

## Step 3: Visual Verification

### Sub-tasks
- [ ] Initialize Remotion project if not already created
- [ ] Create composition files for each scene (visuals only)
- [ ] Implement animations described in script
- [ ] Set correct frame counts per composition
- [ ] Implement scene transitions
- [ ] Set resolution to 3840x2160
- [ ] Run `npx remotion studio`
- [ ] Tell user to preview at http://localhost:3000
- [ ] Collect visual feedback
- [ ] Iterate on feedback (colors, timing, animations, transitions)
- [ ] Get explicit visual approval

### Expected output
- Working Remotion project with visual-only compositions
- All scenes previewable in Remotion Studio

### Approval criteria
- User explicitly approves visuals: "Looks good" or equivalent
- No audio layer present yet (visual-only verification)

### What NOT to do at this step
- Do not add audio files or audio components
- Do not implement volume ducking
- Do not generate narration
- Do not render the final video

---

## Step 4: Build Full Remotion Project

### Sub-tasks
- [ ] Finalize all compositions with polished animations
- [ ] Extract shared components to `components/` directory
- [ ] Wire up scene-to-scene transitions in Root.tsx
- [ ] Add Zod schemas for parametrization
- [ ] Replace all magic numbers with schema props
- [ ] Verify frame counts match `video-script.yaml`
- [ ] Ensure project builds without errors: `npx remotion studio`
- [ ] Organize file structure cleanly

### Expected output
- Complete, well-organized Remotion project
- Clean component hierarchy
- Zod schemas for all configurable values

### File structure check
```
src/
  compositions/     # One file per scene
  components/       # Shared UI components
  Root.tsx          # Main composition wiring
  index.ts          # Entry point
video-script.yaml   # Source of truth
```

### Approval criteria
- Project builds without errors
- Visual output matches Step 3 approved visuals
- Code is clean and well-organized

---

## Step 5: Add Background Audio + SFX

### Sub-tasks
- [ ] Source background music (user-provided or from documented sources)
- [ ] Import music into Remotion project
- [ ] Set base music volume (0.3-0.5)
- [ ] Place SFX at trigger points from the script
- [ ] Set SFX volumes (0.5-0.8)
- [ ] Implement ducking infrastructure (volume curves)
- [ ] Configure ducking to lower music to 0.1-0.15 during narration segments
- [ ] Preview audio-visual sync in Remotion Studio
- [ ] Collect feedback on audio mix
- [ ] Iterate until approved

### Expected output
- Background music integrated with correct volume levels
- SFX placed at correct timestamps
- Ducking infrastructure ready for narration layer

### Approval criteria
- User approves audio-visual sync
- Music and SFX enhance rather than distract from visuals

---

## Step 6: Add Narration (Optional - costs money)

### Sub-tasks
- [ ] Confirm user wants narration (this step is skippable)
- [ ] Check for ElevenLabs API key
- [ ] If no key, guide through setup at https://elevenlabs.io
- [ ] Ask voice preference questions (gender, age, accent, energy, warmth)
- [ ] Confirm costs before making API calls
- [ ] Generate narration audio for each scene
- [ ] Measure actual audio durations
- [ ] Compare actual durations to script estimates
- [ ] Adjust frame counts if durations differ
- [ ] Update `video-script.yaml` with actual durations
- [ ] Sync narration with visual timing
- [ ] Activate volume ducking during narration segments
- [ ] Preview complete audio mix

### Expected output
- Narration audio files for each scene
- Updated `video-script.yaml` with actual durations
- Complete audio mix (music + SFX + narration with ducking)

### Approval criteria
- User approves narration quality and sync
- OR user explicitly skips this step

---

## Step 7: Final Preview + 4K Render

### Sub-tasks
- [ ] Launch full preview in Remotion Studio
- [ ] Tell user to review complete video
- [ ] Get final approval
- [ ] Ask about output format preference (MP4/H.264, ProRes, WebM)
- [ ] Run 4K render command
- [ ] Verify output file exists and has expected duration
- [ ] Report file size and location to user

### Render command
```bash
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160
```

### Expected output
- Rendered video file at 3840x2160

### Approval criteria
- User confirms final video is acceptable
- Output file plays correctly

---

## Quick Reference: Step Dependencies

```
Step 1 (Interview)
  |
  v
Step 2 (Script YAML)
  |
  v
Step 3 (Visual Verification)  <-- APPROVAL GATE: visuals locked
  |
  v
Step 4 (Full Remotion Build)
  |
  v
Step 5 (Audio + SFX)
  |
  v
Step 6 (Narration) [OPTIONAL]  <-- APPROVAL GATE: costs money
  |
  v
Step 7 (Final Render)
```
