# Video Creator - Troubleshooting

Common issues and fixes for Remotion rendering, audio sync, FFmpeg, ElevenLabs
API, and performance problems.

---

## Remotion Rendering Errors

### "Cannot find module" when running `npx remotion render`

**Cause:** Missing dependencies or incorrect import paths.

**Fix:**
```bash
# Install all dependencies
npm install

# Verify the entry point exists
ls src/index.ts

# Check for typos in imports
npx tsc --noEmit
```

### "Composition not found: Main"

**Cause:** The `Main` composition is not registered in Root.tsx or the id does
not match.

**Fix:**
- Verify Root.tsx exports a `<Composition id="Main" ... />` element
- Ensure `RemotionRoot` is registered in `src/index.ts`:
```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

### "durationInFrames must be a positive integer"

**Cause:** Frame count is zero, negative, or a float.

**Fix:**
- Check `video-script.yaml` - every scene must have `frames` as a positive
  integer
- Verify: `Math.round(duration_seconds * 30)` for each scene
- Total frames must equal sum of all scene frames

### White/blank frames at the end of the video

**Cause:** Total `durationInFrames` on the Main composition is larger than the
sum of all scene Sequences.

**Fix:**
- Calculate: `sum(scene.frames)` and set Main durationInFrames to that value
- Account for transition overlaps (crossfades reduce total frames)

### Render crashes with "JavaScript heap out of memory"

**Cause:** Large assets or complex compositions exceeding Node.js memory limit.

**Fix:**
```bash
# Increase memory limit
NODE_OPTIONS=--max-old-space-size=8192 npx remotion render \
  src/index.ts Main out/video.mp4 --width 3840 --height 2160

# Or reduce concurrency
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160 --concurrency 2
```

### "Could not find a browser" error

**Cause:** Remotion needs Chromium for rendering.

**Fix:**
```bash
npx remotion browser ensure
```

---

## Audio Sync Problems

### Music starts at wrong time

**Cause:** Audio `<Sequence>` `from` value does not match the intended start
frame.

**Fix:**
```tsx
// Music should start at frame 0 and span the entire video
<Sequence from={0} durationInFrames={totalFrames}>
  <Audio src={backgroundMusic} volume={0.3} />
</Sequence>
```

### SFX plays out of sync with visual event

**Cause:** The SFX `from` frame does not match the visual trigger frame.

**Fix:**
1. Identify the exact frame where the visual event occurs
2. Set the SFX Sequence `from` to that frame number
3. Preview in Remotion Studio to verify sync
```tsx
// Button click happens at frame 45 of Scene03 (frame 420 globally)
<Sequence from={420} durationInFrames={30}>
  <Audio src={clickSFX} volume={0.7} />
</Sequence>
```

### Audio continues after video ends

**Cause:** Audio file is longer than the remaining frames.

**Fix:**
- Set `durationInFrames` on the Audio Sequence to clip it
- Or use `endAt` prop on the `<Audio>` component

### Volume ducking is too aggressive / not enough

**Cause:** Ducking volume levels are wrong.

**Fix - recommended volume levels:**
```tsx
const musicVolume = (frame: number) => {
  // Check if narration is active at this frame
  const isNarrationActive = narrationSegments.some(
    (seg) => frame >= seg.startFrame && frame <= seg.endFrame
  );

  if (isNarrationActive) {
    return 0.12; // Duck to 12% during narration
  }
  return 0.4; // Normal level 40%
};

<Audio src={backgroundMusic} volume={musicVolume} />
```

### Audio pops/clicks at segment boundaries

**Cause:** Abrupt volume changes create audio artifacts.

**Fix:** Add a short fade (5-10 frames) at volume transition points:
```tsx
const musicVolume = (frame: number) => {
  const fadeFrames = 8; // ~0.27s fade
  // Use interpolate for smooth transitions instead of hard cuts
  // ...calculate smooth volume curve with ramps
};
```

---

## FFmpeg Issues

### "FFmpeg not found" on render

**Cause:** FFmpeg is not installed or not in PATH.

**Fix:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

### Render produces corrupt MP4

**Cause:** Interrupted render or incompatible codec settings.

**Fix:**
```bash
# Re-render with explicit codec
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160 --codec h264

# For ProRes output
npx remotion render src/index.ts Main out/video.mov \
  --width 3840 --height 2160 --codec prores --prores-profile 4444
