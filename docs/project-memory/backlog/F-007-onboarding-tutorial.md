# F-007 — First-time onboarding

- **Type:** Feature
- **Priority:** P1
- **Effort:** M
- **Status:** Backlog

## Problem

A new player gets dropped into stage 1 with no guidance. They don't know
that blue diamonds upgrade the cannon, that boss subsystems must be
destroyed before the hull, that double-tap fires phasers, or that hard-push
raises shields. (The "what is the blue diamond" question is the evidence.)

## Goal

A new player understands the core verbs within their first 60 seconds —
without a wall of text.

## Acceptance criteria

- [ ] First-run detection (localStorage flag)
- [ ] Inline, diegetic hints for: movement, collecting power-ups (call out
      the weapon/blue-diamond), special weapons, shields
- [ ] Boss intro teaches "destroy subsystems first" the first time a shielded
      boss appears
- [ ] Hints are skippable and never replay after first run
- [ ] No modal text dumps — keep it in-world and brief
- [ ] Pull item meanings from `docs/game-legend.md` so they stay consistent

## Notes / files

- `src/main.ts` — menu / first-run flow
- `src/shmup/renderer.ts` — in-world hint rendering
- `docs/game-legend.md` — canonical item/enemy meanings
