# NetTrek Backlog

Groomed backlog for the NetTrek improvement effort. Each ticket is sized to
fit inside a sprint slice. IDs are stable — never reuse a number.

- **B-NNN** — bugs / technical debt
- **F-NNN** — features / enhancements

## Status legend

`Backlog` → `In Sprint` → `In Review` → `Done`

## Priority legend

- **P1** — foundational quality; do first
- **P2** — high-value polish & the flagship feature
- **P3** — nice-to-have / future

## Open tickets

| ID | Title | Type | Priority | Effort |
|----|-------|------|----------|--------|
| B-001 | Hashed assets lack Cache-Control immutable headers | Bug | P2 | S |
| B-002 | CloudFront not routing /api/* to backend | Bug | P1 | S |
| B-003 | Orphaned lobby module — wire up or delete | Bug | P3 | S |
| F-001 | Agent Directors — strategic LLM layer | Feature | P2 | XL (epic) |
| F-002 | Boss hull art overhaul — 10 remaining bosses | Feature | P1 | L |
| F-003 | Per-boss combat choreography | Feature | P2 | L |
| F-004 | Game balance pass | Feature | P1 | M |
| F-005 | Music-as-level profile differentiation | Feature | P1 | M |
| F-006 | Audio mixing & SFX coverage | Feature | P1 | M |
| F-007 | First-time onboarding | Feature | P1 | M |
| F-008 | Mobile & Apple Pencil polish | Feature | P2 | M |
| F-009 | Hangar & menu visual polish | Feature | P2 | M |
| F-010 | Background atmosphere & depth | Feature | P2 | M |
| F-011 | Performance optimization pass | Feature | P2 | M |
| F-012 | Leaderboard client integration | Feature | P2 | M |
| F-013 | Enemy archetype expansion | Feature | P3 | L |
| F-014 | Victory & briefing flow polish | Feature | P3 | S |

## Suggested sprint sequencing

The backlog is ordered so foundational quality lands before the flagship
feature. A workable arc:

- **Sprint 1 — Foundation:** F-004 (balance), F-006 (audio), B-002 (API).
  Get the core loop feeling correct and the prod backend reachable.
- **Sprint 2 — Identity:** F-005 (music differentiation), F-002 (boss art,
  first ~4 bosses), F-007 (onboarding).
- **Sprint 3 — Depth:** F-002 (remaining bosses), F-003 (boss combat),
  F-010 (atmosphere).
- **Sprint 4 — Polish:** F-008 (mobile), F-009 (hangar/menu), F-011
  (performance), B-001, B-003.
- **Sprint 5+ — Flagship:** F-001 (agent directors) — see
  `../adr/ADR-001-two-tier-agent-director.md`.

F-012/F-013/F-014 slot in opportunistically.

## Related docs

- `../adr/` — architecture decision records
- `../sessions/` — session logs
- `../../agent-directors.md` — full vision doc for F-001
- `../../game-legend.md` — content inventory (items / enemies / bosses)
