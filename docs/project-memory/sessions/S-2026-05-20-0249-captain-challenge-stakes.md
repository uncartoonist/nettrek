# Session

Session-ID: S-2026-05-20-0249-captain-challenge-stakes
Title: Design the captain-vs-captain win/loss stakes
Date: 2026-05-20
Author: Claude (Opus 4.7) + Chad

## Goal

Resolve the open question from ADR-002: what is at stake when captains
challenge each other.

## Context

ADR-002 established asynchronous captain-designed challenges but deferred
the win/loss stakes. The user opened the design with "winner takes agreed
coins, weapons, or other features."

## Plan

Discuss the design space, land a model, record it as an ADR and fold it
into F-015.

## Changes Made

- ADR-003 — three-layer stakes model.
- F-015 — loop step 7 and the components list updated to reference the
  resolved stakes system + guardrails.
- ADR-002 — open question marked resolved, points to ADR-003.

## Decisions Made

- **Layered model chosen** (user picked "full system"): mandatory captain-
  rank ladder + opt-in coin wager + opt-in captain-recruitment bounty.
- **No permanent-progression loss.** Weapons/upgrades can never be staked —
  only coins (re-earnable) and rank (recoverable). Rationale: the loser
  played someone else's level; permanent loss makes accepting challenges
  scary and kills the loop. This is the load-bearing rule.
- **"Ownership" = recruitment, not theft.** Beating a captain lets you
  deploy a copy of their AI director persona — defeated captains become
  content, not victims.
- **Fairness guardrails:** proof-of-beatability gate (no impossible
  challenges) + AI difficulty rating shown before accepting.
- **Captain growth is the real reward** — winning routes XP into the
  captain, unlocking better authoring tools.

## Open Questions

- Rank tiers / season resets, recruitment edge cases, coin escrow vs.
  post-settlement — all deferred to build time (noted in ADR-003).

## Links

ADRs:
- ADR-003 - Captain challenge stakes: layered win/loss model
- ADR-002 - Captain-as-Director (open question now resolved)
