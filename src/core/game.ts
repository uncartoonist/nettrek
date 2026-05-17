import {
  GameState, Ship, Torpedo, Phaser, Planet, Explosion, KillFeedEntry,
  Faction, ShipClass, Vec2,
  SHIP_CLASS_STATS, TORPEDO_SPEED, TORPEDO_FUSE, GALAXY_SIZE,
  RESPAWN_TIME, ORBIT_RANGE, BOMB_INTERVAL, PLANET_ARMY_REGEN,
  FACTION_COLORS,
} from './types';

const PLANET_NAMES = [
  'Earth', 'Kronos', 'Romulus', 'Orion Prime', 'Altair IV',
  'Rigel VII', 'Deneb IV', 'Canopus III', 'Arcturus', 'Sirius B',
  'Vega', 'Antares', 'Wolf 359', 'Tau Ceti', 'Barnard',
  'Pollux', 'Capella', 'Aldebaran', 'Betelgeuse', 'Procyon',
];

const FACTIONS: Faction[] = ['federation', 'klingon', 'romulan', 'orion'];
const SHIP_CLASSES: ShipClass[] = ['scout', 'destroyer', 'cruiser', 'battleship'];
const AI_NAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'];

let nextTorpId = 0;

function createShip(id: number, name: string, faction: Faction, shipClass: ShipClass, pos: Vec2): Ship {
  const stats = SHIP_CLASS_STATS[shipClass];
  return {
    id, name, faction, shipClass, pos,
    vel: { x: 0, y: 0 },
    heading: Math.random() * Math.PI * 2,
    speed: 0,
    shields: stats.maxShields,
    hull: stats.maxHull,
    energy: stats.maxEnergy,
    cloaked: false,
    alive: true,
    armies: 0,
    orbiting: -1,
    respawnTimer: 0,
    kills: 0, deaths: 0, planetsTaken: 0, armiesBombed: 0,
  };
}

export function createInitialState(): GameState {
  const planets: Planet[] = PLANET_NAMES.map((name, i) => ({
    id: i,
    name,
    pos: {
      x: 500 + Math.random() * (GALAXY_SIZE - 1000),
      y: 500 + Math.random() * (GALAXY_SIZE - 1000),
    },
    owner: i < 4 ? FACTIONS[i] : (Math.random() < 0.5 ? FACTIONS[i % 4] : null),
    armies: 4 + Math.floor(Math.random() * 8),
    maxArmies: 15,
    regenTimer: Math.floor(Math.random() * PLANET_ARMY_REGEN),
  }));

  const player = createShip(0, 'Player', 'federation', 'destroyer', { x: GALAXY_SIZE / 2, y: GALAXY_SIZE / 2 });

  // AI ships
  const ships: Ship[] = [player];
  for (let i = 1; i <= 8; i++) {
    const faction = FACTIONS[i % 4];
    const shipClass = SHIP_CLASSES[Math.floor(Math.random() * 4)];
    ships.push(createShip(
      i, AI_NAMES[i - 1], faction, shipClass,
      { x: 1000 + Math.random() * (GALAXY_SIZE - 2000), y: 1000 + Math.random() * (GALAXY_SIZE - 2000) },
    ));
  }

  return {
    phase: 'menu',
    tick: 0,
    player,
    ships,
    torpedoes: [],
    phasers: [],
    explosions: [],
    killFeed: [],
    planets,
    galaxy: { width: GALAXY_SIZE, height: GALAXY_SIZE },
    camera: { x: player.pos.x, y: player.pos.y },
    showMap: false,
    selectedFaction: 'federation',
    selectedClass: 'destroyer',
  };
}

export function startGame(state: GameState): void {
  const stats = SHIP_CLASS_STATS[state.selectedClass];
  const spawnPlanet = state.planets.find(p => p.owner === state.selectedFaction) || state.planets[0];
  const p = state.player;
  p.faction = state.selectedFaction;
  p.shipClass = state.selectedClass;
  p.pos = { x: spawnPlanet.pos.x + 100, y: spawnPlanet.pos.y + 100 };
  p.shields = stats.maxShields;
  p.hull = stats.maxHull;
  p.energy = stats.maxEnergy;
  p.speed = 0;
  p.alive = true;
  p.cloaked = false;
  p.armies = 0;
  p.orbiting = -1;
  p.respawnTimer = 0;
  state.phase = 'playing';
  state.camera = { ...p.pos };
}

