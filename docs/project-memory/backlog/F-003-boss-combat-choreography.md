# F-003 — Per-boss combat choreography

- **Type:** Feature
- **Priority:** P2
- **Effort:** L — sliceable per boss
- **Status:** Backlog

## Problem

T'VAK has a fully-realized per-hardpoint fire pattern with phase gating.
Other bosses largely share generic `fireBossPattern` branches. Each boss
should *fight* differently, not just look different.

## Goal

A signature attack identity per boss — tied to its name and faction. The
gravity marauder pulls you; the wraith phases in and out; OMEGA escalates
across 6 phases. Memorable, learnable patterns.

## Acceptance criteria

- [ ] Each bossType has a distinct fire pattern with phase-gated escalation
- [ ] Patterns are readable — telegraphed, dodgeable, not bullet-soup
- [ ] All enemy fire stays the unified hot magenta-red threat color
- [ ] Subsystem destruction visibly disables the corresponding attack
- [ ] At least one boss uses a movement-based mechanic (tractor pull,
      phase-shift, ramming) not just projectiles

## Notes / files

- `src/shmup/engine.ts` — `fireBossPattern`, `fireBossSignature`
- Depends on F-002 (hardpoint placement) landing first per boss.
- Pairs naturally with F-002 — do art + combat for the same boss together.
