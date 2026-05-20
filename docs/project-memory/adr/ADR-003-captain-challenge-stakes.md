# ADR-003 — Captain challenge stakes: layered win/loss model

- **Status:** Proposed
- **Date:** 2026-05-20
- **Relates to:** F-015 — resolves the open question deferred in ADR-002

## Context

ADR-002 established captain-vs-captain play as asynchronous challenge
trading but explicitly deferred *what is at stake* when a captain wins or
loses a challenge. This ADR decides that.

The core tension: stakes must be meaningful enough to matter, but in this
model the *loser played someone else's level* — so punishing them too hard
makes accepting challenges scary and kills the whole loop.

## Decision

A **three-layer stakes model**. Captain rank is mandatory; coin wagers and
recruitment bounties are opt-in escalations agreed before the challenge.

### Layer 1 — Captain Rank (mandatory, safe)

Every challenge resolves into a captain Elo/rank change — win moves it up,
loss moves it down. Always on, never destroys progression, recoverable.
It is the competitive spine and the matchmaking signal. Chess-style.

### Layer 2 — Coin Wager (opt-in)

Both captains agree a coin pot up front; the winner takes it. Coins are
re-earnable, so a lost pot stings without destroying progress. The pot size
is negotiated against the challenge's AI difficulty rating — a harder
challenge justifies a bigger wager.

### Layer 3 — Captain Recruitment Bounty (opt-in, high-status)

Beating a captain lets you **recruit a copy of their AI director persona**.
You can then deploy recruited captains in challenges you author. Defeated
captains become *content*, not victims — a collectible roster of conquered
rivals' tactics. This is the non-destructive form of the "ownership"
mechanic from the original pitch.

## Guardrails (apply to all layers)

- **Proof-of-beatability** — a challenge cannot be sent until its author
  (or an AI) has cleared it. No impossible challenges, ever.
- **AI difficulty rating** — shown to the receiving captain before they
  accept, so every wager is an informed bet.
- **No permanent-progression loss** — weapons and upgrades can NEVER be
  staked. Only coins (re-earnable) and rank (recoverable) move. This is the
  load-bearing rule that keeps players willing to accept challenges.
- **Captain growth is the real reward** — winning routes XP into the
  captain, leveling them and unlocking better authoring tools (more enemy
  types to hack, bigger fleets, smarter AI direction).

## Win / loss definition

Binary for v1: the receiving captain *wins* if they clear the authored
challenge; the authoring captain *wins* if the challenge defeats the
player. Partial-credit / survival-time scoring is a possible later refinement.

## Consequences

**Positive**
- Mandatory rank means there is always a reason to play and a fair ladder,
  even for players who never opt into wagers.
- Opt-in layers let players self-select their risk appetite.
- Recruitment turns every defeated captain into reusable content and gives
  "ownership" real teeth without resource destruction.
- The no-gear-loss rule keeps challenge acceptance non-scary — the loop
  stays alive.

**Negative / costs**
- Three systems to build and balance (rank/Elo, escrow for coin pots,
  persona-copy recruitment) rather than one.
- Recruitment needs rules for second-hand cases (recruiting a captain who
  was themselves built from a recruited persona) — deferred to build time.
- Elo tuning and wager-vs-difficulty balancing need playtesting.

## Open (deferred to build time)

- Rank tiers / season resets.
- Recruitment edge cases (transitive recruitment, persona staleness).
- Whether coin pots use escrow vs. post-settlement.
