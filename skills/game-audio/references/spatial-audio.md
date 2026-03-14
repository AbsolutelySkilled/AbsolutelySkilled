<!-- Part of the game-audio AbsolutelySkilled skill. Load this file when
     working with 3D audio, HRTF, spatialization, occlusion, or reverb zones. -->

# Spatial Audio

Deep reference for 3D audio systems in games - covering spatialization techniques,
HRTF rendering, distance attenuation, occlusion/obstruction, reverb zones, and
platform-specific considerations.

---

## Spatialization techniques

### Channel-based panning

The simplest approach: pan a mono source across a speaker layout (stereo, 5.1, 7.1).

- **Stereo**: left-right panning based on source angle relative to listener
- **Surround (5.1/7.1)**: VBAP (Vector Base Amplitude Panning) distributes sound
  across the nearest speaker pair
- **Pros**: Low CPU cost, compatible with all hardware
- **Cons**: Limited elevation perception, sweet-spot dependent

### HRTF (Head-Related Transfer Function)

HRTF simulates how sounds reach each ear differently based on direction, using
impulse responses measured from human heads:

- Provides full 3D perception including elevation (above/below)
- Essential for headphone users and VR/AR
- CPU cost per source: moderate (convolution with HRTF filters)

How HRTF works:
1. Determine azimuth and elevation angle from listener to source
2. Look up the corresponding HRTF pair (left ear, right ear) from a database
3. Convolve the mono source with each ear's impulse response
4. Output binaural stereo signal

HRTF databases:
- **SOFA format** - Standard for HRTF data interchange
- **Resonance Audio** (Google) - Built-in HRTF, free, Ambisonics-based
- **Steam Audio** (Valve) - Physics-based propagation + HRTF
- **Oculus Audio SDK** - Optimized for Meta Quest, personalized HRTF

<!-- VERIFY: Personalized HRTF via ear scanning is available on Meta Quest 3 but
     adoption and accuracy details may have changed since last check. -->

### Ambisonics

Ambisonics encodes a full spherical sound field independently of speaker layout:

- **First-order (4 channels)**: Adequate for ambient beds, skyboxes
- **Third-order (16 channels)**: Better localization, good for spatial music
- Decoded to any output format (stereo, surround, binaural) at the listener

Use case: encode complex ambient environments (forest, city) as an Ambisonic bed,
then decode to the player's output format. Individual point sources (gunshots,
footsteps) should use direct HRTF or panning, not Ambisonics.

---

## Distance attenuation

Distance attenuation controls how volume decreases as the listener moves away from
a source. Common curves:

| Curve | Formula | Use case |
|---|---|---|
| Linear | `1 - (d / maxDist)` | Simple, predictable, good for small scenes |
| Logarithmic (inverse) | `1 / (1 + k * d)` | Realistic for outdoor environments |
| Inverse square | `1 / (1 + k * d^2)` | Physically accurate (real-world sound) |
| Custom (spline) | Artist-defined curve | Most control, used in AAA productions |

### Attenuation parameters

