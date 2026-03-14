<!-- Part of the game-audio AbsolutelySkilled skill. Load this file when
     working with adaptive music, dynamic soundtracks, music state machines,
     or transition design. -->

# Adaptive Music

Deep reference for designing and implementing music systems that respond to gameplay
in real time - covering horizontal re-sequencing, vertical layering, transition
design, and implementation in FMOD Studio and Wwise.

---

## Adaptive music techniques

### Vertical layering (additive)

All layers play simultaneously, synchronized to the same tempo. Individual layers
fade in/out based on game parameters.

```
Layer structure example (combat music):

Layer 1: Ambient pad          [always on, volume 0.7]
Layer 2: Rhythmic pulse       [on when tension > 0.2]
Layer 3: Percussion           [on when tension > 0.4]
Layer 4: Bass + drums         [on when tension > 0.6]
Layer 5: Full brass/strings   [on when tension > 0.8]
Layer 6: Choir + cymbals      [on at tension = 1.0]
```

Implementation rules:
- All layers must share the same BPM, key, and time signature
- Compose so any combination of active layers sounds good
- Fade transitions: 0.5-2.0 seconds depending on tempo
- Use RTPC or parameter to drive layer volumes (not on/off switching)

### Horizontal re-sequencing

Music is divided into segments (bars or phrases) that can be rearranged in real time.
The system picks the next segment based on game state.

```
Segment pool:
  [Intro] -> [Explore_A] -> [Explore_B] -> [Explore_C]
                                              |
                                        [Transition_ToCombat]
                                              |
                            [Combat_A] -> [Combat_B] -> [Combat_Loop]
                                              |
                                        [Transition_ToExplore]
                                              |
                                        [Explore_A] (loop back)
```

Rules:
- Segments must start and end on musically compatible boundaries (bar lines)
- Transitions between segments happen at defined sync points (next bar, next beat)
- Each segment should be self-contained enough to loop if the state doesn't change

### Stingers and transition segments

Short musical phrases (1-4 bars) that play during state changes to smooth transitions:

| Stinger type | Duration | Trigger |
|---|---|---|
| Discovery | 2-4 bars | Finding an item, entering new area |
| Danger | 1-2 bars | Enemy spotted, trap triggered |
| Victory | 4-8 bars | Boss defeated, level complete |
| Death | 2-4 bars | Player dies |
| Transition bridge | 2-4 bars | Between musical states (explore -> combat) |

Stingers typically override or layer on top of the current music, then fade back
to the new state's music.

### Branching

Pre-authored alternate paths at decision points. Most common in narrative games:

```
                    [Verse 1]
                    /        \
           [Happy Chorus]  [Dark Chorus]
                    \        /
                    [Verse 2]
```

The branch is selected by a game parameter or state at the decision point.
Less flexible than layering but allows for more compositionally complex transitions.

---

## Music state machine design

Most games use a state machine to drive adaptive music:

### Example: action-adventure game

```
States:
  MENU        -> ambient pad, no gameplay music
  EXPLORE     -> exploration theme, low intensity
  ALERT       -> tense variation, percussion enters
  COMBAT      -> full combat music, all layers
  BOSS        -> unique boss theme
  VICTORY     -> victory stinger, fade to explore
  DEATH       -> death stinger, silence, respawn into explore
  CUTSCENE    -> scripted music, external control

Transitions:
  EXPLORE -> ALERT:   Fade over 2 bars, add percussion layer
  ALERT -> COMBAT:    Stinger + cut to combat at next bar
  COMBAT -> EXPLORE:  Combat winds down over 4 bars, stinger, crossfade
  COMBAT -> BOSS:     Immediate transition with boss intro stinger
  BOSS -> VICTORY:    Victory stinger overlays, fade boss music
  * -> CUTSCENE:      Duck gameplay music, crossfade to cutscene track
  CUTSCENE -> *:      Crossfade back to appropriate state music
```

### Cooldown and hysteresis

Prevent rapid music flickering when game state oscillates:

- **Cooldown timer**: After entering a state, stay for minimum 4-8 seconds before
  allowing transition to a lower-intensity state
- **Hysteresis**: Use different thresholds for entering vs leaving a state.
  Example: enter COMBAT at threat > 0.7, leave COMBAT at threat < 0.3
- **Transition queue**: If a transition is requested while another is in progress,
  queue it. Don't interrupt transitions.

---

## Implementation in FMOD Studio

### Vertical layering setup

1. Create a Music Event
2. Add multiple Audio Tracks (one per layer)
3. Place audio on each track, all synchronized to the same timeline
4. Create a local parameter (e.g., "Intensity", 0.0 to 1.0)
5. Add volume automation on each track driven by the parameter:
   - Track 1 (pad): constant volume
   - Track 2 (perc): automate from silent to full between 0.2-0.3
   - Track 3 (bass): automate between 0.4-0.5
   - (continue for each layer)
