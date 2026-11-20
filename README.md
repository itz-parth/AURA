# AURA

Social listening rooms: create or join a room, sync YouTube playback with others, chat live, and share a queue. Built as a lobby (Nexus) plus per-room stages with host/guest permissions.

## What it does

- Login / signup with JWT authentication (PostgreSQL for accounts)
- Create rooms (6-digit codes) and join existing rooms — protected Nexus and Stage routes
- Host controls playback and queue; guests mirror the host
- Live room chat over Socket.IO
- YouTube playback via react-youtube (host drives, guests follow)
- Queue search via `/music/search` (ytmusicapi)

## Technology stack

**Backend:** FastAPI, async SQLAlchemy + PostgreSQL, python-jose (JWT), bcrypt, python-socketio, alembic, ytmusicapi

**Frontend:** React 19, Vite, Tailwind CSS v4, Socket.IO client, react-youtube, Framer Motion, Lucide React, react-router-dom

## Project structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, Socket.IO ASGI mount, room cleanup loop
│   ├── core/
│   │   ├── config.py        # DATABASE_URL, SECRET_KEY, JWT settings
│   │   └── security.py      # password hashing, JWT create/decode, OAuth2 scheme
│   ├── database/
│   │   └── connection.py    # async engine, session, Base, get_db()
│   ├── models/
│   │   └── user.py          # User SQLAlchemy model
│   ├── schemas/
│   │   └── auth.py          # RegisterRequest, LoginRequest
│   ├── routes/
│   │   ├── auth.py          # /auth/register, /auth/login
│   │   ├── room.py          # /rooms/ create/get/state/queue
│   │   └── music.py         # /music/search
│   ├── socket/
│   │   └── events.py        # flat @sio.event handlers (join_room, chat_message, sync_playback, sync_queue)
│   └── store.py             # in-memory room state (ROOMS dict)
├── alembic/                 # DB migrations for users table
├── requirements.txt
└── README.md
```

```
frontend/
├── src/
│   ├── main.jsx             # React entry
│   ├── App.jsx              # router + protected routes
│   ├── index.css            # Tailwind imports + design tokens
│   ├── auth.css             # auth-page styles
│   ├── socket.js            # socket.io-client singleton
│   ├── services/api.js      # API base + authenticated fetch helper
│   ├── context/AuthContext.jsx
│   ├── pages/               # Login, Signup, Nexus, SyncStage
│   ├── components/          # ChatPanel, StagePlayer, QueuePanel, JoinFrequencyModal, FloatingDock, AuthShell, MusicDiscovery, TrendingSocial
│   └── components/common/   # TrackRow, MobileTabBar
├── public/                  # favicon, nexus artwork
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Environment variables

Create `backend/.env` (never commit real values):

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection URL (asyncpg driver). Example: `postgresql+asyncpg://postgres:postgres@localhost:5432/aura` |
| SECRET_KEY | JWT signing secret (change in production) |

## Running locally

**Backend**
```
cd backend
pip install -r requirements.txt
# create .env with DATABASE_URL and SECRET_KEY
alembic upgrade head          # optional: creates the users table
uvicorn app.main:app --reload   # serves REST + Socket.IO on :8000
```

**Frontend**
```
cd frontend
npm install
npm run dev                   # Vite dev server on :5173
npm run build                 # production build
npm run lint                  # oxlint
```

The frontend expects the backend at `http://localhost:8000`.

## Socket.IO architecture

Flat event handlers (no manager classes). A single `socketio.ASGIApp` wraps the FastAPI app so REST and WebSocket share one port. `SID_ROOMS` maps `sid -> room_code`; room state lives in an in-memory `ROOMS` dict.

| Event | Direction | Guard | Effect |
|-------|-----------|-------|--------|
| join_room | C→S | none | `enter_room`, track sid, emit `joined` |
| chat_message | C→S→C | none | broadcast to room |
| sync_playback | C→S→C | sender is host | update room playback, emit `playback_synced` |
| sync_queue | C→S→C | sender is host | update room queue, emit `queue_synced` |
| disconnect | C→S | none | untrack sid |

Rooms stay in memory and are evicted by a background cleanup loop after 5 minutes of inactivity.
