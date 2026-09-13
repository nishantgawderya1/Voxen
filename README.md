# Voxen

Browser-based video calling with a waiting room, host controls, in-call chat
and live transcription. Media travels peer-to-peer over WebRTC; the server
handles signalling, admission and accounts.

```
voxen/
├── backend/     Express 5 · Socket.IO · MongoDB · Groq (Whisper)
└── frontend/    React 19 · Vite · Tailwind · React Router
```

## Running locally

Requires Node 20+ and a MongoDB instance.

```bash
# backend
cd backend
cp .env.example .env          # set MONGO_URI at minimum
npm install
npm run dev                   # http://localhost:8000

# frontend (second terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

The frontend talks to `http://localhost:8000` in development. Point it
elsewhere with `VITE_SERVER_URL`.

## Tests

```bash
cd backend && npm test
```

Covers the input validators, the JWT auth middleware, and the socket room
lifecycle — admission, host transfer, and the chat-isolation guarantee
between meetings that reuse a room code. No database required; the socket
tests run a real server on an ephemeral port.

## Configuration

Every variable is documented in `backend/.env.example` and
`frontend/.env.example`. The ones that matter for a deployment:

| Variable | Where | Notes |
|---|---|---|
| `MONGO_URI` | backend | Required. Boot fails without it. |
| `JWT_SECRET` | backend | **Required in production.** Outside production a random one is generated per boot, which invalidates sessions on every restart. |
| `CORS_ORIGINS` | backend | **Required in production.** Comma-separated browser origins, no trailing slash. Applies to both the REST API and Socket.IO. |
| `GROQ_API_KEY` | backend | Transcription returns 503 until set. |
| `VITE_SERVER_URL` | frontend | Backend origin for the built bundle. |
| `VITE_TURN_URLS` | frontend | TURN relay — see below. |

## Deploying

1. Set `NODE_ENV=production`, `JWT_SECRET` and `CORS_ORIGINS`. The server
   refuses to start without them rather than failing on the first request.
2. Point your platform's health check at `GET /healthz`. It returns 503 while
   the database connection is down, so a broken deploy won't take traffic.
3. **Configure a TURN server.** STUN alone only connects peers that can reach
   each other directly; behind symmetric NAT or a corporate firewall the
   candidates never pair and the call connects to nothing. This is the usual
   cause of "works for me, not for them". Set `VITE_TURN_URLS`,
   `VITE_TURN_USERNAME` and `VITE_TURN_CREDENTIAL` at build time.
4. Replace `https://voxen.app` in `frontend/index.html` (canonical URL, Open
   Graph, JSON-LD) with the real domain before going live.

`SIGTERM` and `SIGINT` drain in-flight connections before exit, so rolling
deploys don't cut active calls.

## How a call works

1. The first person to open a room code is admitted immediately and becomes
   the host. Everyone after them knocks and waits.
2. The host sees each request and admits or denies it. If the host leaves,
   the longest-standing participant is promoted; if everyone leaves while
   someone is still knocking, that person inherits the room.
3. Admitted peers exchange SDP and ICE through the server's `signal` event
   and connect directly. Audio and video never pass through the server.
4. Chat, transcripts, reactions, raised hands and mute state are relayed by
   the server and held in memory for the life of the room.

The room key is the meeting code, normalised — not the page URL — so a named
meeting (`/abc?name=Standup`) and a bare link (`/abc`) are the same room.

## Known limitations

- **Room state is in-process.** `connection`, `rooms` and `messages` live in
  the Node process, so the backend cannot be scaled beyond a single instance
  without moving that state to Redis (and adding the Socket.IO Redis adapter).
- **Chat and transcripts are not end-to-end encrypted.** Media is; anything
  relayed through the server is readable by the server.
- **Media is a full mesh.** Every participant sends their stream to every
  other participant, which stops being practical past a handful of people. A
  larger call needs an SFU.
- **No frontend test suite yet** — only the backend is covered.
- Social sign-in buttons are disabled; there is no OAuth provider wired up.
