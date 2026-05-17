import {
  ShmupState, PlayerShip, Enemy, Bullet, PowerUp, Particle, Obstacle, Outpost, TerrainSegment, Vec2,
  GamePhase, EnemyType, PowerUpType, Faction, OutpostType, TerrainType,
  PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT, SCROLL_SPEED, INVULN_TIME,
  FACTION_COLORS, ENEMY_STATS,
} from './types';
import { STAGES } from './stages';
import type { DirectorCommand } from './director';

let nextEnemyId = 1;

export function createShmupState(): ShmupState {
  return {
    phase: 'menu',
    tick: 0,
    scrollY: 0,
    scrollSpeed: SCROLL_SPEED,
    player: createPlayer(),
    enemies: [],
    obstacles: [],
    outposts: [],
    terrain: [],
    playerBullets: [],
    enemyBullets: [],
    powerUps: [],
    particles: [],
    currentStage: 0,
    stages: STAGES,
    upgrades: loadUpgrades(),
    score: 0,
    combo: 0,
    comboTimer: 0,
    upgradeFlash: '',
    upgradeFlashTimer: 0,
    bossActive: false,
    bossHp: 0,
    bossMaxHp: 0,
    beatPulse: 0,
    musicIntensity: 0,
    screenW: 0,
    screenH: 0,
    screenShake: 0,
    screenFlash: 0,
    screenFlashColor: '#ffffff',
    bossWarning: 0,
    bossEntrance: 0,
    damageVignette: 0,
    slowMotion: 0,
    grazeCount: 0,
    grazeFlash: 0,
    popups: [],
    deathCount: 0,
    dominanceScore: 0,
  };
}

function createPlayer(): PlayerShip {
  return {
    pos: { x: 0, y: 0 }, // set on stage start
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    alive: true,
    shields: 3,
    maxShields: 3,
    lives: 3,
    invulnTimer: 0,
    mainGunLevel: 1,
    wingGunLevel: 0,
    missileLevel: 0,
    laserLevel: 0,
    phaserLevel: 0,
    magnetActive: false,
    magnetTimer: 0,
    bombCount: 1,
    overdriveTimer: 0,
    droneActive: false,
    droneTimer: 0,
    scoreMultTimer: 0,
    stars: 0,
    totalStars: parseInt(localStorage.getItem('nettrek-stars') || '0'),
  };
}

function loadUpgrades(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem('nettrek-upgrades') || '{}');
  } catch { return {}; }
}

export function saveProgress(state: ShmupState): void {
  localStorage.setItem('nettrek-stars', String(state.player.totalStars));
  localStorage.setItem('nettrek-upgrades', JSON.stringify(state.upgrades));
}

export function startStage(state: ShmupState, stageIdx: number): void {
  state.currentStage = Math.max(0, Math.min(stageIdx, state.stages.length - 1));
  state.phase = 'playing';
  state.tick = 0;
  state.scrollY = 0;
  state.enemies = [];
  state.obstacles = [];
  state.outposts = [];
  state.terrain = [];
  state.playerBullets = [];
  state.enemyBullets = [];
  state.powerUps = [];
  state.particles = [];
  state.bossActive = false;
  state.combo = 0;
  state.comboTimer = 0;

  // Apply upgrades to player
  const p = state.player;
  p.alive = true;
  p.invulnTimer = INVULN_TIME;
  // Use window dimensions directly since screenW/H may not be set yet
  const sw = state.screenW || window.innerWidth;
  const sh = state.screenH || window.innerHeight;
  state.screenW = sw;
  state.screenH = sh;
  p.pos = { x: sw / 2, y: sh * 0.75 };
  p.mainGunLevel = 1 + (state.upgrades['mainGun'] || 0);
  p.wingGunLevel = state.upgrades['wingGun'] || 0;
  p.missileLevel = state.upgrades['missile'] || 0;
  p.laserLevel = state.upgrades['laser'] || 0;
  p.phaserLevel = state.upgrades['phaser'] || 0;
  p.shields = 1 + (state.upgrades['shield'] || 0);
  p.maxShields = p.shields;
  p.magnetActive = false;
  p.bombCount = 1 + (state.upgrades['bomb'] || 0);
}

export interface ShmupInput {
  moveX: number;  // -1 to 1
  moveY: number;  // -1 to 1
  fire: boolean;
  fireSpecial: boolean; // right-click / double-tap fires missiles, laser, phaser
  bomb: boolean;
}

export interface ShmupEvents {
  playerShot?: boolean;
  enemyHit?: boolean;
  enemyKilled?: Vec2;
  playerHit?: boolean;
  powerUpCollected?: PowerUpType;
  bossPhaseChange?: boolean;
  bossKilled?: boolean;
  bombUsed?: boolean;
  coinCollected?: boolean;
}

