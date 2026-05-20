# B-003 — Orphaned lobby module: wire up or delete

- **Type:** Bug / tech debt
- **Priority:** P3
- **Effort:** S
- **Status:** Backlog

## Problem

`src/renderer/lobby.ts` is not imported anywhere in `src/` — it's dead code.
It was flagged in a security audit for an `innerHTML` XSS via remote player
names; that was hardened (commit cf98784) but the module still ships nothing
because nothing references it. Either the multiplayer lobby is a real planned
feature and should be wired up, or this is abandoned code that should go.

## Acceptance criteria

- [ ] Decision recorded: is multiplayer lobby in scope?
- [ ] If yes — wire `LobbyScreen` into the multiplayer entry flow and verify
      the `updatePlayers` DOM path renders
- [ ] If no — delete `src/renderer/lobby.ts` (and audit `src/renderer/*` for
      other orphaned multiplayer-era modules: `chat.ts`, `minimap.ts`, etc.)

## Notes / files

- `src/renderer/lobby.ts`, `src/renderer/chat.ts`, `src/renderer/minimap.ts`
- `server/game-server.js` — the multiplayer server still exists; clarifying
  multiplayer scope unblocks this and informs F-001 sequencing.
