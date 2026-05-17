// ══════════════════════════════════════════════════════════════════
// MUSIC DIRECTOR — The music IS the game
// ══════════════════════════════════════════════════════════════════
// Every enemy, every formation, every moment of tension and release
// flows from the music's energy. The song is the level designer.
// Quiet = breathing room. Build-up = anticipation. Drop = chaos.
// Bass = power. Mid = rhythm. High = sparkle.

import type { MusicEnergy } from '../audio/analyzer';
import type { ShmupState, Faction, EnemyType, PowerUpType } from './types';

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

// ── Enemy selection driven by music energy ──
function pickEnemy(d: number, energy: MusicEnergy): EnemyType {
  const r = Math.random();
  // High frequencies = fast enemies. Low frequencies = heavy enemies.
  const bassWeight = energy.bass;
  const highWeight = energy.high;

  if (d < 0.15) return 'fighter';
  if (highWeight > 0.5 && r < 0.6) return 'fighter'; // sparkly = fast swarms
  if (bassWeight > 0.6 && r < 0.4) return d > 0.4 ? 'cruiser' : 'bomber'; // heavy bass = big ships
  if (d < 0.3) return r < 0.7 ? 'fighter' : 'bomber';
  if (d < 0.5) return r < 0.4 ? 'fighter' : r < 0.7 ? 'bomber' : 'turret';
  if (d < 0.7) return r < 0.25 ? 'fighter' : r < 0.5 ? 'bomber' : r < 0.75 ? 'cruiser' : 'elite';
  return r < 0.2 ? 'fighter' : r < 0.35 ? 'bomber' : r < 0.55 ? 'cruiser' : r < 0.8 ? 'elite' : 'turret';
}

function pickDrop(d: number, energy: MusicEnergy): PowerUpType | undefined {
  // Drops are more generous during quiet/recovery sections
  const dropChance = quietStreak > 20 ? 0.3 : 0.1 + d * 0.06;
  if (Math.random() > dropChance) return undefined;
  const types: PowerUpType[] = ['weapon','shield','missile','laser','phaser','bomb','emp','overdrive'];
  return types[Math.floor(Math.random() * types.length)];
}

