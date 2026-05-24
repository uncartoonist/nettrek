# Session

Session-ID: S-2026-05-24-1500-boss-art-wraith
Title: Boss art + combat — Phase Wraith (stage 10)
Date: 2026-05-24
Author: Claude (Opus 4.7) + Chad

## Goal

Build stage-10 Phase Wraith — the fourth and final Romulan boss before
the OMEGA finale.

## Changes Made

- **stages.ts** — HP 1400 → 2500; dims 200x120 → 210x140.
- **renderer.ts `bossHullWraith`** — full rebuild (~40 → ~200 lines).
  Elongated narrow-waisted Romulan silhouette with flared wings.
  Bone-white/pale-violet palette (corpse-bone, distinct from Valdore sage,
  Marauder emerald, Sovereign mint). Faint always-on outer halo (this
  boss is always partly phased). Skeletal frame ribs showing through
  translucent armor, central twin-emitter Phase Lance cannon, tail wisps
  trailing back as ambient ghost-fire.
- **spawnBoss** `wraith` branch — 7 named hardpoints: central PHASE LANCE,
  L/R disruptors, L/R plasma, L/R phasers.
- **fireBossPattern** `wraith` case — per-hardpoint. CRUCIAL DIFFERENCE
  from Valdore: **NO cloakActive early-break**. Wraith keeps firing
  while intangible. Signature PHASE LANCE fires TWIN aimed beams from
  two muzzle offsets, each tracking the player — converging V trap that
  forces perpendicular dodging.
- **updateEnemy** `wraith` extras:
  - **SPECTRAL PHASE** — every ~8s a 2.5s intangibility window. Hit
    guards (cloakActive) skip damage as usual, BUT the boss keeps firing
    + emits continuous violet wisp particles signaling "you can't hit me."
    Mechanically harder than Valdore's cloak (can't wait it out).
  - **AMBIENT SPECTRAL BULLETS** — every ~7s, 4+phase bullets spawn at
    random off-boss positions, each with a portal telegraph burst, then
    a violet aimed bolt at the player. Threats from anywhere on the
    playfield, not just the boss.
- **renderer drawBoss** — Wraith excluded from the cloak ghost-render
  early-return (it stays visible during spectral phase; wisps are the
  visual signal).
- `isTvak` hardpoint flag + `cloakTimer` defaults extended to `wraith`.

## Decisions Made

- **Spectral Phase vs Valdore's Cloak — same field, different feel.**
  Cloak: invulnerable + silent (player waits). Spectral: invulnerable +
  attacking (player can't pause offense, has to keep dodging).
- **Twin Phase Beams signature** — different from prior signature
  weapons. Forces perpendicular dodging (similar in spirit to Sovereign's
  kill-grid fan but with 2 origins instead of 5 angles from one point).
- **Ambient spectral bullets** — unique threat type (random off-boss
  spawns). No other boss puts hazards in random positions like this.

## Open Questions

- Visual + mechanic review pending — `?boss=10` on dev.
- 1 remains — OMEGA SUPREME (stage 11 finale).

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (folded into F-002)
