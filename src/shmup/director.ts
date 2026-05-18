// ══════════════════════════════════════════════════════════════════
// MUSIC DIRECTOR — The music IS the game
// ══════════════════════════════════════════════════════════════════
// Every enemy, every formation, every moment of tension and release
// flows from the music's energy. The song is the level designer.
// Quiet = breathing room. Build-up = anticipation. Drop = chaos.
// Bass = power. Mid = rhythm. High = sparkle.

import type { MusicEnergy } from '../audio/analyzer';
import type { ShmupState, Faction, EnemyType, PowerUpType, MoveStyle } from './types';
import {
  profileForStage, sampleEnemy, sampleObstacle, getTriggerEnergy,
  type MusicProfile, type SignatureMechanic,
} from './musicProfiles';

export interface DirectorCommand {
  spawnEnemies: { type: EnemyType; faction: Faction; x: number; drop?: PowerUpType; formationId?: number; moveStyle?: MoveStyle; hp?: number; yOffset?: number }[];
  triggerFire: boolean;
  spawnPowerUp: PowerUpType | null;
  scrollSpeedMult: number;
  screenShake: number;
  bgPulse: number;
  particleBurst: boolean;
  fleetEvent: boolean;
  spawnObstacle: boolean;
  // Profile-driven optional outputs
  spawnObstacleType?: 'rock' | 'mine' | 'barrier' | 'vortex' | 'comet' | 'energyribbon' | 'splitter';
  signatureTrigger?: SignatureMechanic; // tells engine to fire a signature mechanic event this frame
  aggression: number;                    // 0-1, profile aggression for fire patterns
  // ── Waveform payload — which band peaked + how strong ──
  // The engine reads these on triggerFire to modulate bullet lifespan,
  // size, and speed. Bass beats fire long-lived heavy slow shots;
  // hihat beats fire short-lived fast proximity sparks; mid is normal.
  beatType?: 'bass' | 'mid' | 'high';
  beatStrength?: number;  // 0-1, amplitude of the peak that fired
}

// ── Smoothed state ──
let sBass = 0, sMid = 0, sHigh = 0, sOverall = 0;
let spawnCD = 0, fireCD = 0, puCD = 0, fleetCD = 0, obsCD = 0;
let guaranteedSpawnTimer = 0;

// ── Song structure tracking ──
let songEnergy = 0;         // cumulative energy — tracks position in song
let peakEnergy = 0;         // highest energy seen (normalizes dynamics)
let quietStreak = 0;        // consecutive quiet frames
let buildStreak = 0;        // consecutive build-up frames
let dropRecovery = 0;       // cooldown after a drop (don't spam)
let lastDropTick = -999;    // when the last drop happened
let rhythmPhase = 0;        // oscillates with the beat — drives formation timing
let intensityMemory = 0;    // slow-moving intensity (the "mood" of the last 10 seconds)
let framesSinceBeat = 0;    // frames since last triggerFire — used by procedural-fallback heartbeat

export function resetDirector(): void {
  sBass = sMid = sHigh = sOverall = 0;
  spawnCD = fireCD = puCD = fleetCD = obsCD = 0;
  guaranteedSpawnTimer = 60;
  songEnergy = 0;
  peakEnergy = 0.3;
  quietStreak = 0;
  buildStreak = 0;
  dropRecovery = 0;
  lastDropTick = -999;
  rhythmPhase = 0;
  intensityMemory = 0;
  framesSinceBeat = 0;
  nextFormationId = 1;
}

