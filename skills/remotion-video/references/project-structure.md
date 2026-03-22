# Project Structure

Organizing Remotion projects for maintainability and reuse.

---

## Standard project layout

```
my-video/
  src/
    Root.tsx              # Registers all compositions
    index.ts              # Entry point (exports Root)
    compositions/
      Intro.tsx           # Individual composition components
      MainContent.tsx
      Outro.tsx
    components/
      AnimatedText.tsx    # Reusable animation components
      Background.tsx
      Logo.tsx
    hooks/
      useAnimation.ts    # Custom animation hooks
      useData.ts         # Data fetching hooks
    lib/
      colors.ts          # Shared constants
      fonts.ts           # Font loading
      schemas.ts         # Zod schemas for input props
    types.ts              # TypeScript type definitions
  public/
    fonts/               # Custom font files
    images/              # Static images
    audio/               # Music and sound effects
  remotion.config.ts     # Remotion CLI configuration
  package.json
  tsconfig.json
```

---

## Entry point and Root

The entry point exports the Root component that registers all compositions:

```typescript
// src/index.ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { Intro } from './compositions/Intro';
import { MainContent } from './compositions/MainContent';
import { Outro } from './compositions/Outro';
import { introSchema, mainSchema, outroSchema } from './lib/schemas';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={introSchema}
        defaultProps={{
          title: 'Welcome',
          subtitle: 'An example video',
        }}
      />
      <Composition
        id="MainContent"
        component={MainContent}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={mainSchema}
        defaultProps={{
          items: ['Item 1', 'Item 2', 'Item 3'],
        }}
      />
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={outroSchema}
        defaultProps={{
          message: 'Thanks for watching',
        }}
      />
    </>
  );
};
```

---

## Parametrized videos with Zod schemas

Define input props with Zod for type safety and Remotion Studio UI generation:

```typescript
// src/lib/schemas.ts
import { z } from 'zod';

export const introSchema = z.object({
  title: z.string().describe('Main title text'),
  subtitle: z.string().describe('Subtitle text below the title'),
  backgroundColor: z.string().default('#0f0f0f').describe('Background color'),
  accentColor: z.string().default('#e63946').describe('Accent color for highlights'),
});

export const mainSchema = z.object({
  items: z.array(z.string()).describe('List of items to display'),
  showNumbers: z.boolean().default(true).describe('Show item numbers'),
  animationSpeed: z.enum(['slow', 'normal', 'fast']).default('normal'),
});

export const outroSchema = z.object({
  message: z.string().describe('Closing message'),
  showLogo: z.boolean().default(true),
});

export type IntroProps = z.infer<typeof introSchema>;
export type MainProps = z.infer<typeof mainSchema>;
export type OutroProps = z.infer<typeof outroSchema>;
```

Use the schema in compositions:

```tsx
// src/compositions/Intro.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import type { IntroProps } from '../lib/schemas';

export const Intro: React.FC<IntroProps> = ({
  title,
  subtitle,
  backgroundColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ color: accentColor, fontSize: 80, opacity: titleOpacity }}>
        {title}
      </h1>
      <p style={{ color: 'white', fontSize: 36, opacity: subtitleOpacity }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
```

When a `schema` is set on a `<Composition>`, Remotion Studio renders form
controls in the sidebar for each field, using `describe()` values as labels.

---

## Reusable animation components

Build a library of composable animation primitives:

```tsx
// src/components/FadeIn.tsx
import { useCurrentFrame, interpolate } from 'remotion';

interface FadeInProps {
  children: React.ReactNode;
  durationFrames?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  durationFrames = 20,
  direction = 'up',
  distance = 30,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translate = interpolate(frame, [0, durationFrames], [distance, 0], {
    extrapolateRight: 'clamp',
  });

  const transforms: Record<string, string> = {
    up: `translateY(${translate}px)`,
    down: `translateY(${-translate}px)`,
    left: `translateX(${translate}px)`,
    right: `translateX(${-translate}px)`,
    none: 'none',
  };

  return (
    <div style={{ opacity, transform: transforms[direction] }}>
      {children}
    </div>
  );
};
```

```tsx
// src/components/ScaleIn.tsx
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  damping?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  damping = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping },
  });

  return (
    <div style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};
```

Usage in compositions:

```tsx
import { Sequence } from 'remotion';
import { FadeIn } from '../components/FadeIn';
import { ScaleIn } from '../components/ScaleIn';

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0}>
        <FadeIn direction="up" durationFrames={30}>
          <h1>Title</h1>
        </FadeIn>
      </Sequence>
      <Sequence from={20}>
        <ScaleIn damping={8}>
          <img src={staticFile('logo.png')} />
        </ScaleIn>
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

## Font loading

Centralize font loading for consistency:

```typescript
// src/lib/fonts.ts
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';

export const inter = loadInter();
export const poppins = loadPoppins();
```

For custom fonts, place `.woff2` files in `public/fonts/` and use CSS
`@font-face` in your components.

---

## Shared style constants

```typescript
// src/lib/colors.ts
export const colors = {
  background: '#0f0f0f',
  surface: '#1a1a2e',
  primary: '#e63946',
  secondary: '#457b9d',
  accent: '#2a9d8f',
  text: '#ffffff',
  textMuted: '#a0a0a0',
} as const;

export const sizes = {
  titleFont: 80,
  subtitleFont: 48,
  bodyFont: 32,
  padding: 100,
  borderRadius: 16,
} as const;

export const timing = {
  fadeIn: 20,
  fadeOut: 15,
  staggerDelay: 8,
  sceneTransition: 30,
} as const;
```

---

## Async data loading pattern

Load external data before rendering:

```tsx
// src/hooks/useData.ts
import { useCallback, useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [handle] = useState(() => delayRender('Loading async data'));

  const fetchData = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      continueRender(handle);
    } catch (err) {
      console.error('Failed to load data:', err);
      continueRender(handle);
    }
  }, [fetcher, handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
```

Usage:

```tsx
import { AbsoluteFill } from 'remotion';
import { useAsyncData } from '../hooks/useData';

export const DataDriven: React.FC = () => {
  const data = useAsyncData(async () => {
    const response = await fetch('https://api.example.com/stats');
    return response.json();
  });

  if (!data) {
    return null; // Will not render until data loads
  }

  return (
    <AbsoluteFill>
      <h1 style={{ color: 'white', fontSize: 64 }}>{data.title}</h1>
    </AbsoluteFill>
  );
};
```

The `delayRender()` call pauses the renderer until `continueRender()` is called,
ensuring async data is available before any frame is captured.