export function updateShmup(state: ShmupState, input: ShmupInput): ShmupEvents {
  const events: ShmupEvents = {};

  // Handle respawn countdown
  if (state.phase === 'respawning') {
    state.player.invulnTimer--;
    state.tick++;
    // Keep scrolling and updating enemies/particles during countdown
    state.scrollY += state.scrollSpeed;
    // Decay particles
    for (const p2 of state.particles) { p2.pos.x += p2.vel.x; p2.pos.y += p2.vel.y; p2.vel.x *= 0.96; p2.vel.y *= 0.96; p2.life--; }
    state.particles = state.particles.filter(p2 => p2.life > 0);
    if (state.particles.length > 500) state.particles = state.particles.slice(-500);
    // Decay enemy bullets
    for (const b of state.enemyBullets) { b.ttl--; }
    state.enemyBullets = state.enemyBullets.filter(b => b.ttl > 0);

    if (state.player.invulnTimer <= 0) {
      // Respawn!
      const p = state.player;
      p.alive = true;
      p.shields = 1;
      p.invulnTimer = INVULN_TIME * 2;
      p.pos = { x: state.screenW / 2, y: state.screenH * 0.75 };
      p.mainGunLevel = Math.max(1, p.mainGunLevel - 1);
      p.wingGunLevel = Math.max(0, p.wingGunLevel - 1);
      state.phase = state.bossActive ? 'boss' : 'playing';
    }
    return events;
  }

  if (state.phase !== 'playing' && state.phase !== 'boss') return events;

  state.tick++;
  state.scrollY += state.scrollSpeed;

  const p = state.player;
  const stage = state.stages[state.currentStage];
  if (!stage) return events;
  const W = state.screenW;
  const levelDuration = stage?.duration || 2100;
  const progress = Math.min(state.tick / levelDuration, 1);
  const H = state.screenH;

  // ── Player movement ──────────────────────────────────────
  if (p.alive) {
    p.pos.x += input.moveX * PLAYER_SPEED;
    p.pos.y += input.moveY * PLAYER_SPEED;
    // Clamp to screen
    p.pos.x = Math.max(p.width / 2, Math.min(W - p.width / 2, p.pos.x));
    p.pos.y = Math.max(p.height / 2, Math.min(H - p.height / 2, p.pos.y));

    if (p.invulnTimer > 0) p.invulnTimer--;

    // Engine trail particles (capped — only every 3rd frame)
    if (state.tick % 3 === 0 && state.particles.length < 400) {
      state.particles.push({
        pos: { x: p.pos.x + (Math.random()-0.5)*6, y: p.pos.y + p.height*0.5 },
        vel: { x: (Math.random()-0.5)*0.5, y: 1.5+Math.random() },
        life: 10+Math.random()*8, maxLife: 18,
        color: Math.random()>0.5 ? '#3366ff' : '#aaccff', size: 1+Math.random()*2,
      });
    }

    // ── Player firing ────────────────────────────────────────
    if (input.fire && state.tick % getFireRate(p) === 0) {
      firePlayerWeapons(state, p, input.fireSpecial);
      events.playerShot = true;
    }

    // ── Bomb ─────────────────────────────────────────────────
    if (input.bomb && p.bombCount > 0) {
      p.bombCount--;
      useBomb(state);
      events.bombUsed = true;
      input.bomb = false;
    }

    // Magnet timer
    if (p.magnetActive) {
      p.magnetTimer--;
      if (p.magnetTimer <= 0) p.magnetActive = false;
    }

    // Overdrive timer
    if (p.overdriveTimer > 0) p.overdriveTimer--;

    // Score multiplier timer
    if (p.scoreMultTimer > 0) p.scoreMultTimer--;

    // Drone — fires automatically at nearest enemy
    if (p.droneActive) {
      p.droneTimer--;
      if (p.droneTimer <= 0) p.droneActive = false;
      else if (state.tick % 12 === 0) {
        // Find nearest enemy
        let target: Enemy | null = null;
        let bestDist = Infinity;
        for (const e of state.enemies) {
          if (!e.alive) continue;
          const d = Math.abs(e.pos.x - p.pos.x) + Math.abs(e.pos.y - p.pos.y);
          if (d < bestDist) { bestDist = d; target = e; }
        }
        if (target) {
          const droneX = p.pos.x + Math.sin(state.tick * 0.08) * 30;
          const droneY = p.pos.y - 25;
          const angle = Math.atan2(target.pos.y - droneY, target.pos.x - droneX);
          state.playerBullets.push({
            pos: { x: droneX, y: droneY },
            vel: { x: Math.cos(angle) * 10, y: Math.sin(angle) * 10 },
            damage: 2, radius: 3, isPlayer: true, color: '#44ffaa', trail: true, ttl: 60, maxTtl: 60,
          });
        }
      }
    }
  }

  // ── Spawn waves ────────────────────────────────────────────
  if (!state.bossActive) {
    for (const wave of stage.waves) {
      if (state.tick === wave.time) {
        for (const we of wave.enemies) {
          spawnEnemy(state, we.type, we.faction, we.x * W, we.path, we.hp, we.dropType);
        }
      }
    }

    // ── Fleet encounter — at 60% through the level ──
    const fleetTick = Math.floor(stage.duration * 0.6);
    if (state.tick === fleetTick) {
      const faction = stage.faction;
      // Capital ship in center
      spawnEnemy(state, 'cruiser', faction, W * 0.5, undefined, undefined, 'shield');
      // Flanking cruiser (later stages)
      if (state.currentStage >= 2) {
        spawnEnemy(state, 'cruiser', faction, W * 0.25, undefined, undefined, 'weapon');
      }
      if (state.currentStage >= 4) {
        spawnEnemy(state, 'cruiser', faction, W * 0.75, undefined, undefined, 'missile');
      }
      // Fighter escort wings — pincer from sides
      for (let i = 0; i < 3 + state.currentStage; i++) {
        const side = i % 2 === 0 ? 0.05 + Math.random() * 0.15 : 0.8 + Math.random() * 0.15;
        spawnEnemy(state, 'fighter', faction, W * side);
      }
      // Elite escort (later stages)
      if (state.currentStage >= 3) {
        spawnEnemy(state, 'elite', faction, W * 0.35, undefined, undefined, 'phaser');
        spawnEnemy(state, 'elite', faction, W * 0.65, undefined, undefined, 'laser');
      }
    }

    // ── Secondary wave at 80% — last push before boss ──
    const pushTick = Math.floor(stage.duration * 0.85);
    if (state.tick === pushTick) {
      const faction = stage.faction;
      // Swarm of fighters
      for (let i = 0; i < 4 + state.currentStage; i++) {
        spawnEnemy(state, 'fighter', faction, W * (0.1 + Math.random() * 0.8));
      }
      // Bombers
      spawnEnemy(state, 'bomber', faction, W * 0.3, undefined, undefined, 'bomb');
      spawnEnemy(state, 'bomber', faction, W * 0.7, undefined, undefined, 'star');
    }

    // Check if it's boss time — trigger warning first
    if (state.tick >= stage.duration - 120 && state.bossWarning === 0 && !state.bossActive && stage.boss) {
      state.bossWarning = 120; // 2 seconds of WARNING
    }
    if (state.tick >= stage.duration && state.enemies.length === 0 && stage.boss) {
      spawnBoss(state, stage.boss);
      state.phase = 'boss';
      state.bossActive = true;
      state.bossEntrance = 120; // 2 second entrance cinematic
      state.screenShake = 8;
    }

    // ── Floating powerups — spawn naturally throughout the level ──
    // More frequent as level progresses (matching player's growing arsenal)
    const puInterval = Math.max(90, 200 - Math.floor(progress * 100));
    if (state.tick % puInterval === 0) {
      const roll = Math.random();
      let puType: PowerUpType;
      if (roll < 0.25) puType = 'weapon';
      else if (roll < 0.4) puType = 'missile';
      else if (roll < 0.52) puType = 'laser';
      else if (roll < 0.64) puType = 'phaser';
      else if (roll < 0.78) puType = 'shield';
      else if (roll < 0.9) puType = 'magnet';
      else puType = 'bomb';

      // Float in from a side or top with gentle drift
      const fromSide = Math.random() < 0.3;
      const px = fromSide
        ? (Math.random() < 0.5 ? -15 : W + 15)
        : 40 + Math.random() * (W - 80);
      const py = fromSide ? 50 + Math.random() * (H * 0.4) : -15;
      const vx = fromSide ? (px < 0 ? 1.2 : -1.2) : (Math.random() - 0.5) * 0.8;
      const vy = fromSide ? 0.3 + Math.random() * 0.5 : 0.8 + Math.random() * 0.5;

      state.powerUps.push({
        pos: { x: px, y: py },
        vel: { x: vx, y: vy },
        type: puType,
        value: 1,
        magnetizable: puType !== 'weapon' && puType !== 'missile' && puType !== 'laser',
      });
    }

    // ── Guaranteed shield drops — keep the player alive ──
    // Every ~8 seconds, spawn a shield if player is damaged
    // Every ~12 seconds unconditionally so players can always top off
    const shieldInterval = p.shields < p.maxShields ? 480 : 720;
    if (state.tick > 0 && state.tick % shieldInterval === 0) {
      state.powerUps.push({
        pos: { x: 40 + Math.random() * (W - 80), y: -15 },
        vel: { x: (Math.random() - 0.5) * 0.5, y: 0.7 + Math.random() * 0.3 },
        type: 'shield',
        value: 1,
        magnetizable: true,
      });
    }

    // ── Outpost spawning — islands of opportunity ──
    // Spawn every ~15-20 seconds, more on later stages
    const outpostInterval = Math.max(600, 1000 - state.currentStage * 60);
    if (state.tick > 120 && state.tick % outpostInterval === 0 && state.outposts.length < 2) {
      spawnOutpost(state, W);
    }
  }

  // ── Update outposts — hover to capture ─────────────────────
  for (const op of state.outposts) {
    op.pos.x += op.vel.x;
    op.pos.y += op.vel.y;
    op.rotation += 0.005;

    if (op.captured) continue;

    // Check if player is hovering over the outpost
    if (p.alive) {
      const dx = p.pos.x - op.pos.x;
      const dy = p.pos.y - op.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < op.radius + p.width * 0.5) {
        // Player is in range — fill capture progress
        op.captureProgress += 1 / op.captureTime;
        if (op.captureProgress >= 1) {
          // Captured! Drop all the loot
          op.captured = true;
          op.captureProgress = 1;
          state.screenFlash = 0.3;
          state.screenFlashColor = '#44ffaa';
          state.upgradeFlash = `${op.name} CAPTURED!`;
          state.upgradeFlashTimer = 90;
          // Burst the loot
          for (let i = 0; i < op.lootTable.length; i++) {
            const angle = (Math.PI * 2 / op.lootTable.length) * i - Math.PI / 2;
            state.powerUps.push({
              pos: { x: op.pos.x + Math.cos(angle) * 20, y: op.pos.y + Math.sin(angle) * 20 },
              vel: { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 },
              type: op.lootTable[i],
              value: op.lootTable[i] === 'star' ? 3 : 1,
              magnetizable: true,
            });
          }
          // Celebration particles
          for (let i = 0; i < 25; i++) {
            const a = Math.random() * Math.PI * 2;
            state.particles.push({
              pos: { ...op.pos },
              vel: { x: Math.cos(a) * 3, y: Math.sin(a) * 3 },
              life: 30, maxLife: 30,
              color: '#44ffaa', size: 2 + Math.random() * 3,
            });
          }
          state.score += 500;
        }
      } else {
        // Not hovering — slowly decay progress
        op.captureProgress = Math.max(0, op.captureProgress - 0.003);
      }
    }
  }
  state.outposts = state.outposts.filter(op => op.pos.y < H + 80);

  // ── Terrain formations — natural obstacles to fly through ──
  if (!state.bossActive) {
    // Spawn terrain segments based on stage progress
    const terrainChance = 0.001 + progress * 0.002;
    if (Math.random() < terrainChance && state.terrain.length < 2) {
      spawnTerrain(state, W, H);
    }
  }

  // Update terrain
  for (const seg of state.terrain) {
    seg.pos.y += seg.vel.y;
    seg.life--;
    // Slow horizontal drift
    seg.gapX += seg.vel.x * 0.001;
    seg.gapX = Math.max(0.2, Math.min(0.8, seg.gapX));
  }
  state.terrain = state.terrain.filter(seg => seg.life > 0 && seg.pos.y < H + 100);

  // Terrain collision — player takes damage if touching walls
  if (p.alive && p.invulnTimer <= 0) {
    for (const seg of state.terrain) {
      if (!seg.damaging) continue;
      const dy = Math.abs(p.pos.y - seg.pos.y);
      if (dy < seg.height / 2 + p.height / 2) {
        // Player is at terrain height — check if outside the gap
        const gapCenter = seg.gapX * W;
        const gapHalf = seg.width / 2;
        const dx = Math.abs(p.pos.x - gapCenter);
        if (dx > gapHalf - p.width * 0.3) {
          // Player hit the wall!
          hitPlayer(state, events);
          break;
        }
      }
    }
  }

  // ── Update enemies ─────────────────────────────────────────
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    updateEnemy(state, enemy, W, H);

    // Enemy firing
    enemy.fireTimer--;
    if (enemy.fireTimer <= 0 && p.alive) {
      fireEnemyWeapon(state, enemy, p.pos);
      enemy.fireTimer = enemy.fireCooldown;
    }
  }
  state.enemies = state.enemies.filter(e => e.alive || e.pos.y < H + 100);

  // ── Update player bullets ──────────────────────────────────
  for (const bullet of state.playerBullets) {
    bullet.pos.x += bullet.vel.x;
    bullet.pos.y += bullet.vel.y;
    bullet.ttl--;
  }
  state.playerBullets = state.playerBullets.filter(b => b.ttl > 0 && b.pos.y > -20 && b.pos.y < H + 20);

  // ── Update enemy bullets ───────────────────────────────────
  for (const bullet of state.enemyBullets) {
    bullet.pos.x += bullet.vel.x;
    bullet.pos.y += bullet.vel.y;
    bullet.ttl--;
  }
  state.enemyBullets = state.enemyBullets.filter(b => b.ttl > 0);

  // ── Collision: player bullets vs enemies ───────────────────
  handleBossWeakPointHits(state, events);
  for (const bullet of state.playerBullets) {
    if (bullet.ttl <= 0) continue;
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      if (hitTest(bullet.pos, bullet.radius, enemy.pos, enemy.width / 2)) {
        enemy.hp -= bullet.damage;
        bullet.pos.y = -999; // remove
        bullet.ttl = 0;
        spawnHitParticles(state, bullet.pos, FACTION_COLORS[enemy.faction]);
        events.enemyHit = true;
        if (enemy.hp <= 0) {
          killEnemy(state, enemy, events);
        }
        break;
      }
    }
  }

  // ── Obstacles ───────────────────────────────────────────────
  // Obstacles — almost none early, gradual increase
  const obstacleRate = (0.0005 + progress * progress * 0.003) + state.currentStage * 0.0005;
  if (!state.bossActive && Math.random() < obstacleRate) {
    const roll = Math.random();
    const radius = 12 + Math.random() * 25;
    let obsType: 'rock' | 'mine' | 'barrier' | 'lasergate' | 'vortex' | 'staticturret';
    if (roll < 0.55) obsType = 'rock';
    else if (roll < 0.7) obsType = 'mine';
    else if (roll < 0.8) obsType = 'barrier';
    else if (roll < 0.88 && state.currentStage >= 2) obsType = 'staticturret';
    else if (roll < 0.94 && state.currentStage >= 3) obsType = 'lasergate';
    else if (state.currentStage >= 4) obsType = 'vortex';
    else obsType = 'rock';

    state.obstacles.push({
      pos: { x: 40 + Math.random() * (W - 80), y: -radius * 2 },
      vel: { x: (Math.random() - 0.5) * 1, y: obsType === 'staticturret' ? 1.2 : obsType === 'lasergate' ? 0.8 : 1 + Math.random() * 2 },
      radius: obsType === 'lasergate' ? W * 0.3 : obsType === 'staticturret' ? 20 : radius,
      hp: obsType === 'staticturret' ? 12 : obsType === 'lasergate' ? 8 : Math.ceil(radius / 5),
      type: obsType,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: obsType === 'vortex' ? 0.08 : (Math.random() - 0.5) * 0.04,
      fireTimer: obsType === 'staticturret' ? 60 + Math.floor(Math.random() * 30) : undefined,
      laserActive: obsType === 'lasergate' ? false : undefined,
      laserPhase: obsType === 'lasergate' ? Math.random() * Math.PI * 2 : undefined,
      pullStrength: obsType === 'vortex' ? 0.3 + Math.random() * 0.4 : undefined,
    });
  }

  // Update obstacles
  for (const obs of state.obstacles) {
    obs.pos.x += obs.vel.x;
    obs.pos.y += obs.vel.y;
    obs.rotation += obs.rotSpeed;

    // Static turret — fires at player
    if (obs.type === 'staticturret' && obs.fireTimer !== undefined && p.alive && obs.hp > 0) {
      obs.fireTimer--;
      if (obs.fireTimer <= 0) {
        obs.fireTimer = 70 + Math.floor(Math.random() * 20);
        const angle = Math.atan2(p.pos.y - obs.pos.y, p.pos.x - obs.pos.x);
        if (state.enemyBullets.length < 40) {
          state.enemyBullets.push({
            pos: { ...obs.pos },
            vel: { x: Math.cos(angle) * 3.5, y: Math.sin(angle) * 3.5 },
            damage: 1, radius: 4, isPlayer: false, color: '#ff6644', trail: true, ttl: 80, maxTtl: 80,
          });
        }
      }
    }

    // Laser gate — pulses on/off
    if (obs.type === 'lasergate' && obs.laserPhase !== undefined) {
      obs.laserActive = Math.sin(state.tick * 0.03 + obs.laserPhase) > 0;
      // Damage player if laser is active and they're in the beam
      if (obs.laserActive && p.alive && p.invulnTimer <= 0) {
        const dy = Math.abs(p.pos.y - obs.pos.y);
        const dx = Math.abs(p.pos.x - obs.pos.x);
        if (dy < 10 && dx < obs.radius) {
          hitPlayer(state, events);
        }
      }
    }

    // Vortex — pulls player toward it
    if (obs.type === 'vortex' && obs.pullStrength && p.alive && obs.hp > 0) {
      const dx = obs.pos.x - p.pos.x;
      const dy = obs.pos.y - p.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 5) {
        const pull = obs.pullStrength * (1 - dist / 150);
        p.pos.x += (dx / dist) * pull * 2;
        p.pos.y += (dy / dist) * pull * 2;
      }
    }
  }
  state.obstacles = state.obstacles.filter(o => o.pos.y < H + 60 && o.hp > 0);

  // Player bullets vs obstacles
  for (const bullet of state.playerBullets) {
    for (const obs of state.obstacles) {
      if (hitTest(bullet.pos, bullet.radius, obs.pos, obs.radius)) {
        obs.hp -= bullet.damage;
        bullet.pos.y = -999;
        // Sparks
        for (let i = 0; i < 3; i++) {
          state.particles.push({
            pos: { ...bullet.pos }, vel: { x: (Math.random()-0.5)*4, y: (Math.random()-0.5)*4 },
            life: 8, maxLife: 8, color: '#ffaa44', size: 2,
          });
        }
        if (obs.hp <= 0) {
          // Obstacle destroyed — explosion + coin reward
          for (let i = 0; i < 12; i++) {
            const a = Math.random() * Math.PI * 2;
            state.particles.push({
              pos: { ...obs.pos }, vel: { x: Math.cos(a)*3, y: Math.sin(a)*3 },
              life: 15 + Math.random()*10, maxLife: 25, color: '#887766', size: 2+Math.random()*3,
            });
          }
          // 1-2 coins from obstacles
          const obsCoinCount = obs.radius > 25 ? 2 : 1;
          for (let ci = 0; ci < obsCoinCount; ci++) {
            const ca = Math.random() * Math.PI * 2;
            state.powerUps.push({
              pos: { x: obs.pos.x + Math.cos(ca)*8, y: obs.pos.y + Math.sin(ca)*8 },
              vel: { x: Math.cos(ca)*2, y: Math.sin(ca)*2 + 0.5 },
              type: 'star', value: 1, magnetizable: true,
            });
          }
          state.score += 50;
        }
        break;
      }
    }
  }

  // Player vs obstacles
  if (p.alive && p.invulnTimer <= 0) {
    for (const obs of state.obstacles) {
      if (obs.hp <= 0) continue;
      if (hitTest(p.pos, p.width / 3, obs.pos, obs.radius * 0.8)) {
        hitPlayer(state, events);
        obs.hp = 0;
        break;
      }
    }
  }

  // ── Collision: enemy bullets vs player ─────────────────────
  if (p.alive && p.invulnTimer <= 0) {
    for (const bullet of state.enemyBullets) {
      if (hitTest(bullet.pos, bullet.radius, p.pos, p.width / 3)) {
        bullet.pos.y = 9999;
        hitPlayer(state, events);
        break;
      }
    }
  }

  // ── Bullet grazing — near misses reward the player ─────────
  if (p.alive && p.invulnTimer <= 0) {
    const grazeRadius = p.width * 0.8; // slightly larger than hitbox
    for (const bullet of state.enemyBullets) {
      if (bullet.ttl <= 0) continue;
      const dx = bullet.pos.x - p.pos.x;
      const dy = bullet.pos.y - p.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < grazeRadius && dist > p.width / 3) {
        // Graze! — bullet is close but not hitting
        state.grazeCount++;
        state.grazeFlash = 8;
        state.score += 25;
        state.dominanceScore += 2;
        // Spark particle at graze point
        const mx = (bullet.pos.x + p.pos.x) / 2;
        const my = (bullet.pos.y + p.pos.y) / 2;
        state.particles.push({
          pos: { x: mx, y: my },
          vel: { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 },
          life: 10, maxLife: 10, color: '#ffffff', size: 2,
        });
        // Mark bullet so we don't graze it again (move it slightly out of graze range conceptually via ttl decrement)
        bullet.ttl = Math.max(1, bullet.ttl - 2);
        break; // Only one graze per frame
      }
    }
  }

  // ── Collision: enemies vs player ───────────────────────────
  if (p.alive && p.invulnTimer <= 0) {
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      if (hitTest(p.pos, p.width / 3, enemy.pos, enemy.width / 3)) {
        hitPlayer(state, events);
        enemy.hp -= 5;
        if (enemy.hp <= 0) killEnemy(state, enemy, events);
        break;
      }
    }
  }

  // ── Power-ups ──────────────────────────────────────────────
  for (const pu of state.powerUps) {
    pu.pos.y += pu.vel.y;
    // Magnet attraction
    if (p.alive && (p.magnetActive || pu.type === 'star')) {
      const dx = p.pos.x - pu.pos.x;
      const dy = p.pos.y - pu.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRange = p.magnetActive ? 200 : 80;
      if (dist < magnetRange) {
        pu.pos.x += dx * 0.08;
        pu.pos.y += dy * 0.08;
      }
    }
    // Collect
    if (p.alive && hitTest(p.pos, p.width / 2, pu.pos, 15)) {
      collectPowerUp(state, pu);
      pu.pos.y = 9999;
      events.powerUpCollected = pu.type;
      if (pu.type === 'star') events.coinCollected = true;
    }
  }
  state.powerUps = state.powerUps.filter(pu => pu.pos.y < H + 50 && pu.pos.y > -50);
  // Cap powerups on screen
  if (state.powerUps.length > 20) state.powerUps = state.powerUps.slice(-20);

  // ── Particles ──────────────────────────────────────────────
  for (const p2 of state.particles) {
    p2.pos.x += p2.vel.x;
    p2.pos.y += p2.vel.y;
    p2.vel.x *= 0.96;
    p2.vel.y *= 0.96;
    p2.life--;
  }
  state.particles = state.particles.filter(p2 => p2.life > 0);
  // Cap particles to prevent performance issues
  if (state.particles.length > 500) {
    state.particles = state.particles.slice(-500);
  }

  // ── Combo timer ────────────────────────────────────────────
  if (state.comboTimer > 0) {
    state.comboTimer--;
    if (state.comboTimer <= 0) state.combo = 0;
  }

  // ── Upgrade flash timer ────────────────────────────────────
  if (state.upgradeFlashTimer > 0) state.upgradeFlashTimer--;

  // ── Beat pulse decay — slow fade for smooth feel ──
  state.beatPulse *= 0.93;

  // ── Screen effects decay ───────────────────────────────────
  if (state.screenShake > 0) state.screenShake *= 0.9;
  if (state.screenShake < 0.2) state.screenShake = 0;
  if (state.screenFlash > 0) state.screenFlash *= 0.85;
  if (state.screenFlash < 0.01) state.screenFlash = 0;
  if (state.damageVignette > 0) state.damageVignette *= 0.95;
  if (state.damageVignette < 0.01) state.damageVignette = 0;
  if (state.bossWarning > 0) state.bossWarning--;
  if (state.bossEntrance > 0) state.bossEntrance--;
  if (state.slowMotion > 0) state.slowMotion--;
  if (state.grazeFlash > 0) state.grazeFlash--;

  // ── Popups decay ──
  for (const pop of state.popups) {
    pop.pos.y -= 1.2;
    pop.life--;
  }
  state.popups = state.popups.filter(pop => pop.life > 0);
  if (state.popups.length > 12) state.popups = state.popups.slice(-12);

  // ── Adaptive difficulty — decay dominance toward neutral ──
  state.dominanceScore *= 0.998;

  // ── Victory check ──────────────────────────────────────────
  if (state.bossActive && state.enemies.length === 0) {
    state.phase = 'victory';
    state.bossActive = false;
    state.slowMotion = 90;
    state.screenFlash = 1;
    state.screenFlashColor = '#ffffff';
    state.screenShake = 15;
    // Convert all remaining enemy bullets into coins (satisfying screen clear)
    for (const bullet of state.enemyBullets) {
      state.powerUps.push({
        pos: { ...bullet.pos },
        vel: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        type: 'star', value: 1, magnetizable: true,
      });
    }
    state.enemyBullets = [];
    saveProgress(state);
    events.bossKilled = true;
  }

  return events;
}

