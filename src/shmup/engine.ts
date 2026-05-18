import {
  ShmupState, PlayerShip, Enemy, Bullet, PowerUp, Particle, Obstacle, Outpost, TerrainSegment, Vec2,
  GamePhase, EnemyType, PowerUpType, Faction, OutpostType, TerrainType, MoveStyle,
  PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT, SCROLL_SPEED, INVULN_TIME,
  FACTION_COLORS, ENEMY_STATS,
} from './types';
import { STAGES } from './stages';
import type { DirectorCommand } from './director';
import { playerPower } from './director';
import { profileForStage } from './musicProfiles';
import type { SignatureMechanic } from './musicProfiles';

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
    bandBass: 0,
    bandMid: 0,
    bandHigh: 0,
    currentBeatType: 'mid',
    currentBeatStrength: 0,
    beatFlashTimer: 0,
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
    chainLevel: 0,
    chainTimer: 0,
    explosionZones: [],
    dropCount: 0,
    curtains: [],
    pulseWalls: [],
    signatureLabel: '',
    signatureLabelTimer: 0,
    stageStats: {
      startTick: 0, startStars: 0, kills: 0, bossKilled: false,
      subsystemsDestroyed: 0, shotsHit: 0, damageTaken: 0,
      endTick: 0, finalCoins: 0,
    },
    victoryTimer: 0,
    flyawayActive: false,
    flyawayProgress: 0,
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
    dronePos: { x: 0, y: 0 },
    scoreMultTimer: 0,
    lockOnPhaserReady: false,
    lockOnTarget: -1,
    phaserCharge: 1,           // start fully charged
    phaserBeamActive: false,
    phaserRechargeDelay: 0,
    stars: 0,
    totalStars: parseInt(localStorage.getItem('nettrek-stars') || '0'),
    shieldBurstCooldown: 0,
    shieldBurstActive: 0,
    tractorSlowTimer: 0,
  };
}

// Defaults for the new waveform state — applied lazily in createShmupState below.

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

  // Reset per-stage stats + the post-victory flyaway sequence
  state.stageStats = {
    startTick: 0,
    startStars: p.stars,
    kills: 0,
    bossKilled: false,
    subsystemsDestroyed: 0,
    shotsHit: 0,
    damageTaken: 0,
    endTick: 0,
    finalCoins: 0,
  };
  state.victoryTimer = 0;
  state.flyawayActive = false;
  state.flyawayProgress = 0;
}

export interface ShmupInput {
  moveX: number;  // -1 to 1
  moveY: number;  // -1 to 1
  fire: boolean;
  fireSpecial: boolean;
  bomb: boolean;
  lockOnFire: boolean;   // (legacy double-tap; still supported as a one-shot trigger)
  phaserHold: boolean;   // held: 2nd finger on mobile, Shift on desktop. Beam stays
                         // on as long as this is true and there's charge left.
  shieldBurst: boolean;  // hard-push (pressure) or long-press — defensive panic burst
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
  obstacleHit?: boolean;       // player bullet hit a rock / mine / asteroid
  weakPointHit?: boolean;      // player bullet hit a boss weak point (crit)
  shieldDeflect?: boolean;     // player bullet deflected off a shielded boss hull
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
    // T'VAK tractor beam pulse slows the player while the timer is hot.
    if (p.tractorSlowTimer > 0) p.tractorSlowTimer--;
    const speedMult = p.tractorSlowTimer > 0 ? 0.4 : 1;
    p.pos.x += input.moveX * PLAYER_SPEED * speedMult;
    p.pos.y += input.moveY * PLAYER_SPEED * speedMult;
    // Clamp to screen
    p.pos.x = Math.max(p.width / 2, Math.min(W - p.width / 2, p.pos.x));
    p.pos.y = Math.max(p.height / 2, Math.min(H - p.height / 2, p.pos.y));

    if (p.invulnTimer > 0) p.invulnTimer--;

    // ── Shield burst (hard-push / long-press) — defensive panic ──
    if (p.shieldBurstCooldown > 0) p.shieldBurstCooldown--;
    if (p.shieldBurstActive > 0) p.shieldBurstActive--;
    if (input.shieldBurst && p.shieldBurstCooldown <= 0) {
      // 90 frames of invulnerability + a brief active visual ring.
      p.invulnTimer = Math.max(p.invulnTimer, 90);
      p.shieldBurstActive = 60;
      p.shieldBurstCooldown = 240; // 4-second cooldown — meaningful, not spammable
      state.popups.push({
        pos: { x: p.pos.x, y: p.pos.y - 30 },
        text: 'SHIELDS UP',
        color: '#44ddff', life: 36, maxLife: 36,
      });
    }

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

    // ── Wingman drone — flies in formation, fires at enemies ──
    if (p.droneActive) {
      p.droneTimer--;
      if (p.droneTimer <= 0) p.droneActive = false;

      // Wingman flies in formation — offset from player with smooth tracking
      const targetDroneX = p.pos.x + 35;
      const targetDroneY = p.pos.y + 15;
      p.dronePos.x += (targetDroneX - p.dronePos.x) * 0.08;
      p.dronePos.y += (targetDroneY - p.dronePos.y) * 0.08;

      // Engine trail from wingman
      if (state.tick % 4 === 0 && state.particles.length < 400) {
        state.particles.push({
          pos: { x: p.dronePos.x + (Math.random()-0.5)*3, y: p.dronePos.y + 10 },
          vel: { x: (Math.random()-0.5)*0.3, y: 1 }, life: 8, maxLife: 8,
          color: '#44ffaa', size: 1 + Math.random(),
        });
      }

      // Wingman fires at nearest enemy every 10 frames
      if (state.tick % 10 === 0) {
        let target: Enemy | null = null;
        let bestDist = Infinity;
        for (const e of state.enemies) {
          if (!e.alive) continue;
          const d = Math.abs(e.pos.x - p.dronePos.x) + Math.abs(e.pos.y - p.dronePos.y);
          if (d < bestDist) { bestDist = d; target = e; }
        }
        if (target) {
          const angle = Math.atan2(target.pos.y - p.dronePos.y, target.pos.x - p.dronePos.x);
          state.playerBullets.push({
            pos: { x: p.dronePos.x, y: p.dronePos.y - 8 },
            vel: { x: Math.cos(angle) * 10, y: Math.sin(angle) * 10 },
            damage: 2, radius: 3, isPlayer: true, color: '#44ffaa', trail: true, ttl: 60, maxTtl: 60,
          });
        }
      }
    }

    // ── Lock-on phaser — charge-based sustained laser ────────
    // Fully charged beam locks on a target and stays locked until either
    // the target is destroyed or power drains. When a target dies the
    // beam automatically sweeps to the next nearest enemy as long as
    // charge remains — so the laser feels like a sustained, chainable
    // weapon rather than a single burst.
    //
    // Tuning (60fps frames):
    //   DRAIN_RATE   = 0.006/frame → ~166 frames at full = 2.8s of beam
    //   DAMAGE/frame = 2 + phaserLevel (max 5 at lvl 3)
    //     fighter (3 HP) dies in ~1 frame
    //     bomber  (8 HP) dies in ~2 frames
    //     cruiser (20 HP) ~4 frames
    //     elite   (35 HP) ~7 frames
    //     boss    (150 HP) ~30 frames — meaningful chunk of one charge
    //   RECHARGE_DELAY after beam ends = 30 frames (0.5s "cool-off")
    //   RECHARGE_QUIET    = 0.012/frame → ~83 frames to full (1.4s)
    //   RECHARGE_INTENSE  = 0.006/frame → ~167 frames to full (2.8s)
    //   Activation requires phaserCharge >= 0.99 (fully charged)
    const DRAIN_RATE = 0.006;
    const RECHARGE_QUIET = 0.012;
    const RECHARGE_INTENSE = 0.006;
    const RECHARGE_DELAY_FRAMES = 30;
    const ACTIVATION_THRESHOLD = 0.99;
    const PHASER_DAMAGE = 2 + p.phaserLevel;
    const REACQUIRE_RANGE = W * 0.9;

    // ── Release the beam the instant the player lets go ──
    // (Mobile: 2nd finger lifted. Desktop: Shift released.) This is the
    // primary deactivation path now — charge depletion is the secondary cap.
    if (p.phaserBeamActive && !input.phaserHold && !input.lockOnFire) {
      p.phaserBeamActive = false;
      p.lockOnTarget = -1;
      p.phaserRechargeDelay = RECHARGE_DELAY_FRAMES;
    }

    // Activation — only when has charge. Held-to-fire (phaserHold) is the
    // primary input; legacy lockOnFire (double-tap one-shot) still works.
    const wantPhaser = input.phaserHold || input.lockOnFire;
    const minChargeToStart = input.phaserHold ? 0.15 : ACTIVATION_THRESHOLD;
    if (
      p.lockOnPhaserReady && wantPhaser &&
      !p.phaserBeamActive && p.phaserCharge >= minChargeToStart
    ) {
      // Find nearest enemy to lock onto
      let target: Enemy | null = null;
      let bestDist = Infinity;
      for (const e of state.enemies) {
        if (!e.alive) continue;
        const d = Math.sqrt((e.pos.x - p.pos.x) ** 2 + (e.pos.y - p.pos.y) ** 2);
        if (d < bestDist && d < W * 0.85) { bestDist = d; target = e; }
      }
      if (target) {
        p.lockOnTarget = target.id;
        p.phaserBeamActive = true;
        p.phaserRechargeDelay = 0;
      }
      input.lockOnFire = false;
    }

    // Active beam — drains charge, damages target, sweeps to the next
    // enemy when current target dies (as long as charge remains)
    if (p.phaserBeamActive) {
      let target = state.enemies.find(e => e.id === p.lockOnTarget && e.alive);
      // Reacquire if target died/despawned and we still have charge
      if (!target && p.phaserCharge > 0.05) {
        let nextTarget: Enemy | null = null;
        let bestDist = Infinity;
        for (const e of state.enemies) {
          if (!e.alive) continue;
          const d = Math.sqrt((e.pos.x - p.pos.x) ** 2 + (e.pos.y - p.pos.y) ** 2);
          if (d < bestDist && d < REACQUIRE_RANGE) { bestDist = d; nextTarget = e; }
        }
        if (nextTarget) {
          p.lockOnTarget = nextTarget.id;
          target = nextTarget;
          // Brief reacquire-spark at new target
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            state.particles.push({
              pos: { ...nextTarget.pos }, vel: { x: Math.cos(a)*2, y: Math.sin(a)*2 },
              life: 8, maxLife: 8, color: '#ffcc66', size: 2,
            });
          }
        }
      }

