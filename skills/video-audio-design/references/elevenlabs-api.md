# ElevenLabs API - Advanced Patterns

Deep-dive reference for ElevenLabs TTS API usage in programmatic video
pipelines. Load this file only when the task involves advanced ElevenLabs
features beyond basic text-to-speech generation.

---

## API Authentication

All requests require the `xi-api-key` header. Store the key in environment
variables and never commit it to version control.

```typescript
const headers = {
  'Content-Type': 'application/json',
  'xi-api-key': process.env.ELEVEN_LABS_API_KEY!,
};
```

Check quota before batch generation:

```typescript
async function checkQuota(): Promise<{
  characterCount: number;
  characterLimit: number;
  remaining: number;
}> {
  const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': process.env.ELEVEN_LABS_API_KEY! },
  });
  const data = await response.json();
  return {
    characterCount: data.character_count,
    characterLimit: data.character_limit,
    remaining: data.character_limit - data.character_count,
  };
}
```

---

## Voice Listing and Selection

Fetch all available voices to pick the right one programmatically:

```typescript
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string;
}

async function listVoices(): Promise<ElevenLabsVoice[]> {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': process.env.ELEVEN_LABS_API_KEY! },
  });
  const data = await response.json();
  return data.voices;
}

// Filter voices by attributes
async function findVoice(criteria: {
  gender?: string;
  accent?: string;
  age?: string;
}): Promise<ElevenLabsVoice | undefined> {
  const voices = await listVoices();
  return voices.find((v) => {
    const labels = v.labels;
    if (criteria.gender && labels.gender !== criteria.gender) return false;
    if (criteria.accent && labels.accent !== criteria.accent) return false;
    if (criteria.age && labels.age !== criteria.age) return false;
    return true;
  });
}
```

---

## Streaming TTS

For long narrations, stream audio chunks instead of waiting for the full
response. This reduces time-to-first-byte and enables progressive processing:

```typescript
import fs from 'fs';

async function streamNarration(
  text: string,
  voiceId: string,
  outputPath: string
): Promise<void> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(`Stream error: ${response.status}`);
  }

  const writer = fs.createWriteStream(outputPath);
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    writer.write(Buffer.from(value));
  }

  writer.end();
}
```

---

## WebSocket API for Real-time TTS

Use WebSockets for lowest-latency generation. Useful when previewing
narration during development:

```typescript
import WebSocket from 'ws';
import fs from 'fs';

async function realtimeTTS(
  text: string,
  voiceId: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const modelId = 'eleven_multilingual_v2';
    const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${modelId}`;
    const ws = new WebSocket(wsUrl);
    const chunks: Buffer[] = [];

    ws.on('open', () => {
      // Begin stream with settings
      ws.send(JSON.stringify({
        text: ' ',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
        xi_api_key: process.env.ELEVEN_LABS_API_KEY!,
      }));

      // Send text
      ws.send(JSON.stringify({ text }));

      // Signal end of input
      ws.send(JSON.stringify({ text: '' }));
    });

    ws.on('message', (data: Buffer) => {
      try {
        const json = JSON.parse(data.toString());
        if (json.audio) {
          chunks.push(Buffer.from(json.audio, 'base64'));
        }
      } catch {
        // Binary data
        chunks.push(Buffer.from(data));
      }
    });

    ws.on('close', () => {
      const audioBuffer = Buffer.concat(chunks);
      fs.writeFileSync(outputPath, audioBuffer);
      resolve();
    });

    ws.on('error', reject);
  });
}
```

---

## Pronunciation Dictionaries

Control how specific words are pronounced using SSML phoneme tags or
the pronunciation dictionary API:

```typescript
// Inline SSML approach - wrap specific words
function applyPronunciation(
  text: string,
  dictionary: Record<string, string>
): string {
  let result = text;
  for (const [word, ipa] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(
      regex,
      `<phoneme alphabet="ipa" ph="${ipa}">${word}</phoneme>`
    );
  }
  return result;
}