// ── Formation builder — creates musical patterns ──
function makeFormation(d: number, faction: Faction, energy: MusicEnergy): DirectorCommand['spawnEnemies'] {
  const out: DirectorCommand['spawnEnemies'] = [];

  // Formation type is driven by which band is dominant
  if (energy.bass > energy.mid && energy.bass > energy.high) {
    // BASS DOMINANT — heavy, centered, powerful
    if (d > 0.5) {
      out.push({ type: 'cruiser', faction, x: 0.5, drop: pickDrop(d, energy) });
      if (d > 0.7) {
        out.push({ type: 'fighter', faction, x: 0.3 });
        out.push({ type: 'fighter', faction, x: 0.7 });
      }
    } else {
      out.push({ type: 'bomber', faction, x: 0.4 + Math.random() * 0.2, drop: pickDrop(d, energy) });
    }
  } else if (energy.high > energy.mid) {
    // HIGH DOMINANT — fast, scattered, many
    const count = Math.min(5, 2 + Math.floor(d * 3));
    for (let i = 0; i < count; i++) {
      out.push({ type: 'fighter', faction, x: 0.1 + Math.random() * 0.8, drop: i === 0 ? pickDrop(d, energy) : undefined });
    }
  } else {
    // MID DOMINANT — balanced, rhythmic formations
    const form = Math.floor(rhythmPhase * 5) % 5;
    if (form === 0) {
      // V-formation
      const n = 3 + Math.floor(d * 2);
      const cx = 0.3 + Math.random() * 0.4;
      for (let i = 0; i < n; i++) {
        out.push({ type: pickEnemy(d * 0.7, energy), faction, x: cx + (i - (n-1)/2) * 0.1, drop: i === 0 ? pickDrop(d, energy) : undefined });
      }
    } else if (form === 1) {
      // Pincer
      out.push({ type: pickEnemy(d, energy), faction, x: 0.1, drop: pickDrop(d, energy) });
      out.push({ type: pickEnemy(d, energy), faction, x: 0.9 });
    } else if (form === 2) {
      // Single elite/cruiser
      out.push({ type: d > 0.4 ? 'elite' : 'bomber', faction, x: 0.3 + Math.random() * 0.4, drop: pickDrop(d, energy) });
    } else if (form === 3) {
      // Diagonal sweep
      const dir = Math.random() < 0.5 ? 1 : -1;
      for (let i = 0; i < 3; i++) {
        out.push({ type: 'fighter', faction, x: 0.4 + dir * i * 0.15 });
      }
    } else {
      // Bomber pair
      out.push({ type: 'bomber', faction, x: 0.35, drop: pickDrop(d, energy) });
      out.push({ type: 'bomber', faction, x: 0.65 });
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════
// MAIN DIRECTOR — called every frame, reads the music, writes the game
// ══════════════════════════════════════════════════════════════════
export function getDirectorCommand(energy: MusicEnergy, state: ShmupState): DirectorCommand {
  const cmd: DirectorCommand = {
    spawnEnemies: [], triggerFire: false, spawnPowerUp: null,
    scrollSpeedMult: 1, screenShake: 0, bgPulse: 0,
    particleBurst: false, fleetEvent: false, spawnObstacle: false,
  };

  spawnCD--; fireCD--; puCD--; fleetCD--; obsCD--;
  guaranteedSpawnTimer--;
  if (dropRecovery > 0) dropRecovery--;

  const stage = state.stages[state.currentStage];
  const faction = stage?.faction || 'klingon';
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
  const maxEnemies = 5 + Math.floor(d * 7) + Math.floor(normalizedEnergy * 3);
  const currentEnemies = state.enemies.filter(e => e.alive).length;
  const canSpawn = currentEnemies < maxEnemies && spawnCD <= 0;

  // ── QUIET SECTIONS: breathing room, powerups, scenery ──
  if (quietStreak > 30) {
    // Music is quiet — don't spawn enemies, give rewards
    if (puCD <= 0 && quietStreak % 60 === 0) {
      const types: PowerUpType[] = ['shield','weapon','missile','overdrive','drone','score2x'];
      cmd.spawnPowerUp = types[Math.floor(Math.random() * types.length)];
      puCD = 90;
    }
    // Obstacles drift through during quiet (visual interest)
    if (obsCD <= 0 && Math.random() < 0.01) {
      cmd.spawnObstacle = true;
      obsCD = 60;
    }
  }

  // ── BUILD-UP: anticipation — spawn turrets, build tension ──
  else if (buildStreak > 20) {
    if (canSpawn && Math.random() < 0.03) {
      cmd.spawnEnemies.push({ type: 'turret', faction, x: 0.15 + Math.random() * 0.7, drop: pickDrop(d, energy) });
      spawnCD = 30;
    }
    // Screen tension
    cmd.screenShake = buildStreak > 40 ? 0.5 : 0;
    if (obsCD <= 0 && Math.random() < 0.015) {
      cmd.spawnObstacle = true;
      obsCD = 40;
    }
  }

  // ── DROP: overwhelming force — massive wave ──
  else if (energy.isDrop && dropRecovery <= 0) {
    dropRecovery = 180; // 3 seconds between drops
    lastDropTick = tick;
    cmd.fleetEvent = true;
    cmd.screenShake = 3;
    cmd.particleBurst = true;

    // Massive spawn burst — the drop IS the wave
    const dropCount = 4 + Math.floor(d * 4) + state.currentStage;
    for (let i = 0; i < dropCount; i++) {
      cmd.spawnEnemies.push({
        type: pickEnemy(d, energy),
        faction,
        x: 0.08 + Math.random() * 0.84,
        drop: i === 0 ? pickDrop(d, energy) : i === 1 ? 'shield' : undefined, // first two always drop something
      });
    }
    spawnCD = 45;
    fleetCD = 180;

    // Bonus powerup on drops
    const dropPU: PowerUpType[] = ['overdrive','emp','drone','score2x'];
    cmd.spawnPowerUp = dropPU[Math.floor(Math.random() * dropPU.length)];
  }

  // ── BASS HIT: spawn on the kick drum ──
  else if (energy.bassHit && canSpawn) {
    const spawnChance = 0.3 + d * 0.3 + normalizedEnergy * 0.2;
    if (Math.random() < spawnChance) {
      cmd.spawnEnemies.push(...makeFormation(d, faction, energy));
      // Cooldown scales inversely with intensity — faster spawns during intense music
      spawnCD = Math.floor(40 - normalizedEnergy * 15 - d * 10);
    }
  }

  // ── MID HIT: secondary spawns (snare = rhythm) ──
  else if (energy.midHit && canSpawn && currentEnemies < maxEnemies / 2) {
    if (Math.random() < 0.2 + d * 0.15) {
      // Smaller formation on snare hits
      const count = 1 + Math.floor(d * 2);
      for (let i = 0; i < count; i++) {
        cmd.spawnEnemies.push({ type: 'fighter', faction, x: 0.2 + Math.random() * 0.6 });
      }
      spawnCD = 25;
    }
  }

  // ── GUARANTEED TRICKLE: never leave screen empty too long ──
  if (guaranteedSpawnTimer <= 0 && currentEnemies < 2 && !energy.isQuiet) {
    cmd.spawnEnemies.push(...makeFormation(d, faction, energy));
    guaranteedSpawnTimer = Math.floor(90 - d * 30 - normalizedEnergy * 20);
    spawnCD = 20;
  }

  // ══════════════════════════════════════════════════════════════
  // FIRE SYNC — enemies shoot on the beat
  // ══════════════════════════════════════════════════════════════
  if (energy.bassHit && sBass > 0.35 && fireCD <= 0) {
    cmd.triggerFire = true;
    fireCD = Math.floor(35 - normalizedEnergy * 12);
  }

  // ══════════════════════════════════════════════════════════════
  // OBSTACLES — driven by high frequencies (hihats = sparkle = debris)
  // ══════════════════════════════════════════════════════════════
  if (obsCD <= 0 && sHigh > 0.4 && d > 0.15) {
    if (Math.random() < 0.008 + sHigh * 0.005) {
      cmd.spawnObstacle = true;
      obsCD = Math.floor(50 - d * 15);
    }
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
