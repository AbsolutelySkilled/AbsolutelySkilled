# Rendering Guide

Comprehensive guide to rendering Remotion compositions to video files.

---

## CLI rendering

The primary way to render videos is the Remotion CLI:

```bash
# Basic render to MP4 (H.264 codec)
npx remotion render src/index.ts MyComposition out/video.mp4

# Specify codec explicitly
npx remotion render src/index.ts MyComposition out/video.mp4 --codec h264

# Render to WebM (VP8)
npx remotion render src/index.ts MyComposition out/video.webm --codec vp8

# Render to ProRes (for editing in Final Cut/Premiere)
npx remotion render src/index.ts MyComposition out/video.mov --codec prores

# Render a GIF
npx remotion render src/index.ts MyComposition out/animation.gif --codec gif
```

### Resolution and quality options

```bash
# Custom resolution (overrides composition defaults)
npx remotion render src/index.ts MyComposition out/video.mp4 --width 3840 --height 2160

# Control CRF (quality) - lower is better quality, higher file size
# H.264 range: 1-51, default 18
npx remotion render src/index.ts MyComposition out/video.mp4 --crf 15

# Frame range (render only specific frames)
npx remotion render src/index.ts MyComposition out/video.mp4 --frames 0-90

# Specific single frame as image
npx remotion still src/index.ts MyComposition out/thumbnail.png --frame 45
```

### Passing input props

```bash
# Pass JSON props to the composition
npx remotion render src/index.ts MyComposition out/video.mp4 \
  --props '{"title": "Hello World", "color": "#ff0000"}'

# Pass props from a file
npx remotion render src/index.ts MyComposition out/video.mp4 \
  --props ./input-data.json
```

---

## Codec comparison

| Codec | Format | Quality | File Size | Use Case |
|-------|--------|---------|-----------|----------|
| `h264` | MP4 | Excellent | Medium | Web, social media, general distribution |
| `h265` | MP4 | Excellent | Smaller | When H.265 support is available |
| `vp8` | WebM | Good | Medium | Web embedding, open format |
| `vp9` | WebM | Excellent | Smaller | High-quality web embedding |
| `prores` | MOV | Lossless | Very Large | Professional editing (Final Cut, Premiere) |
| `gif` | GIF | Low (256 colors) | Large | Short loops, previews |

Recommendation: Use `h264` for most distribution. Use `prores` when the output
will be edited further. Use `gif` only for very short clips (under 5 seconds).

---

## Programmatic rendering

Render from Node.js code for batch processing or server-side rendering:

```typescript
import { bundle } from '@remotion/bundler';
import {
  renderMedia,
  selectComposition,
  getCompositions,
} from '@remotion/renderer';
import path from 'path';

async function renderVideo() {
  // Step 1: Bundle the project
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
    webpackOverride: (config) => config,
  });

  // Step 2: Select composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'MyComposition',
    inputProps: {
      title: 'Dynamic Title',
    },
  });

  // Step 3: Render
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: path.resolve('./out/video.mp4'),
    inputProps: {
      title: 'Dynamic Title',
    },
    onProgress: ({ progress }) => {
      console.log(`Rendering: ${Math.round(progress * 100)}%`);
    },
  });

  console.log('Render complete');
}

renderVideo();
```

### Batch rendering multiple compositions

```typescript
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import path from 'path';

async function renderAll() {
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  const compositions = await getCompositions(bundleLocation);

  for (const composition of compositions) {
    console.log(`Rendering ${composition.id}...`);
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: path.resolve(`./out/${composition.id}.mp4`),
    });
  }

  console.log(`Rendered ${compositions.length} videos`);
}

renderAll();
```

### Rendering with dynamic data

```typescript
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';

interface VideoData {
  userName: string;
  score: number;
  avatarUrl: string;
}

async function renderPersonalizedVideo(data: VideoData) {
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'PersonalizedVideo',
    inputProps: data,
  });

  const outputPath = path.resolve(`./out/${data.userName}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: data,
  });

  return outputPath;
}
```

---

## Rendering still images

Export a single frame as PNG or JPEG:

```typescript
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';

async function renderThumbnail() {
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/index.ts'),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'MyComposition',
  });

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: path.resolve('./out/thumbnail.png'),
    frame: 45,
    imageFormat: 'png',
  });
}

renderThumbnail();
```

CLI equivalent:

```bash
npx remotion still src/index.ts MyComposition out/thumbnail.png --frame 45
npx remotion still src/index.ts MyComposition out/thumbnail.jpeg --frame 45 --image-format jpeg --quality 90
```

---

## Performance optimization

### Parallel rendering with concurrency

```typescript
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: './out/video.mp4',
  concurrency: 4, // Render 4 frames in parallel
});
```

Default concurrency is 50% of CPU cores. Increase for CPU-heavy compositions,
decrease if running out of memory.

### Use OffthreadVideo for embedded video clips

```tsx
import { OffthreadVideo, staticFile } from 'remotion';

// Preferred: better rendering performance
export const GoodVideoEmbed: React.FC = () => {
  return <OffthreadVideo src={staticFile('clip.mp4')} />;
};

// Avoid: slower rendering due to seeking
export const SlowVideoEmbed: React.FC = () => {
  return <video src={staticFile('clip.mp4')} />;
};
```

`<OffthreadVideo>` extracts frames outside the browser, significantly reducing
render time for compositions that include video clips.

### Prefetch remote assets

```tsx
import { prefetch } from 'remotion';

const { free, waitUntilDone } = prefetch('https://example.com/large-image.png', {
  method: 'blob-url',
});

// Use in component after prefetch completes
```

### Reduce bundle size

```typescript
// remotion.config.ts
import { Config } from '@remotion/cli/config';

Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // Tree-shake unused heavy dependencies
      },
    },
  };
});
```

---

## Remotion Lambda (cloud rendering)

Render videos in AWS Lambda for horizontal scaling:

```typescript
import { renderMediaOnLambda } from '@remotion/lambda/client';

const result = await renderMediaOnLambda({
  region: 'us-east-1',
  functionName: 'remotion-render',
  serveUrl: 'https://your-site.com/bundle',
  composition: 'MyComposition',
  codec: 'h264',
  inputProps: { title: 'Cloud Rendered' },
});

console.log('Video URL:', result.url);
```

Lambda rendering splits the video into chunks, renders each chunk in a separate
Lambda invocation, then stitches them together. This allows rendering a 5-minute
video in under 30 seconds.

Setup requirements:
1. Deploy a Lambda function with `npx remotion lambda functions deploy`
2. Deploy the Remotion bundle with `npx remotion lambda sites create`
3. Configure AWS credentials with appropriate IAM permissions

---

## Configuration file

`remotion.config.ts` at the project root:

```typescript
import { Config } from '@remotion/cli/config';

// Set default codec
Config.setCodec('h264');

// Set default CRF (quality)
Config.setCrf(18);

// Set concurrency
Config.setConcurrency(4);

// Override webpack config
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules ?? []),
        // Add custom loaders here
      ],
    },
  };
});
```

---

## Troubleshooting rendering issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank frames | Async data not loaded | Use `delayRender()` / `continueRender()` |
| Flickering | Non-deterministic rendering | Remove `Math.random()`, use seeded values |
| Out of memory | Too many concurrent frames | Reduce `concurrency` option |
| Slow render | Using `<Video>` component | Switch to `<OffthreadVideo>` |
| Missing assets | Wrong `staticFile()` path | Verify file exists in `public/` folder |
| Codec error | Odd dimensions | Ensure width and height are even numbers |
| Audio desync | Wrong sample rate | Use 44100 or 48000 Hz audio files |
