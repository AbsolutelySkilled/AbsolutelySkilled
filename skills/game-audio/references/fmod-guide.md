<!-- Part of the game-audio AbsolutelySkilled skill. Load this file when
     working with FMOD Studio setup, events, parameters, or C# integration. -->

# FMOD Studio Guide

Comprehensive reference for FMOD Studio integration in game projects, covering
project setup, event authoring, parameter automation, and runtime C# API usage.

---

## Installation and setup

### Unity integration

1. Download the FMOD for Unity plugin from fmod.com/unity
2. Import the `.unitypackage` into your Unity project
3. Go to FMOD > Edit Settings and set the Studio Project Path to your `.fsproj` file
4. Set the Build path to `Assets/StreamingAssets` (default)
5. Build banks in FMOD Studio (File > Build) before running in Unity

### Unreal Engine integration

1. Download the FMOD for Unreal plugin
2. Extract to `<Project>/Plugins/FMODStudio/`
3. In Project Settings > FMOD Studio, set the Studio Project Directory
4. Banks are built and loaded automatically with the plugin

### Bank management

Banks are the compiled audio containers that ship with your game:

- **Master Bank** - Always loaded; contains buses, VCAs, and global events
- **Master Bank.strings** - Contains event name-to-GUID mappings; required for path lookups
- **Level/scene banks** - Load per scene to manage memory
- **Dialogue banks** - Separate for localization

```csharp
// Loading a bank at runtime
FMODUnity.RuntimeManager.LoadBank("Level_Forest", true);

// Unloading when leaving the scene
FMODUnity.RuntimeManager.UnloadBank("Level_Forest");
```

---

## Event authoring in FMOD Studio

### Event types

| Type | Use case |
|---|---|
| 2D Event | UI sounds, music, narrator voice |
| 3D Event | In-world sounds that need spatialization |
| Spatializer (panner) | Controls how 3D events are placed in the stereo/surround field |
| Timeline | Sound placed on a timeline with automation lanes |
| Action Sheet | Logic-based sound design using parameters and conditions |

### Creating a basic SFX event

1. Right-click Events folder > New Event
2. Drag audio files onto the timeline
3. Set the event to 3D if it needs spatialization (Properties > Spatializer)
4. Configure attenuation: set min/max distance in the 3D panner
5. Assign to a bus (e.g., SFX/Player)

### Parameter types

| Parameter | Scope | Example |
|---|---|---|
| Event parameter (local) | Per-instance | "Speed" on a car engine event |
| Global parameter | Shared across all events | "TimeOfDay", "ThreatLevel" |
| Built-in: Distance | Automatic | Based on listener-to-source distance |
| Built-in: Direction | Automatic | Angle to source relative to listener |

### Multi Instrument (randomization)

For sound variation:
1. Add a Multi Instrument to the event timeline
2. Drag 3-5 variants into the playlist
3. Set Playlist Mode: Shuffle (avoids repeats)
4. Set Trigger Behavior: Sequential or Steal Oldest
5. Add pitch randomization: right-click timeline > Add Modulation > Pitch (-200 to +200 cents)
6. Add volume randomization: similar, -1 to +1 dB

---

## C# Runtime API

### Core patterns

```csharp
// One-shot: fire and forget (short SFX)
FMODUnity.RuntimeManager.PlayOneShot("event:/SFX/Explosion", transform.position);

// Persistent instance: looping sounds, music, or anything needing control
FMOD.Studio.EventInstance engineSound;

void Start()
{
    engineSound = FMODUnity.RuntimeManager.CreateInstance("event:/SFX/Engine");
    engineSound.start();
}

void Update()
{
    // Update 3D position
    engineSound.set3DAttributes(FMODUnity.RuntimeUtils.To3DAttributes(transform));

    // Update parameter
    engineSound.setParameterByName("RPM", currentRPM);
}

void OnDestroy()
{
    engineSound.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
    engineSound.release();
}
```

### Parameter control

```csharp
// Local parameter (on a specific event instance)
instance.setParameterByName("Health", playerHealth);

// Global parameter (affects all events listening to it)
FMODUnity.RuntimeManager.StudioSystem.setParameterByName("TimeOfDay", 0.75f);

// Get current value
instance.getParameterByName("Speed", out float value);
```

### Bus and VCA control

```csharp
// Get a bus reference
FMOD.Studio.Bus musicBus = FMODUnity.RuntimeManager.GetBus("bus:/Music");

// Set volume (0.0 to 1.0, linear scale)
musicBus.setVolume(0.5f);

// Mute/unmute
musicBus.setMute(true);

// Pause all sounds on a bus
musicBus.setPaused(true);

// VCA (Volume Control Automation) for player-facing sliders
FMOD.Studio.VCA masterVCA = FMODUnity.RuntimeManager.GetVCA("vca:/Master");
masterVCA.setVolume(settingsSliderValue);
```

### Snapshots

Snapshots are mix presets that blend in/out at runtime:

```csharp
// Activate a snapshot (e.g., underwater muffling)
FMOD.Studio.EventInstance underwaterSnapshot;

void EnterWater()
{
    underwaterSnapshot = FMODUnity.RuntimeManager.CreateInstance("snapshot:/Underwater");
    underwaterSnapshot.start();
}

void ExitWater()
{
    underwaterSnapshot.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
    underwaterSnapshot.release();
}
```

### Callback system

```csharp
// Listen for timeline markers (e.g., beat markers in music)
instance.setCallback(MusicCallback,
    FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_MARKER |
    FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_BEAT);

[AOT.MonoPInvokeCallback(typeof(FMOD.Studio.EVENT_CALLBACK))]
static FMOD.RESULT MusicCallback(
    FMOD.Studio.EVENT_CALLBACK_TYPE type,
    IntPtr instancePtr,
    IntPtr parameterPtr)
{
    if (type == FMOD.Studio.EVENT_CALLBACK_TYPE.TIMELINE_MARKER)
    {
        var marker = (FMOD.Studio.TIMELINE_MARKER_PROPERTIES)
            Marshal.PtrToStructure(parameterPtr,
                typeof(FMOD.Studio.TIMELINE_MARKER_PROPERTIES));
        Debug.Log($"Marker: {marker.name} at {marker.position}ms");
    }
    return FMOD.RESULT.OK;
}
```

---

## Common pitfalls

| Issue | Cause | Fix |
|---|---|---|
| No sound plays | Bank not loaded or event path typo | Check bank loading; verify path matches FMOD Studio |
| Sound plays but no 3D | Event not set to 3D, or 3D attributes not updated | Enable spatializer on event; call `set3DAttributes` every frame |
| Memory spike on scene load | Loading all banks at once | Use per-scene banks; load async |
| Sound continues after scene change | Instance not stopped/released | Always stop + release in OnDestroy |
| Clicking/popping on stop | Abrupt stop without fade | Use `STOP_MODE.ALLOWFADEOUT`; add AHDSR on event |
| GC allocation every frame | Creating strings for parameter names | Cache event paths and parameter IDs; use `setParameterByID` |

---

## Project organization best practices

```
FMOD Studio Project/
  Events/
    Music/
      Combat.fspro
      Exploration.fspro
    SFX/
      Player/
        Footstep.fspro
        Jump.fspro
      Weapons/
        Pistol_Fire.fspro
      Environment/
        Wind.fspro
    UI/
      Button_Click.fspro
    Voice/
      Narrator/
  Snapshots/
    Underwater
    PauseMenu
  Buses/
    Music
    SFX
    UI
    Voice
```

Name events with a clear hierarchy: `event:/SFX/Player/Footstep`. This maps
directly to the folder structure and makes code references self-documenting.
