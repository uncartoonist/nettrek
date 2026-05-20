# F-004 — Game balance pass

- **Type:** Feature
- **Priority:** P1
- **Effort:** M
- **Status:** Backlog

## Problem

Balance has been tuned reactively (HP bumps, player-power HP scaling,
off-screen invulnerability, pawn fleets). It needs one deliberate holistic
pass so the difficulty curve is intentional across all 11 stages, not a
patchwork.

## Goal

A difficulty curve that stays engaging from a fresh ship to a maxed loadout,
and from stage 1 to stage 11 — no trivial stretches, no spikes.

## Acceptance criteria

- [ ] Documented target time-to-kill per enemy class at low / mid / maxed
      player power
- [ ] Enemy HP, fire cadence, and spawn density verified per stage against
      the curve
- [ ] Player weapon damage progression (cannon L1-5, wing, missile, laser,
      phaser) feels rewarding without trivializing encounters
- [ ] Boss HP / phase pacing verified — fights last a satisfying duration
- [ ] Pawn-fleet formations pull their weight as fire-soakers
- [ ] Playtest notes captured for each stage

## Notes / files

- `src/shmup/types.ts` — `ENEMY_STATS`
- `src/shmup/engine.ts` — `spawnEnemy` (HP scaling), `WEAPON_PROFILES`,
  `firePlayerWeapons`, `getFireRate`
- `src/shmup/director.ts` — `playerPower`, `armadaIntensity`, `diff`
- Foundational — should land in Sprint 1 before content work amplifies any
  imbalance.
