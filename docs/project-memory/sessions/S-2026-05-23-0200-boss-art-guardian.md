# Session

Session-ID: S-2026-05-23-0200-boss-art-guardian
Title: Boss art + combat — Anomaly Guardian (stage 5)
Date: 2026-05-23
Author: Claude (Opus 4.7) + Chad

## Goal

Build stage-5 Anomaly Guardian to the new bar — distinct from T'VAK (the
other Klingon boss).

## Changes Made

- **stages.ts** — HP 600 → 1500.
- **renderer.ts `bossHullGuardian`** — full rebuild (~30 → ~190 lines).
  Faceted hexagonal crystal sentinel. Six trapezoidal armor segments
  around the rim, inner counter-rotating hex core, central ANOMALY LENS
  portal (black-hole core, three counter-rotating violet/cyan event-
  horizon rings). Mounted weapons on the hex facets.
- **spawnBoss** `guardian` branch — 7 named hardpoints around the hex:
  central ANOMALY LENS, L/R lower plasma facets, L/R upper phaser facets,
  L/R outer missile facets.
- **fireBossPattern** `guardian` case — per-hardpoint combat. Anomaly Lens
  fires a 14-bolt radial-burst sun-flare with rotating offset. Standard
  per-type patterns elsewhere.
- **updateEnemy** `guardian` extras:
  - **PHASE-SHIFT TELEPORT** — every ~10s the boss vanishes for 90 frames.
    At frame 60 of the shift, it snaps to a new random on-screen position
    (with departure burst at old position, arrival burst at new). Reuses
    `cloakActive`/`cloakTimer` for invuln semantics; the renderer switches
    color (cyan for Guardian vs green for Valdore).
  - **CRYSTAL SHARD DROPS** — every ~8s drops a `splitter` obstacle into
    the playfield. Geometric on-theme hazards.
- `isTvak` hardpoint flag extended to `guardian`.

## Decisions Made

- **Cyan crystal vs Romulan green for the cloak ghost** — renderer keys
  off bossType so Valdore stays green (Romulan cloak) and Guardian gets
  cyan-white (crystal phase-shift). Same underlying invuln mechanism.
- **Phase-shift = teleport, not just hide** — what makes it different
  from Valdore's cloak. The boss MOVES, forcing the player to relocate.
- **No always-on hull weapon** — Guardian is fully exposed once stripped.
- **Crystal shards (splitter type) reuse existing obstacle** — on-theme
  geometric hazard, no new asset needed.

## Open Questions

- Visual + mechanic review pending — `?boss=5` on dev.
- 6 bosses remain.

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002)