// ── Helpers ────────────────────────────────────────────────
function getFireRate(p: PlayerShip): number {
  const base = Math.max(3, 8 - p.mainGunLevel);
  return p.overdriveTimer > 0 ? Math.max(2, Math.floor(base / 2)) : base;
}

function firePlayerWeapons(state: ShmupState, p: PlayerShip, fireSpecial: boolean): void {
  const color = FACTION_COLORS.federation;
  const PT = 120; // player bullet lifespan (long — they leave screen anyway)
  // Main gun
  const spread = p.mainGunLevel >= 3 ? [-4, 0, 4] : p.mainGunLevel >= 2 ? [-2, 2] : [0];
  for (const dx of spread) {
    state.playerBullets.push({
      pos: { x: p.pos.x + dx, y: p.pos.y - p.height / 2 },
      vel: { x: dx * 0.3, y: -12 },
      damage: 1 + Math.floor(p.mainGunLevel / 2),
      radius: 4, isPlayer: true, color, trail: true, ttl: PT, maxTtl: PT,
    });
  }

  // Wing guns
  if (p.wingGunLevel > 0 && state.tick % (12 - p.wingGunLevel * 2) === 0) {
    const ws = p.wingGunLevel >= 3 ? 20 : 14;
    state.playerBullets.push(
      { pos: { x: p.pos.x - ws, y: p.pos.y - 5 }, vel: { x: -1, y: -10 }, damage: 1, radius: 3, isPlayer: true, color: '#88ddff', ttl: PT, maxTtl: PT },
      { pos: { x: p.pos.x + ws, y: p.pos.y - 5 }, vel: { x: 1, y: -10 }, damage: 1, radius: 3, isPlayer: true, color: '#88ddff', ttl: PT, maxTtl: PT },
    );
  }

  // Missiles — only fire on special
  if (fireSpecial && p.missileLevel > 0 && state.tick % (45 - p.missileLevel * 10) === 0) {
    let target: Enemy | null = null;
    let bestDist = Infinity;
    for (const e of state.enemies) {
      if (!e.alive) continue;
      const d = Math.abs(e.pos.x - p.pos.x) + Math.abs(e.pos.y - p.pos.y);
      if (d < bestDist) { bestDist = d; target = e; }
    }
    if (target) {
      const angle = Math.atan2(target.pos.y - p.pos.y, target.pos.x - p.pos.x);
      state.playerBullets.push({
        pos: { x: p.pos.x, y: p.pos.y - 10 },
        vel: { x: Math.cos(angle) * 8, y: Math.sin(angle) * 8 },
        damage: 3 + p.missileLevel, radius: 5, isPlayer: true, color: '#ffaa00', trail: true, ttl: 90, maxTtl: 90,
      });
    }
  }

  // Laser — only fire on special
  if (fireSpecial && p.laserLevel > 0 && state.tick % 2 === 0) {
    state.playerBullets.push({
      pos: { x: p.pos.x, y: p.pos.y - p.height },
      vel: { x: 0, y: -20 },
      damage: p.laserLevel, radius: 6, isPlayer: true, color: '#ff44ff', ttl: 30, maxTtl: 30,
    });
  }

  // Phaser — only fire on special
  if (fireSpecial && p.phaserLevel > 0 && state.tick % 4 === 0) {
    const sweep = Math.sin(state.tick * 0.06) * (3 + p.phaserLevel);
    state.playerBullets.push({
      pos: { x: p.pos.x, y: p.pos.y - p.height / 2 },
      vel: { x: sweep, y: -14 },
      damage: 2 + p.phaserLevel, radius: 5, isPlayer: true, color: '#ff8833', trail: true, ttl: 45, maxTtl: 45,
    });
  }
}

