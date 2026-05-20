# ADR-002 — Captain-as-Director: players are the agent directors

- **Status:** Proposed
- **Date:** 2026-05-20
- **Relates to:** F-001, F-015 — extends ADR-001

## Context

ADR-001 established a two-tier director: a slow LLM-backed **strategic
director** sets intent; a per-frame procedural **tactical director**
executes it. F-001 originally envisioned the game shipping a fixed roster
of AI director personalities for run-to-run variety.

The multiplayer vision (F-015) reframes this. Instead of a shipped roster,
**every player's Captain is a director persona** — persistent, leveling,
player-owned. Multiplayer becomes captains authoring and trading
AI-directed challenge levels.

## Decision

1. **The player's Captain IS their strategic-director persona.** It
   persists across runs and levels up the more the player plays.
2. **A "challenge" is a serialized captain persona + level/directive
   program.** Authored by one captain (with AI-agent assistance), played by
   another.
3. **Multiplayer is asynchronous** — play-by-mail challenge trading. No
   realtime netcode. It reuses ADR-001's agent-director proxy and adds a
   datastore for captains and challenges.
4. **The Quantum Computer is the gate** — an in-fiction campaign item that
   mechanically unlocks challenge authoring ("hacking" the enemy fleet).
5. **The realtime `server/game-server.js` stack is not this path** — it is
   a possible separate future "realtime arena" mode.

## Consequences

**Positive**
- Collapses F-001 and F-015 into one coherent system — the flagship feature
  and multiplayer become the same thing.
- Asynchronous is dramatically simpler than realtime multiplayer — no lag,
  prediction, rollback, or authoritative realtime simulation.
- User-generated content: every captain is a level designer.
- Captain leveling gives long-tail progression and a real identity hook.
- Reuses the ADR-001 architecture almost wholesale.

**Negative / costs**
- Needs a backend datastore for captains + challenges (overlaps F-001's
  proxy infra and B-002).
- Hard dependency on F-001 — the agent-director loop must work first.
- The realtime server stack becomes deferred, possibly orphaned.

**Open**
- The stakes of winning/losing a challenge ("ownership" / "back-and-forth"
  between captains) — deferred to a dedicated design session.

## Relationship to ADR-001

Extends, does not supersede. The two-tier architecture (strategic LLM +
tactical procedural) still holds. This ADR decides *who* the strategic
director is — the player's Captain — and *how* directors reach other
players — asynchronous challenge trading.
