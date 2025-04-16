# ChitChatz Architecture Documentation

This section provides an overview of the ChitChatz application architecture, its components, and how they interact.

## System Overview

ChitChatz is a real-time chat application built with a client-server architecture:

- **Server**: Node.js WebSocket server handling connections, rooms, and message distribution
- **Client**: Web-based UI for user interaction built with TypeScript, SCSS, and jQuery

## Architecture Diagram

```text
┌─────────────┐     WebSocket      ┌─────────────┐
│             │<------------------>│             │
│   Client    │   JSON Messages    │   Server    │
│             │                    │             │
└─────────────┘                    └─────────────┘
      │                                  │
      │                                  │
┌─────▼─────┐                      ┌─────▼─────┐
│  UI Layer │                      │ Room Mgmt │
└───────────┘                      └───────────┘
```

## Documentation Index

- [Component Description](components.md) - Detailed description of each component
- [Message Flow](flow.md) - Flow diagrams of key processes and interactions

## Key Architectural Decisions

### WebSocket for Real-Time Communication

ChitChatz uses WebSocket (ws library) for real-time bi-directional communication between client and server, allowing for:

- Low-latency message exchange
- Persistent connections
- Event-based messaging

### JWT for Authentication

JSON Web Tokens (JWT) are used for authentication, providing:

- Stateless authentication
- Client-side storage of authentication state
- Secure transmission of user identity

### Room-Based Message Broadcasting

Messages are organized by rooms:

- Each room maintains a set of connected clients
- Messages are broadcast only to clients in the same room
- Empty rooms are automatically removed
- Clients can join/leave rooms at any time

### State Management

- Server maintains room state and client-room associations
- Client maintains local state via the AppState singleton
- State is synchronized through WebSocket messages

See the individual documentation files for more detailed information about each architectural component and process.
