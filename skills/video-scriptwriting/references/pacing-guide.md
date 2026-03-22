# Pacing Guide

Deep-dive into pacing strategies for programmatic video scripts. Covers scene
duration distributions, hook techniques, CTA placement, rhythm patterns, and
type-specific guidance for maintaining viewer attention.

---

## The attention curve

Viewer attention follows a predictable pattern:

```
Attention
  ^
  |  *                           *
  | * *                         * *
  |*   *                       *   *
  |     *     *       *       *
  |      *   * *     * *     *
  |       * *   *   *   *   *
  |        *     * *     * *
  |               *       *
  +---------------------------------> Time
  Hook   Body          CTA  Outro
```

- **Seconds 0-3**: Peak attention - the hook must land here
- **Seconds 3-15**: Gradual decline - establish credibility quickly
- **Mid-video**: Lowest attention - use visual variety to re-engage
- **Pre-CTA**: Attention rises if content earned it - deliver the payoff
- **CTA**: Brief spike - viewer decides to act or leave
- **Outro**: Rapid drop - keep it short

Design your scene pacing to match this curve.

---

## Pacing by video type

### Product demo (30-120s)

**Goal**: Show the product doing its thing. Let the UI speak.

| Section | % of Duration | Purpose |
|---|---|---|
| Hook | 5-8% | Bold claim or question |
| Problem | 8-12% | Pain point the audience feels |
| Feature showcase | 50-60% | 3-5 features, each in its own scene |
| Social proof | 8-10% | Logos, numbers, testimonial |
| CTA | 8-12% | Clear action with URL |
| Outro | 5-8% | Logo and tagline |

**Scene duration range**: 5-10 seconds per scene

**Pacing rhythm**: Medium. Let each feature breathe but do not linger. Cut to
the next feature the moment the current one is understood.

**Example scene distribution for 60s demo**:
```
intro:       4s  (7%)
problem:     6s  (10%)
feature-1:   8s  (13%)
feature-2:   8s  (13%)
feature-3:   8s  (13%)
proof:       6s  (10%)
pricing:     8s  (13%)
cta:         6s  (10%)
outro:       6s  (10%)
```

### Explainer (60-180s)

**Goal**: Teach a concept. Move from problem to solution to benefit.

| Section | % of Duration | Purpose |
|---|---|---|
| Hook | 4-6% | Provocative question or surprising fact |
| Pain/Problem | 10-15% | Build empathy for the viewer's situation |
| Solution intro | 8-10% | Name the solution and its core promise |
| How it works | 30-40% | 3-5 steps, each clearly illustrated |
| Benefits | 10-15% | Concrete outcomes and improvements |
| Social proof | 5-10% | Credibility markers |
| CTA | 5-8% | Specific next step |
| Outro | 4-6% | Brand close |

**Scene duration range**: 5-12 seconds per scene

**Pacing rhythm**: Slower than demo. Give concepts time to land. Use visual
metaphors and animations to make abstract ideas concrete.

**Example scene distribution for 90s explainer**:
```
hook:           5s  (6%)
pain-point:    10s  (11%)
intro-solution: 8s  (9%)
how-1:         10s  (11%)
how-2:         10s  (11%)
how-3:         10s  (11%)
benefit-1:      7s  (8%)
benefit-2:      7s  (8%)
proof:          8s  (9%)
cta:            8s  (9%)
outro:          7s  (8%)
```

### Social clip (15-60s)

**Goal**: Stop the scroll. Deliver one idea fast. Drive action.

| Section | % of Duration | Purpose |
|---|---|---|
| Hook | 10-15% | Must grab in under 3 seconds |
| Core demo/message | 40-55% | Single feature or concept |
| Result/payoff | 20-25% | Show the outcome |
| CTA | 15-20% | Action with urgency |

**Scene duration range**: 3-8 seconds per scene

**Pacing rhythm**: Fast. Every frame earns its place. No filler, no breathing
room. Cut the moment understanding lands.

**Example scene distribution for 30s social clip**:
```
hook:    3s  (10%)
demo:   12s  (40%)
result:  8s  (27%)
cta:     7s  (23%)
```

### Announcement (15-45s)

**Goal**: Deliver news. Build excitement. Drive to learn more.

| Section | % of Duration | Purpose |
|---|---|---|
| Teaser | 10-15% | Build intrigue before the reveal |
| Reveal | 30-40% | The news itself with visual impact |
| Key detail | 20-25% | One supporting point |
| CTA | 15-20% | Where to learn more |

**Scene duration range**: 4-8 seconds per scene

**Pacing rhythm**: Build tension then release. The reveal scene should feel
like a moment - slightly longer than expected, with impactful animation.

---

## Hook techniques

The first 3 seconds determine whether a viewer stays. Use one of these proven
hook patterns:

### 1. The bold question
Open with a question the viewer wants answered.
```yaml
- id: hook
  duration: "3s"
  narration: "What if your code reviewed itself?"
  visual: "Question text animates word by word on dark background"
```

