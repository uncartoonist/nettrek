// ReactiveDirector — procedural music-reactive enemy generation
// Time drives difficulty, music drives rhythm, every playthrough is unique

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

let sBass = 0, sMid = 0, sOverall = 0;
let spawnCD = 0, fireCD = 0, puCD = 0, fleetCD = 0, obsCD = 0;
let diffAccum = 0;
let guaranteedSpawnTimer = 0; // forces spawns even without music

export function resetDirector(): void {
  sBass = sMid = sOverall = 0;
  spawnCD = fireCD = puCD = fleetCD = obsCD = 0;
  diffAccum = 0;
  guaranteedSpawnTimer = 120; // first enemy after 2 seconds
}

function diff(state: ShmupState): number {
  const dur = state.stages[state.currentStage]?.duration || 2100;
  const timeProg = Math.min(state.tick / dur, 1);
  const stageBonus = state.currentStage * 0.1;
  // Smooth curve: slow start, accelerates in middle, intense at end
  const curve = timeProg * timeProg * 0.4 + timeProg * 0.3;
  return Math.min(1, curve + diffAccum * 0.00005 + stageBonus);
}

function pickEnemy(d: number): EnemyType {
  const r = Math.random();
  if (d < 0.15) return 'fighter';
  if (d < 0.3) return r < 0.8 ? 'fighter' : 'bomber';
  if (d < 0.5) return r < 0.5 ? 'fighter' : r < 0.75 ? 'bomber' : 'turret';
  if (d < 0.7) return r < 0.3 ? 'fighter' : r < 0.55 ? 'bomber' : r < 0.8 ? 'cruiser' : 'elite';
  return r < 0.2 ? 'fighter' : r < 0.4 ? 'bomber' : r < 0.6 ? 'cruiser' : r < 0.85 ? 'elite' : 'turret';
}

function pickDrop(d: number): PowerUpType | undefined {
  if (Math.random() > 0.12 + d * 0.08) return undefined;
  const t: PowerUpType[] = ['weapon','shield','missile','laser','phaser','bomb'];
  return t[Math.floor(Math.random() * t.length)];
}

function makeFormation(d: number, faction: Faction): DirectorCommand['spawnEnemies'] {
  const out: DirectorCommand['spawnEnemies'] = [];
  const form = Math.floor(Math.random() * 6);

  if (d < 0.15) {
    // Early: single fighter
    out.push({ type: 'fighter', faction, x: 0.2 + Math.random() * 0.6, drop: pickDrop(d) });
  } else if (form === 0) {
    // Pair or trio
    const n = d > 0.5 ? 3 : 2;
    const cx = 0.3 + Math.random() * 0.4;
    for (let i = 0; i < n; i++) out.push({ type: 'fighter', faction, x: cx + (i-(n-1)/2)*0.12 });
  } else if (form === 1) {
    // Pincer — one from each side
    out.push({ type: pickEnemy(d), faction, x: 0.08 + Math.random()*0.08, drop: pickDrop(d) });
    out.push({ type: pickEnemy(d), faction, x: 0.84 + Math.random()*0.08 });
  } else if (form === 2) {
    // Capital ship solo (or with 1 escort late)
    out.push({ type: d > 0.5 ? 'cruiser' : 'bomber', faction, x: 0.5, drop: pickDrop(d) });
    if (d > 0.6) out.push({ type: 'fighter', faction, x: 0.3 + Math.random()*0.4 });
  } else if (form === 3) {
    // Diagonal pair
    const dir = Math.random() < 0.5 ? 1 : -1;
    out.push({ type: pickEnemy(d*0.7), faction, x: 0.35 + dir*0.15 });
    out.push({ type: pickEnemy(d*0.7), faction, x: 0.35 + dir*0.3 });
  } else if (form === 4) {
    // Small scatter (2-3)
    const n = d > 0.6 ? 3 : 2;
    for (let i = 0; i < n; i++) out.push({ type: pickEnemy(d*0.6), faction, x: 0.15+Math.random()*0.7 });
  } else {
    // Single tough enemy
    out.push({ type: d > 0.4 ? 'elite' : 'bomber', faction, x: 0.3+Math.random()*0.4, drop: pickDrop(d) });
  }
  return out;
}