// Common tech pronunciation overrides
const techPronunciations: Record<string, string> = {
  'API': 'eI.piː.aI',
  'CLI': 'siː.ɛl.aI',
  'npm': 'ɛn.piː.ɛm',
  'SQL': 'ɛs.kjuː.ɛl',
  'OAuth': 'oʊ.ɔːθ',
  'YAML': 'jæm.əl',
  'nginx': 'ɛn.dʒɪnks',
};
```

---

## Caching and Quota Management

Avoid regenerating audio for unchanged text. Use content-based hashing:

```typescript
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface CacheKey {
  text: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

function getCacheHash(key: CacheKey): string {
  const content = JSON.stringify(key);
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function getCachePath(cacheDir: string, hash: string): string {
  return path.join(cacheDir, `${hash}.mp3`);
}

async function generateWithCache(
  text: string,
  voiceId: string,
  cacheDir: string,
  generateFn: (text: string, voiceId: string, output: string) => Promise<void>
): Promise<string> {
  const hash = getCacheHash({
    text,
    voiceId,
    modelId: 'eleven_multilingual_v2',
    stability: 0.5,
    similarityBoost: 0.75,
  });
  const cachePath = getCachePath(cacheDir, hash);

  if (fs.existsSync(cachePath)) {
    return cachePath;
  }

  await generateFn(text, voiceId, cachePath);
  return cachePath;
}
```

---

## Model Selection

| Model | Quality | Speed | Languages | Best for |
|---|---|---|---|---|
| eleven_multilingual_v2 | Highest | Slower | 28+ | Production narration |
| eleven_turbo_v2_5 | High | Fast | 32+ | Previews, iteration |
| eleven_monolingual_v1 | Good | Fast | English only | Simple English TTS |

Use `eleven_turbo_v2_5` during development for faster iteration, then switch
to `eleven_multilingual_v2` for the final render.

---

## Error Handling

```typescript
async function safeGenerate(
  text: string,
  voiceId: string,
  outputPath: string,
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await generateNarration(text, voiceId, outputPath);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('401')) {
        throw new Error('Invalid API key. Check ELEVEN_LABS_API_KEY.');
      }
      if (message.includes('429')) {
        const waitMs = Math.pow(2, attempt) * 1000;
        console.warn(`Rate limited. Waiting ${waitMs}ms before retry...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      if (message.includes('422')) {
        throw new Error(`Invalid request. Check voice_id "${voiceId}" exists.`);
      }

      if (attempt === maxRetries) throw error;
      console.warn(`Attempt ${attempt} failed: ${message}. Retrying...`);
    }
  }
}
```

---

## Batch Generation Pipeline

Generate narration for all scenes efficiently:

```typescript
interface BatchScene {
  id: string;
  text: string;
}

interface BatchResult {
  id: string;
  audioPath: string;
  durationMs: number;
  cached: boolean;
}

async function batchGenerate(
  scenes: BatchScene[],
  voiceId: string,
  outputDir: string,
  cacheDir: string,
  concurrency: number = 2
): Promise<BatchResult[]> {
  const results: BatchResult[] = [];

  // Process in batches to respect rate limits
  for (let i = 0; i < scenes.length; i += concurrency) {
    const batch = scenes.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (scene) => {
        const hash = getCacheHash({
          text: scene.text,
          voiceId,
          modelId: 'eleven_multilingual_v2',
          stability: 0.5,
          similarityBoost: 0.75,
        });
        const cachePath = getCachePath(cacheDir, hash);
        const outputPath = path.join(outputDir, `${scene.id}.mp3`);
        const cached = fs.existsSync(cachePath);

        if (cached) {
          fs.copyFileSync(cachePath, outputPath);
        } else {
          await safeGenerate(scene.text, voiceId, outputPath);
          fs.copyFileSync(outputPath, cachePath);
        }

        const durationMs = getAudioDurationMs(outputPath);
        return { id: scene.id, audioPath: outputPath, durationMs, cached };
      })
    );
    results.push(...batchResults);
  }

  return results;
}
```
