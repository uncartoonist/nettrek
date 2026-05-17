import {
  ShmupState, FACTION_COLORS, ENEMY_STATS, PowerUpType, EnvObject, Obstacle,
} from './types';

const POWERUP_COLORS: Record<PowerUpType, string> = {
  weapon: '#00ccff', shield: '#44ff44', star: '#ffdd00',
  bomb: '#ff4444', magnet: '#ff88ff', missile: '#ffaa00',
  laser: '#ff44ff', phaser: '#ff8833', life: '#ff8888',
  emp: '#44ddff', overdrive: '#ff6600', drone: '#44ffaa', score2x: '#ffff00',
};

const POWERUP_LABELS: Record<PowerUpType, string> = {
  weapon: 'W', shield: 'S', star: '★', bomb: 'B', magnet: 'M', missile: 'R', laser: 'L', phaser: 'P', life: '♥',
  emp: '⚡', overdrive: '🔥', drone: '◈', score2x: '×2',
};

import type { EnvSpawn } from './types';

interface StageEnvConfig {
  envObjects: EnvSpawn[];
}

const STAGE_ENVIRONMENTS: StageEnvConfig[] = [
  // Stage 1: Neutral Zone — open space, scattered patrols
  {
    envObjects: [
      { type: 'asteroid', frequency: 0.006, sizeRange: [10, 30], parallaxRange: [0.3, 0.8], colors: ['#4a4540', '#3a3530', '#5a5550'] },
      { type: 'asteroid', frequency: 0.002, sizeRange: [40, 80], parallaxRange: [0.15, 0.3], colors: ['#2a2520', '#1a1510'] },
      { type: 'station', frequency: 0.0008, sizeRange: [25, 40], parallaxRange: [0.3, 0.5], colors: ['#334455', '#445566'] },
      { type: 'satellite', frequency: 0.003, sizeRange: [8, 16], parallaxRange: [0.5, 0.8], colors: ['#556677', '#667788'] },
      { type: 'nebula', frequency: 0.003, sizeRange: [80, 160], parallaxRange: [0.08, 0.2], colors: ['rgba(20,40,80,0.15)', 'rgba(30,50,100,0.1)'] },
      { type: 'debris', frequency: 0.004, sizeRange: [3, 10], parallaxRange: [0.6, 1.0], colors: ['#444', '#555'] },
    ],
  },
  // Stage 2: Romulan Nebula — thick glowing clouds, visibility limited
  {
    envObjects: [
      { type: 'nebula', frequency: 0.015, sizeRange: [80, 220], parallaxRange: [0.15, 0.5], colors: ['rgba(20,80,30,0.3)', 'rgba(30,100,50,0.25)', 'rgba(15,60,25,0.2)'] },
      { type: 'nebula', frequency: 0.008, sizeRange: [120, 300], parallaxRange: [0.05, 0.15], colors: ['rgba(10,50,20,0.18)', 'rgba(20,70,30,0.12)'] },
      { type: 'asteroid', frequency: 0.004, sizeRange: [12, 35], parallaxRange: [0.4, 0.7], colors: ['#2a3a2a', '#1a2a1a'] },
      { type: 'debris', frequency: 0.006, sizeRange: [4, 14], parallaxRange: [0.5, 0.9], colors: ['#3a5a3a', '#2a4a2a'] },
      { type: 'planet-bg', frequency: 0.0003, sizeRange: [80, 200], parallaxRange: [0.03, 0.08], colors: ['#0a3020', '#103a28'] },
    ],
  },
  // Stage 3: Orion Syndicate — dense asteroid belt, smuggler debris
  {
    envObjects: [
      { type: 'asteroid', frequency: 0.018, sizeRange: [8, 45], parallaxRange: [0.25, 0.9], colors: ['#5a4a30', '#4a3a20', '#6a5a40'] },
      { type: 'asteroid', frequency: 0.006, sizeRange: [50, 100], parallaxRange: [0.1, 0.25], colors: ['#2a1a08', '#3a2a10'] },
      { type: 'station', frequency: 0.002, sizeRange: [30, 55], parallaxRange: [0.25, 0.45], colors: ['#554422', '#665533', '#443311'] },
      { type: 'debris', frequency: 0.015, sizeRange: [5, 22], parallaxRange: [0.4, 1.0], colors: ['#665533', '#887744', '#554422'] },
      { type: 'ring', frequency: 0.0008, sizeRange: [50, 100], parallaxRange: [0.1, 0.2], colors: ['#886644', '#aa8866'] },
      { type: 'nebula', frequency: 0.003, sizeRange: [60, 120], parallaxRange: [0.05, 0.15], colors: ['rgba(60,40,10,0.12)', 'rgba(80,50,15,0.1)'] },
    ],
  },
  // Stage 4: Deep Space Anomaly — vast emptiness, distant worlds
  {
    envObjects: [
      { type: 'planet-bg', frequency: 0.0006, sizeRange: [80, 200], parallaxRange: [0.03, 0.1], colors: ['#1a3050', '#2a1040', '#103020', '#302010'] },
      { type: 'asteroid', frequency: 0.003, sizeRange: [6, 18], parallaxRange: [0.5, 0.9], colors: ['#3a3535', '#4a4545'] },
      { type: 'nebula', frequency: 0.006, sizeRange: [100, 250], parallaxRange: [0.06, 0.18], colors: ['rgba(40,20,60,0.18)', 'rgba(60,15,80,0.12)', 'rgba(20,10,50,0.15)'] },
      { type: 'satellite', frequency: 0.004, sizeRange: [6, 14], parallaxRange: [0.4, 0.7], colors: ['#445566', '#556677'] },
      { type: 'ring', frequency: 0.001, sizeRange: [30, 60], parallaxRange: [0.2, 0.4], colors: ['#334466', '#445588'] },
      { type: 'debris', frequency: 0.005, sizeRange: [3, 8], parallaxRange: [0.6, 1.0], colors: ['#333', '#444', '#555'] },
    ],
  },
  // Stage 5: Wormhole Transit — chaotic energy, distorted space
  {
    envObjects: [
      { type: 'ring', frequency: 0.018, sizeRange: [20, 140], parallaxRange: [0.2, 0.85], colors: ['#4400aa', '#6600cc', '#2200ff', '#8800ff', '#aa44ff'] },
      { type: 'nebula', frequency: 0.025, sizeRange: [50, 150], parallaxRange: [0.15, 0.6], colors: ['rgba(80,0,160,0.25)', 'rgba(120,0,200,0.18)', 'rgba(40,0,120,0.2)', 'rgba(160,40,255,0.12)'] },
      { type: 'debris', frequency: 0.012, sizeRange: [3, 12], parallaxRange: [0.5, 1.0], colors: ['#8844ff', '#aa66ff', '#6622dd'] },
      { type: 'asteroid', frequency: 0.004, sizeRange: [10, 30], parallaxRange: [0.3, 0.7], colors: ['#3a2a4a', '#2a1a3a'] },
      { type: 'planet-bg', frequency: 0.0004, sizeRange: [60, 120], parallaxRange: [0.05, 0.12], colors: ['#2a0050', '#400080'] },
    ],
  },
  // Stage 6: Final Fortress — warzone, burning stations, dense debris
  {
    envObjects: [
      { type: 'station', frequency: 0.005, sizeRange: [25, 65], parallaxRange: [0.2, 0.55], colors: ['#443333', '#553344', '#332222', '#5a3030'] },
      { type: 'debris', frequency: 0.025, sizeRange: [4, 28], parallaxRange: [0.3, 1.0], colors: ['#664444', '#553333', '#442222', '#775544'] },
      { type: 'asteroid', frequency: 0.01, sizeRange: [12, 45], parallaxRange: [0.25, 0.7], colors: ['#3a2020', '#4a2a2a', '#5a3030'] },
      { type: 'nebula', frequency: 0.008, sizeRange: [60, 160], parallaxRange: [0.08, 0.25], colors: ['rgba(80,15,10,0.2)', 'rgba(100,20,15,0.15)', 'rgba(60,10,10,0.18)'] },
      { type: 'ring', frequency: 0.003, sizeRange: [20, 55], parallaxRange: [0.35, 0.7], colors: ['#882222', '#aa3333', '#cc4444'] },
      { type: 'planet-bg', frequency: 0.0003, sizeRange: [100, 180], parallaxRange: [0.03, 0.08], colors: ['#3a1010', '#2a0808'] },
    ],
  },
  // Stage 7: Black Hole Perimeter — dark void, gravitational distortion, distant accretion disk
  {
    envObjects: [
      { type: 'ring', frequency: 0.02, sizeRange: [30, 180], parallaxRange: [0.1, 0.6], colors: ['#220044', '#330066', '#110022', '#440088'] },
      { type: 'debris', frequency: 0.01, sizeRange: [3, 15], parallaxRange: [0.4, 0.9], colors: ['#221133', '#332244', '#110022'] },
      { type: 'nebula', frequency: 0.012, sizeRange: [80, 200], parallaxRange: [0.05, 0.2], colors: ['rgba(30,0,60,0.25)', 'rgba(50,0,100,0.18)', 'rgba(20,0,40,0.2)'] },
      { type: 'planet-bg', frequency: 0.0004, sizeRange: [60, 140], parallaxRange: [0.03, 0.08], colors: ['#0a0020', '#150030'] },
      { type: 'asteroid', frequency: 0.005, sizeRange: [8, 25], parallaxRange: [0.3, 0.7], colors: ['#1a1020', '#2a1a30'] },
    ],
  },
  // Stage 8: Subspace Rift — chaotic energy streams, phase-shifted reality, green/cyan
  {
    envObjects: [
      { type: 'ring', frequency: 0.025, sizeRange: [15, 120], parallaxRange: [0.2, 0.8], colors: ['#004444', '#006666', '#008888', '#003333'] },
      { type: 'nebula', frequency: 0.02, sizeRange: [60, 180], parallaxRange: [0.1, 0.5], colors: ['rgba(0,80,80,0.25)', 'rgba(0,120,100,0.18)', 'rgba(0,60,60,0.2)'] },
      { type: 'debris', frequency: 0.015, sizeRange: [3, 12], parallaxRange: [0.5, 1.0], colors: ['#005544', '#007766', '#004433'] },
      { type: 'satellite', frequency: 0.004, sizeRange: [8, 18], parallaxRange: [0.3, 0.6], colors: ['#336655', '#447766'] },
      { type: 'asteroid', frequency: 0.003, sizeRange: [15, 35], parallaxRange: [0.2, 0.5], colors: ['#1a3030', '#2a4040'] },
    ],
  },
  // Stage 9: Omega Citadel — apocalyptic, all colors, burning everything
  {
    envObjects: [
      { type: 'station', frequency: 0.008, sizeRange: [30, 80], parallaxRange: [0.15, 0.5], colors: ['#4a2222', '#3a3333', '#2a2a4a', '#5a4422'] },
      { type: 'debris', frequency: 0.03, sizeRange: [5, 30], parallaxRange: [0.3, 1.0], colors: ['#665533', '#554422', '#443344', '#663322'] },
      { type: 'nebula', frequency: 0.015, sizeRange: [80, 200], parallaxRange: [0.05, 0.2], colors: ['rgba(80,20,10,0.22)', 'rgba(60,10,40,0.18)', 'rgba(40,30,10,0.2)'] },
      { type: 'ring', frequency: 0.005, sizeRange: [25, 70], parallaxRange: [0.2, 0.6], colors: ['#aa4422', '#cc6633', '#884411'] },
      { type: 'asteroid', frequency: 0.012, sizeRange: [10, 40], parallaxRange: [0.2, 0.7], colors: ['#3a2a1a', '#4a3a2a', '#2a1a0a'] },
      { type: 'planet-bg', frequency: 0.0005, sizeRange: [100, 200], parallaxRange: [0.03, 0.06], colors: ['#2a0a0a', '#1a0505'] },
    ],
  },
];

export class ShmupRenderer {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private stars: { x: number; y: number; speed: number; brightness: number }[] = [];
  private farStars: { x: number; y: number; brightness: number }[] = [];
  private envObjects: EnvObject[] = [];
  private nebulaImgs: HTMLImageElement[] = [];
  private nebulasLoaded = false;
  private loadedNebulaCount = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D rendering context is unavailable');
    this.ctx = ctx;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Multi-layer starfield
    for (let i = 0; i < 100; i++) {
      this.stars.push({ x: Math.random(), y: Math.random(), speed: 0.5 + Math.random() * 2, brightness: 0.3 + Math.random() * 0.7 });
    }
    for (let i = 0; i < 50; i++) {
      this.farStars.push({ x: Math.random(), y: Math.random(), brightness: 0.1 + Math.random() * 0.2 });
    }

