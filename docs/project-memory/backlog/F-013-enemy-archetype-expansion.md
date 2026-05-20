# F-013 — Enemy archetype expansion

- **Type:** Feature
- **Priority:** P3
- **Effort:** L
- **Status:** Backlog

## Problem

Five non-boss classes exist (fighter, bomber, cruiser, elite, turret). Across
11 stages that's a thin roster — later stages reuse the same ships with only
HP scaling to distinguish them.

## Goal

Enough enemy variety that mid- and late-game stages introduce genuinely new
threats, not just tougher versions of stage-1 ships.

## Acceptance criteria

- [ ] 3-5 new enemy archetypes with distinct movement + weapon profiles
      (candidates: shielded enemy requiring flanking, splitter that divides
      on death, kamikaze rusher, support/healer, mine-layer)
- [ ] Each new type has bespoke art holding the project art bar
- [ ] Wired into `MOVEMENT` + `WEAPON_PROFILES` + formation system
- [ ] Music profiles updated so new types appear at appropriate stages
- [ ] Balanced against F-004's TTK targets

## Notes / files

- `src/shmup/types.ts` — `EnemyType`, `ENEMY_STATS`
- `src/shmup/engine.ts` — `WEAPON_PROFILES`, `defaultMoveStyle`, `updateEnemy`
- `src/shmup/director.ts` — `FORMATIONS`, enemy sampling
- `src/shmup/renderer.ts` — `drawDetailedEnemy`
- Best done after F-004 so new types slot into a known curve.