      if (target) {
        // ── Subsystem shielding applies to the phaser too ──
        // Previously the phaser drained boss.hp directly, bypassing the
        // shield. That caused boss kills with the phaser, lockups, and
        // a generally bypassable boss fight. Now: while subsystems are
        // alive, the phaser does NO hull damage and still drains charge
        // (so you can't just sit on the beam waiting for shields to drop).
        const isShieldedBoss =
          target.type === 'boss' &&
          !!target.weakPoints?.some(wp => wp.alive && wp.weaponType);
        if (isShieldedBoss) {
          // Drain charge (and show sparks) but no hp damage.
          p.phaserCharge -= DRAIN_RATE * 0.6;
          if (state.particles.length < 460) {
            const px = target.pos.x + (Math.random()-0.5)*60;
            const py = target.pos.y + (Math.random()-0.5)*60;
            state.particles.push({
              pos: { x: px, y: py },
              vel: { x: (Math.random()-0.5)*3, y: (Math.random()-0.5)*3 },
              life: 8, maxLife: 8, color: '#88ddff', size: 2,
            });
          }
        } else {
          // Bosses still take REDUCED phaser damage so they can't be 1-shot.
          // Normal enemies and exposed bosses take the full per-frame damage.
          const dmg = target.type === 'boss' ? Math.max(1, Math.floor(PHASER_DAMAGE * 0.4)) : PHASER_DAMAGE;
          target.hp -= dmg;
          p.phaserCharge -= DRAIN_RATE;
        }

        // Continuous sparks at impact point — every frame for laser feel
        if (state.particles.length < 460) {
          state.particles.push({
            pos: { x: target.pos.x + (Math.random()-0.5)*8, y: target.pos.y + (Math.random()-0.5)*8 },
            vel: { x: (Math.random()-0.5)*5, y: (Math.random()-0.5)*5 },
            life: 8, maxLife: 8, color: Math.random() > 0.5 ? '#ff8833' : '#ffcc88', size: 1.5 + Math.random()*1.5,
          });
        }

        if (target.hp <= 0) {
          // Target destroyed — beam keeps going if charge remains; the
          // reacquire branch above will pick a new target next frame.
          // If no charge left we'll fall into the drain-out branch below.
        } else if (p.phaserCharge <= 0) {
          p.phaserCharge = 0;
          p.phaserBeamActive = false;
          p.lockOnTarget = -1;
          p.phaserRechargeDelay = RECHARGE_DELAY_FRAMES;
          state.popups.push({
            pos: { x: p.pos.x, y: p.pos.y - 28 },
            text: 'PHASER DRAINED',
            color: '#ff6633', life: 30, maxLife: 30,
          });
        }
      } else {
        // No target found within range — end beam
        p.phaserBeamActive = false;
        p.lockOnTarget = -1;
        p.phaserRechargeDelay = RECHARGE_DELAY_FRAMES;
      }
    } else {
      // Not firing — recharge (after the small cool-off delay).
      // Rate is tied to music intensity so quiet sections recharge faster.
      if (p.phaserRechargeDelay > 0) {
        p.phaserRechargeDelay--;
      } else if (p.phaserCharge < 1) {
        const rate = state.musicIntensity > 0.7 ? RECHARGE_INTENSE : RECHARGE_QUIET;
        p.phaserCharge = Math.min(1, p.phaserCharge + rate);
        // One-shot popup when the phaser becomes ready again
        if (p.phaserCharge >= 1 && p.lockOnPhaserReady) {
          state.popups.push({
            pos: { x: p.pos.x, y: p.pos.y - 28 },
            text: 'PHASER READY',
            color: '#ffcc88', life: 28, maxLife: 28,
          });
        }
      }
    }
  }

  // ── Spawning is now 100% music-driven via the Director ──
  // The director (called from main.ts game loop) handles all enemy spawns.
  // We only handle the boss transition here based on level duration.
  if (!state.bossActive) {
    // Check if it's boss time — trigger warning first
    if (state.tick >= stage.duration - 120 && state.bossWarning === 0 && !state.bossActive && stage.boss) {
      state.bossWarning = 120;
    }
    // Boss spawns when either:
    //   a) we're past duration AND the screen is clear, OR
    //   b) we're at least 4 seconds past duration regardless of enemies
    //      (so the director can't postpone the boss indefinitely with trickle spawns)
    const livingEnemies = state.enemies.filter(e => e.alive).length;
    const pastDuration = state.tick >= stage.duration;
    const wayPastDuration = state.tick >= stage.duration + 240;
    if (stage.boss && (
        (pastDuration && livingEnemies === 0) ||
        wayPastDuration
    )) {
      spawnBoss(state, stage.boss);
      state.phase = 'boss';
      state.bossActive = true;
      state.bossEntrance = 120;
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

  // Terrain collision + proximity sparks
  if (p.alive) {
    for (const seg of state.terrain) {
      const dy = Math.abs(p.pos.y - seg.pos.y);
      if (dy > seg.height / 2 + p.height) continue;

      const gapCenter = seg.gapX * W;
      const gapHalf = seg.width / 2;
      const dx = Math.abs(p.pos.x - gapCenter);

      // Damaging collision
      if (seg.damaging && p.invulnTimer <= 0 && dy < seg.height / 2 + p.height / 2) {
        if (dx > gapHalf - p.width * 0.3) {
          hitPlayer(state, events);
          break;
        }
      }

      // Proximity sparks — flying close to terrain walls looks cool and gives bonus
      const edgeDist = gapHalf - dx;
      if (edgeDist > 0 && edgeDist < 40 && dy < seg.height / 2 + p.height) {
        // Near the wall edge — sparks!
        if (state.tick % 4 === 0 && state.particles.length < 400) {
          const sparkSide = p.pos.x < gapCenter ? -1 : 1;
          const wallX = gapCenter + sparkSide * gapHalf;
          state.particles.push({
            pos: { x: wallX, y: p.pos.y + (Math.random() - 0.5) * 10 },
            vel: { x: -sparkSide * (2 + Math.random() * 2), y: (Math.random() - 0.5) * 3 },
            life: 12, maxLife: 12,
            color: seg.type === 'crystalfield' ? '#44eeff' : seg.type === 'wormholetunnel' ? '#aa66ff' : '#ffaa44',
            size: 1.5 + Math.random(),
          });
        }
        // Score bonus for flying close (like grazing)
        if (state.tick % 10 === 0) {
          state.score += 10;
        }
      }
    }
  }

  // ── Update enemies ─────────────────────────────────────────
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    updateEnemy(state, enemy, W, H);

    // Enemy firing — bosses keep their own cooldown logic. All other
    // enemies fire EXCLUSIVELY on the music's beat (triggered by the
    // director below). The fireTimer field now counts how many beats
    // have been missed; we'll skip the cooldown tick here entirely.
    // (Beat-driven fire is handled in applyDirectorCommand → triggerFire.)
    if (enemy.type === 'boss') {
      enemy.fireTimer--;
      if (enemy.fireTimer <= 0 && p.alive) {
        fireEnemyWeapon(state, enemy, p.pos);
        enemy.fireTimer = enemy.fireCooldown;
      }
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
  // Per-type behavior driven by the weapon profiles:
  //   - Homing factor (elite orbs): rotate velocity toward player
  //   - Perpendicular sine weave (small amplitude) so the trails shimmer
  for (const bullet of state.enemyBullets) {
    // Homing — rotate velocity toward player by `homing` fraction per frame
    const h = homingFactorForBullet(bullet.color);
    if (h > 0 && p.alive) {
      const tdx = p.pos.x - bullet.pos.x;
      const tdy = p.pos.y - bullet.pos.y;
      const td = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
      const tvx = (tdx / td);
      const tvy = (tdy / td);
      const curSpeed = Math.sqrt(bullet.vel.x ** 2 + bullet.vel.y ** 2) || 1;
      // Blend current direction with target direction
      const cvx = bullet.vel.x / curSpeed;
      const cvy = bullet.vel.y / curSpeed;
      const nx = cvx + (tvx - cvx) * h;
      const ny = cvy + (tvy - cvy) * h;
      const nn = Math.sqrt(nx * nx + ny * ny) || 1;
      bullet.vel.x = (nx / nn) * curSpeed;
      bullet.vel.y = (ny / nn) * curSpeed;
    }

    bullet.pos.x += bullet.vel.x;
    bullet.pos.y += bullet.vel.y;

    // Subtle perpendicular weave (skip for very slow / drifting bullets)
    const speed = Math.sqrt(bullet.vel.x ** 2 + bullet.vel.y ** 2);
    if (speed > 1) {
      const age = (bullet.maxTtl - bullet.ttl) * 0.16;
      const phase = bullet.pos.x * 0.011;
      const perpX = -bullet.vel.y / speed;
      const perpY =  bullet.vel.x / speed;
      const wave = Math.cos(age + phase) * 0.30;
      bullet.pos.x += perpX * wave;
      bullet.pos.y += perpY * wave;
    }
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
        // ── Subsystem shielding ──
        // For bosses that carry named weapon hardpoints (T'VAK and future
        // bosses), the main hull is INVULNERABLE while ANY subsystem is
        // still alive. Bullets deflect off the shield. Player must take
        // out every subsystem first to expose the hull.
        if (enemy.type === 'boss' && enemy.weakPoints) {
          const survivingSubs = enemy.weakPoints.some(wp => wp.alive && wp.weaponType);
          if (survivingSubs) {
            // Snapshot impact point BEFORE we zero the bullet so the
            // deflect sparks render at the correct location (previously
            // they spawned at -999 which left no visible spark).
            const impactX = bullet.pos.x;
            const impactY = bullet.pos.y;
            bullet.pos.y = -999;
            bullet.ttl = 0;
            events.shieldDeflect = true;
            for (let i = 0; i < 5; i++) {
              const a = Math.random() * Math.PI * 2;
              state.particles.push({
                pos: { x: impactX, y: impactY },
                vel: { x: Math.cos(a) * 2.5, y: Math.sin(a) * 2.5 },
                life: 10, maxLife: 10, color: '#88ddff', size: 2,
              });
            }
            continue;
          }
        }

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

  // ── Obstacles — spawned exclusively by the music director ──

  // Update obstacles — calm, steady drift (no beat-driven rotation jolts)
  const musicPulse = state.beatPulse;
  for (const obs of state.obstacles) {
    obs.pos.x += obs.vel.x;
    obs.pos.y += obs.vel.y;
    obs.rotation += obs.rotSpeed;

    // Vortex — pull pulses with bass
    if (obs.type === 'vortex' && obs.pullStrength && p.alive && obs.hp > 0) {
      const dx = obs.pos.x - p.pos.x;
      const dy = obs.pos.y - p.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130 && dist > 5) {
        const pull = obs.pullStrength * (1 - dist / 130) * (1 + musicPulse * 1.5);
        p.pos.x += (dx / dist) * pull * 1.5;
        p.pos.y += (dy / dist) * pull * 1.5;
      }
    }

    // Comet — trail particles
    if (obs.type === 'comet' && state.tick % 2 === 0 && state.particles.length < 450) {
      state.particles.push({
        pos: { x: obs.pos.x + (Math.random()-0.5)*4, y: obs.pos.y + obs.radius },
        vel: { x: (Math.random()-0.5)*0.8, y: -obs.vel.y * 0.3 },
        life: 18 + Math.random()*12, maxLife: 30,
        color: Math.random() > 0.5 ? '#88ccff' : '#aaddff', size: 2 + Math.random()*2,
      });
    }

    // Energy ribbon — snakes through space, builds trail
    if (obs.type === 'energyribbon' && obs.ribbonPoints) {
      // Sinusoidal movement
      obs.pos.x += Math.sin(state.tick * 0.04 + obs.rotation * 10) * 1.5;
      // Store trail points
      if (state.tick % 3 === 0) {
        obs.ribbonPoints.push({ x: obs.pos.x, y: obs.pos.y });
        if (obs.ribbonPoints.length > 25) obs.ribbonPoints.shift();
      }
    }
  }

  // Splitter — when destroyed, breaks into smaller rocks
  const newSplits: typeof state.obstacles = [];
  state.obstacles = state.obstacles.filter(o => {
    if (o.hp <= 0 && o.type === 'splitter' && o.splitCount && o.splitCount > 0) {
      // Spawn 2-3 smaller rocks
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        newSplits.push({
          pos: { x: o.pos.x + Math.cos(angle) * 10, y: o.pos.y + Math.sin(angle) * 10 },
          vel: { x: Math.cos(angle) * 1.5 + o.vel.x, y: Math.sin(angle) * 1 + o.vel.y },
          radius: o.radius * 0.5,
          hp: Math.ceil(o.radius * 0.5 / 4),
          type: o.splitCount > 1 ? 'splitter' : 'rock',
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          splitCount: o.splitCount - 1,
        });
      }
      // Mini explosion
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        state.particles.push({
          pos: { ...o.pos }, vel: { x: Math.cos(a)*3, y: Math.sin(a)*3 },
          life: 12, maxLife: 12, color: '#887766', size: 2,
        });
      }
      state.score += 30;
      return false;
    }
    return o.pos.y < H + 60 && o.hp > 0;
  });
  state.obstacles.push(...newSplits);

  // Signature hazards (bullet curtains, pulse walls) — music-driven walls
  updateSignatureHazards(state, W, H);

  // Player bullets vs obstacles
  for (const bullet of state.playerBullets) {
    for (const obs of state.obstacles) {
      if (hitTest(bullet.pos, bullet.radius, obs.pos, obs.radius)) {
        obs.hp -= bullet.damage;
        bullet.pos.y = -999;
        events.obstacleHit = true;
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

  // ── Chain reaction — explosion zones damage nearby enemies ──
  for (const zone of state.explosionZones) {
    zone.life--;
    if (zone.life === 7) { // only apply damage on first active frame
      for (const enemy of state.enemies) {
        if (!enemy.alive) continue;
        const dx = enemy.pos.x - zone.pos.x;
        const dy = enemy.pos.y - zone.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < zone.radius) {
          const falloff = 1 - dist / zone.radius;
          enemy.hp -= Math.ceil(zone.damage * falloff);
          if (enemy.hp <= 0) {
            killEnemy(state, enemy, events);
          }
        }
      }
    }
  }
  state.explosionZones = state.explosionZones.filter(z => z.life > 0);

  // Chain timer decay
  if (state.chainTimer > 0) state.chainTimer--;
  else state.chainLevel = Math.max(0, state.chainLevel - 1);

  // ── Adaptive difficulty — decay dominance toward neutral ──
  state.dominanceScore *= 0.998;

  // ── Victory check ──────────────────────────────────────────
  if (state.bossActive && state.enemies.length === 0) {
    state.phase = 'victory';
    state.bossActive = false;
    state.slowMotion = 90;
    state.screenFlash = 1;
    state.screenFlashColor = '#ffffff';
    state.screenShake = 10;
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
    // Freeze stage-time and coin totals at the moment of victory
    state.stageStats.endTick = state.tick;
    state.stageStats.finalCoins = state.player.stars - state.stageStats.startStars;
  }

  // ── Per-stage stat tracking — aggregate from this frame's events ──
  if (events.enemyHit || events.obstacleHit || events.weakPointHit) state.stageStats.shotsHit++;
  if (events.playerHit) state.stageStats.damageTaken++;

  // ── Post-victory sequence: ship flyaway → stats reveal ──
  // 1. Boss dies → state.phase = 'victory'
  // 2. Immediately the ship's engines flare and it accelerates UP off-screen.
  // 3. Once ship is off-screen (flyaway done), the stats card animates in.
  // 4. ENTER on stats → transitions to 'briefing' phase (next stage intro).
  if (state.phase === 'victory') {
    state.victoryTimer++;
    // Flyaway starts immediately on victory — no pre-roll
    if (!state.flyawayActive) state.flyawayActive = true;
    if (state.flyawayActive && state.flyawayProgress < 1) {
      // Accelerate the ship straight up; finishes around ~130 frames
      state.flyawayProgress = Math.min(1, state.flyawayProgress + 0.015);
      const p = state.player;
      p.pos.y -= 3 + state.flyawayProgress * 18;
    }
  }

  return events;
}

// ── Helpers ────────────────────────────────────────────────
function getFireRate(p: PlayerShip): number {
  const base = Math.max(3, 8 - p.mainGunLevel);
  return p.overdriveTimer > 0 ? Math.max(2, Math.floor(base / 2)) : base;
}

function firePlayerWeapons(state: ShmupState, p: PlayerShip, fireSpecial: boolean): void {
  const PT = 120; // player bullet lifespan (long — they leave screen anyway)

  // ── MAIN GUN — visually distinct per upgrade level ──
  // Each level changes color, count, and arrangement so the player feels
  // the upgrade. The color progression goes cool → hot as power grows.
  const lvl = p.mainGunLevel;
  // Color per level: cyan → bright cyan → electric blue → violet-cyan → white-hot
  const lvlColors: Record<number, { core: string; trail: string }> = {
    1: { core: '#00ddff', trail: '#0088cc' },     // basic cyan
    2: { core: '#22eeff', trail: '#0099dd' },     // brighter cyan
    3: { core: '#44ffff', trail: '#0066ff' },     // electric blue-cyan twin
    4: { core: '#88aaff', trail: '#3344ff' },     // violet-cyan triplet
    5: { core: '#ffffff', trail: '#88ccff' },     // white-hot quad
  };
  const cc = lvlColors[Math.min(5, Math.max(1, lvl))] || lvlColors[1];
  const mainColor = cc.core;
  const dmg = 1 + Math.floor(lvl / 2);

  // Per-level bullet layout
  let mainShots: { dx: number; dy: number; vx: number; vy: number; r: number; tag?: string }[] = [];
  if (lvl <= 1) {
    // L1: single straight bolt
    mainShots = [{ dx: 0, dy: 0, vx: 0, vy: -12, r: 4 }];
  } else if (lvl === 2) {
    // L2: twin parallel bolts
    mainShots = [
      { dx: -5, dy: 0, vx: 0, vy: -12, r: 4 },
      { dx:  5, dy: 0, vx: 0, vy: -12, r: 4 },
    ];
  } else if (lvl === 3) {
    // L3: triple — center + two angled outer
    mainShots = [
      { dx: 0, dy: -2, vx: 0, vy: -13, r: 5 },
      { dx: -6, dy: 0, vx: -1.2, vy: -12, r: 4 },
      { dx:  6, dy: 0, vx:  1.2, vy: -12, r: 4 },
    ];
  } else if (lvl === 4) {
    // L4: triple with wider spread + lead pair offset
    mainShots = [
      { dx: 0, dy: -4, vx: 0, vy: -14, r: 5 },
      { dx: -8, dy: 0, vx: -1.8, vy: -12, r: 4 },
      { dx:  8, dy: 0, vx:  1.8, vy: -12, r: 4 },
      { dx: -3, dy: -2, vx: -0.5, vy: -13, r: 3 },
      { dx:  3, dy: -2, vx:  0.5, vy: -13, r: 3 },
    ];
  } else {
    // L5: quad — wider triple + offset twin escorts, all white-hot
    mainShots = [
      { dx: 0,  dy: -6, vx: 0,    vy: -15, r: 6 },
      { dx: -4, dy: -3, vx: -0.6, vy: -14, r: 4 },
      { dx:  4, dy: -3, vx:  0.6, vy: -14, r: 4 },
      { dx: -10, dy: 0, vx: -2.4, vy: -12, r: 5 },
      { dx:  10, dy: 0, vx:  2.4, vy: -12, r: 5 },
    ];
  }
  for (const s of mainShots) {
    state.playerBullets.push({
      pos: { x: p.pos.x + s.dx, y: p.pos.y - p.height / 2 + s.dy },
      vel: { x: s.vx, y: s.vy },
      damage: dmg,
      radius: s.r, isPlayer: true, color: mainColor, trail: true, ttl: PT, maxTtl: PT,
    });
  }
  // L5 muzzle flare — extra glow bullet that fades quickly
  if (lvl >= 5 && state.particles.length < 460) {
    for (let i = 0; i < 3; i++) {
      state.particles.push({
        pos: { x: p.pos.x + (Math.random()-0.5)*8, y: p.pos.y - p.height / 2 },
        vel: { x: (Math.random()-0.5)*1.5, y: -3 - Math.random()*2 },
        life: 6, maxLife: 6, color: '#ffffff', size: 2,
      });
    }
  }

  // ── WING GUNS — fan out further and add count as levels grow ──
  if (p.wingGunLevel > 0 && state.tick % (12 - p.wingGunLevel * 2) === 0) {
    const wlvl = p.wingGunLevel;
    const ws = 14 + wlvl * 3;  // wing spacing grows with level
    const wColor = wlvl >= 3 ? '#aaffff' : '#88ddff';
    const wingShots: { x: number; vx: number }[] = [];
    // L1: 2 simple, L2: 2 with slight angle, L3: 4 (twin per side), L4: 4 wider + angled
    if (wlvl <= 2) {
      wingShots.push({ x: -ws, vx: -1 - wlvl * 0.3 });
      wingShots.push({ x:  ws, vx:  1 + wlvl * 0.3 });
    } else {
      wingShots.push({ x: -ws, vx: -1 });
      wingShots.push({ x: -ws + 6, vx: -2 });
      wingShots.push({ x:  ws, vx:  1 });
      wingShots.push({ x:  ws - 6, vx:  2 });
    }
    for (const w of wingShots) {
      state.playerBullets.push({
        pos: { x: p.pos.x + w.x, y: p.pos.y - 5 },
        vel: { x: w.vx, y: -10 },
        damage: 1, radius: 3 + Math.floor(wlvl / 2),
        isPlayer: true, color: wColor, ttl: PT, maxTtl: PT,
      });
    }
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

// ══════════════════════════════════════════════════════════════════
// PER-ENEMY WEAPON PROFILES — fine-grained, ship-unique payloads
// ══════════════════════════════════════════════════════════════════
// Each enemy type has its own weapon archetype. The rule is:
//   short lifespan  → fires FREQUENTLY (every beat or two) — pulse train
//   long  lifespan  → fires SCARCELY (every 3-5 beats) — heavy item
// This inverse relationship keeps the screen from drowning in long-lived
// bullets while still giving every fire a rhythmic feel.
//
// fighter — fast laser pulses (short life, every beat)
// bomber  — drifting mines (long life, every 4 beats, slow drift)
// cruiser — plasma blobs (medium life, every 2 beats)
// elite   — homing energy orbs (medium-long life, every 3 beats, weak homing)
// turret  — precision needles (very short life, every beat)
interface WeaponProfile {
  shape: import('./types').BulletShape;
  baseR: number;            // fine-grained — typically 1.5-4 px
  baseSpeed: number;
  baseLife: number;         // frames
  beatsPerFire: number;     // cadence: longer life → more beats between fires
  count: number;            // particles per pulse
  spread: number;           // radians, fan width
  color: string;
  weaveAmp: number;         // perpendicular sine oscillation (px)
  homing: number;           // 0-1 — fraction of velocity rotated toward player each frame
  drifty: boolean;          // mines: don't aim, just drift slowly
}

const WEAPON_PROFILES: Record<string, WeaponProfile> = {
  fighter: {
    shape: 'bolt', baseR: 2.0, baseSpeed: 4.8, baseLife: 50,
    beatsPerFire: 1, count: 1, spread: 0,
    color: '#ff6655', weaveAmp: 0, homing: 0, drifty: false,
  },
  bomber: {
    // Mine — slow drifting orb with long life
    shape: 'orb', baseR: 3.5, baseSpeed: 0.7, baseLife: 320,
    beatsPerFire: 4, count: 1, spread: 0,
    color: '#ff3344', weaveAmp: 0, homing: 0, drifty: true,
  },
  cruiser: {
    // Plasma — medium blob spread
    shape: 'blob', baseR: 3.0, baseSpeed: 2.6, baseLife: 110,
    beatsPerFire: 2, count: 3, spread: 0.30,
    color: '#ff66dd', weaveAmp: 0.5, homing: 0, drifty: false,
  },
  elite: {
    // Homing orb — medium-long life, fewer shots, weak tracking
    shape: 'orb', baseR: 2.5, baseSpeed: 1.8, baseLife: 200,
    beatsPerFire: 3, count: 1, spread: 0,
    color: '#bb44ff', weaveAmp: 0, homing: 0.025, drifty: false,
  },
  turret: {
    // Needle — precision pulse, very short life
    shape: 'needle', baseR: 1.5, baseSpeed: 6.5, baseLife: 32,
    beatsPerFire: 1, count: 1, spread: 0.04,
    color: '#66ddff', weaveAmp: 0, homing: 0, drifty: false,
  },
};

function fireEnemyWeapon(state: ShmupState, enemy: Enemy, playerPos: Vec2): void {
  if (enemy.type === 'boss') {
    void playerPos;
    fireBossPattern(state, enemy);
    return;
  }

  const profile = WEAPON_PROFILES[enemy.type];
  if (!profile) return;

  // Bullet cap
  const cap = state.deathCount >= 3 ? 70 : state.deathCount >= 1 ? 90 : 120;
  if (state.enemyBullets.length > cap) return;

  // ── Beat-strength modulation ──
  // The music's amplitude shapes the size + count of each burst. Stronger
  // peaks fire SLIGHTLY more particles at slightly larger sizes; quiet
  // moments fire single small shots.
  const bs = state.currentBeatStrength;
  const sizeBoost = 1 + bs * 0.5;
  const speedBoost = 1 + bs * 0.2;
  const count = profile.count + (bs > 0.5 ? 1 : 0);

  // Aim
  const dx = state.player.pos.x - enemy.pos.x;
  const dy = state.player.pos.y - enemy.pos.y;
  const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const aimAngle = Math.atan2(dy, dx);

  for (let i = 0; i < count; i++) {
    const tFan = count === 1 ? 0 : i / (count - 1) - 0.5;
    let angle: number;
    let speed: number;
    if (profile.drifty) {
      // Mines drift slowly straight DOWN with a slight random sideways jitter
      angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      speed = profile.baseSpeed * (0.6 + Math.random() * 0.6);
    } else {
      angle = aimAngle + tFan * profile.spread;
      speed = profile.baseSpeed * speedBoost;
    }

    state.enemyBullets.push({
      pos: { x: enemy.pos.x, y: enemy.pos.y + enemy.height * 0.3 },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      damage: 1,
      radius: profile.baseR * sizeBoost,
      isPlayer: false,
      color: profile.color,
      trail: !profile.drifty,
      ttl: profile.baseLife,
      maxTtl: profile.baseLife,
      shape: profile.shape,
      // Reuse damage field as a tag — we store homing factor in the
      // damage field's high bits? No — simpler: read from the profile
      // at update time by looking up by enemy type. But the bullet
      // doesn't carry the enemy ref. We'll store the homing factor as a
      // tiny side-channel via the trail field — actually we'll just check
      // the bullet's color in update and apply homing for elite color.
    });
  }

  // Reference dist so it isn't unused (kept for potential future range gating)
  void dist;
}

// Look up a weapon profile by bullet color to recover homing factor for
// the per-bullet update tick. Cheap, side-channel-free.
function homingFactorForBullet(color: string): number {
  const profile = Object.values(WEAPON_PROFILES).find(p => p.color === color);
  return profile?.homing ?? 0;
}

// ═══════════════════════════════════════════════════════════════════
// BOSS COMBAT
// ═══════════════════════════════════════════════════════════════════
// Each boss type has a distinct combat identity. We dispatch by
// boss.type and use compact pattern primitives so the per-type code
// stays readable. Additionally every boss inherits its stage's
// MusicProfile signature mechanic and fires it occasionally (see
// fireBossSignature).

interface BossCtx {
  state: ShmupState;
  boss: Enemy;
  color: string;
  phase: number;
  pt: number;          // phaseTimer
  t: number;           // global tick
  ang: number;         // angle to player
}

// ── Pattern primitives ─────────────────────────────────────────────

function bulletAt(c: BossCtx, x: number, y: number, vx: number, vy: number, opts: { color?: string; r?: number; trail?: boolean; ttl?: number; shape?: import('./types').BulletShape } = {}) {
  c.state.enemyBullets.push({
    pos: { x, y }, vel: { x: vx, y: vy },
    damage: 1, radius: opts.r ?? 5,
    isPlayer: false, color: opts.color ?? c.color, trail: opts.trail,
    ttl: opts.ttl ?? 100, maxTtl: opts.ttl ?? 100,
    shape: opts.shape,
  });
}

function radialBurst(c: BossCtx, count: number, speed: number, angleOffset = 0) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 / count) * i + angleOffset;
    bulletAt(c, c.boss.pos.x, c.boss.pos.y, Math.cos(a) * speed, Math.sin(a) * speed);
  }
}

function aimedSpread(c: BossCtx, n: number, spread: number, speed: number) {
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5;
    const a = c.ang + t * spread;
    bulletAt(c, c.boss.pos.x, c.boss.pos.y + c.boss.height * 0.35,
      Math.cos(a) * speed, Math.sin(a) * speed,
      { color: '#ffffff', trail: true, r: 6 });
  }
}