export function respawnPlayer(state: GameState): void {
  const stats = SHIP_CLASS_STATS[state.player.shipClass];
  const spawnPlanet = state.planets.find(p => p.owner === state.player.faction) || state.planets[0];
  const p = state.player;
  p.pos = { x: spawnPlanet.pos.x + (Math.random() - 0.5) * 200, y: spawnPlanet.pos.y + (Math.random() - 0.5) * 200 };
  p.shields = stats.maxShields;
  p.hull = stats.maxHull;
  p.energy = stats.maxEnergy;
  p.speed = 0;
  p.alive = true;
  p.cloaked = false;
  p.armies = 0;
  p.orbiting = -1;
  p.respawnTimer = 0;
  state.phase = 'playing';
}

export interface InputState {
  thrust: boolean;
  brake: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  fireTorp: boolean;
  firePhaser: boolean;
  cloakPressed: boolean;
  mapToggle: boolean;
  bombKey: boolean;
  beamDownKey: boolean;
  beamUpKey: boolean;
}

export function createInput(): InputState {
  return {
    thrust: false, brake: false,
    turnLeft: false, turnRight: false,
    fireTorp: false, firePhaser: false,
    cloakPressed: false, mapToggle: false,
    bombKey: false, beamDownKey: false, beamUpKey: false,
  };
}

export interface GameEvents {
  torpFired?: boolean;
  phaserFired?: boolean;
  explosion?: Vec2;
  shieldHit?: boolean;
  cloakToggle?: boolean;
}

export function updateGame(state: GameState, input: InputState): GameEvents {
  const events: GameEvents = {};
  if (state.phase === 'menu') return events;

  state.tick++;

  const p = state.player;

  // Handle respawn
  if (state.phase === 'respawning') {
    p.respawnTimer--;
    if (p.respawnTimer <= 0) {
      respawnPlayer(state);
    }
    // Still update world while dead
    updateWorld(state, events);
    state.camera.x += (p.pos.x - state.camera.x) * 0.08;
    state.camera.y += (p.pos.y - state.camera.y) * 0.08;
    return events;
  }

  // Player input
  if (p.alive) {
    const stats = SHIP_CLASS_STATS[p.shipClass];

    // Turning
    if (input.turnLeft) p.heading -= stats.turnRate;
    if (input.turnRight) p.heading += stats.turnRate;

    // Thrust
    if (input.thrust && p.speed < stats.maxSpeed) {
      p.speed = Math.min(p.speed + 0.15, stats.maxSpeed);
    } else if (input.brake) {
      p.speed = Math.max(p.speed - 0.2, 0);
    } else {
      p.speed *= 0.995;
    }

    // Cloak toggle
    if (input.cloakPressed) {
      p.cloaked = !p.cloaked;
      events.cloakToggle = true;
      input.cloakPressed = false;
    }

    // Fire torpedo
    if (input.fireTorp && p.energy >= stats.torpCost) {
      p.energy -= stats.torpCost;
      state.torpedoes.push({
        id: nextTorpId++,
        owner: p.id,
        faction: p.faction,
        pos: { ...p.pos },
        vel: {
          x: Math.cos(p.heading) * TORPEDO_SPEED + p.vel.x * 0.3,
          y: Math.sin(p.heading) * TORPEDO_SPEED + p.vel.y * 0.3,
        },
        fuse: TORPEDO_FUSE,
        alive: true,
        damage: stats.torpDamage,
      });
      events.torpFired = true;
      input.fireTorp = false;
    }

    // Fire phaser
    if (input.firePhaser && p.energy >= stats.phaserCost) {
      const target = findNearestEnemy(state, p);
      if (target && dist(p.pos, target.pos) <= stats.phaserRange) {
        p.energy -= stats.phaserCost;
        applyDamage(state, target, stats.phaserDamage, p, events);
        state.phasers.push({
          owner: p.id,
          faction: p.faction,
          from: { ...p.pos },
          to: { ...target.pos },
          ttl: 12,
          damage: stats.phaserDamage,
        });
        events.phaserFired = true;
      }
      input.firePhaser = false;
    }

    // Orbit detection
    p.orbiting = -1;
    if (p.speed < 2) {
      for (const planet of state.planets) {
        if (dist(p.pos, planet.pos) < ORBIT_RANGE) {
          p.orbiting = planet.id;
          break;
        }
      }
    }

    // Bomb planet
    if (input.bombKey && p.orbiting >= 0) {
      const planet = state.planets[p.orbiting];
      if (planet.owner !== null && planet.owner !== p.faction && planet.armies > 0) {
        if (state.tick % BOMB_INTERVAL === 0) {
          planet.armies--;
          p.armiesBombed++;
          if (planet.armies <= 0) {
            planet.owner = null;
          }
        }
      }
      input.bombKey = false;
    }

    // Beam down armies to take planet
    if (input.beamDownKey && p.orbiting >= 0 && p.armies > 0) {
      const planet = state.planets[p.orbiting];
      if (planet.owner === null || planet.owner === p.faction) {
        p.armies--;
        planet.armies++;
        planet.owner = p.faction;
        if (planet.armies === 1 && planet.owner === p.faction) {
          p.planetsTaken++;
        }
      }
      input.beamDownKey = false;
    }

    // Beam up armies from friendly planet
    if (input.beamUpKey && p.orbiting >= 0) {
      const planet = state.planets[p.orbiting];
      const stats2 = SHIP_CLASS_STATS[p.shipClass];
      if (planet.owner === p.faction && planet.armies > 1 && p.armies < stats2.maxArmies) {
        planet.armies--;
        p.armies++;
      }
      input.beamUpKey = false;
    }

    // Map toggle
    if (input.mapToggle) {
      state.showMap = !state.showMap;
      input.mapToggle = false;
    }
  }

  updateWorld(state, events);

  // Camera follows player
  state.camera.x += (p.pos.x - state.camera.x) * 0.08;
  state.camera.y += (p.pos.y - state.camera.y) * 0.08;

  return events;
}

