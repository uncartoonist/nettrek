// ══════════════════════════════════════════════════════════════════
// MUSIC DIRECTOR — The music IS the game
// ══════════════════════════════════════════════════════════════════
// Every enemy, every formation, every moment of tension and release
// flows from the music's energy. The song is the level designer.
// Quiet = breathing room. Build-up = anticipation. Drop = chaos.
// Bass = power. Mid = rhythm. High = sparkle.

import type { MusicEnergy } from '../audio/analyzer';
import type { ShmupState, Faction, EnemyType, PowerUpType } from './types';
import {
  profileForStage, sampleEnemy, sampleObstacle, getTriggerEnergy,
  type MusicProfile, type SignatureMechanic,
} from './musicProfiles';

export interface DirectorCommand {
  spawnEnemies: { type: EnemyType; faction: Faction; x: number; drop?: PowerUpType }[];
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
}

// ── Player power score — how loaded out is the ship right now? ──
// Returns 0-1. Fresh start ≈ 0.10, fully maxed ≈ 1.00. The director uses
// this to crank up spawn density / max enemies / cadence so a maxed-out
// loadout still feels meaningfully challenged. "If my ship has tons of
// firepower and it's destroying everything, it's not very fun."
function playerPower(state: ShmupState): number {
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
];

// Pick a random formation, possibly biased by profile's dominant band.
// Bass profiles slightly prefer heavier formations; high profiles prefer
// scatter/swarm; mid prefers structured formations.
function makeFormation(d: number, faction: Faction, energy: MusicEnergy, profile: MusicProfile): DirectorCommand['spawnEnemies'] {
  let idx = Math.floor(Math.random() * FORMATIONS.length);
  // Light profile bias
  const r = Math.random();
  if (profile.dominantBand === 'high' && r < 0.4) idx = [3, 5, 8, 9][Math.floor(Math.random() * 4)]; // diagonal / scatter / siderush / snake
  else if (profile.dominantBand === 'bass' && r < 0.4) idx = [6, 7, 10, 11][Math.floor(Math.random() * 4)]; // column / mirror / spear / heavy
  return FORMATIONS[idx](d, faction, energy, profile);
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
  // ══════════════════════════════════════════════════════════════
  const baseScroll = 0.7 + normalizedEnergy * 0.5;
  const dropSurge = energy.isDrop ? 0.4 : 0;
  cmd.scrollSpeedMult = baseScroll + dropSurge;

  // ══════════════════════════════════════════════════════════════
  // VISUAL PULSE — the screen breathes with the bass
  // ══════════════════════════════════════════════════════════════
  if (energy.bassHit && sBass > 0.25) {
    cmd.bgPulse = Math.min(sBass * 0.4, 0.5);
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
  // WAVEFORM PAYLOAD — music's only gameplay job now
  // ══════════════════════════════════════════════════════════════
  // Every peak in the music's waveform fires a payload from all on-screen
  // enemies. The BAND that peaked determines what the payload feels like:
  //   bass kick   → LONG-LIFE HEAVY SLOW shot (sustained sweeping threat)
  //   mid snare   → NORMAL shot (balanced)
  //   hihat snap  → SHORT-LIFE FAST SMALL shot (proximity-only, lingers
  //                 just long enough to bite if you're close)
  // So sometimes the threat reaches across the screen, sometimes it's
  // a quick sting — driven entirely by the music's texture.
  //
  // beatStrength is the amplitude at the moment of fire; bigger peaks
  // produce bigger payloads.
  let beatType: 'bass' | 'mid' | 'high' | undefined;
  let beatStrength = 0;
  // Classify in priority order — bass beats are the heaviest and win when
  // both bass + mid hit on the same frame.
  if (energy.bassHit && sBass > 0.18) { beatType = 'bass'; beatStrength = sBass; }
  else if (energy.midHit && sHigh > 0.35 && sHigh > sMid * 0.7) { beatType = 'high'; beatStrength = sHigh; }
  else if (energy.midHit && sMid > 0.18) { beatType = 'mid'; beatStrength = sMid; }

  if (beatType && fireCD <= 0) {
    cmd.triggerFire = true;
    cmd.beatType = beatType;
    cmd.beatStrength = Math.min(1, beatStrength);
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
