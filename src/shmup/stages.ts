import type { Stage, Wave, PathPoint } from './types';

// Path helpers
function swoopLeft(startX: number): PathPoint[] {
  return [
    { x: startX, y: -50, duration: 30 },
    { x: startX - 0.2, y: 0.3, duration: 40 },
    { x: startX - 0.4, y: 0.6, duration: 40 },
    { x: startX - 0.3, y: 1.2, duration: 30 },
  ];
}

function swoopRight(startX: number): PathPoint[] {
  return [
    { x: startX, y: -50, duration: 30 },
    { x: startX + 0.2, y: 0.3, duration: 40 },
    { x: startX + 0.4, y: 0.6, duration: 40 },
    { x: startX + 0.3, y: 1.2, duration: 30 },
  ];
}

function straight(x: number): PathPoint[] {
  return [
    { x, y: -50, duration: 1 },
    { x, y: 1.2, duration: 180 },
  ];
}

function zigzag(startX: number): PathPoint[] {
  return [
    { x: startX, y: -50, duration: 20 },
    { x: startX + 0.15, y: 0.2, duration: 30 },
    { x: startX - 0.15, y: 0.4, duration: 30 },
    { x: startX + 0.15, y: 0.6, duration: 30 },
    { x: startX, y: 1.2, duration: 30 },
  ];
}