function spiralArms(c: BossCtx, arms: number, speed: number, spinRate = 0.06) {
  for (let i = 0; i < arms; i++) {
    const a = c.t * spinRate + (Math.PI * 2 / arms) * i;
    bulletAt(c, c.boss.pos.x, c.boss.pos.y, Math.cos(a) * speed, Math.sin(a) * speed);
  }
}

function wingShots(c: BossCtx, fanSize = 5, speed = 2.5) {
  const side = c.pt % 2 === 0 ? -1 : 1;
  const originX = c.boss.pos.x + side * c.boss.width * 0.35;
  for (let i = -Math.floor(fanSize / 2); i <= Math.floor(fanSize / 2); i++) {
    const a = Math.PI / 2 + i * 0.2;
    bulletAt(c, originX, c.boss.pos.y + c.boss.height * 0.3,
      Math.cos(a) * speed, Math.sin(a) * speed);
  }
}

function bulletWall(c: BossCtx, slots = 8, gapWidth = 2) {
  const gapPos = Math.floor((Math.sin(c.t * 0.02) * 0.5 + 0.5) * (slots - gapWidth));
  for (let i = 0; i < slots; i++) {
    if (i >= gapPos && i < gapPos + gapWidth) continue;
    const x = c.boss.pos.x - c.boss.width * 0.4 + (c.boss.width * 0.8 / slots) * i;
    bulletAt(c, x, c.boss.pos.y + c.boss.height * 0.4, 0, 3, { ttl: 80, r: 4 });
  }
}