function fireEnemyWeapon(state: ShmupState, enemy: Enemy, playerPos: Vec2): void {
  const angle = Math.atan2(playerPos.y - enemy.pos.y, playerPos.x - enemy.pos.x);
  // Bullet speed scales with level progress — very slow at start
  const dur = state.stages[state.currentStage]?.duration || 2100;
  const prog = Math.min(state.tick / dur, 1);
  const bSpd = 0.5 + prog * 0.5; // bullet speed multiplier: 50% → 100%

  // Cap enemy bullets — adaptive: fewer bullets if player is struggling
  const bulletCap = state.deathCount >= 3 ? 20 : state.deathCount >= 1 ? 25 : 30;
  if (state.enemyBullets.length > bulletCap) return;

  switch (enemy.type) {
    case 'fighter': {
      // Fast red bolt — short range, easy to dodge
      const t = 35;
      state.enemyBullets.push({
        pos: { x: enemy.pos.x, y: enemy.pos.y + enemy.height / 2 },
        vel: { x: 0, y: 4 * bSpd },
        damage: 1, radius: 3, isPlayer: false, color: '#ff2222', trail: true, ttl: t, maxTtl: t,
      });
      break;
    }
    case 'bomber': {
      // Orange plasma spread — medium range, wide pattern
      const t = 55;
      const spread = 0.8 + prog * 0.3;
      state.enemyBullets.push({
        pos: { x: enemy.pos.x - 8, y: enemy.pos.y + enemy.height / 3 },
        vel: { x: -spread * bSpd, y: 2.5 * bSpd },
        damage: 1, radius: 5, isPlayer: false, color: '#ff8800', ttl: t, maxTtl: t,
      });
      state.enemyBullets.push({
        pos: { x: enemy.pos.x + 8, y: enemy.pos.y + enemy.height / 3 },
        vel: { x: spread * bSpd, y: 2.5 * bSpd },
        damage: 1, radius: 5, isPlayer: false, color: '#ff8800', ttl: t, maxTtl: t,
      });
      // Center blob on later stages
      if (state.currentStage >= 2) {
        state.enemyBullets.push({
          pos: { x: enemy.pos.x, y: enemy.pos.y + enemy.height / 3 },
          vel: { x: 0, y: 3 * bSpd },
          damage: 1, radius: 6, isPlayer: false, color: '#ffaa22', ttl: t, maxTtl: t,
        });
      }
      break;
    }
    case 'cruiser': {
      // Green phaser beam — long range, aimed, large
      const t = 100;
      state.enemyBullets.push({
        pos: { x: enemy.pos.x, y: enemy.pos.y + enemy.height / 2 },
        vel: { x: Math.cos(angle) * 2.8 * bSpd, y: Math.sin(angle) * 2.8 * bSpd },
        damage: 1, radius: 6, isPlayer: false, color: '#22ff66', trail: true, ttl: t, maxTtl: t,
      });
      // Secondary turret shot from wing
      if (state.currentStage >= 3 && state.tick % 2 === 0) {
        const side = state.tick % 4 < 2 ? -1 : 1;
        state.enemyBullets.push({
          pos: { x: enemy.pos.x + side * enemy.width * 0.3, y: enemy.pos.y + enemy.height * 0.3 },
          vel: { x: Math.cos(angle + side * 0.2) * 2 * bSpd, y: Math.sin(angle + side * 0.2) * 2 * bSpd },
          damage: 1, radius: 4, isPlayer: false, color: '#88ffaa', ttl: 60, maxTtl: 60,
        });
      }
      break;
    }
    case 'elite': {
      // Purple energy orbs — spiral pattern, medium range
      const t = 50;
      const orbCount = 3 + Math.floor(state.currentStage / 2);
      for (let i = 0; i < Math.min(orbCount, 5); i++) {
        const a = (Math.PI * 2 / orbCount) * i + state.tick * 0.05;
        state.enemyBullets.push({
          pos: { ...enemy.pos },
          vel: { x: Math.cos(a) * 2.2 * bSpd, y: Math.sin(a) * 2.2 * bSpd },
          damage: 1, radius: 4, isPlayer: false, color: '#bb44ff', ttl: t, maxTtl: t,
        });
      }
      break;
    }
    case 'turret': {
      // Yellow precision laser — very long range, fast, narrow
      const t = 90;
      state.enemyBullets.push({
        pos: { ...enemy.pos },
        vel: { x: Math.cos(angle) * 3.5 * bSpd, y: Math.sin(angle) * 3.5 * bSpd },
        damage: 1, radius: 3, isPlayer: false, color: '#ffee00', trail: true, ttl: t, maxTtl: t,
      });
      // Double-shot on later stages
      if (state.currentStage >= 2) {
        const offset = 0.15;
        state.enemyBullets.push({
          pos: { ...enemy.pos },
          vel: { x: Math.cos(angle + offset) * 3 * bSpd, y: Math.sin(angle + offset) * 3 * bSpd },
          damage: 1, radius: 2, isPlayer: false, color: '#ddcc00', trail: true, ttl: 70, maxTtl: 70,
        });
      }
      break;
    }
    case 'boss':
      fireBossPattern(state, enemy);
      break;
  }
}

