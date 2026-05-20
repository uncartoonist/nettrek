# B-003 — Orphaned lobby module: RESOLVED (decision)

- **Type:** Bug / tech debt
- **Priority:** P3
- **Status:** Resolved — decision recorded, work folded into F-015

## Original problem

`src/renderer/lobby.ts` (and `chat.ts`, `minimap.ts`) were not imported
anywhere in `src/` — dead code. The open question was: wire them up, or
delete them?

## Resolution

**Decision (2026-05-20): wire them up.** Multiplayer is confirmed on the
project roadmap. The lobby / chat / minimap modules and the
`server/game-server.js` stack are not dead code — they are pre-built
**multiplayer scaffolding**.

The integration work is no longer a tech-debt cleanup; it is part of the
multiplayer epic. See **F-015 — Multiplayer**.

## Action

- No standalone work remains under this ticket.
- `src/renderer/lobby.ts` / `chat.ts` / `minimap.ts` and `server/*` are to
  be kept and reconciled with the current engine under F-015.
- Do not delete these modules.