function weakPointFire(c: BossCtx) {
  if (!c.boss.weakPoints) return;
  for (const wp of c.boss.weakPoints) {
    if (!wp.alive) continue;
    const wpX = c.boss.pos.x + wp.offset.x;
    const wpY = c.boss.pos.y + wp.offset.y;
    const a = Math.atan2(c.state.player.pos.y - wpY, c.state.player.pos.x - wpX);
    bulletAt(c, wpX, wpY, Math.cos(a) * 3, Math.sin(a) * 3, { color: '#ffaa00', r: 4, ttl: 70 });
  }
}

// ── Signature mechanic — boss inherits the song's identity ─────────
// Fires the stage's signature on every Nth attack tick. Keeps the boss
// feeling like the song's climax.
function fireBossSignature(state: ShmupState, boss: Enemy) {
  const profile = profileForStage(state.currentStage);
  const W = state.screenW;
  const H = state.screenH;
  // Skip the heavy ones for low-HP bosses to avoid runaway difficulty
  fireSignature(state, profile.signature, W, H);
  // Drop a screen popup so the player knows the boss is unleashing the song
  state.popups.push({
    pos: { x: boss.pos.x, y: boss.pos.y - boss.height * 0.6 },
    text: '♫ ' + profile.signatureLabel + ' ♫',
    color: '#ff66aa', life: 36, maxLife: 36,
  });
}

// ── T'VAK multi-stage death sequence ───────────────────────────────
// Runs for ~3 seconds. Weapons explode one by one across the hull,
// reactor overloads, then a white flash + debris and the boss is
// finally cleared. Called from updateEnemy for tvak bosses while
// deathSequence > 0.
function runTvakDeathSequence(state: ShmupState, boss: Enemy): void {
  const t = (boss.deathSequence as number);
  boss.deathSequence = t + 1;

  // Tiny wobble + slow drift down to convey loss of control
  boss.pos.x += Math.sin(t * 0.12) * 0.6;
  boss.pos.y += 0.15;

  // Clear enemy bullets gradually as systems fail
  if (t % 6 === 0 && state.enemyBullets.length > 0) {
    state.enemyBullets.pop();
  }

  // Stage 1 (0-40 frames): weapon ports fail one by one with sparks
  if (t <= 40 && t % 7 === 0 && boss.weakPoints) {
    const alive = boss.weakPoints.filter(wp => wp.alive);
    if (alive.length > 0) {
      const wp = alive[Math.floor(Math.random() * alive.length)];
      wp.alive = false;
      const wx = boss.pos.x + wp.offset.x;
      const wy = boss.pos.y + wp.offset.y;
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5;
        state.particles.push({
          pos: { x: wx, y: wy },
          vel: { x: Math.cos(a) * spd, y: Math.sin(a) * spd },
          life: 22 + Math.random() * 10, maxLife: 32,
          color: Math.random() > 0.5 ? '#ffaa44' : '#ff4422',
          size: 2.5 + Math.random() * 2,
        });
      }
      state.screenShake = Math.max(state.screenShake, 4);
    }
  }

  // Stage 2 (40-100 frames): ripple of explosions across the hull
  if (t > 40 && t < 100 && t % 4 === 0) {
    const ex = boss.pos.x + (Math.random() - 0.5) * boss.width * 0.9;
    const ey = boss.pos.y + (Math.random() - 0.5) * boss.height * 0.9;
    state.screenShake = Math.max(state.screenShake, 3);
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 6;
      state.particles.push({
        pos: { x: ex, y: ey },
        vel: { x: Math.cos(a) * spd, y: Math.sin(a) * spd },
        life: 18 + Math.random() * 12, maxLife: 30,
        color: Math.random() > 0.6 ? '#ffffff' : Math.random() > 0.5 ? '#ffaa44' : '#ff4422',
        size: 2.5 + Math.random() * 2.5,
      });
    }
  }

  // Stage 3 (100-140 frames): reactor overload — pulsing red glow + bigger booms
  if (t >= 100 && t < 140) {
    if (t % 3 === 0) {
      const ex = boss.pos.x + (Math.random() - 0.5) * boss.width * 0.5;
      const ey = boss.pos.y + (Math.random() - 0.5) * boss.height * 0.5;
      for (let i = 0; i < 22; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 7;
        state.particles.push({
          pos: { x: ex, y: ey },
          vel: { x: Math.cos(a) * spd, y: Math.sin(a) * spd },
          life: 25 + Math.random() * 15, maxLife: 40,
          color: Math.random() > 0.5 ? '#ffffff' : '#ff4422',
          size: 3 + Math.random() * 3,
        });
      }
      state.screenShake = Math.max(state.screenShake, 5);
    }
  }

  // Stage 4 (140 frame): WHITE FLASH and final detonation
  if (t === 140) {
    state.screenFlash = 1;
    state.screenFlashColor = '#ffffff';
    state.screenShake = 12;
    // Massive radial particle burst
    for (let i = 0; i < 120; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 4 + Math.random() * 10;
      state.particles.push({
        pos: { ...boss.pos },
        vel: { x: Math.cos(a) * spd, y: Math.sin(a) * spd },
        life: 40 + Math.random() * 30, maxLife: 70,
        color: Math.random() > 0.5 ? '#ffffff' : Math.random() > 0.5 ? '#ffaa44' : '#ff4422',
        size: 3 + Math.random() * 4,
      });
    }
    // Expanding shockwave ring
    state.explosionZones.push({
      pos: { ...boss.pos },
      radius: Math.max(state.screenW, state.screenH) * 0.7,
      damage: 0,
      life: 30,
    });
  }

  // Stage 5 (140-180): debris drifts down + slow-mo
  if (t > 140 && t < 180 && t % 5 === 0) {
    // Drifting debris chunks
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2;
      state.particles.push({
        pos: { x: boss.pos.x + (Math.random()-0.5)*boss.width*0.6, y: boss.pos.y + (Math.random()-0.5)*boss.height*0.6 },
        vel: { x: Math.cos(a) * 1.5, y: 1 + Math.random() * 1.5 },
        life: 80, maxLife: 80, color: '#5a5560', size: 3 + Math.random() * 2,
      });
    }
  }

  // Complete — call killEnemy for real and push the boss off-screen so
  // the enemy-filter removes it. Without this push the boss sits dead at
  // the top of the screen forever (pos.y < H + 100 keeps it in the array)
  // and state.enemies.length === 0 never becomes true → victory never
  // triggers and the game appears to lock up.
  if (t >= 180) {
    boss.hp = 0;
    state.slowMotion = 90;
    killEnemy(state, boss, { bossKilled: true });
    boss.pos.y = state.screenH + 200; // ensure filter removes it next frame
  }
}

