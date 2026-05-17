# Contributing to NetTrek

## Dev Setup

```bash
git clone <repo-url>
cd nettrek
npm install
npm run dev
```

The Vite dev server runs on port 4200 with hot reload.

## Project Structure

- **`src/shmup/`** — Single-player campaign (the main game mode)
- **`src/core/`** + **`src/renderer/`** + **`src/net/`** — Multiplayer mode
- **`server/`** — Node.js WebSocket server for multiplayer

## Adding a New Stage

1. Add a `Stage` entry in `src/shmup/stages.ts` with waves and a `BossConfig`
2. Add a matching environment config in `src/shmup/renderer.ts` (`STAGE_ENVIRONMENTS` array)
3. Boss attack patterns scale automatically based on phase count and HP

## Adding Enemies

Enemy types are defined in `src/shmup/types.ts` (`ENEMY_STATS`). Movement patterns live in `updateEnemy()` in `engine.ts`.

## Build & Test

```bash
npx tsc --noEmit     # Type check
npm run build        # Full production build
npm run preview      # Test production build locally
```

## Code Style

- TypeScript strict mode
- No framework dependencies on the client (vanilla Canvas 2D)
- Keep the game loop allocation-free where possible (reuse objects)
- Particle caps exist to prevent performance degradation — respect them
