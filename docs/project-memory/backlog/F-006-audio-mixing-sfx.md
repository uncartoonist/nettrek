# F-006 — Audio mixing & SFX coverage

- **Type:** Feature
- **Priority:** P1
- **Effort:** M
- **Status:** Backlog

## Problem

`src/audio/sfx.ts` has a solid Web Audio SFX set and most key events are
wired (explosion, hit, player hit, boss arrival, pickups). But there's no
master mix: music and SFX can fight, some events still lack sound, and
there's no volume control.

## Goal

A balanced mix where music sits under SFX, every meaningful action has audio
feedback, and the player can control volume.

## Acceptance criteria

- [ ] Master gain bus for SFX, separate from music; mix levels tuned so SFX
      cut through without burying the track
- [ ] Audit every gameplay event for SFX coverage — fill gaps (phaser fire,
      shield burst, weak-point destroyed, phase change, low-health warning)
- [ ] Volume / mute control in the menu or pause screen, persisted
- [ ] SFX throttling so dense combat doesn't produce a wall of noise
- [ ] No clipping at peak combat density

## Notes / files

- `src/audio/sfx.ts`, `src/audio/music.ts`, `src/audio/analyzer.ts`
- `src/main.ts` — event→SFX wiring in the game loop