function fireBossPattern(state: ShmupState, boss: Enemy): void {
  const color = FACTION_COLORS[boss.faction];
  const phase = boss.phase || 0;
  const t = state.tick;
  const bt = 100;
  const pt = boss.phaseTimer || 0;
  const playerAngle = Math.atan2(state.player.pos.y - boss.pos.y, state.player.pos.x - boss.pos.x);

  // Cap boss bullets to avoid flooding
  if (state.enemyBullets.length > 60) return;

  if (phase === 0) {
    // Phase 1: alternating spread fans from wings
    const side = pt % 2 === 0 ? -1 : 1;
    const originX = boss.pos.x + side * boss.width * 0.35;
    for (let i = -2; i <= 2; i++) {
      const a = Math.PI / 2 + i * 0.2; // downward fan
      state.enemyBullets.push({
        pos: { x: originX, y: boss.pos.y + boss.height * 0.3 },
        vel: { x: Math.cos(a) * 2.5, y: Math.sin(a) * 2.5 },
        damage: 1, radius: 5, isPlayer: false, color, ttl: bt, maxTtl: bt,
      });
    }
  } else if (phase === 1) {
    // Phase 2: rotating spiral arms
    const arms = 4;
    for (let i = 0; i < arms; i++) {
      const a = (t * 0.06) + (Math.PI * 2 / arms) * i;
      state.enemyBullets.push({
        pos: { x: boss.pos.x, y: boss.pos.y },
        vel: { x: Math.cos(a) * 3.2, y: Math.sin(a) * 3.2 },
        damage: 1, radius: 5, isPlayer: false, color, ttl: bt, maxTtl: bt,
      });
    }
    // Plus aimed shots every few fires
    if (pt % 3 === 0) {
      state.enemyBullets.push({
        pos: { x: boss.pos.x, y: boss.pos.y + boss.height * 0.4 },
        vel: { x: Math.cos(playerAngle) * 4, y: Math.sin(playerAngle) * 4 },
        damage: 1, radius: 6, isPlayer: false, color: '#ffffff', trail: true, ttl: bt, maxTtl: bt,
      });
    }
  } else if (phase === 2) {
    // Phase 3: bullet curtains — walls with gaps
    const wallWidth = 8;
    const gapPos = Math.floor(Math.sin(t * 0.02) * 3 + 4); // gap moves
    for (let i = 0; i < wallWidth; i++) {
      if (i === gapPos || i === gapPos + 1) continue; // leave a gap
      const x = boss.pos.x - boss.width * 0.4 + (boss.width * 0.8 / wallWidth) * i;
      state.enemyBullets.push({
        pos: { x, y: boss.pos.y + boss.height * 0.4 },
        vel: { x: 0, y: 3 },
        damage: 1, radius: 4, isPlayer: false, color, ttl: 80, maxTtl: 80,
      });
    }
    // Diagonal sweeps from edges
    if (pt % 4 === 0) {
      const sweepAngle = playerAngle + Math.sin(t * 0.03) * 0.4;
      for (let i = -1; i <= 1; i++) {
        state.enemyBullets.push({
          pos: { x: boss.pos.x + i * boss.width * 0.4, y: boss.pos.y },
          vel: { x: Math.cos(sweepAngle + i * 0.1) * 3.5, y: Math.sin(sweepAngle + i * 0.1) * 3.5 },
          damage: 1, radius: 5, isPlayer: false, color: '#ff4444', trail: true, ttl: bt, maxTtl: bt,
        });
      }
    }
  } else {
    // Phase 4+ (rage): everything at once — spiral + aimed + spread
    // Fast spiral
    for (let i = 0; i < 5; i++) {
      const a = (t * 0.1) + (Math.PI * 2 / 5) * i;
      state.enemyBullets.push({
        pos: { ...boss.pos },
        vel: { x: Math.cos(a) * 3.5, y: Math.sin(a) * 3.5 },
        damage: 1, radius: 5, isPlayer: false, color, ttl: bt, maxTtl: bt,
      });
    }
    // Aimed triple shot
    for (let i = -1; i <= 1; i++) {
      state.enemyBullets.push({
        pos: { x: boss.pos.x + i * 30, y: boss.pos.y + boss.height * 0.4 },
        vel: { x: Math.cos(playerAngle + i * 0.12) * 4.5, y: Math.sin(playerAngle + i * 0.12) * 4.5 },
        damage: 1, radius: 6, isPlayer: false, color: '#ffffff', trail: true, ttl: bt, maxTtl: bt,
      });
    }
    // Weak point turrets — remaining alive weak points fire independently
    if (boss.weakPoints) {
      for (const wp of boss.weakPoints) {
        if (!wp.alive) continue;
        const wpX = boss.pos.x + wp.offset.x;
        const wpY = boss.pos.y + wp.offset.y;
        const wpAngle = Math.atan2(state.player.pos.y - wpY, state.player.pos.x - wpX);
        state.enemyBullets.push({
          pos: { x: wpX, y: wpY },
          vel: { x: Math.cos(wpAngle) * 3, y: Math.sin(wpAngle) * 3 },
          damage: 1, radius: 4, isPlayer: false, color: '#ffaa00', ttl: 70, maxTtl: 70,
        });
      }
    }
  }

  // All phases: boss occasionally spawns minions (every ~5 seconds in later phases)
  if (phase >= 1 && pt % Math.max(100, 300 - phase * 80) === 0) {
    const faction = boss.faction;
    const side = Math.random() < 0.5 ? 0.1 : 0.9;
    spawnEnemy(state, 'fighter', faction, state.screenW * side);
    if (phase >= 2) {
      spawnEnemy(state, 'fighter', faction, state.screenW * (1 - side));
    }
  }
}

function spawnEnemy(state: ShmupState, type: EnemyType, faction: Faction, x: number, path?: any[], hp?: number, dropType?: PowerUpType): void {
  const stats = ENEMY_STATS[type];
  // Gentle difficulty curve — barely any pressure early, steadily builds
  const duration = state.stages[state.currentStage]?.duration || 2100;
  const progress = Math.min(state.tick / duration, 1);
  const stageBonus = 1 + state.currentStage * 0.12;
  // HP: starts at 80%, reaches 150% by end of level
  const hpScale = (0.8 + progress * 0.7) * stageBonus;
  // Fire rate: starts at 170% cooldown (very slow), drops to 70% (fast) by end
  const fireScale = Math.max(0.7, 1.7 - progress * 1.0);
  const scaledHp = Math.ceil((hp || stats.hp) * hpScale);
  state.enemies.push({
    id: nextEnemyId++,
    type, faction,
    pos: { x, y: -stats.height },
    vel: { x: 0, y: 2 },
    width: stats.width,
    height: stats.height,
    hp: scaledHp,
    maxHp: scaledHp,
    alive: true,
    fireTimer: Math.floor((stats.fireCooldown + Math.random() * 30) * fireScale),
    fireCooldown: Math.floor(stats.fireCooldown * fireScale),
    path: path as any,
    pathIdx: 0,
    dropType,
  });
}

function spawnTerrain(state: ShmupState, W: number, H: number): void {
  const stage = state.currentStage;
  // Different terrain types per stage theme
  const stageTerrains: TerrainType[][] = [
    ['asteroidcorridor'],                           // Stage 1: simple asteroid walls
    ['asteroidcorridor', 'crystalfield'],           // Stage 2: add crystals
    ['stationdebris', 'asteroidcorridor'],          // Stage 3: wrecked stations
    ['canyon', 'stationdebris'],                    // Stage 4: canyon walls
    ['wormholetunnel', 'crystalfield'],             // Stage 5: wormhole walls
    ['canyon', 'stationdebris', 'wormholetunnel'],  // Stage 6: everything
  ];

  const options = stageTerrains[stage % stageTerrains.length];
  const type = options[Math.floor(Math.random() * options.length)];

  let gapWidth: number;
  let color: string;
  let height: number;
  let damaging: boolean;

  switch (type) {
    case 'canyon':
      gapWidth = 250 + Math.random() * 120;
      color = '#4a3a2a';
      height = 50 + Math.random() * 30;
      damaging = false; // scenic — fly through freely
      break;
    case 'asteroidcorridor':
      gapWidth = 280 + Math.random() * 100;
      color = '#3a3530';
      height = 40 + Math.random() * 25;
      damaging = false;
      break;
    case 'stationdebris':
      gapWidth = 260 + Math.random() * 100;
      color = '#2a3a4a';
      height = 45 + Math.random() * 20;
      damaging = false;
      break;
    case 'wormholetunnel':
      gapWidth = 300 + Math.random() * 80;
      color = '#3a1a5a';
      height = 35 + Math.random() * 20;
      damaging = false;
      break;
    case 'crystalfield':
      gapWidth = 270 + Math.random() * 100;
      color = '#2a4a5a';
      height = 35 + Math.random() * 20;
      damaging = false;
      break;
  }

  // Create a sequence of 2-3 segments — scenic, not claustrophobic
  const numSegments = 2 + Math.floor(Math.random() * 2);
  let gapX = 0.35 + Math.random() * 0.3; // start position near center
  const driftDir = (Math.random() - 0.5) * 0.08; // gentle curve

  for (let i = 0; i < numSegments; i++) {
    gapX += driftDir;
    gapX = Math.max(0.2, Math.min(0.8, gapX));

    state.terrain.push({
      pos: { x: W / 2, y: -height - i * (height + 30) },
      vel: { x: driftDir * 2, y: 1.5 + state.scrollSpeed },
      type,
      width: gapWidth,
      height,
      gapX,
      rotation: (Math.random() - 0.5) * 0.1,
      color,
      life: Math.floor(H / 1.5 + i * 30),
      damaging,
    });
  }
}

