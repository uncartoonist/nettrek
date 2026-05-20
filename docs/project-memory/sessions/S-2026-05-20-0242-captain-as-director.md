# Session

Session-ID: S-2026-05-20-0242-captain-as-director
Title: Captain-as-director multiplayer vision — write-up
Date: 2026-05-20
Author: Claude (Opus 4.7) + Chad

## Goal

Capture the multiplayer vision the user pitched: every player is a Captain
who designs AI-directed challenge levels and sends them to other captains.

## Context

Multiplayer was confirmed on the roadmap (F-015). The user then shared a
specific vision that reframes it — and reframes the agent-director epic
(F-001) along with it. Captured before the thread was lost.

## The idea (as confirmed back to the user)

- Every player is a **Captain** — named (self-chosen or AI-generated),
  persistent, levels up the more you play.
- A campaign-discovered **Quantum Computer** gates captain-vs-captain play:
  it unlocks "hacking" an enemy fleet = the ability to author challenges.
- A captain **designs a level** — an AI agent embodying the captain
  controls the alien enemy fleet — and **sends it to another captain** as
  an asynchronous training-simulator challenge.
- Win/loss stakes ("ownership" / "back-and-forth") — left open by the user.

## Changes Made

- Rewrote **F-015** around the captain-designed-challenge model; documented
  the asynchronous (play-by-mail) nature and the dependency on F-001.
- Wrote **ADR-002 — Captain-as-Director**: the player's captain IS the
  strategic director; multiplayer is asynchronous challenge trading;
  extends ADR-001.
- Updated **F-001** — the "roster of personalities" framing is superseded;
  F-001 now scoped to the engine + one baseline director, F-015 builds on it.
- Updated backlog README index + sprint sequencing.

## Decisions Made

- **Asynchronous, not realtime.** A challenge is a serialized captain
  persona + level program — stored, sent, played locally. No realtime
  netcode. Reuses the agent-director proxy (ADR-001) almost wholesale.
- **The realtime `server/game-server.js` stack is not this path** — it is a
  possible separate future "realtime arena" mode, out of scope for F-015.
- **F-001 before F-015.** The agent-director loop must work before captains
  can direct fleets.

## Open Questions

- Win/loss stakes between captains — needs a dedicated design session.
- Captain progression model — what exactly "levels up" and how it shapes
  the challenges a captain can author.

## Links

ADRs:
- ADR-002 - Captain-as-Director: players are the agent directors
- ADR-001 - Two-tier architecture for agent directors (extended by ADR-002)
