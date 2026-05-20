# NetTrek — Game Legend & Inventory

A complete reference of every item, enemy, boss, and hazard in the game.
Source of truth: `src/shmup/`. Keep this in sync when content changes.

---

## Power-ups (collectibles)

Floating pickups that drift down the screen. Touch them to collect. Each has
a distinct **color** and **shape** so it reads at a glance.

| Item | Color | Shape | Effect |
|---|---|---|---|
| **Weapon** | Cyan `#00ccff` | Hexagonal crystal prism — **this is the "blue diamond"** | Main cannon +1 level (max 5). Each level adds shots / spread. |
| **Crew** | Amber `#ffcc66` | Away-team figure | Wing guns +1 (max 4); if maxed, main cannon +1; if all maxed, +1 shield. |
| **Shield** | Green `#44ff44` | Heraldic shield with cross | +1 shield layer. |
| **Coin / Star** | Gold `#ffdd00` | Spinning gold coin | Currency. Spend in the Hangar on upgrades. |
| **Bomb** | Red `#ff4444` | Black sphere, lit fuse | +1 screen-clearing bomb in reserve. |
| **Magnet** | Pink `#ff88ff` | Horseshoe magnet | Auto-pulls coins toward you for ~10s. |
| **Missile** | Orange `#ffaa00` | Rocket | Homing missiles +1 level (max 3). |
| **Laser** | Magenta `#ff44ff` | Diamond prism with beam | Laser beam +1 level (max 2). |
| **Phaser** | Orange `#ff8833` | Triangular emitter | Phaser +1 level (max 3). First pickup unlocks the lock-on beam. |
| **Life** | Salmon `#ff8888` | Pulsing heart gem | +1 extra life. |
| **EMP** | Light blue `#44ddff` | Lightning bolt | Freezes all enemies ~2s, deals 2 damage, clears all enemy bullets. |
| **Overdrive** | Orange `#ff6600` | Flame | Double fire-rate for 7s. |
| **Drone** | Green `#44ffaa` | 4-point star-ship | Deploys a wingman drone that fires for 25s. |
| **Score ×2** | Yellow `#ffff00` | ×2 badge | Doubles score earned for 10s. |

> **The blue diamonds you've been seeing are the Weapon power-up** — your
> single most important pickup. Grab every one; it levels your main cannon.

---

## Player weapons

Your ship's arsenal. Levels are bought in the Hangar or found as power-ups.

| Weapon | Max Lvl | Behavior |
|---|---|---|
| **Main Cannon** | 5 | Auto-fires forward. Levels add bolts: single → twin → triple → 5-spread → white-hot quad. |
| **Wing Guns** | 4 | Side-mounted auto-fire. Crewed by away-team pickups. |
| **Missiles** | 3 | Homing warheads with smoke trails. |
| **Laser** | 2 | Magenta continuous beam segment (special-fire). |
| **Phaser** | 3 | Charge-based lock-on beam. Locks a target until destroyed or power drains, then recharges. |
| **Bomb** | 5 held | Manual screen-clear — wipes bullets and damages everything. |

---

## Enemy ships

Five non-boss classes. Each has a unique movement style and weapon profile.

| Enemy | HP | Movement | Weapon | Notes |
|---|---|---|---|---|
| **Fighter** | 6 | Patrol / dive / formation | Fast laser bolts | Cheap, swarms. Pawn formations use 2-HP variants. |
| **Bomber** | 18 | Slow drift descent | Drifting mines (long-life orbs) | Weighty, fires rarely. |
| **Cruiser** | 55 | Patrol — settles, strafes | Plasma blobs (3-shot) | Mid-weight, diamond/rhombus silhouette. |
| **Elite** | 95 | Orbit / spiral | Homing orbs | Aggressive, hard to predict. |
| **Turret** | 35 | Anchors near top of screen | Precision needles | Stationary platform. |