function spawnOutpost(state: ShmupState, W: number): void {
  const types: OutpostType[] = ['station', 'planet', 'derelict', 'beacon', 'tradeship'];
  const type = types[Math.floor(Math.random() * types.length)];

  // Each type has unique loot tables, sizes, and capture times
  let lootTable: PowerUpType[];
  let radius: number;
  let captureTime: number;
  let name: string;

  switch (type) {
    case 'station':
      lootTable = ['shield', 'shield', 'weapon', 'bomb', 'star', 'star', 'star'];
      radius = 35;
      captureTime = 90; // 1.5 seconds
      name = 'SUPPLY STATION';
      break;
    case 'planet':
      lootTable = ['life', 'shield', 'shield', 'star', 'star', 'star', 'star', 'star'];
      radius = 50;
      captureTime = 120; // 2 seconds (bigger reward)
      name = 'COLONY WORLD';
      break;
    case 'derelict':
      lootTable = ['weapon', 'missile', 'laser', 'phaser', 'emp'];
      radius = 30;
      captureTime = 75; // 1.25 seconds
      name = 'DERELICT WARSHIP';
      break;
    case 'beacon':
      lootTable = ['overdrive', 'score2x', 'drone'];
      radius = 20;
      captureTime = 50; // quick grab
      name = 'NAV BEACON';
      break;
    case 'tradeship':
      lootTable = ['star', 'star', 'star', 'star', 'star', 'magnet', 'shield'];
      radius = 28;
      captureTime = 60; // 1 second
      name = 'TRADE VESSEL';
      break;
  }

  state.outposts.push({
    pos: { x: 60 + Math.random() * (W - 120), y: -radius * 2 },
    vel: { x: (Math.random() - 0.5) * 0.4, y: 0.5 + Math.random() * 0.3 },
    type,
    radius,
    lootTable,
    captureProgress: 0,
    captureTime,
    captured: false,
    rotation: Math.random() * Math.PI * 2,
    name,
  });
}

function spawnBoss(state: ShmupState, config: any): void {
  const W = state.screenW;
  // Create weak points based on boss type
  const weakPoints: import('./types').WeakPoint[] = [];
  const phaseCount = Math.max(1, config.phases || 3);
  const numWP = Math.min(Math.max(phaseCount - 1, 1), 4);
  for (let i = 0; i < numWP; i++) {
    const angle = (Math.PI * 2 / numWP) * i - Math.PI / 2;
    const rx = config.width * 0.35;
    const ry = config.height * 0.3;
    weakPoints.push({
      offset: { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry },
      hp: Math.floor(config.hp * 0.15),
      maxHp: Math.floor(config.hp * 0.15),
      alive: true,
    });
  }

  state.enemies.push({
    id: nextEnemyId++,
    type: 'boss',
    faction: config.faction,
    pos: { x: W / 2, y: -config.height },
    vel: { x: 0, y: 0.5 },
    width: config.width,
    height: config.height,
    hp: config.hp,
    maxHp: config.hp,
    alive: true,
    fireTimer: 60, // longer grace period on spawn
    fireCooldown: 18,
    pathIdx: 0,
    phase: 0,
    phaseTimer: 0,
    phaseCount,
    weakPoints,
  });
  state.bossHp = config.hp;
  state.bossMaxHp = config.hp;
  state.scrollSpeed = 0;
}

function updateEnemy(state: ShmupState, enemy: Enemy, W: number, H: number): void {
  if (enemy.type === 'boss') {
    const targetY = enemy.height * 0.7 + 30;
    const t = state.tick;

    // Dramatic entrance — slow descent
    if (enemy.pos.y < targetY) {
      enemy.pos.y += 0.6;
    } else {
      // Phase-dependent movement
      const phase = enemy.phase || 0;
      if (phase === 0) {
        // Phase 1: slow menacing sway
        enemy.pos.x = W / 2 + Math.sin(t * 0.012) * (W * 0.2);
        enemy.pos.y = targetY + Math.sin(t * 0.008) * 15;
      } else if (phase === 1) {
        // Phase 2: faster lateral sweeps
        enemy.pos.x = W / 2 + Math.sin(t * 0.02) * (W * 0.3);
        enemy.pos.y = targetY + Math.sin(t * 0.015) * 25 - 10;
      } else if (phase === 2) {
        // Phase 3: aggressive figure-8 pattern
        enemy.pos.x = W / 2 + Math.sin(t * 0.025) * (W * 0.35);
        enemy.pos.y = targetY + Math.sin(t * 0.02) * 35 + Math.cos(t * 0.03) * 15;
      } else {
        // Phase 4+: rage — erratic, fast moves
        enemy.pos.x = W / 2 + Math.sin(t * 0.035) * (W * 0.3) + Math.cos(t * 0.05) * 40;
        enemy.pos.y = targetY + Math.sin(t * 0.03) * 40;
      }
    }

    // Phase transitions based on HP thresholds
    const hpPct = enemy.hp / enemy.maxHp;
    const numPhases = Math.max(1, enemy.phaseCount || 3);
    const expectedPhase = Math.min(numPhases - 1, Math.floor((1 - hpPct) * numPhases));
    if (enemy.phase !== undefined && enemy.phase !== expectedPhase) {
      enemy.phase = expectedPhase;
      enemy.phaseTimer = 0;
      // Screen effects for phase change
      state.screenShake = 10 + expectedPhase * 3;
      state.screenFlash = 0.5;
      state.screenFlashColor = FACTION_COLORS[enemy.faction];
      // Phase transition explosion
      for (let i = 0; i < 50; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        state.particles.push({
          pos: { ...enemy.pos },
          vel: { x: Math.cos(a) * spd, y: Math.sin(a) * spd },
          life: 25 + Math.random() * 15, maxLife: 40,
          color: Math.random() > 0.5 ? FACTION_COLORS[enemy.faction] : '#ffffff', size: 3 + Math.random() * 4,
        });
      }
      // Destroy a weak point on phase change
      if (enemy.weakPoints) {
        const aliveWP = enemy.weakPoints.filter(wp => wp.alive);
        if (aliveWP.length > 0) {
          aliveWP[0].alive = false;
          // Weak point destruction burst
          const wp = aliveWP[0];
          for (let i = 0; i < 20; i++) {
            const a = Math.random() * Math.PI * 2;
            state.particles.push({
              pos: { x: enemy.pos.x + wp.offset.x, y: enemy.pos.y + wp.offset.y },
              vel: { x: Math.cos(a) * 4, y: Math.sin(a) * 4 },
              life: 20, maxLife: 20,
              color: '#ff8800', size: 3,
            });
          }
        }
      }
      // Boss enrages — fires faster in later phases
      enemy.fireCooldown = Math.max(10, 18 - expectedPhase * 3);
    }
    if (enemy.phaseTimer !== undefined) enemy.phaseTimer++;

    state.bossHp = enemy.hp;
    return;
  }

  // Smooth flowing movement based on enemy type and ID (creates unique but predictable paths)
  const t = state.tick;
  const seed = enemy.id * 7.3; // unique per enemy
  // Gentle speed ramp — very slow drift early, moderate by end
  const duration = state.stages[state.currentStage]?.duration || 2100;
  const progress = Math.min(state.tick / duration, 1);
  const speedRamp = 0.4 + progress * 0.6; // 40% speed at start, 100% by end
  const rawSpeed = { fighter: 1.6, bomber: 1.0, cruiser: 0.6, elite: 1.2, turret: 0.5, boss: 0 }[enemy.type] || 1.0;
  const baseSpeed = rawSpeed * speedRamp;

  switch (enemy.type) {
    case 'fighter': {
      // Fighters: graceful sweeping arcs — sine wave horizontally while drifting down
      const freq = 0.015 + (seed % 5) * 0.003;
      const amplitude = W * 0.15 + (seed % 3) * W * 0.05;
      const startX = enemy.path?.[0]?.x ?? 0.5;
      enemy.pos.x = (startX * W) + Math.sin(t * freq + seed) * amplitude;
      enemy.pos.y += baseSpeed;
      break;
    }
    case 'bomber': {
      // Bombers: slow steady descent with gentle lateral drift
      const drift = Math.sin(t * 0.008 + seed) * 0.4;
      enemy.pos.x += drift;
      enemy.pos.y += baseSpeed;
      break;
    }
    case 'cruiser': {
      // Cruisers: majestically slow, barely move horizontally, imposing presence
      enemy.pos.x += Math.sin(t * 0.006 + seed) * 0.3;
      enemy.pos.y += baseSpeed;
      break;
    }
    case 'elite': {
      // Elites: figure-8 or spiral patterns — more aggressive but still smooth
      const phase = (t * 0.02 + seed);
      const startX = enemy.path?.[0]?.x ?? 0.5;
      enemy.pos.x = (startX * W) + Math.sin(phase) * W * 0.18;
      enemy.pos.y += baseSpeed + Math.cos(phase * 0.5) * 0.5;
      break;
    }
    case 'turret': {
      // Turrets: very slow drift, almost stationary platforms
      enemy.pos.y += baseSpeed;
      enemy.pos.x += Math.sin(t * 0.004 + seed) * 0.2;
      break;
    }
  }

  // Soft clamping — keep enemies from drifting off screen edges
  if (enemy.pos.x < enemy.width) enemy.pos.x += 0.5;
  if (enemy.pos.x > W - enemy.width) enemy.pos.x -= 0.5;

  // Remove if far off screen bottom
  if (enemy.pos.y > H + 80) enemy.alive = false;
}

