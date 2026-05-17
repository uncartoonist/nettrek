# NetTrek — Tactical Assault

Music-reactive vertical scrolling space combat. Defend the Federation across 6 stages of increasingly brutal enemies, culminating in massive boss fights at the end of each level.

## Quick Start

```bash
npm install
npm run dev          # Client dev server (Vite + HMR)
```

Open http://localhost:4200 in your browser.

### Multiplayer (optional)

```bash
npm run server       # WebSocket game server on :4300, API on :4301
npm run dev:all      # Both server + client
```

## Controls

### Shmup Mode (single-player campaign)
- **Mouse** — move ship (follows cursor)
- **Left click / hold** — fire weapons
- **Right click** — fire special weapons (missiles, laser, phaser)
- **B** — bomb (clears screen)
- **WASD / Arrows** — keyboard movement alternative
- **ESC** — exit to menu

### Multiplayer Mode
- **WASD / Arrows** — thrust, brake, turn
- **Space** — fire torpedo
- **F** — fire phaser
- **C** — cloak
- **Tab** — map/scores
- **B** — bomb
- **V / G** — beam down/up armies

## Architecture

```
src/
├── main.ts              # Boot, input handling, game loop
├── core/
│   ├── game.ts          # Multiplayer game state + logic
│   └── types.ts         # Shared entity types (ships, factions)
├── shmup/
│   ├── engine.ts        # Shmup game loop, physics, combat
│   ├── renderer.ts      # Canvas rendering (enemies, bosses, particles, HUD)
│   ├── types.ts         # Shmup-specific types (stages, bullets, powerups)
│   ├── stages.ts        # 6 stage definitions with wave patterns + boss configs
│   ├── director.ts      # Music-reactive enemy/event spawning
│   └── hangar.ts        # Upgrade shop between stages
├── audio/
│   ├── music.ts         # Stage music playback
│   ├── sfx.ts           # Sound effects
��   └── analyzer.ts      # FFT music analysis for beat-reactive gameplay
├── renderer/
│   ├── canvas.ts        # Multiplayer renderer
│   ├── minimap.ts       # Tactical map overlay
│   ├── effects.ts       # Visual effects
│   ├── lobby.ts         # Lobby UI
│   ├── menu.ts          # Menu screens
│   └── chat.ts          # In-game chat
├── input/
│   ├── keyboard.ts      # Keyboard bindings
│   └── touch.ts         # Touch/mobile controls
└── net/
    └── client.ts        # WebSocket multiplayer client

server/
├── index.js             # Entry — WebSocket + HTTP API
├── game-server.js       # Server-authoritative game loop (20 tick/s)
└── api.js               # REST API (signups, leaderboard)
```

**Stack:** TypeScript, Vite, HTML5 Canvas (no framework), Node.js WebSocket server

## Game Features

- **6 stages** — Neutral Zone, Romulan Nebula, Orion Syndicate, Deep Space Anomaly, Wormhole Transit, Final Fortress
- **Boss fights** — Massive multi-phase bosses with weak points, unique attack patterns, and escalating difficulty
- **Weapon upgrades** — Main gun, wing guns, missiles, lasers, phasers (collect power-ups or buy in hangar)
- **Music-reactive** — Enemy spawns, scroll speed, and visual effects pulse with the beat
- **Persistent progress** — Stars (currency) and upgrades saved to localStorage
- **Mobile support** — Touch controls, responsive canvas

## Boss System

Each stage ends with a massive capital ship boss:

| Stage | Boss | HP | Phases |
|-------|------|----|--------|
| 1 | K'Tagh Warbird | 200 | 3 |
| 2 | IRW Valdore | 350 | 4 |
| 3 | Orion Flagship | 500 | 5 |
| 4 | Anomaly Guardian | 600 | 4 |
| 5 | Rift Sovereign | 700 | 4 |
| 6 | Fortress Command | 1000 | 5 |

Bosses have destructible **weak points** (glowing yellow orbs) that take 2x damage and drop power-ups when destroyed. Attack patterns escalate per phase: wing fans → spirals → bullet curtains → rage mode with minion spawns.

## Development

```bash
npm run build        # Production build (tsc + vite)
npm run preview      # Preview production build
```

## Deployment

The client builds to `dist/` as a static site. Currently hosted on CloudFront at `d2pu3pmby1pmk.cloudfront.net`.