function updateWorld(state: GameState, events: GameEvents): void {
  // Update all ships
  for (const ship of state.ships) {
    if (!ship.alive) continue;
    const stats = SHIP_CLASS_STATS[ship.shipClass];
    ship.vel.x = Math.cos(ship.heading) * ship.speed;
    ship.vel.y = Math.sin(ship.heading) * ship.speed;
    ship.pos.x += ship.vel.x;
    ship.pos.y += ship.vel.y;

    // Wrap
    if (ship.pos.x < 0) ship.pos.x += GALAXY_SIZE;
    if (ship.pos.x > GALAXY_SIZE) ship.pos.x -= GALAXY_SIZE;
    if (ship.pos.y < 0) ship.pos.y += GALAXY_SIZE;
    if (ship.pos.y > GALAXY_SIZE) ship.pos.y -= GALAXY_SIZE;

    // Energy regen
    if (ship.energy < stats.maxEnergy) {
      ship.energy = Math.min(stats.maxEnergy, ship.energy + (ship.cloaked ? 2 : stats.regenRate));
    }
  }

  // AI behavior
  for (const ship of state.ships) {
    if (ship.id === 0 || !ship.alive) continue;
    updateAI(state, ship);
  }

  // Update torpedoes
  for (const torp of state.torpedoes) {
    if (!torp.alive) continue;
    torp.pos.x += torp.vel.x;
    torp.pos.y += torp.vel.y;
    torp.fuse--;
    if (torp.fuse <= 0) { torp.alive = false; continue; }

    for (const ship of state.ships) {
      if (!ship.alive || ship.id === torp.owner || ship.faction === torp.faction) continue;
      if (dist(torp.pos, ship.pos) < 30) {
        torp.alive = false;
        const attacker = state.ships.find(s => s.id === torp.owner) || null;
        applyDamage(state, ship, torp.damage, attacker, events);
        break;
      }
    }
  }

  state.torpedoes = state.torpedoes.filter(t => t.alive);

  // Update phasers
  for (const ph of state.phasers) ph.ttl--;
  state.phasers = state.phasers.filter(ph => ph.ttl > 0);

  // Update explosions
  for (const exp of state.explosions) {
    exp.ttl--;
    for (const p of exp.particles) p.life--;
  }
  state.explosions = state.explosions.filter(e => e.ttl > 0);

  // Update kill feed
  for (const entry of state.killFeed) entry.ttl--;
  state.killFeed = state.killFeed.filter(e => e.ttl > 0);

  // Planet army regen
  for (const planet of state.planets) {
    if (planet.owner && planet.armies < planet.maxArmies) {
      planet.regenTimer--;
      if (planet.regenTimer <= 0) {
        planet.armies++;
        planet.regenTimer = PLANET_ARMY_REGEN;
      }
    }
  }

  // AI respawn
  for (const ship of state.ships) {
    if (ship.id === 0) continue;
    if (!ship.alive) {
      ship.respawnTimer--;
      if (ship.respawnTimer <= 0) {
        const stats = SHIP_CLASS_STATS[ship.shipClass];
        const spawnPlanet = state.planets.find(p => p.owner === ship.faction) || state.planets[Math.floor(Math.random() * state.planets.length)];
        ship.pos = { x: spawnPlanet.pos.x + (Math.random() - 0.5) * 200, y: spawnPlanet.pos.y + (Math.random() - 0.5) * 200 };
        ship.shields = stats.maxShields;
        ship.hull = stats.maxHull;
        ship.energy = stats.maxEnergy;
        ship.speed = 0;
        ship.alive = true;
        ship.cloaked = false;
        ship.armies = 0;
        ship.orbiting = -1;
      }
    }
  }
}

