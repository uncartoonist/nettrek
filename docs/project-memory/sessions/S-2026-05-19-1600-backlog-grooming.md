# S-2026-05-19-1600 — Backlog grooming pass

## Goal

Stand up Afterburner-style project memory and turn the NetTrek improvement
vision into a groomed, sprint-ready backlog.

## What was done

- Created `docs/project-memory/` — `backlog/`, `adr/`, `sessions/`.
- Drafted 17 backlog tickets (3 bugs, 14 features) — each scoped to fit a
  sprint slice. Index + suggested sprint sequencing in `backlog/README.md`.
- Wrote `ADR-001` recording the two-tier architecture decision for the
  agent-director feature (F-001).

## Context carried in

This grooming pass follows an extended run of iterative sessions that
landed: enemy movement profiles, pawn fleets, player-power HP scaling,
hit/kill feedback, parallax depth, bullet trails, boss combat readability
fixes, the hangar mobile-scroll fix, the game-over screen, the victory
white-screen fix, and a 6-item security audit. Those are all shipped — the
backlog covers what's *next*, not what's done.

## Open decisions for sprint planning

- **Multiplayer scope** (B-003) — the `server/game-server.js` multiplayer
  stack and `src/renderer/lobby.ts` exist but are disconnected from the
  single-player game. Resolve scope before it muddies F-001 sequencing.
- **`.sprint/` tooling** — Afterburner's sprint scripts are not installed
  in this repo. Install the framework tooling before running automated
  sprints; the backlog here is ready to feed it.

## Next step

Run Sprint 1 (Foundation): F-004 balance, F-006 audio, B-002 API routing.
