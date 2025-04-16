# ChitChatz Client

This directory contains the client-side implementation of ChitChatz, a real-time WebSocket chat application.

## Technologies Used

- **TypeScript** - For type-safe JavaScript
- **SCSS** - For styling
- **jQuery** - For DOM manipulation
- **esbuild** - For bundling
- **WebSocket API** - For real-time communication with the server

## Directory Structure

```text
client/
├── assets/           # Static assets
│   └── images/       # Image files including logos
├── dist/            # Build output directory (generated)
├── src/             # Source code
│   ├── components/  # UI components
│   │   ├── message.ts  # Message rendering and handling
│   │   └── room.ts     # Room list item rendering
│   ├── controller/  # Application logic
│   │   ├── state.ts     # Application state management
│   │   └── websocket/   # WebSocket communication
│   │       ├── index.ts       # WebSocket initialization
│   │       ├── on_close.ts    # Connection close handler
│   │       ├── on_error.ts    # Error handler
│   │       ├── on_message.ts  # Message handler
│   │       ├── on_open.ts     # Connection open handler
│   │       └── send.ts        # Message sending utility
│   ├── styles/      # SCSS stylesheets
│   │   ├── base.scss        # Base styles
│   │   ├── components.scss  # Component-specific styles
│   │   ├── main.scss        # Main stylesheet
│   │   ├── reset.scss       # CSS reset
│   │   └── variables.scss   # SCSS variables
│   ├── const.ts     # Constants and configuration
│   ├── index.ts     # Entry point
│   ├── types.ts     # TypeScript type definitions
│   └── utils.ts     # Utility functions
├── index.html       # Main HTML file
└── package.json     # Project configuration and dependencies
```

## Key Components

### Application State (`state.ts`)

The `AppState` class manages the application state, including:

- WebSocket connection
- JWT authentication token
- Current room information
- Available rooms list
- Client name
- Token refresh interval

### WebSocket Communication

The WebSocket module handles communication with the server:

- `index.ts`: Initializes the WebSocket connection
- `on_open.ts`: Handles connection establishment
- `on_message.ts`: Processes incoming messages
- `on_close.ts`: Handles connection closure
- `on_error.ts`: Handles connection errors
- `send.ts`: Sends messages to the server

### UI Components

- `message.ts`: Renders chat messages and handles message interactions
- `room.ts`: Renders room list items and handles room selection

## Scripts

- `npm run build` - Build the application
- `npm run dev` - Start development server with hot reloading
- `npm run start` - Start the HTTP server
- `npm run clean` - Clean the build directory
- `npm run watch` - Watch for changes and rebuild (TS and SCSS)

## Building and Running

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. For production build:

   ```bash
   npm run build
   ```

## WebSocket Communication Flow

1. The client establishes a WebSocket connection with the server
2. Upon successful connection, the client registers with a username
3. The server issues a JWT token which is stored in cookies
4. The client uses this token for all subsequent requests
5. The token contains the user's name and current room
6. The token is automatically renewed before expiration

## UI Interaction Flow

1. User enters a username to register
2. Available chat rooms are displayed in the sidebar
3. User can join an existing room or create a new one
4. Messages in the current room are displayed in the main area
5. User can type and send messages in the input field at the bottom
6. Messages are sent to the server and broadcasted to all users in the room
7. User can leave the current room or join a different one

## Authentication

- JWT tokens are stored in cookies
- Tokens are automatically renewed before expiration
- Token contains username and current room information