// ── Per-boss-type combat ───────────────────────────────────────────

function fireBossPattern(state: ShmupState, boss: Enemy): void {
  if (state.enemyBullets.length > 65) return;
  const phase = boss.phase || 0;
  const pt = boss.phaseTimer || 0;
  const c: BossCtx = {
    state, boss,
    color: FACTION_COLORS[boss.faction],
    phase, pt,
    t: state.tick,
    ang: Math.atan2(state.player.pos.y - boss.pos.y, state.player.pos.x - boss.pos.x),
  };

  // (Removed periodic boss signature pulse — it was firing the stage's
  // signature mechanic (e.g. bullet curtain) on top of the boss's own
  // weapons, producing a surprise horizontal sweep across the screen.
  // The boss has plenty of attack patterns of its own.)

  switch (boss.bossType) {
    // ── 0. T'VAK CLASS ASSAULT VESSEL (Klingon, stage 1) ───────
    // Per-hardpoint firing: each weak point fires its own pattern on
    // its own cooldown. Destroying a hardpoint disables that weapon.
    // Phase gates which weapons are online:
    //   phase 0 (100-75% HP): disruptor + plasma only (warmup)
    //   phase 1 ( 75-50% HP): + missile + phaser  (weapons online)
    //   phase 2 ( 50-25% HP): + tractor + torpedo (damage state)
    //   phase 3 (<25% HP):    everything + faster cadence (final form)
    case 'tvak': {
      if (!boss.weakPoints) break;
      const speedBoost = phase >= 3 ? 0.5 : 0; // rage mode fires harder
      const rateBoost = phase >= 3 ? 0.55 : phase >= 2 ? 0.75 : 1; // smaller = faster
      for (const wp of boss.weakPoints) {
        if (!wp.alive || !wp.weaponType) continue;
        // Gate by phase
        const w = wp.weaponType;
        if (phase < 1 && (w === 'missile' || w === 'phaser')) continue;
        if (phase < 2 && (w === 'tractor' || w === 'torpedo')) continue;

        wp.fireTimer = (wp.fireTimer ?? 0) - 1;
        if (wp.fireTimer > 0) continue;
        wp.fireTimer = Math.floor((wp.fireCooldown ?? 100) * rateBoost);

        const wx = boss.pos.x + wp.offset.x;
        const wy = boss.pos.y + wp.offset.y;
        const col = wp.color || c.color;

        if (w === 'disruptor') {
          // Aimed bolt — long, fast, lance-like
          const a = Math.atan2(state.player.pos.y - wy, state.player.pos.x - wx);
          bulletAt(c, wx, wy, Math.cos(a) * (4.5 + speedBoost), Math.sin(a) * (4.5 + speedBoost),
            { color: col, r: 5, trail: true, ttl: 90, shape: 'bolt' });
        } else if (w === 'missile') {
          // Pink missile pair with downward arc + actual missile sprite
          for (const side of [-1, 1]) {
            const a = Math.PI / 2 + side * 0.25;
            bulletAt(c, wx + side * 4, wy + 6, Math.cos(a) * 1.8, Math.sin(a) * 2.6,
              { color: col, r: 6, trail: true, ttl: 140, shape: 'missile' });
          }
        } else if (w === 'plasma') {
          // Wide purple plasma fan — BIG glowing orbs
          for (let i = -2; i <= 2; i++) {
            const a = Math.PI / 2 + i * 0.22;
            bulletAt(c, wx, wy + 4, Math.cos(a) * 2.6, Math.sin(a) * 2.6,
              { color: col, r: 7, ttl: 110, shape: 'blob' });
          }
        } else if (w === 'tractor') {
          // Tractor pulse — visual purple ring + slow effect if player is near
          for (let i = 0; i < 16; i++) {
            const a = (Math.PI * 2 / 16) * i;
            state.particles.push({
              pos: { x: wx, y: wy },
              vel: { x: Math.cos(a) * 3, y: Math.sin(a) * 3 },
              life: 26, maxLife: 26, color: col, size: 3,
            });
          }
          // Slow player if they're within range of the pulse
          const dx = state.player.pos.x - wx;
          const dy = state.player.pos.y - wy;
          if (Math.sqrt(dx * dx + dy * dy) < 180) {
            state.player.tractorSlowTimer = Math.max(state.player.tractorSlowTimer, 50);
          }
        } else if (w === 'phaser') {
          // Green phaser lance — thin elongated streak
          for (let i = -1; i <= 1; i++) {
            const a = Math.PI / 2 + i * 0.15 + (Math.random() - 0.5) * 0.1;
            bulletAt(c, wx, wy + 4, Math.cos(a) * 3.6, Math.sin(a) * 3.6,
              { color: col, r: 4, trail: true, ttl: 80, shape: 'phaserlance' });
          }
        } else if (w === 'torpedo') {
          // Heavy slow red torpedo — single big bomb with halo
          const a = Math.atan2(state.player.pos.y - wy, state.player.pos.x - wx);
          bulletAt(c, wx, wy + 6, Math.cos(a) * 1.6, Math.sin(a) * 1.6,
            { color: col, r: 9, trail: true, ttl: 180, shape: 'torpedo' });
        }
      }
      // Final-form bonus: central reactor cannon — heavy aimed barrage
      if (phase >= 3 && pt % 24 === 0) {
        aimedSpread(c, 5, 0.4, 4 + speedBoost);
      }
      break;
    }

    // ── 1. K'TAGH WARBIRD (curtain, klingon) ───────────────────
    case 'warbird':
      if (phase === 0) wingShots(c);
      else if (phase === 1) { wingShots(c, 7, 2.8); if (pt % 3 === 0) aimedSpread(c, 1, 0, 4); }
      else { bulletWall(c, 10, 2); if (pt % 4 === 0) aimedSpread(c, 3, 0.3, 4); }
      break;

    // ── 2. IRW VALDORE DREADNOUGHT (loop, romulan) ────────────
    case 'dreadnought':
      if (phase === 0) spiralArms(c, 3, 2.6, 0.04);
      else if (phase === 1) { spiralArms(c, 5, 3, 0.05); if (pt % 5 === 0) aimedSpread(c, 1, 0, 4.5); }
      else if (phase === 2) { radialBurst(c, 12, 2.5, c.t * 0.03); if (pt % 3 === 0) aimedSpread(c, 3, 0.4, 4); }
      else { spiralArms(c, 6, 3.5, 0.08); radialBurst(c, 8, 2, -c.t * 0.04); weakPointFire(c); }
      break;

    // ── 3. ORION FLAGSHIP (siege, orion) ──────────────────────
    case 'flagship':
      if (phase === 0) aimedSpread(c, 3, 0.4, 3);
      else if (phase === 1) { wingShots(c, 7, 3); if (pt % 3 === 0) aimedSpread(c, 5, 0.5, 3.5); }
      else if (phase === 2) { radialBurst(c, 8, 2.8); if (pt % 4 === 0) aimedSpread(c, 5, 0.6, 4); }
      else if (phase === 3) { bulletWall(c, 9, 2); if (pt % 3 === 0) aimedSpread(c, 3, 0.3, 5); }
      else { spiralArms(c, 4, 3.5); aimedSpread(c, 5, 0.5, 4.5); weakPointFire(c); }
      break;

    // ── 4. SINGULARITY MARAUDER (vortex_storm, romulan) ───────
    case 'gravitymarauder':
      if (phase === 0) { spiralArms(c, 4, 1.8, 0.025); if (pt % 6 === 0) aimedSpread(c, 1, 0, 3.5); }
      else if (phase === 1) { spiralArms(c, 6, 2.2, 0.035); if (pt % 4 === 0) aimedSpread(c, 3, 0.5, 3.5); }
      else if (phase === 2) { radialBurst(c, 14, 2, c.t * 0.02); if (pt % 5 === 0) weakPointFire(c); }
      else { spiralArms(c, 5, 2.6, -0.04); radialBurst(c, 10, 2.4, c.t * 0.03); weakPointFire(c); }
      break;

    // ── 5. ANOMALY GUARDIAN (pulse_walls, klingon) ────────────
    case 'guardian':
      if (phase === 0) wingShots(c, 5, 2.6);
      else if (phase === 1) { aimedSpread(c, 5, 0.5, 3.5); if (pt % 4 === 0) spiralArms(c, 3, 3); }
      else if (phase === 2) { bulletWall(c, 9, 2); if (pt % 3 === 0) aimedSpread(c, 3, 0.4, 4); }
      else { wingShots(c, 9, 3.2); spiralArms(c, 4, 3); weakPointFire(c); }
      break;

    // ── 6. RIFT SOVEREIGN (swarm, romulan) ────────────────────
    case 'sovereign':
      if (phase === 0) aimedSpread(c, 5, 0.6, 3);
      else if (phase === 1) { aimedSpread(c, 7, 0.8, 3.5); if (pt % 3 === 0) radialBurst(c, 6, 2.2); }
      else if (phase === 2) { spiralArms(c, 6, 3, 0.07); aimedSpread(c, 3, 0.4, 4); }
      else { aimedSpread(c, 9, 0.9, 4); radialBurst(c, 10, 2.8, c.t * 0.05); weakPointFire(c); }
      break;

    // ── 7. FORTRESS COMMAND (siege, orion) ────────────────────
    case 'fortress':
      if (phase === 0) bulletWall(c, 8, 3);
      else if (phase === 1) { bulletWall(c, 10, 2); if (pt % 4 === 0) aimedSpread(c, 3, 0.3, 4); }
      else if (phase === 2) { wingShots(c, 7, 3); bulletWall(c, 9, 2); }
      else if (phase === 3) { radialBurst(c, 12, 2.8); aimedSpread(c, 3, 0.4, 4.5); }
      else { bulletWall(c, 12, 1); spiralArms(c, 5, 3.2); weakPointFire(c); }
      break;

    // ── 8. SINGULARITY DREADNOUGHT (curtain, klingon) ─────────
    case 'singularity':
      if (phase === 0) { wingShots(c, 5, 2.6); if (pt % 4 === 0) aimedSpread(c, 1, 0, 4); }
      else if (phase === 1) { bulletWall(c, 10, 2); if (pt % 3 === 0) aimedSpread(c, 3, 0.3, 4); }
      else if (phase === 2) { bulletWall(c, 12, 2); spiralArms(c, 3, 3); }
      else if (phase === 3) { bulletWall(c, 12, 1); aimedSpread(c, 5, 0.5, 4); }
      else { bulletWall(c, 14, 1); spiralArms(c, 5, 3.5); weakPointFire(c); }
      break;

    // ── 9. EVENT HORIZON TYRANT (vortex_storm, klingon) ───────
    case 'voidtyrant':
      if (phase === 0) { spiralArms(c, 6, 2.5, 0.04); if (pt % 5 === 0) aimedSpread(c, 3, 0.4, 3.5); }
      else if (phase === 1) { spiralArms(c, 8, 2.8, 0.05); radialBurst(c, 6, 2, c.t * 0.04); }
      else if (phase === 2) { spiralArms(c, 6, 3.2, -0.06); aimedSpread(c, 5, 0.6, 4); }
      else if (phase === 3) { radialBurst(c, 16, 2.5, c.t * 0.04); if (pt % 4 === 0) aimedSpread(c, 3, 0.3, 5); }
      else { spiralArms(c, 8, 3.5, 0.08); radialBurst(c, 12, 3, -c.t * 0.05); weakPointFire(c); }
      break;

    // ── 10. PHASE WRAITH (drone, romulan) ─────────────────────
    case 'wraith':
      // Wraith fires sustained sparse but heavy patterns
      if (phase === 0) { aimedSpread(c, 1, 0, 5); if (pt % 8 === 0) radialBurst(c, 8, 2.4); }
      else if (phase === 1) { aimedSpread(c, 3, 0.4, 4.5); if (pt % 5 === 0) spiralArms(c, 4, 3); }
      else if (phase === 2) { spiralArms(c, 5, 3, 0.07); aimedSpread(c, 5, 0.5, 4); }
      else if (phase === 3) { radialBurst(c, 14, 2.6, c.t * 0.04); aimedSpread(c, 3, 0.3, 5); }
      else { spiralArms(c, 7, 3.5, 0.09); radialBurst(c, 10, 2.8, -c.t * 0.06); weakPointFire(c); }
      break;

    // ── 11. OMEGA SUPREME (finale, orion) ─────────────────────
    case 'omega':
      // Final boss combines every pattern across its 6 phases
      if (phase === 0) wingShots(c, 7, 3);
      else if (phase === 1) { spiralArms(c, 5, 3, 0.06); aimedSpread(c, 3, 0.3, 4); }
      else if (phase === 2) { bulletWall(c, 10, 2); aimedSpread(c, 5, 0.6, 4); }
      else if (phase === 3) { radialBurst(c, 16, 2.8, c.t * 0.04); aimedSpread(c, 3, 0.3, 5); }
      else if (phase === 4) { spiralArms(c, 8, 3.5, 0.08); bulletWall(c, 12, 1); }
      else { spiralArms(c, 10, 3.8, 0.1); radialBurst(c, 14, 3, -c.t * 0.06); aimedSpread(c, 5, 0.5, 5); weakPointFire(c); }
      break;

    // ── Fallback for anything we missed ────────────────────────
    default:
      wingShots(c);
      break;
  }

  // All phases: occasional minion spawn from later-phase bosses
  if (phase >= 1 && pt % Math.max(120, 320 - phase * 80) === 0) {
    const side = Math.random() < 0.5 ? 0.1 : 0.9;
    spawnEnemy(state, 'fighter', boss.faction, state.screenW * side);
    if (phase >= 3) spawnEnemy(state, 'fighter', boss.faction, state.screenW * (1 - side));
  }
}

