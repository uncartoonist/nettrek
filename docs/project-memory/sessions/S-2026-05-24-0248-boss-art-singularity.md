# Session

Session-ID: S-2026-05-24-0248-boss-art-singularity
Title: Boss art + combat — Singularity Dreadnought (stage 8)
Date: 2026-05-24
Author: Claude (Opus 4.7) + Chad

## Goal

Build stage-8 Singularity Dreadnought — distinct identity from T'VAK and
Guardian (the other Klingon bosses).

## Changes Made

- **stages.ts** — HP 1200 → 2100; dims 220x140 → 230x145.
- **renderer.ts `bossHullSingularityDread`** — full rebuild (~35 → ~210
  lines). Jagged multi-lobed predator with deep blood-red palette
  (distinct from T'VAK's grey-purple raptor and Guardian's cyan hex).
  Angular blade ribs on the wings, central raised spine, recessed
  black-hole core with hot accretion rings, prominent ventral
  singularity-cannon barrel.
- **spawnBoss** `singularity` branch — 7 named hardpoints: central
  SINGULARITY CANNON, L/R forward disruptors, L/R missile racks, L/R
  aft phaser lances.
- **fireBossPattern** `singularity` case — per-hardpoint. The Singularity
  Cannon fires a 5-shell time-offset vertical cascade — a moving column
  of heavy shells that the player must slide out of (different from
  Flagship's single beam and Fortress's wide salvo).
- **updateEnemy** `singularity` extras:
  - **TRACTOR SLOW FIELD** — every ~8.5s emits a 2s pulse that sets the
    player's `tractorSlowTimer` each frame (movement drops to 40%).
    Reuses pullActive/pullTimer with the existing T'VAK-tractor slow
    mechanic. Inward purple-red gravity rings visualize it.
  - **MINE SPREADS** — every ~9s drops 3 mines fanned out in one salvo
    (harder to weave than Flagship's singles).
- `isTvak` hardpoint flag extended to `singularity`.

## Decisions Made

- **Tractor slow vs Marauder pull, Sovereign push, Singularity slow** —
  all three reuse the same pullActive/pullTimer state with different
  effects on the player. Same code pattern, three distinct outcomes
  (pull / push / slow). Clean.
- **Cascade as signature, not single bomb.** Late-game Klingon should
  feel relentless: a column of heavy shells in one lane is more
  oppressive than a single big projectile.
- **Mine spreads (3-at-once) vs Flagship's singles** — same obstacle
  type, different deployment pattern. Density-based threat.

## Open Questions

- Visual + mechanic review pending — `?boss=8` on dev.
- 3 bosses remain (Voidtyrant, Wraith, OMEGA).

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002)
