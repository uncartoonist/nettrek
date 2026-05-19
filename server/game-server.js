// Authoritative game server — manages all players + AI + world state

const GALAXY_SIZE = 10000;
const TORPEDO_SPEED = 16;
const TORPEDO_FUSE = 60;
const RESPAWN_TIME = 100; // 5s at 20 ticks/sec
const ORBIT_RANGE = 60;
const PLANET_ARMY_REGEN = 200;

const SHIP_CLASS_STATS = {
  scout:      { maxSpeed: 14, turnRate: 0.07, maxShields: 75,  maxHull: 60,  maxEnergy: 6000,  torpDamage: 25, phaserDamage: 30, torpCost: 150, phaserCost: 350, phaserRange: 200, maxArmies: 2,  regenRate: 12 },
  destroyer:  { maxSpeed: 10, turnRate: 0.05, maxShields: 100, maxHull: 100, maxEnergy: 8000,  torpDamage: 35, phaserDamage: 40, torpCost: 200, phaserCost: 500, phaserRange: 250, maxArmies: 5,  regenRate: 10 },
  cruiser:    { maxSpeed: 8,  turnRate: 0.04, maxShields: 130, maxHull: 130, maxEnergy: 10000, torpDamage: 45, phaserDamage: 50, torpCost: 250, phaserCost: 600, phaserRange: 300, maxArmies: 8,  regenRate: 8 },
  battleship: { maxSpeed: 6,  turnRate: 0.03, maxShields: 180, maxHull: 180, maxEnergy: 14000, torpDamage: 60, phaserDamage: 65, torpCost: 300, phaserCost: 750, phaserRange: 350, maxArmies: 12, regenRate: 6 },
};

const FACTIONS = ['federation', 'klingon', 'romulan', 'orion'];
const PLANET_NAMES = [
  'Earth', 'Kronos', 'Romulus', 'Orion Prime', 'Altair IV',
  'Rigel VII', 'Deneb IV', 'Canopus III', 'Arcturus', 'Sirius B',
  'Vega', 'Antares', 'Wolf 359', 'Tau Ceti', 'Barnard',
  'Pollux', 'Capella', 'Aldebaran', 'Betelgeuse', 'Procyon',
];

let nextId = 1;
let nextTorpId = 1;

export class GameServer {
  constructor() {
    this.players = new Map(); // id -> { ws, ship, input, lastPing }
    this.ships = [];          // all ships (players + AI)
    this.torpedoes = [];
    this.phasers = [];
    this.explosions = [];
    this.killFeed = [];
    this.planets = this.createPlanets();
    this.tickCount = 0;
    this.chat = [];

    // Spawn AI bots
    for (let i = 0; i < 4; i++) {
      this.ships.push(this.createAIShip());
    }
  }

  get playerCount() { return this.players.size; }

  createPlanets() {
    return PLANET_NAMES.map((name, i) => ({
      id: i, name,
      pos: { x: 500 + Math.random() * (GALAXY_SIZE - 1000), y: 500 + Math.random() * (GALAXY_SIZE - 1000) },
      owner: i < 4 ? FACTIONS[i] : (Math.random() < 0.5 ? FACTIONS[i % 4] : null),
      armies: 4 + Math.floor(Math.random() * 8),
      maxArmies: 15,
      regenTimer: Math.floor(Math.random() * PLANET_ARMY_REGEN),
    }));
  }

  createAIShip() {
    const id = nextId++;
    const faction = FACTIONS[id % 4];
    const classes = ['scout', 'destroyer', 'cruiser', 'battleship'];
    const shipClass = classes[Math.floor(Math.random() * 4)];
    const stats = SHIP_CLASS_STATS[shipClass];
    return {
      id, name: `Bot-${id}`, faction, shipClass, isAI: true,
      pos: { x: 1000 + Math.random() * (GALAXY_SIZE - 2000), y: 1000 + Math.random() * (GALAXY_SIZE - 2000) },
      vel: { x: 0, y: 0 }, heading: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 3,
      shields: stats.maxShields, hull: stats.maxHull, energy: stats.maxEnergy,
      cloaked: false, alive: true, armies: 0, orbiting: -1, respawnTimer: 0,
      kills: 0, deaths: 0, planetsTaken: 0, armiesBombed: 0,
    };
  }

  addPlayer(ws) {
    const id = nextId++;
    const ship = {
      id, name: `Pilot-${id}`, faction: 'federation', shipClass: 'destroyer', isAI: false,
      pos: { x: GALAXY_SIZE / 2, y: GALAXY_SIZE / 2 },
      vel: { x: 0, y: 0 }, heading: 0, speed: 0,
      shields: 100, hull: 100, energy: 8000,
      cloaked: false, alive: false, armies: 0, orbiting: -1, respawnTimer: 0,
      kills: 0, deaths: 0, planetsTaken: 0, armiesBombed: 0,
    };
    this.ships.push(ship);
    this.players.set(id, { ws, ship, input: {}, lastPing: Date.now() });

    // Send initial state
    this.send(ws, { type: 'welcome', id, planets: this.planets });
    return id;
  }

