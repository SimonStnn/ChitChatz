# ChitChatz Server

This directory contains the server-side implementation of ChitChatz, a real-time WebSocket chat application.

## Technologies Used

- **Node.js** - Runtime environment
- **TypeScript** - For type-safe JavaScript
- **WebSocket (ws)** - For real-time bidirectional communication
- **JSON Web Tokens (JWT)** - For authentication
- **Zod** - For schema validation
- **dotenv** - For environment variable management
- **node-color-log** - For colorful console logging

## Directory Structure

```text
server/
├── src/             # Source code
│   ├── const.ts     # Message schema and type definitions
│   └── index.ts     # Main server implementation
├── dist/           # Build output directory (generated)
└── package.json    # Project configuration and dependencies
```

## Key Components

### WebSocket Server (`index.ts`)

The main server component that:

- Creates a WebSocket server
- Manages client connections
- Handles message routing
- Manages room creation, joining, and leaving
- Authenticates clients with JWT
- Broadcasts messages to room members

### Message Schema (`const.ts`)

Defines Zod schemas for message validation and TypeScript types for:

- Client-to-server messages
- Server-to-client responses
- JWT payload structure

## API Documentation

### Client to Server Messages

| Event        | Payload                           | Description                    |
| ------------ | --------------------------------- | ------------------------------ |
| `register`   | `{ name: string }`                | Register with a username       |
| `get_room`   | `{ jwt: string }`                 | Get current room information   |
| `get_rooms`  | `{ jwt: string }`                 | Get list of available rooms    |
| `join_room`  | `{ room: string, jwt: string }`   | Join a specific room           |
| `message`    | `{ data: string, jwt: string }`   | Send a message to current room |
| `leave_room` | `{ jwt: string }`                 | Leave the current room         |
| `error`      | `{ data: string[], jwt: string }` | Indicate an error              |

### Server to Client Responses

| Event      | Payload                                                     | Description               |
| ---------- | ----------------------------------------------------------- | ------------------------- |
| `register` | `{ data: {}, jwt?: string }`                                | Registration confirmation |
| `room`     | `{ data: string \| null, jwt?: string }`                    | Current room information  |
| `rooms`    | `{ data: string[], jwt?: string }`                          | List of available rooms   |
| `message`  | `{ data: { from: string, content: string }, jwt?: string }` | Message from a user       |
| `error`    | `{ data: string[], jwt?: string }`                          | Error messages            |

## Room Management

The server handles room management with the following features:

- Rooms are stored in a Map with room name as key and Set of WebSocket connections as value
- When a client joins a room, they're added to that room's Set
- When a room becomes empty, it's automatically removed
- Messages are broadcast to all clients in the same room

## Authentication

The server uses JWT (JSON Web Tokens) for authentication:

- Tokens are issued when a client registers
- Tokens contain the client's name and current room
- Tokens are signed with a secret key from environment variables
- Tokens expire after 1 hour
- The server validates tokens for all authenticated requests

## Scripts

- `npm run dev` - Start the development server with hot reloading using nodemon
- `npm run build` - Build the TypeScript project
- `npm run start` - Start the production server

## Building and Running

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. For production build and run:

   ```bash
   npm run build
   npm run start
   ```

## Environment Configuration

The server requires a `.env` file in the project root with the following variables:

- `SECRET`: Secret key for JWT signing (required)
- `PORT`: Server port (optional, defaults to 3000)

## Error Handling

The server handles errors in several ways:

- Zod validation for incoming messages
- JWT verification
- Proper error responses to clients
- Logging of errors and events with node-color-log

## WebSocket Connection Flow

1. Client establishes a WebSocket connection
2. Client registers with a username
3. Server validates the username and issues a JWT
4. Client uses the JWT for all subsequent requests
5. Server validates the JWT for each request
6. When the connection closes, the client is removed from any rooms
