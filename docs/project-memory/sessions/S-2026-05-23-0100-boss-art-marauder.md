# Session

Session-ID: S-2026-05-23-0100-boss-art-marauder
Title: Boss art + combat — Singularity Marauder (stage 4)
Date: 2026-05-23
Author: Claude (Opus 4.7) + Chad

## Goal

Build the stage-4 Singularity Marauder to the new bar, with a unique
identity that does not echo Valdore (the other Romulan boss).

## Changes Made

- **stages.ts** — Marauder HP 650 → 1300 (stage 4 outweighs stage 3's 1100).
- **renderer.ts `bossHullGravityMarauder`** — full rebuild (~30 → ~200
  lines). Heavy industrial Romulan vessel, distinct from Valdore's sleek
  raptor: hexagonal command body, forward grappler claws, layered armor,
  heavy aft engine bank, mismatched panel seams. Massive VENTRAL
  SINGULARITY DISH on the player-facing side — concentric ring detail,
  radial spokes, black-hole core, two counter-rotating accretion rings.
- **spawnBoss** `gravitymarauder` branch — 7 named hardpoints matching the
  drawn weapons: central SINGULARITY (the dish/cannon), L/R GRAPPLER claw
  disruptors, L/R PLASMA CONDUIT mid-flank, L/R AFT PHASER shoulders.
- **fireBossPattern** `gravitymarauder` case — replaced generic spirals
  with per-hardpoint combat. Singularity Cannon fires a 3-shot spread of
  big slow gravity orbs (heavy blob bullets, r=11, ttl 220). Standard
  weapon patterns elsewhere (disruptor bolts, plasma fans, phaser lances).
- **updateEnemy** `gravitymarauder` extras:
  - **GRAVITY PULL CYCLE** — every ~8s, the boss enters a 2s "pulling"
    window: pulls the player physically toward its center every frame
    (capped at >40px so it never becomes an instant grab). Inward green
    particle rings visualize the pull. Weapons go quiet during the pull
    so the moment is a clear distinct beat.
  - **VORTEX DROPS** — every ~9s drops an indestructible `vortex`
    obstacle into the playfield, reusing the existing vortex pull
    mechanic. Cadence quickens with phase.
- **types.ts** — new optional `pullTimer` / `pullActive` Enemy fields.
- `isTvak` hardpoint-boss flag extended to `gravitymarauder`.

## Decisions Made

- **Gravity is the boss's identity, across every layer.** The hull has a
  visible singularity dish, the signature weapon is gravity orbs, the
  unique mechanic pulls the player, and the on-screen elements are
  vortexes. Player feels the gravity theme constantly.
- **No always-on hull weapon** (same as Flagship; unlike Valdore).
- **Distinct from Valdore visually** despite same faction: Valdore is a
  sleek swept raptor (sage palette); Marauder is a heavy hex-bodied
  industrial vessel (deeper emerald palette, hex panels not chevron ribs).

## Open Questions

- Visual + mechanic review pending — use `?boss=4` on dev.
- 7 bosses remain.

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002 per boss)