// ── Player power score — how loaded out is the ship right now? ──
// Returns 0-1. Fresh start ≈ 0.10, fully maxed ≈ 1.00. The director uses
// this to crank up spawn density / max enemies / cadence so a maxed-out
// loadout still feels meaningfully challenged. "If my ship has tons of
// firepower and it's destroying everything, it's not very fun."
export function playerPower(state: ShmupState): number {
  const p = state.player;
  const weaponScore = (
    Math.min(5, p.mainGunLevel) / 5 +
    Math.min(4, p.wingGunLevel) / 4 +
    Math.min(3, p.missileLevel) / 3 +
    Math.min(2, p.laserLevel) / 2 +
    Math.min(3, p.phaserLevel) / 3
  ) / 5;  // 0-1, average of normalized weapon levels
  const buffScore =
    (p.overdriveTimer > 0 ? 0.20 : 0) +
    (p.droneActive       ? 0.15 : 0) +
    (p.scoreMultTimer > 0? 0.08 : 0) +
    (p.magnetActive      ? 0.05 : 0);
  const shieldScore = Math.min(3, p.shields) / 3 * 0.12;
  const bombScore = Math.min(5, p.bombCount) / 5 * 0.08;
  return Math.min(1, weaponScore * 0.7 + buffScore + shieldScore + bombScore);
}

// ── Armada intensity — ramps as the boss approaches ──
// Constant 1.0 for the first 70% of the stage. From 70% → 100% of the
// timer, scales linearly up to 2.0 (twice as many enemies and roughly
// twice the spawn rate). This gives every level a real "closing in on
// the boss" escalation arc.
function armadaIntensity(state: ShmupState): number {
  const dur = state.stages[state.currentStage]?.duration || 2100;
  const timeProg = Math.min(state.tick / dur, 1);
  if (timeProg < 0.7) return 1;
  return 1 + (timeProg - 0.7) / 0.3;  // 1.0 → 2.0
}

// ── Difficulty curve based on time + stage ──
function diff(state: ShmupState): number {
  const dur = state.stages[state.currentStage]?.duration || 2100;
  const timeProg = Math.min(state.tick / dur, 1);
  const stageBonus = state.currentStage * 0.08;
  // Smooth S-curve: gentle start, builds in middle, peaks near end
  const curve = timeProg * timeProg * (3 - 2 * timeProg); // smoothstep
  return Math.min(1, curve * 0.7 + stageBonus);
}

// ── Enemy selection — profile-weighted, lightly modulated by difficulty ──
function pickEnemy(d: number, energy: MusicEnergy, profile: MusicProfile): EnemyType {
  // Early-game safety: until 15% difficulty, only fighters (gentle intro)
  if (d < 0.15) return 'fighter';
  // Otherwise the profile's weights are authoritative. Each song has a
  // distinct "fleet composition" — bass songs lean heavy, hihat songs lean
  // fighters, drone songs lean cruisers, etc.
  return sampleEnemy(profile);
}

function pickDrop(d: number, energy: MusicEnergy): PowerUpType | undefined {
  // Drops are more generous during quiet/recovery sections
  const dropChance = quietStreak > 20 ? 0.3 : 0.1 + d * 0.06;
  if (Math.random() > dropChance) return undefined;
  const types: PowerUpType[] = ['weapon','shield','missile','laser','phaser','bomb','emp','overdrive'];
  return types[Math.floor(Math.random() * types.length)];
}

// ══════════════════════════════════════════════════════════════════
// FORMATIONS — 12 distinct wave shapes randomly sampled per spawn
// ══════════════════════════════════════════════════════════════════
// Each formation is a function that takes difficulty + faction + profile
// and returns a list of enemies to spawn. The director picks a random
// formation each time it spawns, so successive waves feel unpredictable.

type FormationFn = (d: number, faction: Faction, energy: MusicEnergy, profile: MusicProfile) => DirectorCommand['spawnEnemies'];

