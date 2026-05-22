# Session

Session-ID: S-2026-05-22-1527-boss-art-valdore
Title: Boss art overhaul (F-002) — IRW Valdore
Date: 2026-05-22
Author: Claude (Opus 4.7) + Chad

## Goal

Begin F-002: give each boss a bespoke detailed hull. First boss — the
stage-2 Romulan dreadnought, IRW Valdore.

## Context

Only T'VAK (stage 1) had a detailed bespoke hull. The other 10 bosses used
minimal generic templates — `bossHullDreadnought` was ~25 lines of basic
shapes. The user wants every boss to look great with multiple weapon
systems.

## Decisions Made

- **Boss art done directly, not via autonomous sprint.** Procedural art
  quality needs the visual feedback loop (how T'VAK got good). Blind agents
  can't see their output. One boss at a time, reviewed on dev.

## Changes Made

Rebuilt `bossHullDreadnought` (~25 lines → ~190) as a detailed Romulan
warbird:
- Swept predatory raptor silhouette (mirrored half-polygon), bright sage
  contour so it reads against the nebula
- Layered detail: wing armor plating, chevron feather ribs, raised central
  spine, command bridge with lit viewports, twin engine glow
- Artificial quantum-singularity core — radial-gradient glow + swirling
  accretion rings
- FOUR distinct weapon systems: twin forward disruptor cannons, wing-root
  plasma turrets, wingtip beam lances, central torpedo launcher
- Phase-reactive: conduit + weapon glows intensify each phase

## Changes Made — boss-preview shortcut + F-003 for Valdore

User approved both follow-ups. F-003 (per-boss combat) is now folded into
each boss as it's done, rather than a separate pass.

- **Boss-preview shortcut** — hidden `?boss=N` URL param (1-indexed) drops
  straight into a stage's boss fight with a mid-high test loadout. Skips
  the whole stage. `previewBoss()` in main.ts; not surfaced in any UI.
- **Valdore F-003** — the 4 drawn weapon systems are now functional
  destroyable hardpoints:
  - `spawnBoss` — hoisted the shared `hardpoint` factory; added a
    `dreadnought` branch with 5 named hardpoints (L/R plasma, L/R wingtip
    lance, central torpedo). Twin forward disruptors stay the hull's own
    non-destroyable weapon so the boss never goes toothless.
  - `fireBossPattern` — replaced the generic dreadnought pattern with
    per-hardpoint firing; destroying a hardpoint silences that weapon.
  - `isTvak` flag generalised to cover hardpoint bosses (fireCooldown 1).
  - Hull auto-shields while any weaponType hardpoint lives (existing
    T'VAK logic — applies to Valdore for free).

## Decisions Made

- **No phase-gating on Valdore's hardpoint weapons.** The hull stays
  shielded while subsystems live, so `boss.hp` (hence phase) never advances
  during the strip. Phase-gated weapons would never fire — so all 5
  hardpoints fire from the start; incoming fire visibly thins as you
  destroy them.

## Open Questions

- Visual + combat review of Valdore pending — use `?boss=2` on dev.
- 9 bosses remain (F-002 + F-003 folded together, ~2-3 per future pass).

## Links

Backlog:
- F-002 - Boss hull art overhaul
- F-003 - Per-boss combat choreography (now folded into F-002 per boss)
