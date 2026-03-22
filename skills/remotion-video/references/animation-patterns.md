# Animation Patterns

Advanced animation techniques for Remotion compositions.

---

## Staggered cascade animation

Animate a list of items appearing one after another with a delay between each:

```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface CascadeItemProps {
  label: string;
}

const CascadeItem: React.FC<CascadeItemProps> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontSize: 36,
        color: 'white',
        padding: '8px 0',
      }}
    >
      {label}
    </div>
  );
};

export const StaggeredList: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: 100,
        backgroundColor: '#1a1a2e',
      }}
    >
      {items.map((item, i) => (
        <Sequence key={i} from={i * 10}>
          <CascadeItem label={item} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

The key pattern: map over items with `<Sequence from={i * delay}>` where `delay`
controls stagger timing. Inside each Sequence, `useCurrentFrame()` resets to 0.

---

## Parallax scroll effect

Create depth by moving layers at different speeds:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface ParallaxLayerProps {
  speed: number;
  children: React.ReactNode;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ speed, children }) => {
  const frame = useCurrentFrame();
  const translateY = interpolate(frame, [0, 150], [0, -200 * speed], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ transform: `translateY(${translateY}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const ParallaxScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ParallaxLayer speed={0.3}>
        <div style={{ position: 'absolute', top: 400, left: 100 }}>
          <div style={{ width: 200, height: 200, backgroundColor: '#1f2937', borderRadius: 16 }} />
        </div>
      </ParallaxLayer>
      <ParallaxLayer speed={0.7}>
        <div style={{ position: 'absolute', top: 300, left: 400 }}>
          <div style={{ width: 150, height: 150, backgroundColor: '#374151', borderRadius: 12 }} />
        </div>
      </ParallaxLayer>
      <ParallaxLayer speed={1.0}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ color: 'white', fontSize: 72 }}>Parallax</h1>
        </AbsoluteFill>
      </ParallaxLayer>
    </AbsoluteFill>
  );
};
```

Higher `speed` values move faster, creating foreground elements. Lower values
create the illusion of distant background elements.

---

## Morph transition between scenes

Cross-fade between two scenes with a shared transform:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface MorphTransitionProps {
  sceneA: React.ReactNode;
  sceneB: React.ReactNode;
  transitionStart: number;
  transitionDuration: number;
}

export const MorphTransition: React.FC<MorphTransitionProps> = ({
  sceneA,
  sceneB,
  transitionStart,
  transitionDuration,
}) => {
  const frame = useCurrentFrame();
  const transitionEnd = transitionStart + transitionDuration;

  const progress = interpolate(frame, [transitionStart, transitionEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scaleA = interpolate(progress, [0, 1], [1, 1.2]);
  const scaleB = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress, transform: `scale(${scaleA})` }}>
        {sceneA}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress, transform: `scale(${scaleB})` }}>
        {sceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

---

## Custom easing curves

Create custom easing by composing interpolate with an easing function:

```tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const EasingDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Ease in-out cubic
  const easeInOut = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Bounce
  const bounce = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bounce,
  });

  // Elastic
  const elastic = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.elastic(1),
  });

  // Bezier curve
  const bezier = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  return null; // Apply these values to styles
};
```

Available easing functions from `Easing`:
- `Easing.linear` - constant speed
- `Easing.ease` - default CSS ease
- `Easing.cubic` / `Easing.quad` / `Easing.sin` - power curves
- `Easing.bounce` - bouncing ball effect
- `Easing.elastic(bounciness)` - spring overshoot
- `Easing.bezier(x1, y1, x2, y2)` - custom cubic bezier
- `Easing.in(fn)` / `Easing.out(fn)` / `Easing.inOut(fn)` - directional wrappers

---

## Multi-property animation

Animate multiple properties with different timings from a single frame source:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const MultiProperty: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Fade in (frames 0-20)
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Phase 2: Scale up with spring (frames 10-40)
  const scale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // Phase 3: Slide to final position (frames 20-50)
  const translateX = interpolate(frame, [20, 50], [-100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 4: Color transition (frames 30-60)
  const colorProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const r = Math.round(interpolate(colorProgress, [0, 1], [255, 99]));
  const g = Math.round(interpolate(colorProgress, [0, 1], [255, 102]));
  const b = Math.round(interpolate(colorProgress, [0, 1], [255, 241]));

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateX(${translateX}px)`,
          color: `rgb(${r}, ${g}, ${b})`,
          fontSize: 64,
          fontWeight: 'bold',
        }}
      >
        Multi-Phase Animation
      </div>
    </AbsoluteFill>
  );
};
```

Pattern: use different frame ranges for each property. Offset start frames to
create overlapping phases. Use `Math.max(0, frame - offset)` for spring delays.

---

## Typewriter effect

Reveal text character by character:

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

interface TypewriterProps {
  text: string;
  charsPerFrame?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  charsPerFrame = 0.5,
}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(frame * charsPerFrame);
  const displayText = text.slice(0, charsToShow);
  const showCursor = frame % 15 < 10;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
      }}
    >
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 48,
          color: '#d4d4d4',
        }}
      >
        {displayText}
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      </p>
    </AbsoluteFill>
  );
};
```

---

## Circular motion

Animate elements along a circular path:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface OrbiterProps {
  radius: number;
  speed: number;
  size: number;
  color: string;
}

const Orbiter: React.FC<OrbiterProps> = ({ radius, speed, size, color }) => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 90], [0, Math.PI * 2 * speed]);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        transform: `translate(${x}px, ${y}px)`,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    />
  );
};

export const CircularMotion: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      <Orbiter radius={200} speed={1} size={30} color="#e63946" />
      <Orbiter radius={150} speed={-0.7} size={20} color="#457b9d" />
      <Orbiter radius={100} speed={1.5} size={15} color="#2a9d8f" />
    </AbsoluteFill>
  );
};
```

Key: use `Math.cos` and `Math.sin` with a frame-derived angle. Multiply speed
to control rotation rate. Negative speed reverses direction.
