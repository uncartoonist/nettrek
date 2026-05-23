// NetTrek — Vertical scrolling tactical space combat

export interface Vec2 { x: number; y: number; }

export type Faction = 'federation' | 'klingon' | 'romulan' | 'orion';

// ── Player ─────────────────────────────────────────────────
export interface PlayerShip {
  pos: Vec2;
  width: number;
  height: number;
  alive: boolean;
  shields: number;
  maxShields: number;
  lives: number;
  invulnTimer: number; // frames of invulnerability after respawn
  // Weapons
  mainGunLevel: number;   // 1-5
  wingGunLevel: number;   // 0-4
  missileLevel: number;   // 0-3
  laserLevel: number;     // 0-2
  phaserLevel: number;    // 0-3
  // Pickups active
  magnetActive: boolean;
  magnetTimer: number;
  bombCount: number;
  // New power-ups
  overdriveTimer: number;  // 2x fire rate
  droneActive: boolean;    // companion drone
  droneTimer: number;
  dronePos: Vec2;          // wingman position
  scoreMultTimer: number;  // 2x score
  // Lock-on phaser — charge-based: locks on until target dies or power drains,
  // then has to recharge before it can fire again.
  lockOnPhaserReady: boolean;  // has the weapon
  lockOnTarget: number;        // enemy id being targeted (-1 = none)
  phaserCharge: number;        // 0-1, current power level (1 = fully charged)
  phaserBeamActive: boolean;   // is the beam currently firing?
  phaserRechargeDelay: number; // frames before recharge resumes after beam ends
  // Currency
  stars: number;
  totalStars: number;     // lifetime total (for upgrade hangar)
  // Shield burst (hard-push / long-press on touch) — defensive panic button
  shieldBurstCooldown: number;  // frames until next burst is allowed
  shieldBurstActive: number;    // frames remaining of active burst visual
  // Tractor beam slow — T'VAK boss tractor pulse temporarily slows movement
  tractorSlowTimer: number;
}

// Waveform payload context — set on every triggerFire frame so enemy
// weapon code can shape the projectile to the music's current band.
export type BeatBand = 'bass' | 'mid' | 'high';

// ── Enemies ────────────────────────────────────────────────
export type EnemyType = 'fighter' | 'bomber' | 'cruiser' | 'elite' | 'turret' | 'boss';

// ── Movement archetype for non-boss enemies ──────────────────────
// formation: locked to a spawn-time x, descends slowly with the formation
// patrol:    swoops to a settle-y then strafes left-right
// drift:     gentle descent with subtle horizontal wobble
// orbit:     circles around homeX while descending
// dive:      angled approach toward the player then continues past
// anchor:    settles near the top of the screen and holds station
export type MoveStyle = 'formation' | 'patrol' | 'drift' | 'orbit' | 'dive' | 'anchor';

export interface Enemy {
  id: number;
  type: EnemyType;
  faction: Faction;
  pos: Vec2;
  vel: Vec2;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  fireTimer: number;
  fireCooldown: number;
  path?: PathPoint[];     // scripted movement path
  pathIdx: number;
  dropType?: PowerUpType;
  // ── Movement profile ──
  moveStyle?: MoveStyle;
  formationId?: number;   // enemies sharing this id fly as a group
  homeX?: number;         // anchor x for the oscillation/orbit
  moveSeed?: number;      // randomization for phase offsets, etc
  settleY?: number;       // y the enemy settles at for patrol/anchor styles
  enterTimer?: number;    // frames since spawn, used for entry curves
  hitFlash?: number;      // frames remaining of the white hit-flash overlay
  // Cloaking (Romulan signature mechanic, currently used by Valdore).
  cloakTimer?: number;    // frames until next cloak cycle begins
  cloakActive?: number;   // frames remaining of the current cloak (0 = uncloaked)
  // Per-boss extras (Valdore: escort spawns; Flagship: mine drops;
  // Marauder: vortex obstacle drops). Multi-purpose timer for periodic spawns.
  escortTimer?: number;
  // Singularity Marauder — gravity pull cycle (pulls the player toward the boss).
  pullTimer?: number;     // frames until next pull pulse begins
  pullActive?: number;    // frames remaining of the current pull (0 = inactive)
  // Boss specific
  phase?: number;
  phaseTimer?: number;
  phaseCount?: number;
  weakPoints?: WeakPoint[];
  bossType?: string;   // 'warbird', 'dreadnought', etc. — dispatches per-boss combat + visuals
  deathSequence?: number; // when set, boss is in scripted death FX (frames elapsed)
}

