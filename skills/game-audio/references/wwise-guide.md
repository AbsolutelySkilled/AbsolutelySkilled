<!-- Part of the game-audio AbsolutelySkilled skill. Load this file when
     working with Audiokinetic Wwise setup, SoundBanks, RTPCs, or integration. -->

# Wwise Guide

Comprehensive reference for Audiokinetic Wwise integration in game projects,
covering project structure, SoundBank workflow, RTPC, states, switches, and
engine integration.

---

## Installation and setup

### Unity integration

1. Install the Wwise Unity Integration from the Audiokinetic Launcher
2. The launcher installs the plugin and creates a `WwiseProject` folder
3. In Unity: Wwise > Wwise Settings, configure platform targets
4. Generate SoundBanks from the Wwise Authoring Tool before running
5. SoundBanks are placed in `Assets/StreamingAssets/Audio/GeneratedSoundBanks/`

### Unreal Engine integration

1. Wwise has a built-in Unreal integration - install via Audiokinetic Launcher
2. Set the Wwise Project path in Project Settings > Wwise
3. Use AkComponent and AkAmbientSound actors for 3D sources
4. SoundBanks auto-generate during build (or manually via Wwise Picker)

---

## Core Wwise concepts

### Object hierarchy

```
Project
  |- Actor-Mixer Hierarchy    (sound design: SFX, Foley, ambience)
  |    |- Work Units
  |         |- Actor-Mixers   (logical grouping)
  |              |- Random Containers
  |              |- Sequence Containers
  |              |- Switch Containers
  |              |- Blend Containers
  |              |- Sounds
  |- Interactive Music Hierarchy  (adaptive music)
  |    |- Music Switch Containers
  |    |- Music Playlist Containers
  |    |- Music Segments
  |- Events                   (triggers fired from code)
  |- Game Syncs               (RTPCs, states, switches, triggers)
  |- SoundBanks               (compiled output for runtime)
  |- Busses                   (mixing hierarchy)
```

### Container types

| Container | Purpose | Example |
|---|---|---|
| Random | Play a random child each trigger | Footstep variations |
| Sequence | Play children in order | Dialogue lines, reload sequence |
| Switch | Select child based on a game switch | Surface material for footsteps |
| Blend | Crossfade between children based on RTPC | Wind intensity (calm to storm) |
| Music Switch | Transition between music states | Combat vs exploration music |
| Music Playlist | Sequence music segments with transitions | Level soundtrack |

### Events

Events are the bridge between game code and audio content. An event contains
one or more actions:

| Action | Description |
|---|---|
| Play | Start playing a sound object |
| Stop | Stop a playing sound |
| Pause / Resume | Pause/resume playback |
| Set Switch | Change a switch value |
| Set State | Change a state value |
| Set Game Parameter | Change an RTPC value |

---

## Game Syncs

### RTPC (Real-Time Parameter Control)

RTPCs are continuous parameters that modulate sound properties in real time.

```
Common RTPCs:
  - Health (0-100) -> drives music intensity, heartbeat volume
  - Speed (0-300) -> drives engine pitch, wind volume
  - Distance (auto) -> built-in distance attenuation
  - TimeOfDay (0-24) -> ambient sound blend
```

Map RTPC values to properties:
1. In the sound's Property Editor, right-click a property (Volume, Pitch, LPF)
2. Add RTPC binding
3. Draw a curve mapping RTPC input range to property output range

### States

States are discrete, game-wide modes. Only one state per state group is active.

```
State Groups:
  - PlayerState: Alive, Dead, Spectating
  - Location: Indoor, Outdoor, Underwater, Cave
  - GamePhase: Menu, Gameplay, Cutscene, Paused
```

When a state changes, all sounds with state-based property overrides transition
smoothly (configurable transition time per state group).

### Switches

Switches are per-object selectors (unlike states which are global).

```
Switch Groups:
  - Surface: Concrete, Wood, Metal, Grass, Water
  - WeaponType: Pistol, Rifle, Shotgun, Melee
  - EnemyType: Zombie, Robot, Human
```

Switch Containers select which child to play based on the current switch value.

---

## SoundBank workflow

SoundBanks are the compiled audio packages loaded at runtime.

### Bank organization strategy

