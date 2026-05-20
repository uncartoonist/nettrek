# F-011 — Performance optimization pass

- **Type:** Feature
- **Priority:** P2
- **Effort:** M
- **Status:** Backlog

## Problem

The renderer is Canvas 2D with heavy per-frame procedural drawing, growing
particle counts, gradients created per-frame, and four parallax layers.
No profiling has been done. Mobile GPUs/CPUs are the constraint.

## Goal

Locked 60fps on a mid-range phone through the densest combat (boss + pawn
fleet + signature mechanic + full particle load).

## Acceptance criteria

- [ ] Profile worst-case frames on a real mid-range phone
- [ ] Particle system: pooling, hard caps verified, cheap draw paths
- [ ] Cache gradients / avoid per-frame `createRadialGradient` where static
- [ ] Audit per-frame allocations in the hot loop (engine + renderer)
- [ ] Offscreen-cull anything fully out of view
- [ ] Frame-time budget documented; no regressions gate future art tickets

## Notes / files

- `src/shmup/renderer.ts` — main draw hot path
- `src/shmup/engine.ts` — `updateShmup` per-frame loop
- Should land before F-001 adds async work and F-010 adds background layers.
