# Session

Session-ID: S-2026-05-23-0300-boss-art-sovereign
Title: Boss art + combat — Rift Sovereign (stage 6)
Date: 2026-05-23
Author: Claude (Opus 4.7) + Chad

## Goal

Build stage-6 Rift Sovereign to the new bar, distinct from Valdore and
Marauder (the other two Romulan bosses).

## Changes Made

- **stages.ts** — HP 700 → 1700, width 170→180, height 110→120.
- **renderer.ts `bossHullSovereign`** — full rebuild (~30 → ~200 lines).
  D'deridex-style Romulan elite: twin curved pincer wings sweeping
  forward with a central command pod nestled between them. Imperial
  chevron ribs on each wing leading edge. Iconic bridge eye on the pod.
  Spine conduit. Tail engine glows. Mint-emerald palette, cooler than
  Marauder's warmer green.
- **spawnBoss** `sovereign` branch — 7 named hardpoints: central IMPERIAL
  LANCE, L/R upper wing disruptors, L/R lower wing plasma turrets, L/R
  tail phaser batteries.
- **fireBossPattern** `sovereign` case — per-hardpoint. Imperial Lance
  fires a 5-bolt aimed kill-grid fan (tight cone converging on player —
  dodging requires perpendicular movement, not just lateral).
- **updateEnemy** `sovereign` extras:
  - **SUBSPACE PUSH** — every ~7s pushes the player AWAY from the boss
    for 2 seconds. Inverse of Marauder's pull (reuses pullActive/pullTimer
    with negative force vector). Expanding shockwave ring visualizes it.
    Weapons go quiet during push.
  - **RIFT COMETS** — every ~9s spawns 2 `comet` obstacles streaking
    across the screen from random sides. Fast-moving environmental threat.
- `isTvak` hardpoint flag extended to `sovereign`.

## Decisions Made

- **Push as the opposite of Marauder's pull** — same code pattern, inverted
  force vector. Two Romulan bosses with related-but-opposite mechanics
  creates a meaningful contrast.
- **D'deridex pincer silhouette** — iconic Star Trek Romulan shape, not
  yet used by Valdore (sleek raptor) or Marauder (hex industrial). Each
  Romulan boss now has a visually distinct hull.
- **Imperial Lance kill-grid fan** — 5 bolts in a tight cone. Forces the
  player to move PERPENDICULAR to the boss-to-player vector, not just
  sideways. New dodge muscle vs prior bosses.

## Open Questions

- Visual + mechanic review pending — `?boss=6` on dev.
- 5 bosses remain (Fortress, Singularity Dread, Voidtyrant, Wraith, OMEGA).

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002)