export const STAGES: Stage[] = [
  // ── Stage 1: Neutral Zone Patrol ──────────────────────────
  {
    id: 1,
    name: 'NEUTRAL ZONE',
    subtitle: 'Border Patrol — Klingon Incursion',
    faction: 'klingon',
    background: '#0a0812',
    duration: 10800, // 3 minutes — first stage, time to learn the controls
    waves: [
      // First enemies are a single scout — easy intro
      { time: 120, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.5, path: straight(0.5) },
      ]},
      // Two more drift in gently
      { time: 240, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.3, path: straight(0.3) },
        { type: 'fighter', faction: 'klingon', x: 0.7, path: straight(0.7) },
      ]},
      // Now a proper formation
      { time: 400, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.4, path: swoopRight(0.4) },
        { type: 'fighter', faction: 'klingon', x: 0.6, path: swoopLeft(0.6) },
        { type: 'fighter', faction: 'klingon', x: 0.8, path: swoopLeft(0.8) },
      ]},
      { time: 360, enemies: [
        { type: 'bomber', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'weapon' },
        { type: 'fighter', faction: 'klingon', x: 0.3, path: zigzag(0.3) },
        { type: 'fighter', faction: 'klingon', x: 0.7, path: zigzag(0.7) },
      ]},
      { time: 540, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.2, path: straight(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.35, path: straight(0.35) },
        { type: 'fighter', faction: 'klingon', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'klingon', x: 0.65, path: straight(0.65) },
        { type: 'fighter', faction: 'klingon', x: 0.8, path: straight(0.8) },
      ]},
      { time: 720, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'shield' },
      ]},
      { time: 900, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.4, path: swoopLeft(0.4) },
        { type: 'bomber', faction: 'klingon', x: 0.6, path: straight(0.6), dropType: 'star' },
        { type: 'fighter', faction: 'klingon', x: 0.8, path: swoopLeft(0.8) },
      ]},
      { time: 1100, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.5, path: zigzag(0.5), dropType: 'bomb' },
        { type: 'fighter', faction: 'klingon', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.8, path: swoopLeft(0.8) },
      ]},
      { time: 1400, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.3, path: straight(0.3), dropType: 'weapon' },
        { type: 'cruiser', faction: 'klingon', x: 0.7, path: straight(0.7), dropType: 'missile' },
        { type: 'fighter', faction: 'klingon', x: 0.5, path: zigzag(0.5) },
      ]},
    ],
    boss: { name: "T'VAK CLASS ASSAULT VESSEL", type: 'tvak', hp: 1200, width: 360, height: 290, phases: 4, faction: 'klingon' },
  },

  // ── Stage 2: Romulan Nebula ───────────────────────────────
  {
    id: 2,
    name: 'ROMULAN NEBULA',
    subtitle: 'Deep Cover — Cloaked Ambush',
    faction: 'romulan',
    background: '#060a12',
    duration: 11400, // 3:10
    waves: [
      { time: 60, enemies: [
        { type: 'fighter', faction: 'romulan', x: 0.3, path: swoopLeft(0.3) },
        { type: 'fighter', faction: 'romulan', x: 0.7, path: swoopRight(0.7) },
      ]},
      { time: 200, enemies: [
        { type: 'fighter', faction: 'romulan', x: 0.2, path: zigzag(0.2) },
        { type: 'fighter', faction: 'romulan', x: 0.5, path: zigzag(0.5) },
        { type: 'fighter', faction: 'romulan', x: 0.8, path: zigzag(0.8) },
        { type: 'bomber', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'weapon' },
      ]},
      { time: 400, enemies: [
        { type: 'turret', faction: 'romulan', x: 0.2, path: straight(0.2) },
        { type: 'turret', faction: 'romulan', x: 0.8, path: straight(0.8) },
        { type: 'elite', faction: 'romulan', x: 0.5, path: swoopLeft(0.5), dropType: 'star' },
      ]},
      { time: 600, enemies: [
        { type: 'fighter', faction: 'romulan', x: 0.15, path: swoopRight(0.15) },
        { type: 'fighter', faction: 'romulan', x: 0.35, path: swoopRight(0.35) },
        { type: 'fighter', faction: 'romulan', x: 0.55, path: swoopLeft(0.55) },
        { type: 'fighter', faction: 'romulan', x: 0.75, path: swoopLeft(0.75) },
        { type: 'fighter', faction: 'romulan', x: 0.9, path: swoopLeft(0.9) },
      ]},
      { time: 900, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.3, path: straight(0.3), dropType: 'laser' },
        { type: 'cruiser', faction: 'romulan', x: 0.7, path: straight(0.7), dropType: 'shield' },
        { type: 'bomber', faction: 'romulan', x: 0.5, path: zigzag(0.5) },
      ]},
      { time: 1200, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.3, path: zigzag(0.3), dropType: 'bomb' },
        { type: 'elite', faction: 'romulan', x: 0.7, path: zigzag(0.7), dropType: 'star' },
        { type: 'fighter', faction: 'romulan', x: 0.5, path: straight(0.5) },
      ]},
      { time: 1500, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'life' },
        { type: 'turret', faction: 'romulan', x: 0.2, path: straight(0.2) },
        { type: 'turret', faction: 'romulan', x: 0.8, path: straight(0.8) },
        { type: 'fighter', faction: 'romulan', x: 0.4, path: swoopLeft(0.4) },
        { type: 'fighter', faction: 'romulan', x: 0.6, path: swoopRight(0.6) },
      ]},
    ],
    boss: { name: 'IRW Valdore', type: 'dreadnought', hp: 700, width: 160, height: 100, phases: 4, faction: 'romulan' },
  },

  // ── Stage 3: Orion Syndicate ──────────────────────────────
  {
    id: 3,
    name: 'ORION SYNDICATE',
    subtitle: 'Smuggler\'s Run — Syndicate Blockade',
    faction: 'orion',
    background: '#0c0806',
    duration: 12000, // 3:20
    waves: [
      { time: 60, enemies: [
        { type: 'fighter', faction: 'orion', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'orion', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'orion', x: 0.8, path: swoopLeft(0.8) },
        { type: 'fighter', faction: 'orion', x: 0.35, path: zigzag(0.35) },
        { type: 'fighter', faction: 'orion', x: 0.65, path: zigzag(0.65) },
      ]},
      { time: 300, enemies: [
        { type: 'bomber', faction: 'orion', x: 0.3, path: straight(0.3), dropType: 'weapon' },
        { type: 'bomber', faction: 'orion', x: 0.7, path: straight(0.7), dropType: 'missile' },
        { type: 'elite', faction: 'orion', x: 0.5, path: zigzag(0.5), dropType: 'star' },
      ]},
      { time: 600, enemies: [
        { type: 'cruiser', faction: 'orion', x: 0.3, path: straight(0.3) },
        { type: 'cruiser', faction: 'orion', x: 0.7, path: straight(0.7) },
        { type: 'turret', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'magnet' },
      ]},
      { time: 900, enemies: [
        { type: 'elite', faction: 'orion', x: 0.2, path: swoopRight(0.2), dropType: 'bomb' },
        { type: 'elite', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'shield' },
        { type: 'elite', faction: 'orion', x: 0.8, path: swoopLeft(0.8), dropType: 'laser' },
      ]},
      { time: 1200, enemies: [
        { type: 'fighter', faction: 'orion', x: 0.1, path: swoopRight(0.1) },
        { type: 'fighter', faction: 'orion', x: 0.3, path: swoopRight(0.3) },
        { type: 'fighter', faction: 'orion', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'orion', x: 0.7, path: swoopLeft(0.7) },
        { type: 'fighter', faction: 'orion', x: 0.9, path: swoopLeft(0.9) },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'life' },
      ]},
      { time: 1600, enemies: [
        { type: 'cruiser', faction: 'orion', x: 0.2, path: straight(0.2), dropType: 'weapon' },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'star' },
        { type: 'cruiser', faction: 'orion', x: 0.8, path: straight(0.8), dropType: 'weapon' },
        { type: 'turret', faction: 'orion', x: 0.4, path: straight(0.4) },
        { type: 'turret', faction: 'orion', x: 0.6, path: straight(0.6) },
      ]},
    ],
    boss: { name: 'Orion Flagship', type: 'flagship', hp: 1100, width: 180, height: 110, phases: 5, faction: 'orion' },
  },

  // ── Stage 4: Gravity Well ─────────────────────────────────
  // Music: Gravitational Lull. Ambient, slow, ominous. Signature: vortex_storm.
  {
    id: 4,
    name: 'GRAVITY WELL',
    subtitle: 'Caught in the Pull — Singularity Sector',
    faction: 'romulan',
    background: '#080510',
    duration: 12000, // 3:20
    waves: [
      { time: 120, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'shield' },
      ]},
      { time: 600, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.3, path: zigzag(0.3), dropType: 'star' },
        { type: 'elite', faction: 'romulan', x: 0.7, path: zigzag(0.7), dropType: 'weapon' },
      ]},
    ],
    boss: { name: 'Singularity Marauder', type: 'gravitymarauder', hp: 1300, width: 170, height: 110, phases: 4, faction: 'romulan' },
  },

  // ── Stage 5: Deep Space Anomaly ───────────────────────────
  {
    id: 5,
    name: 'DEEP SPACE ANOMALY',
    subtitle: 'Uncharted Sector — Mixed Hostiles',
    faction: 'klingon',
    background: '#050510',
    duration: 12600, // 3:30
    waves: [
      { time: 60, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'romulan', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'orion', x: 0.8, path: swoopLeft(0.8) },
      ]},
      { time: 240, enemies: [
        { type: 'bomber', faction: 'klingon', x: 0.3, path: zigzag(0.3), dropType: 'weapon' },
        { type: 'bomber', faction: 'romulan', x: 0.7, path: zigzag(0.7), dropType: 'missile' },
        { type: 'fighter', faction: 'orion', x: 0.15, path: swoopRight(0.15) },
        { type: 'fighter', faction: 'orion', x: 0.85, path: swoopLeft(0.85) },
      ]},
      { time: 480, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'star' },
        { type: 'cruiser', faction: 'romulan', x: 0.3, path: straight(0.3) },
        { type: 'cruiser', faction: 'orion', x: 0.7, path: straight(0.7) },
      ]},
      { time: 720, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.1, path: swoopRight(0.1) },
        { type: 'fighter', faction: 'klingon', x: 0.3, path: swoopRight(0.3) },
        { type: 'fighter', faction: 'romulan', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'orion', x: 0.7, path: swoopLeft(0.7) },
        { type: 'fighter', faction: 'orion', x: 0.9, path: swoopLeft(0.9) },
        { type: 'turret', faction: 'klingon', x: 0.4, path: straight(0.4), dropType: 'shield' },
        { type: 'turret', faction: 'romulan', x: 0.6, path: straight(0.6), dropType: 'bomb' },
      ]},
      { time: 1000, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.3, path: zigzag(0.3), dropType: 'laser' },
        { type: 'elite', faction: 'orion', x: 0.7, path: zigzag(0.7), dropType: 'magnet' },
        { type: 'bomber', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'star' },
      ]},
      { time: 1400, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.2, path: straight(0.2), dropType: 'weapon' },
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'life' },
        { type: 'cruiser', faction: 'orion', x: 0.8, path: straight(0.8), dropType: 'weapon' },
        { type: 'elite', faction: 'klingon', x: 0.35, path: zigzag(0.35) },
        { type: 'elite', faction: 'orion', x: 0.65, path: zigzag(0.65) },
      ]},
      { time: 1800, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.1, path: zigzag(0.1) },
        { type: 'fighter', faction: 'klingon', x: 0.2, path: zigzag(0.2) },
        { type: 'fighter', faction: 'romulan', x: 0.4, path: swoopLeft(0.4) },
        { type: 'fighter', faction: 'romulan', x: 0.6, path: swoopRight(0.6) },
        { type: 'fighter', faction: 'orion', x: 0.8, path: zigzag(0.8) },
        { type: 'fighter', faction: 'orion', x: 0.9, path: zigzag(0.9) },
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'bomb' },
      ]},
    ],
    boss: { name: 'Anomaly Guardian', type: 'guardian', hp: 1500, width: 160, height: 100, phases: 4, faction: 'klingon' },
  },

  // ── Stage 6: Wormhole Transit ─────────────────────────────
  {
    id: 6,
    name: 'WORMHOLE TRANSIT',
    subtitle: 'Dimensional Rift — Reality Distortion',
    faction: 'romulan',
    background: '#0a0020',
    duration: 13200, // 3:40
    waves: [
      { time: 60, enemies: [
        { type: 'fighter', faction: 'romulan', x: 0.3, path: zigzag(0.3) },
        { type: 'fighter', faction: 'romulan', x: 0.5, path: zigzag(0.5) },
        { type: 'fighter', faction: 'romulan', x: 0.7, path: zigzag(0.7) },
      ]},
      { time: 200, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.2, path: swoopRight(0.2), dropType: 'weapon' },
        { type: 'elite', faction: 'romulan', x: 0.8, path: swoopLeft(0.8), dropType: 'weapon' },
      ]},
      { time: 400, enemies: [
        { type: 'bomber', faction: 'klingon', x: 0.3, path: straight(0.3), dropType: 'star' },
        { type: 'bomber', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'star' },
        { type: 'bomber', faction: 'klingon', x: 0.7, path: straight(0.7), dropType: 'star' },
        { type: 'turret', faction: 'romulan', x: 0.15, path: straight(0.15) },
        { type: 'turret', faction: 'romulan', x: 0.85, path: straight(0.85) },
      ]},
      { time: 700, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: zigzag(0.5), dropType: 'laser' },
        { type: 'fighter', faction: 'romulan', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'romulan', x: 0.4, path: swoopLeft(0.4) },
        { type: 'fighter', faction: 'romulan', x: 0.6, path: swoopRight(0.6) },
        { type: 'fighter', faction: 'romulan', x: 0.8, path: swoopLeft(0.8) },
      ]},
      { time: 1000, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.3, path: straight(0.3), dropType: 'missile' },
        { type: 'elite', faction: 'klingon', x: 0.7, path: straight(0.7), dropType: 'bomb' },
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: zigzag(0.5), dropType: 'shield' },
      ]},
      { time: 1400, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.2, path: straight(0.2) },
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'life' },
        { type: 'cruiser', faction: 'romulan', x: 0.8, path: straight(0.8) },
        { type: 'elite', faction: 'romulan', x: 0.35, path: zigzag(0.35), dropType: 'star' },
        { type: 'elite', faction: 'klingon', x: 0.65, path: zigzag(0.65), dropType: 'star' },
      ]},
    ],
    boss: { name: 'Rift Sovereign', type: 'sovereign', hp: 1700, width: 180, height: 120, phases: 4, faction: 'romulan' },
  },

  // ── Stage 7: Final Fortress ───────────────────────────────
  {
    id: 7,
    name: 'FINAL FORTRESS',
    subtitle: 'Enemy Stronghold — All-Out Assault',
    faction: 'orion',
    background: '#0c0404',
    duration: 13800, // 3:50
    waves: [
      { time: 60, enemies: [
        { type: 'turret', faction: 'orion', x: 0.2, path: straight(0.2) },
        { type: 'turret', faction: 'orion', x: 0.4, path: straight(0.4) },
        { type: 'turret', faction: 'orion', x: 0.6, path: straight(0.6) },
        { type: 'turret', faction: 'orion', x: 0.8, path: straight(0.8) },
      ]},
      { time: 240, enemies: [
        { type: 'fighter', faction: 'orion', x: 0.1, path: swoopRight(0.1) },
        { type: 'fighter', faction: 'orion', x: 0.3, path: swoopRight(0.3) },
        { type: 'fighter', faction: 'klingon', x: 0.5, path: straight(0.5) },
        { type: 'fighter', faction: 'orion', x: 0.7, path: swoopLeft(0.7) },
        { type: 'fighter', faction: 'orion', x: 0.9, path: swoopLeft(0.9) },
        { type: 'bomber', faction: 'orion', x: 0.5, path: zigzag(0.5), dropType: 'weapon' },
      ]},
      { time: 500, enemies: [
        { type: 'cruiser', faction: 'orion', x: 0.3, path: straight(0.3), dropType: 'shield' },
        { type: 'cruiser', faction: 'klingon', x: 0.7, path: straight(0.7), dropType: 'missile' },
        { type: 'elite', faction: 'orion', x: 0.5, path: zigzag(0.5), dropType: 'star' },
      ]},
      { time: 800, enemies: [
        { type: 'elite', faction: 'orion', x: 0.2, path: swoopRight(0.2), dropType: 'bomb' },
        { type: 'elite', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'laser' },
        { type: 'elite', faction: 'orion', x: 0.8, path: swoopLeft(0.8), dropType: 'magnet' },
        { type: 'turret', faction: 'orion', x: 0.35, path: straight(0.35) },
        { type: 'turret', faction: 'orion', x: 0.65, path: straight(0.65) },
      ]},
      { time: 1100, enemies: [
        { type: 'fighter', faction: 'orion', x: 0.15, path: zigzag(0.15) },
        { type: 'fighter', faction: 'orion', x: 0.3, path: zigzag(0.3) },
        { type: 'fighter', faction: 'klingon', x: 0.45, path: zigzag(0.45) },
        { type: 'fighter', faction: 'klingon', x: 0.55, path: zigzag(0.55) },
        { type: 'fighter', faction: 'orion', x: 0.7, path: zigzag(0.7) },
        { type: 'fighter', faction: 'orion', x: 0.85, path: zigzag(0.85) },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'life' },
      ]},
      { time: 1500, enemies: [
        { type: 'cruiser', faction: 'orion', x: 0.2, path: straight(0.2), dropType: 'weapon' },
        { type: 'cruiser', faction: 'klingon', x: 0.4, path: straight(0.4) },
        { type: 'cruiser', faction: 'orion', x: 0.6, path: straight(0.6) },
        { type: 'cruiser', faction: 'klingon', x: 0.8, path: straight(0.8), dropType: 'weapon' },
        { type: 'elite', faction: 'orion', x: 0.5, path: zigzag(0.5), dropType: 'bomb' },
      ]},
      { time: 1900, enemies: [
        { type: 'elite', faction: 'orion', x: 0.2, path: zigzag(0.2), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.4, path: swoopRight(0.4), dropType: 'star' },
        { type: 'elite', faction: 'klingon', x: 0.6, path: swoopLeft(0.6), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.8, path: zigzag(0.8), dropType: 'star' },
      ]},
      { time: 2200, enemies: [
        { type: 'cruiser', faction: 'orion', x: 0.3, path: straight(0.3), dropType: 'shield' },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'life' },
        { type: 'cruiser', faction: 'orion', x: 0.7, path: straight(0.7), dropType: 'shield' },
        { type: 'turret', faction: 'orion', x: 0.15, path: straight(0.15) },
        { type: 'turret', faction: 'orion', x: 0.85, path: straight(0.85) },
        { type: 'elite', faction: 'klingon', x: 0.4, path: zigzag(0.4) },
        { type: 'elite', faction: 'klingon', x: 0.6, path: zigzag(0.6) },
      ]},
    ],
    boss: { name: 'Fortress Command', type: 'fortress', hp: 1900, width: 220, height: 140, phases: 5, faction: 'orion' },
  },

  // ── Stage 8: Black Hole Perimeter ─────────────────────────
  {
    id: 8,
    name: 'BLACK HOLE PERIMETER',
    subtitle: 'Event Horizon — Gravitational Collapse',
    faction: 'klingon',
    background: '#020008',
    duration: 14400, // 4:00
    waves: [
      { time: 60, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.2, path: zigzag(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.5, path: zigzag(0.5) },
        { type: 'fighter', faction: 'klingon', x: 0.8, path: zigzag(0.8) },
        { type: 'fighter', faction: 'romulan', x: 0.35, path: swoopLeft(0.35) },
        { type: 'fighter', faction: 'romulan', x: 0.65, path: swoopRight(0.65) },
      ]},
      { time: 240, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.3, path: zigzag(0.3), dropType: 'weapon' },
        { type: 'elite', faction: 'klingon', x: 0.7, path: zigzag(0.7), dropType: 'shield' },
        { type: 'bomber', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'missile' },
      ]},
      { time: 480, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.3, path: straight(0.3) },
        { type: 'cruiser', faction: 'klingon', x: 0.7, path: straight(0.7) },
        { type: 'turret', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'bomb' },
        { type: 'fighter', faction: 'romulan', x: 0.15, path: swoopRight(0.15) },
        { type: 'fighter', faction: 'romulan', x: 0.85, path: swoopLeft(0.85) },
      ]},
      { time: 720, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.2, path: swoopRight(0.2), dropType: 'laser' },
        { type: 'elite', faction: 'romulan', x: 0.8, path: swoopLeft(0.8), dropType: 'phaser' },
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'star' },
      ]},
      { time: 1000, enemies: [
        { type: 'fighter', faction: 'klingon', x: 0.1, path: zigzag(0.1) },
        { type: 'fighter', faction: 'klingon', x: 0.3, path: zigzag(0.3) },
        { type: 'fighter', faction: 'klingon', x: 0.5, path: zigzag(0.5) },
        { type: 'fighter', faction: 'klingon', x: 0.7, path: zigzag(0.7) },
        { type: 'fighter', faction: 'klingon', x: 0.9, path: zigzag(0.9) },
        { type: 'bomber', faction: 'romulan', x: 0.4, path: straight(0.4), dropType: 'weapon' },
        { type: 'bomber', faction: 'romulan', x: 0.6, path: straight(0.6), dropType: 'shield' },
      ]},
      { time: 1400, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.2, path: straight(0.2), dropType: 'missile' },
        { type: 'elite', faction: 'klingon', x: 0.5, path: zigzag(0.5), dropType: 'bomb' },
        { type: 'cruiser', faction: 'klingon', x: 0.8, path: straight(0.8), dropType: 'star' },
        { type: 'turret', faction: 'romulan', x: 0.35, path: straight(0.35) },
        { type: 'turret', faction: 'romulan', x: 0.65, path: straight(0.65) },
      ]},
      { time: 1800, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.2, path: zigzag(0.2), dropType: 'star' },
        { type: 'elite', faction: 'romulan', x: 0.4, path: swoopLeft(0.4), dropType: 'star' },
        { type: 'elite', faction: 'klingon', x: 0.6, path: swoopRight(0.6), dropType: 'star' },
        { type: 'elite', faction: 'romulan', x: 0.8, path: zigzag(0.8), dropType: 'star' },
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'life' },
      ]},
    ],
    boss: { name: 'Singularity Dreadnought', type: 'singularity', hp: 2100, width: 230, height: 145, phases: 5, faction: 'klingon' },
  },

  // ── Stage 9: Singularity Core ─────────────────────────────
  // Music: Gravitational Lull 1. Tension building, reality bending. Signature: vortex_storm.
  {
    id: 9,
    name: 'SINGULARITY CORE',
    subtitle: 'Event Horizon — Reality Bends',
    faction: 'klingon',
    background: '#050208',
    duration: 15000, // 4:10
    waves: [
      { time: 60, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.3, path: straight(0.3), dropType: 'shield' },
        { type: 'elite', faction: 'klingon', x: 0.7, path: straight(0.7), dropType: 'weapon' },
      ]},
      { time: 600, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.5, path: straight(0.5), dropType: 'life' },
      ]},
    ],
    boss: { name: 'Event Horizon Tyrant', type: 'voidtyrant', hp: 2300, width: 230, height: 145, phases: 5, faction: 'klingon' },
  },

  // ── Stage 10: Subspace Rift ───────────────────────────────
  {
    id: 10,
    name: 'SUBSPACE RIFT',
    subtitle: 'Between Dimensions — Phase Shifted',
    faction: 'romulan',
    background: '#080014',
    duration: 15600, // 4:20
    waves: [
      { time: 60, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.3, path: swoopLeft(0.3), dropType: 'weapon' },
        { type: 'elite', faction: 'romulan', x: 0.7, path: swoopRight(0.7), dropType: 'weapon' },
      ]},
      { time: 200, enemies: [
        { type: 'fighter', faction: 'romulan', x: 0.15, path: zigzag(0.15) },
        { type: 'fighter', faction: 'romulan', x: 0.35, path: zigzag(0.35) },
        { type: 'fighter', faction: 'romulan', x: 0.55, path: zigzag(0.55) },
        { type: 'fighter', faction: 'romulan', x: 0.75, path: zigzag(0.75) },
        { type: 'fighter', faction: 'romulan', x: 0.9, path: zigzag(0.9) },
        { type: 'bomber', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'shield' },
      ]},
      { time: 450, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.3, path: straight(0.3), dropType: 'laser' },
        { type: 'cruiser', faction: 'romulan', x: 0.7, path: straight(0.7), dropType: 'phaser' },
        { type: 'turret', faction: 'orion', x: 0.15, path: straight(0.15) },
        { type: 'turret', faction: 'orion', x: 0.85, path: straight(0.85) },
      ]},
      { time: 700, enemies: [
        { type: 'elite', faction: 'orion', x: 0.2, path: swoopRight(0.2), dropType: 'bomb' },
        { type: 'elite', faction: 'romulan', x: 0.5, path: zigzag(0.5), dropType: 'missile' },
        { type: 'elite', faction: 'orion', x: 0.8, path: swoopLeft(0.8), dropType: 'shield' },
        { type: 'bomber', faction: 'romulan', x: 0.35, path: straight(0.35), dropType: 'star' },
        { type: 'bomber', faction: 'romulan', x: 0.65, path: straight(0.65), dropType: 'star' },
      ]},
      { time: 1000, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.2, path: straight(0.2), dropType: 'weapon' },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'life' },
        { type: 'cruiser', faction: 'romulan', x: 0.8, path: straight(0.8), dropType: 'weapon' },
        { type: 'fighter', faction: 'orion', x: 0.35, path: swoopLeft(0.35) },
        { type: 'fighter', faction: 'orion', x: 0.65, path: swoopRight(0.65) },
      ]},
      { time: 1400, enemies: [
        { type: 'elite', faction: 'romulan', x: 0.15, path: zigzag(0.15), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.35, path: zigzag(0.35) },
        { type: 'elite', faction: 'romulan', x: 0.55, path: zigzag(0.55), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.75, path: zigzag(0.75) },
        { type: 'elite', faction: 'romulan', x: 0.9, path: zigzag(0.9), dropType: 'bomb' },
      ]},
      { time: 1800, enemies: [
        { type: 'cruiser', faction: 'romulan', x: 0.25, path: straight(0.25), dropType: 'shield' },
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'shield' },
        { type: 'cruiser', faction: 'romulan', x: 0.75, path: straight(0.75), dropType: 'shield' },
        { type: 'turret', faction: 'orion', x: 0.1, path: straight(0.1) },
        { type: 'turret', faction: 'orion', x: 0.9, path: straight(0.9) },
        { type: 'elite', faction: 'orion', x: 0.4, path: swoopLeft(0.4), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.6, path: swoopRight(0.6), dropType: 'star' },
      ]},
    ],
    boss: { name: 'Phase Wraith', type: 'wraith', hp: 1400, width: 200, height: 120, phases: 5, faction: 'romulan' },
  },

  // ── Stage 11: Omega Citadel ───────────────────────────────
  {
    id: 11,
    name: 'OMEGA CITADEL',
    subtitle: 'The Final Stand — All Factions United Against You',
    faction: 'orion',
    background: '#0a0000',
    duration: 16800, // 4:40 — final stage
    waves: [
      { time: 60, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.2, path: swoopRight(0.2), dropType: 'weapon' },
        { type: 'elite', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'shield' },
        { type: 'elite', faction: 'orion', x: 0.8, path: swoopLeft(0.8), dropType: 'missile' },
      ]},
      { time: 300, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.2, path: straight(0.2) },
        { type: 'cruiser', faction: 'romulan', x: 0.5, path: straight(0.5), dropType: 'bomb' },
        { type: 'cruiser', faction: 'orion', x: 0.8, path: straight(0.8) },
        { type: 'fighter', faction: 'klingon', x: 0.35, path: zigzag(0.35) },
        { type: 'fighter', faction: 'romulan', x: 0.65, path: zigzag(0.65) },
      ]},
      { time: 600, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.15, path: zigzag(0.15), dropType: 'laser' },
        { type: 'elite', faction: 'romulan', x: 0.35, path: swoopRight(0.35), dropType: 'phaser' },
        { type: 'elite', faction: 'orion', x: 0.55, path: zigzag(0.55), dropType: 'bomb' },
        { type: 'elite', faction: 'klingon', x: 0.75, path: swoopLeft(0.75), dropType: 'shield' },
        { type: 'elite', faction: 'romulan', x: 0.9, path: zigzag(0.9), dropType: 'star' },
        { type: 'turret', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'weapon' },
      ]},
      { time: 900, enemies: [
        { type: 'fighter', faction: 'orion', x: 0.1, path: swoopRight(0.1) },
        { type: 'fighter', faction: 'orion', x: 0.2, path: swoopRight(0.2) },
        { type: 'fighter', faction: 'klingon', x: 0.4, path: zigzag(0.4) },
        { type: 'fighter', faction: 'klingon', x: 0.6, path: zigzag(0.6) },
        { type: 'fighter', faction: 'romulan', x: 0.8, path: swoopLeft(0.8) },
        { type: 'fighter', faction: 'romulan', x: 0.9, path: swoopLeft(0.9) },
        { type: 'cruiser', faction: 'orion', x: 0.5, path: straight(0.5), dropType: 'life' },
      ]},
      { time: 1200, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.15, path: straight(0.15), dropType: 'weapon' },
        { type: 'cruiser', faction: 'romulan', x: 0.4, path: straight(0.4), dropType: 'star' },
        { type: 'cruiser', faction: 'orion', x: 0.6, path: straight(0.6), dropType: 'star' },
        { type: 'cruiser', faction: 'klingon', x: 0.85, path: straight(0.85), dropType: 'weapon' },
        { type: 'elite', faction: 'orion', x: 0.5, path: zigzag(0.5), dropType: 'bomb' },
      ]},
      { time: 1600, enemies: [
        { type: 'elite', faction: 'klingon', x: 0.1, path: zigzag(0.1) },
        { type: 'elite', faction: 'romulan', x: 0.25, path: swoopRight(0.25), dropType: 'shield' },
        { type: 'elite', faction: 'orion', x: 0.4, path: zigzag(0.4) },
        { type: 'elite', faction: 'klingon', x: 0.55, path: swoopLeft(0.55), dropType: 'shield' },
        { type: 'elite', faction: 'romulan', x: 0.7, path: zigzag(0.7) },
        { type: 'elite', faction: 'orion', x: 0.85, path: swoopRight(0.85), dropType: 'star' },
      ]},
      { time: 2000, enemies: [
        { type: 'cruiser', faction: 'klingon', x: 0.2, path: straight(0.2), dropType: 'life' },
        { type: 'cruiser', faction: 'romulan', x: 0.4, path: straight(0.4), dropType: 'shield' },
        { type: 'cruiser', faction: 'orion', x: 0.6, path: straight(0.6), dropType: 'shield' },
        { type: 'cruiser', faction: 'klingon', x: 0.8, path: straight(0.8), dropType: 'bomb' },
        { type: 'turret', faction: 'orion', x: 0.1, path: straight(0.1) },
        { type: 'turret', faction: 'klingon', x: 0.5, path: straight(0.5) },
        { type: 'turret', faction: 'romulan', x: 0.9, path: straight(0.9) },
      ]},
      { time: 2300, enemies: [
        { type: 'elite', faction: 'orion', x: 0.2, path: zigzag(0.2), dropType: 'star' },
        { type: 'elite', faction: 'klingon', x: 0.35, path: swoopRight(0.35), dropType: 'star' },
        { type: 'elite', faction: 'romulan', x: 0.5, path: zigzag(0.5), dropType: 'star' },
        { type: 'elite', faction: 'orion', x: 0.65, path: swoopLeft(0.65), dropType: 'star' },
        { type: 'elite', faction: 'klingon', x: 0.8, path: zigzag(0.8), dropType: 'star' },
      ]},
    ],
    boss: { name: 'OMEGA SUPREME', type: 'omega', hp: 2000, width: 240, height: 150, phases: 6, faction: 'orion' },
  },
];
