# Audio Mixing Patterns

Advanced audio mixing patterns for Remotion video compositions. Load this
file when the task requires multi-segment ducking, crossfades, volume
automation, or mastering techniques.

---

## Multi-Segment Ducking

When a video has multiple narration segments, the music must duck
independently for each one. Calculate a combined duck factor:

```tsx
import React from 'react';
import { Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';

interface NarrationSegment {
  src: string;
  startFrame: number;
  durationFrames: number;
}

function calculateDuckedVolume(
  frame: number,
  segments: NarrationSegment[],
  baseVolume: number,
  duckedVolume: number,
  rampFrames: number
): number {
  let duckFactor = 1.0;

  for (const seg of segments) {
    const segDuck = interpolate(
      frame,
      [
        seg.startFrame - rampFrames,
        seg.startFrame,
        seg.startFrame + seg.durationFrames,
        seg.startFrame + seg.durationFrames + rampFrames,
      ],
      [1, duckedVolume / baseVolume, duckedVolume / baseVolume, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    duckFactor = Math.min(duckFactor, segDuck);
  }

  return baseVolume * duckFactor;
}

const MultiSegmentMix: React.FC<{
  narrations: NarrationSegment[];
  musicSrc: string;
}> = ({ narrations, musicSrc }) => {
  const frame = useCurrentFrame();
  const musicVolume = calculateDuckedVolume(frame, narrations, 0.4, 0.15, 10);

  return (
    <>
      <Audio src={musicSrc} volume={musicVolume} loop />
      {narrations.map((seg, i) => (
        <Sequence key={i} from={seg.startFrame} durationInFrames={seg.durationFrames}>
          <Audio src={seg.src} volume={0.9} />
        </Sequence>
      ))}
    </>
  );
};

export default MultiSegmentMix;
```

---

## Crossfade Between Scenes

Smooth audio transitions between scenes using overlapping fade-out
and fade-in:

```tsx
import React from 'react';
import { Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';

interface SceneAudio {
  src: string;
  startFrame: number;
  durationFrames: number;
}

const CrossfadeAudio: React.FC<{
  scenes: SceneAudio[];
  crossfadeFrames: number;
}> = ({ scenes, crossfadeFrames }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {scenes.map((scene, i) => {
        const isFirst = i === 0;
        const isLast = i === scenes.length - 1;

        // Fade in at the start (except first scene)
        const fadeIn = isFirst
          ? 1
          : interpolate(
              frame,
              [scene.startFrame, scene.startFrame + crossfadeFrames],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

        // Fade out at the end (except last scene)
        const endFrame = scene.startFrame + scene.durationFrames;
        const fadeOut = isLast
          ? 1
          : interpolate(
              frame,
              [endFrame - crossfadeFrames, endFrame],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

        const volume = 0.9 * fadeIn * fadeOut;

        return (
          <Sequence
            key={i}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
          >
            <Audio src={scene.src} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};

export default CrossfadeAudio;
```

---

## Volume Automation Curves

Create custom volume envelopes for music that respond to video content:

```tsx
import React from 'react';
import { Audio, useCurrentFrame, interpolate } from 'remotion';

interface VolumeKeyframe {
  frame: number;
  volume: number;
}

function volumeFromKeyframes(
  frame: number,
  keyframes: VolumeKeyframe[]
): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].volume;

  const frames = keyframes.map((k) => k.frame);
  const volumes = keyframes.map((k) => k.volume);

  return interpolate(frame, frames, volumes, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

const AutomatedMusic: React.FC<{
  musicSrc: string;
  keyframes: VolumeKeyframe[];
}> = ({ musicSrc, keyframes }) => {
  const frame = useCurrentFrame();
  const volume = volumeFromKeyframes(frame, keyframes);

  return <Audio src={musicSrc} volume={volume} loop />;
};

// Usage example:
// <AutomatedMusic
//   musicSrc={staticFile('audio/music/bg.mp3')}
//   keyframes={[
//     { frame: 0, volume: 0 },        // Start silent
//     { frame: 30, volume: 0.4 },     // Fade in over 1s
//     { frame: 90, volume: 0.15 },    // Duck for narration
//     { frame: 300, volume: 0.15 },   // Stay ducked
//     { frame: 310, volume: 0.4 },    // Restore after narration
//     { frame: 570, volume: 0.4 },    // Maintain level
//     { frame: 600, volume: 0 },      // Fade out at end
//   ]}
// />

export default AutomatedMusic;
```

---

