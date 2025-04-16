# ChitChatz

ChitChatz is a real-time chat application built with WebSockets, allowing users to create and join chat rooms, send messages, and communicate in real-time.

![ChitChatz Logo](client/assets/images/logo_full.png)

## Features

- Real-time messaging using WebSockets
- Create and join chat rooms
- JWT authentication
- Responsive design
- Simple and intuitive user interface

## Architecture

ChitChatz follows a client-server architecture:

### Server

- Built with Node.js and WebSocket (ws library)
- JWT-based authentication
- Room management (creation, joining, leaving)
- Real-time message broadcasting

### Client

- Built with TypeScript, SCSS, and jQuery
- WebSocket communication
- Responsive UI
- State management

## Project Structure

```text
ChitChatz/
├── client/               # Client-side code
│   ├── assets/           # Static assets (images, etc.)
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── controller/   # Application logic & state management
│   │   ├── styles/       # SCSS styles
│   │   ├── const.ts      # Constants and types
│   │   ├── index.ts      # Entry point
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── utils.ts      # Utility functions
│   ├── index.html        # Main HTML file
│   └── package.json      # Client dependencies
│
├── server/               # Server-side code
│   ├── src/              # Source code
│   │   ├── const.ts      # Constants and types
│   │   └── index.ts      # Server entry point
│   └── package.json      # Server dependencies
│
├── .env                  # Environment variables
├── .env.template         # Template for environment variables
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ChitChatz.git
   cd ChitChatz
   ```

2. Create a `.env` file from the template:

   ```bash
   cp .env.template .env
   ```

3. Edit the `.env` file and set the required variables:

   ```text
   SECRET=your_jwt_secret_key
   PORT=3000  # Optional, defaults to 3000
   ```

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   For development with hot-reload:

   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the client development server:

   ```bash
   npm start
   ```

   For production build:

   ```bash
   npm run build
   ```

## Usage

1. Open the client application in your browser (default: <http://localhost:8080>)
2. Enter a username to register
3. Create a new room or join an existing one
4. Start chatting!

## WebSocket API

### Client to Server Messages

| Event        | Payload                         | Description                    |
| ------------ | ------------------------------- | ------------------------------ |
| `register`   | `{ name: string }`              | Register with a username       |
| `get_room`   | `{ jwt: string }`               | Get current room information   |
| `get_rooms`  | `{ jwt: string }`               | Get list of available rooms    |
| `join_room`  | `{ room: string, jwt: string }` | Join a specific room           |
| `message`    | `{ data: string, jwt: string }` | Send a message to current room |
| `leave_room` | `{ jwt: string }`               | Leave the current room         |

### Server to Client Messages

| Event      | Payload                                                     | Description               |
| ---------- | ----------------------------------------------------------- | ------------------------- |
| `register` | `{ data: {}, jwt?: string }`                                | Registration confirmation |
| `room`     | `{ data: string \| null, jwt?: string }`                    | Current room information  |
| `rooms`    | `{ data: string[], jwt?: string }`                          | List of available rooms   |
| `message`  | `{ data: { from: string, content: string }, jwt?: string }` | Message from a user       |
| `error`    | `{ data: string[], jwt?: string }`                          | Error messages            |

## Authentication

ChitChatz uses JWT (JSON Web Tokens) for authentication:

- Tokens are issued upon registration
- Tokens contain the user's name and current room
- Tokens expire after 1 hour
- Token renewal is handled automatically by the client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Acknowledgments

- [ws](https://github.com/websockets/ws) - WebSocket library
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT implementation
