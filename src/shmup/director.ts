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

// ── Formation builder — formation shape is chosen per profile's
// dominant band, but enemy types come from the profile's weights ──
function makeFormation(d: number, faction: Faction, energy: MusicEnergy, profile: MusicProfile): DirectorCommand['spawnEnemies'] {
  const out: DirectorCommand['spawnEnemies'] = [];

  // Shape selection is driven by the PROFILE's dominant band (the song's
  // identity), not the instantaneous frequency band. This makes each song
  // feel consistent through quiet AND loud moments.
  const shape = profile.dominantBand;

  if (shape === 'bass') {
    // BASS — heavy, centered, anchored. Few but strong.
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.4 + Math.random() * 0.2, drop: pickDrop(d, energy) });
    if (d > 0.55) {
      // Wingmen on harder difficulty
      out.push({ type: 'fighter', faction, x: 0.2 });
      out.push({ type: 'fighter', faction, x: 0.8 });
    }
  } else if (shape === 'high') {
    // HIGH — many fast, scattered across screen
    const count = Math.min(6, 3 + Math.floor(d * 3));
    for (let i = 0; i < count; i++) {
      out.push({
        type: pickEnemy(d * 0.6, energy, profile),
        faction,
        x: 0.1 + Math.random() * 0.8,
        drop: i === 0 ? pickDrop(d, energy) : undefined,
      });
    }
  } else if (shape === 'wide') {
    // WIDE — mixed wave: heavy center + flanking light
    out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.5, drop: pickDrop(d, energy) });
    if (d > 0.3) {
      out.push({ type: 'fighter', faction, x: 0.15 });
      out.push({ type: 'fighter', faction, x: 0.85 });
    }
    if (d > 0.6) {
      out.push({ type: pickEnemy(d * 0.8, energy, profile), faction, x: 0.3 });
      out.push({ type: pickEnemy(d * 0.8, energy, profile), faction, x: 0.7 });
    }
  } else {
    // MID — rhythmic, formation-based. Cycles through 4 shapes.
    const form = Math.floor(rhythmPhase * 4) % 4;
    if (form === 0) {
      // V-formation
      const n = 3 + Math.floor(d * 2);
      const cx = 0.3 + Math.random() * 0.4;
      for (let i = 0; i < n; i++) {
        out.push({
          type: pickEnemy(d * 0.7, energy, profile),
          faction,
          x: cx + (i - (n - 1) / 2) * 0.1,
          drop: i === 0 ? pickDrop(d, energy) : undefined,
        });
      }
    } else if (form === 1) {
      // Pincer
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.1, drop: pickDrop(d, energy) });
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.9 });
    } else if (form === 2) {
      // Diagonal sweep
      const dir = Math.random() < 0.5 ? 1 : -1;
      for (let i = 0; i < 3; i++) {
        out.push({ type: 'fighter', faction, x: 0.4 + dir * i * 0.15 });
      }
    } else {
      // Mirror pair
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.35, drop: pickDrop(d, energy) });
      out.push({ type: pickEnemy(d, energy, profile), faction, x: 0.65 });
    }
  }
  return out;
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

  // ══════════════════════════════════════════════════════════════
  // SPAWNING — the music tells us when and what
  // ═════���════════════════════════════════════════════════════════
  // Density biases CADENCE (how often we spawn), not the cap. Capping
  // max enemies by density meant low-density songs could only ever have
  // 3 enemies on screen, which felt empty.
  const maxEnemies = 5 + Math.floor(d * 7) + Math.floor(normalizedEnergy * 3);
  const currentEnemies = state.enemies.filter(e => e.alive).length;
  const canSpawn = currentEnemies < maxEnemies && spawnCD <= 0;

  // ── QUIET SECTIONS: breathing room, powerups, scenery ──
  if (quietStreak > 30) {
    if (puCD <= 0 && quietStreak % 60 === 0) {
      const types: PowerUpType[] = ['shield','weapon','missile','overdrive','drone','score2x'];
      cmd.spawnPowerUp = types[Math.floor(Math.random() * types.length)];
      puCD = 90;
    }
    // Drone-signature: spawn one tough enemy during sustained quiet
    if (profile.signature === 'drone' && canSpawn && quietStreak === 60 && currentEnemies === 0) {
      cmd.spawnEnemies.push({ type: d > 0.4 ? 'elite' : 'cruiser', faction, x: 0.5, drop: pickDrop(d, energy) });
      spawnCD = 120;
    }
    if (obsCD <= 0 && Math.random() < 0.01) {
      cmd.spawnObstacle = true;
      cmd.spawnObstacleType = sampleObstacle(profile);
      obsCD = 60;
    }
  }

  // ── BUILD-UP: anticipation — spawn turrets, build tension ──
  else if (buildStreak > 20) {
    if (canSpawn && Math.random() < 0.03) {
      cmd.spawnEnemies.push({ type: 'turret', faction, x: 0.15 + Math.random() * 0.7, drop: pickDrop(d, energy) });
      spawnCD = 30;
    }
    cmd.screenShake = buildStreak > 40 ? 0.5 : 0;
    if (obsCD <= 0 && Math.random() < 0.015 * density) {
      cmd.spawnObstacle = true;
      cmd.spawnObstacleType = sampleObstacle(profile);
      obsCD = 40;
    }
  }

  // ── DROP: signature mechanic fires here ──
  else if (energy.isDrop && dropRecovery <= 0) {
    dropRecovery = 180;
    lastDropTick = tick;
    cmd.fleetEvent = true;
    cmd.screenShake = 2;
    cmd.particleBurst = true;
    cmd.signatureTrigger = profile.signature;

    const dropCount = Math.max(2, Math.floor((4 + Math.floor(d * 4) + state.currentStage) * density));
    for (let i = 0; i < dropCount; i++) {
      cmd.spawnEnemies.push({
        type: pickEnemy(d, energy, profile),
        faction,
        x: 0.08 + Math.random() * 0.84,
        drop: i === 0 ? pickDrop(d, energy) : i === 1 ? 'shield' : undefined,
      });
    }
    spawnCD = 45;
    fleetCD = 180;

    const dropPU: PowerUpType[] = ['overdrive','emp','drone','score2x'];
    cmd.spawnPowerUp = dropPU[Math.floor(Math.random() * dropPU.length)];
  }

  // ── TRIGGER HIT: profile-specific band drives spawns ──
  else if (trigger.hit && canSpawn) {
    // Density biases the chance but with a floor so low-density songs
    // (drone, lull) still spawn on most beats.
    const spawnChance = Math.max(0.25, (0.45 + d * 0.3 + normalizedEnergy * 0.2) * density);
    if (Math.random() < spawnChance) {
      cmd.spawnEnemies.push(...makeFormation(d, faction, energy, profile));
      spawnCD = Math.floor((40 - normalizedEnergy * 15 - d * 10) / Math.max(0.5, density));
    }
  }

  // ── HIHAT SWARM: swarm profile spawns fighter clusters on high-band spikes ──
  else if (profile.signature === 'swarm' && energy.high > 0.55 && canSpawn && Math.random() < 0.08 * density) {
    const clusterX = 0.2 + Math.random() * 0.6;
    for (let i = 0; i < 3; i++) {
      cmd.spawnEnemies.push({ type: 'fighter', faction, x: clusterX + (Math.random() - 0.5) * 0.15 });
    }
    spawnCD = 30;
  }

  // ── GUARANTEED TRICKLE: never leave screen empty ──
  // Fires whenever we're below the minimum presence, regardless of whether
  // the analyzer is reporting music data. This makes the game still playable
  // during the first frames before audio kicks in, between songs, or if the
  // user has muted audio.
  const minPresence = profile.signature === 'drone' ? 1 : 2;
  if (guaranteedSpawnTimer <= 0 && currentEnemies < minPresence) {
    cmd.spawnEnemies.push(...makeFormation(d, faction, energy, profile));
    guaranteedSpawnTimer = Math.floor(90 - d * 30 - normalizedEnergy * 20);
    spawnCD = 20;
  }

  // ── BASELINE HEARTBEAT: even without any music signal, keep enemies
  // arriving every ~3 seconds so the level always feels alive. The
  // music-driven spawns above take priority; this only fires if nothing
  // else has spawned recently and the screen has room.
  if (
    spawnCD <= 0 && currentEnemies < maxEnemies &&
    state.tick % 180 === 0 && cmd.spawnEnemies.length === 0
  ) {
    cmd.spawnEnemies.push(...makeFormation(d, faction, energy, profile));
    spawnCD = Math.max(40, 60 - state.currentStage * 4);
  }

  // ── FIRE SYNC — enemies shoot on the profile's trigger band hit ──
  // Aggression scales fire rate: aggressive songs fire more often.
  if (trigger.hit && trigger.value > 0.3 && fireCD <= 0) {
    cmd.triggerFire = true;
    const cooldownBase = 40 - profile.aggression * 20;
    fireCD = Math.floor(cooldownBase - normalizedEnergy * 10);
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
