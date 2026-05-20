# F-010 — Background atmosphere & depth

- **Type:** Feature
- **Priority:** P2
- **Effort:** M
- **Status:** Backlog

## Problem

Parallax depth (4 star layers + foreground dust) and a basic distant-ship
silhouette exist, but the world outside of combat still feels quiet. The
sense of a living warzone is thin.

## Goal

Every stage feels like a place — distant battles, drifting wreckage, faction
presence — without adding visual noise or strobing.

## Acceptance criteria

- [ ] Distant-battle layer: small ship silhouettes exchanging faint weapons
      fire deep in the background, varied per stage
- [ ] Stage-specific atmospheric elements (nebula drift, debris fields,
      anomaly shimmer) tied to the stage theme
- [ ] Foreground occlusion elements occasionally pass for depth
- [ ] All subtle — no strobing, blends with the nebula backgrounds
- [ ] No measurable frame-time regression (coordinate with F-011)

## Notes / files

- `src/shmup/renderer.ts` — `drawBackgroundEvents` (silhouette hook is here),
  starfield layers, `drawEnvironment`