```

### Output file is very large

**Cause:** No CRF (quality) setting or using ProRes unintentionally.

**Fix:**
```bash
# Set CRF for H.264 (lower = better quality, larger file)
# 18 = visually lossless, 23 = default, 28 = smaller file
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160 --crf 23
```

---

## ElevenLabs API Errors

### 401 Unauthorized

**Cause:** Invalid or missing API key.

**Fix:**
1. Verify key at https://elevenlabs.io/app/settings/api-keys
2. Set environment variable: `export ELEVEN_API_KEY=sk_...`
3. Check key has not expired or been revoked

### 429 Too Many Requests

**Cause:** Rate limit exceeded.

**Fix:**
- Wait 60 seconds and retry
- Process scenes sequentially, not in parallel
- Check your plan's rate limits at https://elevenlabs.io/app/subscription

### 400 Bad Request on text-to-speech

**Cause:** Text contains unsupported characters or exceeds length limit.

**Fix:**
- Remove special characters (emojis, unusual Unicode)
- Keep narration text under 5000 characters per request
- Split long narration into multiple API calls

### Generated audio has wrong voice

**Cause:** Using wrong voice_id.

**Fix:**
```bash
# List available voices
curl -H "xi-api-key: $ELEVEN_API_KEY" \
  https://api.elevenlabs.io/v1/voices

# Use the correct voice_id from the response
```

### Audio quality is poor / robotic

**Cause:** Using the wrong model or stability settings.

**Fix:**
- Use `eleven_multilingual_v2` model for best quality
- Adjust stability (0.3-0.5 for natural, 0.7-0.9 for consistent)
- Adjust similarity_boost (0.5-0.75 recommended)
```json
{
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.4,
    "similarity_boost": 0.65
  }
}
```

---

## Performance Problems

### Remotion Studio is very slow / laggy

**Cause:** 4K preview is too demanding for the machine.

**Fix:**
- Use the scale slider in Remotion Studio to preview at 50% or 25%
- Close other resource-heavy applications
- Preview individual scenes instead of the full Main composition

### Render takes extremely long (>30 min for 60s)

**Cause:** Complex compositions, large images, or low concurrency.

**Fix:**
```bash
# Increase concurrency (default is half your CPU cores)
npx remotion render src/index.ts Main out/video.mp4 \
  --width 3840 --height 2160 --concurrency 8

# Do a quick 1080p test render first
npx remotion render src/index.ts Main out/test.mp4 \
  --width 1920 --height 1080
```

### Images/screenshots appear blurry at 4K

**Cause:** Source images are too small for 4K resolution.

**Fix:**
- Use images at least 3840px wide for full-width backgrounds
- Screenshots should be taken at 2x or 3x Retina resolution
- Use SVG for logos and icons (scales infinitely)

### Spring animations look janky

**Cause:** Wrong spring config or fps mismatch.

**Fix:**
```tsx
// Use appropriate damping for smooth animation
const scale = spring({
  frame,
  fps: 30, // Must match composition fps
  config: {
    damping: 12,    // Higher = less bouncy
    stiffness: 100, // Higher = faster
    mass: 0.5,      // Lower = more responsive
  },
});
```

---

## Project Structure Issues

### Compositions don't appear in Remotion Studio

**Cause:** Root.tsx is not properly exporting compositions or not registered.

**Fix checklist:**
1. `src/index.ts` calls `registerRoot(RemotionRoot)`
2. `Root.tsx` exports a component that returns `<Composition>` elements
3. Each `<Composition>` has a unique `id`
4. No runtime errors in any imported component

### TypeScript errors block the build

**Cause:** Type mismatches in Remotion components.

**Fix:**
```bash
# Check for type errors
npx tsc --noEmit

# Common fix: ensure props match the Zod schema
# The schema type and component props must align
type Props = z.infer<typeof mySchema>;
const MyScene: React.FC<Props> = (props) => { ... };
```

### Hot reload not working in Remotion Studio

**Cause:** File watcher limit reached or wrong file being edited.

**Fix:**
```bash
# macOS: increase file watcher limit
echo kern.maxfiles=524288 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=524288 | sudo tee -a /etc/sysctl.conf

# Restart Remotion Studio after changes
# Ctrl+C then npx remotion studio
```
