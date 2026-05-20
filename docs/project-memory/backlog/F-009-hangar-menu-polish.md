# F-009 — Hangar & menu visual polish

- **Type:** Feature
- **Priority:** P2
- **Effort:** M
- **Status:** Backlog

## Problem

The hangar and menus are functional but plain next to the in-game art bar.
The hangar has a nice ship wireframe backdrop but the upgrade rows, stage
list, and title screen feel utilitarian.

## Goal

The metagame screens feel like part of the same premium product as the
gameplay — cohesive, atmospheric, satisfying to navigate.

## Acceptance criteria

- [ ] Hangar upgrade rows: clearer affordances, better "can afford" vs
      "maxed" states, satisfying purchase feedback
- [ ] Stage-select list shows progress / completion / boss preview
- [ ] Title screen has motion/atmosphere consistent with the game
- [ ] Briefing and victory/debrief screens visually consistent with hangar
- [ ] Transitions between screens are smooth, not hard cuts
- [ ] Holds the art bar; works on mobile (coordinate with F-008)

## Notes / files

- `src/shmup/hangar.ts` — hangar screen + styles
- `src/main.ts` — menu, pause, game-over overlays
- `src/shmup/renderer.ts` — `drawBriefing`, `drawVictory`
