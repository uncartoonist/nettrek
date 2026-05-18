# Agent Directors

A future direction for NetTrek: replace the procedural music director with a
roster of **AI agent directors** — LLM-backed personalities that direct each
playthrough like a dungeon master.

## Today's director

`src/shmup/director.ts` → `getDirectorCommand()`. Runs every frame. Reads
music energy + game state, emits commands: spawn this formation, fire that
signature mechanic, scale enemy fire rate, etc. Deterministic + music-reactive.
A clean abstraction layer — but no taste, no narrative, no surprise.

## The vision

Each playthrough is directed by an **agent with a personality**. The agent
makes high-level creative choices in natural language and tool calls; the
deterministic per-frame code executes those choices. Over time, build a
roster of directors that the game cycles through — each reskinning music,
palette, formations, pacing to match their worldview.

Example personalities:

- **Vidya** — chaotic remixer; loves signature mechanics; keeps the player
  on tilt; rapid music swaps mid-stage.
- **Kostrov** — tactical purist; favors vanguard / breach formations; slow
  pace; muted palette; rewards positional play.
- **Tempest** — DJ; the music is the lead; he reshapes the fight to match
  the song's energy curve; cross-fades tracks.
- **Vex** — sadistic; reads the player's weak side and squeezes it.
- (more to discover — the roster is the long-term content)

## Architecture: two-tier director

The single biggest design decision. LLMs are slow + expensive; the game runs
at 60fps. So we split:

```
┌──────────────────────────────────────────────────────┐
│  STRATEGIC DIRECTOR  (LLM agent, ~every 3-10s)       │
│  - Reads serialized game state                       │
│  - Reasons about player behavior, music section      │
│  - Emits a directive via tool calls                  │
│  - Speaks (optional) — short in-character lines      │
└────────────────────────┬─────────────────────────────┘
                         │ async directive update
                         ▼
┌──────────────────────────────────────────────────────┐
│  TACTICAL DIRECTOR  (procedural, every frame)        │
│  - Reads the latest directive                        │
│  - Picks formations, fires curtains, modulates       │
│    aggression — using the existing knobs             │
│  - Keeps playing during LLM round-trips              │
└──────────────────────────────────────────────────────┘
```

The strategic layer sets **intent**. The tactical layer executes. If the API
is slow / rate-limited / down, the game keeps playing on the last directive
— the only thing that suffers is *taste*, not *function*.

## Tool surface

The agent directs by calling tools. Each tool maps to an existing director
knob, so the agent never speaks raw game state:

| Tool | Effect |
|---|---|
| `set_aggression(0-1)` | spawn density + fire cadence multiplier |
| `bias_formations(weights)` | shift formation sampling toward chosen archetypes |
| `queue_signature(mechanic)` | trigger curtain / vortex / pulse walls on next beat |
| `set_palette(name or RGB)` | reskin obstacles + bullets + bg tint |
| `swap_track(track_id)` | crossfade to a new song |
| `say(string)` | short in-character transmission to the player |
| `set_scroll(0-2)` | scroll speed multiplier |
| `target_player_weakness(side)` | bias spawn x toward player's recent screen side |

Personality = system prompt + biases in how often the agent reaches for
each tool. Vidya hits `queue_signature` often; Kostrov mostly uses
`bias_formations`; Tempest leads with `swap_track`.

## Infrastructure

NetTrek is pure-static today (S3 + CloudFront). Adding agent directors means
adding **one piece of server infra**: a tiny proxy that

1. Takes a serialized game-state snapshot from the client
2. Calls Claude with the active director's system prompt + tool definitions
3. Returns the tool calls as JSON

Lambda or a Cloudflare Worker is the right shape. Roughly 100-200 lines.
Anthropic API key lives on the server, never in the client.

Roughly 100 strategic calls per stage at ~$0.001-0.01 each (depending on
model + cache). Real cost but manageable. Haiku is plenty for tool selection.

## What this unlocks vs procedural

Things the current weight-tables can't do:

- **Narrative reasoning** — "the player has been hugging the right edge for
  20 seconds; squeeze them from that side"
- **Cross-modal creative choices** — agent reads track metadata, picks a
  palette in natural language, reaches for matching formations
- **In-stage memory and arc** — "I already pulled the vortex storm — switch
  tone, give them breathing room"
- **Voice** — short transmissions in character, between waves
- **True variability** — two playthroughs with the same RNG seed feel
  meaningfully different because the agent reasons differently each time

## Game-state context for the agent

What the strategic director sees every call:

```json
{
  "tick": 4523,
  "stage": "nebula-drumline",
  "stageProgress": 0.34,
  "musicSection": "build",
  "musicEnergy": { "bass": 0.7, "mid": 0.4, "high": 0.6 },
  "player": {
    "hp": 4,
    "powerScore": 0.55,
    "recentPosition": { "x_avg_last_5s": 0.82, "y_avg_last_5s": 0.7 },
    "deathsThisStage": 1
  },
  "fleet": {
    "alive": 12,
    "killedLastWave": 18,
    "lastFormation": "vanguard"
  },
  "directorMemory": [
    "queued curtain at tick 3800",
    "shifted palette to rust at tick 2400"
  ]
}
```

The directorMemory line is the agent's own scratch — last 5-10 actions, so
it can avoid repeating itself within a stage.

## Smallest first slice

When we come back to this, the smallest meaningful prototype is:

1. **Pull the strategic seam** in `director.ts` — extract a `Directive` type
   that the tactical layer reads.
2. **Stand up the proxy** — one endpoint, hardcoded to a single director.
3. **Ship one director — one voice.** Pick Kostrov (most coherent) or
   Vidya (most fun to test). Prove the round-trip works during a stage.
4. **Compare to procedural-only baseline.** Does the directed playthrough
   feel meaningfully different? If not, the tool surface is too narrow.

Only after that loop is proven do we build the roster and the personality
selection UI.

## Open questions to revisit

- How much of the director should the player *see*? Just transmissions?
  A name on the briefing screen? A portrait?
- Can directors be **earned / unlocked**? Beat a stage under Kostrov, you
  unlock Vex.
- Can directors **remember the player across runs**? ("Last time you
  cleared with the phaser. I won't make that easy again.") Probably
  requires a tiny user profile store, but powerful.
- Music modification — the easy version is `swap_track`. The hard version
  is generating new music. Park the hard version.
- Multiplayer / shared director? Two players, one director directing both.
  Likely far off.

## Why this is worth doing

Procedural music direction is a solved problem — there are great examples
in the genre. **Agent directors are not.** Nobody is shipping a shmup where
the encounter design is reasoning about you in natural language, in real
time, with personality. If it works, this is the thing about NetTrek that
people screenshot and share.
