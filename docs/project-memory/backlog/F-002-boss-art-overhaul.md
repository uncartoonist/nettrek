# F-002 — Boss hull art overhaul (10 remaining bosses)

- **Type:** Feature
- **Priority:** P1
- **Effort:** L — sliceable per boss
- **Status:** Backlog

## Problem

Only the stage-1 boss (T'VAK) has a bespoke, detailed procedural hull
(`bossHullTvak`). The other 10 bosses fall back to generic hull templates
(`bossHullWarbird` / `bossHullDreadnought` / etc.) that look flat and
similar. The user has called boss visuals out specifically as weak.

## Goal

Every boss gets a distinct, detailed silhouette that matches its name and
faction — the way T'VAK reads as a Klingon raptor. Organic bezier shapes,
dark gradients that blend with the nebula backgrounds, no cheesy primitives.

## Bosses needing art (stage / name / type)

2 Valdore (dreadnought) · 3 Orion Flagship (flagship) ·
4 Singularity Marauder (gravitymarauder) · 5 Anomaly Guardian (guardian) ·
6 Rift Sovereign (sovereign) · 7 Fortress Command (fortress) ·
8 Singularity Dreadnought (singularity) · 9 Event Horizon Tyrant (voidtyrant) ·
10 Phase Wraith (wraith) · 11 OMEGA SUPREME (omega).

## Acceptance criteria

- [ ] Each boss has a unique hull renderer with a readable faction-coded
      silhouette and visible weapon hardpoints
- [ ] Subsystem weak points are clearly mounted on the visible cannons
- [ ] Phase changes produce a visible hull state change (armor opens, glows
      intensify, etc.)
- [ ] Holds the project art bar: organic, elegant, no strobing

## Notes / files

- `src/shmup/renderer.ts` — `bossHull*` methods; `bossHullTvak` is the model
- `src/shmup/engine.ts` — `spawnBoss` defines hardpoint offsets per bossType
- Slice as ~2-3 bosses per sprint.
