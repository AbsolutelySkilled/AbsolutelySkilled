# Video Creator - Project Templates

Starter Remotion project structures for each video type. Use these as
scaffolding when building the Remotion project in Steps 3-4.

---

## Shared Setup (All Video Types)

### package.json dependencies
```json
{
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/player": "^4.0.0",
    "@remotion/zod-types": "^4.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "remotion": "^4.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@remotion/eslint-config": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### remotion.config.ts
```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
```

### Base schema pattern
```ts
import { z } from "zod";

export const baseSchema = z.object({
  title: z.string(),
  primaryColor: z.string().default("#3B82F6"),
  secondaryColor: z.string().default("#1E293B"),
  backgroundColor: z.string().default("#0F172A"),
  fontFamily: z.string().default("Inter"),
  fps: z.number().default(30),
});
```

---

## Product Demo (30-120s, 6-15 scenes)

### File tree
```
product-demo/
  src/
    compositions/
      Scene01Hook.tsx
      Scene02Problem.tsx
      Scene03Solution.tsx
      Scene04Feature1.tsx
      Scene05Feature2.tsx
      Scene06Feature3.tsx
      Scene07SocialProof.tsx
      Scene08CTA.tsx
    components/
      AnimatedLogo.tsx
      ScreenRecording.tsx
      FeatureCard.tsx
      TransitionWipe.tsx
      CallToAction.tsx
      PriceTag.tsx
    lib/
      schema.ts
      colors.ts
      animations.ts
    Root.tsx
    index.ts
  public/
    logo.svg
    screenshots/
    recordings/
  video-script.yaml
  package.json
  remotion.config.ts
  tsconfig.json
```

### Scene scaffold - Hook
```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene01Hook: React.FC<{ title: string; primaryColor: string }> = ({
  title,
  primaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${logoScale})` }}>
        {/* Logo component */}
      </div>
      <h1 style={{ opacity: titleOpacity, color: primaryColor, fontSize: 80 }}>
        {title}
      </h1>
    </AbsoluteFill>
  );
};
```

### Typical scene flow
1. Hook - grab attention with bold statement or question (5s)
2. Problem - show the pain point (8s)
3. Solution intro - reveal the product (5s)
4. Feature 1-3 - demonstrate key features with screen recordings (8s each)
5. Social proof - testimonials, stats, logos (5s)
6. CTA - clear next step with URL/button (5s)

---

## Explainer (60-180s, 8-20 scenes)

### File tree
```
explainer/
  src/
    compositions/
      Scene01Intro.tsx
      Scene02Context.tsx
      Scene03Problem.tsx
      Scene04HowItWorks1.tsx
      Scene05HowItWorks2.tsx
      Scene06HowItWorks3.tsx
      Scene07Benefits.tsx
      Scene08Comparison.tsx
      Scene09UseCases.tsx
      Scene10CTA.tsx
    components/
      AnimatedDiagram.tsx
      StepIndicator.tsx
      ComparisonTable.tsx
      IconGrid.tsx
      ProgressBar.tsx
      AnimatedArrow.tsx
    lib/
      schema.ts
      colors.ts
      animations.ts
    Root.tsx
    index.ts
  public/
    icons/
    diagrams/
  video-script.yaml
  package.json
  remotion.config.ts
  tsconfig.json
```

### Typical scene flow
1. Intro - topic and why it matters (8s)
2. Context - background information (10s)
3. Problem - what goes wrong without this (8s)
4. How it works 1-3 - step-by-step walkthrough (10s each)
5. Benefits - key advantages (8s)
6. Comparison - before/after or vs competitors (10s)
7. Use cases - real-world applications (8s)
8. CTA - next steps (5s)

---

## Social Clip (15-60s, 3-8 scenes)

### File tree
```
social-clip/
  src/
    compositions/
      Scene01Hook.tsx
      Scene02Key Message.tsx
      Scene03CTA.tsx
    components/
      BoldText.tsx
      AnimatedEmoji.tsx
      GradientBackground.tsx
      SwipeTransition.tsx
    lib/
      schema.ts
      colors.ts
    Root.tsx
    index.ts
  public/
    brand/
  video-script.yaml
  package.json
  remotion.config.ts
  tsconfig.json
```

### Key differences from other types
- Much faster pacing (3-8 seconds per scene)
- Bolder typography (120px+ headlines)
- High contrast colors for mobile viewing
- Vertical format option (1080x1920 for Stories/Reels)
- No complex diagrams - text and motion graphics only
- Hook must grab attention in first 2 seconds

### Vertical format schema override
```ts
export const socialClipSchema = baseSchema.extend({
  orientation: z.enum(["landscape", "portrait"]).default("landscape"),
  width: z.number().default(3840),  // landscape
  height: z.number().default(2160), // landscape
  // For portrait: width=2160, height=3840
});
```

---

## Announcement (15-45s, 3-6 scenes)

### File tree
```
announcement/
  src/
    compositions/
      Scene01Reveal.tsx
      Scene02Details.tsx
      Scene03Availability.tsx
      Scene04CTA.tsx
    components/
      CountdownReveal.tsx
      ConfettiExplosion.tsx
      DateBadge.tsx
      PricingCard.tsx
    lib/
      schema.ts
      colors.ts
    Root.tsx
    index.ts
  public/
    brand/
    product-images/
  video-script.yaml
  package.json
  remotion.config.ts
  tsconfig.json
```

### Typical scene flow
1. Reveal - dramatic product/feature reveal with animation (6s)
2. Details - what's new, key highlights (8s)
3. Availability - when, where, pricing (6s)
4. CTA - how to get it (4s)

---

## Root.tsx Pattern (All Types)

```tsx
import { Composition } from "remotion";
import { z } from "zod";
import { baseSchema } from "./lib/schema";
import { Scene01Hook } from "./compositions/Scene01Hook";
// ... import all scenes

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Individual scene compositions for preview */}
      <Composition
        id="Scene01"
        component={Scene01Hook}
        durationInFrames={150} // 5s * 30fps
        fps={30}
        width={3840}
        height={2160}
        schema={baseSchema}
        defaultProps={{
          title: "Your Product",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E293B",
          backgroundColor: "#0F172A",
          fontFamily: "Inter",
          fps: 30,
        }}
      />
      {/* Main composition: all scenes stitched together */}
      <Composition
        id="Main"
        component={MainVideo}
        durationInFrames={1800} // total frames from script
        fps={30}
        width={3840}
        height={2160}
        schema={baseSchema}
        defaultProps={{
          title: "Your Product",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E293B",
          backgroundColor: "#0F172A",
          fontFamily: "Inter",
          fps: 30,
        }}
      />
    </>
  );
};
```

---

## Transition Patterns

### Crossfade
```tsx
<Sequence from={0} durationInFrames={150}>
  <Scene01 />
</Sequence>
<Sequence from={135} durationInFrames={165}>
  {/* 15 frame overlap = 0.5s crossfade */}
  <Scene02 />
</Sequence>
```

### Hard cut
```tsx
<Sequence from={0} durationInFrames={150}>
  <Scene01 />
</Sequence>
<Sequence from={150} durationInFrames={150}>
  <Scene02 />
</Sequence>
```

### Slide transition component
```tsx
const SlideTransition: React.FC<{ direction: "left" | "right"; children: React.ReactNode }> = ({
  direction,
  children,
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 15], [direction === "left" ? 3840 : -3840, 0], {
    extrapolateRight: "clamp",
  });
  return <div style={{ transform: `translateX(${x}px)` }}>{children}</div>;
};
```
