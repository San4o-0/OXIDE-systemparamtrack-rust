# 🦀 OXIDE — System Telemetry Dashboard

A fullstack system monitor. A **Rust** backend reads live OS metrics (CPU, memory,
disks, network, temperature) and streams them over **Server-Sent Events**; a **React**
frontend renders them as a real-time instrument panel.

The name is a pun: *Rust* is both the language and what metal does under heat — so the
UI themes load as oxidation (cool patina → warm brass → hot ember).

## Why Rust on the backend

The backend is written in Rust because system telemetry is exactly where Rust's
strengths pay off:

- **Direct OS access** — reads kernel/hardware counters through `sysinfo` with no runtime
  overhead or garbage collector pauses between samples.
- **Memory safety without a GC** — ownership and borrowing (`&self` / `&mut self`) are
  checked at compile time, so there are no data races even while many SSE clients stream
  concurrently.
- **Fearless async** — the `tokio` runtime drives thousands of connections on a handful of
  OS threads; each `.await` yields cooperatively instead of blocking.
- **Type-safe serialization** — `serde` turns plain structs into JSON, and `Option<T>`
  models "sensor not available" honestly (it becomes `null`) instead of faking a zero.

## Architecture

```
.
├── backend/     # Rust: axum + tokio + sysinfo
│   └── src/
│       ├── main.rs      entry point, runtime + server startup
│       ├── models.rs    data structures (serde → JSON)
│       ├── metrics.rs   metric collection via sysinfo
│       └── routes.rs    HTTP routes + SSE stream
└── frontend/    # React + Vite + TypeScript + recharts
    └── src/
        ├── App.tsx                  main screen + theme state
        ├── theme.ts                 OXIDE / Paper theme tokens
        ├── types.ts                 types (mirror of backend models)
        ├── utils.ts                 byte/rate formatting + oxidation ramp
        ├── api/useMetricsStream.ts  SSE subscription hook
        └── components/              gauges, charts, core matrix, disk list
```

Data flows one way: every second the backend collects a `MetricsSnapshot`, serializes it
to JSON, and pushes it as one SSE event. The frontend keeps a rolling history and redraws.

## What it collects

| Metric  | Detail |
|---------|--------|
| CPU     | global load, per-core load, representative temperature (°C) |
| Memory  | used / total, usage %, swap used / total |
| Disks   | per-volume used / total / usage % |
| Network | rx / tx throughput (bytes/sec) and cumulative totals, loopback excluded |

Temperature is chosen from the most representative sensor (`Package`/`Tctl`/`Tdie`, then
the hottest core, then `acpitz`); it is `null` where no sensor is exposed (e.g. inside a VM).

## Frontend

- **OXIDE** — the default dark "instrument" skin: gunmetal panels, a live oscilloscope
  hero, machined gauges, and a per-core heat matrix (core × time).
- **Paper** — a light "printed telemetry" skin (graph-paper grid, graphite ink). Toggle in
  the header; the choice persists in `localStorage`. The oxidation color ramp stays
  constant across both skins — only the substrate changes.

## Prerequisites

Install the two toolchains first.

```bash
# 1. C linker for building Rust (Ubuntu/Debian):
sudo apt update && sudo apt install build-essential

# 2. Rust toolchain (rustup + cargo):
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Node.js + npm for the frontend (Ubuntu/Debian):
sudo apt install nodejs npm
# or, preferably, via nvm: https://github.com/nvm-sh/nvm
```

## Running

Two terminals.

**Terminal 1 — backend:**

```bash
cd backend
cargo run            # serves on http://localhost:3000
```

Check it by hand:

```bash
curl http://localhost:3000/health       # -> ok
curl http://localhost:3000/api/metrics   # -> one JSON snapshot
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm install
npm run dev          # opens http://localhost:5173
```

Open <http://localhost:5173>. The charts update once per second.

## API

| Route          | Method | Response |
|----------------|--------|----------|
| `/health`      | GET    | `ok` |
| `/api/metrics` | GET    | a single `MetricsSnapshot` (JSON) |
| `/api/stream`  | GET    | SSE stream, one `MetricsSnapshot` per second |

## What this project demonstrates

- **Systems programming** — reading OS metrics through `sysinfo`.
- **Streaming** — Server-Sent Events instead of constant polling.
- **Async** — the `tokio` runtime and `async-stream` for the SSE loop.
- **Type-safe serialization** — `serde` mapping Rust structs to JSON.
- **Modular design** — code split into independent modules with clear ownership.