  removePlayer(id) {
    const player = this.players.get(id);
    if (player) {
      this.ships = this.ships.filter(s => s.id !== id);
      this.players.delete(id);
    }
  }

  handleMessage(playerId, msg) {
    const player = this.players.get(playerId);
    if (!player) return;

    switch (msg.type) {
      case 'spawn': {
        // Validate every field before assigning to ship — previously a malformed
        // shipClass fell back to destroyer stats but the *string* shipClass was
        // stored as-is, then tick() did SHIP_CLASS_STATS[ship.shipClass] which
        // returned undefined, and stats.turnRate crashed the server.
        const validFaction = FACTIONS.includes(msg.faction) ? msg.faction : 'federation';
        const validShipClass = (typeof msg.shipClass === 'string' && SHIP_CLASS_STATS[msg.shipClass])
          ? msg.shipClass : 'destroyer';
        const rawName = typeof msg.name === 'string' ? msg.name : '';
        // Strip control chars + cap length; default to Pilot-{id} if empty
        const safeName = rawName.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 24).trim() || `Pilot-${playerId}`;
        const stats = SHIP_CLASS_STATS[validShipClass];
        const spawnPlanet = this.planets.find(p => p.owner === validFaction) || this.planets[0];
        const ship = player.ship;
        ship.name = safeName;
        ship.faction = validFaction;
        ship.shipClass = validShipClass;
        ship.pos = { x: spawnPlanet.pos.x + (Math.random() - 0.5) * 200, y: spawnPlanet.pos.y + (Math.random() - 0.5) * 200 };
        ship.shields = stats.maxShields;
        ship.hull = stats.maxHull;
        ship.energy = stats.maxEnergy;
        ship.speed = 0;
        ship.alive = true;
        ship.cloaked = false;
        ship.armies = 0;
        ship.respawnTimer = 0;
        break;
      }
      case 'input':
        player.input = msg.input || {};
        break;
      case 'chat': {
        const entry = { from: player.ship.name, faction: player.ship.faction, text: (msg.text || '').slice(0, 200), team: !!msg.team, ttl: 200 };
        this.chat.push(entry);
        if (this.chat.length > 50) this.chat.shift();
        // Broadcast chat immediately
        const chatMsg = { type: 'chat', ...entry };
        for (const [, p] of this.players) {
          if (!msg.team || p.ship.faction === player.ship.faction) {
            this.send(p.ws, chatMsg);
          }
        }
        break;
      }
      case 'ping':
        this.send(player.ws, { type: 'pong', t: msg.t });
        break;
    }
  }

  tick() {
    this.tickCount++;

    // Process player inputs
    for (const [, player] of this.players) {
      const ship = player.ship;
      if (!ship.alive) {
        if (ship.respawnTimer > 0) ship.respawnTimer--;
        continue;
      }
      const input = player.input;
      const stats = SHIP_CLASS_STATS[ship.shipClass];

      if (input.turnLeft) ship.heading -= stats.turnRate;
      if (input.turnRight) ship.heading += stats.turnRate;
      if (input.thrust) ship.speed = Math.min(ship.speed + 0.15, stats.maxSpeed);
      else if (input.brake) ship.speed = Math.max(ship.speed - 0.2, 0);
      else ship.speed *= 0.995;

      if (input.fireTorp && ship.energy >= stats.torpCost) {
        ship.energy -= stats.torpCost;
        this.torpedoes.push({
          id: nextTorpId++, owner: ship.id, faction: ship.faction,
          pos: { ...ship.pos },
          vel: { x: Math.cos(ship.heading) * TORPEDO_SPEED, y: Math.sin(ship.heading) * TORPEDO_SPEED },
          fuse: TORPEDO_FUSE, alive: true, damage: stats.torpDamage,
        });
        player.input.fireTorp = false;
      }
      if (input.firePhaser && ship.energy >= stats.phaserCost) {
        const target = this.findNearestEnemy(ship);
        if (target && this.dist(ship.pos, target.pos) <= stats.phaserRange) {
          ship.energy -= stats.phaserCost;
          this.applyDamage(target, stats.phaserDamage, ship);
          this.phasers.push({ owner: ship.id, faction: ship.faction, from: { ...ship.pos }, to: { ...target.pos }, ttl: 4, damage: stats.phaserDamage });
        }
        player.input.firePhaser = false;
      }
      if (input.cloak) { ship.cloaked = !ship.cloaked; player.input.cloak = false; }

      // Orbit + planet ops
      ship.orbiting = -1;
      if (ship.speed < 2) {
        for (const planet of this.planets) {
          if (this.dist(ship.pos, planet.pos) < ORBIT_RANGE) { ship.orbiting = planet.id; break; }
        }
      }
      if (input.bomb && ship.orbiting >= 0) {
        const planet = this.planets[ship.orbiting];
        if (planet.owner && planet.owner !== ship.faction && planet.armies > 0) {
          planet.armies--;
          ship.armiesBombed++;
          if (planet.armies <= 0) planet.owner = null;
        }
        player.input.bomb = false;
      }
      if (input.beamDown && ship.orbiting >= 0 && ship.armies > 0) {
        const planet = this.planets[ship.orbiting];
        if (!planet.owner || planet.owner === ship.faction) {
          ship.armies--; planet.armies++; planet.owner = ship.faction;
          if (planet.armies === 1) ship.planetsTaken++;
        }
        player.input.beamDown = false;
      }
      if (input.beamUp && ship.orbiting >= 0) {
        const planet = this.planets[ship.orbiting];
        if (planet.owner === ship.faction && planet.armies > 1 && ship.armies < stats.maxArmies) {
          planet.armies--; ship.armies++;
        }
        player.input.beamUp = false;
      }
    }

    // Update all ships (movement)
    for (const ship of this.ships) {
      if (!ship.alive) continue;
      const stats = SHIP_CLASS_STATS[ship.shipClass];
      ship.vel = { x: Math.cos(ship.heading) * ship.speed, y: Math.sin(ship.heading) * ship.speed };
      ship.pos.x += ship.vel.x;
      ship.pos.y += ship.vel.y;
      if (ship.pos.x < 0) ship.pos.x += GALAXY_SIZE;
      if (ship.pos.x > GALAXY_SIZE) ship.pos.x -= GALAXY_SIZE;
      if (ship.pos.y < 0) ship.pos.y += GALAXY_SIZE;
      if (ship.pos.y > GALAXY_SIZE) ship.pos.y -= GALAXY_SIZE;
      if (ship.energy < stats.maxEnergy) ship.energy = Math.min(stats.maxEnergy, ship.energy + (ship.cloaked ? 1 : stats.regenRate));
    }

    // AI
    for (const ship of this.ships) {
      if (!ship.isAI || !ship.alive) continue;
      this.updateAI(ship);
    }

    // Torpedoes
    for (const torp of this.torpedoes) {
      if (!torp.alive) continue;
      torp.pos.x += torp.vel.x;
      torp.pos.y += torp.vel.y;
      torp.fuse--;
      if (torp.fuse <= 0) { torp.alive = false; continue; }
      for (const ship of this.ships) {
        if (!ship.alive || ship.id === torp.owner || ship.faction === torp.faction) continue;
        if (this.dist(torp.pos, ship.pos) < 30) {
          torp.alive = false;
          const attacker = this.ships.find(s => s.id === torp.owner);
          this.applyDamage(ship, torp.damage, attacker);
          break;
        }
      }
    }
    this.torpedoes = this.torpedoes.filter(t => t.alive);

    // Phasers decay
    for (const ph of this.phasers) ph.ttl--;
    this.phasers = this.phasers.filter(ph => ph.ttl > 0);

    // Explosions decay
    for (const e of this.explosions) e.ttl--;
    this.explosions = this.explosions.filter(e => e.ttl > 0);

    // Kill feed decay
    for (const e of this.killFeed) e.ttl--;
    this.killFeed = this.killFeed.filter(e => e.ttl > 0);

    // Planet regen
    for (const planet of this.planets) {
      if (planet.owner && planet.armies < planet.maxArmies) {
        planet.regenTimer--;
        if (planet.regenTimer <= 0) { planet.armies++; planet.regenTimer = PLANET_ARMY_REGEN; }
      }
    }

    // AI respawn
    for (const ship of this.ships) {
      if (!ship.alive && ship.isAI) {
        ship.respawnTimer--;
        if (ship.respawnTimer <= 0) {
          const stats = SHIP_CLASS_STATS[ship.shipClass];
          const sp = this.planets.find(p => p.owner === ship.faction) || this.planets[0];
          ship.pos = { x: sp.pos.x + (Math.random() - 0.5) * 200, y: sp.pos.y + (Math.random() - 0.5) * 200 };
          ship.shields = stats.maxShields; ship.hull = stats.maxHull; ship.energy = stats.maxEnergy;
          ship.speed = 0; ship.alive = true; ship.cloaked = false; ship.armies = 0;
        }
      }
    }
  }

  broadcast() {
    const state = {
      type: 'state',
      tick: this.tickCount,
      ships: this.ships.map(s => ({
        id: s.id, name: s.name, faction: s.faction, shipClass: s.shipClass,
        x: Math.round(s.pos.x), y: Math.round(s.pos.y),
        heading: +s.heading.toFixed(3), speed: +s.speed.toFixed(1),
        shields: Math.round(s.shields), hull: Math.round(s.hull),
        energy: Math.round(s.energy), cloaked: s.cloaked, alive: s.alive,
        armies: s.armies, orbiting: s.orbiting,
        kills: s.kills, deaths: s.deaths, planetsTaken: s.planetsTaken,
      })),
      torpedoes: this.torpedoes.map(t => ({
        id: t.id, faction: t.faction,
        x: Math.round(t.pos.x), y: Math.round(t.pos.y),
        vx: +t.vel.x.toFixed(1), vy: +t.vel.y.toFixed(1),
      })),
      phasers: this.phasers.map(p => ({
        faction: p.faction, fx: Math.round(p.from.x), fy: Math.round(p.from.y),
        tx: Math.round(p.to.x), ty: Math.round(p.to.y), ttl: p.ttl,
      })),
      explosions: this.explosions.map(e => ({ x: Math.round(e.pos.x), y: Math.round(e.pos.y), ttl: e.ttl })),
      killFeed: this.killFeed.slice(0, 5),
      planets: this.planets.map(p => ({ id: p.id, owner: p.owner, armies: p.armies })),
    };

    const msg = JSON.stringify(state);
    for (const [, player] of this.players) {
      if (player.ws.readyState === 1) player.ws.send(msg);
    }
  }

  applyDamage(target, damage, attacker) {
    target.shields -= damage;
    if (target.shields < 0) { target.hull += target.shields; target.shields = 0; }
    if (target.hull <= 0) {
      target.alive = false;
      target.deaths++;
      target.respawnTimer = RESPAWN_TIME;
      target.armies = 0;
      if (attacker) attacker.kills++;
      this.explosions.push({ pos: { ...target.pos }, ttl: 15 });
      this.killFeed.push({
        killer: attacker?.name || 'Unknown', killerFaction: attacker?.faction || 'federation',
        victim: target.name, victimFaction: target.faction, ttl: 100,
      });
    }
  }

  updateAI(ship) {
    const stats = SHIP_CLASS_STATS[ship.shipClass];
    const nearest = this.findNearestEnemy(ship);
    if (nearest && this.dist(ship.pos, nearest.pos) < 500) {
      const angle = Math.atan2(nearest.pos.y - ship.pos.y, nearest.pos.x - ship.pos.x);
      const diff = this.angleDiff(ship.heading, angle);
      ship.heading += Math.sign(diff) * Math.min(Math.abs(diff), stats.turnRate);
      ship.speed = Math.min(ship.speed + 0.1, stats.maxSpeed * 0.7);
      if (this.tickCount % 8 === ship.id % 8 && ship.energy >= stats.torpCost && this.dist(ship.pos, nearest.pos) < 350) {
        ship.energy -= stats.torpCost;
        this.torpedoes.push({
          id: nextTorpId++, owner: ship.id, faction: ship.faction, pos: { ...ship.pos },
          vel: { x: Math.cos(ship.heading) * TORPEDO_SPEED, y: Math.sin(ship.heading) * TORPEDO_SPEED },
          fuse: TORPEDO_FUSE, alive: true, damage: stats.torpDamage,
        });
      }
      if (this.tickCount % 12 === (ship.id * 3) % 12 && ship.energy >= stats.phaserCost && this.dist(ship.pos, nearest.pos) < stats.phaserRange) {
        ship.energy -= stats.phaserCost;
        this.applyDamage(nearest, stats.phaserDamage, ship);
        this.phasers.push({ owner: ship.id, faction: ship.faction, from: { ...ship.pos }, to: { ...nearest.pos }, ttl: 4, damage: stats.phaserDamage });
      }
    } else {
      if (this.tickCount % 60 === (ship.id * 7) % 60) {
        const target = this.planets.find(p => p.owner !== ship.faction) || this.planets[ship.id % this.planets.length];
        ship.heading = Math.atan2(target.pos.y - ship.pos.y, target.pos.x - ship.pos.x);
      }
      ship.speed = Math.max(ship.speed * 0.99, stats.maxSpeed * 0.4);
      if (this.tickCount % 30 === (ship.id * 11) % 30) ship.heading += (Math.random() - 0.5) * 0.4;
    }
  }

  findNearestEnemy(ship) {
    let best = null, bestDist = Infinity;
    for (const other of this.ships) {
      if (other.id === ship.id || !other.alive || other.faction === ship.faction || other.cloaked) continue;
      const d = this.dist(ship.pos, other.pos);
      if (d < bestDist) { bestDist = d; best = other; }
    }
    return best;
  }

  dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }
  angleDiff(from, to) { let d = to - from; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }
  send(ws, msg) { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); }
}