// Default movement style by enemy type when the director doesn't specify one.
// Loose formations and ad-hoc spawns flow through this. Each type has its own
// flavor so the screen has visual variety even without explicit choreography.
function defaultMoveStyle(type: EnemyType): MoveStyle {
  switch (type) {
    case 'fighter': return Math.random() < 0.7 ? 'patrol' : 'dive';
    case 'bomber':  return 'drift';
    case 'cruiser': return 'patrol';
    case 'elite':   return Math.random() < 0.5 ? 'orbit' : 'patrol';
    case 'turret':  return 'anchor';
    case 'boss':    return 'drift';
  }
}

function spawnEnemy(
  state: ShmupState,
  type: EnemyType,
  faction: Faction,
  x: number,
  path?: any[],
  hp?: number,
  dropType?: PowerUpType,
  moveStyle?: MoveStyle,
  formationId?: number,
  yOffset?: number,
): void {
  const stats = ENEMY_STATS[type];
  // Gentle difficulty curve — barely any pressure early, steadily builds
  const duration = state.stages[state.currentStage]?.duration || 2100;
  const progress = Math.min(state.tick / duration, 1);
  const stageBonus = 1 + state.currentStage * 0.12;
  // ── HP scales with PLAYER POWER ──
  // A maxed-out loadout sees ~2.4x HP enemies. Without this scaling, late-
  // game weapons (level 3 phaser, missiles, drone) one-frame everything.
  // Pawn formations pass an explicit low hp value that still scales — they
  // remain expendable shields but not entirely free.
  const power = playerPower(state);
  const powerMult = 1 + power * 1.4;
  const hpScale = (0.8 + progress * 0.7) * stageBonus * powerMult;
  // Fire rate: starts at 170% cooldown (very slow), drops to 70% (fast) by end
  const fireScale = Math.max(0.7, 1.7 - progress * 1.0);
  const scaledHp = Math.max(1, Math.ceil((hp || stats.hp) * hpScale));
  const W = state.screenW;
  const H = state.screenH;
  const style: MoveStyle = moveStyle ?? defaultMoveStyle(type);
  // Where this ship wants to settle vertically (used by patrol/anchor/orbit)
  const settleY =
    type === 'turret'  ? H * 0.18 :
    type === 'cruiser' ? H * 0.30 :
    type === 'elite'   ? H * 0.35 :
    type === 'bomber'  ? H * 0.45 :
                         H * 0.38;
  state.enemies.push({
    id: nextEnemyId++,
    type, faction,
    pos: { x, y: -stats.height + (yOffset ?? 0) },
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
    moveStyle: style,
    formationId,
    homeX: x,
    moveSeed: Math.random() * Math.PI * 2,
    settleY,
    enterTimer: 0,
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
      color = '#2a2530';   // dark space-rock, matches background better
      height = 50 + Math.random() * 30;
      damaging = true;     // solid rock walls — touching = death
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
    const segY = -height - i * (height + 30);

    state.terrain.push({
      pos: { x: W / 2, y: segY },
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

    // ── Asteroid corridor: spawn real destroyable rock obstacles per segment.
    // The flying clusters in the screenshot need to be solid (kill ship on
    // contact) and shootable (player can blast their way through). Real
    // Obstacle entities already handle both, so we spawn them here instead
    // of drawing decorative asteroids in the renderer.
    if (type === 'asteroidcorridor') {
      const leftEdgeX = W * gapX - gapWidth / 2;
      const rightEdgeX = W * gapX + gapWidth / 2;
      const spawnRockCluster = (side: -1 | 1) => {
        const count = 4 + Math.floor(Math.random() * 2);
        for (let r = 0; r < count; r++) {
          const radius = 14 + Math.random() * 14;
          // X: scattered within the wall area, biased toward the gap edge
          // so the cluster reads as a barrier next to the safe gap.
          const wallX = side === -1
            ? leftEdgeX - 8 - Math.random() * (leftEdgeX * 0.6)
            : rightEdgeX + 8 + Math.random() * ((W - rightEdgeX) * 0.6);
          // Y: scattered within the segment height (with some overhang)
          const wallY = segY + (Math.random() - 0.4) * height * 2;
          state.obstacles.push({
            pos: { x: wallX, y: wallY },
            vel: { x: driftDir * 1.2 + (Math.random() - 0.5) * 0.3, y: 1.4 + state.scrollSpeed * 0.9 },
            radius,
            hp: Math.ceil(radius / 4),
            type: 'rock',
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.025,
          });
        }
      };
      spawnRockCluster(-1);
      spawnRockCluster(+1);
    }
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
      // STARBASE — recruit crew + arm up. Stations are the firepower outpost:
      // every capture gives at least one crew (wing/main gun bump) plus
      // weapon upgrades. The clearest "I'm getting stronger" loot in the game.
      lootTable = ['crew', 'crew', 'weapon', 'missile', 'bomb', 'star', 'star'];
      radius = 38;
      captureTime = 100;
      name = 'STARBASE';
      break;
    case 'planet':
      // COLONY — defensive resources: lives, shields, magnet (food / safety).
      lootTable = ['life', 'shield', 'shield', 'magnet', 'star', 'star', 'star', 'star'];
      radius = 52;
      captureTime = 130; // takes longer but biggest reward
      name = 'COLONY WORLD';
      break;
    case 'derelict':
      // DERELICT WARSHIP — salvaged offensive systems. Lots of weapons, rare crew.
      lootTable = ['weapon', 'missile', 'laser', 'phaser', 'emp', 'overdrive', 'crew'];
      radius = 32;
      captureTime = 80;
      name = 'DERELICT WARSHIP';
      break;
    case 'beacon':
      // NAV BEACON — intel/buffs: scoring + magnets + drones.
      lootTable = ['overdrive', 'score2x', 'drone', 'magnet'];
      radius = 22;
      captureTime = 50;
      name = 'NAV BEACON';
      break;
    case 'tradeship':
      // MERCHANT — coins, magnets, occasional crew (hired hand).
      lootTable = ['star', 'star', 'star', 'star', 'star', 'magnet', 'shield', 'crew'];
      radius = 30;
      captureTime = 65;
      name = 'MERCHANT VESSEL';
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
  const weakPoints: import('./types').WeakPoint[] = [];
  const phaseCount = Math.max(1, config.phases || 3);

  if (config.type === 'tvak') {
    // T'VAK CLASS — 6 named weapon hardpoints, each destroyable, positioned
    // to match the canonical Klingon War Bird layout from the concept art:
    //   disruptor cannons   — top inner (red)
    //   missile bays        — top outer (pink)
    //   plasma turrets      — mid outer (purple swirls)
    //   tractor beam        — far mid outer (purple swirls)
    //   phaser arrays       — bottom inner (green)
    //   forward torpedoes   — bottom-center cluster (red)
    const cw = config.width;
    const ch = config.height;
    const hardpoint = (x: number, y: number, weapon: import('./types').WeakPoint['weaponType'], label: string, color: string, hpFrac: number, cooldown: number) => ({
      offset: { x, y },
      hp: Math.floor(config.hp * hpFrac),
      maxHp: Math.floor(config.hp * hpFrac),
      alive: true,
      weaponType: weapon,
      label,
      color,
      fireTimer: Math.floor(Math.random() * cooldown),
      fireCooldown: cooldown,
    });
    // Hardpoint positions tuned to match the concept art's mounting points.
    // Left side of the ship gets one of each pair; the renderer mirrors the
    // visual mounts so each subsystem reads as TWO physical cannons firing
    // together (one weak point destroys both visible cannons).
    // HP per subsystem is generous — the player has to commit to taking
    // each one down before the hull becomes vulnerable. With boss HP=1200
    // and 6 subsystems at ~14% HP each (~170 HP each), full subsystem
    // teardown is ~1020 damage worth of work before you even touch the hull.
    weakPoints.push(
      hardpoint(-cw * 0.22, -ch * 0.40, 'disruptor', 'DISRUPTOR', '#ff44ee', 0.14, 95),
      hardpoint( cw * 0.36, -ch * 0.34, 'missile',   'MISSILE',   '#ff66cc', 0.14, 140),
      hardpoint(-cw * 0.40, -ch * 0.06, 'plasma',    'PLASMA',    '#bb44ff', 0.16, 85),
      hardpoint( cw * 0.42,  ch * 0.18, 'tractor',   'TRACTOR',   '#aa44ff', 0.16, 240),
      hardpoint(-cw * 0.32,  ch * 0.34, 'phaser',    'PHASER',    '#ff44aa', 0.14, 70),
      hardpoint( 0,           ch * 0.46, 'torpedo',   'TORPEDO',   '#ff3030', 0.16, 110),
    );
  } else {
    // Generic boss: ring of evenly-spaced weak points
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
  }

  // T'VAK has per-weapon cooldowns on its weak points, so the master
  // fireCooldown runs every frame — fireBossPattern then dispatches to
  // each active hardpoint based on the weapon's own cadence.
  const isTvak = config.type === 'tvak';

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
    fireTimer: isTvak ? 90 : 60, // grace period before first shot
    fireCooldown: isTvak ? 1 : 18,
    pathIdx: 0,
    phase: 0,
    phaseTimer: 0,
    phaseCount,
    weakPoints,
    bossType: config.type,
  });
  state.bossHp = config.hp;
  state.bossMaxHp = config.hp;
  state.scrollSpeed = 0;
}

function updateEnemy(state: ShmupState, enemy: Enemy, W: number, H: number): void {
  if (enemy.type === 'boss') {
    // ── T'VAK death sequence — runs in place of normal combat ──
    if (enemy.deathSequence !== undefined && enemy.deathSequence > 0) {
      runTvakDeathSequence(state, enemy);
      return;
    }

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
      // Destroy a weak point on phase change — but ONLY for generic bosses
      // with the default ring layout. T'VAK and any boss with named
      // weaponType hardpoints requires the player to take them out.
      if (enemy.weakPoints && enemy.bossType !== 'tvak') {
        const aliveWP = enemy.weakPoints.filter(wp => wp.alive && !wp.weaponType);
        if (aliveWP.length > 0) {
          aliveWP[0].alive = false;
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

  // ── Non-boss movement — dispatch on moveStyle ──
  // Each ship has a moveStyle assigned at spawn (defaultMoveStyle by type, or
  // a director-supplied override). The style determines flight pattern;
  // homeX, moveSeed, settleY, and enterTimer are per-enemy memory used by
  // the styles to remain smooth and individual.
  enemy.enterTimer = (enemy.enterTimer ?? 0) + 1;
  const t = state.tick;
  const seed = enemy.moveSeed ?? (enemy.id * 0.73);
  const duration = state.stages[state.currentStage]?.duration || 2100;
  const progress = Math.min(state.tick / duration, 1);
  // Gentle ramp — slow drift early, full pace by end. Top speed cut roughly
  // 40% vs the old code so small ships no longer "zoom" across.
  const speedRamp = 0.55 + progress * 0.45;
  const rawSpeed = {
    fighter: 0.95, bomber: 0.75, cruiser: 0.55, elite: 0.85, turret: 0.40, boss: 0,
  }[enemy.type] || 0.8;
  const baseSpeed = rawSpeed * speedRamp;
  const homeX = enemy.homeX ?? enemy.pos.x;
  const settleY = enemy.settleY ?? H * 0.4;
  const style: MoveStyle = enemy.moveStyle ?? 'drift';

  switch (style) {
    case 'formation': {
      // Locked to homeX, descends straight with a gentle group-bob. The
      // formationId-shared phase keeps a squadron rocking in sync — looks
      // like a flight pattern instead of independent oscillators.
      const fphase = enemy.formationId !== undefined ? enemy.formationId * 1.7 : seed;
      enemy.pos.x = homeX + Math.sin(t * 0.025 + fphase) * 4;
      enemy.pos.y += baseSpeed;
      break;
    }
    case 'patrol': {
      // Curve in to settleY, then strafe left-right across a band that
      // straddles homeX. Below settleY they coast slowly downward so they
      // eventually clear the screen instead of camping forever.
      const eased = Math.min(1, enemy.enterTimer / 60); // 1 second to settle
      if (enemy.pos.y < settleY) {
        // Easing entry — quick start, gentle settle
        enemy.pos.y += baseSpeed * (1 + (1 - eased) * 1.4);
      } else {
        enemy.pos.y += baseSpeed * 0.25;
      }
      // Strafe begins as soon as they're descending; widens once settled
      const strafeWidth = W * 0.18 * eased;
      enemy.pos.x = homeX + Math.sin(t * 0.018 + seed) * strafeWidth;
      break;
    }
    case 'drift': {
      // Slow, heavy descent with a small lateral wobble. Bombers and
      // anything that wants to feel weighty.
      enemy.pos.x += Math.sin(t * 0.008 + seed) * 0.35;
      enemy.pos.y += baseSpeed;
      break;
    }
    case 'orbit': {
      // Circle around a center that drifts slowly downward. Each ship has
      // its own radius and phase so a pair never overlaps. Looks like
      // they're "flying around the screen" — exactly the user's ask.
      const radius = W * 0.10 + (seed % 1) * W * 0.05;
      const omega = 0.022 + (seed % 1) * 0.008;
      enemy.pos.x = homeX + Math.cos(t * omega + seed) * radius;
      enemy.pos.y += baseSpeed * 0.6;
      // Add a vertical bob to make the orbit visibly elliptical
      enemy.pos.y += Math.sin(t * omega * 2 + seed) * 0.25;
      break;
    }
    case 'dive': {
      // Aggressive curved approach — angles toward the player's current x
      // for the first second, then continues past. Used by side-rush
      // formations and ~20% of free-flying fighters.
      const target = enemy.enterTimer < 60 ? state.player.pos.x : homeX + (homeX - W / 2);
      const lerp = 0.025;
      enemy.pos.x += (target - enemy.pos.x) * lerp;
      enemy.pos.y += baseSpeed * 1.4;
      break;
    }
    case 'anchor': {
      // Settle high on the screen and hold position with tiny drift. The
      // turret archetype — fires from a fixed platform until destroyed.
      if (enemy.pos.y < settleY) {
        enemy.pos.y += baseSpeed;
      } else {
        // Damped settle, then micro-drift
        enemy.pos.y += (settleY - enemy.pos.y) * 0.05;
        enemy.pos.x = homeX + Math.sin(t * 0.006 + seed) * 6;
      }
      break;
    }
  }

  // Edge-deflect — push enemies back into the playfield rather than letting
  // them ride the wall. Stronger than the old 0.5px nudge so orbit/patrol
  // styles can't slip off-screen.
  const margin = enemy.width;
  if (enemy.pos.x < margin) enemy.pos.x += (margin - enemy.pos.x) * 0.15;
  if (enemy.pos.x > W - margin) enemy.pos.x -= (enemy.pos.x - (W - margin)) * 0.15;

  // Remove if far off screen bottom
  if (enemy.pos.y > H + 80) enemy.alive = false;
}

function killEnemy(state: ShmupState, enemy: Enemy, events: ShmupEvents): void {
  // Stats tracking — count kills (boss death sequence calls killEnemy twice
  // so we guard against double counting)
  if (enemy.alive) {
    state.stageStats.kills++;
    if (enemy.type === 'boss') state.stageStats.bossKilled = true;
  }

  // T'VAK CLASS — multi-stage death sequence (3 seconds). First kill call
  // pins HP at 1, starts the sequence, and silences combat. The sequence
  // advances in updateBossDeathSequence below; when it completes it calls
  // this function again with deathSequence already set, and we fall
  // through to the standard kill path.
  if (
    enemy.type === 'boss' &&
    enemy.bossType === 'tvak' &&
    enemy.deathSequence === undefined
  ) {
    enemy.deathSequence = 1;
    enemy.hp = 1;
    // Freeze the boss's combat — clear all enemy bullets and stop firing
    enemy.fireTimer = 99999;
    return;
  }

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

  // Combo streak rewards — every 15 kills in a row drops a bonus. No popup
  // or flash; the dropped power-up itself is the visible reward.
  if (state.combo > 0 && state.combo % 15 === 0) {
    const bonusTypes: PowerUpType[] = ['emp', 'overdrive', 'drone', 'score2x', 'bomb', 'shield'];
    const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    state.powerUps.push({
      pos: { ...enemy.pos }, vel: { x: 0, y: -1 },
      type: bonusType, value: 1, magnetizable: false,
    });
  }

  // ═══ CHAIN REACTION — explosion damages nearby enemies ═══
  const blastRadius = { fighter: 45, bomber: 65, cruiser: 100, elite: 80, turret: 50, boss: 150 }[enemy.type] || 50;
  // Music amplifies explosions — drops make 50% bigger blasts
  const musicBoost = state.musicIntensity > 0.7 ? 1.5 : 1;
  state.explosionZones.push({
    pos: { ...enemy.pos },
    radius: blastRadius * musicBoost,
    damage: 3 + state.chainLevel,
    life: 8,
  });
  // Increment chain
  state.chainLevel = Math.min(8, state.chainLevel + 1);
  state.chainTimer = 50;

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
    case 'crew':
      // Extra crew man the wing guns — bumps wingGunLevel. If wings are
      // already maxed, bumps main cannon instead. Either way, more firepower.
      if (p.wingGunLevel < 4) {
        p.wingGunLevel = Math.min(4, p.wingGunLevel + 1);
        flashText = `CREW ABOARD — WING LVL ${p.wingGunLevel}`;
      } else if (p.mainGunLevel < 5) {
        p.mainGunLevel = Math.min(5, p.mainGunLevel + 1);
        flashText = `CREW ABOARD — CANNON LVL ${p.mainGunLevel}`;
      } else {
        // Fully maxed — give a shield instead
        p.shields = Math.min(p.maxShields + 2, p.shields + 1);
        flashText = 'CREW ABOARD — SHIELDS +1';
      }
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
      p.lockOnPhaserReady = true; // unlock lock-on with first phaser pickup
      flashText = `PHASER LVL ${p.phaserLevel} — LOCK-ON READY`;
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
      p.droneTimer = 1500; // 25 seconds
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
      // For named-weapon subsystems (T'VAK) the main hull is shielded
      // until they're all down — weak point damage no longer bleeds into
      // the hull. For old-style anonymous weak points the existing
      // weak-point-leaks-hull-damage behavior is kept.
      if (!wp.weaponType) {
        boss.hp -= bullet.damage;
      }
      bullet.pos.y = -999;
      bullet.ttl = 0;
      events.enemyHit = true;
      events.weakPointHit = true;

      // Crit spark
      state.particles.push({
        pos: { x: wpX, y: wpY }, vel: { x: 0, y: 0 },
        life: 6, maxLife: 6, color: '#ffff00', size: 8,
      });

      if (wp.hp <= 0) {
        wp.alive = false;
        state.stageStats.subsystemsDestroyed++;
        if (!wp.weaponType) {
          // Anonymous weak point: bonus 5% hull damage on destruction
          boss.hp -= Math.floor(boss.maxHp * 0.05);
        }
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

  // ── SIGNATURE MECHANIC TRIGGER ──────────────────────────────────
  // The director declares which signature to fire (one per song profile).
  // The engine spawns the actual challenge here. This is the music
  // literally creating gameplay events.
  if (cmd.signatureTrigger) {
    const profile = profileForStage(state.currentStage);
    state.signatureLabel = profile.signatureLabel;
    state.signatureLabelTimer = 90;
    fireSignature(state, cmd.signatureTrigger, W, H);
  }

  // Music drop transformation — evolve enemies on big moments
  if (cmd.fleetEvent) {
    state.dropCount++;
    // Every 2nd drop: on-screen fighters evolve into elites (reality shift)
    if (state.dropCount % 2 === 0) {
      let evolved = 0;
      for (const enemy of state.enemies) {
        if (!enemy.alive || enemy.type !== 'fighter' || evolved >= 3) continue;
        enemy.type = 'elite';
        enemy.width = ENEMY_STATS.elite.width;
        enemy.height = ENEMY_STATS.elite.height;
        enemy.hp = Math.max(enemy.hp, 15);
        enemy.maxHp = Math.max(enemy.maxHp, 15);
        enemy.fireCooldown = ENEMY_STATS.elite.fireCooldown;
        evolved++;
        // Evolution flash
        for (let i = 0; i < 10; i++) {
          state.particles.push({
            pos: { ...enemy.pos },
            vel: { x: (Math.random()-0.5)*5, y: (Math.random()-0.5)*5 },
            life: 15, maxLife: 15, color: '#bb44ff', size: 3,
          });
        }
      }
      if (evolved > 0) {
        // No screen flash — the evolution particles + popup are enough signal
        state.screenFlashColor = '#bb44ff';
        state.popups.push({
          pos: { x: W / 2, y: state.screenH * 0.25 },
          text: '⚡ ENEMIES EVOLVED',
          color: '#bb44ff', life: 50, maxLife: 50,
        });
      }
    }
  }

  // Scroll speed modulation
  state.scrollSpeed = SCROLL_SPEED * cmd.scrollSpeedMult;

  // Spawn enemies from director
  for (const e of cmd.spawnEnemies) {
    spawnEnemy(state, e.type, e.faction, e.x * W, undefined, e.hp, e.drop, e.moveStyle, e.formationId, e.yOffset);
  }

  // ── Beat-driven fire ──
  // Each enemy uses its weapon profile's beatsPerFire cadence:
  //   fighter/turret → every beat   (short-life shots, rapid pulse train)
  //   cruiser        → every 2nd    (medium plasma blobs)
  //   elite          → every 3rd    (long-life homing orbs — scarce)
  //   bomber         → every 4th    (long-life mines — very scarce)
  // The inverse relationship — short life = pulse often, long life =
  // pulse rarely — keeps the screen readable while every shot still
  // hits on the music's drum.
  if (cmd.triggerFire) {
    state.currentBeatType = cmd.beatType ?? 'mid';
    state.currentBeatStrength = cmd.beatStrength ?? 0.5;
    state.beatFlashTimer = 14;
    for (const enemy of state.enemies) {
      if (!enemy.alive || enemy.type === 'boss') continue;
      const profile = WEAPON_PROFILES[enemy.type];
      if (!profile) continue;
      enemy.fireTimer = (enemy.fireTimer ?? 0) + 1;
      if (enemy.fireTimer >= profile.beatsPerFire && state.player.alive) {
        fireEnemyWeapon(state, enemy, state.player.pos);
        enemy.fireTimer = 0;
      }
    }
  }
  if (state.beatFlashTimer > 0) state.beatFlashTimer--;

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

  // Spawn obstacle from director — type comes from active song's profile
  if (cmd.spawnObstacle && W > 0 && state.obstacles.length < 8) {
    const intensity = state.musicIntensity;
    // Director already picked the type via profile weights; fall back to
    // intensity-based selection only if it didn't (defensive).
    let obsType: 'rock' | 'mine' | 'barrier' | 'vortex' | 'comet' | 'energyribbon' | 'splitter';
    if (cmd.spawnObstacleType) {
      obsType = cmd.spawnObstacleType;
    } else {
      const roll = Math.random();
      if (intensity > 0.8)      obsType = roll < 0.3 ? 'vortex' : roll < 0.5 ? 'comet' : roll < 0.7 ? 'energyribbon' : 'barrier';
      else if (intensity > 0.5) obsType = roll < 0.25 ? 'splitter' : roll < 0.45 ? 'comet' : roll < 0.65 ? 'barrier' : roll < 0.85 ? 'mine' : 'energyribbon';
      else if (intensity > 0.25) obsType = roll < 0.5 ? 'rock' : roll < 0.7 ? 'splitter' : roll < 0.85 ? 'mine' : 'comet';
      else obsType = roll < 0.8 ? 'rock' : 'comet';
    }

    const radius = obsType === 'vortex' ? 25 + Math.random() * 15
      : obsType === 'comet' ? 10 + Math.random() * 8
      : obsType === 'energyribbon' ? 5
      : obsType === 'splitter' ? 20 + Math.random() * 15
      : 14 + Math.random() * 20;

    // Comets streak fast, everything else drifts gracefully
    const vy = obsType === 'comet' ? 3 + Math.random() * 3 : 0.4 + Math.random() * 0.7;
    const vx = obsType === 'comet' ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 0.5;

    state.obstacles.push({
      pos: { x: 40 + Math.random() * (W - 80), y: -radius * 2 },
      vel: { x: vx, y: vy },
      radius,
      hp: obsType === 'energyribbon' ? 999 : obsType === 'comet' ? 2 : Math.ceil(radius / 4),
      type: obsType,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: obsType === 'vortex' ? 0.06 : obsType === 'comet' ? 0.15 : (Math.random() - 0.5) * 0.02,
      pullStrength: obsType === 'vortex' ? 0.15 + intensity * 0.25 : undefined,
      ribbonPoints: obsType === 'energyribbon' ? [] : undefined,
      splitCount: obsType === 'splitter' ? 2 : undefined,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// SIGNATURE MECHANICS — the music creates the challenge
// ═══════════════════════════════════════════════════════════════════
// Each song profile owns one signature. When the song hits a drop, the
// director declares the signature and this function spawns the actual
// gameplay event. The mechanic should feel like the music itself is
// generating a moment of challenge that the player must read and react.
function fireSignature(state: ShmupState, sig: SignatureMechanic, W: number, H: number): void {
  switch (sig) {
    case 'curtain': {
      // Bullet curtain rises from below the screen with a single safe gap.
      // The drop creates the wall; the player must reposition into the gap.
      // Visual: a horizontal pink-magenta band of bullets rushing up.
      const gapX = 0.15 + Math.random() * 0.7;
      state.curtains.push({
        y: H + 30,
        vy: 2.6 + state.musicIntensity * 0.6,
        gapX,
        gapHalfWidth: 55 + Math.random() * 20, // ~110-150px gap
        hue: 330 + Math.random() * 20,         // pink-magenta
        life: 240,
        damaging: true,
      });
      break;
    }

    case 'pulse_walls': {
      // Energy walls scan across the screen with a gap to thread.
      // Pick a horizontal wall sweeping up; alternate axes on subsequent hits.
      state.pulseWalls.push({
        axis: 'horizontal',
        pos: H + 20,
        vel: -2.5,
        gapAt: 0.2 + Math.random() * 0.6,
        gapSize: 90 + Math.random() * 30,
        life: 240,
        damaging: true,
      });
      break;
    }

    case 'vortex_storm': {
      // Three gravity wells appear in a triangle around the player area.
      // The challenge is navigating between their pulls.
      const targets = [
        { x: W * 0.25, y: H * 0.45 },
        { x: W * 0.75, y: H * 0.45 },
        { x: W * 0.5,  y: H * 0.25 },
      ];
      for (const t of targets) {
        state.obstacles.push({
          pos: { ...t },
          vel: { x: 0, y: 0.3 },
          radius: 28,
          hp: 999, // indestructible — endure them
          type: 'vortex',
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: 0.05,
          pullStrength: 0.25 + state.musicIntensity * 0.2,
        });
      }
      break;
    }

    case 'swarm': {
      // Reinforce the existing swarm spawns with a wide V-formation of fighters.
      const stage = state.stages[state.currentStage];
      const faction = stage?.faction || 'klingon';
      const n = 7;
      for (let i = 0; i < n; i++) {
        const px = (0.15 + (i / (n - 1)) * 0.7) * W;
        spawnEnemy(state, 'fighter', faction, px);
      }
      break;
    }

    case 'siege': {
      // Push a heavy line of bombers/cruisers.
      const stage = state.stages[state.currentStage];
      const faction = stage?.faction || 'klingon';
      spawnEnemy(state, 'cruiser', faction, W * 0.3);
      spawnEnemy(state, 'cruiser', faction, W * 0.7);
      spawnEnemy(state, 'bomber',  faction, W * 0.5);
      break;
    }

    case 'loop':
    case 'drone':
      // These signatures express themselves through other code paths
      // (enemy weights, density, quiet-section spawn). No drop event needed.
      break;

    case 'finale': {
      // Final stage: fire curtain + vortex storm simultaneously
      fireSignature(state, 'curtain', W, H);
      fireSignature(state, 'vortex_storm', W, H);
      break;
    }
  }
}

// ── Update curtains and pulse walls per frame (called from updateShmup) ──
export function updateSignatureHazards(state: ShmupState, W: number, H: number): void {
  const p = state.player;

  // Curtains: rise upward. Damage the player if they're inside the wall
  // and NOT inside the safe gap.
  for (const c of state.curtains) {
    c.y += c.vy * -1;       // vy stored positive; rise = decrease y
    c.life--;
    if (c.damaging && p.alive && p.invulnTimer <= 0) {
      const dy = Math.abs(p.pos.y - c.y);
      // Wall is ~16px thick visually; damage band ~14px
      if (dy < 14) {
        const gapCenter = c.gapX * W;
        const dx = Math.abs(p.pos.x - gapCenter);
        if (dx > c.gapHalfWidth) {
          hitPlayer(state, {});
        }
      }
    }
  }
  state.curtains = state.curtains.filter(c => c.y > -40 && c.life > 0);

  // Pulse walls: scan in one direction.
  for (const wall of state.pulseWalls) {
    wall.pos += wall.vel;
    wall.life--;
    if (wall.damaging && p.alive && p.invulnTimer <= 0) {
      if (wall.axis === 'horizontal') {
        const dy = Math.abs(p.pos.y - wall.pos);
        if (dy < 14) {
          const gapCenter = wall.gapAt * W;
          const dx = Math.abs(p.pos.x - gapCenter);
          if (dx > wall.gapSize / 2) {
            hitPlayer(state, {});
          }
        }
      } else {
        const dx = Math.abs(p.pos.x - wall.pos);
        if (dx < 14) {
          const gapCenter = wall.gapAt * H;
          const dy = Math.abs(p.pos.y - gapCenter);
          if (dy > wall.gapSize / 2) {
            hitPlayer(state, {});
          }
        }
      }
    }
  }
  state.pulseWalls = state.pulseWalls.filter(w =>
    w.life > 0 &&
    (w.axis === 'horizontal' ? (w.pos > -40 && w.pos < H + 40) : (w.pos > -40 && w.pos < W + 40))
  );

  if (state.signatureLabelTimer > 0) state.signatureLabelTimer--;
}
