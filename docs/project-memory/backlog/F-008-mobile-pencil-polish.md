# F-008 — Mobile & Apple Pencil polish

- **Type:** Feature
- **Priority:** P2
- **Effort:** M
- **Status:** Backlog

## Problem

Mobile is a first-class target (iPad + Pencil especially). Input handling
and the hangar scroll bug have been fixed reactively; this is a deliberate
end-to-end pass on the touch experience.

## Goal

The game feels native and precise on iPad with Pencil, and fully playable on
phone, with no clipped UI or mis-scaled HUD.

## Acceptance criteria

- [ ] Pencil steering verified accurate (pen > touch > mouse precedence)
- [ ] Double-tap = phasers, hard-push / long-press = shields — verified on
      real hardware
- [ ] Every screen (menu, hangar, pause, game-over, victory, briefing) fits
      and scrolls correctly on phone + tablet; safe-area insets honored
- [ ] HUD scales legibly across phone / tablet / desktop
- [ ] Bottom HUD panel doesn't sit under the player's thumb during play
- [ ] No accidental browser gestures (pull-to-refresh, text selection)

## Notes / files

- `src/main.ts` — PointerEvents pipeline
- `src/shmup/hangar.ts`, `src/shmup/renderer.ts` — layouts
- Memory: `feedback_mobile_pencil` captures the intent.
