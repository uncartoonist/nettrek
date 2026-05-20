# Session

Session-ID: S-2026-05-20-0219-afterburner-install
Title: Install Afterburner sprint framework into NetTrek
Date: 2026-05-20
Author: Claude (Opus 4.7) + Chad

## Goal

Bootstrap the Afterburner (traceable-searchable-adr-memory-index) framework
into NetTrek so the groomed backlog can feed automated multi-agent sprints.

## Context

The improvement effort had already been groomed into 17 backlog tickets
(`docs/project-memory/backlog/`) plus ADR-001 and a grooming session log,
but the `.sprint/` tooling did not exist in-repo. The framework was already
cloned at `/Users/chad/GUILD/traceable-searchable-adr-memory-index`.

## Plan

1. Inspect `toolkit/setup.sh` for safety (no overwrites of existing memory).
2. Run it against the NetTrek repo.
3. Configure `.sprint/config.sh` test command and fill the project CLAUDE.md.

## Changes Made

- Ran `toolkit/setup.sh` — installed `.sprint/scripts/` (13 scripts + brief
  generator), `.sprint/roles/`, `.sprint/config.sh`, `.sprint/config/`,
  `.sprint/history/`, ADR + session templates, `docs/project-memory/tools/`,
  `docs/lifecycle/`, `docs/seed/`, and a project `CLAUDE.md`.
- Pre-existing groomed backlog (17 tickets + README), ADR-001, and the
  grooming session log were all preserved — setup is existence-checked.
- Set `DEFAULT_TEST_CMD` to `npx tsc --noEmit && npx vite build` (NetTrek
  has no unit-test runner; typecheck + build is the correctness gate).
- Filled the project `CLAUDE.md` overview / tech-stack / commands sections.

## Decisions Made

- **Did not modify the framework repo's git state.** It had local changes
  and was 5 commits behind origin; updating it is a separate concern and
  the on-disk `setup.sh` was verified identical to the latest published
  version before running.
- **Test command = typecheck + build.** No test suite exists; this is the
  honest correctness gate and uses direct binaries (no npm wrapper) for
  clean sprint exit-code detection.

## Open Questions

- Multiplayer scope (B-003) — unresolved; affects F-001 sequencing.
- `.sprint/` is gitignored or not? Confirm whether sprint scripts should be
  committed to the NetTrek repo or treated as local tooling.

## Links

Commits:
- (this session's commit) — Install Afterburner framework + configure

ADRs:
- ADR-001 - Two-tier architecture for agent directors