### 2. The surprising statistic
Lead with a number that challenges assumptions.
```yaml
- id: hook
  duration: "3s"
  narration: "Teams waste 12 hours a week on manual reports."
  visual: "Large number '12h' with clock animation draining"
```

### 3. The pain statement
Name the pain the viewer feels right now.
```yaml
- id: hook
  duration: "3s"
  narration: "Stop building dashboards from scratch."
  visual: "Bold text slams onto screen with impact animation"
```

### 4. The before/after flash
Show the transformation in a single shot.
```yaml
- id: hook
  duration: "4s"
  narration: ""
  visual: "Split screen: messy spreadsheet morphs into polished dashboard"
```

### 5. The demo tease
Show the product doing something impressive without explanation.
```yaml
- id: hook
  duration: "4s"
  narration: ""
  visual: "Quick montage of the product in action, 1-second cuts"
```

**Rule**: Text-heavy hooks work for social (viewers have sound off). Narration
hooks work for website embeds and presentations (sound on expected).

---

## CTA placement and design

### Placement rules

- **Always second-to-last or last scene** - never bury a CTA in the middle
- **Duration**: 5-8 seconds for demos/explainers, 3-5 seconds for social clips
- **Repeat the URL or action twice**: once in narration, once as on-screen text

### Effective CTA patterns

| Pattern | Example | Best for |
|---|---|---|
| Direct URL | "Try free at acme.dev" | Website-distributed videos |
| Action + benefit | "Sign up and build your first dashboard in 5 minutes" | Demos and explainers |
| Urgency | "Early access closes Friday" | Announcements |
| Social action | "Follow for more tips" | Social clips with series |

### CTA scene template

```yaml
- id: cta
  duration: "6s"
  frames: 180
  narration: "Start free at acme.dev. Your first dashboard takes five minutes."
  visual: "CTA text centered, URL prominent below, subtle animated background"
  animation: "text fades in over 20 frames, URL underline draws in at frame 40"
  music:
    track: "main-track"
    volume: 0.4
    duck: false
  sfx: []
  transition_to_next: "fade-to-black"
```

---

## Rhythm and scene variation

### The 3-beat pattern

Group scenes into sets of 3 with consistent internal rhythm:

```
Beat 1: Setup     (shorter scene, introduces the topic)
Beat 2: Develop   (longer scene, shows the detail)
Beat 3: Resolve   (medium scene, delivers the payoff)
```

Example for a feature showcase:
```
feature-intro:  4s  (setup: "Three ways Acme saves you time")
feature-1:      8s  (develop: first feature in detail)
feature-1-result: 5s (resolve: the outcome of using that feature)
```

### Visual variety checklist

Avoid visual monotony by varying these elements across scenes:

- **Layout**: Alternate between centered, left-aligned, and split-screen
- **Scale**: Mix wide shots (full UI) with close-ups (specific button or element)
- **Motion direction**: Alternate slide-from-left with slide-from-right
- **Color intensity**: Use accent colors sparingly - not every scene needs a pop

### Pacing variation

Do not make every scene the same length. Vary scene durations to create rhythm:

```
Good:  4s - 8s - 6s - 10s - 5s - 8s - 6s
Bad:   7s - 7s - 7s - 7s - 7s - 7s - 7s
```

Monotonous pacing feels like a slideshow. Variable pacing feels like a story.

---

## Scene duration calculations

### Words-to-duration formula

```
comfortable_duration = word_count / 2.5
maximum_duration     = word_count / 3.0
minimum_duration     = word_count / 2.0
```

| Words | Min Duration | Comfortable | Max Speed |
|---|---|---|---|
| 5 | 2.5s | 2.0s | 1.7s |
| 10 | 5.0s | 4.0s | 3.3s |
| 15 | 7.5s | 6.0s | 5.0s |
| 20 | 10.0s | 8.0s | 6.7s |
| 25 | 12.5s | 10.0s | 8.3s |

If a scene needs more words than its duration allows, split into two scenes.

### Transition time budget

Transitions consume real frames. Account for them:

| Transition | Typical Duration | Frames at 30fps |
|---|---|---|
| hard-cut | 0 frames | 0 |
| cross-dissolve | 15-30 frames | 15-30 |
| fade-to-black | 20-40 frames | 20-40 |
| wipe-left/right | 15-25 frames | 15-25 |

During a cross-dissolve, both scenes are partially visible. Plan visual
content so neither scene's key elements overlap with the other's during
the transition window.

---

## Common pacing mistakes

| Mistake | Impact | Fix |
|---|---|---|
| Every scene is 5 seconds | Feels mechanical, no rhythm | Vary between 3-10s based on content weight |
| 15-second scenes | Viewer disengages, feels like a lecture | Break into 2-3 shorter scenes |
| No pause after hook | Hook's impact is diluted immediately | Add 1-2 beat pause or visual-only scene |
| CTA shorter than 4 seconds | Viewer cannot read the URL or action | Give CTAs 5-8 seconds minimum |
| Outro longer than 7 seconds | Viewer has already left | Keep outro to 4-7 seconds |
| Front-loading all features | Mid-video sag with no content | Distribute features evenly with benefits between them |