function killEnemy(state: ShmupState, enemy: Enemy, events: ShmupEvents): void {
  enemy.alive = false;
  events.enemyKilled = { ...enemy.pos };

  // Score — with multiplier support
  const baseScore = { fighter: 100, bomber: 200, cruiser: 500, elite: 800, turret: 300, boss: 5000 }[enemy.type] || 100;
  state.combo++;
  state.comboTimer = 120;
  const scoreMult = state.player.scoreMultTimer > 0 ? 2 : 1;
  const totalScore = baseScore * Math.min(state.combo, 10) * scoreMult;
  state.score += totalScore;
  state.dominanceScore += 1;

  // Floating score popup
  const popupText = state.combo > 3 ? `+${totalScore} x${state.combo}` : `+${totalScore}`;
  const popupColor = state.combo > 8 ? '#ffdd00' : state.combo > 4 ? '#44ffaa' : '#ffffff';
  state.popups.push({
    pos: { x: enemy.pos.x, y: enemy.pos.y },
    text: popupText,
    color: popupColor,
    life: 45,
    maxLife: 45,
  });

  // Combo streak rewards — every 15 kills in a row drops a bonus
  if (state.combo > 0 && state.combo % 15 === 0) {
    const bonusTypes: PowerUpType[] = ['emp', 'overdrive', 'drone', 'score2x', 'bomb', 'shield'];
    const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    state.powerUps.push({
      pos: { ...enemy.pos }, vel: { x: 0, y: -1 },
      type: bonusType, value: 1, magnetizable: false,
    });
    state.upgradeFlash = `${state.combo} KILL STREAK!`;
    state.upgradeFlashTimer = 60;
    state.screenFlash = 0.2;
    state.screenFlashColor = '#ffdd00';
  }

  // ═══ EPIC EXPLOSION SYSTEM ═══
  const W = enemy.width, H = enemy.height;
  const cx = enemy.pos.x, cy = enemy.pos.y;
  const ec = FACTION_COLORS[enemy.faction];
  const scale = { fighter: 1, bomber: 1.4, cruiser: 2, elite: 1.8, turret: 1.2, boss: 3 }[enemy.type] || 1;

  // 1. Central white-hot flash (large, brief)
  for (let i = 0; i < Math.floor(5 * scale); i++) {
    state.particles.push({
      pos: { x: cx + (Math.random()-0.5)*W*0.2, y: cy + (Math.random()-0.5)*H*0.2 },
      vel: { x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2 },
      life: 6 + Math.random()*4, maxLife: 10,
      color: '#ffffff', size: 8 + Math.random() * 10 * scale,
    });
  }

  // 2. Primary fireball — hot core expanding outward
  const fireCount = Math.floor(25 * scale);
  for (let i = 0; i < fireCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 0.5 + Math.random() * 4 * scale;
    const colors = ['#ff2200', '#ff5500', '#ff8800', '#ffbb00', '#ffee44'];
    state.particles.push({
      pos: { x: cx + (Math.random()-0.5)*W*0.4, y: cy + (Math.random()-0.5)*H*0.4 },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
      life: 15 + Math.random()*25, maxLife: 40,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: 2 + Math.random() * 4 * scale,
    });
  }

  // 3. Faction-colored energy release — the ship's reactor venting
  for (let i = 0; i < Math.floor(12 * scale); i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 5;
    state.particles.push({
      pos: { x: cx, y: cy },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
      life: 20 + Math.random()*15, maxLife: 35,
      color: ec, size: 1.5 + Math.random() * 3,
    });
  }

  // 4. Shockwave ring — fast-expanding ring of particles
  const ringCount = Math.floor(16 * scale);
  for (let i = 0; i < ringCount; i++) {
    const a = (Math.PI * 2 / ringCount) * i;
    const spd = 4 + scale * 2;
    state.particles.push({
      pos: { x: cx, y: cy },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
      life: 10 + Math.random()*5, maxLife: 15,
      color: '#ffddaa', size: 2 + scale,
    });
  }

  // 5. Hull debris — dark chunks tumbling outward slowly
  const debrisCount = Math.floor(10 * scale);
  for (let i = 0; i < debrisCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 0.3 + Math.random() * 1.5;
    state.particles.push({
      pos: { x: cx + (Math.random()-0.5)*W*0.6, y: cy + (Math.random()-0.5)*H*0.6 },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd + 0.8 },
      life: 40 + Math.random()*50, maxLife: 90,
      color: ['#2a2520','#3a3530','#444','#1a1a1a'][Math.floor(Math.random()*4)],
      size: 3 + Math.random() * 5 * scale,
    });
  }

  // 6. Smoke plumes — dark expanding clouds
  for (let i = 0; i < Math.floor(8 * scale); i++) {
    state.particles.push({
      pos: { x: cx + (Math.random()-0.5)*W*0.3, y: cy + (Math.random()-0.5)*H*0.3 },
      vel: { x: (Math.random()-0.5)*1.2, y: -0.3 - Math.random()*0.5 },
      life: 50 + Math.random()*40, maxLife: 90,
      color: '#110800', size: 6 + Math.random() * 8 * scale,
    });
  }

  // 7. Ember trails — tiny bright sparks with long life
  for (let i = 0; i < Math.floor(15 * scale); i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 1 + Math.random() * 3;
    state.particles.push({
      pos: { x: cx + (Math.random()-0.5)*W*0.3, y: cy + (Math.random()-0.5)*H*0.3 },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
      life: 25 + Math.random()*35, maxLife: 60,
      color: Math.random() > 0.5 ? '#ffaa44' : '#ff6622',
      size: 1 + Math.random() * 1.5,
    });
  }

  // 8. Secondary detonations for big ships — offset explosions
  if (scale >= 1.4) {
    const secondaryCount = Math.floor(scale * 2);
    for (let s = 0; s < secondaryCount; s++) {
      const ox = (Math.random()-0.5)*W*0.8;
      const oy = (Math.random()-0.5)*H*0.8;
      // Each secondary has its own mini-fireball
      for (let j = 0; j < 10; j++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 1 + Math.random() * 3;
        state.particles.push({
          pos: { x: cx+ox, y: cy+oy },
          vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
          life: 12 + Math.random()*12, maxLife: 24,
          color: ['#ff4400','#ffaa00','#ffffff'][Math.floor(Math.random()*3)],
          size: 2 + Math.random()*3,
        });
      }
    }
  }

  // 9. Boss gets extra: massive shockwave + screen-filling particles
  if (enemy.type === 'boss') {
    // Giant shockwave
    for (let i = 0; i < 32; i++) {
      const a = (Math.PI * 2 / 32) * i;
      state.particles.push({
        pos: { x: cx, y: cy },
        vel: { x: Math.cos(a)*8, y: Math.sin(a)*8 },
        life: 15, maxLife: 15,
        color: '#ffffff', size: 4,
      });
    }
    // Lingering fire cloud
    for (let i = 0; i < 40; i++) {
      state.particles.push({
        pos: { x: cx + (Math.random()-0.5)*W, y: cy + (Math.random()-0.5)*H },
        vel: { x: (Math.random()-0.5)*3, y: (Math.random()-0.5)*3 },
        life: 40 + Math.random()*40, maxLife: 80,
        color: ['#ff2200','#ff6600','#ffaa00','#ffdd00'][Math.floor(Math.random()*4)],
        size: 3 + Math.random()*6,
      });
    }
  }

  // Coins — fixed small amounts, no scaling. Earned by skill.
  const coinCount = { fighter: 1, bomber: 2, cruiser: 3, elite: 3, turret: 1, boss: 10 }[enemy.type] || 1;
  for (let i = 0; i < coinCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spread = 1.5 + Math.random() * 2;
    state.powerUps.push({
      pos: { x: enemy.pos.x + Math.cos(angle) * 8, y: enemy.pos.y + Math.sin(angle) * 8 },
      vel: { x: Math.cos(angle) * spread, y: Math.sin(angle) * spread + 0.5 },
      type: 'star', value: 1, magnetizable: true,
    });
  }
  // Power-up drop (if assigned, no random bonus coins)
  if (enemy.dropType) {
    state.powerUps.push({
      pos: { ...enemy.pos }, vel: { x: 0, y: 1.2 },
      type: enemy.dropType, value: 1, magnetizable: true,
    });
  }

  // Mercy shield drops — when player is low on health, enemies have a chance to drop shields
  if (!enemy.dropType && state.player.shields <= 1 && Math.random() < 0.18) {
    state.powerUps.push({
      pos: { ...enemy.pos }, vel: { x: (Math.random() - 0.5) * 1.5, y: 1 },
      type: 'shield', value: 1, magnetizable: true,
    });
  }
}

function hitPlayer(state: ShmupState, events: ShmupEvents): void {
  const p = state.player;
  events.playerHit = true;
  p.shields--;
  p.invulnTimer = INVULN_TIME;
  state.screenShake = 5;
  state.damageVignette = 0.6;
  state.screenFlash = 0.3;
  state.screenFlashColor = '#ff2200';

  // Hit particles
  for (let i = 0; i < 10; i++) {
    state.particles.push({
      pos: { ...p.pos },
      vel: { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
      life: 15, maxLife: 15, color: '#ffffff', size: 3,
    });
  }

  if (p.shields < 0) {
    p.lives--;
    p.alive = false;
    state.deathCount++;
    state.dominanceScore = Math.max(0, state.dominanceScore - 10);

    // Big death explosion
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 5;
      state.particles.push({
        pos: { ...p.pos }, vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
        life: 20+Math.random()*20, maxLife: 40,
        color: ['#00ccff','#ffffff','#ffaa00'][Math.floor(Math.random()*3)], size: 2+Math.random()*4,
      });
    }

    // Clear enemy bullets on death (mercy)
    state.enemyBullets = [];

    if (p.lives <= 0) {
      state.phase = 'gameover';
      saveProgress(state);
    } else {
      // Enter respawn countdown — 3 seconds (180 frames)
      state.phase = 'respawning';
      p.invulnTimer = 180;
    }
  }
}