> HP shown is the base value. Actual HP scales with stage, time, and **your
> loadout** — a maxed-out ship faces ~2.4× tougher enemies so the game
> stays challenging.

### Enemy bullet color = threat

**All enemy fire is hot magenta-red.** If it's that color, it can hurt you —
navigate around it. Your own fire is cyan/blue/orange. This is a deliberate
readability rule.

---

## Bosses

One per stage (11 total). Each has named, **destroyable subsystems** — you
must take out the weapon hardpoints before the main hull becomes vulnerable.
A bright hex shield bubble means the hull is still protected.

| Stage | Boss | Type | Faction | HP | Phases |
|---|---|---|---|---|---|
| 1 | T'VAK Class Assault Vessel | tvak | Klingon | 1200 | 4 |
| 2 | IRW Valdore | dreadnought | Romulan | 350 | 4 |
| 3 | Orion Flagship | flagship | Orion | 500 | 5 |
| 4 | Singularity Marauder | gravitymarauder | Romulan | 650 | 4 |
| 5 | Anomaly Guardian | guardian | Klingon | 600 | 4 |
| 6 | Rift Sovereign | sovereign | Romulan | 700 | 4 |
| 7 | Fortress Command | fortress | Orion | 1000 | 5 |
| 8 | Singularity Dreadnought | singularity | Klingon | 1200 | 5 |
| 9 | Event Horizon Tyrant | voidtyrant | Klingon | 1500 | 5 |
| 10 | Phase Wraith | wraith | Romulan | 1400 | 5 |
| 11 | OMEGA SUPREME | omega | Orion | 2000 | 6 |

T'VAK has 6 named hardpoints: Disruptor, Missile, Plasma, Tractor, Phaser,
Torpedo. Bosses get more aggressive each phase as HP drops.

---

## Obstacles (music-director hazards)

Spawned by the music director, not scripted. Some are destroyable, some must
be dodged.

| Obstacle | Behavior |
|---|---|
| **Rock** | Asteroid. Destroyable. |
| **Mine** | Explodes on contact. Destroyable. |
| **Barrier** | Solid wall segment — block it or thread the gap. |
| **Vortex** | Gravity well — pulls your ship in. Indestructible; endure it. |
| **Comet** | Fast-moving body with a particle tail. |
| **Energy Ribbon** | Flowing aurora stream that weaves across space. |
| **Splitter** | Volatile asteroid — breaks into fragments when destroyed. |

## Terrain (scenic walls)

Scrolling environmental walls with a gap to fly through.

| Terrain | Damaging? |
|---|---|
| **Canyon** | Yes — solid rock, contact = death |
| **Asteroid Corridor** | No |
| **Station Debris** | No |
| **Wormhole Tunnel** | No |
| **Crystal Field** | No |

## Signature mechanics (per-song)

Triggered on musical drops. Each stage's song has its own:
curtain (rising bullet wall), pulse walls (scanning energy lines), vortex
storm (three gravity wells), swarm, siege, finale.

---

## HUD reference

- **Top bar** — armory: GUN / WNG / MSL / LSR / PHS / SHD / BMB / LOK
  (lock-on phaser charge). Pips show level; slot pulses on upgrade.
- **Bottom-left panel** — hearts (lives, pulse red at 1), shield bars,
  score, combo multiplier.
- **Bottom-right** — coin count.
- **Top-left EQ** — live music waveform (Bass / Mid / High); flashes on beat.
- **Combo aura** — glowing ring around your ship; yellow→red as the kill
  chain climbs.

---

## Combat feedback cues

| You see | It means |
|---|---|
| Enemy flashes white | It took a hit |
| Cyan sparks bouncing off a boss | Hull is shielded — destroy subsystems first |
| Yellow sparks on a boss | You hit a weak point — keep firing there |
| Hot magenta-red projectile | Enemy fire — dodge it |
| Screen edge red vignette | You took damage |
| Bright hex bubble on boss | Subsystems still up; hull invulnerable |
