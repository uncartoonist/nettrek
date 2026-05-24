# Session

Session-ID: S-2026-05-24-0330-boss-art-voidtyrant
Title: Boss art + combat — Event Horizon Tyrant (stage 9)
Date: 2026-05-24
Author: Claude (Opus 4.7) + Chad

## Goal

Build stage-9 Event Horizon Tyrant — fourth Klingon boss with a distinct
identity from T'VAK, Guardian, and Singularity Dreadnought.

## Changes Made

- **stages.ts** — HP 1500 → 2300; dims 220x135 → 230x145.
- **renderer.ts `bossHullVoidTyrant`** — full rebuild (~40 → ~180 lines).
  8-pointed lobed silhouette with weapon mounts at each tip, massive
  central event-horizon halo (radial gradient extends well beyond the
  hull), pure black core with hot accretion rings, radial spokes
  connecting lobes to core. Deep violet/magenta palette — distinct from
  T'VAK (grey), Guardian (cyan), Singularity (blood-red).
- **spawnBoss** `voidtyrant` branch — 7 named hardpoints: central EVENT
  HORIZON, L/R disruptors, L/R missile racks, L/R phaser lances.
- **fireBossPattern** `voidtyrant` case — per-hardpoint. EVENT HORIZON
  signature = 24-bullet 360° radial burst with rotating offset (fills
  a full ring around the boss; player weaves between bullets or is in/out
  of the radius when it fires).
- **updateEnemy** `voidtyrant` extras:
  - **GRAVITY RING** — every ~9s a damaging ANNULUS forms around the boss
    at radius 150-205px for 2 seconds. Player must be inside or outside,
    NOT in the band. Direct hit-detection in updateEnemy (calls hitPlayer
    with dummy events). Reuses pullActive/pullTimer.
  - **ENERGYRIBBON WEAVE** — every ~12s spawns an `energyribbon` obstacle
    (flowing aurora stream) crossing from a screen edge — unique hazard
    type no other boss uses.
- `isTvak` hardpoint flag extended to `voidtyrant`.

## Decisions Made

- **Gravity Ring as annular damage** — different problem from push/pull/
  slow (the other pullActive bosses). Forces a CHOICE: close-in or far-out.
- **Energyribbon as on-screen element** — only unused obstacle type in
  the boss roster. On-theme with spacetime-distortion.
- **24-bullet radial burst signature** — distinct from prior signature
  weapons (no single beam or cascade or fan); fills the entire annulus
  around the boss, mirroring the visual halo.

## Open Questions

- Visual + mechanic review pending — `?boss=9` on dev.
- 2 bosses remain (Wraith, OMEGA).

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002)