    // Load all background images
    const bgSrcs = [
      '/nebula1.png',        // 0: blue/purple nebula
      '/nebula2.png',        // 1: blue nebula
      '/nebula3.png',        // 2: purple/teal nebula
      '/background1.png',    // 3: red hellscape planet
      '/background2.png',    // 4: dark vortex
      '/background-city.png',// 5: futuristic city canyon
      '/background-tech.png',// 6: station corridor
      '/cave.png',           // 7: asteroid cavern
    ];
    for (const src of bgSrcs) {
      const img = new Image();
      img.onload = () => {
        this.loadedNebulaCount++;
        this.nebulasLoaded = this.loadedNebulaCount === bgSrcs.length;
      };
      img.src = src;
      this.nebulaImgs.push(img);
    }
  }

  private resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  render(state: ShmupState): void {
    state.screenW = this.w;
    state.screenH = this.h;
    const { ctx, w, h } = this;
    const stage = state.stages[state.currentStage];

    // ── Screen shake ──
    ctx.save();
    if (state.screenShake > 0.5) {
      const shakeX = (Math.random() - 0.5) * state.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * state.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    // Background — deep space with scrolling nebula images
    ctx.fillStyle = '#000205';
    ctx.fillRect(0, 0, w, h);

    // ── Environmental journey — each stage transitions through distinct locations ──
    if (this.nebulasLoaded && this.nebulaImgs.length >= 8) {
      const t = state.tick;
      const dur = stage?.duration || 2100;
      const progress = Math.min(t / dur, 1);
      const scrollPeriod = h * 3;

      // Each stage has a 3-scene journey: open space → environment → approach target
      // Indices: 0=nebula1, 1=nebula2, 2=nebula3, 3=red-hell, 4=vortex, 5=city, 6=tech-corridor, 7=cave
      const STAGE_JOURNEYS: number[][] = [
        [0, 7, 6],  // Stage 1: nebula → asteroid cave → station corridor
        [2, 5, 3],  // Stage 2: purple nebula → city canyon → red hellscape
        [1, 6, 4],  // Stage 3: blue nebula → tech corridor → vortex
        [0, 7, 5],  // Stage 4: nebula → cave → city
        [2, 4, 3],  // Stage 5: purple nebula → vortex → red hellscape
        [1, 7, 6],  // Stage 6: blue nebula → cave → tech corridor
        [4, 2, 7],  // Stage 7: vortex → purple nebula → cave (black hole)
        [0, 4, 5],  // Stage 8: nebula → vortex → city (subspace)
        [3, 6, 7],  // Stage 9: red hellscape → tech corridor → cave (omega)
      ];

      const journey = STAGE_JOURNEYS[state.currentStage % STAGE_JOURNEYS.length];
      const sceneA = this.nebulaImgs[journey[0]] || this.nebulaImgs[0];
      const sceneB = this.nebulaImgs[journey[1]] || this.nebulaImgs[1];
      const sceneC = this.nebulaImgs[journey[2]] || this.nebulaImgs[2];

      // Crossfade: 0-40% = scene A, 30-70% = transition A→B, 60-100% = transition B→C
      const fadeA = progress < 0.35 ? 1 : progress < 0.5 ? 1 - (progress - 0.35) / 0.15 : 0;
      const fadeB = progress < 0.3 ? 0 : progress < 0.45 ? (progress - 0.3) / 0.15 : progress < 0.7 ? 1 : progress < 0.85 ? 1 - (progress - 0.7) / 0.15 : 0;
      const fadeC = progress < 0.65 ? 0 : progress < 0.8 ? (progress - 0.65) / 0.15 : 1;

      const driftX = Math.sin(t * 0.002) * w * 0.03;
      const scrollY1 = -(state.scrollY * 0.1 % scrollPeriod);
      const breathe = 0.3 + Math.sin(t * 0.004) * 0.05;

      ctx.save();
      ctx.translate(driftX, 0);

      // Draw each scene layer with its fade amount
      if (fadeA > 0.01) {
        ctx.globalAlpha = breathe * fadeA;
        ctx.drawImage(sceneA, 0, scrollY1, w, scrollPeriod);
        ctx.drawImage(sceneA, 0, scrollY1 + scrollPeriod, w, scrollPeriod);
      }
      if (fadeB > 0.01) {
        ctx.globalAlpha = breathe * fadeB;
        const scaleB = 1.02 + Math.sin(t * 0.0015) * 0.01;
        ctx.save(); ctx.scale(scaleB, 1);
        const scrollY2 = -(state.scrollY * 0.12 % scrollPeriod);
        ctx.drawImage(sceneB, -w*(scaleB-1)/2, scrollY2, w, scrollPeriod);
        ctx.drawImage(sceneB, -w*(scaleB-1)/2, scrollY2 + scrollPeriod, w, scrollPeriod);
        ctx.restore();
      }
      if (fadeC > 0.01) {
        ctx.globalAlpha = breathe * fadeC;
        const scrollY3 = -(state.scrollY * 0.14 % scrollPeriod);
        ctx.drawImage(sceneC, 0, scrollY3, w, scrollPeriod);
        ctx.drawImage(sceneC, 0, scrollY3 + scrollPeriod, w, scrollPeriod);
      }

      ctx.restore();

      // Beat pulse tint
      if (state.beatPulse > 0.05) {
        ctx.globalAlpha = state.beatPulse * 0.05;
        ctx.fillStyle = stage?.faction === 'klingon' ? '#ff2200' : stage?.faction === 'romulan' ? '#22ff44' : stage?.faction === 'orion' ? '#ffaa00' : '#0088ff';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalAlpha = 1;
    }

    // Far stars (slow parallax) — on top of nebula
    for (const star of this.farStars) {
      const sy = ((star.y * h + state.scrollY * 0.2) % h + h) % h;
      ctx.fillStyle = `rgba(255,255,255,${star.brightness})`;
      ctx.fillRect(star.x * w, sy, 1, 1);
    }

    // Near stars (faster parallax) — streak with music intensity
    const musicStreak = state.musicIntensity > 0.8 ? 3 + (state.musicIntensity - 0.8) * 15 : 0;
    for (const star of this.stars) {
      const sy = ((star.y * h + state.scrollY * star.speed) % h + h) % h;
      const bright = star.brightness * (0.8 + state.beatPulse * 0.5);
      ctx.fillStyle = `rgba(200,220,255,${Math.min(1, bright)})`;
      if (musicStreak > 0 && star.speed > 1.2) {
        // Streak effect during intense music
        ctx.fillRect(star.x * w, sy, 1, star.speed + musicStreak);
      } else {
        ctx.fillRect(star.x * w, sy, star.speed > 1.5 ? 2 : 1, star.speed > 1.5 ? 2 : 1);
      }
    }

    // ── Dynamic background events — distant battles, explosions ──
    this.drawBackgroundEvents(ctx, state, w, h);

    // Environment objects (scrolling terrain)
    this.updateEnvironment(state, w, h);
    this.drawEnvironment(ctx, state, w, h);

    // Power-ups
    for (const pu of state.powerUps) {
      if (pu.type === 'star') {
        // Coin rendering — golden spinning coin
        const spin = Math.sin(state.tick * 0.12 + pu.pos.x * 0.1);
        const coinW = 7 * Math.abs(spin) + 2;
        ctx.fillStyle = '#ffdd00';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(pu.pos.x, pu.pos.y, coinW, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Coin highlight
        ctx.fillStyle = '#fff8aa';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.ellipse(pu.pos.x - 1, pu.pos.y - 2, coinW * 0.4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Coin edge
        ctx.strokeStyle = '#aa8800';
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(pu.pos.x, pu.pos.y, coinW, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        // Other power-ups — glowing orb with icon
        const color = POWERUP_COLORS[pu.type];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85 + Math.sin(state.tick * 0.1) * 0.15;
        ctx.beginPath();
        ctx.arc(pu.pos.x, pu.pos.y, 12, 0, Math.PI * 2);
        ctx.fill();
        // Outer glow
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(pu.pos.x, pu.pos.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Inner highlight
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(pu.pos.x - 3, pu.pos.y - 3, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(POWERUP_LABELS[pu.type], pu.pos.x, pu.pos.y + 4);
      }
    }

    // Enemy bullets — unique shapes per enemy type (color-coded)
    for (const bullet of state.enemyBullets) {
      const fadeAlpha = Math.min(1, bullet.ttl / 15);
      if (fadeAlpha <= 0) continue;
      ctx.save();
      ctx.translate(bullet.pos.x, bullet.pos.y);

      const r = bullet.radius;
      const c = bullet.color;

      if (c.startsWith('#ff22') || c.startsWith('#ff44')) {
        // Fighter — small red elongated bolt
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.6, r * 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffaaaa';
        ctx.globalAlpha = 0.6 * fadeAlpha;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.25, r * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.startsWith('#ff88') || c.startsWith('#ffaa')) {
        // Bomber — orange plasma blob with pulsing glow
        const pulse = 1 + Math.sin(state.tick * 0.15 + bullet.pos.x) * 0.2;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.15 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.2 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.85 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffdd88';
        ctx.globalAlpha = 0.5 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.startsWith('#22ff') || c.startsWith('#44ff') || c.startsWith('#88ff')) {
        // Cruiser — green diamond/rhombus shape
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.12 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.8);
        ctx.lineTo(-r * 0.8, 0);
        ctx.lineTo(0, r * 1.8);
        ctx.lineTo(r * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.4 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.startsWith('#bb44') || c.startsWith('#cc44')) {
        // Elite — purple spinning orb with ring
        const spin = state.tick * 0.1 + bullet.pos.y * 0.05;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.1 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.85 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // Rotating ring
        ctx.strokeStyle = '#ee88ff';
        ctx.globalAlpha = 0.5 * fadeAlpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.4, spin, spin + Math.PI * 1.2);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.5 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.startsWith('#ff') && c.includes('ee') || c.startsWith('#ddcc') || c.startsWith('#ffee')) {
        // Turret — yellow sharp needle
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(r * 3, 0);
        ctx.lineTo(-r, -r * 0.5);
        ctx.lineTo(-r, r * 0.5);
        ctx.closePath();
        ctx.fill();
        // Bright tip
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.7 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(r * 1.5, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Trail line
        ctx.strokeStyle = c;
        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r * 2, 0);
        ctx.lineTo(r * 2, 0);
        ctx.stroke();
      } else {
        // Default (boss bullets, etc) — standard glow orb
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.12 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.5 * fadeAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Player bullets — bright blue elongated bolts, clearly different from enemy fire
    for (const bullet of state.playerBullets) {
      ctx.save();
      ctx.translate(bullet.pos.x, bullet.pos.y);
      if (bullet.color === '#ffaa00') {
        // Missiles — orange with smoke trail
        ctx.fillStyle = '#ffaa00';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -bullet.radius * 1.5);
        ctx.lineTo(-bullet.radius * 0.6, bullet.radius);
        ctx.lineTo(bullet.radius * 0.6, bullet.radius);
        ctx.closePath();
        ctx.fill();
        // Exhaust
        ctx.fillStyle = '#ff6600';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, bullet.radius + 2, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (bullet.color === '#ff44ff') {
        // Laser — bright magenta beam segment
        ctx.fillStyle = '#ff44ff';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-bullet.radius * 0.3, -bullet.radius * 2, bullet.radius * 0.6, bullet.radius * 4);
        ctx.fillStyle = '#ffaaff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(-bullet.radius * 0.15, -bullet.radius * 2, bullet.radius * 0.3, bullet.radius * 4);
      } else if (bullet.color === '#ff8833') {
        // Phaser — orange sweeping beam
        ctx.fillStyle = '#ff8833';
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.6, bullet.radius * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffcc88';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.25, bullet.radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Main gun / wing guns — bright blue elongated bolt
        ctx.fillStyle = bullet.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.5, bullet.radius * 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Bright core
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.2, bullet.radius * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Obstacles
    for (const obs of state.obstacles) {
      if (obs.hp <= 0) continue;
      ctx.save();
      ctx.translate(obs.pos.x, obs.pos.y);
      ctx.rotate(obs.rotation);

      if (obs.type === 'rock') {
        const R = obs.radius;
        const s = obs.rotation * 100;
        const t = state.tick;
        // Slow undulation — the asteroid gently breathes
        const breathe = 1 + Math.sin(t * 0.008 + s) * 0.03;
        ctx.scale(breathe, 1 / breathe);

        // Build smooth organic outline with 16 bezier-curved points
        const N = 16;
        const shape: {x: number; y: number}[] = [];
        for (let i = 0; i < N; i++) {
          const a = (Math.PI * 2 / N) * i;
          // Multiple sine harmonics for organic irregularity
          const wobble = Math.sin(i * 2.3 + s) * 0.15
            + Math.sin(i * 4.7 + s * 1.3) * 0.08
            + Math.sin(i * 7.1 + s * 0.7) * 0.04;
          const r = R * (0.8 + wobble);
          shape.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }

        // Draw smooth closed path using catmull-rom-like bezier
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p0 = shape[(i - 1 + N) % N];
          const p1 = shape[i];
          const p2 = shape[(i + 1) % N];
          const cpx = p1.x + (p2.x - p0.x) * 0.15;
          const cpy = p1.y + (p2.y - p0.y) * 0.15;
          if (i === 0) ctx.moveTo(p1.x, p1.y);
          else ctx.quadraticCurveTo(cpx, cpy, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }
        ctx.closePath();

        // Base fill — stage-aware coloring to match environment
        const stageColors = [
          ['#7a7065','#5a5045','#3a3025','#1a1510'], // 1: neutral grey
          ['#4a6a5a','#3a5a4a','#2a4a3a','#1a3a2a'], // 2: green-tinted (romulan nebula)
          ['#7a6a4a','#5a4a30','#3a3020','#1a1a08'], // 3: amber (orion)
          ['#5a5570','#3a3550','#2a2540','#1a1530'], // 4: purple-grey (anomaly)
          ['#5a4a7a','#3a2a5a','#2a1a4a','#1a0a3a'], // 5: deep purple (wormhole)
          ['#6a4a4a','#4a2a2a','#3a1a1a','#2a0a0a'], // 6: red-tinted (fortress)
          ['#3a3050','#2a2040','#1a1030','#0a0820'], // 7: void black-purple
          ['#4a6a6a','#3a5a5a','#2a4a4a','#1a3a3a'], // 8: teal (subspace)
          ['#6a5040','#4a3020','#3a2010','#2a1005'], // 9: burnt orange (omega)
        ];
        const sc = stageColors[state.currentStage % stageColors.length];
        const baseGrad = ctx.createRadialGradient(-R*0.3, -R*0.3, R*0.05, R*0.1, R*0.1, R*1.1);
        baseGrad.addColorStop(0, sc[0]);
        baseGrad.addColorStop(0.3, sc[1]);
        baseGrad.addColorStop(0.7, sc[2]);
        baseGrad.addColorStop(1, sc[3]);
        ctx.fillStyle = baseGrad;
        ctx.fill();

        // Surface layer — mottled color variation
        ctx.save(); ctx.clip();
        for (let i = 0; i < 6; i++) {
          const mx = Math.sin(i * 5.3 + s) * R * 0.5;
          const my = Math.cos(i * 3.7 + s) * R * 0.5;
          const mr = R * (0.15 + Math.sin(i * 2.1 + s) * 0.1);
          const mGrad = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
          mGrad.addColorStop(0, `rgba(${60+i*8},${50+i*5},${40+i*3},0.25)`);
          mGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = mGrad;
          ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
        }

        // Craters — dark depressions with lit rims
        const craters = [
          { x: 0.25, y: -0.2, r: 0.2 },
          { x: -0.3, y: 0.2, r: 0.14 },
          { x: 0.05, y: 0.35, r: 0.1 },
          { x: -0.15, y: -0.3, r: 0.08 },
        ];
        for (const cr of craters) {
          const cx = cr.x * R, cy = cr.y * R, crr = cr.r * R;
          // Dark crater floor
          const cGrad = ctx.createRadialGradient(cx + crr * 0.15, cy + crr * 0.15, 0, cx, cy, crr);
          cGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
          cGrad.addColorStop(0.7, 'rgba(0,0,0,0.15)');
          cGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = cGrad;
          ctx.beginPath(); ctx.arc(cx, cy, crr, 0, Math.PI * 2); ctx.fill();
          // Bright rim (upper-left edge catches light)
          ctx.strokeStyle = 'rgba(180,170,150,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, crr, -2.2, -0.5); ctx.stroke();
        }

        // Subtle rim light on the whole asteroid edge (upper-left)
        ctx.strokeStyle = 'rgba(200,190,170,0.06)';
        ctx.lineWidth = 1.5;
        // Retrace the shape for the highlight
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p0 = shape[(i - 1 + N) % N];
          const p1 = shape[i];
          const p2 = shape[(i + 1) % N];
          const cpx = p1.x + (p2.x - p0.x) * 0.15;
          const cpy = p1.y + (p2.y - p0.y) * 0.15;
          if (i === 0) ctx.moveTo(p1.x, p1.y);
          else ctx.quadraticCurveTo(cpx, cpy, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore(); // unclip
      } else if (obs.type === 'mine') {
        // Proximity mine — sleek metallic sphere with sensor array
        const R = obs.radius;
        const t = state.tick;
        const pulse = 0.5 + Math.sin(t * 0.08) * 0.4;

        // Outer shell — dark metallic gradient
        const shellGrad = ctx.createRadialGradient(-R*0.2, -R*0.2, R*0.05, R*0.1, R*0.1, R*0.7);
        shellGrad.addColorStop(0, '#4a3a3a');
        shellGrad.addColorStop(0.5, '#2a1818');
        shellGrad.addColorStop(1, '#0a0505');
        ctx.fillStyle = shellGrad;
        ctx.beginPath(); ctx.arc(0, 0, R*0.65, 0, Math.PI*2); ctx.fill();

        // Sensor arms — 4 curved antennae
        ctx.strokeStyle = '#554444';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const a = (Math.PI*2/4)*i + t*0.008;
          const tipR = R * 0.92;
          const midR = R * 0.72;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a)*R*0.55, Math.sin(a)*R*0.55);
          ctx.quadraticCurveTo(
            Math.cos(a + 0.3)*midR, Math.sin(a + 0.3)*midR,
            Math.cos(a)*tipR, Math.sin(a)*tipR
          );
          ctx.stroke();
          // Sensor tip — pulsing
          ctx.fillStyle = `rgba(255,60,30,${pulse})`;
          ctx.beginPath(); ctx.arc(Math.cos(a)*tipR, Math.sin(a)*tipR, 2.5, 0, Math.PI*2); ctx.fill();
        }

        // Detection ring — expanding pulse
        const ringPhase = (t % 90) / 90;
        ctx.strokeStyle = `rgba(255,50,30,${(1-ringPhase)*0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, R*0.7 + ringPhase*R*0.4, 0, Math.PI*2); ctx.stroke();

        // Core eye — menacing center sensor
        ctx.fillStyle = '#110000';
        ctx.beginPath(); ctx.arc(0, 0, R*0.2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(255,30,0,${pulse*0.9})`;
        ctx.beginPath(); ctx.arc(0, 0, R*0.12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = pulse * 0.6;
        ctx.beginPath(); ctx.arc(-R*0.04, -R*0.04, R*0.04, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;

      } else if (obs.type === 'staticturret') {
        // Defense platform — armored octagonal base with tracking cannon
        const R = obs.radius;
        const t = state.tick;

        // Base platform — layered octagonal armor
        const baseGrad = ctx.createRadialGradient(-R*0.15, -R*0.15, 0, 0, 0, R);
        baseGrad.addColorStop(0, '#3a3a44');
        baseGrad.addColorStop(0.6, '#1a1a22');
        baseGrad.addColorStop(1, '#0a0a10');
        ctx.fillStyle = baseGrad;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i + Math.PI/8;
          if (i===0) ctx.moveTo(Math.cos(a)*R, Math.sin(a)*R);
          else ctx.lineTo(Math.cos(a)*R, Math.sin(a)*R);
        }
        ctx.closePath(); ctx.fill();

        // Armor panel lines
        ctx.strokeStyle = '#4a4a55';
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i + Math.PI/8;
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a)*R*0.9, Math.sin(a)*R*0.9); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Inner ring
        ctx.strokeStyle = '#3a3a44';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, R*0.55, 0, Math.PI*2); ctx.stroke();

        // Tracking barrel
        ctx.save();
        const aimAngle = Math.atan2(state.player.pos.y - obs.pos.y, state.player.pos.x - obs.pos.x) - obs.rotation;
        ctx.rotate(aimAngle);
        // Barrel body
        ctx.fillStyle = '#2a2a33';
        ctx.fillRect(-3, -R*0.85, 6, R*0.55);
        // Barrel tip housing
        ctx.fillStyle = '#1a1a22';
        ctx.beginPath(); ctx.arc(0, -R*0.85, 5, 0, Math.PI*2); ctx.fill();
        // Muzzle glow
        ctx.fillStyle = '#ff6644';
        ctx.globalAlpha = 0.4 + Math.sin(t*0.1)*0.3;
        ctx.beginPath(); ctx.arc(0, -R*0.88, 3, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Central hub — targeting sensor
        const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, R*0.2);
        hubGrad.addColorStop(0, '#ff8855');
        hubGrad.addColorStop(0.5, '#cc4422');
        hubGrad.addColorStop(1, '#441100');
        ctx.fillStyle = hubGrad;
        ctx.globalAlpha = 0.7 + Math.sin(t*0.06)*0.2;
        ctx.beginPath(); ctx.arc(0, 0, R*0.18, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;

        // Scanning ring
        ctx.strokeStyle = '#ff6644';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        ctx.beginPath(); ctx.arc(0, 0, R*0.4, t*0.03, t*0.03+Math.PI*0.8); ctx.stroke();
        ctx.globalAlpha = 1;

      } else if (obs.type === 'lasergate') {
        // Energy gate — floating pylons with plasma beam
        const R = obs.radius;
        const t = state.tick;
        const active = obs.laserActive;

        // Pylon bases — detailed floating towers
        for (const side of [-1, 1]) {
          const px = side * R;
          ctx.save();
          ctx.translate(px, 0);

          // Pylon body
          const pylonGrad = ctx.createLinearGradient(-6, -14, 6, 14);
          pylonGrad.addColorStop(0, '#3a2244');
          pylonGrad.addColorStop(0.5, '#2a1133');
          pylonGrad.addColorStop(1, '#1a0822');
          ctx.fillStyle = pylonGrad;
          ctx.beginPath();
          ctx.moveTo(-5, -14); ctx.lineTo(5, -14);
          ctx.lineTo(7, -4); ctx.lineTo(7, 4);
          ctx.lineTo(5, 14); ctx.lineTo(-5, 14);
          ctx.lineTo(-7, 4); ctx.lineTo(-7, -4);
          ctx.closePath(); ctx.fill();

          // Emitter lens
          ctx.fillStyle = active ? '#ff44ff' : '#442244';
          ctx.globalAlpha = active ? 0.9 : 0.4;
          ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
          // Lens glow
          if (active) {
            ctx.fillStyle = '#ff88ff';
            ctx.globalAlpha = 0.3 + Math.sin(t*0.15)*0.15;
            ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.fill();
          }

          // Top/bottom accent lights
          ctx.fillStyle = '#6633aa';
          ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.arc(0, -10, 2, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(0, 10, 2, 0, Math.PI*2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.restore();
        }

        // Beam — layered plasma effect
        if (active) {
          // Outer glow
          ctx.strokeStyle = '#ff88ff';
          ctx.lineWidth = 10;
          ctx.globalAlpha = 0.08 + Math.sin(t*0.12)*0.04;
          ctx.beginPath(); ctx.moveTo(-R + 8, 0); ctx.lineTo(R - 8, 0); ctx.stroke();
          // Mid beam
          ctx.strokeStyle = '#ff44ff';
          ctx.lineWidth = 4;
          ctx.globalAlpha = 0.6 + Math.sin(t*0.2)*0.2;
          ctx.beginPath(); ctx.moveTo(-R + 8, 0); ctx.lineTo(R - 8, 0); ctx.stroke();
          // Core beam
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.moveTo(-R + 8, 0); ctx.lineTo(R - 8, 0); ctx.stroke();
          // Crackling energy nodes along beam
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.5;
          for (let i = 0; i < 3; i++) {
            const nx = -R + 8 + (R*2 - 16) * ((Math.sin(t*0.08 + i*2) + 1) / 2);
            ctx.beginPath(); ctx.arc(nx, Math.sin(t*0.3+i)*2, 2, 0, Math.PI*2); ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

      } else if (obs.type === 'vortex') {
        // Gravitational anomaly — swirling accretion disk
        const R = obs.radius;
        const t = state.tick;

        // Accretion disk — multiple orbital rings
        for (let i = 0; i < 6; i++) {
          const ringR = R * (0.25 + i * 0.13);
          const speed = 0.04 - i * 0.005;
          const alpha = 0.35 - i * 0.04;
          // Gradient ring from blue to purple
          const hue = 260 + i * 15;
          ctx.strokeStyle = `hsla(${hue}, 70%, ${50 - i*5}%, ${alpha})`;
          ctx.lineWidth = 2.5 - i * 0.3;
          ctx.beginPath();
          ctx.arc(0, 0, ringR, t * speed + i * 0.8, t * speed + i * 0.8 + Math.PI * (1.2 + i * 0.15));
          ctx.stroke();
        }

        // Distortion tendrils — spiral arms pulling inward
        ctx.strokeStyle = 'rgba(140,60,220,0.15)';
        ctx.lineWidth = 1.5;
        for (let arm = 0; arm < 3; arm++) {
          ctx.beginPath();
          for (let j = 0; j < 20; j++) {
            const angle = t * 0.03 + arm * (Math.PI * 2 / 3) + j * 0.3;
            const r = R * (0.9 - j * 0.035);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r * 0.7; // elliptical
            if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Core singularity — dark center with bright event horizon
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, R*0.2);
        coreGrad.addColorStop(0, '#000000');
        coreGrad.addColorStop(0.6, '#0a0015');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath(); ctx.arc(0, 0, R*0.25, 0, Math.PI*2); ctx.fill();

        // Event horizon ring
        ctx.strokeStyle = '#bb66ff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5 + Math.sin(t*0.06)*0.2;
        ctx.beginPath(); ctx.arc(0, 0, R*0.15, 0, Math.PI*2); ctx.stroke();

        // Bright singularity point
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.3 + Math.sin(t*0.1)*0.15;
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        // Energy barrier — translucent forcefield
        const bGrad = ctx.createRadialGradient(0, 0, obs.radius*0.2, 0, 0, obs.radius);
        bGrad.addColorStop(0, 'rgba(60,120,220,0.15)');
        bGrad.addColorStop(1, 'rgba(40,80,180,0.05)');
        ctx.fillStyle = bGrad;
        ctx.beginPath(); ctx.arc(0, 0, obs.radius, 0, Math.PI*2); ctx.fill();
        // Shimmering edge
        ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3+Math.sin(state.tick*0.06)*0.2;
        ctx.beginPath(); ctx.arc(0, 0, obs.radius, 0, Math.PI*2); ctx.stroke();
        // Energy crackle
        ctx.globalAlpha = 0.15+Math.sin(state.tick*0.1+obs.rotation)*0.1;
        ctx.beginPath(); ctx.arc(0, 0, obs.radius*0.7, state.tick*0.03, state.tick*0.03+1.5); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }

    // ── Terrain formations — canyon walls, debris corridors ──
    for (const seg of state.terrain) {
      const gapCenter = seg.gapX * w;
      const gapHalf = seg.width / 2;
      const sy = seg.pos.y;
      const sh = seg.height;

      ctx.save();

      switch (seg.type) {
        case 'canyon': {
          // Rocky canyon walls — left and right with jagged edges
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          // Left wall
          ctx.fillStyle = seg.color;
          ctx.beginPath();
          ctx.moveTo(0, sy - sh);
          for (let i = 0; i <= 8; i++) {
            const jag = Math.sin(i * 3.7 + seg.pos.y * 0.05) * 12;
            ctx.lineTo(leftEdge + jag, sy - sh + (sh * 2 / 8) * i);
          }
          ctx.lineTo(0, sy + sh);
          ctx.closePath();
          ctx.fill();
          // Right wall
          ctx.beginPath();
          ctx.moveTo(w, sy - sh);
          for (let i = 0; i <= 8; i++) {
            const jag = Math.sin(i * 2.9 + seg.pos.y * 0.04) * 12;
            ctx.lineTo(rightEdge - jag, sy - sh + (sh * 2 / 8) * i);
          }
          ctx.lineTo(w, sy + sh);
          ctx.closePath();
          ctx.fill();
          // Highlight edges
          ctx.strokeStyle = '#7a6a5a';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          for (let i = 0; i <= 8; i++) {
            const jag = Math.sin(i * 3.7 + seg.pos.y * 0.05) * 12;
            if (i === 0) ctx.moveTo(leftEdge + jag, sy - sh + (sh * 2 / 8) * i);
            else ctx.lineTo(leftEdge + jag, sy - sh + (sh * 2 / 8) * i);
          }
          ctx.stroke();
          ctx.beginPath();
          for (let i = 0; i <= 8; i++) {
            const jag = Math.sin(i * 2.9 + seg.pos.y * 0.04) * 12;
            if (i === 0) ctx.moveTo(rightEdge - jag, sy - sh + (sh * 2 / 8) * i);
            else ctx.lineTo(rightEdge - jag, sy - sh + (sh * 2 / 8) * i);
          }
          ctx.stroke();
          break;
        }
        case 'asteroidcorridor': {
          // Clusters of asteroids on each side
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          ctx.fillStyle = '#3a3025';
          // Left asteroid cluster
          for (let i = 0; i < 5; i++) {
            const ax = Math.sin(i * 4.3 + seg.pos.y * 0.03) * 30 + leftEdge * 0.5;
            const ay = sy + Math.sin(i * 2.7) * sh * 0.6;
            const ar = 15 + Math.sin(i * 1.9) * 10;
            ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.fill();
          }
          // Right cluster
          for (let i = 0; i < 5; i++) {
            const ax = w - Math.sin(i * 3.1 + seg.pos.y * 0.03) * 30 - (w - rightEdge) * 0.5;
            const ay = sy + Math.cos(i * 2.3) * sh * 0.6;
            const ar = 15 + Math.cos(i * 1.7) * 10;
            ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.fill();
          }
          // Danger glow near gap edge
          ctx.strokeStyle = '#ff4422';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2 + Math.sin(state.tick * 0.05) * 0.1;
          ctx.beginPath(); ctx.moveTo(leftEdge, sy - sh); ctx.lineTo(leftEdge, sy + sh); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(rightEdge, sy - sh); ctx.lineTo(rightEdge, sy + sh); ctx.stroke();
          break;
        }
        case 'stationdebris': {
          // Epic wrecked station — detailed hull with exposed internals
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;

          // Left wreckage — layered hull
          // Outer hull plating
          const lGrad = ctx.createLinearGradient(0, sy - sh, leftEdge, sy);
          lGrad.addColorStop(0, '#1a2a3a');
          lGrad.addColorStop(0.6, '#2a3a4a');
          lGrad.addColorStop(1, '#3a4a5a');
          ctx.fillStyle = lGrad;
          ctx.beginPath();
          ctx.moveTo(0, sy - sh);
          ctx.lineTo(leftEdge * 0.4, sy - sh * 0.9);
          ctx.lineTo(leftEdge - 20, sy - sh * 0.4);
          ctx.lineTo(leftEdge, sy - 8);
          ctx.lineTo(leftEdge - 8, sy + 12);
          ctx.lineTo(leftEdge * 0.5, sy + sh * 0.6);
          ctx.lineTo(0, sy + sh);
          ctx.closePath(); ctx.fill();

          // Exposed internal structure (glowing conduits)
          ctx.strokeStyle = '#44aaff';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.3 + Math.sin(state.tick * 0.04) * 0.15;
          for (let i = 0; i < 4; i++) {
            const iy = sy - sh * 0.5 + i * sh * 0.3;
            ctx.beginPath();
            ctx.moveTo(leftEdge * 0.3, iy);
            ctx.lineTo(leftEdge * 0.7, iy + 5);
            ctx.lineTo(leftEdge - 15, iy + 2);
            ctx.stroke();
          }

          // Hull panel lines
          ctx.strokeStyle = '#4a6a7a';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.4;
          for (let i = 0; i < 3; i++) {
            const py = sy - sh * 0.6 + i * sh * 0.4;
            ctx.beginPath();
            ctx.moveTo(5, py);
            ctx.lineTo(leftEdge - 20, py + 3);
            ctx.stroke();
          }

          // Right wreckage
          const rGrad = ctx.createLinearGradient(rightEdge, sy, w, sy - sh);
          rGrad.addColorStop(0, '#3a4a5a');
          rGrad.addColorStop(0.4, '#2a3a4a');
          rGrad.addColorStop(1, '#1a2a3a');
          ctx.fillStyle = rGrad;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(w, sy - sh);
          ctx.lineTo(w - (w - rightEdge) * 0.5, sy - sh * 0.8);
          ctx.lineTo(rightEdge + 15, sy - sh * 0.3);
          ctx.lineTo(rightEdge, sy + 5);
          ctx.lineTo(rightEdge + 20, sy + sh * 0.5);
          ctx.lineTo(w, sy + sh * 0.9);
          ctx.closePath(); ctx.fill();

          // Right internal conduits
          ctx.strokeStyle = '#ff6644';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.25 + Math.sin(state.tick * 0.05 + 1) * 0.15;
          for (let i = 0; i < 3; i++) {
            const iy = sy - sh * 0.3 + i * sh * 0.3;
            ctx.beginPath();
            ctx.moveTo(rightEdge + 20, iy);
            ctx.lineTo(w - 30, iy - 3);
            ctx.stroke();
          }

          // Sparking effects — random electrical arcs
          if (Math.random() < 0.15) {
            ctx.strokeStyle = '#ffdd44';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.8;
            const sparkSide = Math.random() < 0.5;
            const sx2 = sparkSide ? leftEdge - 5 : rightEdge + 5;
            const sy2 = sy + (Math.random() - 0.5) * sh;
            ctx.beginPath();
            ctx.moveTo(sx2, sy2);
            ctx.lineTo(sx2 + (sparkSide ? 12 : -12), sy2 + (Math.random() - 0.5) * 15);
            ctx.lineTo(sx2 + (sparkSide ? 8 : -8), sy2 + (Math.random() - 0.5) * 20);
            ctx.stroke();
            // Spark glow
            ctx.fillStyle = '#ffee88';
            ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(sx2, sy2, 3, 0, Math.PI * 2); ctx.fill();
          }

          // Floating debris particles near the edges
          ctx.fillStyle = '#5a6a7a';
          ctx.globalAlpha = 0.5;
          for (let i = 0; i < 3; i++) {
            const dx = (Math.sin(state.tick * 0.02 + i * 3) * 15) + (i % 2 === 0 ? leftEdge + 10 : rightEdge - 10);
            const dy = sy + Math.cos(state.tick * 0.015 + i * 2) * sh * 0.3;
            ctx.save();
            ctx.translate(dx, dy);
            ctx.rotate(state.tick * 0.01 + i);
            ctx.fillRect(-3, -2, 6, 4);
            ctx.restore();
          }

          // Window lights on intact sections
          ctx.fillStyle = '#44aaff';
          ctx.globalAlpha = 0.2 + Math.sin(state.tick * 0.08) * 0.1;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(leftEdge * 0.3 + i * 15, sy - sh * 0.2, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        case 'wormholetunnel': {
          // Energy walls — glowing purple boundaries
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          const pulse = 0.4 + Math.sin(state.tick * 0.06 + seg.pos.y * 0.02) * 0.2;
          // Left energy wall
          const lGrad = ctx.createLinearGradient(0, sy, leftEdge, sy);
          lGrad.addColorStop(0, 'transparent');
          lGrad.addColorStop(0.7, `rgba(100,30,180,${pulse * 0.3})`);
          lGrad.addColorStop(1, `rgba(150,50,255,${pulse * 0.6})`);
          ctx.fillStyle = lGrad;
          ctx.fillRect(0, sy - sh, leftEdge, sh * 2);
          // Right energy wall
          const rGrad = ctx.createLinearGradient(rightEdge, sy, w, sy);
          rGrad.addColorStop(0, `rgba(150,50,255,${pulse * 0.6})`);
          rGrad.addColorStop(0.3, `rgba(100,30,180,${pulse * 0.3})`);
          rGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = rGrad;
          ctx.fillRect(rightEdge, sy - sh, w - rightEdge, sh * 2);
          // Edge lightning
          ctx.strokeStyle = '#aa66ff';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = pulse;
          ctx.beginPath(); ctx.moveTo(leftEdge, sy - sh); ctx.lineTo(leftEdge, sy + sh); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(rightEdge, sy - sh); ctx.lineTo(rightEdge, sy + sh); ctx.stroke();
          break;
        }
        case 'crystalfield': {
          // Stunning crystalline formations — glowing, refracting light
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          const t = state.tick;

          // Draw crystal clusters on each side
          const drawCrystal = (cx: number, cy: number, ch: number, cw: number, rot: number, hue: number) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);

            // Crystal body — gradient from dark base to bright tip
            const cGrad = ctx.createLinearGradient(0, ch * 0.3, 0, -ch);
            cGrad.addColorStop(0, `hsl(${hue}, 50%, 15%)`);
            cGrad.addColorStop(0.5, `hsl(${hue}, 60%, 25%)`);
            cGrad.addColorStop(1, `hsl(${hue}, 70%, 45%)`);
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.moveTo(0, -ch);
            ctx.lineTo(-cw, -ch * 0.1);
            ctx.lineTo(-cw * 0.6, ch * 0.3);
            ctx.lineTo(cw * 0.6, ch * 0.3);
            ctx.lineTo(cw, -ch * 0.1);
            ctx.closePath();
            ctx.fill();

            // Inner facet highlight
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.3)`;
            ctx.beginPath();
            ctx.moveTo(0, -ch * 0.9);
            ctx.lineTo(-cw * 0.3, -ch * 0.2);
            ctx.lineTo(cw * 0.1, -ch * 0.1);
            ctx.closePath();
            ctx.fill();

            // Tip glow — pulsing
            const glow = 0.4 + Math.sin(t * 0.06 + cx * 0.1) * 0.25;
            ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${glow})`;
            ctx.beginPath();
            ctx.arc(0, -ch * 0.8, 4 + Math.sin(t * 0.1 + cy) * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Light beam shooting from tip
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${glow * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -ch);
            ctx.lineTo(Math.sin(t * 0.03 + cx) * 20, -ch - 25);
            ctx.stroke();

            ctx.restore();
          };

          // Left crystal cluster
          for (let i = 0; i < 5; i++) {
            const cx = leftEdge * (0.15 + i * 0.18);
            const cy = sy + Math.sin(i * 2.1 + seg.pos.y * 0.01) * sh * 0.5;
            const ch = 25 + Math.sin(i * 3.3) * 15;
            const cw = 7 + Math.sin(i * 1.7) * 3;
            const hue = 180 + i * 15; // cyan to teal range
            drawCrystal(cx, cy, ch, cw, -0.4 + i * 0.18, hue);
          }

          // Right crystal cluster
          for (let i = 0; i < 5; i++) {
            const cx = rightEdge + (w - rightEdge) * (0.15 + i * 0.18);
            const cy = sy + Math.cos(i * 1.8 + seg.pos.y * 0.01) * sh * 0.5;
            const ch = 22 + Math.cos(i * 2.7) * 12;
            const cw = 6 + Math.cos(i * 2.1) * 3;
            const hue = 270 + i * 12; // purple to violet range
            drawCrystal(cx, cy, ch, cw, 0.4 - i * 0.15, hue);
          }

          // Ambient floating crystal dust between formations
          ctx.fillStyle = '#88eeff';
          ctx.globalAlpha = 0.2;
          for (let i = 0; i < 6; i++) {
            const dx = gapCenter + Math.sin(t * 0.02 + i * 1.5) * gapHalf * 0.6;
            const dy = sy + Math.cos(t * 0.015 + i * 2.3) * sh * 0.4;
            ctx.beginPath();
            ctx.arc(dx, dy, 1 + Math.sin(t * 0.1 + i) * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── Outposts — hover-to-capture islands ──
    for (const op of state.outposts) {
      ctx.save();
      ctx.translate(op.pos.x, op.pos.y);

      // Capture radius indicator (always visible — shows interaction zone)
      if (!op.captured) {
        ctx.strokeStyle = '#44ffaa';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.15 + Math.sin(state.tick * 0.04) * 0.05;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, op.radius + 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = op.captured ? 0.3 : 0.9;

      // Draw based on type
      switch (op.type) {
        case 'station': {
          // Space station — rotating ring with central hub
          ctx.save();
          ctx.rotate(op.rotation);
          ctx.strokeStyle = '#667788';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.8, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#334455';
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.35, 0, Math.PI * 2); ctx.fill();
          // Solar panels
          ctx.fillStyle = '#223344';
          ctx.fillRect(-op.radius * 0.9, -3, op.radius * 1.8, 6);
          ctx.fillRect(-3, -op.radius * 0.9, 6, op.radius * 1.8);
          // Lights
          ctx.fillStyle = '#44ffaa';
          ctx.globalAlpha = 0.6 + Math.sin(state.tick * 0.08) * 0.3;
          ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          break;
        }
        case 'planet': {
          // Planet with atmosphere glow
          const pGrad = ctx.createRadialGradient(-op.radius * 0.2, -op.radius * 0.2, op.radius * 0.1, 0, 0, op.radius);
          pGrad.addColorStop(0, '#4488aa');
          pGrad.addColorStop(0.7, '#225566');
          pGrad.addColorStop(1, '#112233');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.8, 0, Math.PI * 2); ctx.fill();
          // Atmosphere
          ctx.strokeStyle = '#66ccff';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.25;
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.85, 0, Math.PI * 2); ctx.stroke();
          // Surface markings
          ctx.fillStyle = '#336655';
          ctx.globalAlpha = 0.3;
          ctx.beginPath(); ctx.ellipse(op.radius * 0.15, -op.radius * 0.1, op.radius * 0.3, op.radius * 0.15, 0.3, 0, Math.PI * 2); ctx.fill();
          break;
        }
        case 'derelict': {
          // Broken ship — angular debris shape
          ctx.fillStyle = '#3a3530';
          ctx.save(); ctx.rotate(op.rotation);
          ctx.beginPath();
          ctx.moveTo(-op.radius * 0.8, -op.radius * 0.3);
          ctx.lineTo(op.radius * 0.6, -op.radius * 0.5);
          ctx.lineTo(op.radius * 0.9, op.radius * 0.1);
          ctx.lineTo(op.radius * 0.3, op.radius * 0.6);
          ctx.lineTo(-op.radius * 0.5, op.radius * 0.4);
          ctx.lineTo(-op.radius * 0.9, 0);
          ctx.closePath(); ctx.fill();
          // Sparking damage
          if (Math.random() < 0.1) {
            ctx.fillStyle = '#ffaa44';
            ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.arc((Math.random()-0.5)*op.radius, (Math.random()-0.5)*op.radius*0.5, 2, 0, Math.PI*2); ctx.fill();
          }
          // Blinking distress signal
          ctx.fillStyle = '#ff4444';
          ctx.globalAlpha = Math.sin(state.tick * 0.15) > 0.5 ? 0.8 : 0.1;
          ctx.beginPath(); ctx.arc(0, -op.radius * 0.2, 3, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          break;
        }
        case 'beacon': {
          // Small pulsing navigation beacon
          ctx.fillStyle = '#ffaa00';
          ctx.globalAlpha = 0.4 + Math.sin(state.tick * 0.1) * 0.3;
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.5, 0, Math.PI * 2); ctx.fill();
          // Pulsing rings
          const ringAlpha = (state.tick % 60) / 60;
          ctx.strokeStyle = '#ffcc44';
          ctx.globalAlpha = (1 - ringAlpha) * 0.4;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(0, 0, op.radius * 0.5 + ringAlpha * op.radius, 0, Math.PI * 2); ctx.stroke();
          // Antenna
          ctx.strokeStyle = '#888';
          ctx.globalAlpha = 0.6;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -op.radius * 0.8); ctx.stroke();
          break;
        }
        case 'tradeship': {
          // Merchant vessel — friendly shape
          ctx.fillStyle = '#445566';
          ctx.save(); ctx.rotate(op.rotation * 0.5);
          ctx.beginPath();
          ctx.moveTo(0, -op.radius * 0.7);
          ctx.lineTo(-op.radius * 0.5, op.radius * 0.3);
          ctx.lineTo(-op.radius * 0.3, op.radius * 0.7);
          ctx.lineTo(op.radius * 0.3, op.radius * 0.7);
          ctx.lineTo(op.radius * 0.5, op.radius * 0.3);
          ctx.closePath(); ctx.fill();
          // Cargo pods
          ctx.fillStyle = '#ffdd00';
          ctx.globalAlpha = 0.4;
          ctx.fillRect(-op.radius * 0.2, -op.radius * 0.1, op.radius * 0.4, op.radius * 0.3);
          // Engine glow
          ctx.fillStyle = '#4488ff';
          ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.ellipse(0, op.radius * 0.65, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          break;
        }
      }

      // Capture progress ring (only if actively being captured)
      if (!op.captured && op.captureProgress > 0) {
        ctx.globalAlpha = 0.9;
        // Background ring
        ctx.strokeStyle = '#224433';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, op.radius + 5, 0, Math.PI * 2); ctx.stroke();
        // Progress fill
        ctx.strokeStyle = '#44ffaa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, op.radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * op.captureProgress);
        ctx.stroke();
        // Percentage text
        ctx.fillStyle = '#44ffaa';
        ctx.font = 'bold 10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(op.captureProgress * 100)}%`, 0, op.radius + 22);
        ctx.textAlign = 'left';
      }

      // Name label (when player is nearby)
      if (!op.captured) {
        const playerDist = Math.sqrt(
          (state.player.pos.x - op.pos.x) ** 2 + (state.player.pos.y - op.pos.y) ** 2
        );
        if (playerDist < op.radius + 80) {
          ctx.fillStyle = '#aaffcc';
          ctx.globalAlpha = Math.min(1, (op.radius + 80 - playerDist) / 60);
          ctx.font = '9px Courier New';
          ctx.textAlign = 'center';
          ctx.fillText(op.name, 0, -op.radius - 10);
          ctx.fillStyle = '#668877';
          ctx.font = '8px Courier New';
          ctx.fillText('HOVER TO CAPTURE', 0, -op.radius - 0);
          ctx.textAlign = 'left';
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Enemies
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      const color = FACTION_COLORS[enemy.faction];

      if (enemy.type === 'boss') {
        this.drawBoss(enemy, state.tick);
      } else {
        ctx.save();
        ctx.translate(enemy.pos.x, enemy.pos.y);
        ctx.globalAlpha = 0.95;
        this.drawDetailedEnemy(ctx, enemy, color, state.tick);

        // HP bar for tough enemies
        if (enemy.maxHp > 5) {
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = '#222';
          ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 8, enemy.width, 4);
          ctx.fillStyle = color;
          ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 8, enemy.width * (enemy.hp / enemy.maxHp), 4);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-enemy.width / 2, -enemy.height / 2 - 8, enemy.width, 4);
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    // Player
    if (state.player.alive) {
      this.drawPlayer(state);
    }

    // Particles — with glow and trails for premium feel
    for (const p of state.particles) {
      const alpha = p.life / p.maxLife;
      const size = p.size * alpha;
      if (alpha <= 0 || size < 0.2) continue;

      ctx.globalAlpha = alpha;

      // Large particles get a soft outer glow
      if (size > 3) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.2;
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
      }

      // Core
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Hot center for fire-colored particles
      if (size > 2 && (p.color.includes('ff') || p.color === '#ffffff')) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // ── Floating score popups ──
    for (const pop of state.popups) {
      const alpha = pop.life / pop.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pop.color;
      ctx.font = `bold ${Math.floor(10 + (1 - alpha) * 4)}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.pos.x, pop.pos.y);
    }
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;

    // ── Graze flash — white shimmer around player on near-miss ──
    if (state.grazeFlash > 0 && state.player.alive) {
      ctx.globalAlpha = state.grazeFlash / 8 * 0.4;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(state.player.pos.x, state.player.pos.y, state.player.width * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // HUD
    this.drawHUD(state);

    // Boss HP bar
    if (state.bossActive) {
      this.drawBossHP(state);
    }

    // ── Beat pulse visual — edge glow that breathes with the music ──
    if (state.beatPulse > 0.05) {
      const bp = state.beatPulse;
      const factionColor = stage?.faction === 'klingon' ? '255,50,30' :
        stage?.faction === 'romulan' ? '30,255,80' :
        stage?.faction === 'orion' ? '255,170,30' : '0,150,255';
      // Edge vignette that pulses with bass
      const grad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.75);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, `rgba(${factionColor},${bp * 0.08})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Bottom glow bar (like a bass speaker visualizer)
      ctx.fillStyle = `rgba(${factionColor},${bp * 0.12})`;
      ctx.fillRect(0, h - 3, w * bp, 3);
      ctx.fillRect(w * (1 - bp), h - 3, w * bp, 3);
    }

    // ── Music intensity — background energy visualization ──
    if (state.musicIntensity > 0.6) {
      const mi = (state.musicIntensity - 0.6) * 2.5; // 0-1 in high range
      // Top and bottom edge glow lines
      ctx.globalAlpha = mi * 0.15;
      ctx.fillStyle = '#4488ff';
      ctx.fillRect(0, 0, w, 2);
      ctx.fillRect(0, h - 2, w, 2);
      ctx.globalAlpha = 1;
    }

    // Armory icon bar — top center
    this.drawArmoryBar(ctx, state, w);

    // Respawn countdown overlay
    if (state.phase === 'respawning') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, w, h);
      const secondsLeft = Math.ceil(state.player.invulnTimer / 60);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 20px Courier New';
      ctx.fillText('SHIP DESTROYED', w / 2, h / 2 - 40);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Courier New';
      ctx.fillText(String(secondsLeft), w / 2, h / 2 + 15);
      ctx.fillStyle = '#888';
      ctx.font = '14px Courier New';
      ctx.fillText(`${state.player.lives} ${state.player.lives === 1 ? 'LIFE' : 'LIVES'} REMAINING`, w / 2, h / 2 + 50);
      ctx.textAlign = 'left';
    }

    // Game over overlay
    if (state.phase === 'gameover') {
      this.drawGameOver(state);
    }

    // Victory overlay
    if (state.phase === 'victory') {
      this.drawVictory(state);
    }

    // ── End screen shake transform ──
    ctx.restore();

    // ── Post-processing effects (drawn without shake) ──

    // Screen flash
    if (state.screenFlash > 0.01) {
      ctx.globalAlpha = state.screenFlash;
      ctx.fillStyle = state.screenFlashColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Damage vignette (red edges when hit)
    if (state.damageVignette > 0.01) {
      const vGrad = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.75);
      vGrad.addColorStop(0, 'transparent');
      vGrad.addColorStop(1, `rgba(180,0,0,${state.damageVignette * 0.7})`);
      ctx.fillStyle = vGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // Boss warning banner
    // Boss warning — just the red pulsating border, no overlay
    if (state.bossWarning > 0) {
      const warnAlpha = Math.min(1, state.bossWarning / 30) * (0.5 + Math.sin(state.tick * 0.15) * 0.3);
      ctx.strokeStyle = `rgba(255,0,0,${warnAlpha * 0.6})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, w - 4, h - 4);
    }

    // Boss entrance darkening
    if (state.bossEntrance > 0) {
      const eAlpha = Math.min(0.3, state.bossEntrance / 120 * 0.3);
      ctx.fillStyle = `rgba(0,0,0,${eAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Scanline overlay (subtle CRT effect)
    if (state.phase === 'playing' || state.phase === 'boss') {
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = '#000';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Slow-motion visual tint (boss kill dramatic moment)
    if (state.slowMotion > 0) {
      ctx.globalAlpha = Math.min(0.15, state.slowMotion / 90 * 0.15);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }

  private drawPlayer(state: ShmupState): void {
    const { ctx } = this;
    const p = state.player;

    if (p.invulnTimer > 0 && state.tick % 6 < 3) return;

    ctx.save();
    ctx.translate(p.pos.x, p.pos.y);

    const W = p.width * 1.2, H = p.height * 1.2; // slightly bigger
    const ep = 0.6 + Math.sin(state.tick * 0.25) * 0.3; // engine pulse

    // ── Warp nacelle exhaust (blue glow behind nacelles) ──
    ctx.fillStyle = '#3366ff';
    ctx.globalAlpha = 0.6 * ep;
    ctx.beginPath(); ctx.ellipse(-W*0.42, H*0.35, 4, 12+ep*8, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W*0.42, H*0.35, 4, 12+ep*8, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#aaddff'; ctx.globalAlpha = 0.8 * ep;
    ctx.beginPath(); ctx.ellipse(-W*0.42, H*0.32, 2, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W*0.42, H*0.32, 2, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Nacelle pylons (angled struts connecting hull to nacelles) ──
    ctx.fillStyle = '#2a3a50';
    ctx.beginPath(); ctx.moveTo(-W*0.1, H*0.05); ctx.lineTo(-W*0.38, H*0.0);
    ctx.lineTo(-W*0.4, H*0.05); ctx.lineTo(-W*0.12, H*0.1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W*0.1, H*0.05); ctx.lineTo(W*0.38, H*0.0);
    ctx.lineTo(W*0.4, H*0.05); ctx.lineTo(W*0.12, H*0.1); ctx.closePath(); ctx.fill();

    // ── Warp nacelles (long cylindrical pods) ──
    ctx.fillStyle = '#2a3a55';
    // Left nacelle
    ctx.beginPath();
    ctx.ellipse(-W*0.42, H*0.05, W*0.07, H*0.28, 0, 0, Math.PI*2);
    ctx.fill();
    // Right nacelle
    ctx.beginPath();
    ctx.ellipse(W*0.42, H*0.05, W*0.07, H*0.28, 0, 0, Math.PI*2);
    ctx.fill();
    // Nacelle blue stripe (warp coils)
    ctx.fillStyle = '#3388dd'; ctx.globalAlpha = 0.7;
    ctx.fillRect(-W*0.44, -H*0.15, W*0.04, H*0.35);
    ctx.fillRect(W*0.44 - W*0.04, -H*0.15, W*0.04, H*0.35);
    ctx.globalAlpha = 1;
    // Bussard collectors (red tips at front of nacelles)
    ctx.fillStyle = '#cc3322';
    ctx.beginPath(); ctx.ellipse(-W*0.42, -H*0.22, W*0.06, W*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W*0.42, -H*0.22, W*0.06, W*0.06, 0, 0, Math.PI*2); ctx.fill();
    // Bussard inner glow
    ctx.fillStyle = '#ff6644'; ctx.globalAlpha = 0.5+Math.sin(state.tick*0.1)*0.3;
    ctx.beginPath(); ctx.arc(-W*0.42, -H*0.22, W*0.035, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(W*0.42, -H*0.22, W*0.035, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Engineering hull (connecting body) ──
    ctx.fillStyle = '#354a65';
    ctx.beginPath();
    ctx.moveTo(-W*0.08, -H*0.1);
    ctx.lineTo(-W*0.1, H*0.25);
    ctx.lineTo(W*0.1, H*0.25);
    ctx.lineTo(W*0.08, -H*0.1);
    ctx.closePath();
    ctx.fill();
    // Deflector dish (glowing blue at bottom of engineering)
    ctx.fillStyle = '#44aaff'; ctx.globalAlpha = 0.6+Math.sin(state.tick*0.08)*0.2;
    ctx.beginPath(); ctx.ellipse(0, H*0.22, W*0.06, W*0.04, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Saucer section (main disc at front) ──
    const saucerGrad = ctx.createRadialGradient(-W*0.05, -H*0.22, W*0.02, 0, -H*0.15, W*0.28);
    saucerGrad.addColorStop(0, '#7a8a9a');
    saucerGrad.addColorStop(0.5, '#4a5a6a');
    saucerGrad.addColorStop(1, '#2a3a4a');
    ctx.fillStyle = saucerGrad;
    ctx.beginPath();
    ctx.ellipse(0, -H*0.18, W*0.28, H*0.18, 0, 0, Math.PI*2);
    ctx.fill();
    // Saucer rim accent
    ctx.strokeStyle = '#6688aa'; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(0, -H*0.18, W*0.28, H*0.18, 0, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    // Bridge dome
    ctx.fillStyle = '#8899aa';
    ctx.beginPath(); ctx.ellipse(0, -H*0.2, W*0.08, H*0.05, 0, 0, Math.PI*2); ctx.fill();
    // Bridge windows
    ctx.fillStyle = '#aaddff'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.ellipse(0, -H*0.21, W*0.04, H*0.025, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Weapon hardpoints ──
    if (p.phaserLevel > 0) {
      // Phaser strips on saucer
      ctx.strokeStyle = '#ff8833'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(0, -H*0.18, W*0.25, -0.6, 0.6); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (p.missileLevel > 0) {
      ctx.fillStyle = '#554433';
      ctx.fillRect(-W*0.33, H*0.0, 4, 6);
      ctx.fillRect(W*0.33-4, H*0.0, 4, 6);
    }
    if (p.laserLevel > 0) {
      ctx.fillStyle = '#ff44ff'; ctx.globalAlpha = 0.5+Math.sin(state.tick*0.15)*0.3;
      ctx.beginPath(); ctx.arc(0, -H*0.36, 3, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Shield bubble ──
    if (p.shields > 0) {
      ctx.strokeStyle = '#4488cc'; ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.12 + (p.shields / p.maxShields) * 0.2;
      ctx.beginPath(); ctx.ellipse(0, 0, W*0.52, H*0.5, 0, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // ── Overdrive glow ──
    if (p.overdriveTimer > 0) {
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 + Math.sin(state.tick * 0.2) * 0.2;
      ctx.beginPath(); ctx.ellipse(0, 0, W*0.55, H*0.52, 0, 0, Math.PI*2); ctx.stroke();
      // Fire aura
      ctx.fillStyle = '#ff4400';
      ctx.globalAlpha = 0.1;
      ctx.beginPath(); ctx.ellipse(0, 0, W*0.6, H*0.55, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Score multiplier indicator ──
    if (p.scoreMultTimer > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.globalAlpha = 0.5 + Math.sin(state.tick * 0.12) * 0.2;
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('×2', 0, -H * 0.55);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // ── Companion Drone (drawn outside player transform) ──
    if (p.droneActive) {
      const droneX = p.pos.x + Math.sin(state.tick * 0.08) * 30;
      const droneY = p.pos.y - 25 + Math.cos(state.tick * 0.06) * 5;
      ctx.save();
      ctx.translate(droneX, droneY);
      // Drone body
      ctx.fillStyle = '#225544';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Drone glow
      ctx.fillStyle = '#44ffaa';
      ctx.globalAlpha = 0.5 + Math.sin(state.tick * 0.15) * 0.3;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  private drawDetailedEnemy(ctx: CanvasRenderingContext2D, enemy: any, color: string, tick: number): void {
    const W = enemy.width, H = enemy.height;
    const dk = this.darken(color, 0.35);
    const dk2 = this.darken(color, 0.2);
    const lt = this.lighten(color, 0.3);
    const hpPct = enemy.hp / enemy.maxHp;
    const ep = 0.5 + Math.sin(tick * 0.2) * 0.3; // engine pulse

    // Damage effects
    if (hpPct < 0.5) {
      ctx.fillStyle = 'rgba(60,30,5,0.5)';
      ctx.beginPath(); ctx.arc((Math.random()-0.5)*W*0.4, (Math.random()-0.5)*H*0.4, (1-hpPct)*12, 0, Math.PI*2); ctx.fill();
      // Sparking
      if (Math.random() < 0.3) {
        ctx.fillStyle = '#ffaa44';
        ctx.beginPath(); ctx.arc((Math.random()-0.5)*W*0.4, (Math.random()-0.5)*H*0.4, 2, 0, Math.PI*2); ctx.fill();
      }
    }
    if ((enemy.type==='elite'||enemy.type==='cruiser') && hpPct > 0.7) {
      ctx.strokeStyle = color; ctx.globalAlpha = 0.12; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, W*0.6, H*0.6, 0, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = 0.95;
    }

    switch (enemy.type) {
      case 'fighter': {
        // ═══ KLINGON BIRD OF PREY ═══
        // Engine exhaust
        ctx.fillStyle = color; ctx.globalAlpha = 0.4 * ep;
        ctx.beginPath(); ctx.ellipse(-W*0.15, -H*0.35, 3, 8+ep*5, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W*0.15, -H*0.35, 3, 8+ep*5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = lt; ctx.globalAlpha = 0.6 * ep;
        ctx.beginPath(); ctx.ellipse(-W*0.15, -H*0.33, 1.5, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W*0.15, -H*0.33, 1.5, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95;
        // Wing underside (darker layer)
        ctx.fillStyle = dk2;
        ctx.beginPath();
        ctx.moveTo(-W*0.12, H*0.05); ctx.lineTo(-W*0.48, -H*0.12); ctx.lineTo(-W*0.42, -H*0.2);
        ctx.lineTo(-W*0.1, -H*0.15); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(W*0.12, H*0.05); ctx.lineTo(W*0.48, -H*0.12); ctx.lineTo(W*0.42, -H*0.2);
        ctx.lineTo(W*0.1, -H*0.15); ctx.closePath(); ctx.fill();
        // Main hull
        ctx.fillStyle = dk;
        ctx.beginPath();
        ctx.moveTo(0, H*0.45);
        ctx.lineTo(-W*0.1, H*0.15); ctx.lineTo(-W*0.48, -H*0.1);
        ctx.lineTo(-W*0.38, -H*0.35); ctx.lineTo(-W*0.12, -H*0.25);
        ctx.lineTo(0, -H*0.35);
        ctx.lineTo(W*0.12, -H*0.25); ctx.lineTo(W*0.38, -H*0.35);
        ctx.lineTo(W*0.48, -H*0.1); ctx.lineTo(W*0.1, H*0.15);
        ctx.closePath(); ctx.fill();
        // Hull panel lines
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.moveTo(-W*0.08, H*0.1); ctx.lineTo(-W*0.44, -H*0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W*0.08, H*0.1); ctx.lineTo(W*0.44, -H*0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-W*0.3, -H*0.2); ctx.lineTo(W*0.3, -H*0.2); ctx.stroke();
        // Wing-tip disruptor cannons
        ctx.fillStyle = color; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(-W*0.47, -H*0.1, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(W*0.47, -H*0.1, 3, 0, Math.PI*2); ctx.fill();
        // Cockpit window
        ctx.fillStyle = lt; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.ellipse(0, H*0.25, 4, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.ellipse(-1, H*0.23, 2, 3, 0, 0, Math.PI*2); ctx.fill();
        // Hull markings
        ctx.fillStyle = color; ctx.globalAlpha = 0.2;
        ctx.fillRect(-1.5, -H*0.2, 3, H*0.3);
        ctx.globalAlpha = 1;
        break;
      }
      case 'bomber': {
        // ═══ ROMULAN WARBIRD ═══
        // Engine exhaust — green singularity drive
        ctx.fillStyle = color; ctx.globalAlpha = 0.35 * ep;
        ctx.beginPath(); ctx.ellipse(-W*0.22, -H*0.4, 5, 10+ep*6, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W*0.22, -H*0.4, 5, 10+ep*6, 0, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95;
        // Outer hull — curved warbird shape
        ctx.fillStyle = dk2;
        ctx.beginPath();
        ctx.moveTo(0, H*0.48);
        ctx.quadraticCurveTo(-W*0.15, H*0.35, -W*0.35, H*0.1);
        ctx.quadraticCurveTo(-W*0.5, -H*0.05, -W*0.48, -H*0.2);
        ctx.lineTo(-W*0.38, -H*0.42);
        ctx.lineTo(-W*0.15, -H*0.32);
        ctx.lineTo(0, -H*0.22);
        ctx.lineTo(W*0.15, -H*0.32);
        ctx.lineTo(W*0.38, -H*0.42);
        ctx.lineTo(W*0.48, -H*0.2);
        ctx.quadraticCurveTo(W*0.5, -H*0.05, W*0.35, H*0.1);
        ctx.quadraticCurveTo(W*0.15, H*0.35, 0, H*0.48);
        ctx.closePath(); ctx.fill();
        // Inner hull plating
        ctx.fillStyle = dk;
        ctx.beginPath();
        ctx.moveTo(0, H*0.38);
        ctx.quadraticCurveTo(-W*0.25, H*0.15, -W*0.38, -H*0.08);
        ctx.lineTo(-W*0.28, -H*0.3); ctx.lineTo(0, -H*0.15);
        ctx.lineTo(W*0.28, -H*0.3); ctx.lineTo(W*0.38, -H*0.08);
        ctx.quadraticCurveTo(W*0.25, H*0.15, 0, H*0.38);
        ctx.closePath(); ctx.fill();
        // Central command section
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath(); ctx.ellipse(0, H*0.05, W*0.2, H*0.15, 0, 0, Math.PI*2); ctx.fill();
        // Singularity core — pulsing
        const coreGrad = ctx.createRadialGradient(0, H*0.05, 0, 0, H*0.05, W*0.12);
        coreGrad.addColorStop(0, color); coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad; ctx.globalAlpha = 0.4+Math.sin(tick*0.07)*0.3;
        ctx.beginPath(); ctx.arc(0, H*0.05, W*0.12, 0, Math.PI*2); ctx.fill();
        // Hull seam lines
        ctx.strokeStyle = color; ctx.globalAlpha = 0.2; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(-W*0.4, -H*0.05); ctx.quadraticCurveTo(0, H*0.2, W*0.4, -H*0.05); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-W*0.3, -H*0.25); ctx.lineTo(W*0.3, -H*0.25); ctx.stroke();
        // Plasma torpedo tubes
        ctx.fillStyle = color; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(0, H*0.42, 3, 0, Math.PI*2); ctx.fill();
        // Window lights along hull
        ctx.fillStyle = lt; ctx.globalAlpha = 0.25;
        for (let i = -3; i <= 3; i++) {
          ctx.fillRect(i*W*0.08 - 1, H*0.15, 2, 1.5);
        }
        ctx.globalAlpha = 1;
        break;
      }
      case 'cruiser': {
        // ═══ HOSTILE GALAXY-CLASS CRUISER ═══
        // Nacelle exhaust
        ctx.fillStyle = color; ctx.globalAlpha = 0.4 * ep;
        ctx.beginPath(); ctx.ellipse(-W*0.42, -H*0.15, 5, 14+ep*8, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W*0.42, -H*0.15, 5, 14+ep*8, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = lt; ctx.globalAlpha = 0.5 * ep;
        ctx.beginPath(); ctx.ellipse(-W*0.42, -H*0.12, 2.5, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W*0.42, -H*0.12, 2.5, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95;
        // Nacelle pylons — angled struts
        ctx.fillStyle = '#1a1a2a';
        ctx.beginPath(); ctx.moveTo(-W*0.12, H*0.0); ctx.lineTo(-W*0.38, -H*0.08);
        ctx.lineTo(-W*0.4, -H*0.03); ctx.lineTo(-W*0.14, H*0.05); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(W*0.12, H*0.0); ctx.lineTo(W*0.38, -H*0.08);
        ctx.lineTo(W*0.4, -H*0.03); ctx.lineTo(W*0.14, H*0.05); ctx.closePath(); ctx.fill();
        // Nacelles — detailed pods
        for (const side of [-1, 1]) {
          const nx = side * W * 0.42;
          ctx.fillStyle = dk;
          ctx.beginPath();
          ctx.ellipse(nx, -H*0.05, W*0.08, H*0.22, 0, 0, Math.PI*2); ctx.fill();
          // Warp coil strip
          ctx.fillStyle = color; ctx.globalAlpha = 0.5;
          ctx.fillRect(nx - 1.5, -H*0.22, 3, H*0.3);
          // Bussard collector
          ctx.fillStyle = '#cc3322'; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.ellipse(nx, -H*0.25, W*0.06, W*0.06, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#ff6644'; ctx.globalAlpha = 0.4+Math.sin(tick*0.1)*0.2;
          ctx.beginPath(); ctx.arc(nx, -H*0.25, W*0.035, 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 0.95;
        // Engineering hull
        ctx.fillStyle = dk;
        ctx.beginPath();
        ctx.moveTo(-W*0.12, H*0.08); ctx.lineTo(-W*0.14, -H*0.3);
        ctx.lineTo(W*0.14, -H*0.3); ctx.lineTo(W*0.12, H*0.08); ctx.closePath(); ctx.fill();
        // Deflector dish
        const dfGrad = ctx.createRadialGradient(0, -H*0.22, 0, 0, -H*0.22, W*0.07);
        dfGrad.addColorStop(0, color); dfGrad.addColorStop(1, dk2);
        ctx.fillStyle = dfGrad; ctx.globalAlpha = 0.6+Math.sin(tick*0.06)*0.2;
        ctx.beginPath(); ctx.ellipse(0, -H*0.22, W*0.07, W*0.05, 0, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.95;
        // Saucer section — gradient disc
        const sGrad = ctx.createRadialGradient(-W*0.05, H*0.12, W*0.02, 0, H*0.18, W*0.34);
        sGrad.addColorStop(0, this.lighten(dk, 0.15));
        sGrad.addColorStop(0.5, dk);
        sGrad.addColorStop(1, dk2);
        ctx.fillStyle = sGrad;
        ctx.beginPath(); ctx.ellipse(0, H*0.18, W*0.34, H*0.22, 0, 0, Math.PI*2); ctx.fill();
        // Saucer rim
        ctx.strokeStyle = color; ctx.globalAlpha = 0.2; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, H*0.18, W*0.34, H*0.22, 0, 0, Math.PI*2); ctx.stroke();
        // Phaser strips
        ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, H*0.18, W*0.3, -0.7, 0.7); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, H*0.18, W*0.3, Math.PI-0.5, Math.PI+0.5); ctx.stroke();
        // Bridge dome
        ctx.fillStyle = '#111';
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.ellipse(0, H*0.2, W*0.1, H*0.07, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = lt; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.ellipse(0, H*0.2, W*0.06, H*0.04, 0, 0, Math.PI*2); ctx.fill();
        // Window lights on saucer
        ctx.fillStyle = lt; ctx.globalAlpha = 0.15;
        for (let i = 0; i < 8; i++) {
          const wa = (Math.PI*2/8)*i;
          const wr = W*0.25;
          ctx.fillRect(Math.cos(wa)*wr - 1, H*0.18 + Math.sin(wa)*H*0.15 - 0.5, 2, 1);
        }
        // Impulse engines
        ctx.fillStyle = color; ctx.globalAlpha = 0.35;
        ctx.fillRect(-W*0.08, H*0.38, W*0.16, 3);
        ctx.globalAlpha = 1;
        break;
      }
      case 'elite': {
        // ═══ BORG CUBE ═══
        // Outer shell — dark with depth gradient
        const cubeGrad = ctx.createLinearGradient(-W*0.42, -H*0.42, W*0.42, H*0.42);
        cubeGrad.addColorStop(0, '#0c0c0c'); cubeGrad.addColorStop(0.5, '#080808'); cubeGrad.addColorStop(1, '#050505');
        ctx.fillStyle = cubeGrad;
        ctx.fillRect(-W*0.44, -H*0.44, W*0.88, H*0.88);
        // Grid seams — dense technological pattern
        ctx.strokeStyle = color; ctx.lineWidth = 0.6; ctx.globalAlpha = 0.35;
        for (let i = -4; i <= 4; i++) {
          const g = i * W * 0.1;
          ctx.beginPath(); ctx.moveTo(g, -H*0.44); ctx.lineTo(g, H*0.44); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-W*0.44, g); ctx.lineTo(W*0.44, g); ctx.stroke();
        }
        // Subsystem panels (random lit squares)
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 6; i++) {
          const px = (Math.sin(i*3.7+tick*0.01)*0.35)*W;
          const py = (Math.cos(i*2.3+tick*0.008)*0.35)*H;
          ctx.fillStyle = color;
          ctx.fillRect(px-W*0.04, py-H*0.04, W*0.08, H*0.08);
        }
        // Central core — pulsing with rings
        const cp = 0.35 + Math.sin(tick*0.06)*0.25;
        const coreG = ctx.createRadialGradient(0, 0, 0, 0, 0, W*0.18);
        coreG.addColorStop(0, color); coreG.addColorStop(0.5, dk); coreG.addColorStop(1, 'transparent');
        ctx.fillStyle = coreG; ctx.globalAlpha = cp;
        ctx.beginPath(); ctx.arc(0, 0, W*0.18, 0, Math.PI*2); ctx.fill();
        // Rotating inner ring
        ctx.strokeStyle = color; ctx.globalAlpha = 0.3; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, W*0.12, tick*0.02, tick*0.02+Math.PI*1.5); ctx.stroke();
        // Corner weapon nodes — larger, glowing
        ctx.globalAlpha = 0.6;
        const corners = [[-1,-1],[1,-1],[1,1],[-1,1]];
        for (const [cx2,cy2] of corners) {
          const ng = ctx.createRadialGradient(cx2*W*0.36, cy2*H*0.36, 0, cx2*W*0.36, cy2*H*0.36, 6);
          ng.addColorStop(0, color); ng.addColorStop(1, 'transparent');
          ctx.fillStyle = ng;
          ctx.beginPath(); ctx.arc(cx2*W*0.36, cy2*H*0.36, 6, 0, Math.PI*2); ctx.fill();
        }
        // Outer border — double line
        ctx.strokeStyle = color; ctx.globalAlpha = 0.25; ctx.lineWidth = 2;
        ctx.strokeRect(-W*0.44, -H*0.44, W*0.88, H*0.88);
        ctx.globalAlpha = 0.1; ctx.lineWidth = 1;
        ctx.strokeRect(-W*0.4, -H*0.4, W*0.8, H*0.8);
        // Tractor beam emitter (bottom center)
        ctx.fillStyle = color; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(0, H*0.44, 4, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'turret': {
        // ═══ ORBITAL DEFENSE PLATFORM ═══
        // Base — octagonal armor
        ctx.fillStyle = '#121218';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i + Math.PI/8;
          const r = W*0.46;
          if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
          else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath(); ctx.fill();
        // Armor plating segments
        ctx.fillStyle = dk2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i + Math.PI/8;
          const r = W*0.38;
          if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
          else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath(); ctx.fill();
        // Panel lines between segments
        ctx.strokeStyle = color; ctx.globalAlpha = 0.15; ctx.lineWidth = 0.6;
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i + Math.PI/8;
          ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a)*W*0.44, Math.sin(a)*H*0.44); ctx.stroke();
        }
        // Rotating dual weapon barrels
        ctx.save(); ctx.rotate(tick * 0.02);
        ctx.fillStyle = dk; ctx.globalAlpha = 0.9;
        ctx.fillRect(-3, -H*0.44, 6, H*0.35);
        ctx.fillRect(-3, H*0.09, 6, H*0.35);
        // Barrel tips
        ctx.fillStyle = color; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(0, -H*0.44, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, H*0.44, 4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        // Central hub with gradient
        const hubG = ctx.createRadialGradient(0, 0, 0, 0, 0, W*0.15);
        hubG.addColorStop(0, color); hubG.addColorStop(1, dk2);
        ctx.fillStyle = hubG; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(0, 0, W*0.15, 0, Math.PI*2); ctx.fill();
        // Targeting scanner ring
        ctx.strokeStyle = color; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, W*0.22, tick*0.03, tick*0.03+Math.PI); ctx.stroke();
        // Status lights
        ctx.globalAlpha = 0.5+Math.sin(tick*0.1)*0.25;
        for (let i = 0; i < 4; i++) {
          const a = (Math.PI*2/4)*i + Math.PI/4;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(Math.cos(a)*W*0.4, Math.sin(a)*H*0.4, 3, 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        break;
      }
    }
  }

  private parseColor(color: string): [number, number, number] {
    if (color.startsWith('#')) {
      return [parseInt(color.slice(1,3),16), parseInt(color.slice(3,5),16), parseInt(color.slice(5,7),16)];
    }
    const m = color.match(/(\d+)/g);
    if (m && m.length >= 3) return [+m[0], +m[1], +m[2]];
    return [128, 128, 128];
  }

  private darken(color: string, factor: number): string {
    const [r,g,b] = this.parseColor(color);
    return `rgb(${Math.floor(r*factor)},${Math.floor(g*factor)},${Math.floor(b*factor)})`;
  }

  private lighten(color: string, factor: number): string {
    const [r,g,b] = this.parseColor(color);
    return `rgb(${Math.min(255,Math.floor(r+(255-r)*factor))},${Math.min(255,Math.floor(g+(255-g)*factor))},${Math.min(255,Math.floor(b+(255-b)*factor))})`;
  }

  private drawBoss(enemy: any, tick: number): void {
    const { ctx } = this;
    const color = FACTION_COLORS[enemy.faction as keyof typeof FACTION_COLORS];
    const W = enemy.width, H = enemy.height;
    const phase = enemy.phase || 0;
    const hpPct = enemy.maxHp > 0 ? Math.max(0, Math.min(1, enemy.hp / enemy.maxHp)) : 0;

    ctx.save();
    ctx.translate(enemy.pos.x, enemy.pos.y);

    // Entrance energy field — crackling warp-in effect
    if (enemy.pos.y < enemy.height * 0.5) {
      const entrancePct = 1 - enemy.pos.y / (enemy.height * 0.5);
      ctx.globalAlpha = entrancePct * 0.5;
      // Expanding energy rings
      for (let i = 0; i < 3; i++) {
        const ringR = W * 0.5 + (tick * 2 + i * 30) % 80;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, ringR, ringR * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Lightning bolts (random arcs)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = entrancePct * 0.6 * (Math.random() > 0.5 ? 1 : 0.3);
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2;
        const r1 = W * 0.2;
        const r2 = W * 0.5 + Math.random() * 20;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1 * 0.6);
        const mid = r1 + (r2 - r1) * 0.5;
        ctx.lineTo(Math.cos(a + 0.2) * mid, Math.sin(a + 0.2) * mid * 0.6);
        ctx.lineTo(Math.cos(a - 0.1) * r2, Math.sin(a - 0.1) * r2 * 0.6);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Damage glow — pulsing red as HP drops
    if (hpPct < 0.5) {
      ctx.globalAlpha = (1 - hpPct) * 0.3 * (0.5 + Math.sin(tick * 0.1) * 0.5);
      ctx.fillStyle = '#ff2200';
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.6, H * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.95;

    // Draw unique hull based on stage boss type
    this.drawBossHull(ctx, W, H, color, tick, phase, enemy.faction);

    // Shield shimmer effect
    ctx.globalAlpha = 0.15 + Math.sin(tick * 0.04) * 0.08;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, W * 0.55, H * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Weak points — glowing orbs that pulse
    if (enemy.weakPoints) {
      for (const wp of enemy.weakPoints) {
        const wpX = wp.offset.x;
        const wpY = wp.offset.y;
        if (wp.alive) {
          // Glowing weak point
          ctx.globalAlpha = 0.6 + Math.sin(tick * 0.08 + wpX) * 0.3;
          ctx.fillStyle = '#ffdd00';
          ctx.beginPath();
          ctx.arc(wpX, wpY, 10, 0, Math.PI * 2);
          ctx.fill();
          // Inner core
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(wpX, wpY, 5, 0, Math.PI * 2);
          ctx.fill();
          // HP ring
          ctx.globalAlpha = 0.7;
          ctx.strokeStyle = '#ffdd00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const wpPct = wp.maxHp > 0 ? Math.max(0, Math.min(1, wp.hp / wp.maxHp)) : 0;
          ctx.arc(wpX, wpY, 12, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * wpPct));
          ctx.stroke();
        } else {
          // Destroyed — smoking crater
          ctx.globalAlpha = 0.4 + Math.sin(tick * 0.05) * 0.15;
          ctx.fillStyle = '#331100';
          ctx.beginPath();
          ctx.arc(wpX, wpY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#ff4400';
          ctx.beginPath();
          ctx.arc(wpX, wpY, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Engine exhaust — gets more erratic in later phases
    const exhaustCount = 2 + phase;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < exhaustCount; i++) {
      const ex = (i - (exhaustCount - 1) / 2) * (W * 0.25 / exhaustCount);
      const ey = -H * 0.45;
      const flicker = Math.sin(tick * 0.2 + i * 3) * 3;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(ex, ey - flicker, 4 + phase, 8 + phase * 2 + flicker, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(ex, ey - flicker, 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  private drawBossHull(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, tick: number, phase: number, faction: string): void {
    // Massive detailed hull — unique shape
    const darkColor = this.darkenColor(color, 0.4);
    const midColor = this.darkenColor(color, 0.7);

    // Main armored body
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.5);
    ctx.lineTo(-W * 0.15, -H * 0.4);
    ctx.lineTo(-W * 0.35, -H * 0.2);
    ctx.lineTo(-W * 0.5, 0);
    ctx.lineTo(-W * 0.45, H * 0.3);
    ctx.lineTo(-W * 0.2, H * 0.5);
    ctx.lineTo(W * 0.2, H * 0.5);
    ctx.lineTo(W * 0.45, H * 0.3);
    ctx.lineTo(W * 0.5, 0);
    ctx.lineTo(W * 0.35, -H * 0.2);
    ctx.lineTo(W * 0.15, -H * 0.4);
    ctx.closePath();
    ctx.fill();

    // Hull plating lines
    ctx.strokeStyle = midColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * W * 0.1, -H * 0.4);
      ctx.lineTo(i * W * 0.13, H * 0.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.95;

    // Wing nacelles
    ctx.fillStyle = midColor;
    // Left wing
    ctx.beginPath();
    ctx.moveTo(-W * 0.35, -H * 0.1);
    ctx.lineTo(-W * 0.55, -H * 0.15);
    ctx.lineTo(-W * 0.55, H * 0.15);
    ctx.lineTo(-W * 0.35, H * 0.2);
    ctx.closePath();
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(W * 0.35, -H * 0.1);
    ctx.lineTo(W * 0.55, -H * 0.15);
    ctx.lineTo(W * 0.55, H * 0.15);
    ctx.lineTo(W * 0.35, H * 0.2);
    ctx.closePath();
    ctx.fill();

    // Command bridge (top)
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(0, -H * 0.15, W * 0.12, H * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bridge windows
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6 + Math.sin(tick * 0.05) * 0.2;
    ctx.beginPath();
    ctx.ellipse(0, -H * 0.15, W * 0.06, H * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.95;

    // Weapon ports — glow based on phase
    const portGlow = 0.4 + phase * 0.2 + Math.sin(tick * 0.08) * 0.2;
    ctx.globalAlpha = portGlow;
    ctx.fillStyle = color;
    // Front cannons
    ctx.beginPath();
    ctx.arc(-W * 0.2, H * 0.35, 5 + phase, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W * 0.2, H * 0.35, 5 + phase, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, H * 0.45, 6 + phase, 0, Math.PI * 2);
    ctx.fill();

    // Phase-based damage effects
    if (phase >= 2) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#ff4400';
      // Fires on hull
      for (let i = 0; i < phase; i++) {
        const fx = Math.sin(tick * 0.03 + i * 2.5) * W * 0.3;
        const fy = Math.cos(tick * 0.02 + i * 1.7) * H * 0.2;
        ctx.beginPath();
        ctx.ellipse(fx, fy, 4 + Math.sin(tick * 0.1 + i) * 2, 8 + Math.sin(tick * 0.15 + i) * 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  private darkenColor(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
  }

  private drawHUD(state: ShmupState): void {
    const { ctx, w, h } = this;
    const p = state.player;
    // Scale HUD for small screens
    const s = Math.min(1, w / 500); // scale factor: 1.0 on desktop, smaller on mobile
    const fs = Math.max(9, Math.floor(12 * s));

    ctx.font = `${fs}px Courier New`;
    ctx.textAlign = 'left';

    // Score
    ctx.fillStyle = '#fff';
    ctx.fillText(`SCORE: ${state.score.toLocaleString()}`, 8 * s + 4, 24 * s);

    // Combo
    if (state.combo > 1) {
      ctx.fillStyle = '#ffdd00';
      ctx.fillText(`x${state.combo} COMBO`, 12, 42);
    }

    // Graze counter (only show if player has grazed)
    if (state.grazeCount > 0) {
      ctx.fillStyle = state.grazeFlash > 0 ? '#ffffff' : '#aaaaff';
      ctx.fillText(`GRAZE: ${state.grazeCount}`, 12, state.combo > 1 ? 57 : 42);
    }

    // Lives
    ctx.fillStyle = '#ff8888';
    ctx.fillText('♥'.repeat(p.lives), 12, state.grazeCount > 0 ? 75 : 60);

    // Shields
    ctx.fillStyle = '#44ff44';
    ctx.fillText(`SHD: ${'■'.repeat(Math.max(0, p.shields))}${'□'.repeat(Math.max(0, p.maxShields - p.shields))}`, 12, 78);

    // (weapon loadout is now shown via the armory bar at top center)

    // Coins (right side)
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#ffdd00';
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ ${p.stars} COINS`, w - 12, 24);

    // Bombs
    ctx.fillStyle = '#ff4444';
    ctx.fillText(`BOMB: ${'● '.repeat(p.bombCount)}`, w - 12, 42);

    // ESC hint
    ctx.fillStyle = '#445';
    ctx.font = '9px Courier New';
    ctx.fillText('ESC: EXIT', w - 12, 58);

    // Stage name
    const stage = state.stages[state.currentStage];
    if (stage && state.tick < 180) {
      ctx.textAlign = 'center';
      ctx.globalAlpha = Math.min(1, (180 - state.tick) / 60);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Courier New';
      ctx.fillText(stage.name, w / 2, this.h / 3);
      ctx.font = '12px Courier New';
      ctx.fillStyle = '#888';
      ctx.fillText(stage.subtitle, w / 2, this.h / 3 + 24);
      ctx.globalAlpha = 1;
    }

    ctx.textAlign = 'left';
  }

  private drawArmoryBar(ctx: CanvasRenderingContext2D, state: ShmupState, w: number): void {
    const p = state.player;
    const weapons = [
      { icon: '◆', label: 'GUN', level: p.mainGunLevel, max: 5, color: '#0cc', active: true },
      { icon: '◇', label: 'WNG', level: p.wingGunLevel, max: 4, color: '#88ddff', active: p.wingGunLevel > 0 },
      { icon: '▸', label: 'MSL', level: p.missileLevel, max: 3, color: '#ffaa00', active: p.missileLevel > 0 },
      { icon: '║', label: 'LSR', level: p.laserLevel, max: 2, color: '#ff44ff', active: p.laserLevel > 0 },
      { icon: '≋', label: 'PHS', level: p.phaserLevel, max: 3, color: '#ff8833', active: p.phaserLevel > 0 },
      { icon: '◎', label: 'SHD', level: p.shields, max: p.maxShields, color: '#44ff44', active: true },
      { icon: '●', label: 'BMB', level: p.bombCount, max: 5, color: '#ff4444', active: p.bombCount > 0 },
    ];

    // Scale for screen size
    const sc = Math.min(1, w / 500);
    const slotW = Math.floor(54 * sc);
    const totalW = weapons.length * slotW;
    const startX = (w - totalW) / 2;
    const y = 8;
    const barH = Math.floor(46 * sc);

    // Bar background
    ctx.fillStyle = 'rgba(0,5,15,0.7)';
    ctx.fillRect(startX - 6, y - 4, totalW + 12, barH + 4);
    ctx.strokeStyle = 'rgba(100,150,200,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX - 6, y - 4, totalW + 12, barH + 4);

    for (let i = 0; i < weapons.length; i++) {
      const wep = weapons[i];
      const x = startX + i * slotW + slotW / 2;

      // Icon
      ctx.textAlign = 'center';
      ctx.font = `bold ${Math.floor(20*sc)}px Courier New`;
      ctx.fillStyle = wep.active ? wep.color : '#2a2a2a';
      ctx.globalAlpha = wep.active ? 1 : 0.35;
      ctx.fillText(wep.icon, x, y + 20);

      // Label
      ctx.font = `${Math.floor(8*sc)}px Courier New`;
      ctx.fillStyle = wep.active ? '#889' : '#333';
      ctx.fillText(wep.label, x, y + 30);

      // Level pips
      const pipY = y + Math.floor(35 * sc);
      const pipW = Math.max(3, Math.floor(5 * sc));
      const pipH = Math.max(2, Math.floor(4 * sc));
      const pipsTotal = wep.max;
      const pipsStart = x - (pipsTotal * (pipW + 2)) / 2;
      for (let j = 0; j < pipsTotal; j++) {
        ctx.fillStyle = j < wep.level ? wep.color : '#1a1a1a';
        ctx.globalAlpha = j < wep.level ? 0.9 : 0.3;
        ctx.fillRect(pipsStart + j * (pipW + 2), pipY, pipW, pipH);
      }
      ctx.globalAlpha = 1;

      // Flash glow when recently upgraded
      if (state.upgradeFlashTimer > 0 && state.upgradeFlash.toLowerCase().includes(wep.label.toLowerCase().slice(0, 3))) {
        ctx.fillStyle = wep.color;
        ctx.globalAlpha = state.upgradeFlashTimer / 90 * 0.4;
        ctx.beginPath();
        ctx.arc(x, y + 18, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Magnet indicator
    if (p.magnetActive) {
      ctx.fillStyle = '#ff88ff';
      ctx.globalAlpha = 0.5 + Math.sin(state.tick * 0.1) * 0.3;
      ctx.font = '8px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('MAG', w / 2, y + 38);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'left';
  }

  private drawBossHP(state: ShmupState): void {
    const { ctx, w } = this;
    const stage = state.stages[state.currentStage];
    const bossColor = FACTION_COLORS[stage?.faction || 'klingon'];
    const barW = w * 0.65;
    const barX = (w - barW) / 2;
    const barY = 60;
    const barH = 12;
    const hpPct = state.bossMaxHp > 0 ? Math.max(0, Math.min(1, state.bossHp / state.bossMaxHp)) : 0;

    // Background with dark border
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(barX - 4, barY - 4, barW + 8, barH + 8);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(barX, barY, barW, barH);

    // HP fill with gradient
    const grad = ctx.createLinearGradient(barX, barY, barX + barW * hpPct, barY);
    grad.addColorStop(0, bossColor);
    grad.addColorStop(1, hpPct < 0.3 ? '#ff2200' : bossColor);
    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    // Phase markers
    const boss = state.enemies.find(e => e.type === 'boss');
    const numPhases = stage?.boss?.phases || 3;
    for (let i = 1; i < numPhases; i++) {
      const markerX = barX + barW * (1 - i / numPhases);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(markerX, barY);
      ctx.lineTo(markerX, barY + barH);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = bossColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX, barY, barW, barH);

    // Boss name + WARNING
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'center';
    if (stage?.boss) {
      ctx.fillText(`⚠ ${stage.boss.name.toUpperCase()} ⚠`, w / 2, barY - 8);
    }

    // Weak points remaining
    if (boss?.weakPoints) {
      const alive = boss.weakPoints.filter((wp: any) => wp.alive).length;
      const total = boss.weakPoints.length;
      if (total > 0) {
        ctx.font = '9px Courier New';
        ctx.fillStyle = alive > 0 ? '#ffdd00' : '#666';
        ctx.fillText(`WEAK POINTS: ${'◉'.repeat(alive)}${'◎'.repeat(total - alive)}`, w / 2, barY + barH + 14);
      }
    }

    ctx.textAlign = 'left';
  }

  private drawGameOver(state: ShmupState): void {
    const { ctx, w, h } = this;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 32px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION FAILED', w / 2, h / 2 - 20);
    ctx.fillStyle = '#ccc';
    ctx.font = '14px Courier New';
    ctx.fillText(`Score: ${state.score.toLocaleString()} | Stars: ${state.player.stars}`, w / 2, h / 2 + 20);
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('Press ENTER to return to hangar', w / 2, h / 2 + 60);
    ctx.textAlign = 'left';
  }

  private drawVictory(state: ShmupState): void {
    const { ctx, w, h } = this;
    const t = state.tick;

    // Dramatic fade-in
    const fadeIn = Math.min(1, (t % 1000) / 60);
    ctx.fillStyle = `rgba(0,0,10,${0.7 * fadeIn})`;
    ctx.fillRect(0, 0, w, h);

    // Celebratory rays radiating from center
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.globalAlpha = 0.08 * fadeIn;
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 / 12) * i + t * 0.005;
      ctx.fillStyle = i % 2 === 0 ? '#00ccff' : '#ffdd00';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * w, Math.sin(a) * w);
      ctx.lineTo(Math.cos(a + 0.15) * w, Math.sin(a + 0.15) * w);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Main text with glow
    ctx.textAlign = 'center';
    ctx.globalAlpha = fadeIn;

    // Glow behind text
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00ccff';
    ctx.font = 'bold 36px Courier New';
    ctx.fillText('SECTOR CLEARED', w / 2, h / 2 - 40);
    ctx.shadowBlur = 0;

    // Stage name
    const stage = state.stages[state.currentStage];
    if (stage) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Courier New';
      ctx.fillText(stage.name, w / 2, h / 2 - 10);
    }

    // Score with golden glow
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffdd00';
    ctx.font = 'bold 20px Courier New';
    ctx.fillText(`SCORE: ${state.score.toLocaleString()}`, w / 2, h / 2 + 25);
    ctx.shadowBlur = 0;

    // Stats
    ctx.fillStyle = '#44ff44';
    ctx.font = '14px Courier New';
    ctx.fillText(`★ ${state.player.stars} COINS EARNED`, w / 2, h / 2 + 55);

    // Rank
    const rank = state.score > 50000 ? 'S' : state.score > 30000 ? 'A' : state.score > 15000 ? 'B' : 'C';
    const rankColor = rank === 'S' ? '#ffdd00' : rank === 'A' ? '#00ccff' : rank === 'B' ? '#44ff44' : '#888';
    ctx.fillStyle = rankColor;
    ctx.font = 'bold 48px Courier New';
    ctx.fillText(rank, w / 2, h / 2 + 110);
    ctx.font = '10px Courier New';
    ctx.fillStyle = '#666';
    ctx.fillText('RANK', w / 2, h / 2 + 125);

    // Continue prompt (pulsing)
    ctx.fillStyle = `rgba(136,136,136,${0.5 + Math.sin(t * 0.05) * 0.3})`;
    ctx.font = '12px Courier New';
    ctx.fillText('PRESS ENTER TO CONTINUE', w / 2, h / 2 + 160);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  // ── Environment System ─────────────────────────────────────
  private updateEnvironment(state: ShmupState, w: number, h: number): void {
    const stageIdx = state.currentStage;
    const envConfig = STAGE_ENVIRONMENTS[stageIdx] || STAGE_ENVIRONMENTS[0];

    // Spawn new objects
    for (const spawn of envConfig.envObjects) {
      if (Math.random() < spawn.frequency) {
        const size = spawn.sizeRange[0] + Math.random() * (spawn.sizeRange[1] - spawn.sizeRange[0]);
        const parallax = spawn.parallaxRange[0] + Math.random() * (spawn.parallaxRange[1] - spawn.parallaxRange[0]);
        this.envObjects.push({
          pos: { x: Math.random() * w, y: -size },
          size,
          type: spawn.type,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          parallax,
          color: spawn.colors[Math.floor(Math.random() * spawn.colors.length)],
          opacity: 0.15 + parallax * 0.4,
        });
      }
    }

    // Scroll objects
    for (const obj of this.envObjects) {
      obj.pos.y += state.scrollSpeed * obj.parallax * 2 + 0.5;
      obj.rotation += obj.rotSpeed;
    }

    // Remove off-screen
    this.envObjects = this.envObjects.filter(o => o.pos.y < h + o.size * 2);
  }

  private drawBackgroundEvents(ctx: CanvasRenderingContext2D, state: ShmupState, w: number, h: number): void {
    const t = state.tick;

    // Distant capital ship silhouettes — slow drift across background
    if (t % 600 < 300 && state.currentStage >= 1) {
      const shipX = (t % 600) / 300 * (w + 200) - 100;
      const shipY = h * 0.15 + Math.sin(t * 0.003) * 20;
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#334455';
      // Simple ship silhouette
      ctx.beginPath();
      ctx.moveTo(shipX, shipY);
      ctx.lineTo(shipX - 60, shipY - 8);
      ctx.lineTo(shipX - 80, shipY - 3);
      ctx.lineTo(shipX - 80, shipY + 3);
      ctx.lineTo(shipX - 60, shipY + 8);
      ctx.closePath();
      ctx.fill();
      // Nacelles
      ctx.fillRect(shipX - 50, shipY - 18, 30, 3);
      ctx.fillRect(shipX - 50, shipY + 15, 30, 3);
    }

    // Distant explosions — flashes of orange in the far background (on beat)
    if (state.beatPulse > 0.15) {
      const expX = (Math.sin(t * 0.7) * 0.5 + 0.5) * w;
      const expY = Math.sin(t * 0.3 + 1) * h * 0.3 + h * 0.15;
      const expR = 15 + state.beatPulse * 30;
      const expGrad = ctx.createRadialGradient(expX, expY, 0, expX, expY, expR);
      expGrad.addColorStop(0, `rgba(255,150,50,${state.beatPulse * 0.15})`);
      expGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = expGrad;
      ctx.fillRect(expX - expR, expY - expR, expR * 2, expR * 2);
    }

    // Nebula lightning (stages 2, 5) — random flashes during high energy
    if ((state.currentStage === 1 || state.currentStage === 4) && state.musicIntensity > 0.7) {
      if (Math.random() < 0.02) {
        const lx = Math.random() * w;
        const ly = Math.random() * h * 0.4;
        ctx.strokeStyle = '#aaccff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        let cx = lx, cy = ly;
        for (let i = 0; i < 5; i++) {
          cx += (Math.random() - 0.5) * 40;
          cy += Math.random() * 30;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }
    }

    // ── Music-reactive atmosphere — the screen breathes with the song ──
    const mi = state.musicIntensity;
    const bp = state.beatPulse;

    // Background energy wash — color shifts with intensity
    if (mi > 0.3) {
      const stage2 = state.stages[state.currentStage];
      const factionTint = stage2?.faction === 'klingon' ? [40,10,5] :
        stage2?.faction === 'romulan' ? [5,30,15] :
        stage2?.faction === 'orion' ? [30,20,5] : [5,15,30];
      ctx.globalAlpha = (mi - 0.3) * 0.06;
      ctx.fillStyle = `rgb(${factionTint[0]},${factionTint[1]},${factionTint[2]})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Bass pulses — deep atmospheric throbs from bottom of screen
    if (bp > 0.1) {
      const bassGrad = ctx.createLinearGradient(0, h, 0, h * 0.6);
      bassGrad.addColorStop(0, `rgba(30,10,60,${bp * 0.12})`);
      bassGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bassGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // High energy = lens flare in random corner
    if (mi > 0.8 && t % 120 < 60) {
      const flareX = Math.sin(t * 0.001) > 0 ? w * 0.85 : w * 0.15;
      const flareY = h * 0.1;
      const flareR = 40 + (mi - 0.8) * 200;
      const flareGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, flareR);
      flareGrad.addColorStop(0, `rgba(200,220,255,${(mi-0.8)*0.08})`);
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(flareX - flareR, flareY - flareR, flareR * 2, flareR * 2);
    }

    ctx.globalAlpha = 1;
  }

  private drawEnvironment(ctx: CanvasRenderingContext2D, state: ShmupState, w: number, h: number): void {
    for (const obj of this.envObjects) {
      ctx.save();
      ctx.translate(obj.pos.x, obj.pos.y);
      ctx.rotate(obj.rotation);
      ctx.globalAlpha = obj.opacity;

      switch (obj.type) {
        case 'asteroid': {
          // Background asteroid — same organic style, simpler for performance
          const R = obj.size;
          const sd = obj.rotation * 100;
          const breathe2 = 1 + Math.sin(state.tick * 0.006 + sd) * 0.025;
          ctx.scale(breathe2, 1 / breathe2);
          // Smooth organic shape
          const bgN = 12;
          ctx.beginPath();
          for (let i = 0; i < bgN; i++) {
            const a = (Math.PI * 2 / bgN) * i;
            const r = R * (0.8 + Math.sin(i*2.3+sd)*0.12 + Math.sin(i*5.1+sd*1.3)*0.06);
            const a2 = (Math.PI * 2 / bgN) * (i + 0.5);
            const r2 = R * (0.85 + Math.cos(i*3.7+sd)*0.1);
            if (i === 0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
            else ctx.quadraticCurveTo(Math.cos(a2)*r2, Math.sin(a2)*r2, Math.cos(a)*r, Math.sin(a)*r);
          }
          ctx.closePath();
          const bgGrad = ctx.createRadialGradient(-R*0.25, -R*0.25, R*0.05, 0, 0, R);
          bgGrad.addColorStop(0, '#6a6055');
          bgGrad.addColorStop(0.5, '#3a3025');
          bgGrad.addColorStop(1, '#1a1510');
          ctx.fillStyle = bgGrad;
          ctx.fill();
          // Craters
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.beginPath(); ctx.arc(R*0.2, -R*0.15, R*0.18, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(-R*0.2, R*0.2, R*0.12, 0, Math.PI*2); ctx.fill();
          break;
        }

        case 'nebula':
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.size);
          grad.addColorStop(0, obj.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.globalAlpha = obj.opacity * 0.4;
          ctx.beginPath();
          ctx.ellipse(0, 0, obj.size, obj.size * 0.6, obj.rotation * 0.5, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'station':
          ctx.fillStyle = obj.color;
          // Main body
          ctx.fillRect(-obj.size * 0.3, -obj.size * 0.5, obj.size * 0.6, obj.size);
          // Solar panels
          ctx.fillStyle = '#1a3050';
          ctx.fillRect(-obj.size, -obj.size * 0.15, obj.size * 0.6, obj.size * 0.3);
          ctx.fillRect(obj.size * 0.4, -obj.size * 0.15, obj.size * 0.6, obj.size * 0.3);
          // Lights
          ctx.fillStyle = '#44aaff';
          ctx.globalAlpha = 0.5 + Math.sin(state.tick * 0.1 + obj.rotation) * 0.3;
          ctx.beginPath();
          ctx.arc(0, -obj.size * 0.3, 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'debris':
          ctx.strokeStyle = obj.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-obj.size, -obj.size * 0.3);
          ctx.lineTo(obj.size * 0.5, obj.size * 0.2);
          ctx.lineTo(-obj.size * 0.3, obj.size);
          ctx.stroke();
          break;

        case 'planet-bg':
          const pGrad = ctx.createRadialGradient(-obj.size * 0.3, -obj.size * 0.3, obj.size * 0.1, 0, 0, obj.size);
          pGrad.addColorStop(0, obj.color);
          pGrad.addColorStop(1, '#000');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(0, 0, obj.size, 0, Math.PI * 2);
          ctx.fill();
          // Atmosphere ring
          ctx.strokeStyle = obj.color;
          ctx.globalAlpha = obj.opacity * 0.3;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, obj.size + 4, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'ring':
          ctx.strokeStyle = obj.color;
          ctx.lineWidth = obj.size * 0.15;
          ctx.globalAlpha = obj.opacity * 0.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, obj.size, obj.size * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'satellite':
          ctx.fillStyle = obj.color;
          ctx.fillRect(-obj.size * 0.15, -obj.size * 0.5, obj.size * 0.3, obj.size);
          ctx.fillStyle = '#224466';
          ctx.fillRect(-obj.size * 0.7, -obj.size * 0.1, obj.size * 1.4, obj.size * 0.2);
          // Dish
          ctx.strokeStyle = '#88aacc';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, -obj.size * 0.5, obj.size * 0.2, Math.PI, 0);
          ctx.stroke();
          break;
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
}
