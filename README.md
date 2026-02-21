# 🐕 PiDog Control — Web Frontend

A mobile-first, dark-theme React web app for controlling a [PiDog](https://www.sunfounder.com/products/pidog) robot dog. Built for demo use — pick up your phone, open the app, and speak a command. Voice control is the hero feature; button controls, live camera, sensor dashboards, and log streaming are a swipe away.

| Voice (desktop) | Control | Camera | Sensors |
|---|---|---|---|
| ![Voice page](https://github.com/user-attachments/assets/51570a51-b223-4890-9e53-882a77bb44d9) | ![Control page](https://github.com/user-attachments/assets/3d35b55a-a5ce-409d-b859-11354c148c89) | ![Camera page](https://github.com/user-attachments/assets/1b4f9019-f09b-46ca-9ecd-35e2e625dbc9) | ![Sensors page](https://github.com/user-attachments/assets/e310660d-bfea-4b36-bb1f-9965fa877391) |

**Mobile (390 px portrait):**

![Mobile voice view](https://github.com/user-attachments/assets/4a42c022-4fe5-4988-a6e4-6a8ac6a364d3)

---

## Features

### 🎤 Voice Control (default tab)
Hold the mic button and speak a natural-language command. The audio is recorded, encoded to 16-bit PCM WAV, and sent to the PiDog API's Whisper + LLM pipeline. The AI response and the list of executed actions appear on-screen with colour-coded pill badges.

- **Touch devices:** first tap requests microphone permission; second tap begins recording
- **Desktop:** hold mouse button to record; silence detection stops recording automatically after 2 s of quiet (max 12 s)
- Animated pulse rings and glow states give clear visual feedback for every pipeline stage (idle → recording → transcribing → AI response → success / error)

### 🎛️ Control
Full manual control panel for the robot:

| Section | What it does |
|---|---|
| **Emergency Stop** | Sticky red banner at the top — always reachable; calls `POST /api/v1/actions/stop` |
| **D-pad** | Directional movement (forward / back / left / right / stop); hold to repeat every 500 ms |
| **Action Grid** | 30 one-tap actions colour-coded by body part (🔵 legs · 🟣 head · 🟡 tail · 🩵 multi) |
| **Action Speed** | Global speed slider (0–100, default 50) applied to all action grid taps |
| **Servo Sliders** | Direct head control (yaw ±90°, roll ±70°, pitch −45→30°) and tail (±90°), debounced 150 ms |
| **RGB Lighting** | 6 animation styles, 9 colour presets, BPS and brightness sliders |

### 📷 Camera
Live MJPEG feed served directly from the Pi, displayed as a native `<img>` element (no JavaScript frame decoding). Includes Start / Stop and Snapshot controls. A `[MOCK]` badge appears when the API is running in mock mode so hardware developers always know their feed state. If the stream drops, a reconnect overlay appears and the `src` refreshes every 3 s.

### 📡 Sensors
Real-time dashboard updated at 5 Hz via WebSocket:

- **Battery** — voltage with green / yellow / red threshold colouring and a persistent low-battery banner
- **Distance** — visual bar gauge, 0–300 cm
- **IMU** — pitch and roll bars with degree readout
- **Touch** — left / right / slide touch state visualisation

### 📋 Logs
Live log stream from the WebSocket `log` channel. Colour-coded by level (`DEBUG` · `INFO` · `WARNING` · `ERROR` · `CRITICAL`), filterable by level, with an auto-scroll toggle and a clear button.

### 🤖 Agent Chat
Text-based AI chat panel that sends messages to the LLM agent running on the Pi. Responses include the actions the robot executed.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite 7 |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styles | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router v7 |
| Icons | Lucide React |
| Tests | Vitest + React Testing Library |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (or [Bun](https://bun.sh/))
- A **PiDog API** server running and accessible on your network (see [command-pidog](https://github.com/illogical/command-pidog) for the API project)

### 1. Clone and install

```bash
git clone https://github.com/illogical/command-pidog-web.git
cd command-pidog-web
npm install        # or: bun install
```

### 2. Configure environment

Copy the example env file and fill in your Pi's address:

```bash
cp .env.example .env
```

```env
# .env
VITE_API_URL=http://YOUR_PI_IP:8000
VITE_WS_URL=ws://YOUR_PI_IP:8000
```

> **Local dev proxy:** If you run the frontend from the same machine as the API (or tunnel with SSH), you can leave both values blank. The Vite dev server proxies `/api` and `/health` to `http://localhost:8000` automatically.
>
> **Tailscale:** Set `VITE_API_URL=https://command-pidog-api.<tailnet>.ts.net` and `VITE_WS_URL=wss://command-pidog-api.<tailnet>.ts.net` for a private remote connection.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The Voice tab loads by default.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint across all source files |
| `npm run test` | Run unit tests with Vitest |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts        # Typed fetch wrapper for every API endpoint
│   ├── websocket.ts     # WebSocket singleton with auto-reconnect (3 s)
│   └── types.ts         # TypeScript interfaces mirroring the FastAPI models
├── stores/
│   └── robotStore.ts    # Zustand store (sensors, status, chat, WS state)
├── hooks/
│   ├── useWebSocket.ts  # Connects WS singleton → Zustand on mount
│   ├── useVoiceRecorder.ts  # Push-to-talk state machine + WAV encoder
│   ├── useAgent.ts      # AI chat state
│   ├── useCamera.ts     # Camera start/stop/status polling
│   ├── useSensors.ts    # Sensor data from store
│   └── useRobotStatus.ts
├── components/
│   ├── layout/          # Layout, TabNav, StatusStrip
│   ├── voice/           # VoiceButton, TranscriptDisplay, ResponseDisplay, AvailableCommands
│   ├── controls/        # EmergencyStop, DirectionalPad, ActionGrid, ServoSliders, RGBControl
│   ├── camera/          # CameraStream, CameraControls, CameraStatusBar
│   ├── sensors/         # SensorDashboard, BatteryIndicator, DistanceGauge, IMUDisplay, TouchIndicator
│   ├── agent/           # ChatPanel, AgentStatus
│   └── logs/            # LogViewer
├── pages/               # VoicePage, ControlPage, CameraPage, SensorsPage, AgentPage, LogsPage
└── lib/
    ├── audio.ts         # WAV encoder, RMS silence detection, MIME type detection
    └── constants.ts     # Action list, servo limits, colour maps
```

---

## API Connection

The frontend connects to the PiDog FastAPI backend:

| Transport | Default (dev proxy) | Production |
|---|---|---|
| REST | `/api/v1/…` → `localhost:8000` | `VITE_API_URL/api/v1/…` |
| WebSocket | `ws://localhost/api/v1/ws` | `VITE_WS_URL/api/v1/ws` |

The WebSocket automatically reconnects every 3 seconds on disconnect. A status dot in the header strip shows the live connection state on every page.

### Key API endpoints used

| Method | Path | Used for |
|---|---|---|
| `GET` | `/api/v1/actions` | Populate action grid + command list |
| `POST` | `/api/v1/actions/execute` | Action grid, D-pad |
| `POST` | `/api/v1/actions/stop` | Emergency stop |
| `POST` | `/api/v1/servos/head` | Head servo sliders |
| `POST` | `/api/v1/servos/tail` | Tail servo slider |
| `POST` | `/api/v1/rgb/mode` | RGB lighting control |
| `POST` | `/api/v1/agent/voice` | Voice push-to-talk (audio → STT → LLM → actions) |
| `POST` | `/api/v1/agent/chat` | Text chat panel |
| `GET` | `/api/v1/camera/stream` | MJPEG live feed (`<img src>`) |
| `POST` | `/api/v1/camera/start` | Start camera |
| `POST` | `/api/v1/camera/stop` | Stop camera |
| `WS` | `/api/v1/ws` | Live sensors (5 Hz), status, logs |

---

## Deployment

### Option A — Vite preview (quick)

```bash
npm run build
npm run preview   # serves dist/ on http://localhost:4173
```

### Option B — Static file server (production)

```bash
npm run build
# Copy dist/ to any static host (nginx, Caddy, S3+CloudFront, etc.)
```

Point the static server's 404 handler at `index.html` so React Router's client-side routes resolve correctly.

### Option C — Alongside the FastAPI server

Copy `dist/` into `api/static/` on the Pi and mount it in FastAPI:

```python
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

### Option D — Standalone Docker + Tailscale

Add a `docker-compose.yml` with a Bun/nginx container and a Tailscale sidecar (hostname: `command-pidog-web`). Set the env vars before building:

```env
VITE_API_URL=https://command-pidog-api.<tailnet>.ts.net
VITE_WS_URL=wss://command-pidog-api.<tailnet>.ts.net
```

Then `npm run build` and start the stack independently of the API project.
