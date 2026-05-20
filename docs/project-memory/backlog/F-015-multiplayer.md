# F-015 — Multiplayer

- **Type:** Feature (epic)
- **Priority:** P3 (roadmap — confirmed in scope, not imminent)
- **Effort:** XL — multi-sprint epic
- **Status:** Backlog

## Goal

Real-time multiplayer NetTrek. Confirmed on the roadmap. Scope and mode
(co-op vs. competitive vs. faction-warfare) to be defined in a dedicated
planning session.

## Existing scaffolding (head start)

A multiplayer-era stack already exists in the repo but is disconnected from
the shipped single-player game:

- `server/game-server.js` — authoritative tick loop, ship classes, planets,
  torpedoes, chat, faction logic. (Spawn-message validation hardened in the
  recent security audit.)
- `server/index.js` — server entry; `server/api.js` — DynamoDB beta-signup
  + leaderboard API.
- `src/renderer/lobby.ts` — lobby UI (XSS-hardened to use `textContent`).
- `src/renderer/chat.ts`, `src/renderer/minimap.ts` — multiplayer HUD.

This is genuine scaffolding to build on, not greenfield — but it predates
the current single-player engine and will need reconciliation.

## Open questions (resolve in planning before sprinting)

- **Mode:** co-op through the 11 campaign stages? Competitive faction
  warfare (the game-server's planet/army model)? Both?
- **Architecture fit:** the multiplayer server uses a different game model
  (planets, armies, ship classes) than the single-player shmup engine.
  Decide: unify, or run multiplayer as a separate mode.
- **Netcode:** authoritative server is already the shape; confirm transport
  (WebSocket), tick rate, client prediction / reconciliation needs.
- **Hosting:** first persistent server runtime for the game — overlaps with
  B-002 (API routing) and F-001's proxy infra.

## Acceptance criteria (epic — define properly at planning time)

- [ ] Multiplayer mode design doc + ADR (architecture decision: unified vs.
      separate game model)
- [ ] Lobby → match → play → results loop working for 2+ players
- [ ] `lobby.ts` / `chat.ts` / `minimap.ts` reconciled with the current
      renderer and wired in
- [ ] Server deployed and reachable (see B-002, infra overlap)
- [ ] Graceful disconnect / reconnect handling

## Notes

- Supersedes B-003 — the "orphaned lobby" question is resolved: those
  modules are kept as multiplayer scaffolding.
- Big enough to warrant its own planning sprint before implementation
  sprints. Sequence alongside or after F-001 (both need server infra).
