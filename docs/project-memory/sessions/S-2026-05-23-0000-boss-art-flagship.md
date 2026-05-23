# Session

Session-ID: S-2026-05-23-0000-boss-art-flagship
Title: Boss art + combat — Orion Flagship (stage 3)
Date: 2026-05-23
Author: Claude (Opus 4.7) + Chad

## Goal

Build the stage-3 Orion Flagship to the new bar set by Valdore: detailed
bespoke hull + functional destroyable hardpoints + a unique mechanic +
on-screen elements beyond just its weapons.

## Changes Made

- **stages.ts** — Flagship HP 500 → 1100 (stage 3 should outweigh stage 2).
- **renderer.ts `bossHullFlagship`** — full rebuild (~25 → ~170 lines).
  Bulky industrial chevron silhouette, multi-deck plating, mismatched
  rivets, asymmetric command bridge tower, heavy rear engine bank.
  SEVEN visible weapon mounts: central Mass Driver (cooling-finned
  barrel), L/R forward disruptors, L/R upper missile racks (3-tube each),
  L/R mid-flank Gatling turrets (3-barrel cluster).
- **spawnBoss** — `flagship` branch with 7 named hardpoints matching the
  drawn weapons. Unlike Valdore there is no always-on hull weapon — when
  stripped, the Flagship is fully exposed.
- **fireBossPattern** `flagship` case — replaced the generic pattern with
  per-hardpoint combat:
  - Mass Driver: signature charged beam — giant slow phaserlance (r=22)
    flanked by two leading bolts. Recoil = screen shake + warm flash.
  - Disruptors: fast aimed bolts.
  - Missile racks: pair of homing missiles each.
  - Gatling turrets: rapid 3-shot bursts.
- **updateEnemy** — `flagship` extras:
  - Mass-driver charge telegraph: when fireTimer ≤ 90, emit yellow
    charging particles around the muzzle (color escalates to white-hot
    at the moment of fire). Clear lateral-dodge warning.
  - Periodic mine drops — drifts a `mine` obstacle out of the rear bay
    every ~9s, cadence quickens with phase. Adds environmental clutter
    beyond just the boss's projectiles.
- `isTvak` hardpoint-boss flag now covers `flagship` so fireCooldown = 1
  and the per-hardpoint dispatch runs every frame.

## Decisions Made

- **Mass Driver as charged-beam mechanic** — visually opposite of Valdore's
  cloak (sneaky). Flagship is brazen: a big telegraphed weapon you can see
  coming. Distinct boss identity.
- **No hull weapon** — Flagship is fully exposed once stripped. Valdore
  keeps her twin disruptors after the strip; Flagship intentionally goes
  silent. Different feel.
- **Mines as the on-screen element** — Valdore summons escorts, Flagship
  drops mines. Each boss should add something different to the playfield.

## Open Questions

- Visual review pending — use `?boss=3` on dev.
- 8 bosses remain.

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002 per boss)
