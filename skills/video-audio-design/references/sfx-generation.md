# SFX Generation with FFmpeg

Comprehensive reference for generating sound effects programmatically using
FFmpeg's lavfi audio generators. Load this file when the task involves
creating custom SFX, building a sound library, or understanding FFmpeg
audio synthesis.

---

## FFmpeg Audio Generators

FFmpeg's lavfi (libavfilter virtual input) provides several audio sources
that can be combined to create sound effects without any input files:

| Generator | Description | Key Parameters |
|---|---|---|
| `sine` | Pure sine wave tone | frequency, duration |
| `anoisesrc` | White/pink/brown noise | duration, color, amplitude |
| `aevalsrc` | Custom math expressions | exprs, duration |
| `anullsrc` | Silence generator | duration, sample_rate |

---

## Basic SFX Recipes

### UI Sounds

```bash
# Click - short sine burst (good for buttons)
ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.05" \
  -af "afade=t=out:st=0.02:d=0.03" \
  -ar 44100 click.wav

# Soft click - lower frequency, gentler
ffmpeg -y -f lavfi -i "sine=frequency=500:duration=0.04" \
  -af "afade=t=out:st=0.01:d=0.03,lowpass=f=1000" \
  -ar 44100 soft-click.wav

# Toggle on - rising pitch
ffmpeg -y -f lavfi -i "aevalsrc=exprs=sin(2*PI*(600+400*t/0.1)*t):d=0.1" \
  -af "afade=t=out:st=0.05:d=0.05" \
  -ar 44100 toggle-on.wav

# Toggle off - falling pitch
ffmpeg -y -f lavfi -i "aevalsrc=exprs=sin(2*PI*(1000-400*t/0.1)*t):d=0.1" \
  -af "afade=t=out:st=0.05:d=0.05" \
  -ar 44100 toggle-off.wav

# Hover - subtle high-frequency blip
ffmpeg -y -f lavfi -i "sine=frequency=2000:duration=0.03" \
  -af "afade=t=in:d=0.01,afade=t=out:st=0.01:d=0.02,volume=0.3" \
  -ar 44100 hover.wav
```

### Keyboard and Typing

```bash
# Single keypress
ffmpeg -y -f lavfi -i "anoisesrc=d=0.08:c=white:a=0.3" \
  -af "highpass=f=2000,lowpass=f=8000,afade=t=out:st=0.04:d=0.04" \
  -ar 44100 type.wav

# Mechanical key - louder with more body
ffmpeg -y -f lavfi -i "anoisesrc=d=0.12:c=white:a=0.5" \
  -af "highpass=f=1000,lowpass=f=6000,afade=t=out:st=0.06:d=0.06" \
  -ar 44100 mech-key.wav

# Spacebar - deeper, longer
ffmpeg -y -f lavfi -i "anoisesrc=d=0.15:c=white:a=0.4" \
  -af "highpass=f=500,lowpass=f=3000,afade=t=out:st=0.08:d=0.07" \
  -ar 44100 spacebar.wav

# Enter key - satisfying thunk
ffmpeg -y -f lavfi -i "anoisesrc=d=0.18:c=brown:a=0.5" \
  -af "highpass=f=300,lowpass=f=2000,afade=t=out:st=0.08:d=0.1" \
  -ar 44100 enter.wav
```

### Transitions

```bash
# Whoosh - frequency sweep
ffmpeg -y -f lavfi -i "sine=frequency=200:duration=0.4" \
  -af "vibrato=f=8:d=0.5,afade=t=in:d=0.1,afade=t=out:st=0.2:d=0.2,lowpass=f=1000" \
  -ar 44100 whoosh.wav

# Swoosh - faster, higher pitch
ffmpeg -y -f lavfi -i "sine=frequency=300:duration=0.3" \
  -af "vibrato=f=12:d=0.8,afade=t=in:d=0.05,afade=t=out:st=0.15:d=0.15,bandpass=f=500:w=400" \
  -ar 44100 swoosh.wav

# Slide in - rising tone with noise
ffmpeg -y -f lavfi -i "aevalsrc=exprs=sin(2*PI*(100+800*t/0.3)*t)*0.3:d=0.3" \
  -af "afade=t=in:d=0.05,afade=t=out:st=0.2:d=0.1,lowpass=f=2000" \
  -ar 44100 slide-in.wav

# Slide out - falling tone
ffmpeg -y -f lavfi -i "aevalsrc=exprs=sin(2*PI*(900-800*t/0.3)*t)*0.3:d=0.3" \
  -af "afade=t=in:d=0.05,afade=t=out:st=0.2:d=0.1,lowpass=f=2000" \
  -ar 44100 slide-out.wav
```