## Intro and Outro Music Patterns

Add distinct music for intro and outro sections with smooth transitions:

```tsx
import React from 'react';
import {
  Audio,
  Sequence,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from 'remotion';

const IntroOutroMusic: React.FC<{
  introMusicSrc: string;
  mainMusicSrc: string;
  outroMusicSrc: string;
  introFrames: number;
  outroFrames: number;
}> = ({ introMusicSrc, mainMusicSrc, outroMusicSrc, introFrames, outroFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const outroStart = durationInFrames - outroFrames;
  const crossfade = 15;

  // Intro music: full volume then fade out
  const introVolume = interpolate(
    frame,
    [0, introFrames - crossfade, introFrames],
    [0.5, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Main music: fade in after intro, fade out before outro
  const mainVolume = interpolate(
    frame,
    [introFrames - crossfade, introFrames, outroStart - crossfade, outroStart],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Outro music: fade in at end
  const outroVolume = interpolate(
    frame,
    [outroStart - crossfade, outroStart, durationInFrames - 15, durationInFrames],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      <Sequence from={0} durationInFrames={introFrames}>
        <Audio src={introMusicSrc} volume={introVolume} />
      </Sequence>
      <Sequence from={introFrames - crossfade} durationInFrames={outroStart - introFrames + 2 * crossfade}>
        <Audio src={mainMusicSrc} volume={mainVolume} loop />
      </Sequence>
      <Sequence from={outroStart - crossfade} durationInFrames={outroFrames + crossfade}>
        <Audio src={outroMusicSrc} volume={outroVolume} />
      </Sequence>
    </>
  );
};

export default IntroOutroMusic;
```

---

## SFX Timing Patterns

Align sound effects with visual events using a declarative timeline:

```tsx
import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

interface SfxEvent {
  type: 'click' | 'whoosh' | 'ding' | 'pop' | 'type' | 'swoosh';
  frame: number;
  volume?: number;
}

const SFX_DURATION: Record<string, number> = {
  click: 3,
  whoosh: 12,
  ding: 18,
  pop: 3,
  type: 3,
  swoosh: 9,
};

const SfxTimeline: React.FC<{ events: SfxEvent[] }> = ({ events }) => {
  return (
    <>
      {events.map((event, i) => (
        <Sequence
          key={i}
          from={event.frame}
          durationInFrames={SFX_DURATION[event.type] || 10}
        >
          <Audio
            src={staticFile(`audio/sfx/${event.type}.wav`)}
            volume={event.volume ?? 0.4}
          />
        </Sequence>
      ))}
    </>
  );
};

// Usage:
// <SfxTimeline events={[
//   { type: 'whoosh', frame: 0 },      // Intro transition
//   { type: 'click', frame: 45 },      // Button press
//   { type: 'type', frame: 90 },       // Typing animation
//   { type: 'ding', frame: 200 },      // Success notification
//   { type: 'swoosh', frame: 350 },    // Scene transition
// ]} />

export default SfxTimeline;
```

---

## Final Mix Checklist

Before rendering the final video, verify the audio mix:

1. **Peak levels** - No individual frame should have combined volume > 1.0
2. **Narration clarity** - Play each narration segment with music and verify
   speech is clearly intelligible
3. **Duck timing** - Ramps should start before narration (pre-duck) so music
   is already low when speech begins
4. **SFX placement** - Every SFX should correspond to a visible action on
   screen. Remove any that feel random
5. **Silence gaps** - Brief silence (0.3-0.5s) between scenes feels natural.
   Continuous non-stop audio is fatiguing
6. **Fade in/out** - Video should start and end with audio fades, never
   abrupt silence-to-sound or sound-to-silence
7. **Consistent volume** - Narration volume should be uniform across all
   scenes. Variations feel like a bug

---

## Headroom and Limiting

Keep total volume under 1.0 to prevent digital clipping:

```typescript
function safeMixVolume(layers: number[]): number[] {
  const total = layers.reduce((sum, v) => sum + v, 0);
  if (total <= 1.0) return layers;

  // Scale all layers proportionally to fit under 1.0
  const headroom = 0.95; // Leave 5% headroom
  const scale = headroom / total;
  return layers.map((v) => v * scale);
}

// Example: three layers that would clip
const [narration, sfx, music] = safeMixVolume([0.9, 0.4, 0.4]);
// Result: [0.502, 0.223, 0.223] - total = 0.95
```

This is a safety net. Proper mixing should keep layers within budget
from the start using the volume reference table in the main skill file.
