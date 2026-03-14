<!-- Part of the pixel-art-sprites AbsolutelySkilled skill. Load this file when
     working with sprite animation, walk cycles, attack animations, or advanced
     pixel animation techniques. -->

# Animation Techniques

Advanced sprite animation beyond basic frame sequencing. Covers the 12 principles
of animation adapted for pixel art constraints, common animation types with frame
breakdowns, and timing tables.

---

## The 12 principles adapted for pixel art

Not all classic animation principles apply at pixel scale. Here is what matters
and what to skip.

### Principles that matter at pixel scale

1. **Timing and spacing** - The most important principle. Frame count and duration
   per frame control whether motion feels snappy or sluggish. A 3-frame attack
   reads as fast. A 6-frame attack reads as heavy. Vary frame duration within an
   animation: hold key poses longer (150-200ms), transition frames shorter (80-100ms).

2. **Anticipation** - Before a big action, show a small reverse motion. Before a
   jump, the character crouches 1-2 pixels. Before a sword swing, the arm pulls
   back. Even 1 frame of anticipation makes actions feel intentional.

3. **Follow-through and overlapping action** - After the main action completes,
   secondary elements keep moving. Hair trails behind a dash. A cape settles after
   landing. At pixel scale, this means 1-2 extra frames where accessories or
   clothing catch up to the body.

4. **Squash and stretch** - At 16x16, you cannot literally squash a character.
   Instead, use 1-pixel height changes: compress 1px before a jump (squash),
   stretch 1px at peak height. Even this tiny change reads as weight and elasticity.

5. **Ease in / ease out** - Do not move at constant speed. Accelerate into an
   action (ease in) and decelerate out (ease out). Implement by having smaller
   pixel movements at the start and end, larger in the middle.

### Principles to deprioritize

- **Arcs** - Hard to achieve with 1-pixel movement resolution. Focus on straight paths.
- **Secondary action** - Useful but expensive in frame count. Reserve for hero animations.
- **Appeal** - Important in design phase, not animation phase.
- **Solid drawing** - Not applicable; pixel art is 2D by definition.

---

## Common animation types

### Idle animation (2-4 frames)

Purpose: show the character is alive when standing still.

```
Frame 1 (200ms): base pose
Frame 2 (200ms): slight bob - body shifts 1px down, or chest expands 1px
Frame 3 (200ms): return to base (can be same as frame 1)
Frame 4 (200ms): slight bob up, or blink (eyes close for 1 frame)
```

Keep idle subtle. Large idle movements make the character feel restless.

### Walk cycle (4-6 frames)

The 4-frame walk is the most common and efficient:

```
Frame 1 (120ms): Contact - right foot forward, left back, body at low point
Frame 2 (120ms): Passing - legs crossing under body, body at high point (+1px)
Frame 3 (120ms): Contact (mirror) - left foot forward, right back, body low
Frame 4 (120ms): Passing (mirror) - legs crossing, body high (+1px)
```

6-frame walk adds in-between frames for smoother motion:

```
Frame 1 (100ms): Right contact
Frame 2 (100ms): Right recoil (weight settling)
Frame 3 (100ms): Right passing
Frame 4 (100ms): Left contact
Frame 5 (100ms): Left recoil
Frame 6 (100ms): Left passing
```

**Critical rules:**
- Body bobs 1px up on passing, 1px down on contact (not more)
- Arms swing opposite to legs
- Total volume must stay constant - overlay all frames to verify

### Run cycle (6-8 frames)

Same key poses as walk but with added flight phase (both feet off ground):

```
Frame 1 (80ms):  Contact - front leg extended, back leg pushing off
Frame 2 (80ms):  Push-off - back leg drives body forward, body leans
Frame 3 (80ms):  Flight - both feet off ground, body at highest point (+2px)
Frame 4 (80ms):  Contact (mirror)
Frame 5 (80ms):  Push-off (mirror)
Frame 6 (80ms):  Flight (mirror)
```

Faster frame rate than walk (80ms vs 120ms). More exaggerated lean. Body rises 2px on flight (vs 1px walk bob).

### Attack animation (3-6 frames)

Three-phase structure: anticipation, action, recovery.

**Light attack (3 frames):**
```
Frame 1 (100ms): Anticipation - arm pulls back, body leans away from target
Frame 2 (60ms):  Strike - arm extends, weapon at full reach (shortest frame)
Frame 3 (120ms): Recovery - arm returns, body resets
```