### Notification Sounds

```bash
# Ding/chime - bell synthesis
ffmpeg -y -f lavfi -i "sine=frequency=1200:duration=0.6" \
  -af "afade=t=out:st=0.1:d=0.5,aecho=0.8:0.88:40:0.4" \
  -ar 44100 ding.wav

# Success - two-tone ascending
ffmpeg -y -f lavfi \
  -i "aevalsrc=exprs=sin(2*PI*800*t)*(t<0.15)+sin(2*PI*1200*t)*(t>=0.15):d=0.3" \
  -af "afade=t=out:st=0.15:d=0.15" \
  -ar 44100 success.wav

# Error - low buzzy tone
ffmpeg -y -f lavfi -i "sine=frequency=200:duration=0.4" \
  -af "vibrato=f=20:d=0.5,afade=t=out:st=0.2:d=0.2" \
  -ar 44100 error.wav

# Pop - impulse
ffmpeg -y -f lavfi -i "sine=frequency=400:duration=0.08" \
  -af "afade=t=out:st=0.02:d=0.06,lowpass=f=600" \
  -ar 44100 pop.wav

# Bubble pop - higher, rounder
ffmpeg -y -f lavfi -i "aevalsrc=exprs=sin(2*PI*(800-400*t/0.1)*t)*0.5:d=0.1" \
  -af "afade=t=out:st=0.04:d=0.06,lowpass=f=1500" \
  -ar 44100 bubble.wav
```

---

## Audio Filters Reference

Key FFmpeg audio filters used in SFX generation:

| Filter | Purpose | Example |
|---|---|---|
| `afade` | Fade in/out | `afade=t=out:st=0.1:d=0.2` |
| `lowpass` | Remove high frequencies | `lowpass=f=1000` |
| `highpass` | Remove low frequencies | `highpass=f=2000` |
| `bandpass` | Keep frequency range | `bandpass=f=500:w=200` |
| `vibrato` | Add pitch wobble | `vibrato=f=8:d=0.5` |
| `aecho` | Add echo/reverb | `aecho=0.8:0.88:40:0.4` |
| `volume` | Adjust volume | `volume=0.5` |
| `atempo` | Change speed | `atempo=1.5` |
| `areverse` | Reverse audio | `areverse` |
| `chorus` | Add richness | `chorus=0.5:0.9:50:0.4:0.25:2` |

Chain filters with commas: `-af "filter1,filter2,filter3"`

---

## Building a Reusable SFX Library

Create a build script that generates all SFX in one pass:

```typescript
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface SfxDefinition {
  name: string;
  command: string;
}

const SFX_LIBRARY: SfxDefinition[] = [
  {
    name: 'click',
    command: '-f lavfi -i "sine=frequency=800:duration=0.05" -af "afade=t=out:st=0.02:d=0.03"',
  },
  {
    name: 'type',
    command: '-f lavfi -i "anoisesrc=d=0.08:c=white:a=0.3" -af "highpass=f=2000,lowpass=f=8000,afade=t=out:st=0.04:d=0.04"',
  },
  {
    name: 'whoosh',
    command: '-f lavfi -i "sine=frequency=200:duration=0.4" -af "vibrato=f=8:d=0.5,afade=t=in:d=0.1,afade=t=out:st=0.2:d=0.2,lowpass=f=1000"',
  },
  {
    name: 'ding',
    command: '-f lavfi -i "sine=frequency=1200:duration=0.6" -af "afade=t=out:st=0.1:d=0.5,aecho=0.8:0.88:40:0.4"',
  },
  {
    name: 'pop',
    command: '-f lavfi -i "sine=frequency=400:duration=0.08" -af "afade=t=out:st=0.02:d=0.06,lowpass=f=600"',
  },
  {
    name: 'swoosh',
    command: '-f lavfi -i "sine=frequency=300:duration=0.3" -af "vibrato=f=12:d=0.8,afade=t=in:d=0.05,afade=t=out:st=0.15:d=0.15,bandpass=f=500:w=400"',
  },
  {
    name: 'success',
    command: '-f lavfi -i "aevalsrc=exprs=sin(2*PI*800*t)*(t<0.15)+sin(2*PI*1200*t)*(t>=0.15):d=0.3" -af "afade=t=out:st=0.15:d=0.15"',
  },
  {
    name: 'error',
    command: '-f lavfi -i "sine=frequency=200:duration=0.4" -af "vibrato=f=20:d=0.5,afade=t=out:st=0.2:d=0.2"',
  },
];

function buildSfxLibrary(outputDir: string): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const sfx of SFX_LIBRARY) {
    const outputPath = path.join(outputDir, `${sfx.name}.wav`);
    const cmd = `ffmpeg -y ${sfx.command} -ar 44100 "${outputPath}"`;

    try {
      execSync(cmd, { stdio: 'pipe' });
      console.log(`Generated: ${sfx.name}.wav`);
    } catch (error) {
      console.error(`Failed to generate ${sfx.name}:`, error);
    }
  }
}

// Run: buildSfxLibrary('./public/audio/sfx')
```

---

## Combining Multiple Generators

Layer two generators for richer sounds using FFmpeg's amix filter:

```bash
# Rich notification: sine + noise burst
ffmpeg -y \
  -f lavfi -i "sine=frequency=1000:duration=0.3" \
  -f lavfi -i "anoisesrc=d=0.05:c=white:a=0.2" \
  -filter_complex "[0]afade=t=out:st=0.1:d=0.2[a];[1]afade=t=out:st=0.02:d=0.03[b];[a][b]amix=inputs=2:duration=longest" \
  -ar 44100 rich-ding.wav

# Laser: two detuned sines
ffmpeg -y \
  -f lavfi -i "aevalsrc=exprs=sin(2*PI*(2000-1500*t/0.2)*t):d=0.2" \
  -f lavfi -i "aevalsrc=exprs=sin(2*PI*(2100-1600*t/0.2)*t)*0.5:d=0.2" \
  -filter_complex "[0][1]amix=inputs=2:duration=shortest" \
  -af "afade=t=out:st=0.1:d=0.1" \
  -ar 44100 laser.wav
```

---

## Converting SFX for Remotion

Remotion works best with specific audio formats. Convert generated WAV
files for optimal compatibility:

```bash
# WAV to MP3 (smaller file size for music)
ffmpeg -y -i input.wav -codec:a libmp3lame -b:a 192k output.mp3

# Ensure consistent sample rate
ffmpeg -y -i input.wav -ar 44100 -ac 2 output.wav

# Normalize volume to prevent clipping
ffmpeg -y -i input.wav -af "loudnorm=I=-16:LRA=11:TP=-1.5" output.wav

# Trim silence from start and end
ffmpeg -y -i input.wav \
  -af "silenceremove=start_periods=1:start_silence=0.01:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.01:start_threshold=-50dB,areverse" \
  output.wav
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| SFX sounds different on CI | Different FFmpeg version or defaults | Pin `-ar 44100 -sample_fmt s16` |
| Click sounds too harsh | High frequency, no envelope | Add `afade=t=out` and `lowpass` |
| Silence at start of WAV | Default encoder behavior | Use `silenceremove` filter |
| Playback too quiet in Remotion | WAV peaks low | Normalize with `loudnorm` filter |
| SFX not playing at all | Wrong file path | Use `staticFile()` with correct relative path |
