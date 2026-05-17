// ══════════════════════════════════════════════════════════════════
// MUSIC PROFILES — each song is a unique level
// ══════════════════════════════════════════════════════════════════
// A MusicProfile defines a song's gameplay personality. The director
// reads the active profile every frame and uses it to bias every
// decision it makes — what to spawn, when to spawn it, what obstacle
// types appear, which frequency band triggers events. Two songs of
// the same length and tempo can produce wildly different gameplay
// just by swapping profiles.

import type { EnemyType, Faction } from './types';

// Which frequency band is this song built around?
// - 'bass'  — kick-driven (heavy, weighty, slow swings)
// - 'mid'   — snare/melody-driven (rhythmic, formation-based)
// - 'high'  — hihat/sparkle-driven (fast, scattered, swarmy)
// - 'wide'  — full-spectrum (everything happens at once)
export type DominantBand = 'bass' | 'mid' | 'high' | 'wide';

// Which signature challenge does this song own?
// - 'curtain'       — bullet curtains rise from below on every drop, navigate the gap
// - 'vortex_storm'  — gravity well clusters during sustained bass
// - 'swarm'         — hihat spikes spawn fast fighter clouds
// - 'siege'         — slow, heavy push: cruisers + bombers, few but tough
// - 'loop'          — same wave pattern repeats per song bar (predictable, learn it)
// - 'pulse_walls'   — energy walls pulse across the screen on each beat
// - 'drone'         — sparse but sustained: long single-enemy challenges
// - 'finale'        — all mechanics active simultaneously (final boss stage)
export type SignatureMechanic =
  | 'curtain' | 'vortex_storm' | 'swarm' | 'siege'
  | 'loop' | 'pulse_walls' | 'drone' | 'finale';

export interface MusicProfile {
  // Song identification
  songFile: string;            // matches MUSIC_TRACKS path

  // Personality
  dominantBand: DominantBand;
  signature: SignatureMechanic;

  // Enemy preferences — relative weights. The director picks types
  // by sampling these. Sum doesn't need to equal 1; relative scale is what matters.
  enemyWeights: Partial<Record<EnemyType, number>>;

  // Faction override (defaults to stage faction if undefined)
  factionOverride?: Faction;

  // Obstacle preferences — same idea. 0 means never spawn this obstacle.
  obstacleWeights: {
    rock: number;
    mine: number;
    barrier: number;     // 'energy nexus' visual
    vortex: number;
    comet: number;
    energyribbon: number;
    splitter: number;
  };

  // Spawn intensity multiplier — some songs should be denser than others.
  // 1.0 = baseline, 1.5 = 50% more enemies, 0.7 = breathing room
  spawnDensity: number;

  // Which band triggers enemy spawns? If 'bass', kicks spawn enemies.
  // If 'mid', snares do. If 'high', hihats do. If 'wide', any beat does.
  triggerBand: DominantBand;

  // How aggressive should bullet patterns be? 0-1.
  // High aggression = more bullets per shot, tighter spreads, faster fire.
  aggression: number;

  // Display name for the signature mechanic (shown to player as a stage motif)
  signatureLabel: string;
}

