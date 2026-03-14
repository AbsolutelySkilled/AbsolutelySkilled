<!-- Part of the Mastra AbsolutelySkilled skill. Load this file when
     working with MCP client/server setup, voice providers, CompositeVoice,
     or realtime audio streaming. -->

# MCP and Voice

## MCPClient - connecting to external tool servers

```typescript
import { MCPClient } from '@mastra/mcp'

const mcp = new MCPClient({
  id: 'my-mcp-client',
  servers: {
    // Local stdio transport
    github: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
    },
    // Remote HTTP/SSE transport
    custom: {
      url: new URL('https://my-mcp-server.com/sse'),
      requestInit: {
        headers: { Authorization: 'Bearer token' },
      },
    },
  },
})
```

### Static tools (single-user, CLI tools)

Tools are resolved once at agent initialization and don't change.

```typescript
const agent = new Agent({
  id: 'github-agent',
  model: 'openai/gpt-4.1',
  tools: await mcp.listTools(),
})
```

### Dynamic toolsets (multi-user SaaS)

Tools are resolved per-request with user-specific credentials.

```typescript
const response = await agent.generate(userPrompt, {
  toolsets: await userMcp.listToolsets(),
})
await userMcp.disconnect()  // always disconnect after dynamic use
```

> Static tools (`listTools()`) are fixed at init - credential changes don't
> propagate. Use `listToolsets()` for multi-user scenarios.

---

## MCPServer - exposing Mastra as MCP

```typescript
import { MCPServer } from '@mastra/mcp'

const mcpServer = new MCPServer({
  id: 'my-mcp-server',
  name: 'My Tools Server',
  version: '1.0.0',
  agents: { myAgent },
  tools: { myTool },
  workflows: { myWorkflow },
})

// Register with Mastra
const mastra = new Mastra({
  mcpServers: { mcpServer },
})
```

---

## MCP registry integrations

| Registry | Transport | Notes |
|---|---|---|
| Smithery.ai | stdio | CLI via `@smithery/cli@latest` |
| Klavis AI | Hosted | Enterprise-authenticated, uses instance IDs |
| mcp.run | SSE | Pre-authenticated; SSE URLs are credentials - store in env vars |
| Composio.dev | SSE | Single-user tied; not for multi-tenant |
| Ampersand | SSE or stdio | 150+ SaaS integrations |

> mcp.run SSE URLs are sensitive - never hardcode them, always use env vars.
> Composio URLs are single-user and unsuitable for multi-tenant systems.

---

## Voice providers

### Package installation

```bash
npm install @mastra/voice-openai          # OpenAI TTS/STT
npm install @mastra/voice-elevenlabs      # ElevenLabs synthesis
npm install @mastra/voice-google          # Google Cloud Speech
npm install @mastra/voice-deepgram        # Deepgram transcription
npm install @mastra/voice-azure           # Microsoft Azure Speech
npm install @mastra/voice-playai          # PlayAI synthesis
npm install @mastra/voice-cloudflare      # Cloudflare Workers AI
npm install @mastra/voice-speechify       # Speechify TTS
npm install @mastra/voice-sarvam          # Sarvam AI (multilingual)
npm install @mastra/voice-murf            # Murf Studio

# Realtime (speech-to-speech)
npm install @mastra/voice-openai-realtime
npm install @mastra/voice-google-gemini-live

# Audio utilities
npm install @mastra/node-audio
```

### Environment variables

| Provider | Required env var |
|---|---|
| OpenAI | `OPENAI_API_KEY` |
| Azure | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` |
| ElevenLabs | `ELEVENLABS_API_KEY` |
| Google | `GOOGLE_API_KEY` |
| Deepgram | `DEEPGRAM_API_KEY` |
| PlayAI | `PLAYAI_API_KEY` |
| Cloudflare | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` |

---

## Voice API

### Text-to-speech (TTS)

```typescript
const audio = await agent.voice.speak('Hello, world!', { speaker: 'alloy' })
```

### Speech-to-text (STT)

```typescript
const transcript = await agent.voice.listen(audioStream)
```

### Speech-to-speech (realtime)

```typescript
await agent.voice.connect()
agent.voice.send(microphoneStream)

agent.voice.on('speaker', ({ audio }) => playAudio(audio))
agent.voice.on('writing', ({ text, role }) => console.log(text))
```

---

## Agent with voice

```typescript
import { OpenAIVoice } from '@mastra/voice-openai'

const agent = new Agent({
  id: 'voice-agent',
  model: 'openai/gpt-4.1',
  instructions: 'You are a voice assistant.',
  voice: new OpenAIVoice({
    speechModel: { name: 'tts-1' },
    listeningModel: { name: 'whisper-1' },
    speaker: 'alloy',
  }),
})
```

---

## CompositeVoice - mix providers

Use one provider for STT and another for TTS.

```typescript
import { CompositeVoice } from '@mastra/core'
import { OpenAIVoice } from '@mastra/voice-openai'
import { ElevenLabsVoice } from '@mastra/voice-elevenlabs'

const openai = new OpenAIVoice()
const elevenlabs = new ElevenLabsVoice()

const voice = new CompositeVoice({
  input: openai.transcription('whisper-1'),      // STT via OpenAI
  output: elevenlabs.speech('eleven_turbo_v2'),   // TTS via ElevenLabs
})
```

---

## Audio utilities

```typescript
import { playAudio, getMicrophoneStream } from '@mastra/node-audio'

const mic = await getMicrophoneStream()
const audio = await agent.voice.speak('Hello')
await playAudio(audio)
```

> Semantic recall (vector queries) runs before each LLM call. For real-time
> voice applications, this adds noticeable latency. Consider disabling
> semantic recall for voice-first agents or using message history only.
