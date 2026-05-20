# ADR-001 — Two-tier architecture for agent directors

- **Status:** Proposed
- **Date:** 2026-05-19
- **Relates to:** F-001

## Context

NetTrek's encounter pacing is driven by `src/shmup/director.ts` — a
deterministic, per-frame, music-reactive system. The vision (F-001,
`docs/agent-directors.md`) is to replace the *taste* layer with an
LLM-backed "agent director" that has personality and reasons about the
player, while keeping real-time gameplay intact.

The hard constraint: the game runs at 60fps; an LLM round-trip is
500ms-2s. The director cannot be a single LLM call in the frame loop.

## Decision

Adopt a **two-tier director**:

1. **Tactical director** — stays procedural, in `director.ts`, runs every
   frame. Owns formation spawns, fire cadence, signature mechanics. Reads
   the current `Directive`.
2. **Strategic director** — LLM-backed, runs every 3-10s or on narrative
   beats. Reads serialized game state, emits a `Directive` via tool calls.
   Async — never blocks a frame.

A `Directive` value type is the seam between the two. The strategic layer
sets *intent*; the tactical layer *executes*. If the LLM is slow or
unavailable, the tactical layer keeps running on the last `Directive` —
the game degrades in taste, never in function.

The LLM runs behind a thin server-side proxy (Lambda/Worker); the API key
never reaches the client.

## Consequences

- **Positive:** real-time safety; graceful degradation; personality lives
  in prompts + tool-use bias, making a roster of directors cheap to add;
  the `Directive` seam is testable in isolation.
- **Negative:** introduces the first server-side runtime dependency for the
  single-player game (see B-002); per-run LLM cost (~100 calls/stage —
  Haiku-tier is sufficient); added architectural surface.
- **Sequencing:** land after F-002/F-003/F-004/F-005 so the director has
  good content and a tuned baseline to direct.

## Alternatives considered

- **LLM in the frame loop** — rejected: latency makes it impossible.
- **Fully procedural "personalities"** (weight-table presets) — viable as a
  first experiment and a fallback, but doesn't deliver the narrative
  reasoning that makes the feature worth doing.
