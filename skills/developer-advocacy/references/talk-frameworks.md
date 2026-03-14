<!-- Part of the developer-advocacy AbsolutelySkilled skill. Load this file when
     working with conference talks, presentation structure, or slide design. -->

# Talk Frameworks for Developer Audiences

## Talk archetypes

Choose one archetype per talk. Mixing them creates confusion.

### 1. The "How I Built X" talk

**Structure**: Problem -> failed attempts -> working solution -> lessons learned.
**Best for**: Mid-level audiences who want real-world war stories.
**Length**: 25-40 minutes.

```
[0:00-3:00]  What I was trying to build and why
[3:00-8:00]  First approach - what went wrong (show real code/errors)
[8:00-20:00] The approach that worked (live demo or walkthrough)
[20:00-25:00] What I'd do differently + key takeaways
```

### 2. The "Deep Dive" talk

**Structure**: Surface behavior -> internal mechanics -> implications for your code.
**Best for**: Advanced audiences who already use the technology.
**Length**: 30-45 minutes.

```
[0:00-5:00]  "You probably use X every day - but do you know how it works?"
[5:00-25:00] Walk through internals (diagrams, source code, benchmarks)
[25:00-35:00] Practical implications - what to do/avoid based on this knowledge
```

### 3. The "Getting Started" talk

**Structure**: Zero to working app in N minutes.
**Best for**: Beginners or new-to-the-tool audiences.
**Length**: 20-30 minutes (heavily demo-driven).

```
[0:00-3:00]  What this tool does (one sentence) + what we'll build
[3:00-20:00] Live demo - build the thing step by step
[20:00-25:00] Where to go from here (docs, community, next tutorial)
```

### 4. The "Lessons Learned" talk

**Structure**: N mistakes/insights from doing X at scale.
**Best for**: Any audience level; highly shareable format.
**Length**: 20-30 minutes.

```
[0:00-2:00]  Context - what we do and at what scale
[2:00-22:00] Lesson 1... Lesson N (3-5 minutes each, with concrete examples)
[22:00-25:00] Summary slide with all lessons as one-liners
```

### 5. The "Lightning Talk" (5-10 minutes)

**Structure**: One idea, one demo, one takeaway.
**Rules**: No more than 5 slides. One live demo or one code example. End with
a single URL the audience should visit.

---

## Storytelling techniques for technical talks

### The "before and after" pattern

Show the painful way first. Let the audience feel the friction. Then show the
better way. The contrast creates the "aha" moment that makes your talk memorable.

```
BAD:  "Here's how to use our caching library" (no motivation)
GOOD: "Here's a page that takes 4 seconds to load. [show slow load]
       Now let's add 3 lines of code. [add cache] Now it loads in 200ms."
```

### The "zoom in, zoom out" pattern

Start with the big picture (architecture diagram, user flow). Zoom into one
specific component. Go deep. Then zoom back out to show how the component fits
in the whole system. This gives the audience both context and depth.

### The "running example" pattern

Pick one realistic example at the start (e.g., a to-do app, an e-commerce
checkout, a notification system). Use that same example for every concept in the
talk. Switching examples mid-talk forces the audience to rebuild context.

### Handling Q&A

- Repeat every question into the microphone before answering
- "Great question - I don't know" is always acceptable; follow up afterward
- If a question would take > 2 minutes, offer to discuss after the talk
- Prepare 3-5 anticipated questions and have answers ready

---

## Slide design principles

### Text rules

- Maximum 6 words per bullet point
- Maximum 3 bullet points per slide
- Never put a paragraph on a slide - that's a speaker note
- Use the slide as a visual anchor; the words come from you

### Code on slides

- Maximum 10 lines of code per slide
- Highlight the 1-2 lines that matter with color or a box
- Use syntax highlighting with a dark background for readability
- Increase font size to at least 24pt for code

### Visual hierarchy

- One idea per slide
- Use full-bleed images when they add meaning (not stock photos)
- Diagrams > bullet points for showing relationships
- Animate builds: reveal one element at a time to control attention

### Slide count guidelines

| Talk length | Slide count | Pace |
|-------------|-------------|------|
| 5 min lightning | 5-8 | 1 per ~45 sec |
| 25 min standard | 20-30 | 1 per ~60 sec |
| 45 min deep dive | 35-50 | 1 per ~60 sec |

These counts include title, section dividers, and closing slides. Pure content
slides will be fewer.

---

## Pre-talk checklist

- [ ] Tested slides on the actual projector/display resolution
- [ ] All live demos work offline or with pre-cached responses
- [ ] Speaker notes are written (not full scripts - bullet points only)
- [ ] Backup plan exists if demo fails (screenshots, video, skip to next section)
- [ ] Practiced the talk out loud at least twice (not just in your head)
- [ ] Timed the talk - aim to finish 2-3 minutes early, not right on time
- [ ] Water bottle on stage
- [ ] Slide clicker batteries checked
- [ ] Phone on silent, laptop notifications disabled

---

## Recording and repurposing talks

Every talk should be repurposed into at least two other content formats:

1. **Talk -> Blog post**: Transcribe key points, add code blocks, publish
2. **Talk -> Short video clips**: Cut 1-2 minute segments for social media
3. **Talk -> Tutorial**: Expand the demo into a step-by-step written guide
4. **Talk -> Thread**: Summarize the 5 key points as a Twitter/X thread

Always ask the conference for recording permission and a copy of the video.
Self-record with a phone as a backup.