- **Min distance**: Below this distance, volume is at maximum (no attenuation)
- **Max distance**: Beyond this, volume is zero (or at the curve's minimum)
- **Rolloff factor**: Steepness of the curve between min and max

Typical values:
- Footsteps: min 1m, max 15m
- Gunshots: min 3m, max 100m
- Ambient loops: min 5m, max 50m
- Music: no attenuation (2D)

---

## Occlusion and obstruction

### Definitions

- **Occlusion**: Source is fully behind geometry (no direct or reflected path).
  Apply both low-pass filter AND volume reduction.
- **Obstruction**: Geometry blocks direct path but reflected paths exist (e.g.,
  sound goes around a corner). Apply low-pass filter only; volume stays similar.

### Implementation approaches

**Raycast-based (common, CPU-friendly):**
1. Cast a ray from listener to source each frame
2. Count geometry hits along the path
3. Map hit count to an occlusion value (0.0 = clear, 1.0 = fully occluded)
4. Send occlusion value to audio middleware as a parameter
5. Middleware applies low-pass filter + volume curve based on value

```csharp
// Unity example
void UpdateOcclusion(Transform source, Transform listener)
{
    Vector3 direction = source.position - listener.position;
    float distance = direction.magnitude;
    int hits = Physics.RaycastNonAlloc(
        listener.position, direction.normalized,
        raycastBuffer, distance, occlusionLayerMask);

    float occlusion = Mathf.Clamp01(hits * 0.25f);

    // Send to FMOD
    eventInstance.setParameterByName("Occlusion", occlusion);

    // OR send to Wwise
    AkSoundEngine.SetObjectObstructionAndOcclusion(
        gameObject, AkSoundEngine.AK_INVALID_GAME_OBJECT,
        occlusion, 0f);
}
```

**Multi-ray (more accurate):**
- Cast 5-7 rays in a cone pattern from listener toward source
- Average the results for smoother occlusion transitions
- More CPU expensive but avoids binary pop between occluded/unoccluded

**Physics-based propagation (Steam Audio, Wwise Spatial Audio):**
- Full sound propagation simulation through geometry
- Handles diffraction (sound bending around edges), transmission through walls,
  and multi-path reflections
- Most realistic but highest CPU cost
- Best for VR or premium AAA titles

---

## Reverb zones

Reverb simulates how sound bounces within an enclosed space. In games, reverb is
applied per-zone:

### Zone setup pattern

1. Define zones as trigger volumes (box, sphere, or mesh collider)
2. Each zone has a reverb preset: room size, decay time, wet/dry mix
3. When the listener enters a zone, blend to that zone's reverb
4. Use auxiliary sends in FMOD/Wwise to route audio through reverb buses

### Common reverb presets

| Environment | Decay time | Pre-delay | Wet level | Character |
|---|---|---|---|---|
| Small room | 0.4-0.8s | 5ms | -10 dB | Tight, intimate |
| Large hall | 1.5-3.0s | 20ms | -6 dB | Spacious, cathedral |
| Cave | 2.0-4.0s | 30ms | -3 dB | Dark, echoing |
| Outdoor open | 0.1-0.3s | 0ms | -20 dB | Dry, minimal |
| Bathroom/tile | 0.8-1.5s | 5ms | -4 dB | Bright, reflective |
| Sewer/tunnel | 1.5-2.5s | 15ms | -5 dB | Metallic, resonant |

### Blending between zones

When transitioning between zones (e.g., walking from a cave into open air):
- Cross-fade between reverb sends over 0.5-1.0 seconds
- Use portal-based blending if available (Wwise Spatial Audio rooms/portals)
- Never hard-cut between reverb presets - it sounds unnatural

---

## Platform considerations

| Platform | Output | Recommended approach |
|---|---|---|
| PC (speakers) | Stereo/5.1/7.1 | Channel-based panning; HRTF optional for headphones |
| PC (headphones) | Binaural stereo | HRTF-based spatialization |
| Console (TV) | 5.1/7.1 Atmos | Channel-based or Dolby Atmos object audio |
| VR (Quest, PCVR) | Binaural stereo | HRTF mandatory; head tracking updates listener orientation |
| Mobile | Stereo (speakers/buds) | Simple panning; HRTF for earbuds if CPU allows |

### VR-specific considerations

- Update listener position AND orientation every frame from the HMD
- Use room-scale HRTF (accounts for near-field sources < 1m)
- Haptic feedback for bass frequencies (controller rumble) enhances immersion
- Budget: 20-30 spatialized sources max on mobile VR (Quest)

### Performance budgets

| Platform | Max simultaneous voices | HRTF sources | Budget |
|---|---|---|---|
| PC | 64-128 | 32-64 | 3-5% CPU |
| Console | 48-96 | 24-48 | 2-4% CPU |
| Mobile VR | 24-48 | 12-24 | 4-6% CPU |
| Mobile phone | 16-32 | 8-16 | 2-3% CPU |

---

## Troubleshooting spatial audio

| Symptom | Likely cause | Fix |
|---|---|---|
| Sound doesn't move when turning | Listener orientation not updating | Update listener rotation every frame |
| Sound is always centered | Source and listener at same position | Ensure 3D attributes are set from actual world positions |
| Sound pops when crossing zone boundary | Hard reverb switch | Implement crossfade between reverb zones |
| HRTF sounds "inside head" | Source too close; no externalization | Add slight reverb or early reflections to externalize |
| Elevation not perceived | Using panning instead of HRTF | Switch to HRTF-based spatialization for headphone users |
| Occlusion pops on/off | Single raycast binary result | Use multi-ray averaging or interpolate occlusion value over time |
