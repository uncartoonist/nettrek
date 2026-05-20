# F-014 — Victory & briefing flow polish

- **Type:** Feature
- **Priority:** P3
- **Effort:** S
- **Status:** Backlog

## Problem

The victory flow (ship flyaway → stats card → next-mission briefing) works
but the sequence has been bug-prone — it recently froze on a white screen
because the engine stopped updating during the `victory` phase. The flow is
functional but not yet a polished, reliable, satisfying beat.

## Goal

A reliably smooth, rewarding stage-end sequence that makes the player want
to push to the next mission.

## Acceptance criteria

- [ ] Stats card reveal is well-paced and readable (row-by-row reveal timing)
- [ ] Rank / grade calculation feels meaningful and is explained
- [ ] Briefing screen sells the next stage (boss preview, faction, threat)
- [ ] Continue prompt is obvious on both desktop (ENTER) and mobile (tap)
- [ ] No phase-transition edge cases — verify death-during-victory, last
      stage completion, retry paths
- [ ] Music handoff between stage-end and next stage is clean

## Notes / files

- `src/shmup/engine.ts` — `victory` phase block, `stageStats`
- `src/shmup/renderer.ts` — `drawVictory`, `drawBriefing`
- `src/main.ts` — victory→briefing→next-stage transitions