export function getDirectorCommand(energy: MusicEnergy, state: ShmupState): DirectorCommand {
  const cmd: DirectorCommand = {
    spawnEnemies: [], triggerFire: false, spawnPowerUp: null,
    scrollSpeedMult: 1, screenShake: 0, bgPulse: 0,
    particleBurst: false, fleetEvent: false, spawnObstacle: false,
  };

  spawnCD--; fireCD--; puCD--; fleetCD--; obsCD--;
  guaranteedSpawnTimer--;

  const stage = state.stages[state.currentStage];
  const faction = stage?.faction || 'klingon';
  const d = diff(state);

  // Smooth energy
  sBass += (energy.bass - sBass) * 0.12;
  sMid += (energy.mid - sMid) * 0.1;
  sOverall += (energy.overall - sOverall) * 0.08;
  diffAccum += sOverall;

  // Scroll speed
  cmd.scrollSpeedMult = 0.85 + sOverall * 0.25;

  // Visual beat pulse
  if (energy.bassHit && energy.bass > 0.3) cmd.bgPulse = Math.min(energy.bass * 0.3, 0.4);

  // ══════════════════════════════════════════════════════════
  // SPAWNING — music triggers + guaranteed timer fallback
  // ══════════════════════════════════════════════════════════

  // Cap enemies on screen — never overwhelm
  const maxEnemies = 6 + Math.floor(d * 6); // 6 early → 12 at max difficulty
  const currentEnemies = state.enemies.filter(e => e.alive).length;
  const canSpawn = currentEnemies < maxEnemies && spawnCD <= 0;

  let shouldSpawn = false;

  if (canSpawn) {
    // Music-driven spawn
    if (energy.bassHit && d > 0.05) {
      shouldSpawn = Math.random() < (0.2 + d * 0.3);
    }
    // Mid hit — only if very few enemies on screen
    if (energy.midHit && energy.mid > 0.4 && currentEnemies < maxEnemies / 2 && d > 0.2) {
      shouldSpawn = shouldSpawn || Math.random() < 0.2;
    }
    // Guaranteed trickle — but only if screen is getting empty
    if (guaranteedSpawnTimer <= 0 && currentEnemies < 3) {
      shouldSpawn = true;
      guaranteedSpawnTimer = Math.floor(120 - d * 50); // 120 early → 70 late
    }
  }

  if (shouldSpawn) {
    cmd.spawnEnemies.push(...makeFormation(d, faction));
    spawnCD = Math.floor(60 - d * 25); // 60 early → 35 late (much longer cooldowns)
  }

  // Fire sync on beat
  if (energy.bassHit && energy.bass > 0.4 && fireCD <= 0) {
    cmd.triggerFire = true;
    fireCD = Math.floor(50 - d * 15); // long gaps between synced volleys
  }

  // Obstacles — more frequent as difficulty rises
  if (obsCD <= 0 && d > 0.1) {
    const obsChance = 0.008 + d * d * 0.02;
    if (Math.random() < obsChance) {
      cmd.spawnObstacle = true;
      obsCD = Math.floor(30 - d * 15);
    }
  }

  // Quiet = powerup — music-reactive: reward players during calm sections
  if (energy.isQuiet && puCD <= 0) {
    const types: PowerUpType[] = ['weapon','shield','missile','laser','phaser','bomb','emp','overdrive','drone','score2x'];
    cmd.spawnPowerUp = types[Math.floor(Math.random() * types.length)];
    puCD = 130;
  }

  // Music drop = bonus powerup burst (the music rewards you)
  if (energy.isDrop && d > 0.3) {
    const dropTypes: PowerUpType[] = ['overdrive','emp','score2x','drone'];
    cmd.spawnPowerUp = dropTypes[Math.floor(Math.random() * dropTypes.length)];
  }

  // Drop = fleet event — only if screen isn't already busy
  if (energy.isDrop && fleetCD <= 0 && d > 0.25 && currentEnemies < 4) {
    cmd.fleetEvent = true;
    cmd.screenShake = 0.2;
    cmd.particleBurst = true;
    const n = 2 + Math.floor(d * 2); // 2-4, not 3-8
    for (let i = 0; i < n; i++) {
      cmd.spawnEnemies.push({ type: pickEnemy(d), faction, x: 0.1+Math.random()*0.8, drop: i===0 ? pickDrop(d) : undefined });
    }
    fleetCD = 360; // 6 seconds between fleet events
    spawnCD = 90;
  }

  // Build-up = turrets + static turret obstacles
  if (energy.isBuildUp && spawnCD <= 0 && d > 0.2) {
    cmd.spawnEnemies.push({ type: 'turret', faction, x: 0.15+Math.random()*0.7, drop: pickDrop(d) });
    spawnCD = 45;
    // Spawn a static turret obstacle during buildups
    if (d > 0.4) cmd.spawnObstacle = true;
  }

  // Powerups only from quiet sections and enemy drops — earned, not given

  // Ambient particles on mid beats
  if (energy.midHit && energy.mid > 0.3) cmd.particleBurst = true;

  return cmd;
}
