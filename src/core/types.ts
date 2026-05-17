// Core game types — modeled after the Swift NetTrekCore entities

export type Faction = 'federation' | 'klingon' | 'romulan' | 'orion';
export type ShipClass = 'scout' | 'destroyer' | 'cruiser' | 'battleship';

export interface Vec2 {
  x: number;
  y: number;
}

export interface ShipClassStats {
  maxSpeed: number;
  turnRate: number;
  maxShields: number;
  maxHull: number;
  maxEnergy: number;
  torpDamage: number;
  phaserDamage: number;
  torpCost: number;
  phaserCost: number;
  phaserRange: number;
  maxArmies: number; // carry capacity
  regenRate: number;
}

export const SHIP_CLASS_STATS: Record<ShipClass, ShipClassStats> = {
  scout: {
    maxSpeed: 14, turnRate: 0.07, maxShields: 75, maxHull: 60,
    maxEnergy: 6000, torpDamage: 25, phaserDamage: 30, torpCost: 150,
    phaserCost: 350, phaserRange: 200, maxArmies: 2, regenRate: 12,
  },
  destroyer: {
    maxSpeed: 10, turnRate: 0.05, maxShields: 100, maxHull: 100,
    maxEnergy: 8000, torpDamage: 35, phaserDamage: 40, torpCost: 200,
    phaserCost: 500, phaserRange: 250, maxArmies: 5, regenRate: 10,
  },
  cruiser: {
    maxSpeed: 8, turnRate: 0.04, maxShields: 130, maxHull: 130,
    maxEnergy: 10000, torpDamage: 45, phaserDamage: 50, torpCost: 250,
    phaserCost: 600, phaserRange: 300, maxArmies: 8, regenRate: 8,
  },
  battleship: {
    maxSpeed: 6, turnRate: 0.03, maxShields: 180, maxHull: 180,
    maxEnergy: 14000, torpDamage: 60, phaserDamage: 65, torpCost: 300,
    phaserCost: 750, phaserRange: 350, maxArmies: 12, regenRate: 6,
  },
};

export interface Ship {
  id: number;
  name: string;
  faction: Faction;
  shipClass: ShipClass;
  pos: Vec2;
  vel: Vec2;
  heading: number;
  speed: number;
  shields: number;
  hull: number;
  energy: number;
  cloaked: boolean;
  alive: boolean;
  armies: number;      // carried armies
  orbiting: number;    // planet id or -1
  respawnTimer: number; // frames until respawn (0 = alive)
  kills: number;
  deaths: number;
  planetsTaken: number;
  armiesBombed: number;
}

export interface Torpedo {
  id: number;
  owner: number;
  faction: Faction;
  pos: Vec2;
  vel: Vec2;
  fuse: number;
  alive: boolean;
  damage: number;
}

export interface Phaser {
  owner: number;
  faction: Faction;
  from: Vec2;
  to: Vec2;
  ttl: number;
  damage: number;
}

export interface Explosion {
  pos: Vec2;
  ttl: number;
  maxTtl: number;
  particles: { dx: number; dy: number; life: number }[];
}

export interface KillFeedEntry {
  killer: string;
  killerFaction: Faction;
  victim: string;
  victimFaction: Faction;
  ttl: number;
}

export interface Planet {
  id: number;
  name: string;
  pos: Vec2;
  owner: Faction | null;
  armies: number;
  maxArmies: number;
  regenTimer: number; // frames until next army spawn
}

export interface PlayerScore {
  kills: number;
  deaths: number;
  planetsTaken: number;
  armiesBombed: number;
}

export type GamePhase = 'menu' | 'playing' | 'respawning';

export interface GameState {
  phase: GamePhase;
  tick: number;
  player: Ship;
  ships: Ship[];
  torpedoes: Torpedo[];
  phasers: Phaser[];
  explosions: Explosion[];
  killFeed: KillFeedEntry[];
  planets: Planet[];
  galaxy: { width: number; height: number };
  camera: Vec2;
  showMap: boolean;
  selectedFaction: Faction;
  selectedClass: ShipClass;
}

export const FACTION_COLORS: Record<Faction, string> = {
  federation: '#00ccff',
  klingon: '#ff3333',
  romulan: '#33ff33',
  orion: '#ffaa00',
};

export const FACTION_NAMES: Record<Faction, string> = {
  federation: 'Federation',
  klingon: 'Klingon Empire',
  romulan: 'Romulan Star Empire',
  orion: 'Orion Syndicate',
};

export const CLASS_NAMES: Record<ShipClass, string> = {
  scout: 'Scout',
  destroyer: 'Destroyer',
  cruiser: 'Cruiser',
  battleship: 'Battleship',
};

export const TORPEDO_SPEED = 16;
export const TORPEDO_FUSE = 60;
export const GALAXY_SIZE = 10000;
export const RESPAWN_TIME = 300; // 5 seconds at 60fps
export const ORBIT_RANGE = 60;
export const BOMB_INTERVAL = 30; // frames between bombs while orbiting
export const PLANET_ARMY_REGEN = 600; // frames between army regen
