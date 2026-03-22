# Interview Questions Framework

Complete 30-question interview framework for gathering video requirements before
writing a programmatic video script. Questions are organized by category with
follow-up trees and interpretation guidance.

---

## How to run the interview

1. Ask one category at a time, in order
2. Wait for answers before proceeding to the next category
3. Summarize each category's answers before moving on
4. Skip categories that are irrelevant (e.g., Assets for concept-only scripts)
5. Total interview should take 10-15 minutes
6. After all categories, produce a structured brief for confirmation

---

## Category 1: Product/Subject (5-7 questions)

### Core questions

1. **What is the product, tool, or subject of this video?**
   - Follow-up if vague: "Can you give me a one-sentence elevator pitch?"
   - Interpretation: Extract the product name and core category

2. **What are the 3 most important features or aspects to highlight?**
   - Follow-up: "Which of these is the single most differentiating?"
   - Interpretation: Rank features by priority for scene allocation

3. **What problem does this product solve for its users?**
   - Follow-up: "How were users solving this problem before?"
   - Interpretation: This becomes the "pain point" scene content

4. **What makes this product different from alternatives?**
   - Follow-up: "Is there a specific competitor you want to contrast against?"
   - Interpretation: Differentiators become emphasis moments in the script

5. **Is there a tagline, slogan, or key phrase you use?**
   - Follow-up: "Should this appear as on-screen text or narration?"
   - Interpretation: May become the hook or CTA text

6. **What is the current stage? (launched, beta, pre-launch, major update)**
   - Interpretation: Affects tone - launched products can show real UI; pre-launch needs mockups

7. **Are there any technical details the audience needs to understand?**
   - Follow-up: "Should we simplify these or keep them technical?"
   - Interpretation: Determines technical depth of narration

### Summary template

> Product: [name]. Solves [problem] for [who]. Key features: [1], [2], [3].
> Differentiator: [what]. Stage: [stage]. Tagline: [if any].

---

## Category 2: Audience (3-5 questions)

### Core questions

8. **Who is the primary target viewer?**
   - Follow-up: "Job title, role, or persona name?"
   - Interpretation: Drives tone, vocabulary level, and examples

9. **What is their technical level?**
   - Options: Non-technical / Semi-technical / Developer / Expert
   - Interpretation: Non-technical = benefit-focused, no jargon. Developer = can show code.

10. **What pain points or frustrations do they experience?**
    - Follow-up: "Which pain point is the most emotionally charged?"
    - Interpretation: The strongest pain point often becomes the hook

11. **What would make them share this video?**
    - Interpretation: Identifies the "aha moment" that should be most prominently featured

12. **Are there secondary audiences to consider?**
    - Interpretation: Secondary audience may need a brief nod but should not dilute the primary message

### Summary template

> Primary audience: [role/persona]. Technical level: [level].
> Key pain point: [pain]. Shareability hook: [what].

---

## Category 3: Video Goals (3-4 questions)

### Core questions

13. **What type of video is this?**
    - Options: Product demo / Explainer / Social clip / Announcement / Tutorial
    - Interpretation: Directly sets pacing template and scene count

14. **What is the target duration?**
    - Follow-up if unsure: suggest based on type (demo: 30-120s, social: 15-60s)
    - Interpretation: Sets total_frames and constrains scene count

15. **Where will this video be distributed?**
    - Options: Website hero / YouTube / LinkedIn / Twitter/X / TikTok / Instagram / Internal / Email
    - Interpretation: Determines resolution (vertical vs horizontal) and pacing expectations

16. **What should the viewer do after watching?**
    - Follow-up: "Is there a specific URL, signup, or action?"
    - Interpretation: Becomes the CTA scene content

### Summary template

> Type: [type]. Duration: [Xs]. Channel: [where]. CTA: [action + URL].

---

## Category 4: Tone & Style (3-5 questions)

### Core questions

17. **What tone should the video have?**
    - Spectrum: Formal <-> Casual, Energetic <-> Calm, Playful <-> Serious
    - Interpretation: Affects narration word choice, music selection, animation speed

18. **Are there reference videos you like the style of?**
    - Follow-up: "What specifically did you like about them?"
    - Interpretation: Extract concrete style elements (pacing, color, animation)

19. **Should there be a human narrator voice or text-only?**
    - Follow-up if narrator: "Male, female, or neutral? Any accent preference?"
    - Interpretation: Text-only scripts need more on-screen text; narrated scripts need pacing for speech

20. **How fast should the pacing feel?**
    - Options: Relaxed / Medium / Fast / Frenetic
    - Interpretation: Maps to per-scene duration choices within the type's range