function useBomb(state: ShmupState): void {
  // Damage all enemies on screen
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    enemy.hp -= 20;
    if (enemy.hp <= 0) {
      killEnemy(state, enemy, {});
    }
  }
  // Clear all enemy bullets
  state.enemyBullets = [];
  // Big flash particles
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 200;
    state.particles.push({
      pos: { x: state.player.pos.x + Math.cos(angle) * dist, y: state.player.pos.y + Math.sin(angle) * dist },
      vel: { x: Math.cos(angle) * 3, y: Math.sin(angle) * 3 },
      life: 30, maxLife: 30, color: '#ffffff', size: 5,
    });
  }
}

function collectPowerUp(state: ShmupState, pu: PowerUp): void {
  const p = state.player;
  let flashText = '';
  switch (pu.type) {
    case 'weapon':
      p.mainGunLevel = Math.min(5, p.mainGunLevel + 1);
      flashText = `CANNON LVL ${p.mainGunLevel}`;
      break;
    case 'shield':
      p.shields = Math.min(p.maxShields + 2, p.shields + 1);
      flashText = 'SHIELDS +1';
      break;
    case 'star':
      p.stars += pu.value;
      p.totalStars += pu.value;
      break; // no flash for coins
    case 'bomb':
      p.bombCount++;
      flashText = 'BOMB +1';
      break;
    case 'magnet':
      p.magnetActive = true;
      p.magnetTimer = 600;
      flashText = 'MAGNET ACTIVE';
      break;
    case 'missile':
      p.missileLevel = Math.min(3, p.missileLevel + 1);
      flashText = `MISSILES LVL ${p.missileLevel}`;
      break;
    case 'laser':
      p.laserLevel = Math.min(2, p.laserLevel + 1);
      flashText = `LASER LVL ${p.laserLevel}`;
      break;
    case 'phaser':
      p.phaserLevel = Math.min(3, p.phaserLevel + 1);
      flashText = `PHASER LVL ${p.phaserLevel}`;
      break;
    case 'life':
      p.lives++;
      flashText = 'EXTRA LIFE!';
      break;
    case 'emp':
      // Freeze all enemies for 2 seconds + damage them
      for (const enemy of state.enemies) {
        if (!enemy.alive || enemy.type === 'boss') continue;
        enemy.fireTimer = Math.max(enemy.fireTimer, 120);
        enemy.hp -= 2;
        if (enemy.hp <= 0) killEnemy(state, enemy, {});
      }
      state.enemyBullets = []; // clear all bullets
      state.screenFlash = 0.6;
      state.screenFlashColor = '#44ddff';
      state.screenShake = 4;
      flashText = '⚡ EMP BLAST';
      break;
    case 'overdrive':
      p.overdriveTimer = 420; // 7 seconds of 2x fire rate
      flashText = '🔥 OVERDRIVE';
      break;
    case 'drone':
      p.droneActive = true;
      p.droneTimer = 900; // 15 seconds
      flashText = '🛸 DRONE DEPLOYED';
      break;
    case 'score2x':
      p.scoreMultTimer = 600; // 10 seconds of 2x score
      flashText = '×2 SCORE BONUS';
      break;
  }
  if (flashText) {
    state.upgradeFlash = flashText;
    state.upgradeFlashTimer = 90;
  }
  // Sparkle particles
  for (let i = 0; i < 8; i++) {
    state.particles.push({
      pos: { ...pu.pos },
      vel: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
      life: 15, maxLife: 15, color: '#ffff88', size: 2,
    });
  }
}

function spawnHitParticles(state: ShmupState, pos: Vec2, color: string): void {
  if (state.particles.length > 450) return; // safety cap
  // Impact flash
  state.particles.push({
    pos: { ...pos }, vel: { x: 0, y: 0 },
    life: 4, maxLife: 4, color: '#ffffff', size: 5,
  });
  // Sparks
  for (let i = 0; i < 5; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 3;
    state.particles.push({
      pos: { ...pos },
      vel: { x: Math.cos(a)*spd, y: Math.sin(a)*spd },
      life: 8 + Math.random()*6, maxLife: 14,
      color: Math.random() > 0.5 ? color : '#ffcc44',
      size: 1 + Math.random() * 2,
    });
  }
}

function hitTest(a: Vec2, ar: number, b: Vec2, br: number): boolean {
  const dx = a.x - b.x, dy = a.y - b.y;
  return dx * dx + dy * dy < (ar + br) * (ar + br);
}

function handleBossWeakPointHits(state: ShmupState, events: ShmupEvents): void {
  const boss = state.enemies.find(e => e.alive && e.type === 'boss' && e.weakPoints);
  if (!boss?.weakPoints) return;

  for (const bullet of state.playerBullets) {
    if (bullet.ttl <= 0) continue;

    for (const wp of boss.weakPoints) {
      if (!wp.alive) continue;

      const wpX = boss.pos.x + wp.offset.x;
      const wpY = boss.pos.y + wp.offset.y;
      if (!hitTest(bullet.pos, bullet.radius, { x: wpX, y: wpY }, 12)) continue;

      wp.hp -= bullet.damage * 2; // double damage on weak points
      boss.hp -= bullet.damage; // also damages boss
      bullet.pos.y = -999;
      bullet.ttl = 0;
      events.enemyHit = true;

      // Crit spark
      state.particles.push({
        pos: { x: wpX, y: wpY }, vel: { x: 0, y: 0 },
        life: 6, maxLife: 6, color: '#ffff00', size: 8,
      });

      if (wp.hp <= 0) {
        wp.alive = false;
        boss.hp -= Math.floor(boss.maxHp * 0.05); // bonus damage
        for (let i = 0; i < 15; i++) {
          const a = Math.random() * Math.PI * 2;
          state.particles.push({
            pos: { x: wpX, y: wpY },
            vel: { x: Math.cos(a) * 5, y: Math.sin(a) * 5 },
            life: 20, maxLife: 20, color: '#ffaa00', size: 3,
          });
        }
        // Drop a powerup from destroyed weak point
        state.powerUps.push({
          pos: { x: wpX, y: wpY }, vel: { x: 0, y: 1.5 },
          type: ['weapon', 'shield', 'missile', 'bomb'][Math.floor(Math.random() * 4)] as PowerUpType,
          value: 1, magnetizable: true,
        });
      }

      state.bossHp = boss.hp;
      if (boss.hp <= 0) {
        killEnemy(state, boss, events);
        return;
      }
      break;
    }
  }
}

// ── Music-Reactive Integration ─────────────────────────────
export function applyDirectorCommand(state: ShmupState, cmd: DirectorCommand): void {
  if (state.phase !== 'playing' && state.phase !== 'boss') return;
  const W = state.screenW;
  const H = state.screenH;

  // Beat pulse (decays naturally in updateShmup)
  if (cmd.bgPulse > state.beatPulse) state.beatPulse = cmd.bgPulse;
  state.musicIntensity = cmd.scrollSpeedMult;

  // Scroll speed modulation
  state.scrollSpeed = SCROLL_SPEED * cmd.scrollSpeedMult;

  // Spawn enemies from director
  for (const e of cmd.spawnEnemies) {
    spawnEnemy(state, e.type, e.faction, e.x * W, undefined, undefined, e.drop);
  }

  // Trigger fire — make all enemies fire NOW (on the beat)
  if (cmd.triggerFire) {
    for (const enemy of state.enemies) {
      if (!enemy.alive || enemy.type === 'boss') continue;
      // Only fire if cooldown is close (don't override long cooldowns)
      if (enemy.fireTimer < enemy.fireCooldown * 0.5) {
        enemy.fireTimer = 0; // force fire next frame
      }
    }
  }

  // Spawn floating powerup during quiet sections
  if (cmd.spawnPowerUp && W > 0) {
    state.powerUps.push({
      pos: { x: 40 + Math.random() * (W - 80), y: -15 },
      vel: { x: (Math.random() - 0.5) * 0.5, y: 0.8 },
      type: cmd.spawnPowerUp, value: 1, magnetizable: false,
    });
  }

  // Particle burst on beat — just a few subtle sparkles
  if (cmd.particleBurst) {
    for (let i = 0; i < 3; i++) {
      state.particles.push({
        pos: { x: Math.random() * W, y: Math.random() * H * 0.2 },
        vel: { x: (Math.random() - 0.5) * 1, y: 0.5 + Math.random() * 1 },
        life: 15 + Math.random() * 10, maxLife: 25,
        color: 'rgba(150,200,255,0.6)', size: 1 + Math.random(),
      });
    }
  }

  // Spawn obstacle from director
  if (cmd.spawnObstacle && W > 0) {
    const types: ('rock'|'mine'|'barrier')[] = ['rock','rock','rock','mine','barrier'];
    const obsType = types[Math.floor(Math.random() * types.length)];
    const radius = 14 + Math.random() * 28;
    state.obstacles.push({
      pos: { x: 30 + Math.random() * (W - 60), y: -radius * 2 },
      vel: { x: (Math.random() - 0.5) * 1.5, y: 0.8 + Math.random() * 1.5 },
      radius, hp: Math.ceil(radius / 5),
      type: obsType,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    });
  }
}