const FORMATIONS: FormationFn[] = [
  // V — descending V shape, 4-6 enemies
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 4 + Math.floor(d * 2);
    const cx = 0.3 + Math.random() * 0.4;
    for (let i = 0; i < n; i++) {
      const offset = (i - (n - 1) / 2) * 0.10;
      out.push({ type: pickEnemy(d * 0.7, energy, profile), faction, x: cx + offset, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Inverted V (chevron pointing UP)
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 3 + Math.floor(d * 2);
    const cx = 0.3 + Math.random() * 0.4;
    for (let i = 0; i < n; i++) {
      out.push({ type: pickEnemy(d * 0.7, energy, profile), faction, x: cx + (i - (n - 1) / 2) * 0.08, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Line abreast — wide row
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 5 + Math.floor(d * 2);
    for (let i = 0; i < n; i++) {
      const x = 0.1 + (i / (n - 1)) * 0.8;
      out.push({ type: pickEnemy(d * 0.6, energy, profile), faction, x, drop: i === Math.floor(n / 2) ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Diagonal sweep — left-to-right or right-to-left
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const dir = Math.random() < 0.5 ? 1 : -1;
    const start = dir > 0 ? 0.15 : 0.85;
    for (let i = 0; i < 5; i++) {
      out.push({ type: 'fighter', faction, x: start + dir * i * 0.14, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Pincer — far left + far right
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.08, drop: pickDrop(d, energy) });
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.92 });
    if (d > 0.4) {
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.18 });
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.82 });
    }
    return out;
  },
  // Scatter cloud — 6-8 random positions
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 6 + Math.floor(d * 2);
    for (let i = 0; i < n; i++) {
      out.push({ type: 'fighter', faction, x: 0.08 + Math.random() * 0.84, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Column — 3 stacked tight at one x
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const cx = 0.2 + Math.random() * 0.6;
    for (let i = 0; i < 3; i++) {
      out.push({ type: pickEnemy(d * 0.7, energy, profile), faction, x: cx, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Mirror pair — heavy ships flanking center
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.32, drop: pickDrop(d, energy) });
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.68 });
    return out;
  },
  // Side rush — wave from one side
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const fromLeft = Math.random() < 0.5;
    const base = fromLeft ? 0.05 : 0.65;
    for (let i = 0; i < 4; i++) {
      out.push({ type: 'fighter', faction, x: base + i * 0.07, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Snake — zigzag across the top
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 5;
    for (let i = 0; i < n; i++) {
      const x = 0.2 + (i / (n - 1)) * 0.6 + Math.sin(i * 1.5) * 0.06;
      out.push({ type: 'fighter', faction, x, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Ramming spear — tight central column of 3-4
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 3 + Math.floor(d);
    for (let i = 0; i < n; i++) {
      const t = i === 0 ? pickEnemy(d, energy, profile) : 'fighter';
      out.push({ type: t, faction, x: 0.48 + Math.random() * 0.04, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    return out;
  },
  // Heavy single — one cruiser/elite with two fighter escorts
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const heavy: EnemyType = d > 0.5 ? 'elite' : 'cruiser';
    out.push({ type: heavy, faction, x: 0.5, drop: pickDrop(d, energy) });
    out.push({ type: 'fighter', faction, x: 0.32 });
    out.push({ type: 'fighter', faction, x: 0.68 });
    return out;
  },
  // ─── PAWN SWARM — 12-16 expendable fighters in 2 wide rows ───
  // Low HP each, but the sheer count means the player has to thread
  // through bullets while killing them. They naturally screen any heavier
  // ships spawning behind in the same wave window.
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const n = 12 + Math.floor(d * 4);
    const row1 = Math.ceil(n / 2);
    const row2 = n - row1;
    // Front row — top of screen
    for (let i = 0; i < row1; i++) {
      const x = 0.06 + (i / Math.max(1, row1 - 1)) * 0.88;
      out.push({ type: 'fighter', faction, x, hp: 2, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
    // Second row — staggered, slightly behind
    for (let i = 0; i < row2; i++) {
      const x = 0.12 + (i / Math.max(1, row2 - 1)) * 0.76;
      out.push({ type: 'fighter', faction, x, hp: 2, yOffset: -80 });
    }
    return out;
  },
  // ─── VANGUARD — pawn screen + heavy escort behind ───
  // 6-8 pawns at the front (yOffset 0) act as a shield wall while one
  // cruiser/elite spawns ~200px farther back. By the time the pawns reach
  // mid-screen and start dying, the heavy is in firing position. This is
  // the formation the user specifically asked for.
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const npawns = 6 + Math.floor(d * 3);
    const heavy: EnemyType = d > 0.45 ? 'elite' : 'cruiser';
    // Pawn screen across the front
    for (let i = 0; i < npawns; i++) {
      const x = 0.12 + (i / Math.max(1, npawns - 1)) * 0.76;
      out.push({ type: 'fighter', faction, x, hp: 2 });
    }
    // Heavy escort, well behind the screen — patrols independently
    out.push({ type: heavy, faction, x: 0.5, yOffset: -220, moveStyle: 'patrol', drop: pickDrop(d, energy) });
    return out;
  },
  // ─── BREACH WAVE — pawn V-screen + elite at the back point ───
  // Tactical-feeling formation: pawns fan outward forming a V that
  // protects the elite directly behind. The elite stays alive longer
  // and gets close enough to threaten the player with its homing orbs.
  (d, faction, energy, profile) => {
    const out: DirectorCommand['spawnEnemies'] = [];
    const npawns = 7;
    // V-shape — outer pawns higher (farther from player), tip lower (closer)
    for (let i = 0; i < npawns; i++) {
      const t = i / (npawns - 1);
      const x = 0.2 + t * 0.6;
      const dy = -Math.abs(t - 0.5) * 100;  // wings spawn further back
      out.push({ type: 'fighter', faction, x, hp: 2, yOffset: dy });
    }
    // Elite tucked behind the tip of the V — orbits once it arrives
    out.push({ type: 'elite', faction, x: 0.5, yOffset: -260, moveStyle: 'orbit', drop: pickDrop(d, energy) });
    return out;
  },
];

// Formation movement classification — which indices fly as a tight unit
// (locked-formation style) vs which fly loose (free patrol / orbit). Tight
// formations get a shared formationId so they descend in lockstep instead
// of every ship oscillating independently. Loose formations let each ship
// pick its own movement style for variety.
//   0  V-shape           — tight
//   1  Inverted V        — tight
//   2  Line abreast      — tight
//   3  Diagonal sweep    — loose (sweep entry)
//   4  Pincer            — loose
//   5  Scatter cloud     — loose
//   6  Column            — tight
//   7  Mirror pair       — loose
//   8  Side rush         — loose (dive entry)
//   9  Snake             — tight
//  10  Ramming spear     — tight
//  11  Heavy + escorts   — loose
const TIGHT_FORMATIONS = new Set([
  0, 1, 2, 6, 9, 10,
  // Pawn-screen formations (12, 13, 14) — pawns hold a tight wall to deflect
  // fire while their heavy escort closes the distance. Heavies in 13/14
  // explicitly set their own moveStyle so they aren't pinned to the wall.
  12, 13, 14,
]);
// Loose formations that should bias toward a specific entry style
const LOOSE_ENTRY: Record<number, MoveStyle> = {
  3: 'patrol',  // diagonal sweep → patrol after entry
  4: 'patrol',  // pincer → patrol the flanks
  5: 'patrol',  // scatter → individual patrols
  7: 'orbit',   // mirror pair → orbit the flanks
  8: 'dive',    // side rush → aggressive dive
  11: 'patrol', // heavy + escorts → escorts patrol around heavy
};

let nextFormationId = 1;

// Pick a random formation, possibly biased by profile's dominant band.
// Bass profiles slightly prefer heavier formations; high profiles prefer
// scatter/swarm; mid prefers structured formations.
function makeFormation(d: number, faction: Faction, energy: MusicEnergy, profile: MusicProfile): DirectorCommand['spawnEnemies'] {
  let idx = Math.floor(Math.random() * FORMATIONS.length);
  // Light profile bias
  const r = Math.random();
  if (profile.dominantBand === 'high' && r < 0.4) idx = [3, 5, 8, 9][Math.floor(Math.random() * 4)]; // diagonal / scatter / siderush / snake
  else if (profile.dominantBand === 'bass' && r < 0.4) idx = [6, 7, 10, 11][Math.floor(Math.random() * 4)]; // column / mirror / spear / heavy
  const spawns = FORMATIONS[idx](d, faction, energy, profile);
  if (TIGHT_FORMATIONS.has(idx)) {
    const fid = nextFormationId++;
    for (const s of spawns) {
      // Respect any explicit moveStyle from the formation (e.g. heavies in
      // vanguard / breach formations that want to patrol independently of
      // the pawn wall).
      if (s.moveStyle === undefined) {
        s.formationId = fid;
        s.moveStyle = 'formation';
      }
    }
  } else {
    const entry = LOOSE_ENTRY[idx];
    if (entry) for (const s of spawns) {
      if (s.moveStyle === undefined) s.moveStyle = entry;
    }
  }
  return spawns;
}

// ══════════════════════════════════════════════════════════════════
// MAIN DIRECTOR — called every frame, reads the music, writes the game
// ══════════════════════════════════════════════════════════════════
export function getDirectorCommand(energy: MusicEnergy, state: ShmupState): DirectorCommand {
  // ── Read the active song's profile — this drives every decision ──
  const profile = profileForStage(state.currentStage);
  const trigger = getTriggerEnergy(profile, energy);
  const density = profile.spawnDensity;

  const cmd: DirectorCommand = {
    spawnEnemies: [], triggerFire: false, spawnPowerUp: null,
    scrollSpeedMult: 1, screenShake: 0, bgPulse: 0,
    particleBurst: false, fleetEvent: false, spawnObstacle: false,
    aggression: profile.aggression,
  };

  // ── Stop spawning new enemies once the stage timer has elapsed ──
  // Otherwise the trickle/heartbeat refills the screen forever and the
  // boss-spawn condition (enemies === 0) is never met. The engine has a
  // hard fallback at duration+240, but this lets the screen clear naturally
  // so the boss makes a clean entrance.
  const stageDur = state.stages[state.currentStage]?.duration || 2100;
  if (state.tick >= stageDur && !state.bossActive) {
    return cmd; // empty command — let the screen drain for the boss
  }

  spawnCD--; fireCD--; puCD--; fleetCD--; obsCD--;
  guaranteedSpawnTimer--;
  if (dropRecovery > 0) dropRecovery--;

  const stage = state.stages[state.currentStage];
  const faction = profile.factionOverride || stage?.faction || 'klingon';
  const d = diff(state);
  const tick = state.tick;

  // ── Smooth energy bands (prevents jitter) ──
  sBass += (energy.bass - sBass) * 0.15;
  sMid += (energy.mid - sMid) * 0.12;
  sHigh += (energy.high - sHigh) * 0.1;
  sOverall += (energy.overall - sOverall) * 0.1;

  // Track peak for normalization
  if (sOverall > peakEnergy) peakEnergy = sOverall;
  const normalizedEnergy = peakEnergy > 0.05 ? sOverall / peakEnergy : 0;

  // Cumulative energy — song position proxy
  songEnergy += sOverall * 0.01;

  // Intensity memory — slow-moving mood (10-second window feel)
  intensityMemory += (normalizedEnergy - intensityMemory) * 0.005;

  // Rhythm phase — oscillates with mid-band hits for timing variety
  if (energy.midHit) rhythmPhase += 0.2;
  rhythmPhase += 0.003;

  // ── Song structure detection ──
  if (energy.isQuiet) {
    quietStreak++;
    buildStreak = 0;
  } else {
    quietStreak = 0;
  }
  if (energy.isBuildUp) buildStreak++;
  else buildStreak = Math.max(0, buildStreak - 1);

  // ══════════════════════════════════════════════════════════════
  // SCROLL SPEED — breathes with the music
  // Quiet = slow drift. Intense = rushing forward. Drops = surge.
  // Tightened range so quiet→intense isn't a 2x swing — keeps the
  // playfield feeling controllable instead of zoomy.
  // ══════════════════════════════════════════════════════════════
  const baseScroll = 0.65 + normalizedEnergy * 0.35;
  const dropSurge = energy.isDrop ? 0.25 : 0;
  cmd.scrollSpeedMult = baseScroll + dropSurge;

  // ══════════════════════════════════════════════════════════════
  // VISUAL PULSE — the screen + every projectile breathes with EVERY beat
  // ══════════════════════════════════════════════════════════════
  // bgPulse drives state.beatPulse, which the renderer multiplies into
  // enemy-bullet visuals so they throb in time with the music. Driven
  // by whichever band peaked, with bass hitting hardest.
  if (energy.bassHit && sBass > 0.18) {
    cmd.bgPulse = Math.max(cmd.bgPulse, Math.min(sBass * 0.55, 0.70));
  }
  if (energy.midHit && sMid > 0.18) {
    cmd.bgPulse = Math.max(cmd.bgPulse, Math.min(sMid * 0.45, 0.55));
  }
  // Hihat-style high-frequency beats also push the pulse, just lighter.
  if (energy.midHit && sHigh > 0.30) {
    cmd.bgPulse = Math.max(cmd.bgPulse, Math.min(sHigh * 0.40, 0.45));
  }
  if (energy.midHit && sMid > 0.3) {
    cmd.particleBurst = true;
  }

  // ── Adaptive difficulty — player power + armada ramp ──
  // power: 0-1, how loaded out the ship is right now
  // armada: 1.0-2.0, how close we are to the boss (last 30% of stage)
  // Both feed into the spawn cap, cadence, and trigger chance so a
  // maxed loadout always has more to dodge, and the level escalates
  // visibly as the boss approaches.
  const power = playerPower(state);
  const armada = armadaIntensity(state);
  const powerBonus = Math.floor(power * 4);       // +0 to +4 enemies
  const armadaBonus = Math.floor((armada - 1) * 6); // +0 to +6 enemies in last 30%

  // ══════════════════════════════════════════════════════════════
  // SPAWNING — purely procedural rhythm. Music no longer gates spawns.
  // ══════════════════════════════════════════════════════════════
  // Spawn cadence varies randomly (quick burst / tight wave / normal / breath)
  // so successive waves feel unpredictable. Formation is sampled randomly
  // from FORMATIONS. Power + armada tighten the cadence so a loaded ship
  // facing a boss-approach has noticeably more on-screen.
  const baseMax = 7 + Math.floor(d * 8);
  const maxEnemies = baseMax + powerBonus + armadaBonus;  // up to ~25 at peak
  const currentEnemies = state.enemies.filter(e => e.alive).length;

  if (spawnCD <= 0 && currentEnemies < maxEnemies) {
    cmd.spawnEnemies.push(...makeFormation(d, faction, energy, profile));

    // Choose next-spawn delay — random rhythm mode each time
    const r = Math.random();
    let base: number;
    if (r < 0.18)      base = 24;   // quick burst — feels like a flurry
    else if (r < 0.45) base = 48;   // tight wave — pressure
    else if (r < 0.85) base = 80;   // normal cadence
    else               base = 140;  // breathing room
    // Tighten with power + armada so the level escalates without music gating
    const tighten = 1 + power * 0.5 + (armada - 1) * 0.6;
    spawnCD = Math.max(15, Math.floor(base / tighten));
  }

  // Guaranteed trickle if the screen unexpectedly drains
  if (guaranteedSpawnTimer <= 0 && currentEnemies < 2) {
    cmd.spawnEnemies.push(...makeFormation(d, faction, energy, profile));
    guaranteedSpawnTimer = 80;
  }

  // Periodic powerup drops (untied from music quiet sections)
  if (puCD <= 0 && Math.random() < 0.005) {
    const types: PowerUpType[] = ['shield','weapon','missile','overdrive','drone','score2x','crew'];
    cmd.spawnPowerUp = types[Math.floor(Math.random() * types.length)];
    puCD = 240;
  }

  // Periodic obstacle drops driven by stage progress, not music
  if (obsCD <= 0 && d > 0.15 && Math.random() < 0.005 * density) {
    cmd.spawnObstacle = true;
    cmd.spawnObstacleType = sampleObstacle(profile);
    obsCD = Math.floor(60 - d * 15);
  }

  // ══════════════════════════════════════════════════════════════
  // WAVEFORM PAYLOAD — every beat fires every enemy
  // ══════════════════════════════════════════════════════════════
  // The band that peaked determines the payload feel:
  //   bass kick   → LONG-LIFE HEAVY SLOW shot
  //   mid snare   → NORMAL shot
  //   hihat snap  → SHORT-LIFE FAST SMALL proximity shot
  let beatType: 'bass' | 'mid' | 'high' | undefined;
  let beatStrength = 0;
  // Lower thresholds — most music will fire reliably
  if (energy.bassHit && sBass > 0.06) { beatType = 'bass'; beatStrength = Math.max(0.3, sBass); }
  else if (energy.midHit && sHigh > 0.20 && sHigh > sMid * 0.6) { beatType = 'high'; beatStrength = Math.max(0.3, sHigh); }
  else if (energy.midHit && sMid > 0.06) { beatType = 'mid'; beatStrength = Math.max(0.3, sMid); }

  // ── Procedural fallback heartbeat ──
  // If the music analyzer hasn't produced a usable beat for too long
  // (muted audio, autoplay block, quiet track, etc), generate one
  // ourselves so the game never stops firing. ~70 BPM = every ~50 frames.
  framesSinceBeat++;
  if (!beatType && framesSinceBeat > 50) {
    // Pick a band based on the most-recent live music levels, or
    // alternate procedurally if music is silent.
    if (sBass > sMid && sBass > sHigh) beatType = 'bass';
    else if (sHigh > sMid) beatType = 'high';
    else beatType = 'mid';
    beatStrength = Math.max(0.35, sOverall);
  }

  if (beatType && fireCD <= 0) {
    cmd.triggerFire = true;
    cmd.beatType = beatType;
    cmd.beatStrength = Math.min(1, beatStrength);
    framesSinceBeat = 0;
    const cooldownBase = 38 - profile.aggression * 18;
    const tighten = 1 + power * 0.5 + (armada - 1) * 0.6;
    fireCD = Math.max(6, Math.floor(cooldownBase / tighten));
  }

  // ── OBSTACLES — type chosen from profile, rate from high frequencies ──
  if (obsCD <= 0 && sHigh > 0.4 && d > 0.15) {
    if (Math.random() < (0.008 + sHigh * 0.005) * density) {
      cmd.spawnObstacle = true;
      cmd.spawnObstacleType = sampleObstacle(profile);
      obsCD = Math.floor(50 - d * 15);
    }
  }

  // ── VORTEX STORM SIGNATURE — sustained bass during a vortex-storm song
  // spawns extra gravity wells, even outside the normal obstacle cadence ──
  if (profile.signature === 'vortex_storm' && sBass > 0.5 && obsCD <= 10 && Math.random() < 0.02) {
    cmd.spawnObstacle = true;
    cmd.spawnObstacleType = 'vortex';
    obsCD = 90;
  }

  // ══════════════════════════════════════════════════════════════
  // POWERUPS — quiet sections and post-drop recovery
  // ══════════════════════════════════════════════════════════════
  if (puCD <= 0) {
    // Post-drop: reward survival
    if (tick - lastDropTick > 60 && tick - lastDropTick < 120) {
      const rewardTypes: PowerUpType[] = ['shield','weapon','missile','bomb'];
      cmd.spawnPowerUp = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      puCD = 120;
    }
    // General quiet reward
    if (energy.isQuiet && Math.random() < 0.01) {
      const types: PowerUpType[] = ['shield','weapon','missile','laser','phaser','bomb','emp','overdrive','drone','score2x'];
      cmd.spawnPowerUp = types[Math.floor(Math.random() * types.length)];
      puCD = 100;
    }
  }

  return cmd;
}