| Bank | Contents | Load timing |
|---|---|---|
| Init.bnk | Engine initialization data | Game startup (always first) |
| Common.bnk | UI sounds, player sounds, global events | Game startup |
| Music_Exploration.bnk | Exploration music | When entering exploration |
| Music_Combat.bnk | Combat music | When combat begins or level loads |
| Level_Forest.bnk | Forest-specific ambience and SFX | Scene load |
| VO_English.bnk | English voice-over | Based on language setting |

### Code integration

```csharp
// Unity + Wwise example

// Post an event (fire and forget)
AkSoundEngine.PostEvent("Play_Footstep", gameObject);

// Post an event with callback
AkSoundEngine.PostEvent("Play_Dialogue", gameObject,
    (uint)AkCallbackType.AK_EndOfEvent, DialogueEndCallback, null);

// Set RTPC value
AkSoundEngine.SetRTPCValue("Health", playerHealth, gameObject);

// Set global RTPC
AkSoundEngine.SetRTPCValue("TimeOfDay", currentHour);

// Set Switch (per game object)
AkSoundEngine.SetSwitch("Surface", "Wood", gameObject);

// Set State (global)
AkSoundEngine.SetState("Location", "Underwater");

// Load/unload banks
AkBankManager.LoadBank("Level_Forest");
AkBankManager.UnloadBank("Level_Forest");
```

### Unreal integration

```cpp
// Post event
UAkGameplayStatics::PostEvent(FootstepEvent, this, 0, FOnAkPostEventCallback());

// Set RTPC
UAkGameplayStatics::SetRTPCValue(nullptr, Health, 0, this, FString("Health"));

// Set Switch
UAkGameplayStatics::SetSwitch(SurfaceSwitchGroup, SurfaceSwitchValue, this);

// Set State
UAkGameplayStatics::SetState(LocationStateGroup, UnderwaterState);
```

---

## Adaptive music in Wwise

### Music Switch Container setup

1. Create a Music Switch Container
2. Assign a State Group or Switch Group (e.g., CombatState: Peaceful, Alert, Combat)
3. Add Music Playlist Containers as children - one per state
4. Each playlist contains Music Segments (the actual music chunks)
5. Define Transition Rules between states:
   - Transition at next bar, next beat, next marker, or immediate
   - Optional transition segment (stinger/bridge)
   - Fade-in/fade-out curves

### Transition matrix

```
              -> Peaceful  -> Alert    -> Combat
Peaceful:       N/A          Next Bar   Next Beat + Stinger
Alert:          Next Bar     N/A        Next Beat
Combat:         Next Bar     Next Bar   N/A
```

### Vertical layering in Wwise

1. Create a Music Segment with multiple tracks (layers)
2. Use States or RTPCs to control each track's volume
3. Example: drums layer fades in as RTPC "Intensity" rises above 0.5
4. All layers share the same tempo/time signature and stay synchronized

---

## Spatial audio in Wwise

Wwise Spatial Audio provides built-in room/portal simulation:

### Rooms and portals

```
Setup:
1. Define AkRoom volumes in your scene (box or mesh colliders)
2. Place AkPortal at doorways between rooms
3. Each room references a reverb aux bus
4. Wwise automatically routes audio through portals
   - Sound in adjacent room: audible through portal, with diffraction
   - Sound in distant room: attenuated based on portal chain
```

### Reflect plugin

For real-time early reflections:
1. Enable Wwise Reflect on emitters that need reflections
2. Define geometry (walls, floors) using AkGeometry components
3. Reflect calculates early reflections based on actual scene geometry
4. CPU cost scales with geometry complexity - use simplified collision mesh

---

## Common pitfalls

| Issue | Cause | Fix |
|---|---|---|
| Init.bnk not found | Bank path misconfigured or not generated | Regenerate banks; verify StreamingAssets path |
| Event not found | Event not included in any SoundBank | Check SoundBank contents in Wwise; add event to bank |
| Sound plays from wrong position | Missing or stale AkGameObjectID | Ensure `gameObject` passed to PostEvent is correct |
| Memory overflow | Too many banks loaded simultaneously | Use per-scene bank loading; monitor with Wwise Profiler |
| Music transition sounds wrong | Transition rule misconfigured | Use Wwise Profiler to inspect transition; check rules |
| Switch not working | Switch set on wrong game object | Switches are per-object; verify the correct GameObject |