21. **Any styles or trends to avoid?**
    - Interpretation: Adds to the anti-pattern list for this specific project

### Summary template

> Tone: [descriptors]. Pacing: [speed]. Voice: [narrator/text]. Reference: [if any].

---

## Category 5: Assets (3-5 questions)

### Core questions

22. **Do you have a logo in SVG or PNG format?**
    - Follow-up: "Any usage rules (minimum size, clear space)?"
    - Interpretation: Logo appears in intro and outro scenes

23. **Are there screenshots, screen recordings, or mockups available?**
    - Follow-up: "Are these current or do they need updating?"
    - Interpretation: Real screenshots make demos more credible than illustrations

24. **What are the brand colors? (hex codes preferred)**
    - Follow-up: "Primary, secondary, and accent colors?"
    - Interpretation: Sets the color palette for backgrounds, text, and accents

25. **What fonts does the brand use?**
    - Follow-up: "Web-safe alternatives if custom fonts are unavailable?"
    - Interpretation: Typography choices for all on-screen text

26. **Any existing brand motion guidelines or animation library?**
    - Interpretation: Constrains animation choices to match existing brand motion

### Summary template

> Logo: [yes/no, format]. Screenshots: [yes/no]. Colors: [hex codes].
> Fonts: [names]. Motion guidelines: [yes/no].

---

## Category 6: Content (4-6 questions)

### Core questions

27. **What is the single most important message the viewer should take away?**
    - Interpretation: This message appears in at least 2 scenes (hook + CTA)

28. **Which features or aspects must be shown, no matter what?**
    - Follow-up: "In what order of importance?"
    - Interpretation: Each must-show feature gets its own scene

29. **What is the call to action?**
    - Follow-up: "Exact URL, button text, or next step?"
    - Interpretation: Final or penultimate scene content

30. **Do you have an idea for the opening hook?**
    - Follow-up if no: suggest 3 hook options based on gathered info
    - Interpretation: First 3 seconds of the video

### Additional questions (if time allows)

- "Are there any claims that need disclaimers or caveats?"
- "Should we mention pricing or keep it out?"
- "Any seasonal or time-sensitive elements?"

### Summary template

> Key message: [message]. Must-show: [features]. CTA: [action + URL].
> Hook idea: [hook]. Disclaimers: [if any].

---

## Category 7: Visual Preferences (3-5 questions)

These questions are asked last because earlier answers inform better defaults.

- **Animation style preference?** (Smooth/eased, Snappy/spring, Minimal/subtle)
- **Color palette beyond brand colors?** (Dark mode, light mode, gradients, flat)
- **Layout preference?** (Centered, split-screen, full-bleed, asymmetric)
- **Any specific visual elements to include?** (Icons, illustrations, 3D, photos)
- **Screen recording style?** (Full browser, app window only, cropped to feature)

---

## Generating the brief

After completing all categories, compile answers into a structured brief:

```yaml
brief:
  product:
    name: "Acme Dashboard"
    problem: "Building dashboards takes weeks of developer time"
    differentiator: "AI-generated layouts from natural language prompts"
    tagline: "Dashboards that build themselves"
    stage: "launched"
  audience:
    primary: "SaaS founders and product managers"
    technical_level: "semi-technical"
    key_pain: "Wasting engineering time on internal tools"
  goals:
    type: "demo"
    duration: "60s"
    channel: "website-hero"
    cta: "Try free at acme.dev"
  tone:
    descriptors: "professional, confident, minimal"
    pacing: "medium"
    voice: "male narrator, neutral accent"
  assets:
    logo: true
    screenshots: true
    colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"]
    fonts: ["Inter", "JetBrains Mono"]
  content:
    key_message: "Build production dashboards in minutes, not weeks"
    must_show: ["AI prompt input", "drag-and-drop editor", "real-time data"]
    hook: "What if your dashboard could build itself?"
  visual:
    animation_style: "smooth"
    palette: "dark mode with accent pops"
    layout: "centered with browser mockups"
```

Present this brief to the user for confirmation before generating the script.
Any changes at this stage are much cheaper than revising a completed script.

---

## Adapting the interview

- **Repeat clients**: Skip Asset and Visual Preference categories; reuse from last project
- **Tight timelines**: Compress to 10 essential questions (1, 2, 3, 8, 9, 13, 14, 15, 27, 29)
- **Multiple stakeholders**: Run the interview with the primary decision maker, then share the brief with others for feedback before scripting
- **Vague answers**: Offer 2-3 concrete options rather than asking open-ended follow-ups
