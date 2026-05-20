# F-012 — Leaderboard client integration

- **Type:** Feature
- **Priority:** P2
- **Effort:** M
- **Status:** Backlog

## Problem

`server/api.js` exposes `/leaderboard` and `/score` (now validated and
clamped), but the game client doesn't submit scores or display rankings.
The backend half exists; the player-facing half does not.

## Goal

Players see how they rank and have a reason to chase a better run.

## Acceptance criteria

- [ ] Client submits run results to `/score` after a stage/game completes
- [ ] Leaderboard view (in hangar or post-game) fetches and displays `/leaderboard`
- [ ] Player name capture (reuse beta-signup name or a chosen handle)
- [ ] Graceful offline behavior — no blocking, no errors if API unreachable
- [ ] Depends on B-002 (API reachable over HTTPS in prod)

## Notes / files

- `server/api.js` — endpoints already hardened (score clamping, name
  sanitization, CORS allowlist)
- `src/main.ts` — run-completion hook for submission
- `src/shmup/hangar.ts` — natural home for the leaderboard view