// ── 11 profiles, one per song/stage ─────────────────────────────────
// Order matches MUSIC_TRACKS in src/audio/music.ts and STAGES in
// src/shmup/stages.ts. Each profile is hand-tuned to the song's
// character and the stage's faction theme.
export const MUSIC_PROFILES: MusicProfile[] = [
  // ── Stage 1 — BASS BARCODE / Neutral Zone ───────────────────────
  // Mechanical, bass-driven, gridlocked. Enemies arrive in vertical
  // columns synced to the kick. The "barcode" is the bullet curtain.
  {
    songFile: '/music/Bass Barcode.mp3',
    dominantBand: 'bass',
    signature: 'curtain',
    enemyWeights: { fighter: 3, bomber: 2, cruiser: 1, turret: 1 },
    obstacleWeights: { rock: 3, mine: 1, barrier: 1, vortex: 0, comet: 0, energyribbon: 0, splitter: 1 },
    spawnDensity: 0.9,
    triggerBand: 'bass',
    aggression: 0.45,
    signatureLabel: 'CURTAIN FIRE',
  },

  // ── Stage 2 — CIRCUIT SYNESTHESIA / Romulan Nebula ──────────────
  // Synthetic, melodic, mid-driven. Romulans cloak and ambush. Geometric
  // formations that "complete" on the snare — a circuit being finished.
  {
    songFile: '/music/Circuit Synesthesia.mp3',
    dominantBand: 'mid',
    signature: 'loop',
    enemyWeights: { fighter: 2, bomber: 1, elite: 2, turret: 1, cruiser: 1 },
    obstacleWeights: { rock: 1, mine: 2, barrier: 2, vortex: 1, comet: 1, energyribbon: 2, splitter: 1 },
    spawnDensity: 1.0,
    triggerBand: 'mid',
    aggression: 0.55,
    signatureLabel: 'CIRCUIT LOOP',
  },

  // ── Stage 3 — LOOP CIRCUIT LOVE / Orion Syndicate ────────────────
  // Heavy, looping, syndicate ambush. Bombers + cruisers cycle.
  {
    songFile: '/music/Loop Circuit Love.mp3',
    dominantBand: 'mid',
    signature: 'siege',
    enemyWeights: { fighter: 1, bomber: 3, cruiser: 3, elite: 1, turret: 1 },
    obstacleWeights: { rock: 2, mine: 2, barrier: 1, vortex: 1, comet: 0, energyribbon: 1, splitter: 2 },
    spawnDensity: 0.95,
    triggerBand: 'bass',
    aggression: 0.6,
    signatureLabel: 'ORION SIEGE',
  },

  // ── Stage 4 — GRAVITATIONAL LULL / Gravity Well (new) ────────────
  // Ambient, slow, ominous. Sparse heavy enemies, lots of gravity wells.
  // Quiet sections breed vortexes; bass swells spawn cruisers.
  {
    songFile: '/music/Gravitational Lull.mp3',
    dominantBand: 'bass',
    signature: 'vortex_storm',
    enemyWeights: { fighter: 0.5, bomber: 1, cruiser: 3, elite: 2, turret: 0.5 },
    obstacleWeights: { rock: 1, mine: 0, barrier: 1, vortex: 5, comet: 1, energyribbon: 2, splitter: 0 },
    spawnDensity: 0.65,           // sparse — the obstacles ARE the challenge
    triggerBand: 'bass',
    aggression: 0.4,
    signatureLabel: 'GRAVITY WELL',
  },

  // ── Stage 5 — STATIC PULSE / Deep Space Anomaly ──────────────────
  // Industrial, pulse-driven. Energy walls pulse with each beat.
  {
    songFile: '/music/Static Pulse.mp3',
    dominantBand: 'wide',
    signature: 'pulse_walls',
    enemyWeights: { fighter: 2, bomber: 1, elite: 2, turret: 2, cruiser: 1 },
    obstacleWeights: { rock: 1, mine: 2, barrier: 3, vortex: 1, comet: 1, energyribbon: 2, splitter: 1 },
    spawnDensity: 1.1,
    triggerBand: 'mid',
    aggression: 0.6,
    signatureLabel: 'PULSE WALLS',
  },

  // ── Stage 6 — ULTRASONIC PILGRIMAGE / Wormhole Transit ───────────
  // High-frequency dominant. Fighter swarms, blistering pace.
  {
    songFile: '/music/Ultrasonic Pilgrimage.mp3',
    dominantBand: 'high',
    signature: 'swarm',
    enemyWeights: { fighter: 5, bomber: 0.5, elite: 1, turret: 1, cruiser: 0.5 },
    obstacleWeights: { rock: 1, mine: 1, barrier: 1, vortex: 0, comet: 3, energyribbon: 2, splitter: 1 },
    spawnDensity: 1.3,
    triggerBand: 'high',
    aggression: 0.55,
    signatureLabel: 'HIHAT SWARM',
  },

  // ── Stage 7 — NEBULA DRUMLINE / Final Fortress ───────────────────
  // Drum-heavy. Every snare = wave, every kick = enemy fire.
  {
    songFile: '/music/Nebula Drumline.mp3',
    dominantBand: 'mid',
    signature: 'siege',
    enemyWeights: { fighter: 2, bomber: 2, cruiser: 2, elite: 2, turret: 2 },
    obstacleWeights: { rock: 2, mine: 1, barrier: 2, vortex: 1, comet: 1, energyribbon: 1, splitter: 2 },
    spawnDensity: 1.2,
    triggerBand: 'mid',
    aggression: 0.7,
    signatureLabel: 'DRUMLINE ASSAULT',
  },

  // ── Stage 8 — DARK LATTICE GROOVE / Black Hole Perimeter ─────────
  // Groovy bass + heavy. Grid-locked formations that shift on bass.
  {
    songFile: '/music/Dark Lattice Groove.mp3',
    dominantBand: 'bass',
    signature: 'curtain',
    enemyWeights: { fighter: 1, bomber: 2, cruiser: 2, elite: 3, turret: 1 },
    obstacleWeights: { rock: 2, mine: 2, barrier: 2, vortex: 2, comet: 1, energyribbon: 1, splitter: 2 },
    spawnDensity: 1.0,
    triggerBand: 'bass',
    aggression: 0.65,
    signatureLabel: 'LATTICE GROOVE',
  },

  // ── Stage 9 — GRAVITATIONAL LULL 1 / Singularity Core (new) ──────
  // The build-up version. Sustained tension, growing threat.
  {
    songFile: '/music/Gravitational Lull1.mp3',
    dominantBand: 'wide',
    signature: 'vortex_storm',
    enemyWeights: { fighter: 1, bomber: 1, cruiser: 3, elite: 3, turret: 1 },
    obstacleWeights: { rock: 0.5, mine: 1, barrier: 2, vortex: 4, comet: 2, energyribbon: 3, splitter: 0.5 },
    spawnDensity: 0.85,
    triggerBand: 'bass',
    aggression: 0.55,
    signatureLabel: 'SINGULARITY',
  },

  // ── Stage 10 — SUBGLOBE DRONE / Subspace Rift ────────────────────
  // Ambient drone. Long, sustained encounters — one tough enemy at a time.
  {
    songFile: '/music/Subglobe Drone.mp3',
    dominantBand: 'bass',
    signature: 'drone',
    enemyWeights: { fighter: 0.3, bomber: 1, cruiser: 4, elite: 3, turret: 1 },
    obstacleWeights: { rock: 1, mine: 1, barrier: 3, vortex: 2, comet: 0, energyribbon: 3, splitter: 0 },
    spawnDensity: 0.55,
    triggerBand: 'bass',
    aggression: 0.45,
    signatureLabel: 'SUBSPACE DRONE',
  },

  // ── Stage 11 — STATIC PULSE REPRISE / Omega Citadel ──────────────
  // Final stage. Everything turned up to 11. All mechanics active.
  {
    songFile: '/music/Static Pulse.mp3',
    dominantBand: 'wide',
    signature: 'finale',
    enemyWeights: { fighter: 2, bomber: 2, cruiser: 2, elite: 3, turret: 2 },
    obstacleWeights: { rock: 1, mine: 2, barrier: 2, vortex: 2, comet: 2, energyribbon: 2, splitter: 2 },
    spawnDensity: 1.4,
    triggerBand: 'wide',
    aggression: 0.85,
    signatureLabel: 'OMEGA CITADEL',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

export function profileForStage(stageIndex: number): MusicProfile {
  return MUSIC_PROFILES[stageIndex] || MUSIC_PROFILES[0];
}

// Sample an enemy type from the profile's weights (returns null if no weights)
export function sampleEnemy(profile: MusicProfile): EnemyType {
  const entries = Object.entries(profile.enemyWeights) as [EnemyType, number][];
  if (entries.length === 0) return 'fighter';
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let pick = Math.random() * total;
  for (const [type, w] of entries) {
    pick -= w;
    if (pick <= 0) return type;
  }
  return entries[0][0];
}

// Sample an obstacle type from the profile's weights
export function sampleObstacle(profile: MusicProfile): keyof typeof profile.obstacleWeights {
  const entries = Object.entries(profile.obstacleWeights) as [keyof typeof profile.obstacleWeights, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  if (total <= 0) return 'rock';
  let pick = Math.random() * total;
  for (const [type, w] of entries) {
    pick -= w;
    if (pick <= 0) return type;
  }
  return 'rock';
}

// Get the music energy band value that this profile's trigger uses
export function getTriggerEnergy(
  profile: MusicProfile,
  energy: { bass: number; mid: number; high: number; overall: number; bassHit: boolean; midHit: boolean },
): { value: number; hit: boolean } {
  switch (profile.triggerBand) {
    case 'bass': return { value: energy.bass, hit: energy.bassHit };
    case 'mid':  return { value: energy.mid, hit: energy.midHit };
    case 'high': return { value: energy.high, hit: energy.high > 0.5 && energy.midHit }; // approximate hihat
    case 'wide': return { value: energy.overall, hit: energy.bassHit || energy.midHit };
  }
}
