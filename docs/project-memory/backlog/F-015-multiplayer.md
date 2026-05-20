# F-015 — Multiplayer: Captain-Designed Challenges

- **Type:** Feature (epic)
- **Priority:** P3 (the multiplayer vision — depends on F-001)
- **Effort:** XL — multi-sprint epic
- **Status:** Backlog

## Vision

Every player is a **Captain** — a persistent, named identity that levels up
the more you play. Multiplayer is **asynchronous**: a captain *designs a
level* and *sends it to another captain* as a training-simulator challenge.
The sending captain's AI agent controls the alien enemy fleet inside that
challenge; the receiving captain has to fight through it.

This makes every player a level designer, and turns the agent-director
feature (F-001) into the multiplayer mechanic itself. Architecture decision:
`../adr/ADR-002-captain-as-director.md`.

## The loop

1. **Be a Captain.** Onboarding: choose a captain name, or have AI generate
   one. We're all captains. (Captain-name onboarding ties into F-007.)
2. **Grow.** The captain levels up with play — a character, not just a ship.
   The more you play, the better your captain becomes.
3. **Earn the Quantum Computer.** Discovered along the campaign. It gates
   captain-vs-captain play — it unlocks "hacking" an enemy fleet, i.e. the
   ability to author and send challenges.
4. **Design a challenge.** With the quantum computer, a captain crafts a
   level: they take a hacked alien fleet and — via an AI agent embodying
   the captain — *control* it. The captain IS the level's director.
5. **Send it.** The challenge goes to another captain, asynchronously, like
   a training simulator / play-by-mail.
6. **Beat it.** The receiving captain fights through the authored encounter.
7. **Stakes.** Winning/losing creates "some kind of ownership" or a
   back-and-forth between the two captains — **OPEN design question.**

## Why asynchronous matters

This is play-by-mail, not realtime. No lag, no client prediction, no
authoritative realtime simulation. A "challenge" is a serialized captain
persona + level program; it is stored, fetched, and played locally — the
recipient's tactical director executes the sender's captain-as-strategic-
director. That reuses F-001's agent-director infrastructure almost wholesale.

## Components (slice across sprints)

- Captain identity + naming onboarding (self-chosen / AI-generated)
- Captain progression system (leveling, persistence)
- The Quantum Computer — campaign item + the authoring-unlock gate
- Challenge authoring — captain designs the encounter; AI agent drives the
  fleet as that captain
- Challenge serialization + a backend datastore for captains & challenges
- Challenge delivery / inbox — send to and receive from other captains
- Challenge playback — recipient plays the authored encounter
- Win/loss stakes — design + implement (after the design question resolves)

## Dependencies

- **Depends on F-001** — the agent-director loop (Directive seam, proxy,
  tactical/strategic split) must work before captains can direct fleets.
- Backend datastore for captains/challenges overlaps F-001's proxy infra
  and B-002 (API routing).

## Not this: the realtime server

`server/game-server.js` is a realtime Netrek-style planet-warfare model — a
*different game*. It is NOT the path for captain-designed challenges, which
are asynchronous. Treat it as a possible separate future "realtime arena"
mode, out of scope for this epic.
