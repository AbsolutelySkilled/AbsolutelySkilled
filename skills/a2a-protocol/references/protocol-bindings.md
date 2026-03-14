<!-- Part of the A2A Protocol AbsolutelySkilled skill. Load this file when
     implementing specific protocol bindings (JSON-RPC, gRPC, HTTP+JSON). -->

# Protocol Bindings Reference

A2A defines a three-layer architecture: a canonical data model (Protocol Buffers),
abstract operations (binding-independent), and protocol bindings. All three
bindings are functionally equivalent.

---

## JSON-RPC 2.0 Binding

All methods are prefixed with `a2a.` and sent as HTTP POST to the agent endpoint.

### Methods

| Method | Description | Returns |
|---|---|---|
| `a2a.sendMessage` | Send message to agent | Task or Message |
| `a2a.sendStreamingMessage` | Streaming message send | StreamResponse (SSE) |
| `a2a.getTask` | Get task by ID | Task |
| `a2a.listTasks` | List tasks with filters | ListTasksResponse |
| `a2a.cancelTask` | Cancel a task | Task |
| `a2a.subscribeToTask` | Subscribe to task updates | StreamResponse (SSE) |
| `a2a.createTaskPushNotificationConfig` | Create webhook config | PushNotificationConfig |
| `a2a.getTaskPushNotificationConfig` | Get webhook config | PushNotificationConfig |
| `a2a.listTaskPushNotificationConfigs` | List webhook configs | PushNotificationConfig[] |
| `a2a.deleteTaskPushNotificationConfig` | Delete webhook config | void |
| `a2a.getExtendedAgentCard` | Get authenticated card | AgentCard |

### Service parameters

Passed in the `params` object alongside method-specific params:

```json
{
  "jsonrpc": "2.0",
  "method": "a2a.sendMessage",
  "id": "req-1",
  "params": {
    "message": { ... },
    "a2a-version": "1.0",
    "a2a-extensions": "urn:example:ext1,urn:example:ext2"
  }
}
```

### Streaming

For `sendStreamingMessage` and `subscribeToTask`, the server responds with
`Content-Type: text/event-stream` (SSE). Each event is a JSON-encoded
`StreamResponse` wrapper.

---

## gRPC Binding

### Service definition

```protobuf
service A2AService {
  // Unary RPCs
  rpc SendMessage(SendMessageRequest) returns (SendMessageResponse);
  rpc GetTask(GetTaskRequest) returns (Task);
  rpc ListTasks(ListTasksRequest) returns (ListTasksResponse);
  rpc CancelTask(CancelTaskRequest) returns (Task);
  rpc GetExtendedAgentCard(GetExtendedAgentCardRequest) returns (AgentCard);
  rpc CreateTaskPushNotificationConfig(...) returns (PushNotificationConfig);
  rpc GetTaskPushNotificationConfig(...) returns (PushNotificationConfig);
  rpc ListTaskPushNotificationConfigs(...) returns (...);
  rpc DeleteTaskPushNotificationConfig(...) returns (google.protobuf.Empty);

  // Server-streaming RPCs
  rpc SendStreamingMessage(SendMessageRequest) returns (stream StreamResponse);
  rpc SubscribeToTask(SubscribeToTaskRequest) returns (stream StreamResponse);
}
```

### Service parameters

Transmitted via gRPC metadata headers:
- `a2a-version`: Protocol version
- `a2a-extensions`: Comma-separated extension URIs

---

## HTTP+JSON/REST Binding

RESTful endpoints using standard HTTP methods.

### Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/messages` | Send a message |
| POST | `/messages:stream` | Send streaming message (SSE response) |
| GET | `/tasks/{id}` | Get task by ID |
| GET | `/tasks` | List tasks (query params for filtering) |
| POST | `/tasks/{id}:cancel` | Cancel a task |
| POST | `/tasks/{id}:subscribe` | Subscribe to task updates (SSE) |
| POST | `/tasks/{taskId}/pushNotificationConfigs` | Create push config |
| GET | `/tasks/{taskId}/pushNotificationConfigs/{configId}` | Get push config |
| GET | `/tasks/{taskId}/pushNotificationConfigs` | List push configs |
| DELETE | `/tasks/{taskId}/pushNotificationConfigs/{configId}` | Delete push config |
| GET | `/agent-card` | Get extended agent card (authenticated) |

### Query parameters for listing

| Parameter | Type | Description |
|---|---|---|
| `contextId` | string | Filter by context |
| `status` | string | Filter by task state |
| `pageSize` | int | Results per page |
| `pageToken` | string | Pagination cursor |

### Service parameters

Passed as HTTP headers:
- `A2A-Version: 1.0`
- `A2A-Extensions: urn:example:ext1,urn:example:ext2`

### Multi-tenant support

For multi-tenant deployments, a tenant path parameter can prefix all endpoints:
`/tenants/{tenant}/messages`, `/tenants/{tenant}/tasks/{id}`, etc.

---

## StreamResponse wrapper

All streaming operations return `StreamResponse` objects, each containing
exactly one of:

| Field | Type | When sent |
|---|---|---|
| `task` | Task | Full task state update |
| `message` | Message | Agent message in conversation |
| `statusUpdate` | TaskStatusUpdateEvent | Task state transition |
| `artifactUpdate` | TaskArtifactUpdateEvent | New or updated artifact chunk |

`TaskArtifactUpdateEvent` includes `append` (boolean) and `last_chunk` (boolean)
fields for incremental artifact streaming.
