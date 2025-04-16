# ChitChatz API Documentation

This section documents the WebSocket API used for communication between the ChitChatz client and server.

## API Overview

ChitChatz uses a WebSocket-based API with JSON messages for real-time communication. The API uses:

- **WebSocket Protocol**: For real-time bi-directional communication
- **JSON Messages**: For structured data exchange
- **JWT Authentication**: For secure, stateless authentication

## Documentation Index

- [Client API Reference](client-api.md) - Client-side API implementation details
- [Server API Reference](server-api.md) - Server-side API implementation details

## Message Format

All messages follow a standard format with an `event` field indicating the message type and additional fields depending on the event type.

### Basic Message Structure

```json
{
  "event": "event_name",
  "data": {},
  "jwt": "optional_jwt_token"
}
```

## API Endpoints

The WebSocket server handles the following endpoints:

| Event        | Direction       | Purpose                               |
| ------------ | --------------- | ------------------------------------- |
| `register`   | Client → Server | Register a new client with a username |
| `register`   | Server → Client | Confirm registration with JWT         |
| `get_room`   | Client → Server | Request the current room              |
| `room`       | Server → Client | Respond with the current room         |
| `get_rooms`  | Client → Server | Request available rooms               |
| `rooms`      | Server → Client | Respond with available rooms          |
| `join_room`  | Client → Server | Join a specific room                  |
| `message`    | Client → Server | Send a message to the current room    |
| `message`    | Server → Client | Broadcast a message to room members   |
| `leave_room` | Client → Server | Leave the current room                |
| `error`      | Server → Client | Indicate an error condition           |

See the detailed API references for complete message specifications and usage examples.
