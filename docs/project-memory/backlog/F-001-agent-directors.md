# F-001 — Agent Directors: strategic LLM layer

- **Type:** Feature (epic)
- **Priority:** P2 (flagship — sequence after foundational quality)
- **Effort:** XL — multi-sprint epic
- **Status:** Backlog

## Goal

Replace the procedural music director with a two-tier system: a per-frame
tactical director (existing `director.ts`) executing intent set by a slower
LLM-backed **strategic director** with personality. Multiple director
personalities the game can feature for run-to-run variety.

Full vision: `../../agent-directors.md`. Architecture decision:
`../adr/ADR-001-two-tier-agent-director.md`.

## Why it's the flagship

Procedural music direction is a solved problem. An encounter director that
reasons about the player in natural language, in real time, with personality
is not — it's the thing about NetTrek worth sharing.

## Acceptance criteria (epic — slice across sprints)

- [ ] `Directive` type extracted as the seam between strategic + tactical
- [ ] Tactical director consumes the latest `Directive`, keeps playing during
      async strategic round-trips
- [ ] One-endpoint proxy service (Lambda/Worker) — game state in, tool calls
      out; API key server-side only
- [ ] Tool surface implemented: `set_aggression`, `bias_formations`,
      `queue_signature`, `set_palette`, `swap_track`, `say`, `set_scroll`
- [ ] One shippable director personality end-to-end (recommend Kostrov or
      Vidya) — proves the loop
- [ ] Graceful degradation: API slow/down → game runs on last directive
- [ ] A/B feel check vs. procedural-only baseline

## Dependencies / risks

- First server-side infra for the game (see also B-002).
- Cost: ~100 strategic calls/stage; Haiku is sufficient for tool selection.
- Should land AFTER F-002/F-003/F-004/F-005 so the director has good content
  and a well-tuned baseline to direct.