function applyDamage(state: GameState, target: Ship, damage: number, attacker: Ship | null, events: GameEvents): void {
  target.shields -= damage;
  events.shieldHit = true;
  if (target.shields < 0) {
    target.hull += target.shields;
    target.shields = 0;
  }
  if (target.hull <= 0) {
    killShip(state, target, attacker);
    events.explosion = { ...target.pos };
  }
}

function killShip(state: GameState, target: Ship, killer: Ship | null): void {
  target.alive = false;
  target.deaths++;
  target.respawnTimer = RESPAWN_TIME;
  target.armies = 0;

  if (killer) {
    killer.kills++;
  }

  // Explosion
  const particles: { dx: number; dy: number; life: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({ dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, life: 20 + Math.random() * 30 });
  }
  state.explosions.push({ pos: { ...target.pos }, ttl: 50, maxTtl: 50, particles });

  // Kill feed
  state.killFeed.push({
    killer: killer?.name || 'Unknown',
    killerFaction: killer?.faction || 'federation',
    victim: target.name,
    victimFaction: target.faction,
    ttl: 300, // 5 seconds
  });

  // If player died
  if (target.id === 0) {
    state.phase = 'respawning';
  }
}

function updateAI(state: GameState, ship: Ship): void {
  const stats = SHIP_CLASS_STATS[ship.shipClass];
  const nearest = findNearestEnemy(state, ship);

  if (nearest && dist(ship.pos, nearest.pos) < 500) {
    // Attack mode
    const angle = Math.atan2(nearest.pos.y - ship.pos.y, nearest.pos.x - ship.pos.x);
    const diff = angleDiff(ship.heading, angle);
    ship.heading += Math.sign(diff) * Math.min(Math.abs(diff), stats.turnRate);
    ship.speed = Math.min(ship.speed + 0.1, stats.maxSpeed * 0.7);

    // Fire torpedo
    if (state.tick % 40 === ship.id % 40 && ship.energy >= stats.torpCost && dist(ship.pos, nearest.pos) < 400) {
      ship.energy -= stats.torpCost;
      state.torpedoes.push({
        id: nextTorpId++,
        owner: ship.id,
        faction: ship.faction,
        pos: { ...ship.pos },
        vel: {
          x: Math.cos(ship.heading) * TORPEDO_SPEED,
          y: Math.sin(ship.heading) * TORPEDO_SPEED,
        },
        fuse: TORPEDO_FUSE,
        alive: true,
        damage: stats.torpDamage,
      });
    }

    // Fire phaser at close range
    if (state.tick % 60 === (ship.id * 7) % 60 && ship.energy >= stats.phaserCost && dist(ship.pos, nearest.pos) < stats.phaserRange) {
      ship.energy -= stats.phaserCost;
      const dmg = stats.phaserDamage;
      applyDamage(state, nearest, dmg, ship, {});
      state.phasers.push({
        owner: ship.id, faction: ship.faction,
        from: { ...ship.pos }, to: { ...nearest.pos },
        ttl: 12, damage: dmg,
      });
    }
  } else {
    // Patrol: head toward a neutral or enemy planet
    if (state.tick % 300 === (ship.id * 37) % 300) {
      const target = state.planets.find(p => p.owner !== ship.faction && p.armies > 0)
        || state.planets[ship.id % state.planets.length];
      const angle = Math.atan2(target.pos.y - ship.pos.y, target.pos.x - ship.pos.x);
      ship.heading = angle;
    }
    ship.speed = Math.max(ship.speed * 0.99, stats.maxSpeed * 0.4);

    // Wander jitter
    if (state.tick % 90 === (ship.id * 13) % 90) {
      ship.heading += (Math.random() - 0.5) * 0.5;
    }
  }
}

function findNearestEnemy(state: GameState, ship: Ship): Ship | null {
  let best: Ship | null = null;
  let bestDist = Infinity;
  for (const other of state.ships) {
    if (other.id === ship.id || !other.alive || other.faction === ship.faction) continue;
    if (other.cloaked) continue;
    const d = dist(ship.pos, other.pos);
    if (d < bestDist) { bestDist = d; best = other; }
  }
  return best;
}

function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function angleDiff(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}
