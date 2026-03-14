<!-- Part of the A2A Protocol AbsolutelySkilled skill. Load this file when
     working with task lifecycle, state machines, or push notifications. -->

# Task States and Lifecycle Reference

## Task object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique task identifier |
| `context_id` | string | No | Groups related tasks across turns |
| `status` | TaskStatus | Yes | Current state and metadata |
| `artifacts` | Artifact[] | No | Output artifacts produced |
| `history` | Message[] | No | Conversation history |
| `metadata` | map | No | Arbitrary key-value data |

## Task states

```
                    +-> completed (terminal)
                    |
submitted -> working +-> failed (terminal)
                    |
                    +-> canceled (terminal)
                    |
                    +-> rejected (terminal)
                    |
                    +-> input-required (interrupted) -> working (on new message)
                    |
                    +-> auth-required (interrupted) -> working (on auth)
```

### State descriptions

| State | Category | Description |
|---|---|---|
| `submitted` | Active | Task received, not yet processing |
| `working` | Active | Agent is processing the task |
| `completed` | Terminal | Task finished successfully |
| `failed` | Terminal | Task encountered an unrecoverable error |
| `canceled` | Terminal | Task was canceled by client |
| `rejected` | Terminal | Agent refused to process the task |
| `input-required` | Interrupted | Agent needs more info from client |
| `auth-required` | Interrupted | Agent needs authentication/authorization |

### State transitions

- Active states can transition to any other state
- Interrupted states transition back to `working` when the client responds
- Terminal states are final - no further transitions allowed
- Servers must reject `cancelTask` for tasks already in terminal states

## Multi-turn conversation flow

1. Client sends `sendMessage` with initial request
2. Server creates task in `submitted` state, moves to `working`
3. Server transitions to `input-required` if it needs clarification
4. Client sends follow-up `sendMessage` with same `task_id` and `context_id`
5. Server resumes processing (`working`)
6. Repeat until task reaches a terminal state

The `context_id` is server-generated on the first interaction. Clients must
preserve and reuse it for related follow-up messages. Servers must reject
requests with mismatched `context_id`/`task_id` pairs.

## History and pagination

The `history_length` parameter on `getTask` and `sendMessage` controls how
many historical messages are returned:

| Value | Behavior |
|---|---|
| `0` | No history returned |
| Unset/null | Full history (no limit) |
| `N` (positive int) | Last N messages only |

## Artifacts

| Field | Type | Required | Description |
|---|---|---|---|
| `artifact_id` | string | Yes | Unique artifact identifier |
| `name` | string | No | Human-readable name |
| `description` | string | No | What the artifact contains |
| `parts` | Part[] | Yes | Content parts |
| `metadata` | map | No | Arbitrary key-value data |
| `extensions` | Extension[] | No | Extension data |

## Push notification payloads

When push notifications are configured, the server sends webhooks with these
event types:

### TaskStatusUpdateEvent

Sent when a task's state changes.

```json
{
  "task_id": "task-abc-123",
  "context_id": "ctx-xyz",
  "status": {
    "state": "completed",
    "message": {
      "role": "agent",
      "parts": [{ "text": "Task completed successfully" }]
    }
  },
  "metadata": {}
}
```

### TaskArtifactUpdateEvent

Sent when an artifact is created or updated.

```json
{
  "task_id": "task-abc-123",
  "context_id": "ctx-xyz",
  "artifact": {
    "artifact_id": "art-001",
    "name": "search-results",
    "parts": [{ "text": "Found 3 matching flights..." }],
    "append": false,
    "last_chunk": true
  }
}
```

- `append: true` means this chunk should be appended to the existing artifact
- `last_chunk: true` means no more chunks will follow for this artifact

## Push notification configuration

```json
{
  "url": "https://client.example.com/webhook",
  "token": "unique-config-id",
  "authentication": {
    "scheme": "bearer",
    "credentials": "secret-token"
  }
}
```

### Authentication options for webhooks

| Scheme | Description |
|---|---|
| `basic` | HTTP Basic auth (base64 user:pass) |
| `bearer` | Bearer token in Authorization header |
| `apiKey` | API key in configured location |

### Management operations

- `createTaskPushNotificationConfig` - Register a new webhook
- `getTaskPushNotificationConfig` - Get config by ID
- `listTaskPushNotificationConfigs` - List all configs for a task
- `deleteTaskPushNotificationConfig` - Remove a webhook config

## Update delivery mechanisms

| Mechanism | When to use | Requirements |
|---|---|---|
| Polling | Simple clients, infrequent updates | None - always available |
| Streaming (SSE) | Real-time updates, interactive UIs | `capabilities.streaming: true` |
| Push notifications | Long-running tasks, serverless clients | `capabilities.push_notifications: true` |
