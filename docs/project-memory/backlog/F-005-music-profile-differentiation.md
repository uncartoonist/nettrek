# F-005 — Music-as-level profile differentiation

- **Type:** Feature
- **Priority:** P1
- **Effort:** M
- **Status:** Backlog

## Problem

The core pillar is "the music IS the level" — each song should be a level
with its own signature mechanic and personality. The 11 `MusicProfile`
entries exist but in practice stages can feel samey. This pass makes each
song unmistakably its own level.

## Goal

A player who closes their eyes should be able to tell which stage they're on
from the gameplay rhythm alone.

## Acceptance criteria

- [ ] Each stage's signature mechanic is distinct, triggers reliably on the
      song's drops, and is visually legible
- [ ] `enemyWeights` / `obstacleWeights` per profile produce a recognizably
      different fleet composition per stage
- [ ] `dominantBand` actually shapes the feel (bass = heavy/slow, high =
      sparkly/fast, mid = structured)
- [ ] Quiet sections read as genuine breathing room; drops genuinely surge
- [ ] Playtest: each stage described in one sentence that wouldn't fit another

## Notes / files

- `src/shmup/musicProfiles.ts` — the 11 profiles
- `src/shmup/director.ts` — `getDirectorCommand`, signature triggers
- `src/audio/analyzer.ts` — band detection feeding it all
- Prerequisite for F-001: the agent director needs distinct songs to riff on.