export interface WeakPoint {
  offset: Vec2;
  hp: number;
  maxHp: number;
  alive: boolean;
  // Named weapon system (T'VAK and future bosses with per-weapon hardpoints).
  // When set, weaponType drives both rendering color and fire pattern.
  weaponType?: 'disruptor' | 'plasma' | 'tractor' | 'missile' | 'phaser' | 'torpedo';
  label?: string;       // shown in the boss subsystem callouts
  color?: string;       // overrides the default weak-point color
  fireTimer?: number;   // per-weapon firing cadence
  fireCooldown?: number;
}

export interface PathPoint {
  x: number;
  y: number;
  duration: number; // frames to reach this point
}

// ── Bullets ────────────────────────────────────────────────
export type BulletShape = 'bolt' | 'blob' | 'diamond' | 'orb' | 'needle' | 'missile' | 'torpedo' | 'phaserlance' | 'ripple';

export interface Bullet {
  pos: Vec2;
  vel: Vec2;
  damage: number;
  radius: number;
  isPlayer: boolean;
  color: string;
  trail?: boolean;
  ttl: number;    // frames remaining
  maxTtl: number; // for fade calc
  shape?: BulletShape;  // overrides color-based shape dispatch (T'VAK + future bosses)
}

// ── Obstacles ──────────────────────────────────────────────
export type ObstacleType = 'rock' | 'mine' | 'barrier' | 'vortex' | 'comet' | 'energyribbon' | 'splitter';

export interface Obstacle {
  pos: Vec2;
  vel: Vec2;
  radius: number;
  hp: number;
  type: ObstacleType;
  rotation: number;
  rotSpeed: number;
  pullStrength?: number; // for vortex
  ribbonPoints?: Vec2[]; // for energy ribbons — trail of points
  splitCount?: number;   // for splitter rocks — how many times it splits
}

// ── Outposts — hover to loot ──────────────────────────────
export type OutpostType = 'station' | 'planet' | 'derelict' | 'beacon' | 'tradeship';

export interface Outpost {
  pos: Vec2;
  vel: Vec2;
  type: OutpostType;
  radius: number;
  lootTable: PowerUpType[];  // what it drops when captured
  captureProgress: number;   // 0-1, fills while player hovers
  captureTime: number;       // frames needed to capture
  captured: boolean;
  rotation: number;
  name: string;              // display name
}

// ── Power-ups ──────────────────────────────────────────────
export type PowerUpType = 'weapon' | 'shield' | 'star' | 'bomb' | 'magnet' | 'missile' | 'laser' | 'phaser' | 'life' | 'emp' | 'overdrive' | 'drone' | 'score2x' | 'crew';

export interface PowerUp {
  pos: Vec2;
  vel: Vec2;
  type: PowerUpType;
  value: number;
  magnetizable: boolean;
}