**Heavy attack (6 frames):**
```
Frame 1 (150ms): Wind-up - weapon raised high, body coils (hold this long)
Frame 2 (80ms):  Transition - weapon starts moving
Frame 3 (40ms):  Impact - weapon at contact point (fastest frame)
Frame 4 (40ms):  Follow-through - weapon continues past target
Frame 5 (100ms): Settle - weapon slows
Frame 6 (120ms): Recovery - return to idle
```

**Key insight:** The strike/impact frame must be the shortest (40-60ms). The eye
fills in the motion. If you hold the impact frame too long, the attack feels slow.

### Jump animation (4-5 frames)

```
Frame 1 (100ms): Crouch (anticipation) - body compresses 1-2px
Frame 2 (80ms):  Launch - legs extend, body at ground level
Frame 3 (hold):  Airborne - arms up, legs tucked (loop this while in air)
Frame 4 (80ms):  Descend - legs extend downward
Frame 5 (120ms): Land - body compresses on impact (squash), dust particles optional
```

The airborne frame is held for variable duration based on jump height. Do not loop
multiple airborne frames - one held frame reads better than a cycling animation in midair.

### Death animation (4-6 frames)

```
Frame 1 (100ms): Hit reaction - body recoils in direction of hit
Frame 2 (100ms): Stagger - off-balance pose
Frame 3 (120ms): Collapse - body falling
Frame 4 (150ms): Grounded - flat on ground
Frame 5 (200ms): Fade or flash (if using death effect)
```

Hold the final frame longest. Slow the timing toward the end to create a sense of finality.

---

## Frame timing reference table

| Animation | Frames | ms/frame | Total duration | Loop |
|---|---|---|---|---|
| Idle | 2-4 | 150-250ms | 400-800ms | Yes |
| Walk | 4-6 | 100-150ms | 400-600ms | Yes |
| Run | 6-8 | 70-100ms | 420-600ms | Yes |
| Light attack | 3-4 | 40-120ms | 200-350ms | No |
| Heavy attack | 5-7 | 40-200ms | 400-700ms | No |
| Jump (grounded) | 4-5 | 80-120ms | 320-500ms | No |
| Death | 4-6 | 100-200ms | 500-900ms | No |
| Hit/flinch | 2-3 | 60-100ms | 120-250ms | No |

---

## Sub-pixel animation

Sub-pixel animation creates the illusion of movement smaller than 1 pixel by
shifting brightness between adjacent pixels.

### How it works

To move a white dot half a pixel right on a black background:

```
Frame 1:  [100%] [  0%]     - dot is on left pixel
Frame 2:  [ 50%] [ 50%]     - perceived position is between pixels
Frame 3:  [  0%] [100%]     - dot is on right pixel
```

The "50%" values use intermediate colors from the palette - not transparency.
This requires at least 3 brightness steps in the ramp.

### Where to use sub-pixel animation

- **Eyes:** blinking, looking left/right (2-3px eyes benefit enormously)
- **Water shimmer:** surface highlights that drift sub-pixel
- **Breathing:** chest or body that rises less than 1 full pixel
- **Floating objects:** gems, particles that hover with micro-movement

### Where NOT to use

- Movement that exceeds 1 pixel per frame (use real movement instead)
- Sprites that will be displayed at non-integer scales (sub-pixel breaks)
- Sprites smaller than 8x8 (not enough adjacent pixels to shift between)

---

## Onion skinning workflow

Onion skinning shows previous/next frames as transparent overlays while drawing.

1. Enable onion skin in your editor (Aseprite: View > Onion Skinning)
2. Set previous frames to blue tint, next frames to red tint
3. Show 1-2 frames in each direction (more than 2 creates visual clutter)
4. Draw the current frame, using the overlay to maintain volume consistency
5. Disable onion skin periodically and play the animation to check feel

---

## Animation export checklist

- [ ] All frames are the same canvas size (no frame is taller/wider than others)
- [ ] Background is transparent (or a consistent chroma key color)
- [ ] Frames are arranged in a grid (rows = states, columns = frames)
- [ ] No sub-pixel anti-aliasing on sprite edges (nearest-neighbor only)
- [ ] Frame timing data is documented (which frames hold longer)
- [ ] Animation loops cleanly (last frame transitions smoothly to first for looping anims)
- [ ] Tested at 1x, 2x, and target display scale