6. Set the event to loop (add a loop region on the timeline)

### Horizontal re-sequencing setup

1. Create a Music Event
2. Add a Logic Track with transition markers
3. Use Transition Regions and Destinations:
   - Add named destination markers at each segment start
   - Create transition conditions tied to parameters
4. Alternative: use the Multi Instrument + parameter-driven playlist

### Stinger implementation

1. Create a separate one-shot event for each stinger
2. Use FMOD's callback system to time the stinger to the next beat/bar:

```csharp
// Quantize stinger to next beat
musicInstance.getTimelinePosition(out int position);
int beatLength = 60000 / bpm; // ms per beat
int nextBeat = ((position / beatLength) + 1) * beatLength;
int delay = nextBeat - position;

// Schedule stinger
StartCoroutine(PlayStingerAfterDelay("event:/Music/Stinger_Combat", delay));
```

---

## Implementation in Wwise

### Music Switch Container

1. Create a Music Switch Container
2. Associate it with a State Group (e.g., MusicState: Explore, Combat, Boss)
3. Add child Music Playlist Containers - one per state
4. Each playlist contains Music Segments and defines playback order
5. Open the Transition Editor to define rules between states

### Transition rules in Wwise

In the Music Switch Container's Transition Editor:

| From | To | Rule |
|---|---|---|
| Explore | Combat | Exit at next bar, play transition segment, enter at start |
| Combat | Explore | Exit at next bar, 2-bar fade out, enter at start |
| Any | Boss | Exit immediate, play boss intro stinger, enter at start |
| Boss | Victory | Exit at next bar, play victory stinger |

### Vertical layering in Wwise

1. Create a Music Segment with multiple tracks
2. Each track represents a layer
3. Use RTPC to control each track's volume
4. Or use States with volume overrides per track:
   - Low intensity state: tracks 1-2 at 0 dB, tracks 3-5 at -96 dB
   - High intensity state: all tracks at 0 dB
   - Define transition time between states (1-2 seconds)

---

## Composition guidelines for adaptive music

### General rules

- **Compose in layers from the start** - Don't write a finished piece and try to
  split it later. Each layer must function independently.
- **Avoid strong melodic hooks in optional layers** - If a melody might not play,
  don't make it the centerpiece. Put catchy melodies in the always-on base layer.
- **Match energy levels to game states** - Map your musical intensity scale (1-10)
  to your game's intensity scale.
- **Key and tempo consistency** - All layers and segments in a music system should
  share the same key (or compatible keys) and tempo.

### Tempo and sync

- Lock all layers to the same BPM grid
- Typical tempos: exploration 80-100 BPM, combat 120-160 BPM
- If switching between tempos, use transition segments that ritardando/accelerando
- Quantize all transitions to bar boundaries (not beat) for smoother results

### Loop points

- Music segments should loop seamlessly - match the waveform at loop boundaries
- Place loop points at bar lines, never mid-beat
- Test loops by listening for 5+ repetitions - subtle clicks or rhythmic bumps
  become obvious after several repeats
- Export loops with a brief tail (100-200ms) for crossfade if needed

---

## Testing adaptive music

### Manual testing checklist

- [ ] Each music state sounds good on its own (no missing layers)
- [ ] Transitions between adjacent states are smooth
- [ ] Transitions between non-adjacent states work (e.g., straight from EXPLORE to BOSS)
- [ ] Rapid state changes don't cause audio glitches or overlapping music
- [ ] Hysteresis/cooldown prevents flickering at state boundaries
- [ ] Stingers align to the beat grid
- [ ] Music loops are seamless after 5+ repetitions
- [ ] Volume levels are consistent across all states (no sudden jumps)

### Profiler monitoring

In FMOD Studio or Wwise Profiler:
- Monitor voice count during music playback (should stay under budget)
- Check CPU usage of music events (streaming vs memory)
- Verify transitions fire at expected sync points
- Inspect parameter values match expected game state

---

## Common pitfalls

| Mistake | Impact | Fix |
|---|---|---|
| Layers not synchronized | Music sounds out of time | Ensure all layers share the same BPM and start point |
| No transition segments | Jarring cuts between states | Compose 2-4 bar bridge segments for major transitions |
| Music reacts too fast | Flickering between states feels chaotic | Add hysteresis and cooldown timers |
| All layers always audible | No dynamic range; combat doesn't feel different from exploration | Reserve 40-60% of layers for high-intensity states only |
| Hard volume cuts | Audible pops and clicks | Always fade over 0.5-2 seconds; never set volume to 0 instantly |
| Ignoring memory for music | Music streams compete with SFX for bandwidth | Stream music from disk; limit to 2-3 simultaneous music streams |