// ── Particles ──────────────────────────────────────────────
export interface Particle {
  pos: Vec2;
  vel: Vec2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// ── Stages ─────────────────────────────────────────────────
export interface Wave {
  time: number;         // scroll position (frame) to trigger
  enemies: WaveEnemy[];
}

export interface WaveEnemy {
  type: EnemyType;
  faction: Faction;
  x: number;            // spawn x (0-1 screen fraction)
  path?: PathPoint[];
  hp?: number;
  dropType?: PowerUpType;
}

export interface Stage {
  id: number;
  name: string;
  subtitle: string;
  faction: Faction;     // primary enemy faction
  waves: Wave[];
  boss?: BossConfig;
  background: string;   // color theme
  duration: number;     // total frames before boss
}

export interface BossConfig {
  name: string;
  type: string;
  hp: number;
  width: number;
  height: number;
  phases: number;
  faction: Faction;
}

// ── Upgrades ───────────────────────────────────────────────
export interface UpgradeLevel {
  cost: number;
  description: string;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  maxLevel: number;
  levels: UpgradeLevel[];
}

// ── Game State ─────────────────────────────────────────────
export type GamePhase = 'menu' | 'hangar' | 'briefing' | 'playing' | 'boss' | 'respawning' | 'victory' | 'gameover';

export interface ShmupState {
  phase: GamePhase;
  tick: number;
  scrollY: number;
  scrollSpeed: number;
  player: PlayerShip;
  enemies: Enemy[];
  obstacles: Obstacle[];
  outposts: Outpost[];
  terrain: TerrainSegment[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  powerUps: PowerUp[];
  particles: Particle[];
  currentStage: number;
  stages: Stage[];
  // Persistent upgrades (saved to localStorage)
  upgrades: Record<string, number>;
  // HUD
  score: number;
  combo: number;
  comboTimer: number;
  upgradeFlash: string; // text to show when powerup collected
  upgradeFlashTimer: number;
  bossActive: boolean;
  bossHp: number;
  bossMaxHp: number;
  // Music-reactive state
  beatPulse: number;      // 0-1, decays each frame — for visual beat effects
  musicIntensity: number;  // 0-1, overall energy from analyzer
  // Live music bands (smoothed) — for the waveform indicator + payload sizing
  bandBass: number;       // 0-1
  bandMid: number;        // 0-1
  bandHigh: number;       // 0-1
  // Current beat being fired (set on triggerFire frames)
  currentBeatType: BeatBand;
  currentBeatStrength: number; // 0-1, amplitude of the most recent peak
  beatFlashTimer: number;      // counts down, drives the visual pulse on the EQ
  // Screen dimensions
  screenW: number;
  screenH: number;
  // Screen effects
  screenShake: number;       // intensity, decays each frame
  screenFlash: number;       // white flash intensity (0-1)
  screenFlashColor: string;  // flash color
  bossWarning: number;       // warning banner timer (frames)
  bossEntrance: number;      // entrance cinematic timer (frames)
  damageVignette: number;    // red vignette on player hit (0-1)
  slowMotion: number;        // slow-mo frames remaining (for boss kill)
  // Graze system
  grazeCount: number;         // total grazes this stage
  grazeFlash: number;         // visual feedback timer
  // Floating text popups
  popups: ScorePopup[];
  // Adaptive difficulty
  deathCount: number;         // deaths this stage (eases difficulty)
  dominanceScore: number;     // running score of how well player is doing
  // Chain reaction system
  chainLevel: number;         // current chain multiplier (1-8)
  chainTimer: number;         // frames until chain decays
  explosionZones: ExplosionZone[];
  // Music drop transformations
  dropCount: number;          // drops detected this stage
  // ── Signature mechanics — music-driven challenges per song ──
  curtains: BulletCurtain[];   // rising bullet walls (for 'curtain' signature)
  pulseWalls: PulseWall[];     // scanning energy walls (for 'pulse_walls' signature)
  signatureLabel: string;      // text shown briefly when a signature fires
  signatureLabelTimer: number; // frames remaining
  // Per-stage stats — captured for the end-of-stage debrief screen
  stageStats: StageStats;
  victoryTimer: number;        // frames since boss died (drives stats reveal + flyaway)
  flyawayActive: boolean;      // true once the player ship begins exiting
  flyawayProgress: number;     // 0-1, animation progress of the ship leaving
}

export interface StageStats {
  startTick: number;       // state.tick when stage began
  startStars: number;      // coins the player had when stage began
  kills: number;           // enemies killed this stage
  bossKilled: boolean;     // boss destroyed this stage
  subsystemsDestroyed: number; // boss weak points destroyed
  shotsHit: number;        // count of enemyHit / obstacleHit / weakPointHit events
  damageTaken: number;     // count of playerHit events
  endTick: number;         // captured when boss dies — for the stage-time display
  finalCoins: number;      // captured at the same moment
}

export interface BulletCurtain {
  y: number;             // current y position (rising upward)
  vy: number;            // upward velocity
  gapX: number;          // gap center, fraction of screen width (0-1)
  gapHalfWidth: number;  // half the width of the safe gap, in pixels
  hue: number;           // color hue
  life: number;          // frames remaining (despawn when off-screen anyway)
  damaging: boolean;     // active hit-box
}

export interface PulseWall {
  axis: 'horizontal' | 'vertical';
  pos: number;            // current y (horizontal) or x (vertical)
  vel: number;            // speed
  gapAt: number;          // gap center along the other axis, fraction (0-1)
  gapSize: number;        // gap size in pixels
  life: number;
  damaging: boolean;
}

export interface ExplosionZone {
  pos: Vec2;
  radius: number;
  damage: number;
  life: number; // frames remaining
}

export interface ScorePopup {
  pos: Vec2;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

// ── Terrain formations — fly through these ────────────────
export type TerrainType = 'canyon' | 'asteroidcorridor' | 'stationdebris' | 'wormholetunnel' | 'crystalfield';

export interface TerrainSegment {
  pos: Vec2;
  vel: Vec2;
  type: TerrainType;
  width: number;         // gap width the player can fly through
  height: number;        // visual thickness
  gapX: number;          // center of the gap (0-1 screen fraction)
  rotation: number;
  color: string;
  life: number;          // frames until removed
  damaging: boolean;     // does touching the walls hurt?
}

// ── Constants ──────────────────────────────────────────────
export const PLAYER_SPEED = 11;
export const PLAYER_WIDTH = 28;
export const PLAYER_HEIGHT = 32;
export const SCROLL_SPEED = 1.0;
export const INVULN_TIME = 90; // 1.5 seconds

export const FACTION_COLORS: Record<Faction, string> = {
  federation: '#00ccff',
  klingon: '#ff3333',
  romulan: '#33ff33',
  orion: '#ffaa00',
};

export const ENEMY_STATS: Record<EnemyType, { hp: number; width: number; height: number; fireCooldown: number }> = {
  fighter:  { hp: 6,    width: 36, height: 34, fireCooldown: 90 },
  bomber:   { hp: 18,   width: 50, height: 44, fireCooldown: 130 },
  cruiser:  { hp: 55,   width: 64, height: 70, fireCooldown: 70 },
  elite:    { hp: 95,   width: 54, height: 54, fireCooldown: 50 },
  turret:   { hp: 35,   width: 40, height: 40, fireCooldown: 80 },
  boss:     { hp: 1200, width: 160, height: 100, fireCooldown: 30 },
};

// ── Environment Objects ────────────────────────────────────
export type EnvType = 'asteroid' | 'nebula' | 'station' | 'debris' | 'planet-bg' | 'ring' | 'satellite';

export interface EnvObject {
  pos: Vec2;
  size: number;
  type: EnvType;
  rotation: number;
  rotSpeed: number;
  parallax: number; // 0.3 = far bg, 1.0 = foreground
  color: string;
  opacity: number;
}

export interface StageEnvironment {
  bgGradient: [string, string]; // top, bottom colors
  envObjects: EnvSpawn[];
  nebulaTint?: string;
}

export interface EnvSpawn {
  type: EnvType;
  frequency: number; // chance per frame (0-1)
  sizeRange: [number, number];
  parallaxRange: [number, number];
  colors: string[];
}
