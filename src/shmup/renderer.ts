import {
  ShmupState, FACTION_COLORS, ENEMY_STATS, PowerUpType, EnvObject, Obstacle,
} from './types';

const POWERUP_COLORS: Record<PowerUpType, string> = {
  weapon: '#00ccff', shield: '#44ff44', star: '#ffdd00',
  bomb: '#ff4444', magnet: '#ff88ff', missile: '#ffaa00',
  laser: '#ff44ff', phaser: '#ff8833', life: '#ff8888',
  emp: '#44ddff', overdrive: '#ff6600', drone: '#44ffaa', score2x: '#ffff00',
  crew: '#ffcc66',  // warm amber — Federation away-team uniform
};

const POWERUP_LABELS: Record<PowerUpType, string> = {
  weapon: 'W', shield: 'S', star: '★', bomb: 'B', magnet: 'M', missile: 'R', laser: 'L', phaser: 'P', life: '♥',
  emp: '⚡', overdrive: '🔥', drone: '◈', score2x: '×2', crew: 'C',
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
  // Galactic-depth layer: barely moves, fills the void with depth
  private deepStars: { x: number; y: number; brightness: number; hue: number }[] = [];
  // Foreground dust motes: drift across the front, sell the speed
  private dustMotes: { x: number; y: number; speed: number; size: number }[] = [];
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

    // Multi-layer starfield — four depths for real parallax
    for (let i = 0; i < 100; i++) {
      this.stars.push({ x: Math.random(), y: Math.random(), speed: 0.5 + Math.random() * 2, brightness: 0.3 + Math.random() * 0.7 });
    }
    for (let i = 0; i < 50; i++) {
      this.farStars.push({ x: Math.random(), y: Math.random(), brightness: 0.1 + Math.random() * 0.2 });
    }
    // Galactic dust — barely-moving distant stars, faint tinted (blue/white/amber)
    for (let i = 0; i < 70; i++) {
      this.deepStars.push({
        x: Math.random(), y: Math.random(),
        brightness: 0.05 + Math.random() * 0.12,
        hue: 200 + Math.random() * 60,  // 200-260, cold blue-violet
      });
    }
    // Foreground dust motes — drift fast across the front of the action
    for (let i = 0; i < 25; i++) {
      this.dustMotes.push({
        x: Math.random(), y: Math.random(),
        speed: 3 + Math.random() * 4,
        size: 0.5 + Math.random() * 1.5,
      });
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

      // (removed: per-beat faction-colored screen tint)
      ctx.globalAlpha = 1;
    }

    // Galactic backdrop stars — barely move (parallax depth)
    for (const star of this.deepStars) {
      const sy = ((star.y * h + state.scrollY * 0.04) % h + h) % h;
      ctx.fillStyle = `hsla(${star.hue},80%,75%,${star.brightness})`;
      ctx.fillRect(star.x * w, sy, 1, 1);
    }

    // Far stars (slow parallax) — on top of nebula
    for (const star of this.farStars) {
      const sy = ((star.y * h + state.scrollY * 0.2) % h + h) % h;
      ctx.fillStyle = `rgba(255,255,255,${star.brightness})`;
      ctx.fillRect(star.x * w, sy, 1, 1);
    }

    // Near stars — calm parallax, no beat-driven brightness/streaking
    for (const star of this.stars) {
      const sy = ((star.y * h + state.scrollY * star.speed) % h + h) % h;
      ctx.fillStyle = `rgba(200,220,255,${star.brightness})`;
      ctx.fillRect(star.x * w, sy, star.speed > 1.5 ? 2 : 1, star.speed > 1.5 ? 2 : 1);
    }

    // (removed spectrum highway — perspective frequency bars were strobing)

    // ── Dynamic background events — distant battles ──
    this.drawBackgroundEvents(ctx, state, w, h);

    // Environment objects (scrolling terrain)
    this.updateEnvironment(state, w, h);
    this.drawEnvironment(ctx, state, w, h);

    // Power-ups — unique iconic shapes, no flat circles
    for (const pu of state.powerUps) {
      if (pu.type === 'star') {
        // Coin — golden spinning coin (kept as-is, already elegant)
        const spin = Math.sin(state.tick * 0.12 + pu.pos.x * 0.1);
        const coinW = 7 * Math.abs(spin) + 2;
        ctx.fillStyle = '#ffdd00';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(pu.pos.x, pu.pos.y, coinW, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff8aa'; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.ellipse(pu.pos.x - 1, pu.pos.y - 2, coinW * 0.4, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#aa8800'; ctx.globalAlpha = 0.7; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(pu.pos.x, pu.pos.y, coinW, 7, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
        continue;
      }

      this.drawPowerUpIcon(ctx, pu.pos.x, pu.pos.y, pu.type, state.tick);
    }

    // Enemy bullets — UNIFIED THREAT COLOR (hot magenta-red) so they always
    // read as "danger, dodge". Shape varies per enemy so you can still tell
    // who's shooting, but the color is reserved for enemy fire alone.
    // Palette: outer halo #ff2266, body #ff3377 / #ff5588, hot core #ffeeff
    const THREAT_HALO = '#ff2266';
    const THREAT_BODY = '#ff3377';
    const THREAT_BODY_HOT = '#ff5599';
    const THREAT_CORE = '#ffeeff';

    // ── Music heartbeat — modest pulse so fine-grained bullets stay fine ──
    const bp = state.beatPulse;
    const lowBreath = state.bandBass * 0.25;
    const pulse = Math.min(1.0, bp + lowBreath);
    // Subtle size pump — bullets shouldn't bloat into blobs
    const sizePulse = 1 + pulse * 0.25;
    const corePulse = 1 + pulse * 0.15;
    const alphaPulse = 1 + pulse * 0.4;
    const peakFlash = Math.max(0, bp - 0.25);
    const haloR = Math.round(60 + bp * 70);
    const haloG = Math.round(40 + bp * 60);

    for (const bullet of state.enemyBullets) {
      const fadeAlpha = Math.min(1, bullet.ttl / 15);
      if (fadeAlpha <= 0) continue;

      ctx.save();
      ctx.translate(bullet.pos.x, bullet.pos.y);

      const r = bullet.radius;
      const c = bullet.color;

      // ── Halo — PROPORTIONAL to bullet radius (no min cap) ──
      // Small bullets get small halos. Fine-grained dots stay fine.
      const baseHaloR = r * 2.2;
      const haloRPulsed = baseHaloR * sizePulse;
      const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRPulsed);
      haloGrad.addColorStop(0, `rgba(255, ${haloR}, 110, ${Math.min(1, 0.5 * fadeAlpha * alphaPulse)})`);
      haloGrad.addColorStop(0.55, `rgba(255, ${haloG}, 90, ${Math.min(1, 0.20 * fadeAlpha * alphaPulse)})`);
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath(); ctx.arc(0, 0, haloRPulsed, 0, Math.PI * 2); ctx.fill();

      // Peak-beat flash ring — thinner, smaller
      if (peakFlash > 0.05) {
        ctx.strokeStyle = `rgba(255, 220, 230, ${Math.min(1, peakFlash * 1.0 * fadeAlpha)})`;
        ctx.lineWidth = 1 + peakFlash * 1.2;
        const ringR = baseHaloR * (1.0 + peakFlash * 0.35);
        ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.scale(corePulse, corePulse);
      // Shape source of truth: bullet.shape if explicitly set (e.g. T'VAK
      // weapon hardpoints), otherwise the legacy color-prefix dispatch
      // below picks an appropriate shape for fighter/bomber/cruiser/elite
      // bullets. All shapes still use the unified THREAT palette so the
      // player reads them as "danger" at a glance.
      const shape = bullet.shape;

      // ── Explicit shape: missile ──
      if (shape === 'missile') {
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        // Exhaust trail
        ctx.fillStyle = '#ffaa44';
        ctx.globalAlpha = 0.5 * fadeAlpha;
        ctx.beginPath();
        ctx.ellipse(-r * 1.6, 0, r * 0.6, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffee88';
        ctx.globalAlpha = 0.7 * fadeAlpha;
        ctx.beginPath();
        ctx.ellipse(-r * 1.1, 0, r * 0.35, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
        // Body (missile fuselage, pointing along velocity)
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(r * 1.4, 0);
        ctx.lineTo(r * 0.4, -r * 0.6);
        ctx.lineTo(-r * 0.6, -r * 0.5);
        ctx.lineTo(-r * 0.6, r * 0.5);
        ctx.lineTo(r * 0.4, r * 0.6);
        ctx.closePath(); ctx.fill();
        // Highlight stripe
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.85 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(r * 1.2, 0);
        ctx.lineTo(0, -r * 0.2);
        ctx.lineTo(0, r * 0.2);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        continue;
      }
      // ── Explicit shape: torpedo (big heavy bomb with halo) ──
      if (shape === 'torpedo') {
        // Big soft halo
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.6, 0, Math.PI * 2); ctx.fill();
        // Mid body
        ctx.fillStyle = THREAT_BODY_HOT;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2); ctx.fill();
        // Inner ring (chevron stripe)
        ctx.strokeStyle = '#ffeeff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
        // Hot core
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        continue;
      }
      // ── Explicit shape: phaser lance (thin elongated streak) ──
      if (shape === 'phaserlance') {
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        // Outer glow
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.5, r * 3.5, 0, 0, Math.PI * 2); ctx.fill();
        // Bright thin core
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.18, r * 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        continue;
      }
      // ── Explicit shape: blob (big plasma orb) ──
      if (shape === 'blob') {
        const pulse = 1 + Math.sin(state.tick * 0.15 + bullet.pos.x) * 0.2;
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.28 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.6 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY_HOT;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.1 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.75 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        continue;
      }
      // ── Explicit shape: bolt (sharp aimed disruptor) ──
      if (shape === 'bolt') {
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.2, r * 3.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.7, r * 2.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.25, r * 1.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        continue;
      }

      if (c.startsWith('#ff22') || c.startsWith('#ff44')) {
        // Fighter — elongated bolt
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        // Outer halo
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.25 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 3, 0, 0, Math.PI * 2); ctx.fill();
        // Body
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.65, r * 2.2, 0, 0, Math.PI * 2); ctx.fill();
        // Hot core
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.85 * fadeAlpha;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.25, r * 1.3, 0, 0, Math.PI * 2); ctx.fill();
      } else if (c.startsWith('#ff88') || c.startsWith('#ffaa')) {
        // Bomber — pulsing plasma blob
        const pulse = 1 + Math.sin(state.tick * 0.15 + bullet.pos.x) * 0.2;
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.22 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.4 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY_HOT;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.7 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
      } else if (c.startsWith('#22ff') || c.startsWith('#44ff') || c.startsWith('#88ff')) {
        // Cruiser — diamond/rhombus
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.22 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.8); ctx.lineTo(-r * 0.8, 0); ctx.lineTo(0, r * 1.8); ctx.lineTo(r * 0.8, 0);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.75 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
      } else if (c.startsWith('#bb44') || c.startsWith('#cc44')) {
        // Elite — orb with rotating ring
        const spin = state.tick * 0.1 + bullet.pos.y * 0.05;
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.22 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY_HOT;
        ctx.globalAlpha = 0.9 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = THREAT_HALO;
        ctx.globalAlpha = 0.65 * fadeAlpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.45, spin, spin + Math.PI * 1.2); ctx.stroke();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.7 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2); ctx.fill();
      } else if ((c.startsWith('#ff') && c.includes('ee')) || c.startsWith('#ddcc') || c.startsWith('#ffee')) {
        // Turret — sharp needle
        const angle = Math.atan2(bullet.vel.y, bullet.vel.x);
        ctx.rotate(angle);
        // Halo trail
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.18 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(r * 3.2, 0); ctx.lineTo(-r * 1.2, -r * 0.9); ctx.lineTo(-r * 1.2, r * 0.9);
        ctx.closePath(); ctx.fill();
        // Body
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath();
        ctx.moveTo(r * 3, 0); ctx.lineTo(-r, -r * 0.5); ctx.lineTo(-r, r * 0.5);
        ctx.closePath(); ctx.fill();
        // Hot tip
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.85 * fadeAlpha;
        ctx.beginPath(); ctx.arc(r * 1.8, 0, r * 0.4, 0, Math.PI * 2); ctx.fill();
      } else {
        // Default (boss bullets, etc) — glowing orb
        ctx.fillStyle = THREAT_HALO;
        ctx.globalAlpha = 0.22 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_BODY;
        ctx.globalAlpha = 0.95 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = THREAT_CORE;
        ctx.globalAlpha = 0.7 * fadeAlpha;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }

    // Player bullets — each weapon type gets a distinct silhouette + trail.
    // Trails are velocity-aligned streaks drawn before the body so the bullet
    // reads as "moving fast" even when the projectile itself is small.
    for (const bullet of state.playerBullets) {
      ctx.save();
      ctx.translate(bullet.pos.x, bullet.pos.y);

      // Velocity unit vector, reversed — points to where the bullet was.
      const sp = Math.max(0.001, Math.hypot(bullet.vel.x, bullet.vel.y));
      const tx = -bullet.vel.x / sp;
      const ty = -bullet.vel.y / sp;

      if (bullet.color === '#ffaa00') {
        // ── Missile ── orange warhead, bright exhaust streak, smoke handled engine-side
        const len = 14;
        // Outer plume (wider, dimmer)
        const grad = ctx.createLinearGradient(0, 0, tx * len, ty * len);
        grad.addColorStop(0, 'rgba(255,170,0,0.85)');
        grad.addColorStop(0.5, 'rgba(255,100,0,0.45)');
        grad.addColorStop(1, 'rgba(255,80,0,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = bullet.radius * 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx * len, ty * len); ctx.stroke();
        // Warhead — triangular tip pointing forward
        ctx.fillStyle = '#ffcc44';
        const ang = Math.atan2(bullet.vel.y, bullet.vel.x) + Math.PI / 2;
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -bullet.radius * 1.6);
        ctx.lineTo(-bullet.radius * 0.6, bullet.radius * 0.4);
        ctx.lineTo(bullet.radius * 0.6, bullet.radius * 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (bullet.color === '#ff44ff') {
        // ── Laser ── long bright magenta streak, additive feel
        const len = 22;
        ctx.globalCompositeOperation = 'lighter';
        const grad = ctx.createLinearGradient(0, 0, tx * len, ty * len);
        grad.addColorStop(0, 'rgba(255,180,255,0.95)');
        grad.addColorStop(0.4, 'rgba(255,80,255,0.6)');
        grad.addColorStop(1, 'rgba(180,0,180,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = bullet.radius * 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx * len, ty * len); ctx.stroke();
        // Bright core dot
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(0, 0, bullet.radius * 0.45, 0, Math.PI * 2); ctx.fill();
      } else if (bullet.color === '#ff8833') {
        // ── Phaser bullet ── golden glow with halo
        const len = 12;
        const grad = ctx.createLinearGradient(0, 0, tx * len, ty * len);
        grad.addColorStop(0, 'rgba(255,200,120,0.9)');
        grad.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = bullet.radius * 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx * len, ty * len); ctx.stroke();
        // Golden core
        ctx.fillStyle = '#ffe0a0';
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(0, 0, bullet.radius * 0.55, 0, Math.PI * 2); ctx.fill();
        // Outer halo (gentler — no big disc)
        ctx.fillStyle = '#ff8833';
        ctx.globalAlpha = 0.25;
        ctx.beginPath(); ctx.arc(0, 0, bullet.radius * 1.1, 0, Math.PI * 2); ctx.fill();
      } else if (bullet.color === '#44ffaa') {
        // ── Wingman drone shot ── green
        const len = 10;
        const grad = ctx.createLinearGradient(0, 0, tx * len, ty * len);
        grad.addColorStop(0, 'rgba(68,255,170,0.8)');
        grad.addColorStop(1, 'rgba(68,255,170,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = bullet.radius * 1.1;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx * len, ty * len); ctx.stroke();
        ctx.fillStyle = '#aaffdd';
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(0, 0, bullet.radius * 0.5, 0, Math.PI * 2); ctx.fill();
      } else {
        // ── Main gun / wing guns ── bright blue bolt with cyan streak
        const len = 14;
        const grad = ctx.createLinearGradient(0, 0, tx * len, ty * len);
        grad.addColorStop(0, bullet.color);
        grad.addColorStop(1, 'rgba(0,80,180,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = bullet.radius * 1.1;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tx * len, ty * len); ctx.stroke();
        // Body — elongated bolt
        ctx.fillStyle = bullet.color;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.5, bullet.radius * 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // White-hot core
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.radius * 0.22, bullet.radius * 1.3, 0, 0, Math.PI * 2);
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

      } else if (obs.type === 'comet') {
        // Comet — bright head with long luminous tail
        const R = obs.radius;
        const t = state.tick;
        // Tail glow (rendered at angle of movement)
        const moveAngle = Math.atan2(-obs.vel.y, -obs.vel.x);
        ctx.save(); ctx.rotate(moveAngle + Math.PI/2);
        // Tail gradient
        const tailGrad = ctx.createLinearGradient(0, 0, 0, R * 6);
        tailGrad.addColorStop(0, 'rgba(150,200,255,0.5)');
        tailGrad.addColorStop(0.3, 'rgba(100,160,255,0.25)');
        tailGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.moveTo(-R * 0.8, 0);
        ctx.quadraticCurveTo(-R * 0.3, R * 3, 0, R * 6);
        ctx.quadraticCurveTo(R * 0.3, R * 3, R * 0.8, 0);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        // Head — bright core
        const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        headGrad.addColorStop(0, '#ffffff');
        headGrad.addColorStop(0.3, '#aaddff');
        headGrad.addColorStop(0.7, '#4488cc');
        headGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = headGrad;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2); ctx.fill();
        // Sparkle
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.6 + Math.sin(t * 0.2) * 0.3;
        ctx.beginPath(); ctx.arc(0, 0, R * 0.3, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;

      } else if (obs.type === 'energyribbon') {
        // Aurora ribbon — ethereal light stream that weaves through space
        const t = state.tick;
        const R = obs.radius;
        const points = obs.ribbonPoints || [];
        ctx.restore(); // undo per-obs transform — ribbon uses world coords
        ctx.save();
        if (points.length > 3) {
          // Draw as flowing aurora with width variation
          for (let pass = 0; pass < 3; pass++) {
            const width = [8, 4, 1.5][pass];
            const alpha = [0.08, 0.25, 0.6][pass];
            const hueShift = pass * 30;
            ctx.strokeStyle = `hsla(${(t * 0.4 + hueShift + state.currentStage * 40) % 360}, 85%, ${55 + pass * 10}%, ${alpha})`;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length - 1; i++) {
              const xc = (points[i].x + points[i+1].x) / 2;
              const yc = (points[i].y + points[i+1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.stroke();
          }
          // Leading orb
          const head = points[points.length - 1];
          const hGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 6);
          hGrad.addColorStop(0, '#ffffff');
          hGrad.addColorStop(0.5, `hsla(${(t * 0.4 + state.currentStage * 40) % 360}, 90%, 70%, 0.8)`);
          hGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = hGrad;
          ctx.beginPath(); ctx.arc(head.x, head.y, 6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        ctx.save(); ctx.translate(obs.pos.x, obs.pos.y); ctx.rotate(obs.rotation); // re-establish for next obs
        ctx.globalAlpha = 1;

      } else if (obs.type === 'splitter') {
        // Volatile asteroid — visibly unstable, veined with energy
        const R = obs.radius;
        const t = state.tick;
        const s = obs.rotation * 100;
        const instability = 0.5 + Math.sin(t * 0.06 + s) * 0.3; // pulses

        // Organic bezier shape (like rock but more angular)
        const N = 12;
        const shape: {x: number; y: number}[] = [];
        for (let i = 0; i < N; i++) {
          const a = (Math.PI * 2 / N) * i;
          const wobble = Math.sin(i * 2.7 + s) * 0.18 + Math.sin(i * 5.3 + s * 0.8) * 0.1;
          shape.push({ x: Math.cos(a) * R * (0.75 + wobble), y: Math.sin(a) * R * (0.75 + wobble) });
        }
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p1 = shape[i];
          const p2 = shape[(i + 1) % N];
          if (i === 0) ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.closePath();

        // Base — dark with hot interior showing through
        const baseGrad = ctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R * 0.85);
        baseGrad.addColorStop(0, `rgba(255,120,40,${instability * 0.3})`);
        baseGrad.addColorStop(0.4, '#3a2a1a');
        baseGrad.addColorStop(1, '#1a0a05');
        ctx.fillStyle = baseGrad;
        ctx.fill();

        // Molten veins — the energy that makes it split
        ctx.save(); ctx.clip();
        ctx.strokeStyle = `rgba(255,140,40,${instability * 0.6})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const startA = i * 1.5 + s * 0.01;
          ctx.moveTo(Math.cos(startA) * R * 0.1, Math.sin(startA) * R * 0.1);
          let cx2 = Math.cos(startA) * R * 0.1, cy2 = Math.sin(startA) * R * 0.1;
          for (let j = 0; j < 4; j++) {
            cx2 += Math.cos(startA + j * 0.8) * R * 0.2;
            cy2 += Math.sin(startA + j * 1.1) * R * 0.2;
            ctx.lineTo(cx2, cy2);
          }
          ctx.stroke();
        }
        // Hot spots at vein intersections
        ctx.fillStyle = `rgba(255,200,80,${instability * 0.4})`;
        ctx.beginPath(); ctx.arc(R * 0.15, -R * 0.1, 3 + instability * 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-R * 0.2, R * 0.15, 2 + instability * 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Outer edge glow — shows instability
        ctx.strokeStyle = `rgba(255,100,20,${instability * 0.25})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const p1 = shape[i];
          const p2 = shape[(i + 1) % N];
          if (i === 0) ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.closePath();
        ctx.stroke();

      } else {
        // Harmonic crystal — geometric solid that resonates with music
        const R = obs.radius;
        const t = state.tick;
        const mp = state.beatPulse;

        // Outer resonance field
        const auraSize = R * (1.2 + mp * 0.4);
        const hue = (state.currentStage * 45 + t * 0.2) % 360;
        const aGrad = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, auraSize);
        aGrad.addColorStop(0, `hsla(${hue}, 70%, 60%, ${0.15 + mp * 0.1})`);
        aGrad.addColorStop(0.5, `hsla(${hue}, 60%, 40%, ${0.06 + mp * 0.04})`);
        aGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = aGrad;
        ctx.beginPath(); ctx.arc(0, 0, auraSize, 0, Math.PI * 2); ctx.fill();

        // Inner core — crystalline solid
        const cGrad = ctx.createRadialGradient(-R*0.15, -R*0.15, 0, 0, 0, R*0.6);
        cGrad.addColorStop(0, '#aaccff');
        cGrad.addColorStop(0.5, '#4488cc');
        cGrad.addColorStop(1, '#1a3355');
        ctx.fillStyle = cGrad;
        ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(0, 0, R * 0.55, 0, Math.PI * 2); ctx.fill();

        // Orbital rings — multiple, different speeds, music-reactive
        ctx.globalAlpha = 0.25 + mp * 0.15;
        ctx.strokeStyle = '#88bbff';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 3; i++) {
          const ringR = R * (0.65 + i * 0.12);
          const speed = (0.02 + i * 0.01) * (1 + mp);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringR, ringR * (0.3 + i * 0.15), t * speed + i * 1.5, 0, Math.PI * 1.5);
          ctx.stroke();
        }

        // Center bright point
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.5 + mp * 0.3;
        ctx.beginPath(); ctx.arc(0, 0, 2 + mp * 2, 0, Math.PI * 2); ctx.fill();
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
          // Solid rock canyon walls — dark stone that blends with the nebula
          // background. Smooth organic silhouette (no cardboard jags),
          // subtle rim light, and a red danger glow at the gap edge so the
          // player reads them as "wall = death".
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          const STEPS = 16;
          const seed = seg.pos.y * 0.04;
          // Per-step inner X for each wall — organic noise, small amplitude
          // so the visible silhouette matches the collision rectangle.
          const leftPts: { x: number; y: number }[] = [];
          const rightPts: { x: number; y: number }[] = [];
          for (let i = 0; i <= STEPS; i++) {
            const t = i / STEPS;
            const y = sy - sh + sh * 2 * t;
            // Two octaves of sine give an irregular rocky outline
            const wobbleL = Math.sin(i * 0.9 + seed) * 6 + Math.sin(i * 2.3 + seed * 1.7) * 3;
            const wobbleR = Math.sin(i * 1.1 + seed * 1.3 + 2) * 6 + Math.sin(i * 2.7 + seed * 0.8) * 3;
            leftPts.push({ x: leftEdge - wobbleL, y });
            rightPts.push({ x: rightEdge + wobbleR, y });
          }

          // ── Left wall body — dark gradient fill (matches nebula tone) ──
          const lGrad = ctx.createLinearGradient(0, sy, leftEdge, sy);
          lGrad.addColorStop(0, '#0a0a14');
          lGrad.addColorStop(0.5, '#1a1820');
          lGrad.addColorStop(1, '#2a2530');
          ctx.fillStyle = lGrad;
          ctx.beginPath();
          ctx.moveTo(0, sy - sh);
          for (const p of leftPts) ctx.lineTo(p.x, p.y);
          ctx.lineTo(0, sy + sh);
          ctx.closePath();
          ctx.fill();

          // Stone-texture noise — three darker patches scattered on the wall
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          for (let i = 0; i < 3; i++) {
            const yy = sy - sh + (sh * 2 / 3) * i + sh * 0.3;
            const xx = leftEdge * (0.3 + i * 0.15);
            ctx.beginPath();
            ctx.ellipse(xx, yy, 18 + (i % 2) * 6, 10 + (i % 2) * 4, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle rim highlight on the inner edge (catches light)
          ctx.strokeStyle = 'rgba(170,170,200,0.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(leftPts[0].x, leftPts[0].y);
          for (let i = 1; i < leftPts.length; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
          ctx.stroke();

          // ── Right wall body ──
          const rGrad = ctx.createLinearGradient(w, sy, rightEdge, sy);
          rGrad.addColorStop(0, '#0a0a14');
          rGrad.addColorStop(0.5, '#1a1820');
          rGrad.addColorStop(1, '#2a2530');
          ctx.fillStyle = rGrad;
          ctx.beginPath();
          ctx.moveTo(w, sy - sh);
          for (const p of rightPts) ctx.lineTo(p.x, p.y);
          ctx.lineTo(w, sy + sh);
          ctx.closePath();
          ctx.fill();

          // Right wall noise
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          for (let i = 0; i < 3; i++) {
            const yy = sy - sh + (sh * 2 / 3) * i + sh * 0.3;
            const xx = rightEdge + (w - rightEdge) * (0.3 + i * 0.15);
            ctx.beginPath();
            ctx.ellipse(xx, yy, 18 + (i % 2) * 6, 10 + (i % 2) * 4, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Right rim highlight
          ctx.strokeStyle = 'rgba(170,170,200,0.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(rightPts[0].x, rightPts[0].y);
          for (let i = 1; i < rightPts.length; i++) ctx.lineTo(rightPts[i].x, rightPts[i].y);
          ctx.stroke();

          // ── Danger glow at the inner edge — tells the player WALL = DEATH ──
          const pulse = 0.45 + Math.sin(state.tick * 0.08 + seg.pos.y * 0.02) * 0.15;
          // Left inner glow (red bleed inward from the wall)
          const lDanger = ctx.createLinearGradient(leftEdge - 18, 0, leftEdge + 6, 0);
          lDanger.addColorStop(0, 'rgba(255,40,20,0)');
          lDanger.addColorStop(0.65, `rgba(255,60,30,${0.22 * pulse})`);
          lDanger.addColorStop(1, `rgba(255,100,60,${0.05 * pulse})`);
          ctx.fillStyle = lDanger;
          ctx.fillRect(leftEdge - 18, sy - sh, 24, sh * 2);
          // Right inner glow
          const rDanger = ctx.createLinearGradient(rightEdge - 6, 0, rightEdge + 18, 0);
          rDanger.addColorStop(0, `rgba(255,100,60,${0.05 * pulse})`);
          rDanger.addColorStop(0.35, `rgba(255,60,30,${0.22 * pulse})`);
          rDanger.addColorStop(1, 'rgba(255,40,20,0)');
          ctx.fillStyle = rDanger;
          ctx.fillRect(rightEdge - 6, sy - sh, 24, sh * 2);
          break;
        }
        case 'asteroidcorridor': {
          // The asteroid clusters are now spawned as real destroyable
          // Obstacle entities (see spawnTerrain in engine.ts). They draw
          // themselves and handle collision + destruction. This case is
          // left as a no-op for visual; the gap-edge danger glow is gone
          // because the rocks ARE the danger now.
          break;
        }
        case 'stationdebris': {
          // Floating wreckage field — dark silhouettes that blend with the background
          // Instead of one big hull mass, scatter realistic debris pieces on each side
          const leftEdge = gapCenter - gapHalf;
          const rightEdge = gapCenter + gapHalf;
          const segSeed = seg.pos.y * 0.013;

          // Helper — draw a single piece of floating wreckage (organic silhouette)
          const drawWreck = (cx: number, cy: number, size: number, seed: number, hasLight: boolean) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(seed * 0.7 + state.tick * 0.0008);
            // Irregular angular silhouette (8-pt poly with variation)
            const N = 8;
            ctx.beginPath();
            for (let i = 0; i < N; i++) {
              const a = (Math.PI * 2 / N) * i;
              const r = size * (0.7 + Math.sin(i * 2.3 + seed) * 0.25 + Math.sin(i * 4.7 + seed * 1.3) * 0.15);
              if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
              else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath();
            // Dark silhouette gradient — blends into background
            const wg = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size);
            wg.addColorStop(0, 'rgba(40,48,58,0.85)');
            wg.addColorStop(0.7, 'rgba(20,26,34,0.85)');
            wg.addColorStop(1, 'rgba(10,14,20,0.85)');
            ctx.fillStyle = wg;
            ctx.fill();
            // Edge rim light (subtle)
            ctx.strokeStyle = 'rgba(90,110,130,0.35)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            // Occasional flickering damage light
            if (hasLight) {
              const flicker = Math.sin(state.tick * 0.18 + seed * 7);
              if (flicker > 0.3) {
                const lx = Math.cos(seed) * size * 0.3;
                const ly = Math.sin(seed) * size * 0.3;
                ctx.fillStyle = '#88aacc';
                ctx.globalAlpha = (flicker - 0.3) * 0.6;
                ctx.beginPath(); ctx.arc(lx, ly, 1.2, 0, Math.PI * 2); ctx.fill();
                // Soft glow
                ctx.globalAlpha = (flicker - 0.3) * 0.15;
                ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2); ctx.fill();
              }
            }
            ctx.restore();
          };

          // Left side wreckage pieces
          for (let i = 0; i < 4; i++) {
            const phase = i * 1.7 + segSeed;
            const px = leftEdge * (0.15 + (i % 2) * 0.4) + Math.sin(phase) * 12;
            const py = sy - sh * 0.7 + (sh * 1.5 / 4) * i + Math.cos(phase * 1.3) * 8;
            const ps = 14 + Math.sin(phase) * 6;
            drawWreck(px, py, ps, phase, i === 1);
          }
          // Right side wreckage pieces
          for (let i = 0; i < 4; i++) {
            const phase = i * 2.1 + segSeed + 3.7;
            const px = w - (w - rightEdge) * (0.15 + (i % 2) * 0.4) + Math.sin(phase) * 12;
            const py = sy - sh * 0.7 + (sh * 1.5 / 4) * i + Math.cos(phase * 1.1) * 8;
            const ps = 14 + Math.cos(phase) * 6;
            drawWreck(px, py, ps, phase, i === 2);
          }

          // Tiny drifting debris specks (atmospheric depth)
          ctx.fillStyle = 'rgba(70,82,96,0.5)';
          for (let i = 0; i < 6; i++) {
            const phase = i * 0.9 + segSeed * 3;
            const dx = i % 2 === 0
              ? leftEdge * 0.3 + Math.sin(state.tick * 0.012 + phase) * 30
              : w - (w - rightEdge) * 0.3 + Math.sin(state.tick * 0.012 + phase) * 30;
            const dy = sy - sh + Math.cos(state.tick * 0.008 + phase) * sh * 0.8 + (sh * 2 / 6) * i;
            ctx.beginPath(); ctx.arc(dx, dy, 0.8 + Math.sin(phase) * 0.4, 0, Math.PI * 2); ctx.fill();
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
          // Orbital station — detailed habitat ring with docking spokes
          const R = op.radius;
          ctx.save();
          ctx.rotate(op.rotation);
          // Outer habitat ring (thick torus)
          const ringGrad = ctx.createRadialGradient(0, 0, R * 0.7, 0, 0, R * 0.92);
          ringGrad.addColorStop(0, '#55677a');
          ringGrad.addColorStop(0.5, '#8aa0b8');
          ringGrad.addColorStop(1, '#33455a');
          ctx.fillStyle = ringGrad;
          ctx.beginPath();
          ctx.arc(0, 0, R * 0.92, 0, Math.PI * 2);
          ctx.arc(0, 0, R * 0.7, 0, Math.PI * 2, true);
          ctx.fill('evenodd');
          // Ring detail — habitat windows around outer edge
          ctx.fillStyle = '#ffe89c';
          ctx.globalAlpha = 0.6;
          for (let i = 0; i < 16; i++) {
            const a = (Math.PI * 2 / 16) * i;
            const wx = Math.cos(a) * R * 0.82;
            const wy = Math.sin(a) * R * 0.82;
            ctx.beginPath(); ctx.arc(wx, wy, 1.2, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
          // Docking spokes — connecting ring to hub
          ctx.strokeStyle = '#445566';
          ctx.lineWidth = 4;
          for (let i = 0; i < 4; i++) {
            const a = (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * R * 0.7, Math.sin(a) * R * 0.7);
            ctx.lineTo(Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3);
            ctx.stroke();
          }
          // Spoke highlight
          ctx.strokeStyle = '#8899aa';
          ctx.lineWidth = 1;
          for (let i = 0; i < 4; i++) {
            const a = (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * R * 0.7, Math.sin(a) * R * 0.7);
            ctx.lineTo(Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3);
            ctx.stroke();
          }
          // Central hub
          const hubGrad = ctx.createRadialGradient(-R * 0.08, -R * 0.08, 0, 0, 0, R * 0.32);
          hubGrad.addColorStop(0, '#7a8d9e');
          hubGrad.addColorStop(0.7, '#3a4554');
          hubGrad.addColorStop(1, '#1a2230');
          ctx.fillStyle = hubGrad;
          ctx.beginPath(); ctx.arc(0, 0, R * 0.3, 0, Math.PI * 2); ctx.fill();
          // Hub command dome (slightly off-center for depth)
          ctx.fillStyle = '#44ddff';
          ctx.globalAlpha = 0.4;
          ctx.beginPath(); ctx.arc(0, 0, R * 0.18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#aaeeff';
          ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(-R * 0.05, -R * 0.05, R * 0.08, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          // Beacon strobe
          ctx.fillStyle = '#44ffaa';
          ctx.globalAlpha = 0.6 + Math.sin(state.tick * 0.12) * 0.4;
          ctx.beginPath(); ctx.arc(0, -R * 0.92, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
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

    // Wingman drone ship
    if (state.player.droneActive) {
      this.drawWingman(ctx, state);
    }

    // Lock-on phaser beam
    if (state.player.phaserBeamActive) {
      this.drawLockOnBeam(ctx, state);
    }

    // ── Chain reaction shockwave rings ──
    // Single subtle ring per kill (was two rings strobing white+orange).
    for (const zone of state.explosionZones) {
      const progress = 1 - zone.life / 8;
      const ringR = zone.radius * progress;
      ctx.strokeStyle = '#ffaa44';
      ctx.lineWidth = 2 * (1 - progress);
      ctx.globalAlpha = (1 - progress) * 0.3;
      ctx.beginPath();
      ctx.arc(zone.pos.x, zone.pos.y, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Bullet curtains (rising music-driven walls with a gap) ──
    for (const c of state.curtains) {
      const gapCenter = c.gapX * w;
      const gapL = gapCenter - c.gapHalfWidth;
      const gapR = gapCenter + c.gapHalfWidth;
      // Outer glow band
      const wallGrad = ctx.createLinearGradient(0, c.y - 10, 0, c.y + 10);
      wallGrad.addColorStop(0, `hsla(${c.hue}, 90%, 60%, 0)`);
      wallGrad.addColorStop(0.5, `hsla(${c.hue}, 95%, 65%, 0.85)`);
      wallGrad.addColorStop(1, `hsla(${c.hue}, 90%, 60%, 0)`);
      ctx.fillStyle = wallGrad;
      // Left segment of wall
      if (gapL > 0) ctx.fillRect(0, c.y - 10, gapL, 20);
      // Right segment of wall
      if (gapR < w) ctx.fillRect(gapR, c.y - 10, w - gapR, 20);
      // Inner bright core line on the damaging band
      ctx.fillStyle = `hsla(${c.hue}, 100%, 85%, 0.9)`;
      if (gapL > 0) ctx.fillRect(0, c.y - 1.5, gapL, 3);
      if (gapR < w) ctx.fillRect(gapR, c.y - 1.5, w - gapR, 3);
      // Gap markers (subtle inward chevrons so the eye finds the gap)
      ctx.strokeStyle = `hsla(${c.hue}, 100%, 90%, 0.7)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gapL - 8, c.y - 4); ctx.lineTo(gapL, c.y); ctx.lineTo(gapL - 8, c.y + 4);
      ctx.moveTo(gapR + 8, c.y - 4); ctx.lineTo(gapR, c.y); ctx.lineTo(gapR + 8, c.y + 4);
      ctx.stroke();
    }

    // ── Pulse walls (scanning energy lines with a gap) ──
    for (const wall of state.pulseWalls) {
      ctx.save();
      if (wall.axis === 'horizontal') {
        const gapCenter = wall.gapAt * w;
        const gapL = gapCenter - wall.gapSize / 2;
        const gapR = gapCenter + wall.gapSize / 2;
        const wallGrad = ctx.createLinearGradient(0, wall.pos - 8, 0, wall.pos + 8);
        wallGrad.addColorStop(0, 'rgba(120,200,255,0)');
        wallGrad.addColorStop(0.5, 'rgba(120,200,255,0.8)');
        wallGrad.addColorStop(1, 'rgba(120,200,255,0)');
        ctx.fillStyle = wallGrad;
        if (gapL > 0) ctx.fillRect(0, wall.pos - 8, gapL, 16);
        if (gapR < w) ctx.fillRect(gapR, wall.pos - 8, w - gapR, 16);
        ctx.fillStyle = 'rgba(220,240,255,0.95)';
        if (gapL > 0) ctx.fillRect(0, wall.pos - 1, gapL, 2);
        if (gapR < w) ctx.fillRect(gapR, wall.pos - 1, w - gapR, 2);
      } else {
        const gapCenter = wall.gapAt * h;
        const gapT = gapCenter - wall.gapSize / 2;
        const gapB = gapCenter + wall.gapSize / 2;
        const wallGrad = ctx.createLinearGradient(wall.pos - 8, 0, wall.pos + 8, 0);
        wallGrad.addColorStop(0, 'rgba(120,200,255,0)');
        wallGrad.addColorStop(0.5, 'rgba(120,200,255,0.8)');
        wallGrad.addColorStop(1, 'rgba(120,200,255,0)');
        ctx.fillStyle = wallGrad;
        if (gapT > 0) ctx.fillRect(wall.pos - 8, 0, 16, gapT);
        if (gapB < h) ctx.fillRect(wall.pos - 8, gapB, 16, h - gapB);
      }
      ctx.restore();
    }

    // ── Signature label (briefly shown when a music mechanic fires) ──
    if (state.signatureLabelTimer > 0 && state.signatureLabel) {
      const alpha = Math.min(1, state.signatureLabelTimer / 60) * 0.85;
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff66aa';
      ctx.font = 'bold 18px Courier New';
      ctx.fillText('♫ ' + state.signatureLabel + ' ♫', w / 2, h * 0.18);
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#aaa';
      ctx.fillText('the song is playing the level', w / 2, h * 0.18 + 16);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
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

    // ── Foreground dust motes ── sells the speed of forward motion.
    // These draw on top of gameplay but under the HUD. Scroll multiplier
    // ensures they slow when the music is quiet and surge on drops.
    {
      const motePower = Math.min(1.4, state.scrollSpeed / 1.0);
      ctx.fillStyle = 'rgba(220,230,255,0.5)';
      for (const m of this.dustMotes) {
        const sy = ((m.y * h + state.scrollY * m.speed * motePower) % (h + 80) + (h + 80)) % (h + 80) - 40;
        // Streak length proportional to speed — sense of motion
        const streak = m.speed * 1.4 * motePower;
        ctx.globalAlpha = 0.18 + m.size * 0.18;
        ctx.fillRect(m.x * w, sy, m.size, streak);
      }
      ctx.globalAlpha = 1;
    }

    // HUD
    this.drawHUD(state);

    // Boss HP bar
    if (state.bossActive) {
      this.drawBossHP(state);
    }

    // (removed: beat-pulse edge vignette, bottom bass bars, and music-intensity
    // edge lines — they were strobing the entire screen on every beat. Music
    // reactivity is still expressed through obstacle rotation, particle accents,
    // and faction-specific subtle tinting.)

    // Armory icon bar — top center
    this.drawArmoryBar(ctx, state, w);

    // Live music waveform EQ — top-left, under HUD bar
    this.drawWaveformIndicator(ctx, state);

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

    // Victory overlay (flyaway → stats card)
    if (state.phase === 'victory') {
      this.drawVictory(state);
    }
    // Briefing overlay — next mission preview
    if (state.phase === 'briefing') {
      this.drawBriefing(state);
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

    // Boss arrival — compact RADAR BEACON in the upper-right corner.
    // Sweeping radar arm with a bright red blip at the top representing
    // the incoming boss. Replaces the full-screen scanline + classification
    // card which felt like a HUD takeover. Now the alert sits in its own
    // corner like a real ship's sensor display.
    if (state.bossWarning > 0) {
      const stageNow = state.stages[state.currentStage];
      const t0 = 120 - state.bossWarning;
      const intro = Math.min(1, t0 / 18);
      const outro = Math.min(1, state.bossWarning / 18);
      const fade = intro * outro;

      // Radar position — top-right, just under the HUD bar
      const rR = Math.min(64, w * 0.09);   // radar radius
      const rCx = w - rR - 24;
      const rCy = rR + 56;

      ctx.save();
      ctx.globalAlpha = fade;

      // Backplate (dark glass disc)
      const bg = ctx.createRadialGradient(rCx, rCy, 0, rCx, rCy, rR);
      bg.addColorStop(0, 'rgba(10, 24, 32, 0.85)');
      bg.addColorStop(1, 'rgba(6, 14, 20, 0.92)');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(rCx, rCy, rR, 0, Math.PI * 2); ctx.fill();

      // Concentric rings (radar grid)
      ctx.strokeStyle = 'rgba(80, 200, 140, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(rCx, rCy, rR * (i / 3), 0, Math.PI * 2);
        ctx.stroke();
      }
      // Crosshair
      ctx.beginPath();
      ctx.moveTo(rCx - rR, rCy); ctx.lineTo(rCx + rR, rCy);
      ctx.moveTo(rCx, rCy - rR); ctx.lineTo(rCx, rCy + rR);
      ctx.stroke();

      // Outer ring (bright)
      ctx.strokeStyle = '#33ee99';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(rCx, rCy, rR, 0, Math.PI * 2); ctx.stroke();

      // Sweeping radar arm
      const sweepA = (state.tick * 0.06) % (Math.PI * 2);
      const sweepGrad = ctx.createConicGradient(sweepA - Math.PI / 4, rCx, rCy);
      sweepGrad.addColorStop(0, 'rgba(60, 240, 140, 0.0)');
      sweepGrad.addColorStop(0.05, 'rgba(60, 240, 140, 0.55)');
      sweepGrad.addColorStop(0.15, 'rgba(60, 240, 140, 0.0)');
      sweepGrad.addColorStop(1, 'rgba(60, 240, 140, 0.0)');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(rCx, rCy);
      ctx.arc(rCx, rCy, rR, sweepA - Math.PI / 4, sweepA);
      ctx.closePath();
      ctx.fill();

      // Boss approach blip — pulses, sits at top of radar
      const blipP = 0.6 + Math.sin(state.tick * 0.25) * 0.4;
      const blipX = rCx + Math.sin(state.tick * 0.02) * 4;
      const blipY = rCy - rR * 0.75;
      // Outer pulse ring
      ctx.strokeStyle = '#ff3344';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = fade * (1 - (state.tick % 40) / 40);
      ctx.beginPath();
      ctx.arc(blipX, blipY, 4 + (state.tick % 40) / 40 * 14, 0, Math.PI * 2);
      ctx.stroke();
      // Solid blip
      ctx.globalAlpha = fade * blipP;
      ctx.fillStyle = '#ff2244';
      ctx.beginPath(); ctx.arc(blipX, blipY, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffeeee';
      ctx.beginPath(); ctx.arc(blipX, blipY, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = fade;

      // Player ship dot at the radar center
      ctx.fillStyle = '#44aaff';
      ctx.beginPath(); ctx.arc(rCx, rCy, 2.2, 0, Math.PI * 2); ctx.fill();

      // "INCOMING" label below the radar
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff8888';
      ctx.font = 'bold 10px Courier New';
      ctx.fillText('▼ INCOMING ▼', rCx, rCy + rR + 14);
      // Boss name (compact)
      ctx.fillStyle = '#aaccdd';
      ctx.font = '8px Courier New';
      const bname = stageNow?.boss?.name || 'HOSTILE';
      ctx.fillText(bname, rCx, rCy + rR + 26);

      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Boss entrance — cinematic edge vignette pulses then settles into a
    // subtle dim. The center stays clear so you read the boss; the edges
    // close in like the room just got smaller.
    if (state.bossEntrance > 0) {
      const t01 = state.bossEntrance / 120;             // 1 at spawn, 0 at end
      const pulse = Math.max(0, 1 - (1 - t01) * 4);     // strong for first 25% then fades
      const baseDark = 0.18 * t01;
      const pulseDark = 0.22 * pulse;
      const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.85);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.55, `rgba(0,0,0,${baseDark * 0.6})`);
      grad.addColorStop(1, `rgba(0,0,0,${baseDark + pulseDark})`);
      ctx.fillStyle = grad;
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

    // ── Combo aura ── faint ring around the ship that scales with combo
    // level. Replaces the removed text popups with a constant ambient
    // visual reward for chains. Drawn before the player transform so it
    // sits behind the ship.
    if (state.combo >= 3) {
      const tier = Math.min(1, (state.combo - 2) / 13);  // 3 kills = faint, 15+ = max
      const auraR = p.width * (1.0 + tier * 0.5);
      const pulse = 0.6 + Math.sin(state.tick * 0.18) * 0.3;
      const hue = 50 - tier * 50;  // yellow → red
      ctx.strokeStyle = `hsl(${hue}, 95%, 60%)`;
      ctx.lineWidth = 1.5 + tier * 1.5;
      ctx.globalAlpha = 0.35 * pulse * (0.6 + tier * 0.4);
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, auraR, 0, Math.PI * 2);
      ctx.stroke();
      // Inner glow at higher tiers
      if (tier > 0.5) {
        ctx.strokeStyle = `hsl(${hue}, 100%, 75%)`;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.55 * pulse * tier;
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, auraR * 0.78, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    ctx.save();
    ctx.translate(p.pos.x, p.pos.y);

    // ── Shield burst ring — visible while shieldBurstActive > 0 ──
    if (p.shieldBurstActive > 0) {
      const progress = 1 - p.shieldBurstActive / 60;
      const ringR = p.width * (1.5 + progress * 1.2);
      ctx.strokeStyle = '#44ddff';
      ctx.lineWidth = 3 * (1 - progress * 0.7);
      ctx.globalAlpha = 0.85 * (1 - progress);
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
      // Inner softer ring
      ctx.strokeStyle = '#aaeeff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5 * (1 - progress);
      ctx.beginPath(); ctx.arc(0, 0, ringR * 0.75, 0, Math.PI * 2); ctx.stroke();
      // Soft inner glow
      const sbGrad = ctx.createRadialGradient(0, 0, ringR * 0.3, 0, 0, ringR);
      sbGrad.addColorStop(0, 'rgba(120,220,255,0)');
      sbGrad.addColorStop(0.7, `rgba(120,220,255,${0.12 * (1 - progress)})`);
      sbGrad.addColorStop(1, 'rgba(120,220,255,0)');
      ctx.fillStyle = sbGrad;
      ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    const W = p.width * 1.2, H = p.height * 1.2; // slightly bigger
    const ep = 0.6 + Math.sin(state.tick * 0.25) * 0.3; // engine pulse
    // Flyaway boost — engines flare 3x bigger and brighter as the ship warps out
    const warp = state.phase === 'victory' ? state.flyawayProgress : 0;
    const exhaustLen = 12 + ep * 8 + warp * 50;
    const exhaustW = 4 + warp * 4;

    // ── Warp nacelle exhaust (blue glow behind nacelles) ──
    ctx.fillStyle = '#3366ff';
    ctx.globalAlpha = (0.6 + warp * 0.35) * ep;
    ctx.beginPath(); ctx.ellipse(-W*0.42, H*0.35 + warp * 15, exhaustW, exhaustLen, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( W*0.42, H*0.35 + warp * 15, exhaustW, exhaustLen, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#aaddff'; ctx.globalAlpha = (0.8 + warp * 0.2) * ep;
    ctx.beginPath(); ctx.ellipse(-W*0.42, H*0.32 + warp * 10, 2 + warp * 2, 6 + warp * 30, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( W*0.42, H*0.32 + warp * 10, 2 + warp * 2, 6 + warp * 30, 0, 0, Math.PI*2); ctx.fill();
    // White-hot core when fully warping
    if (warp > 0.1) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = warp * 0.9;
      ctx.beginPath(); ctx.ellipse(-W*0.42, H*0.30 + warp * 8, 1.5, 4 + warp * 18, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse( W*0.42, H*0.30 + warp * 8, 1.5, 4 + warp * 18, 0, 0, Math.PI*2); ctx.fill();
    }
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

    // ── Player hit-flash ── parallels enemy hit-flash. The first 6 frames
    // after damage (invulnTimer at 84+) overlay a bright white silhouette
    // on the ship so the player FEELS the hit instead of just seeing the
    // blink. After that the regular invuln-blink takes over.
    if (p.invulnTimer >= 84) {
      const fp = (p.invulnTimer - 84) / 6;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.6 * fp;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.width * 0.7, p.height * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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

  private drawWingman(ctx: CanvasRenderingContext2D, state: ShmupState): void {
    const p = state.player;
    const wx = p.dronePos.x, wy = p.dronePos.y;
    const t = state.tick;

    ctx.save();
    ctx.translate(wx, wy);

    // Engine glow
    ctx.fillStyle = '#44ffaa';
    ctx.globalAlpha = 0.4 + Math.sin(t * 0.25) * 0.2;
    ctx.beginPath();
    ctx.ellipse(0, 10, 2, 5 + Math.sin(t * 0.3) * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Small ship body — mini version of player
    ctx.fillStyle = '#1a4a3a';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-8, 4);
    ctx.lineTo(-5, 7);
    ctx.lineTo(5, 7);
    ctx.lineTo(8, 4);
    ctx.closePath();
    ctx.fill();

    // Accent
    ctx.fillStyle = '#44ffaa';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-1, -8, 2, 10);
    ctx.globalAlpha = 1;

    // Shield shimmer
    ctx.strokeStyle = '#44ffaa';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  private drawLockOnBeam(ctx: CanvasRenderingContext2D, state: ShmupState): void {
    const p = state.player;
    const target = state.enemies.find(e => e.id === p.lockOnTarget && e.alive);
    if (!target) return;
    // Guard against bad target positions (off-screen / NaN) — otherwise the
    // beam can stretch across the whole screen, painting an "errant line".
    if (!isFinite(target.pos.x) || !isFinite(target.pos.y)) return;

    const t = state.tick;
    const intensity = Math.max(0.3, p.phaserCharge);

    const sx = p.pos.x;
    const sy = p.pos.y - p.height * 0.3;
    const tx = target.pos.x;
    const ty = target.pos.y;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const nx = dx / len;
    const ny = dy / len;
    // perpendicular for crackle offsets
    const px = -ny;
    const py = nx;

    // Beam strokes use 'butt' caps. Previously 'round' caps created a 10px
    // semicircle of orange at each endpoint — visible as an orange disc
    // around the target on long beams.
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';

    // ── Mid beam body — primary visible beam ──
    ctx.strokeStyle = '#ff7733';
    ctx.lineWidth = 4 + intensity * 2;
    ctx.globalAlpha = 0.55 * intensity;
    ctx.beginPath();
    ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();

    // ── Inner blazing core ──
    ctx.strokeStyle = '#ffdd99';
    ctx.lineWidth = 2 + intensity * 1;
    ctx.globalAlpha = 0.95 * intensity;
    ctx.beginPath();
    ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();

    // ── White-hot pulse running down the beam (laser feel) ──
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const pulsePos = ((t * 0.12 + i * 0.33) % 1);
      const cx = sx + nx * len * pulsePos;
      const cy = sy + ny * len * pulsePos;
      ctx.globalAlpha = (1 - pulsePos) * 0.7 * intensity;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 4 + (1 - pulsePos) * 3, 1.4, Math.atan2(ny, nx), 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Subtle crackle along the beam ──
    ctx.strokeStyle = '#ffe9aa';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4 * intensity;
    ctx.beginPath();
    const segs = 6;
    ctx.moveTo(sx, sy);
    for (let i = 1; i <= segs; i++) {
      const ft = i / segs;
      const jitter = (Math.sin(t * 0.5 + i * 1.7) + Math.sin(t * 0.83 + i * 2.3)) * 2 * intensity;
      const cx2 = sx + nx * len * ft + px * jitter;
      const cy2 = sy + ny * len * ft + py * jitter;
      ctx.lineTo(cx2, cy2);
    }
    ctx.stroke();

    // ── Lock-on reticle — small fixed-size cross, never blooms ──
    // Capped so even on a giant T'VAK boss the reticle stays compact
    // and doesn't pretend to wrap the whole hull.
    const r = Math.min(28, target.width * 0.5 + 6);
    ctx.strokeStyle = '#ff8833';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.85;
    // Just 4 corner ticks (no full ring) — much cleaner read
    const tick4 = 6;
    ctx.beginPath();
    // TL, TR, BL, BR corners with a small dash
    ctx.moveTo(tx - r, ty - r + tick4); ctx.lineTo(tx - r, ty - r); ctx.lineTo(tx - r + tick4, ty - r);
    ctx.moveTo(tx + r - tick4, ty - r); ctx.lineTo(tx + r, ty - r); ctx.lineTo(tx + r, ty - r + tick4);
    ctx.moveTo(tx - r, ty + r - tick4); ctx.lineTo(tx - r, ty + r); ctx.lineTo(tx - r + tick4, ty + r);
    ctx.moveTo(tx + r - tick4, ty + r); ctx.lineTo(tx + r, ty + r); ctx.lineTo(tx + r, ty + r - tick4);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Target HP bar — sits below the reticle ──
    if (target.maxHp > 0) {
      const hpPct = Math.max(0, target.hp / target.maxHp);
      const barW = Math.max(28, Math.min(60, target.width * 0.6));
      const barX = tx - barW / 2;
      const barY = ty + r + 6;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(barX - 1, barY - 1, barW + 2, 4);
      ctx.fillStyle = '#ff8833';
      ctx.fillRect(barX, barY, barW * hpPct, 2);
    }

    ctx.globalAlpha = 1;
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

    // ── HIT FLASH ── additive white overlay for a few frames after damage.
    // The shape is a generous ellipse matching the ship silhouette so it
    // reads as the WHOLE ship lighting up, not just a spot.
    if (enemy.hitFlash && enemy.hitFlash > 0) {
      const fpct = enemy.hitFlash / 8;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.55 * fpct;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.55, H * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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

    // ── Cloak / phase-shift state ── boss is briefly absent. Skip the
    // detailed render and draw only a faint pulsing silhouette. Color
    // varies by bossType: Romulan green for Valdore's cloak, crystal cyan
    // for Guardian's phase shift. Engage/disengage particle bursts are
    // emitted engine-side so transitions feel decisive.
    if (enemy.cloakActive && enemy.cloakActive > 0) {
      const shimmer = 0.10 + Math.sin(tick * 0.22) * 0.06;
      const cloakColor = enemy.bossType === 'guardian' ? '#aaccff' : '#33ff66';
      ctx.strokeStyle = cloakColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = shimmer;
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.52, H * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Inner shimmer ring — wave that pulses outward
      ctx.lineWidth = 1;
      ctx.globalAlpha = shimmer * 0.6;
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.36, H * 0.36, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
      return;
    }

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

    // Damage glow — pulsing red as HP drops.
    // Suppressed while subsystems still shield the hull (otherwise an
    // edge-case where hp briefly dips can render a giant red ellipse
    // around an otherwise-undamaged boss).
    const subShieldUp = !!enemy.weakPoints?.some((wp: any) => wp.alive && wp.weaponType);
    if (hpPct < 0.5 && !subShieldUp) {
      ctx.globalAlpha = (1 - hpPct) * 0.3 * (0.5 + Math.sin(tick * 0.1) * 0.5);
      ctx.fillStyle = '#ff2200';
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.6, H * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.95;

    // Draw unique hull based on stage boss type
    this.drawBossHull(ctx, W, H, color, tick, phase, enemy.faction, enemy.bossType || 'warbird');

    // ── Hull shield bubble ── when subsystems still alive, this is a CLEAR
    // visual cue: "stop shooting the hull, target the cannons." Was an
    // almost-invisible 0.23 alpha line; now a hex-faceted bubble with a
    // breathing alpha and a brighter ring. Players see at a glance the
    // boss is protected. When subsystems are down, the bubble disappears
    // and the hull is visibly exposed.
    if (subShieldUp) {
      const breathe = 0.55 + Math.sin(tick * 0.06) * 0.18;
      const bubbleR = Math.max(W, H) * 0.6;
      // Outer hex-pattern shield (procedural — looks like a force field)
      const segments = 24;
      ctx.strokeStyle = '#88ccff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.35 * breathe;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (Math.PI * 2 / segments) * i;
        const rj = bubbleR * (0.92 + Math.sin(a * 6 + tick * 0.05) * 0.04);
        const x = Math.cos(a) * rj;
        const y = Math.sin(a) * rj * 0.85;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Inner bright rim
      ctx.strokeStyle = '#aaeeff';
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.55 * breathe;
      ctx.beginPath();
      ctx.ellipse(0, 0, bubbleR * 0.86, bubbleR * 0.73, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Faint inner fill (very subtle, sells the "force field" feel)
      const sgrad = ctx.createRadialGradient(0, 0, bubbleR * 0.3, 0, 0, bubbleR);
      sgrad.addColorStop(0, 'rgba(140,220,255,0)');
      sgrad.addColorStop(1, `rgba(140,220,255,${0.10 * breathe})`);
      ctx.fillStyle = sgrad;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, bubbleR, bubbleR * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      // No subsystems — original faint shimmer (boss is in vulnerable form)
      ctx.globalAlpha = 0.15 + Math.sin(tick * 0.04) * 0.08;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, W * 0.55, H * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Weak points — glowing orbs that pulse
    if (enemy.weakPoints) {
      for (const wp of enemy.weakPoints) {
        const wpX = wp.offset.x;
        const wpY = wp.offset.y;
        // Named hardpoints (T'VAK) draw in their weapon's color; generic
        // weak points keep the existing yellow.
        const wpColor = wp.color || '#ffdd00';
        const isBig = !!wp.weaponType;
        const ringR = isBig ? 14 : 12;
        if (wp.alive) {
          // ── Plasma + Tractor get the iconic CONCENTRIC PURPLE RINGS ──
          // (matches the concept art exactly: 3 nested rings + bright core
          // on a dark backplate)
          if (wp.weaponType === 'plasma' || wp.weaponType === 'tractor') {
            const auraSize = 18;
            // Dark backplate
            ctx.fillStyle = '#1a0a1a';
            ctx.beginPath(); ctx.arc(wpX, wpY, auraSize, 0, Math.PI * 2); ctx.fill();
            // Outer aura
            const auraG = ctx.createRadialGradient(wpX, wpY, 0, wpX, wpY, auraSize * 1.6);
            auraG.addColorStop(0, wpColor);
            auraG.addColorStop(1, 'transparent');
            ctx.fillStyle = auraG;
            ctx.globalAlpha = 0.5 + Math.sin(tick * 0.1 + wpX * 0.03) * 0.2;
            ctx.beginPath(); ctx.arc(wpX, wpY, auraSize * 1.6, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            // 3 concentric rings
            ctx.strokeStyle = wpColor;
            ctx.lineWidth = 1.5;
            for (let r = 0; r < 3; r++) {
              const ringFrac = 0.9 - r * 0.25;
              ctx.globalAlpha = 0.9 - r * 0.2;
              ctx.beginPath(); ctx.arc(wpX, wpY, auraSize * ringFrac, 0, Math.PI * 2); ctx.stroke();
            }
            // Bright central core
            ctx.fillStyle = '#ffeeff';
            ctx.globalAlpha = 0.9 + Math.sin(tick * 0.15 + wpX) * 0.1;
            ctx.beginPath(); ctx.arc(wpX, wpY, 3.5, 0, Math.PI * 2); ctx.fill();
            // HP ring (outside the concentric rings)
            ctx.globalAlpha = 0.7;
            ctx.strokeStyle = wpColor;
            ctx.lineWidth = 2;
            const wpPct1 = wp.maxHp > 0 ? Math.max(0, Math.min(1, wp.hp / wp.maxHp)) : 0;
            ctx.beginPath();
            ctx.arc(wpX, wpY, auraSize + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * wpPct1));
            ctx.stroke();
            ctx.globalAlpha = 1;
            continue;
          }
          // ── Default named hardpoint (disruptor / missile / phaser / torpedo) ──
          // Outer aura
          const auraG = ctx.createRadialGradient(wpX, wpY, 0, wpX, wpY, ringR * 1.6);
          auraG.addColorStop(0, wpColor);
          auraG.addColorStop(1, 'transparent');
          ctx.fillStyle = auraG;
          ctx.globalAlpha = 0.45 + Math.sin(tick * 0.1 + wpX * 0.04) * 0.25;
          ctx.beginPath(); ctx.arc(wpX, wpY, ringR * 1.6, 0, Math.PI * 2); ctx.fill();
          // Bright body
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = wpColor;
          ctx.beginPath(); ctx.arc(wpX, wpY, isBig ? 7 : 5, 0, Math.PI * 2); ctx.fill();
          // White-hot core
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(wpX, wpY, isBig ? 3 : 2.2, 0, Math.PI * 2); ctx.fill();
          // HP ring
          ctx.globalAlpha = 0.75;
          ctx.strokeStyle = wpColor;
          ctx.lineWidth = 2;
          const wpPct = wp.maxHp > 0 ? Math.max(0, Math.min(1, wp.hp / wp.maxHp)) : 0;
          ctx.beginPath();
          ctx.arc(wpX, wpY, ringR, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * wpPct));
          ctx.stroke();
        } else {
          // Destroyed — smoking crater
          ctx.globalAlpha = 0.4 + Math.sin(tick * 0.05 + wpX) * 0.15;
          ctx.fillStyle = '#331100';
          ctx.beginPath(); ctx.arc(wpX, wpY, 8, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = '#ff4400';
          ctx.beginPath(); ctx.arc(wpX, wpY, 5, 0, Math.PI * 2); ctx.fill();
          // Occasional sparks
          if (Math.random() < 0.18) {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#ffaa44';
            ctx.beginPath(); ctx.arc(wpX + (Math.random()-0.5)*6, wpY + (Math.random()-0.5)*6, 1.5, 0, Math.PI*2); ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
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

  // ── Per-boss-type hull dispatcher ────────────────────────────────
  private drawBossHull(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    color: string, tick: number, phase: number,
    _faction: string, bossType: string,
  ): void {
    const dk = this.darkenColor(color, 0.4);
    const md = this.darkenColor(color, 0.7);

    switch (bossType) {
      case 'tvak':            this.bossHullTvak(ctx, W, H, color, dk, md, tick, phase); break;
      case 'warbird':         this.bossHullWarbird(ctx, W, H, color, dk, md, tick, phase); break;
      case 'dreadnought':     this.bossHullDreadnought(ctx, W, H, color, dk, md, tick, phase); break;
      case 'flagship':        this.bossHullFlagship(ctx, W, H, color, dk, md, tick, phase); break;
      case 'gravitymarauder': this.bossHullGravityMarauder(ctx, W, H, color, dk, md, tick, phase); break;
      case 'guardian':        this.bossHullGuardian(ctx, W, H, color, dk, md, tick, phase); break;
      case 'sovereign':       this.bossHullSovereign(ctx, W, H, color, dk, md, tick, phase); break;
      case 'fortress':        this.bossHullFortress(ctx, W, H, color, dk, md, tick, phase); break;
      case 'singularity':     this.bossHullSingularityDread(ctx, W, H, color, dk, md, tick, phase); break;
      case 'voidtyrant':      this.bossHullVoidTyrant(ctx, W, H, color, dk, md, tick, phase); break;
      case 'wraith':          this.bossHullWraith(ctx, W, H, color, dk, md, tick, phase); break;
      case 'omega':           this.bossHullOmega(ctx, W, H, color, dk, md, tick, phase); break;
      default:                this.bossHullGeneric(ctx, W, H, color, dk, md, tick, phase); break;
    }

    // Universal phase damage fires on hull
    if (phase >= 2) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#ff4400';
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

  // ── Shared port-glow helper ──────────────────────────────────────
  private bossPort(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, tick: number, phase: number) {
    const glow = 0.4 + phase * 0.15 + Math.sin(tick * 0.08) * 0.2;
    ctx.globalAlpha = glow;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r + phase * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.95;
  }

  // ── Generic fallback ─────────────────────────────────────────────
  private bossHullGeneric(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, _phase: number) {
    ctx.fillStyle = dk;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.5); ctx.lineTo(-W * 0.5, 0); ctx.lineTo(-W * 0.2, H * 0.5);
    ctx.lineTo(W * 0.2, H * 0.5); ctx.lineTo(W * 0.5, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = color; ctx.globalAlpha = 0.5 + Math.sin(tick * 0.05) * 0.3;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 0. T'VAK CLASS ASSAULT VESSEL — screen-filling Klingon warbird ─
  // Symmetric capital ship. Layered armor lobes with green energy
  // conduit strips, central command tower with vertical red core slot,
  // chevron reactor core. 6 weapon hardpoint glows positioned to match
  // the engine's weak-point layout. In phase 3 (final form) the wing
  // armor plates slide outward and the core glows white-hot.
  private bossHullTvak(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, _dk: string, _md: string, tick: number, phase: number) {
    // ── Color palette matched to the T'VAK concept art ──
    // BRIGHTENED again — the silhouette wings were still reading as
    // invisible black against the dark nebula background. These values
    // are warmer/lighter so the raptor wing shape actually shows.
    const armorDarkest = '#252530';
    const armorDark = '#3c3c4a';
    const armorMid = '#52525e';
    const armorLight = '#70707c';
    const armorAccent = '#90909c';
    const conduitGreen = '#33ee55';
    const conduitGreenDim = '#0a4a18';
    const coreRed = '#ff2020';
    const corePulse = 0.65 + Math.sin(tick * 0.08) * 0.3;

    // Final-form armor open: at phase 3, wings rotate slightly outward.
    const armorSpread = phase >= 3 ? Math.min(1, (tick - (tick - 60)) / 60) * 1.0 : 0;
    const spreadOff = armorSpread * W * 0.04;

    // ── Wide-swept raptor wings — more aggressive jagged silhouette ──
    // The concept has wings that fan out and have multiple armor lobes.
    ctx.fillStyle = armorDark;
    ctx.beginPath();
    // Top of central command tower
    ctx.moveTo(0, -H * 0.50);
    // Right side, top tower → shoulder → wing lobes → wing tip → fold under
    ctx.lineTo(W * 0.06, -H * 0.46);
    ctx.lineTo(W * 0.10, -H * 0.40);
    ctx.lineTo(W * 0.16, -H * 0.36);
    // Upper shoulder pauldron
    ctx.lineTo(W * 0.28, -H * 0.32);
    ctx.lineTo(W * 0.38, -H * 0.22);
    // Wing lobe 1 (outer upper)
    ctx.lineTo(W * 0.46, -H * 0.10);
    // Wing tip extends out
    ctx.lineTo(W * 0.50 + spreadOff, -H * 0.02);
    // Lobe step
    ctx.lineTo(W * 0.46 + spreadOff, H * 0.08);
    ctx.lineTo(W * 0.50 + spreadOff, H * 0.18);
    // Lower wing fold
    ctx.lineTo(W * 0.42, H * 0.28);
    ctx.lineTo(W * 0.34, H * 0.34);
    ctx.lineTo(W * 0.24, H * 0.36);
    ctx.lineTo(W * 0.18, H * 0.42);
    // Bottom outer (phaser barrel mount area)
    ctx.lineTo(W * 0.16, H * 0.50);
    ctx.lineTo(W * 0.10, H * 0.50);
    // Bottom-center engine pod taper
    ctx.lineTo(W * 0.08, H * 0.46);
    ctx.lineTo(W * 0.05, H * 0.42);
    ctx.lineTo(-W * 0.05, H * 0.42);
    ctx.lineTo(-W * 0.08, H * 0.46);
    // Mirror left side back up to top
    ctx.lineTo(-W * 0.10, H * 0.50);
    ctx.lineTo(-W * 0.16, H * 0.50);
    ctx.lineTo(-W * 0.18, H * 0.42);
    ctx.lineTo(-W * 0.24, H * 0.36);
    ctx.lineTo(-W * 0.34, H * 0.34);
    ctx.lineTo(-W * 0.42, H * 0.28);
    ctx.lineTo(-W * 0.50 - spreadOff, H * 0.18);
    ctx.lineTo(-W * 0.46 - spreadOff, H * 0.08);
    ctx.lineTo(-W * 0.50 - spreadOff, -H * 0.02);
    ctx.lineTo(-W * 0.46, -H * 0.10);
    ctx.lineTo(-W * 0.38, -H * 0.22);
    ctx.lineTo(-W * 0.28, -H * 0.32);
    ctx.lineTo(-W * 0.16, -H * 0.36);
    ctx.lineTo(-W * 0.10, -H * 0.40);
    ctx.lineTo(-W * 0.06, -H * 0.46);
    ctx.closePath();
    ctx.fill();

    // Full silhouette outline — gives the wings a readable contour against
    // the dark background. Made bright + thick so the raptor wing shape
    // is the FIRST thing the player sees, not just the internal details.
    ctx.strokeStyle = armorAccent;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.50);
    ctx.lineTo(W * 0.06, -H * 0.46);
    ctx.lineTo(W * 0.10, -H * 0.40);
    ctx.lineTo(W * 0.16, -H * 0.36);
    ctx.lineTo(W * 0.28, -H * 0.32);
    ctx.lineTo(W * 0.38, -H * 0.22);
    ctx.lineTo(W * 0.46, -H * 0.10);
    ctx.lineTo(W * 0.50 + spreadOff, -H * 0.02);
    ctx.lineTo(W * 0.46 + spreadOff, H * 0.08);
    ctx.lineTo(W * 0.50 + spreadOff, H * 0.18);
    ctx.lineTo(W * 0.42, H * 0.28);
    ctx.lineTo(W * 0.34, H * 0.34);
    ctx.lineTo(W * 0.24, H * 0.36);
    ctx.lineTo(W * 0.18, H * 0.42);
    ctx.lineTo(W * 0.16, H * 0.50);
    ctx.lineTo(-W * 0.16, H * 0.50);
    ctx.lineTo(-W * 0.18, H * 0.42);
    ctx.lineTo(-W * 0.24, H * 0.36);
    ctx.lineTo(-W * 0.34, H * 0.34);
    ctx.lineTo(-W * 0.42, H * 0.28);
    ctx.lineTo(-W * 0.50 - spreadOff, H * 0.18);
    ctx.lineTo(-W * 0.46 - spreadOff, H * 0.08);
    ctx.lineTo(-W * 0.50 - spreadOff, -H * 0.02);
    ctx.lineTo(-W * 0.46, -H * 0.10);
    ctx.lineTo(-W * 0.38, -H * 0.22);
    ctx.lineTo(-W * 0.28, -H * 0.32);
    ctx.lineTo(-W * 0.16, -H * 0.36);
    ctx.lineTo(-W * 0.10, -H * 0.40);
    ctx.lineTo(-W * 0.06, -H * 0.46);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Warm top rim accent — catches the "light" on the upper armor curves
    ctx.strokeStyle = '#aa5522';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-W * 0.46, -H * 0.10);
    ctx.lineTo(-W * 0.38, -H * 0.22);
    ctx.lineTo(-W * 0.28, -H * 0.32);
    ctx.lineTo(-W * 0.16, -H * 0.36);
    ctx.lineTo(0, -H * 0.50);
    ctx.lineTo(W * 0.16, -H * 0.36);
    ctx.lineTo(W * 0.28, -H * 0.32);
    ctx.lineTo(W * 0.38, -H * 0.22);
    ctx.lineTo(W * 0.46, -H * 0.10);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Mid armor — defines the inner wing plating ──
    ctx.fillStyle = armorMid;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.40);
    ctx.lineTo(W * 0.24, -H * 0.22);
    ctx.lineTo(W * 0.38, -H * 0.04);
    ctx.lineTo(W * 0.34, H * 0.16);
    ctx.lineTo(W * 0.18, H * 0.30);
    ctx.lineTo(0, H * 0.40);
    ctx.lineTo(-W * 0.18, H * 0.30);
    ctx.lineTo(-W * 0.34, H * 0.16);
    ctx.lineTo(-W * 0.38, -H * 0.04);
    ctx.lineTo(-W * 0.24, -H * 0.22);
    ctx.closePath();
    ctx.fill();

    // Inner armor rim highlight — brighter so plating reads
    ctx.strokeStyle = armorAccent;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Central spine — narrow tall body inside the mid armor ──
    // This is the "face" of the ship that holds the eye lights and reactor.
    ctx.fillStyle = armorLight;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.50);
    ctx.lineTo(W * 0.10, -H * 0.32);
    ctx.lineTo(W * 0.13, -H * 0.08);
    ctx.lineTo(W * 0.10, H * 0.18);
    ctx.lineTo(W * 0.06, H * 0.36);
    ctx.lineTo(-W * 0.06, H * 0.36);
    ctx.lineTo(-W * 0.10, H * 0.18);
    ctx.lineTo(-W * 0.13, -H * 0.08);
    ctx.lineTo(-W * 0.10, -H * 0.32);
    ctx.closePath();
    ctx.fill();

    // ── Wing energy conduits — TALL vertical green bar arrays ──
    // The concept has BIG vertical green strips on each wing. Make them
    // prominent — these are an iconic visual signature.
    const drawConduit = (cx: number, cy: number, w: number, h: number, bars: number) => {
      ctx.fillStyle = conduitGreenDim;
      ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
      ctx.fillStyle = conduitGreen;
      ctx.globalAlpha = 0.75 + Math.sin(tick * 0.1 + cx * 0.02) * 0.2;
      const barH = h / bars - 1;
      for (let i = 0; i < bars; i++) {
        ctx.fillRect(cx - w / 2 + 1, cy - h / 2 + i * (barH + 1) + 1, w - 2, barH);
      }
      // Outer cyan glow on the conduit
      ctx.shadowColor = '#22ff66';
      ctx.shadowBlur = 4;
      ctx.fillRect(cx - 0.5, cy - h / 2, 1, h);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };
    // Inner-wing conduit (taller, more bars)
    drawConduit(-W * 0.22, H * 0.04, 9, H * 0.36, 9);
    drawConduit( W * 0.22, H * 0.04, 9, H * 0.36, 9);
    // Outer-wing conduit (shorter, fewer bars)
    drawConduit(-W * 0.34, -H * 0.04, 7, H * 0.24, 6);
    drawConduit( W * 0.34, -H * 0.04, 7, H * 0.24, 6);

    // ── Central command tower (top of ship) ──
    // The narrow vertical block at the very top that holds the top red eye.
    ctx.fillStyle = armorMid;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.50);
    ctx.lineTo(W * 0.05, -H * 0.46);
    ctx.lineTo(W * 0.07, -H * 0.36);
    ctx.lineTo(-W * 0.07, -H * 0.36);
    ctx.lineTo(-W * 0.05, -H * 0.46);
    ctx.closePath();
    ctx.fill();
    // Tower notch
    ctx.fillStyle = armorDarkest;
    ctx.fillRect(-W * 0.025, -H * 0.50, W * 0.05, 5);
    // Top tower red eye — brightest single light
    ctx.fillStyle = coreRed;
    ctx.globalAlpha = 0.9 + Math.sin(tick * 0.1) * 0.1;
    ctx.beginPath(); ctx.arc(0, -H * 0.46, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffaaaa';
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(0, -H * 0.46, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Stacked red eye lights down the spine (the "face") ──
    // The concept has 3-4 horizontal red eyes between the top tower and
    // the central reactor — like a stack of menacing watchers.
    const eyeY = [-H * 0.32, -H * 0.24, -H * 0.18];
    for (const ey of eyeY) {
      // Dark socket
      ctx.fillStyle = armorDarkest;
      ctx.beginPath(); ctx.arc(0, ey, W * 0.032, 0, Math.PI * 2); ctx.fill();
      // Red glow
      ctx.fillStyle = coreRed;
      ctx.globalAlpha = corePulse * 0.9;
      ctx.beginPath(); ctx.arc(0, ey, W * 0.023, 0, Math.PI * 2); ctx.fill();
      // White-hot center
      ctx.fillStyle = '#ffeeee';
      ctx.globalAlpha = corePulse * 0.7;
      ctx.beginPath(); ctx.arc(0, ey, W * 0.010, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Pair of smaller red eyes flanking the central socket (concept has these too)
    for (const sx of [-1, 1]) {
      const ex = sx * W * 0.06;
      ctx.fillStyle = armorDarkest;
      ctx.beginPath(); ctx.arc(ex, -H * 0.22, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = coreRed;
      ctx.globalAlpha = corePulse * 0.85;
      ctx.beginPath(); ctx.arc(ex, -H * 0.22, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Central core slot — vertical chevron reactor (the iconic feature) ──
    const slotTop = -H * 0.15;
    const slotBot =  H * 0.18;
    const slotW = W * 0.07 + (armorSpread * W * 0.03); // widens in final form
    // Slot recess
    ctx.fillStyle = '#050008';
    ctx.fillRect(-slotW, slotTop, slotW * 2, slotBot - slotTop);
    // Chevron stack (5 vertical chevrons pointing up)
    const chevronCount = 5;
    const chevSpacing = (slotBot - slotTop) / (chevronCount + 0.5);
    for (let i = 0; i < chevronCount; i++) {
      const cy = slotTop + chevSpacing * (i + 0.5);
      const flow = (tick * 0.04 + i * 0.7) % 1;
      const intensity = 0.5 + 0.5 * Math.sin(flow * Math.PI);
      ctx.fillStyle = phase >= 3 ? '#ffffff' : coreRed;
      ctx.globalAlpha = (phase >= 3 ? 0.85 : 0.75) * intensity;
      ctx.beginPath();
      ctx.moveTo(0, cy - chevSpacing * 0.4);
      ctx.lineTo(slotW * 0.85, cy + chevSpacing * 0.2);
      ctx.lineTo(slotW * 0.5, cy + chevSpacing * 0.25);
      ctx.lineTo(0, cy + chevSpacing * 0.05);
      ctx.lineTo(-slotW * 0.5, cy + chevSpacing * 0.25);
      ctx.lineTo(-slotW * 0.85, cy + chevSpacing * 0.2);
      ctx.closePath();
      ctx.fill();
    }
    // Core glow (final form makes this much brighter)
    const coreGlow = ctx.createRadialGradient(0, H * 0.02, 0, 0, H * 0.02, W * 0.18);
    coreGlow.addColorStop(0, `rgba(255,40,40,${phase >= 3 ? 0.7 : 0.35})`);
    coreGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGlow;
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(0, H * 0.02, W * 0.18, 0, Math.PI * 2); ctx.fill();

    // ── Engine cluster at the bottom — 3 prominent red tubes ──
    // Match the concept's bottom-center engine cluster (3 cylindrical
    // tubes glowing red with bright cores).
    for (let i = -1; i <= 1; i++) {
      const ex = i * W * 0.05;
      const ey = H * 0.46;
      // Tube body
      ctx.fillStyle = armorDarkest;
      ctx.fillRect(ex - 4, ey - H * 0.06, 8, H * 0.10);
      ctx.strokeStyle = armorLight; ctx.lineWidth = 1;
      ctx.strokeRect(ex - 4, ey - H * 0.06, 8, H * 0.10);
      // Glow ring
      ctx.fillStyle = '#220000';
      ctx.beginPath(); ctx.arc(ex, ey + H * 0.04, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = coreRed;
      ctx.globalAlpha = 0.85 + Math.sin(tick * 0.18 + i * 1.3) * 0.15;
      ctx.beginPath(); ctx.arc(ex, ey + H * 0.04, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffaaaa';
      ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(ex, ey + H * 0.04, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Disruptor cannon tubes — TALL pink-tipped tubes from the shoulders ──
    // Concept art has these rising VERTICALLY from the upper shoulders.
    // Hardpoint at (-W*0.22, -H*0.40). Render mirrored pair.
    const drawCannonTube = (cx: number, cy: number, alive: boolean, tubeColor: string) => {
      // Tube body
      ctx.fillStyle = armorDarkest;
      ctx.fillRect(cx - 4, cy, 8, H * 0.08);
      ctx.strokeStyle = armorLight; ctx.lineWidth = 1;
      ctx.strokeRect(cx - 4, cy, 8, H * 0.08);
      // Internal heat slit
      ctx.fillStyle = alive ? '#ff2244' : '#222';
      ctx.fillRect(cx - 1, cy + 2, 2, H * 0.06);
      // Pink tip dome
      ctx.fillStyle = alive ? tubeColor : '#3a2233';
      ctx.beginPath(); ctx.arc(cx, cy, 5, Math.PI, 0); ctx.fill();
      // Glowing tip pulse
      if (alive) {
        const tipP = 0.65 + Math.sin(tick * 0.12 + cx * 0.05) * 0.3;
        ctx.fillStyle = '#ff88ee';
        ctx.globalAlpha = tipP;
        ctx.beginPath(); ctx.arc(cx, cy - 1, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = tipP * 0.8;
        ctx.beginPath(); ctx.arc(cx, cy - 1, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    };
    // Find weak point alive state (we look it up via the hardpoint position).
    // Since the renderer doesn't have direct access to weakPoints here, we
    // draw the tubes always — the alive state is communicated visually by
    // the weak-point glow ring that the generic renderer adds on top.
    drawCannonTube(-W * 0.22, -H * 0.46, true, '#ff44ee');  // L disruptor
    drawCannonTube( W * 0.22, -H * 0.46, true, '#ff44ee');  // R disruptor (mirror)
    // Missile bays — taller, more outboard, pink tip
    drawCannonTube(-W * 0.36, -H * 0.40, true, '#ff66cc');  // L missile
    drawCannonTube( W * 0.36, -H * 0.40, true, '#ff66cc');  // R missile

    // ── Plasma turret pads — big dark sockets where the purple weapon
    // glow goes. Decorative ring around the actual hardpoint position. ──
    const drawTurretPad = (cx: number, cy: number, padR: number) => {
      // Outer dark ring
      ctx.strokeStyle = armorLight;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, padR, 0, Math.PI * 2); ctx.stroke();
      // Inner dark recess
      ctx.fillStyle = armorDarkest;
      ctx.beginPath(); ctx.arc(cx, cy, padR - 2, 0, Math.PI * 2); ctx.fill();
      // Mounting rivets at cardinal points
      ctx.fillStyle = '#444';
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + Math.PI / 4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * padR, cy + Math.sin(a) * padR, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    // Plasma turret pads (mirror pair at (-W*0.40, -H*0.06))
    drawTurretPad(-W * 0.40, -H * 0.06, 14);
    drawTurretPad( W * 0.40, -H * 0.06, 14);  // mirror so concept's twin plasma turrets read
    // Tractor beam pads (mirror pair at (W*0.42, H*0.18))
    drawTurretPad(-W * 0.42, H * 0.18, 14);
    drawTurretPad( W * 0.42, H * 0.18, 14);

    // ── Phaser barrels — long thin tubes extending DOWN from bottom-outer ──
    // Concept has these as long pink-tipped barrels at the bottom-outer.
    const drawPhaserBarrel = (cx: number, cy: number, alive: boolean) => {
      // Long thin barrel
      ctx.fillStyle = armorMid;
      ctx.fillRect(cx - 2, cy, 4, H * 0.12);
      // Barrel rings
      ctx.fillStyle = armorLight;
      ctx.fillRect(cx - 3, cy + H * 0.03, 6, 1.5);
      ctx.fillRect(cx - 3, cy + H * 0.07, 6, 1.5);
      // Magenta tip
      if (alive) {
        ctx.fillStyle = '#ff44aa';
        ctx.beginPath(); ctx.moveTo(cx, cy + H * 0.13); ctx.lineTo(cx - 3, cy + H * 0.11); ctx.lineTo(cx + 3, cy + H * 0.11); ctx.closePath(); ctx.fill();
        const tp = 0.7 + Math.sin(tick * 0.14 + cx * 0.06) * 0.3;
        ctx.fillStyle = '#ff88dd';
        ctx.globalAlpha = tp;
        ctx.beginPath(); ctx.arc(cx, cy + H * 0.125, 2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    };
    drawPhaserBarrel(-W * 0.32, H * 0.34, true);
    drawPhaserBarrel( W * 0.32, H * 0.34, true);  // mirror

    // (Hardpoint glow circles for the 6 weak points are drawn by the
    // generic weakPoint renderer downstream in drawBoss — they appear
    // on top of the dark sockets and decorative tubes set up above.)

    // ── Armor seam plating — diagonal panel lines across the wings ──
    ctx.strokeStyle = '#2a2a32';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 5; i++) {
      const y = -H * 0.25 + i * H * 0.13;
      ctx.beginPath();
      ctx.moveTo(-W * 0.46, y);
      ctx.lineTo(-W * 0.08, y + H * 0.02);
      ctx.moveTo(W * 0.08, y + H * 0.02);
      ctx.lineTo(W * 0.46, y);
      ctx.stroke();
    }
    // Vertical panel seams along the central body
    for (let i = 0; i < 4; i++) {
      const x = -W * 0.06 + i * W * 0.04;
      ctx.beginPath();
      ctx.moveTo(x, -H * 0.32);
      ctx.lineTo(x + 1, H * 0.32);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Bright accent stripes along the central spine ──
    ctx.fillStyle = '#aa1818';
    ctx.globalAlpha = 0.4 + Math.sin(tick * 0.07) * 0.2;
    for (let i = 0; i < 3; i++) {
      const ay = -H * 0.18 + i * H * 0.12;
      ctx.fillRect(-W * 0.015, ay, W * 0.03, H * 0.025);
    }
    ctx.globalAlpha = 1;

    // ── Window/port lights scattered on the wings ──
    // Concept has dozens of small red eye-lights all over the wings.
    // More of them, alternating red/amber.
    for (let i = 0; i < 24; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const px = side * (W * 0.18 + (i * 7 % 13) * W * 0.018);
      const py = -H * 0.22 + (i * 17 % 23) * H * 0.04;
      const winPulse = 0.45 + 0.4 * Math.sin(tick * 0.04 + i * 1.3);
      ctx.globalAlpha = winPulse;
      ctx.fillStyle = i % 3 === 0 ? '#ff4422' : '#ffaa44';
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Glowing red accent dots on the wings (concept's bright red specks) ──
    ctx.fillStyle = '#ff3030';
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const px = side * (W * 0.28 + (i * 5 % 7) * W * 0.02);
      const py = -H * 0.05 + (i * 11 % 9) * H * 0.04;
      const pulse = 0.6 + 0.4 * Math.sin(tick * 0.1 + i * 1.7);
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Hot core
      ctx.fillStyle = '#ffaaaa';
      ctx.globalAlpha = pulse * 0.8;
      ctx.beginPath();
      ctx.arc(px, py, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff3030';
    }
    ctx.globalAlpha = 1;

    // ── Mechanical detail pass — antennae, mount brackets, hex panels ──
    // Bolted-on machinery that gives the ship a real "built by engineers"
    // feel rather than a clean procedural blob.

    // Sensor antennae on the top of the command tower
    ctx.strokeStyle = armorAccent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-W * 0.03, -H * 0.50); ctx.lineTo(-W * 0.06, -H * 0.54);
    ctx.moveTo( W * 0.03, -H * 0.50); ctx.lineTo( W * 0.06, -H * 0.54);
    ctx.moveTo(0, -H * 0.50); ctx.lineTo(0, -H * 0.56);
    ctx.stroke();
    // Antenna tip lights
    ctx.fillStyle = '#ff6644';
    ctx.globalAlpha = 0.7 + Math.sin(tick * 0.18) * 0.3;
    ctx.beginPath(); ctx.arc(0, -H * 0.56, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-W * 0.06, -H * 0.54, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc( W * 0.06, -H * 0.54, 1, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Mount brackets around each major weapon hardpoint
    ctx.strokeStyle = armorAccent;
    ctx.lineWidth = 1.2;
    const mountPos = [
      { x: -W * 0.22, y: -H * 0.40, r: 9 }, // L disruptor
      { x:  W * 0.22, y: -H * 0.40, r: 9 }, // R disruptor (mirror display)
      { x: -W * 0.36, y: -H * 0.34, r: 9 }, // L missile
      { x:  W * 0.36, y: -H * 0.34, r: 9 }, // R missile
      { x: -W * 0.40, y: -H * 0.06, r: 18 }, // L plasma
      { x:  W * 0.40, y: -H * 0.06, r: 18 }, // R plasma
      { x: -W * 0.42, y:  H * 0.18, r: 18 }, // L tractor
      { x:  W * 0.42, y:  H * 0.18, r: 18 }, // R tractor
    ];
    for (const m of mountPos) {
      // 4 small bracket ticks at the cardinal points
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + Math.PI / 4;
        const x0 = m.x + Math.cos(a) * (m.r + 2);
        const y0 = m.y + Math.sin(a) * (m.r + 2);
        const x1 = m.x + Math.cos(a) * (m.r + 5);
        const y1 = m.y + Math.sin(a) * (m.r + 5);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
    }

    // Hex-panel texture on the central body (subtle, suggests heavy plating)
    ctx.strokeStyle = '#3a3a44';
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.5;
    for (let row = 0; row < 4; row++) {
      const py = -H * 0.10 + row * H * 0.08;
      const offset = (row % 2 === 0 ? 0 : W * 0.022);
      for (let col = -2; col <= 2; col++) {
        const px = col * W * 0.045 + offset;
        // Small hexagon outline
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 / 6) * i + Math.PI / 6;
          const hx = px + Math.cos(a) * W * 0.020;
          const hy = py + Math.sin(a) * W * 0.020;
          if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Battle-damage hairline cracks (subtle, scattered across the hull)
    ctx.strokeStyle = '#080810';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.55;
    const cracks = [
      [-W * 0.28, -H * 0.10, -W * 0.18, -H * 0.04],
      [ W * 0.30,  H * 0.04,  W * 0.20,  H * 0.10],
      [-W * 0.10,  H * 0.22, -W * 0.05,  H * 0.30],
      [ W * 0.08, -H * 0.20,  W * 0.14, -H * 0.12],
    ];
    for (const [x1, y1, x2, y2] of cracks) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Tiny amber service lights along the central spine
    ctx.fillStyle = '#ffaa44';
    for (let i = 0; i < 6; i++) {
      const py = -H * 0.05 + i * H * 0.06;
      const pulse = 0.4 + 0.5 * Math.sin(tick * 0.05 + i * 1.7);
      ctx.globalAlpha = pulse;
      ctx.fillRect(-W * 0.10, py, 1.5, 1.5);
      ctx.fillRect( W * 0.10 - 1.5, py, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // ── Subtle scanline overlay on the hull (retro-arcade feel) ──
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000000';
    for (let y = -H * 0.5; y < H * 0.5; y += 3) {
      ctx.fillRect(-W * 0.5, y, W, 1);
    }
    ctx.globalAlpha = 1;

    // (The 6 weak-point glow circles are drawn by the generic weakPoint
    // renderer downstream in drawBoss — they appear on top of the dark
    // mount sockets and decorative tubes/pads laid out above.)
  }

  // ── 1. K'TAGH WARBIRD — Klingon, swept wings, brutal angles ──────
  private bossHullWarbird(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, phase: number) {
    // Swept wings — predator silhouette
    ctx.fillStyle = dk;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.45);
    ctx.lineTo(-W * 0.12, -H * 0.2);
    ctx.lineTo(-W * 0.55, H * 0.15);
    ctx.lineTo(-W * 0.35, H * 0.35);
    ctx.lineTo(-W * 0.12, H * 0.25);
    ctx.lineTo(0, H * 0.5);
    ctx.lineTo(W * 0.12, H * 0.25);
    ctx.lineTo(W * 0.35, H * 0.35);
    ctx.lineTo(W * 0.55, H * 0.15);
    ctx.lineTo(W * 0.12, -H * 0.2);
    ctx.closePath(); ctx.fill();
    // Central spine
    ctx.fillStyle = md;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.4); ctx.lineTo(-W * 0.06, H * 0.3); ctx.lineTo(W * 0.06, H * 0.3);
    ctx.closePath(); ctx.fill();
    // Bridge
    ctx.fillStyle = '#1a0a0a';
    ctx.beginPath(); ctx.ellipse(0, -H * 0.2, W * 0.08, H * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color; ctx.globalAlpha = 0.7 + Math.sin(tick * 0.06) * 0.2;
    ctx.beginPath(); ctx.ellipse(0, -H * 0.2, W * 0.04, H * 0.025, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // Wing-tip cannons
    this.bossPort(ctx, -W * 0.5, H * 0.15, 5, color, tick, phase);
    this.bossPort(ctx, W * 0.5, H * 0.15, 5, color, tick, phase);
    this.bossPort(ctx, 0, H * 0.45, 6, color, tick, phase);
  }

  // ── 2. IRW VALDORE — Romulan dreadnought, broad raptor wings ─────
  // ── 2. IRW VALDORE — Romulan warbird ─────────────────────────────
  // A swept predatory raptor: beak prow facing the player, great feathered
  // wings, an artificial-quantum-singularity core, and FOUR distinct weapon
  // systems — twin forward disruptors, wing-root plasma turrets, wingtip
  // beam lances, and a central torpedo launcher.
  private bossHullDreadnought(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#10180f';
    const hullDark    = '#1e2f1f';
    const hullMid     = '#2f4a32';
    const hullLight   = '#46684a';
    const hullAccent  = '#86b58c';
    const conduit     = '#4dff7a';
    const conduitDim  = '#0c3a18';
    const corePulse = 0.6 + Math.sin(tick * 0.07) * 0.35;
    const phaseGlow = 0.45 + phase * 0.16;   // energy intensifies each phase

    // ── Silhouette: swept raptor, right half mirrored to the left ──
    const half: [number, number][] = [
      [0.00,  0.50],  // beak tip (faces the player)
      [0.10,  0.40],  // prow shoulder
      [0.16,  0.20],  // inner wing root
      [0.30,  0.04],  // leading edge
      [0.46, -0.06],  // outer wing lobe
      [0.54, -0.14],  // wingtip
      [0.44, -0.20],  // trailing feather step
      [0.48, -0.30],  // feather lobe
      [0.30, -0.34],  // inner trailing edge
      [0.18, -0.40],  // rear shoulder
      [0.10, -0.50],  // tail flank
      [0.00, -0.46],  // tail center
    ];
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(half[0][0] * W, half[0][1] * H);
      for (let i = 1; i < half.length; i++) ctx.lineTo(half[i][0] * W, half[i][1] * H);
      for (let i = half.length - 2; i >= 1; i--) ctx.lineTo(-half[i][0] * W, half[i][1] * H);
      ctx.closePath();
    };

    // Dark armor base
    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    trace(); ctx.fill();

    // ── Wing armor plating — inset mid-tone panels per wing ──
    ctx.fillStyle = hullMid;
    for (const s of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(s * W * 0.14, H * 0.16);
      ctx.lineTo(s * W * 0.29, H * 0.02);
      ctx.lineTo(s * W * 0.42, -H * 0.07);
      ctx.lineTo(s * W * 0.40, -H * 0.20);
      ctx.lineTo(s * W * 0.26, -H * 0.28);
      ctx.lineTo(s * W * 0.15, -H * 0.18);
      ctx.closePath(); ctx.fill();
    }

    // ── Wing feather ribs — chevron detail along each leading edge ──
    ctx.strokeStyle = hullDarkest;
    ctx.lineWidth = 2;
    for (const s of [1, -1]) {
      for (let r = 0; r < 4; r++) {
        const t = r / 4;
        ctx.beginPath();
        ctx.moveTo(s * W * (0.16 + t * 0.26), H * (0.14 - t * 0.30));
        ctx.lineTo(s * W * (0.30 + t * 0.18), H * (0.04 - t * 0.22));
        ctx.stroke();
      }
    }

    // ── Central raised body — elongated armored spine ──
    ctx.fillStyle = hullLight;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.46);
    ctx.lineTo(W * 0.09, H * 0.20);
    ctx.lineTo(W * 0.085, -H * 0.28);
    ctx.lineTo(0, -H * 0.44);
    ctx.lineTo(-W * 0.085, -H * 0.28);
    ctx.lineTo(-W * 0.09, H * 0.20);
    ctx.closePath(); ctx.fill();
    // body panel seam
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, H * 0.40); ctx.lineTo(0, -H * 0.40); ctx.stroke();

    // ── Glowing singularity conduit running the spine ──
    ctx.strokeStyle = conduitDim; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, H * 0.30); ctx.lineTo(0, -H * 0.30); ctx.stroke();
    ctx.strokeStyle = conduit; ctx.lineWidth = 2;
    ctx.globalAlpha = phaseGlow * (0.7 + corePulse * 0.3);
    ctx.beginPath(); ctx.moveTo(0, H * 0.30); ctx.lineTo(0, -H * 0.30); ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Artificial quantum-singularity core ──
    const coreR = W * 0.085;
    const cg = ctx.createRadialGradient(0, 0, 1, 0, 0, coreR * 1.8);
    cg.addColorStop(0, '#ffffff');
    cg.addColorStop(0.4, conduit);
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg; ctx.globalAlpha = phaseGlow * corePulse;
    ctx.beginPath(); ctx.arc(0, 0, coreR * 1.8, 0, Math.PI * 2); ctx.fill();
    // swirling accretion ring
    ctx.strokeStyle = conduit; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, coreR, coreR * 0.42, tick * 0.04, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, coreR, coreR * 0.42, tick * 0.04 + Math.PI / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Command bridge — near the tail, with lit viewports ──
    ctx.fillStyle = hullMid;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.30);
    ctx.lineTo(W * 0.07, -H * 0.36);
    ctx.lineTo(W * 0.05, -H * 0.44);
    ctx.lineTo(-W * 0.05, -H * 0.44);
    ctx.lineTo(-W * 0.07, -H * 0.36);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = conduit; ctx.globalAlpha = 0.55 + Math.sin(tick * 0.11) * 0.25;
    for (let i = -1; i <= 1; i++) {
      ctx.fillRect(i * W * 0.03 - W * 0.012, -H * 0.41, W * 0.024, H * 0.022);
    }
    ctx.globalAlpha = 1;

    // ── Twin engine glow at the tail ──
    for (const s of [1, -1]) {
      const eg = ctx.createRadialGradient(s * W * 0.06, -H * 0.48, 1, s * W * 0.06, -H * 0.48, W * 0.10);
      eg.addColorStop(0, conduit);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg; ctx.globalAlpha = 0.5 + Math.sin(tick * 0.2 + s) * 0.2;
      ctx.beginPath(); ctx.arc(s * W * 0.06, -H * 0.48, W * 0.10, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ════ WEAPON SYSTEMS ════

    // 1. Twin forward disruptor cannons — flank the beak, aimed at player
    for (const s of [1, -1]) {
      const bx = s * W * 0.13, by = H * 0.34;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(bx - W * 0.035, by - H * 0.06, W * 0.07, H * 0.20);
      ctx.fillStyle = hullLight;
      ctx.fillRect(bx - W * 0.035, by - H * 0.06, W * 0.07, H * 0.04);
      // muzzle glow
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(bx, by + H * 0.14, W * 0.022, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 2. Wing-root plasma turrets — domed turret + stubby barrel per wing
    for (const s of [1, -1]) {
      const tx = s * W * 0.22, ty = H * 0.04;
      ctx.fillStyle = hullDarkest;
      ctx.beginPath(); ctx.arc(tx, ty, W * 0.055, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hullLight;
      ctx.beginPath(); ctx.arc(tx, ty, W * 0.038, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(tx - W * 0.014, ty, W * 0.028, H * 0.10);
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * 0.7;
      ctx.beginPath(); ctx.arc(tx, ty - W * 0.01, W * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. Wingtip beam lances — slender emitter spikes
    for (const s of [1, -1]) {
      const lx = s * W * 0.50, ly = -H * 0.12;
      ctx.fillStyle = hullAccent;
      ctx.beginPath();
      ctx.moveTo(lx, ly + H * 0.16);
      ctx.lineTo(lx - s * W * 0.02, ly - H * 0.02);
      ctx.lineTo(lx + s * W * 0.02, ly - H * 0.02);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * (0.5 + corePulse * 0.5);
      ctx.beginPath(); ctx.arc(lx, ly + H * 0.16, W * 0.018, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 4. Central torpedo launcher — lit aperture in the lower body
    ctx.fillStyle = hullDarkest;
    ctx.beginPath(); ctx.ellipse(0, H * 0.30, W * 0.05, H * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = conduit;
    ctx.globalAlpha = phaseGlow * (0.4 + corePulse * 0.5);
    ctx.beginPath(); ctx.ellipse(0, H * 0.30, W * 0.03, H * 0.038, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // ── Bright contour outline last, so the raptor reads against nebula ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    trace(); ctx.stroke();
  }

  // ── 3. ORION FLAGSHIP — bulky, multi-deck command vessel ─────────
  // ── 3. ORION FLAGSHIP — bulky pirate command vessel ─────────────
  // A heavily-modified industrial hull bristling with mismatched mercenary
  // weapons. Wide chevron silhouette, multi-deck plating, asymmetric
  // pirate aesthetic — and SEVEN distinct mounts: central Mass Driver
  // (signature charging beam), L/R disruptor cannons forward, L/R missile
  // racks on the upper shoulders, L/R Gatling turrets mid-flanks.
  private bossHullFlagship(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#1a1108';
    const hullDark    = '#3a2818';
    const hullMid     = '#5a4028';
    const hullLight   = '#7a5a3a';
    const hullAccent  = '#c8a672';
    const conduit     = '#ffaa44';
    const conduitHot  = '#ffd060';
    const conduitDim  = '#4a2a0a';
    const corePulse = 0.6 + Math.sin(tick * 0.07) * 0.3;
    const phaseGlow = 0.5 + phase * 0.13;

    // ── Silhouette: bulky industrial chevron, right half mirrored ──
    const half: [number, number][] = [
      [0.00,  0.50],  // bottom prow tip (faces player)
      [0.14,  0.44],
      [0.30,  0.40],  // gatling shoulder
      [0.44,  0.30],
      [0.52,  0.10],  // mid flank (broadest)
      [0.50, -0.10],
      [0.46, -0.26],  // upper shoulder (missile rack mount)
      [0.34, -0.36],
      [0.22, -0.42],
      [0.12, -0.46],
      [0.00, -0.50],  // tail center
    ];
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(half[0][0] * W, half[0][1] * H);
      for (let i = 1; i < half.length; i++) ctx.lineTo(half[i][0] * W, half[i][1] * H);
      for (let i = half.length - 2; i >= 1; i--) ctx.lineTo(-half[i][0] * W, half[i][1] * H);
      ctx.closePath();
    };

    // Dark hull base
    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    trace(); ctx.fill();

    // ── Layered horizontal deck plates (industrial / heavy-armor read) ──
    ctx.fillStyle = hullMid;
    for (let i = 0; i < 5; i++) {
      const yy = -H * 0.30 + i * H * 0.14;
      const xWidth = W * (0.46 - Math.abs(i - 2) * 0.04);
      ctx.fillRect(-xWidth, yy, xWidth * 2, H * 0.04);
    }
    // Panel seam vertical lines
    ctx.strokeStyle = hullDarkest;
    ctx.lineWidth = 1.5;
    for (const x of [-0.32, -0.16, 0, 0.16, 0.32]) {
      ctx.beginPath();
      ctx.moveTo(x * W, -H * 0.38);
      ctx.lineTo(x * W, H * 0.36);
      ctx.stroke();
    }

    // ── Asymmetric command bridge tower (offset left for pirate feel) ──
    ctx.fillStyle = hullLight;
    ctx.beginPath();
    ctx.moveTo(-W * 0.14, -H * 0.18);
    ctx.lineTo(-W * 0.10, -H * 0.38);
    ctx.lineTo(W * 0.08, -H * 0.38);
    ctx.lineTo(W * 0.12, -H * 0.18);
    ctx.closePath(); ctx.fill();
    // Bridge viewports — pirate amber
    ctx.fillStyle = conduit;
    ctx.globalAlpha = 0.6 + Math.sin(tick * 0.09) * 0.25;
    for (let i = 0; i < 4; i++) {
      const wx = -W * 0.10 + i * W * 0.05;
      ctx.fillRect(wx, -H * 0.34, W * 0.025, H * 0.018);
    }
    ctx.globalAlpha = 1;
    // Bridge tower outline
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-W * 0.14, -H * 0.18);
    ctx.lineTo(-W * 0.10, -H * 0.38);
    ctx.lineTo(W * 0.08, -H * 0.38);
    ctx.lineTo(W * 0.12, -H * 0.18);
    ctx.stroke();

    // ── Heavy rear engine bank (top edge = boss rear) ──
    for (let i = -2; i <= 2; i++) {
      const ex = i * W * 0.12;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ex - W * 0.04, -H * 0.50, W * 0.08, H * 0.08);
      // Engine glow
      const eg = ctx.createRadialGradient(ex, -H * 0.50, 1, ex, -H * 0.50, W * 0.07);
      eg.addColorStop(0, conduitHot);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg; ctx.globalAlpha = 0.55 + Math.sin(tick * 0.18 + i) * 0.2;
      ctx.beginPath(); ctx.arc(ex, -H * 0.50, W * 0.07, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Mismatched hull rivets / scavenged-armor detail ──
    ctx.fillStyle = hullAccent;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 14; i++) {
      const rx = (((i * 7919) % 100) / 100 - 0.5) * W * 0.85;
      const ry = (((i * 6131) % 100) / 100 - 0.5) * H * 0.85;
      // Only inside hull-ish area (rough cull)
      if (Math.abs(rx) > W * 0.4 || Math.abs(ry) > H * 0.45) continue;
      ctx.fillRect(rx - 1, ry - 1, 2, 2);
    }
    ctx.globalAlpha = 1;

    // ════ WEAPON SYSTEMS — bristling mismatched arsenal ════

    // 1. CENTRAL MASS DRIVER — signature charged-beam cannon (prominent)
    //    Wide bracket housing + long cooling-finned barrel pointing at player.
    {
      const mx = 0, my = H * 0.10;
      // Mounting bracket
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mx - W * 0.10, my - H * 0.05, W * 0.20, H * 0.10);
      ctx.fillStyle = hullAccent;
      ctx.fillRect(mx - W * 0.10, my - H * 0.05, W * 0.20, H * 0.02);
      // Barrel — long, cooling-finned, pointing down at player
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mx - W * 0.05, my, W * 0.10, H * 0.35);
      ctx.fillStyle = hullLight;
      // cooling fins on the barrel
      for (let i = 0; i < 5; i++) {
        const fy = my + H * 0.06 + i * H * 0.06;
        ctx.fillRect(mx - W * 0.07, fy, W * 0.14, H * 0.018);
      }
      // Muzzle glow (always lit; intensifies during charge in updateEnemy)
      ctx.fillStyle = conduitHot;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(mx, my + H * 0.36, W * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 2. TWIN FORWARD DISRUPTOR CANNONS — flank the mass driver
    for (const s of [1, -1]) {
      const bx = s * W * 0.22, by = H * 0.20;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(bx - W * 0.025, by - H * 0.04, W * 0.05, H * 0.22);
      ctx.fillStyle = hullLight;
      ctx.fillRect(bx - W * 0.025, by - H * 0.04, W * 0.05, H * 0.03);
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.45);
      ctx.beginPath(); ctx.arc(bx, by + H * 0.20, W * 0.020, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. UPPER MISSILE RACKS — boxy launchers on the shoulders, top edge
    for (const s of [1, -1]) {
      const mrx = s * W * 0.34, mry = -H * 0.28;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mrx - W * 0.07, mry - H * 0.04, W * 0.14, H * 0.10);
      // 3 missile tubes per rack
      ctx.fillStyle = conduitDim;
      for (let t = -1; t <= 1; t++) {
        ctx.fillRect(mrx + t * W * 0.04 - W * 0.012, mry - H * 0.02, W * 0.024, H * 0.06);
      }
      // Loaded missile glow
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * 0.7;
      for (let t = -1; t <= 1; t++) {
        ctx.beginPath();
        ctx.arc(mrx + t * W * 0.04, mry - H * 0.005, W * 0.006, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 4. MID-FLANK GATLING TURRETS — domed turret + multi-barrel
    for (const s of [1, -1]) {
      const gx = s * W * 0.46, gy = H * 0.04;
      // Turret base — wider dome
      ctx.fillStyle = hullDarkest;
      ctx.beginPath();
      ctx.arc(gx, gy, W * 0.06, Math.PI, Math.PI * 2);
      ctx.lineTo(gx + W * 0.06, gy);
      ctx.lineTo(gx - W * 0.06, gy);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hullLight;
      ctx.beginPath();
      ctx.arc(gx, gy, W * 0.042, Math.PI, Math.PI * 2);
      ctx.closePath(); ctx.fill();
      // Multi-barrel cluster (3 short barrels)
      ctx.fillStyle = hullDarkest;
      for (let b = -1; b <= 1; b++) {
        ctx.fillRect(gx + b * W * 0.018 - W * 0.005, gy, W * 0.010, H * 0.10);
      }
      // Hot barrel tip
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * (0.5 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(gx, gy - W * 0.015, W * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Bright contour outline (last, so the silhouette reads against nebula) ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    trace(); ctx.stroke();
  }

  // ── 4. SINGULARITY MARAUDER — dish + gravity core ────────────────
  // ── 4. SINGULARITY MARAUDER — Romulan gravity-warfare vessel ─────
  // Heavy industrial Romulan hull, distinct from Valdore's sleek raptor.
  // Hexagonal command body, forward-extending grappler claws, a massive
  // ventral SINGULARITY DISH with a black-hole core. Seven hardpoints:
  // central singularity cannon, L/R claw-tip disruptors, L/R mid-flank
  // plasma conduits, L/R aft phaser banks on the upper shoulders.
  private bossHullGravityMarauder(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#0c1f12';
    const hullDark    = '#1c3525';
    const hullMid     = '#2c4a36';
    const hullLight   = '#446852';
    const hullAccent  = '#7da689';
    const conduit     = '#33ff88';
    const conduitHot  = '#88ffbb';
    const conduitDim  = '#0c3a22';
    const corePulse = 0.65 + Math.sin(tick * 0.09) * 0.3;
    const phaseGlow = 0.5 + phase * 0.15;

    // ── Silhouette: hex command body + forward claws ──
    const half: [number, number][] = [
      [0.00, -0.50],  // top center (rear)
      [0.22, -0.42],  // upper shoulder (aft phaser mount)
      [0.40, -0.30],  // angled upper flank
      [0.50, -0.10],
      [0.50,  0.10],  // mid flank (plasma conduit)
      [0.42,  0.24],  // upper claw arm
      [0.50,  0.34],  // claw outer
      [0.42,  0.46],  // claw tip (grappler disruptor)
      [0.26,  0.40],  // claw inner
      [0.18,  0.30],  // inner notch (between claws + dish)
      [0.12,  0.34],  // dish flank
      [0.00,  0.44],  // dish bottom
    ];
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(half[0][0] * W, half[0][1] * H);
      for (let i = 1; i < half.length; i++) ctx.lineTo(half[i][0] * W, half[i][1] * H);
      for (let i = half.length - 2; i >= 1; i--) ctx.lineTo(-half[i][0] * W, half[i][1] * H);
      ctx.closePath();
    };

    // Dark hull base
    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    trace(); ctx.fill();

    // ── Hex command body inset — raised central armor ──
    ctx.fillStyle = hullMid;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const x = Math.cos(a) * W * 0.26;
      const y = Math.sin(a) * H * 0.24;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // hex panel seams
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const x = Math.cos(a) * W * 0.26;
      const y = Math.sin(a) * H * 0.24;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.stroke();

    // ── Grappler claw armor plating (per side) ──
    ctx.fillStyle = hullLight;
    for (const s of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(s * W * 0.40, H * 0.24);
      ctx.lineTo(s * W * 0.46, H * 0.34);
      ctx.lineTo(s * W * 0.40, H * 0.44);
      ctx.lineTo(s * W * 0.30, H * 0.40);
      ctx.lineTo(s * W * 0.26, H * 0.30);
      ctx.closePath(); ctx.fill();
    }

    // ── Hull greebles / panel seams ──
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    for (const s of [1, -1]) {
      // diagonal seam from shoulder to flank
      ctx.beginPath();
      ctx.moveTo(s * W * 0.22, -H * 0.40);
      ctx.lineTo(s * W * 0.48, -H * 0.10);
      ctx.stroke();
      // mid-body horizontal panel line
      ctx.beginPath();
      ctx.moveTo(s * W * 0.18, 0);
      ctx.lineTo(s * W * 0.45, 0);
      ctx.stroke();
    }

    // ── Heavy aft engine bank (top edge — boss rear) ──
    for (let i = -1; i <= 1; i++) {
      const ex = i * W * 0.16;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ex - W * 0.05, -H * 0.50, W * 0.10, H * 0.08);
      const eg = ctx.createRadialGradient(ex, -H * 0.50, 1, ex, -H * 0.50, W * 0.10);
      eg.addColorStop(0, conduit);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg; ctx.globalAlpha = 0.55 + Math.sin(tick * 0.18 + i) * 0.2;
      ctx.beginPath(); ctx.arc(ex, -H * 0.50, W * 0.10, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ════ VENTRAL SINGULARITY DISH ════
    // The signature visual — a massive concave dish on the underside
    // (facing the player) with a black-hole core and swirling event horizon.
    {
      const dx = 0, dy = H * 0.30;
      // Dish rim — heavy bracket
      ctx.fillStyle = hullDarkest;
      ctx.beginPath();
      ctx.ellipse(dx, dy, W * 0.22, H * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      // Inner dish surface — concentric rings
      ctx.strokeStyle = hullAccent;
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        ctx.globalAlpha = 0.4 + r * 0.1;
        ctx.beginPath();
        ctx.ellipse(dx, dy, W * 0.20 * (r / 3), H * 0.115 * (r / 3), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // Radial support spokes
      ctx.strokeStyle = hullMid; ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i + tick * 0.006;
        ctx.beginPath();
        ctx.moveTo(dx + Math.cos(a) * W * 0.05, dy + Math.sin(a) * H * 0.03);
        ctx.lineTo(dx + Math.cos(a) * W * 0.20, dy + Math.sin(a) * H * 0.115);
        ctx.stroke();
      }
      // Black-hole core
      ctx.fillStyle = '#000000';
      ctx.beginPath(); ctx.arc(dx, dy, W * 0.06, 0, Math.PI * 2); ctx.fill();
      // Accretion ring (swirling)
      ctx.strokeStyle = conduit;
      ctx.lineWidth = 2;
      ctx.globalAlpha = phaseGlow * corePulse;
      ctx.beginPath();
      ctx.arc(dx, dy, W * 0.075, tick * 0.05, tick * 0.05 + Math.PI * 1.7); ctx.stroke();
      ctx.strokeStyle = conduitHot; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(dx, dy, W * 0.095, -tick * 0.06, -tick * 0.06 + Math.PI * 1.3); ctx.stroke();
      ctx.globalAlpha = 1;
      // Bright singularity core dot
      const cg = ctx.createRadialGradient(dx, dy, 1, dx, dy, W * 0.05);
      cg.addColorStop(0, '#ffffff');
      cg.addColorStop(0.4, conduit);
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg; ctx.globalAlpha = phaseGlow * (0.7 + corePulse * 0.3);
      ctx.beginPath(); ctx.arc(dx, dy, W * 0.05, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ════ WEAPON SYSTEMS ════

    // 1. CENTRAL SINGULARITY CANNON — emerges from the dish core (already drawn).
    //    The dish + core visually IS the cannon. Just add a forward muzzle.
    ctx.fillStyle = hullDarkest;
    ctx.fillRect(-W * 0.04, H * 0.30, W * 0.08, H * 0.18);
    ctx.fillStyle = conduit;
    ctx.globalAlpha = phaseGlow * (0.5 + corePulse * 0.4);
    ctx.beginPath(); ctx.arc(0, H * 0.46, W * 0.025, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // 2. L/R GRAPPLER CLAW DISRUPTORS — at the claw tips
    for (const s of [1, -1]) {
      const cx = s * W * 0.42, cy = H * 0.42;
      ctx.fillStyle = hullDarkest;
      ctx.beginPath(); ctx.arc(cx, cy, W * 0.045, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hullLight;
      ctx.beginPath(); ctx.arc(cx, cy, W * 0.030, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = conduitHot;
      ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.35);
      ctx.beginPath(); ctx.arc(cx, cy, W * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. L/R PLASMA CONDUITS — mid-flank, glowing energy ports
    for (const s of [1, -1]) {
      const px = s * W * 0.45, py = 0;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(px - W * 0.025, py - H * 0.05, W * 0.05, H * 0.10);
      // Pulsing inner glow
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.fillRect(px - W * 0.015, py - H * 0.035, W * 0.030, H * 0.070);
      ctx.globalAlpha = 1;
    }

    // 4. L/R AFT PHASER BANKS — upper shoulders, aimed forward/down
    for (const s of [1, -1]) {
      const ax = s * W * 0.30, ay = -H * 0.32;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ax - W * 0.045, ay - H * 0.02, W * 0.09, H * 0.05);
      ctx.fillStyle = hullLight;
      ctx.fillRect(ax - W * 0.045, ay - H * 0.02, W * 0.09, H * 0.015);
      // Three small emitter dots
      ctx.fillStyle = conduit; ctx.globalAlpha = phaseGlow * 0.7;
      for (let t = -1; t <= 1; t++) {
        ctx.beginPath();
        ctx.arc(ax + t * W * 0.025, ay + H * 0.013, W * 0.008, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Bright contour outline last ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    trace(); ctx.stroke();
  }

  // ── 5. ANOMALY GUARDIAN — Klingon crystal sentinel ──────────────
  // Faceted hexagonal sentinel guarding a spacetime anomaly. Crystal-grey
  // armor with violet anomaly energy at the central lens. Seven hardpoints
  // mounted on the hex facets. The hull slowly counter-rotates (or rather:
  // the inner hex spins relative to the outer hull) for a "watching/
  // alert" feel.
  private bossHullGuardian(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#0c1418';
    const hullDark    = '#1f2830';
    const hullMid     = '#384452';
    const hullLight   = '#56657a';
    const hullAccent  = '#8aa0bb';
    const anomaly     = '#aaccff';
    const anomalyHot  = '#dde8ff';
    const anomalyDeep = '#5566cc';
    const corePulse = 0.6 + Math.sin(tick * 0.09) * 0.3;
    const phaseGlow = 0.5 + phase * 0.14;
    const spin = tick * 0.004;

    // ── Outer hex hull silhouette (slightly elongated vertical) ──
    const outerHex = (): void => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
        const x = Math.cos(a) * W * 0.50;
        const y = Math.sin(a) * H * 0.48;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // Dark base
    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    outerHex(); ctx.fill();

    // ── Hex armor segments — 6 trapezoids around the rim ──
    ctx.fillStyle = hullMid;
    for (let i = 0; i < 6; i++) {
      const a1 = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const a2 = (Math.PI * 2 / 6) * (i + 1) - Math.PI / 2;
      const inner = 0.30, outer = 0.46;
      const x1 = Math.cos(a1) * W * outer, y1 = Math.sin(a1) * H * (outer * 0.96);
      const x2 = Math.cos(a2) * W * outer, y2 = Math.sin(a2) * H * (outer * 0.96);
      const x3 = Math.cos(a2) * W * inner, y3 = Math.sin(a2) * H * (inner * 0.96);
      const x4 = Math.cos(a1) * W * inner, y4 = Math.sin(a1) * H * (inner * 0.96);
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
      ctx.closePath(); ctx.fill();
    }
    // Segment seams
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * W * 0.28, Math.sin(a) * H * 0.27);
      ctx.lineTo(Math.cos(a) * W * 0.48, Math.sin(a) * H * 0.46);
      ctx.stroke();
    }

    // ── Inner spinning hex (counter-rotating crystal core) ──
    ctx.save();
    ctx.rotate(spin);
    ctx.fillStyle = hullLight;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      const x = Math.cos(a) * W * 0.24;
      const y = Math.sin(a) * H * 0.23;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // Inner facet highlights
    ctx.strokeStyle = hullAccent; ctx.lineWidth = 1;
    ctx.globalAlpha = 0.65;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * W * 0.22, Math.sin(a) * H * 0.21);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── ANOMALY LENS — central portal to the guarded anomaly ──
    // Black core, swirling violet event horizon, pulsing white singularity.
    const lensR = W * 0.12;
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, lensR, 0, Math.PI * 2); ctx.fill();
    // Anomaly swirl — three counter-rotating rings
    ctx.strokeStyle = anomalyDeep; ctx.lineWidth = 3;
    ctx.globalAlpha = phaseGlow * corePulse * 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, lensR * 1.15, tick * 0.05, tick * 0.05 + Math.PI * 1.5);
    ctx.stroke();
    ctx.strokeStyle = anomaly; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, lensR * 1.30, -tick * 0.07, -tick * 0.07 + Math.PI * 1.2);
    ctx.stroke();
    ctx.strokeStyle = anomalyHot; ctx.lineWidth = 1;
    ctx.globalAlpha = phaseGlow * corePulse;
    ctx.beginPath();
    ctx.arc(0, 0, lensR * 1.45, tick * 0.09, tick * 0.09 + Math.PI * 0.9);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // Bright lens core
    const cg = ctx.createRadialGradient(0, 0, 1, 0, 0, lensR);
    cg.addColorStop(0, '#ffffff');
    cg.addColorStop(0.4, anomaly);
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.globalAlpha = phaseGlow * (0.7 + corePulse * 0.3);
    ctx.beginPath(); ctx.arc(0, 0, lensR, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // ════ WEAPON FACETS ════

    // L/R LOWER PLASMA facets — diamond mounts
    for (const s of [1, -1]) {
      const px = s * W * 0.26, py = H * 0.30;
      ctx.fillStyle = hullDarkest;
      ctx.beginPath();
      ctx.moveTo(px, py - W * 0.04);
      ctx.lineTo(px + W * 0.04, py);
      ctx.lineTo(px, py + W * 0.04);
      ctx.lineTo(px - W * 0.04, py);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8844ff';
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(px, py, W * 0.018, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // L/R UPPER PHASER facets — narrow rectangular emitters
    for (const s of [1, -1]) {
      const ex = s * W * 0.30, ey = -H * 0.10;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ex - W * 0.025, ey - H * 0.04, W * 0.05, H * 0.08);
      ctx.fillStyle = anomaly;
      ctx.globalAlpha = phaseGlow * 0.7;
      ctx.fillRect(ex - W * 0.014, ey - H * 0.025, W * 0.028, H * 0.05);
      ctx.globalAlpha = 1;
    }

    // L/R OUTER MISSILE facets — boxy launchers on the outer hex points
    for (const s of [1, -1]) {
      const mx = s * W * 0.40, my = -H * 0.30;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mx - W * 0.05, my - H * 0.04, W * 0.10, H * 0.08);
      // Two tube ports
      ctx.fillStyle = '#3344aa';
      for (let t = -1; t <= 1; t += 2) {
        ctx.fillRect(mx + t * W * 0.022 - W * 0.012, my - H * 0.02, W * 0.024, H * 0.05);
      }
      ctx.fillStyle = anomaly;
      ctx.globalAlpha = phaseGlow * 0.7;
      for (let t = -1; t <= 1; t += 2) {
        ctx.beginPath();
        ctx.arc(mx + t * W * 0.022, my - H * 0.005, W * 0.007, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Bright contour outline ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    outerHex(); ctx.stroke();
  }

  // ── 6. RIFT SOVEREIGN — Romulan elite, slender raptor ────────────
  // ── 6. RIFT SOVEREIGN — D'deridex-style Romulan elite ───────────
  // Twin curved pincer wings sweeping forward with a central command pod
  // nestled between them. The iconic D'deridex silhouette. Mint-emerald
  // Romulan palette, slightly cooler than Marauder's warmer green, with
  // imperial filigree (chevron ribs running down the wings).
  private bossHullSovereign(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#0a1a14';
    const hullDark    = '#1a2e26';
    const hullMid     = '#2a4a3c';
    const hullLight   = '#446e58';
    const hullAccent  = '#8ab5a0';
    const conduit     = '#44ff88';
    const conduitHot  = '#aaffcc';
    const conduitDim  = '#0c3a22';
    const corePulse = 0.6 + Math.sin(tick * 0.08) * 0.3;
    const phaseGlow = 0.5 + phase * 0.14;

    // ── Pincer wing silhouette: right wing + central pod, mirrored ──
    // Each wing is a curved arc reaching forward (downward toward player)
    // with a feathered trailing edge.
    const half: [number, number][] = [
      [0.02, -0.50],  // tail-center (boss rear)
      [0.10, -0.46],
      [0.18, -0.42],  // upper wing root
      [0.28, -0.36],  // shoulder
      [0.42, -0.26],  // upper wing peak
      [0.48, -0.08],
      [0.50,  0.08],  // outermost wing edge
      [0.48,  0.20],  // lower wing curve
      [0.42,  0.32],
      [0.32,  0.40],  // forward wing tip
      [0.22,  0.42],  // inner-wing inward curve
      [0.14,  0.34],  // gap edge (between wing and pod)
      [0.10,  0.20],  // inner wing root
      [0.07,  0.06],  // pod shoulder
      [0.10,  0.30],  // pod base flank
      [0.06,  0.46],  // pod tip (faces player)
      [0.00,  0.50],  // pod prow tip
    ];
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(half[0][0] * W, half[0][1] * H);
      for (let i = 1; i < half.length; i++) ctx.lineTo(half[i][0] * W, half[i][1] * H);
      for (let i = half.length - 2; i >= 1; i--) ctx.lineTo(-half[i][0] * W, half[i][1] * H);
      ctx.closePath();
    };

    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    trace(); ctx.fill();

    // ── Wing armor plating — inset mid-tone panels per wing ──
    ctx.fillStyle = hullMid;
    for (const s of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(s * W * 0.18, -H * 0.36);
      ctx.lineTo(s * W * 0.40, -H * 0.20);
      ctx.lineTo(s * W * 0.42,  H * 0.04);
      ctx.lineTo(s * W * 0.36,  H * 0.24);
      ctx.lineTo(s * W * 0.24,  H * 0.32);
      ctx.lineTo(s * W * 0.16,  H * 0.18);
      ctx.lineTo(s * W * 0.14, -H * 0.10);
      ctx.closePath(); ctx.fill();
    }

    // ── Imperial chevron ribs down each wing's leading edge ──
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 2;
    for (const s of [1, -1]) {
      for (let r = 0; r < 5; r++) {
        const t = r / 5;
        ctx.beginPath();
        ctx.moveTo(s * W * (0.18 + t * 0.24), -H * (0.34 - t * 0.40));
        ctx.lineTo(s * W * (0.30 + t * 0.20), -H * (0.20 - t * 0.32));
        ctx.stroke();
      }
    }

    // ── Central command pod — vertical elongated shape ──
    ctx.fillStyle = hullLight;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.50);          // prow tip (player side)
    ctx.lineTo(W * 0.06, H * 0.42);
    ctx.lineTo(W * 0.08, H * 0.05);
    ctx.lineTo(W * 0.07, -H * 0.30);
    ctx.lineTo(0, -H * 0.46);
    ctx.lineTo(-W * 0.07, -H * 0.30);
    ctx.lineTo(-W * 0.08, H * 0.05);
    ctx.lineTo(-W * 0.06, H * 0.42);
    ctx.closePath(); ctx.fill();

    // ── Bridge eye (iconic D'deridex amber/green oval) ──
    const eyeGrad = ctx.createRadialGradient(0, -H * 0.08, 1, 0, -H * 0.08, W * 0.05);
    eyeGrad.addColorStop(0, conduitHot);
    eyeGrad.addColorStop(0.5, conduit);
    eyeGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = eyeGrad;
    ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, -H * 0.08, W * 0.05, H * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Spine conduit running the pod ──
    ctx.strokeStyle = conduitDim; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, H * 0.36); ctx.lineTo(0, -H * 0.36); ctx.stroke();
    ctx.strokeStyle = conduit; ctx.lineWidth = 2;
    ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.4);
    ctx.beginPath(); ctx.moveTo(0, H * 0.36); ctx.lineTo(0, -H * 0.36); ctx.stroke();
    ctx.globalAlpha = 1;

    // ── Tail engines (top edge) ──
    for (const s of [1, -1]) {
      const ex = s * W * 0.05, ey = -H * 0.46;
      const eg = ctx.createRadialGradient(ex, ey, 1, ex, ey, W * 0.08);
      eg.addColorStop(0, conduit);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg; ctx.globalAlpha = 0.55 + Math.sin(tick * 0.18 + s) * 0.2;
      ctx.beginPath(); ctx.arc(ex, ey, W * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ════ WEAPON SYSTEMS ════

    // 1. IMPERIAL LANCE — central pod forward, prominent barrel
    {
      const lx = 0, ly = H * 0.18;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(lx - W * 0.04, ly, W * 0.08, H * 0.26);
      // Cooling fins
      ctx.fillStyle = hullLight;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(lx - W * 0.055, ly + H * 0.06 + i * H * 0.08, W * 0.11, H * 0.015);
      }
      // Muzzle glow
      ctx.fillStyle = conduitHot;
      ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(lx, ly + H * 0.26, W * 0.03, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 2. L/R UPPER WING DISRUPTORS — at the inner upper edge
    for (const s of [1, -1]) {
      const ux = s * W * 0.18, uy = -H * 0.16;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ux - W * 0.025, uy - H * 0.03, W * 0.05, H * 0.14);
      ctx.fillStyle = hullLight;
      ctx.fillRect(ux - W * 0.025, uy - H * 0.03, W * 0.05, H * 0.025);
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(ux, uy + H * 0.10, W * 0.014, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. L/R LOWER WING PLASMA TURRETS — at the outer mid-wing
    for (const s of [1, -1]) {
      const px = s * W * 0.40, py = H * 0.06;
      ctx.fillStyle = hullDarkest;
      ctx.beginPath();
      ctx.arc(px, py, W * 0.050, Math.PI, Math.PI * 2);
      ctx.lineTo(px + W * 0.050, py);
      ctx.lineTo(px - W * 0.050, py);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hullLight;
      ctx.beginPath(); ctx.arc(px, py, W * 0.034, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(px, py - W * 0.008, W * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 4. L/R TAIL PHASER BATTERIES — at the rear shoulder
    for (const s of [1, -1]) {
      const tx = s * W * 0.28, ty = -H * 0.42;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(tx - W * 0.05, ty - H * 0.02, W * 0.10, H * 0.06);
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * 0.7;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(tx + i * W * 0.025, ty + H * 0.015, W * 0.008, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Bright contour outline ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    trace(); ctx.stroke();
  }

  // ── 7. FORTRESS COMMAND — Orion brutalist station ────────────────
  // ── 7. FORTRESS COMMAND — Orion brutalist mobile citadel ─────────
  // Massive blocky armored fortress. Regimented, military, distinct from
  // Flagship's mismatched pirate aesthetic. Tiered armor decks, central
  // command bunker, prominent bombardment barrel.
  private bossHullFortress(ctx: CanvasRenderingContext2D, W: number, H: number, _color: string, _dk: string, _md: string, tick: number, phase: number) {
    const hullDarkest = '#1a1410';
    const hullDark    = '#36281c';
    const hullMid     = '#54402c';
    const hullLight   = '#74583c';
    const hullAccent  = '#bc9858';
    const conduit     = '#ffaa22';
    const conduitHot  = '#ffd060';
    const conduitDim  = '#4a2a08';
    const corePulse = 0.6 + Math.sin(tick * 0.07) * 0.3;
    const phaseGlow = 0.5 + phase * 0.13;

    // ── Silhouette: tiered brutalist citadel — wide stepped shoulders ──
    const half: [number, number][] = [
      [0.00,  0.50],  // bottom prow (player-facing)
      [0.16,  0.46],
      [0.30,  0.40],  // bottom step (turret bays)
      [0.42,  0.36],
      [0.50,  0.24],  // mid flank (broadest)
      [0.52,  0.08],
      [0.50, -0.10],
      [0.48, -0.24],
      [0.46, -0.40],  // upper shoulder (AA mount)
      [0.36, -0.46],
      [0.22, -0.50],
      [0.10, -0.50],
      [0.00, -0.46],
    ];
    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(half[0][0] * W, half[0][1] * H);
      for (let i = 1; i < half.length; i++) ctx.lineTo(half[i][0] * W, half[i][1] * H);
      for (let i = half.length - 2; i >= 1; i--) ctx.lineTo(-half[i][0] * W, half[i][1] * H);
      ctx.closePath();
    };

    ctx.globalAlpha = 1;
    ctx.fillStyle = hullDark;
    trace(); ctx.fill();

    // ── Layered horizontal deck plates — regimented tiers ──
    ctx.fillStyle = hullMid;
    const deckYs = [-0.30, -0.10, 0.10, 0.30];
    for (const dy of deckYs) {
      const widthPct = 0.48 - Math.abs(dy) * 0.10;
      ctx.fillRect(-W * widthPct, dy * H - H * 0.025, W * widthPct * 2, H * 0.05);
    }
    // Panel seam vertical lines (military grid)
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    for (const x of [-0.36, -0.20, -0.06, 0.06, 0.20, 0.36]) {
      ctx.beginPath();
      ctx.moveTo(x * W, -H * 0.44);
      ctx.lineTo(x * W,  H * 0.40);
      ctx.stroke();
    }
    // Horizontal armor seams
    for (const y of [-0.18, 0.02, 0.22]) {
      ctx.beginPath();
      ctx.moveTo(-W * 0.46, y * H);
      ctx.lineTo( W * 0.46, y * H);
      ctx.stroke();
    }

    // ── Crenellation crown on the upper hull (the "fortress" silhouette) ──
    ctx.fillStyle = hullLight;
    for (let i = -3; i <= 3; i++) {
      ctx.fillRect(i * W * 0.11 - W * 0.038, -H * 0.50, W * 0.076, H * 0.06);
    }
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) {
      ctx.strokeRect(i * W * 0.11 - W * 0.038, -H * 0.50, W * 0.076, H * 0.06);
    }

    // ── Central command bunker — fortified rectangular core ──
    ctx.fillStyle = hullLight;
    ctx.fillRect(-W * 0.13, -H * 0.40, W * 0.26, H * 0.30);
    // Bunker viewports (slit windows)
    ctx.fillStyle = conduit;
    ctx.globalAlpha = 0.6 + Math.sin(tick * 0.08) * 0.25;
    for (let i = -1; i <= 1; i++) {
      ctx.fillRect(i * W * 0.06 - W * 0.025, -H * 0.30, W * 0.05, H * 0.018);
      ctx.fillRect(i * W * 0.06 - W * 0.025, -H * 0.20, W * 0.05, H * 0.018);
    }
    ctx.globalAlpha = 1;
    // Bunker outline
    ctx.strokeStyle = hullDarkest; ctx.lineWidth = 2;
    ctx.strokeRect(-W * 0.13, -H * 0.40, W * 0.26, H * 0.30);

    // ── Heavy rear engines ──
    for (let i = -1; i <= 1; i++) {
      const ex = i * W * 0.18, ey = -H * 0.50;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(ex - W * 0.05, ey, W * 0.10, H * 0.08);
      const eg = ctx.createRadialGradient(ex, ey, 1, ex, ey, W * 0.08);
      eg.addColorStop(0, conduit);
      eg.addColorStop(1, 'transparent');
      ctx.fillStyle = eg;
      ctx.globalAlpha = 0.55 + Math.sin(tick * 0.18 + i) * 0.2;
      ctx.beginPath(); ctx.arc(ex, ey, W * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Rivets / armor studs along the seams ──
    ctx.fillStyle = hullAccent;
    ctx.globalAlpha = 0.6;
    for (let r = -3; r <= 3; r++) {
      for (let c = -1; c <= 1; c++) {
        const rx = r * W * 0.11;
        const ry = c * H * 0.20;
        ctx.fillRect(rx - 1.2, ry - 1.2, 2.4, 2.4);
      }
    }
    ctx.globalAlpha = 1;

    // ════ WEAPON SYSTEMS ════

    // 1. CENTRAL BOMBARDMENT CANNON — huge prominent barrel
    {
      const mx = 0, my = H * 0.20;
      // Mounting bracket
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mx - W * 0.12, my - H * 0.06, W * 0.24, H * 0.12);
      ctx.fillStyle = hullAccent;
      ctx.fillRect(mx - W * 0.12, my - H * 0.06, W * 0.24, H * 0.025);
      // Massive barrel
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mx - W * 0.06, my, W * 0.12, H * 0.30);
      // Cooling fins
      ctx.fillStyle = hullLight;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(mx - W * 0.08, my + H * 0.05 + i * H * 0.07, W * 0.16, H * 0.015);
      }
      // Muzzle glow
      ctx.fillStyle = conduitHot;
      ctx.globalAlpha = phaseGlow * (0.6 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(mx, my + H * 0.32, W * 0.045, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 2. L/R HEAVY DISRUPTORS — forward-mounted twin barrels
    for (const s of [1, -1]) {
      const dx = s * W * 0.22, dy = H * 0.32;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(dx - W * 0.04, dy - H * 0.04, W * 0.08, H * 0.16);
      ctx.fillStyle = hullLight;
      ctx.fillRect(dx - W * 0.04, dy - H * 0.04, W * 0.08, H * 0.025);
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.45);
      ctx.beginPath(); ctx.arc(dx, dy + H * 0.12, W * 0.02, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. L/R MISSILE BAYS — large boxy launchers (4-tube each)
    for (const s of [1, -1]) {
      const mrx = s * W * 0.40, mry = H * 0.10;
      ctx.fillStyle = hullDarkest;
      ctx.fillRect(mrx - W * 0.08, mry - H * 0.06, W * 0.16, H * 0.14);
      // 4 tubes (2x2 grid)
      ctx.fillStyle = conduitDim;
      for (let row = 0; row < 2; row++) {
        for (let col = -1; col <= 1; col += 2) {
          ctx.fillRect(
            mrx + col * W * 0.03 - W * 0.014,
            mry - H * 0.04 + row * H * 0.06,
            W * 0.028, H * 0.05
          );
        }
      }
      // Loaded glow
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * 0.7;
      for (let row = 0; row < 2; row++) {
        for (let col = -1; col <= 1; col += 2) {
          ctx.beginPath();
          ctx.arc(
            mrx + col * W * 0.03,
            mry - H * 0.025 + row * H * 0.06,
            W * 0.006, 0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // 4. L/R AA PHASER BATTERIES — rear shoulder mounts
    for (const s of [1, -1]) {
      const ax = s * W * 0.34, ay = -H * 0.34;
      // Turret base
      ctx.fillStyle = hullDarkest;
      ctx.beginPath();
      ctx.arc(ax, ay, W * 0.045, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hullLight;
      ctx.beginPath();
      ctx.arc(ax, ay, W * 0.030, 0, Math.PI * 2); ctx.fill();
      // Twin barrels pointing forward
      ctx.fillStyle = hullDarkest;
      for (const off of [-W * 0.012, W * 0.012]) {
        ctx.fillRect(ax + off - W * 0.005, ay, W * 0.010, H * 0.08);
      }
      ctx.fillStyle = conduit;
      ctx.globalAlpha = phaseGlow * (0.55 + corePulse * 0.4);
      ctx.beginPath(); ctx.arc(ax, ay - W * 0.008, W * 0.010, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Bright contour outline ──
    ctx.strokeStyle = hullAccent;
    ctx.lineWidth = 2.5;
    trace(); ctx.stroke();
  }

  // ── 8. SINGULARITY DREADNOUGHT — Klingon late-game, jagged ───────
  private bossHullSingularityDread(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, phase: number) {
    // Jagged predatory silhouette
    ctx.fillStyle = dk;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.5);
    ctx.lineTo(-W * 0.18, -H * 0.35);
    ctx.lineTo(-W * 0.55, -H * 0.05);
    ctx.lineTo(-W * 0.42, H * 0.12);
    ctx.lineTo(-W * 0.6, H * 0.25);
    ctx.lineTo(-W * 0.3, H * 0.42);
    ctx.lineTo(-W * 0.1, H * 0.3);
    ctx.lineTo(0, H * 0.5);
    ctx.lineTo(W * 0.1, H * 0.3);
    ctx.lineTo(W * 0.3, H * 0.42);
    ctx.lineTo(W * 0.6, H * 0.25);
    ctx.lineTo(W * 0.42, H * 0.12);
    ctx.lineTo(W * 0.55, -H * 0.05);
    ctx.lineTo(W * 0.18, -H * 0.35);
    ctx.closePath(); ctx.fill();
    // Core spine
    ctx.fillStyle = md;
    ctx.beginPath();
    ctx.ellipse(0, 0, W * 0.12, H * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    // Singularity reactor (mid)
    const sp = 0.65 + Math.sin(tick * 0.09) * 0.25;
    ctx.fillStyle = color; ctx.globalAlpha = sp;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = sp * 0.8;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // Wing-tip + nose ports
    this.bossPort(ctx, -W * 0.55, -H * 0.05, 5, color, tick, phase);
    this.bossPort(ctx, W * 0.55, -H * 0.05, 5, color, tick, phase);
    this.bossPort(ctx, -W * 0.6, H * 0.25, 4, color, tick, phase);
    this.bossPort(ctx, W * 0.6, H * 0.25, 4, color, tick, phase);
    this.bossPort(ctx, 0, H * 0.48, 6, color, tick, phase);
  }

  // ── 9. EVENT HORIZON TYRANT — black-hole shrouded warship ────────
  private bossHullVoidTyrant(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, phase: number) {
    // Event horizon halo (drawn first behind everything)
    const haloG = ctx.createRadialGradient(0, 0, W * 0.25, 0, 0, W * 0.65);
    haloG.addColorStop(0, 'rgba(160,40,255,0.45)');
    haloG.addColorStop(0.5, 'rgba(60,10,80,0.25)');
    haloG.addColorStop(1, 'transparent');
    ctx.fillStyle = haloG;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.65, 0, Math.PI * 2); ctx.fill();
    // Outer dark armor (lobed)
    ctx.fillStyle = dk;
    ctx.beginPath();
    const lobes = 8;
    for (let i = 0; i < lobes * 2; i++) {
      const a = (Math.PI * 2 / (lobes * 2)) * i - Math.PI / 2;
      const r = (i % 2 === 0 ? 0.5 : 0.38) * Math.min(W, H);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * (H / W);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // Mid ring
    ctx.fillStyle = md;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.28, 0, Math.PI * 2); ctx.fill();
    // Pure black core (the event horizon)
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, W * 0.16, 0, Math.PI * 2); ctx.fill();
    // Accretion ring around the black core
    const ap = 0.7 + Math.sin(tick * 0.1) * 0.25;
    ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.globalAlpha = ap;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.19, tick * 0.06, tick * 0.06 + Math.PI * 1.7); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.globalAlpha = ap * 0.6;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.22, -tick * 0.04, -tick * 0.04 + Math.PI * 1.3); ctx.stroke();
    ctx.globalAlpha = 1;
    // Lobe-tip cannons
    for (let i = 0; i < lobes; i++) {
      const a = (Math.PI * 2 / lobes) * i - Math.PI / 2;
      this.bossPort(ctx, Math.cos(a) * W * 0.5, Math.sin(a) * H * 0.48, 4, color, tick, phase);
    }
  }

  // ── 10. PHASE WRAITH — Romulan, ethereal/cloaked ─────────────────
  private bossHullWraith(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, phase: number) {
    // Ghostly outer halo (shifts in and out of phase)
    const cloak = 0.5 + Math.sin(tick * 0.04) * 0.3;
    ctx.globalAlpha = cloak;
    // Outer spectral wings
    ctx.fillStyle = dk;
    ctx.beginPath();
    ctx.moveTo(0, -H * 0.5);
    ctx.quadraticCurveTo(-W * 0.25, -H * 0.45, -W * 0.55, -H * 0.1);
    ctx.quadraticCurveTo(-W * 0.5, H * 0.1, -W * 0.4, H * 0.4);
    ctx.quadraticCurveTo(-W * 0.2, H * 0.5, 0, H * 0.42);
    ctx.quadraticCurveTo(W * 0.2, H * 0.5, W * 0.4, H * 0.4);
    ctx.quadraticCurveTo(W * 0.5, H * 0.1, W * 0.55, -H * 0.1);
    ctx.quadraticCurveTo(W * 0.25, -H * 0.45, 0, -H * 0.5);
    ctx.closePath(); ctx.fill();
    // Inner body
    ctx.fillStyle = md;
    ctx.beginPath();
    ctx.ellipse(0, 0, W * 0.18, H * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // Phasing core — never fully visible
    const cpulse = 0.5 + Math.sin(tick * 0.11) * 0.3;
    ctx.fillStyle = color; ctx.globalAlpha = cpulse;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.1, 0, Math.PI * 2); ctx.fill();
    // Spectral wisps trailing behind
    ctx.fillStyle = color; ctx.globalAlpha = 0.25;
    for (let i = 0; i < 5; i++) {
      const wy = H * 0.5 + i * 6;
      const wx = Math.sin(tick * 0.05 + i) * W * 0.2;
      ctx.beginPath(); ctx.ellipse(wx, wy, W * 0.05 - i * 1.5, H * 0.04 - i * 1, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.bossPort(ctx, -W * 0.5, 0, 4, color, tick, phase);
    this.bossPort(ctx, W * 0.5, 0, 4, color, tick, phase);
    this.bossPort(ctx, 0, -H * 0.4, 5, color, tick, phase);
  }

  // ── 11. OMEGA SUPREME — final boss, layered fortress + halo ──────
  private bossHullOmega(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, dk: string, md: string, tick: number, phase: number) {
    // Outer halo
    const halo = ctx.createRadialGradient(0, 0, W * 0.3, 0, 0, W * 0.7);
    halo.addColorStop(0, 'rgba(255,170,30,0.4)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.7, 0, Math.PI * 2); ctx.fill();
    // Outer ring of armor lobes (8-pointed star)
    ctx.fillStyle = dk;
    ctx.beginPath();
    const pts = 16;
    for (let i = 0; i < pts; i++) {
      const a = (Math.PI * 2 / pts) * i - Math.PI / 2;
      const r = (i % 2 === 0 ? 0.55 : 0.4) * Math.min(W, H);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * (H / W);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // Inner armored body
    ctx.fillStyle = md;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.28, 0, Math.PI * 2); ctx.fill();
    // Command core
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, W * 0.16, 0, Math.PI * 2); ctx.fill();
    // Pulsing omega symbol — concentric rings
    const op = 0.7 + Math.sin(tick * 0.08) * 0.25;
    for (let r = 0; r < 3; r++) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5 - r * 0.5;
      ctx.globalAlpha = op * (1 - r * 0.2);
      ctx.beginPath(); ctx.arc(0, 0, W * (0.08 + r * 0.04), tick * (0.03 + r * 0.01), tick * (0.03 + r * 0.01) + Math.PI * 1.6); ctx.stroke();
    }
    // White-hot core
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = op * 0.8;
    ctx.beginPath(); ctx.arc(0, 0, W * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // 8 cannons around the outer star points
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i - Math.PI / 2;
      this.bossPort(ctx, Math.cos(a) * W * 0.5, Math.sin(a) * H * 0.48, 5, color, tick, phase);
    }
  }

  private drawPowerUpIcon(ctx: CanvasRenderingContext2D, x: number, y: number, type: PowerUpType, tick: number): void {
    const color = POWERUP_COLORS[type];
    const pulse = 0.85 + Math.sin(tick * 0.08 + x * 0.05) * 0.15;
    const bob = Math.sin(tick * 0.05 + x * 0.03) * 1.5;
    const yy = y + bob;

    ctx.save();
    ctx.translate(x, yy);

    // Soft aura (every type) — subtle, no flat circle
    const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
    auraGrad.addColorStop(0, color);
    auraGrad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.25 * pulse;
    ctx.fillStyle = auraGrad;
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    switch (type) {
      case 'weapon': {
        // Crystal energy capsule — vertical hexagonal prism
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(6, -6); ctx.lineTo(6, 6);
        ctx.lineTo(0, 11);
        ctx.lineTo(-6, 6); ctx.lineTo(-6, -6);
        ctx.closePath(); ctx.fill();
        // Inner facet highlight
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(3, -5); ctx.lineTo(3, 5); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill();
        // Edge stroke
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -11); ctx.lineTo(6, -6); ctx.lineTo(6, 6); ctx.lineTo(0, 11);
        ctx.lineTo(-6, 6); ctx.lineTo(-6, -6); ctx.closePath(); ctx.stroke();
        break;
      }
      case 'shield': {
        // Heraldic shield — pointed bottom, rounded top
        ctx.fillStyle = color; ctx.globalAlpha = 0.85 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(9, -10, 9, -3);
        ctx.quadraticCurveTo(9, 7, 0, 12);
        ctx.quadraticCurveTo(-9, 7, -9, -3);
        ctx.quadraticCurveTo(-9, -10, 0, -10);
        ctx.closePath(); ctx.fill();
        // Inner highlight
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.quadraticCurveTo(5, -7, 5, -2);
        ctx.quadraticCurveTo(5, 4, 0, 7); ctx.closePath(); ctx.fill();
        // Cross emblem
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.75;
        ctx.fillRect(-1, -4, 2, 8);
        ctx.fillRect(-3.5, -1, 7, 2);
        break;
      }
      case 'bomb': {
        // Spherical bomb with lit fuse
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.arc(0, 1, 9, 0, Math.PI * 2); ctx.fill();
        // Highlight
        ctx.fillStyle = '#444'; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(-3, -2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        // Fuse
        ctx.strokeStyle = '#886644'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(3, -7); ctx.quadraticCurveTo(7, -10, 5, -12); ctx.stroke();
        // Spark at fuse tip
        const sparkR = 2 + Math.sin(tick * 0.4) * 1.5;
        ctx.fillStyle = '#ffaa00';
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(5, -12, sparkR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(5, -12, sparkR * 0.4, 0, Math.PI * 2); ctx.fill();
        // Bomb glint
        ctx.fillStyle = color; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(2, 4, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'magnet': {
        // Horseshoe magnet
        ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'butt';
        ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.arc(0, 1, 7, Math.PI, 0, false);
        ctx.stroke();
        // Pole tips (silver)
        ctx.fillStyle = '#ddd'; ctx.globalAlpha = 0.9;
        ctx.fillRect(-9, 1, 4, 5);
        ctx.fillRect(5, 1, 4, 5);
        // Magnetic field lines
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.35 + Math.sin(tick * 0.15) * 0.2;
        for (let i = 0; i < 3; i++) {
          const r = 11 + i * 2.5;
          ctx.beginPath();
          ctx.arc(0, 1, r, Math.PI * 1.15, Math.PI * 1.85, true);
          ctx.stroke();
        }
        break;
      }
      case 'missile': {
        // Stylized rocket
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(4, -3); ctx.lineTo(4, 7); ctx.lineTo(-4, 7); ctx.lineTo(-4, -3);
        ctx.closePath(); ctx.fill();
        // Nose cone
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -11); ctx.lineTo(2, -5); ctx.lineTo(-2, -5); ctx.closePath(); ctx.fill();
        // Fins
        ctx.fillStyle = this.darkenColor(color, 0.6); ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(-8, 9); ctx.lineTo(-4, 9); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(8, 9); ctx.lineTo(4, 9); ctx.closePath(); ctx.fill();
        // Exhaust flame
        ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.6 + Math.sin(tick * 0.3) * 0.3;
        ctx.beginPath();
        ctx.moveTo(-2, 7); ctx.lineTo(0, 11 + Math.sin(tick * 0.5)); ctx.lineTo(2, 7); ctx.closePath(); ctx.fill();
        // Center stripe
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.55;
        ctx.fillRect(-0.7, -2, 1.4, 7);
        break;
      }
      case 'laser': {
        // Diamond prism with internal beam
        ctx.fillStyle = color; ctx.globalAlpha = 0.85 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -11); ctx.lineTo(8, 0); ctx.lineTo(0, 11); ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill();
        // Inner refraction highlight
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -7); ctx.lineTo(4, 0); ctx.lineTo(0, 7); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill();
        // Beam shaft through center
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 11); ctx.stroke();
        // Edge highlight
        ctx.strokeStyle = color; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -11); ctx.lineTo(8, 0); ctx.lineTo(0, 11); ctx.lineTo(-8, 0); ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'phaser': {
        // Triangular beam emitter pointing forward
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(10, 8); ctx.lineTo(-10, 8); ctx.closePath();
        ctx.fill();
        // Inner detail
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(0, -6); ctx.lineTo(6, 5); ctx.lineTo(-6, 5); ctx.closePath(); ctx.fill();
        // Vent lines
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(-5, 4); ctx.lineTo(5, 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-7, 7); ctx.lineTo(7, 7); ctx.stroke();
        // Emitter glow at tip
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.7 + Math.sin(tick * 0.2) * 0.2;
        ctx.beginPath(); ctx.arc(0, -8, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'life': {
        // Pulsing heart-shaped gem
        const beat = 1 + Math.sin(tick * 0.18) * 0.08;
        ctx.scale(beat, beat);
        ctx.fillStyle = color; ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.bezierCurveTo(-12, 0, -10, -10, -4, -8);
        ctx.bezierCurveTo(-2, -7, 0, -4, 0, -4);
        ctx.bezierCurveTo(0, -4, 2, -7, 4, -8);
        ctx.bezierCurveTo(10, -10, 12, 0, 0, 10);
        ctx.closePath(); ctx.fill();
        // Highlight
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.ellipse(-3, -4, 2, 3, -0.5, 0, Math.PI * 2); ctx.fill();
        // Edge
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.bezierCurveTo(-12, 0, -10, -10, -4, -8);
        ctx.bezierCurveTo(-2, -7, 0, -4, 0, -4);
        ctx.bezierCurveTo(0, -4, 2, -7, 4, -8);
        ctx.bezierCurveTo(10, -10, 12, 0, 0, 10);
        ctx.closePath(); ctx.stroke();
        break;
      }
      case 'emp': {
        // Lightning bolt
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(3, -11);
        ctx.lineTo(-5, 1);
        ctx.lineTo(0, 1);
        ctx.lineTo(-3, 11);
        ctx.lineTo(6, -2);
        ctx.lineTo(1, -2);
        ctx.lineTo(3, -11);
        ctx.closePath(); ctx.fill();
        // Inner glow
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(3, -11); ctx.lineTo(-3, 0); ctx.lineTo(2, 0); ctx.lineTo(-2, 9);
        ctx.lineTo(4, -1); ctx.lineTo(0, -1); ctx.lineTo(3, -11);
        ctx.closePath(); ctx.fill();
        // Edge crackle
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.4 + Math.sin(tick * 0.4) * 0.3;
        ctx.beginPath();
        ctx.moveTo(3, -11); ctx.lineTo(-5, 1); ctx.lineTo(0, 1); ctx.lineTo(-3, 11);
        ctx.lineTo(6, -2); ctx.lineTo(1, -2); ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'overdrive': {
        // Flame
        const flicker = Math.sin(tick * 0.25);
        ctx.fillStyle = color; ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.quadraticCurveTo(7, -6, 6, 2);
        ctx.quadraticCurveTo(7 + flicker, 8, 0, 11);
        ctx.quadraticCurveTo(-7 - flicker, 8, -6, 2);
        ctx.quadraticCurveTo(-7, -6, 0, -12);
        ctx.closePath(); ctx.fill();
        // Inner flame
        ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.quadraticCurveTo(4, -3, 3, 3);
        ctx.quadraticCurveTo(4, 7, 0, 9);
        ctx.quadraticCurveTo(-4, 7, -3, 3);
        ctx.quadraticCurveTo(-4, -3, 0, -7);
        ctx.closePath(); ctx.fill();
        // Core
        ctx.fillStyle = '#ffffaa'; ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.ellipse(0, 2, 1.5, 3, 0, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'drone': {
        // Tiny ship icon (4-pointed star ship)
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(3, -2); ctx.lineTo(10, 0); ctx.lineTo(3, 2);
        ctx.lineTo(0, 10); ctx.lineTo(-3, 2); ctx.lineTo(-10, 0); ctx.lineTo(-3, -2);
        ctx.closePath(); ctx.fill();
        // Inner glow
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        // Rotating accents
        const rot = tick * 0.05;
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4;
        for (let i = 0; i < 4; i++) {
          const a = rot + (Math.PI / 2) * i;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * 6, Math.sin(a) * 6, 1, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
      case 'score2x': {
        // ×2 ribbon badge
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.beginPath();
        ctx.moveTo(-11, -3);
        ctx.lineTo(11, -3);
        ctx.lineTo(8, 0);
        ctx.lineTo(11, 3);
        ctx.lineTo(-11, 3);
        ctx.lineTo(-8, 0);
        ctx.closePath(); ctx.fill();
        // Highlight
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3;
        ctx.fillRect(-9, -2, 18, 1.2);
        // ×2 text
        ctx.fillStyle = '#000'; ctx.globalAlpha = 0.9;
        ctx.font = 'bold 9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('×2', 0, 3);
        ctx.textAlign = 'left';
        break;
      }
      case 'crew': {
        // Crew badge — silhouette of two figures behind a captain's chair stripe.
        // A "people" icon to telegraph 'extra crew aboard'.
        // Captain's stripe
        ctx.fillStyle = color; ctx.globalAlpha = 0.9 * pulse;
        ctx.fillRect(-10, -2, 20, 4);
        // Two head silhouettes above the stripe
        ctx.fillStyle = color; ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(-4, -7, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc( 4, -7, 3, 0, Math.PI * 2); ctx.fill();
        // Two shoulders/torsos below
        ctx.beginPath();
        ctx.moveTo(-8, 8); ctx.lineTo(-8, 2); ctx.quadraticCurveTo(-4, -2, 0, 2);
        ctx.quadraticCurveTo(4, -2, 8, 2); ctx.lineTo(8, 8);
        ctx.closePath(); ctx.fill();
        // Highlight on captain's stripe
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4;
        ctx.fillRect(-9, -1, 18, 1);
        break;
      }
    }

    ctx.restore();
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
    const s = Math.min(1, w / 500);
    const fs = Math.max(9, Math.floor(11 * s));

    // ── Bottom-left status panel ── backplate so critical info reads against
    // bright nebula backgrounds. Lives are biggest (most consequential),
    // shields below, then score and combo. The panel auto-sizes to content.
    const panelX = 8;
    const panelY = h - 64;
    const panelW = 140;
    const panelH = 60;
    ctx.fillStyle = 'rgba(6,12,20,0.55)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = 'rgba(120,160,200,0.20)';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Lives — prominent hearts, slightly pulsing when low
    const heartSize = Math.max(13, Math.floor(15 * s));
    ctx.font = `${heartSize}px Courier New`;
    ctx.textAlign = 'left';
    const lowLives = p.lives <= 1;
    const lifePulse = lowLives ? 0.7 + Math.sin(state.tick * 0.18) * 0.3 : 1;
    ctx.fillStyle = lowLives ? '#ff4444' : '#ff8888';
    ctx.globalAlpha = lifePulse;
    ctx.fillText('♥'.repeat(Math.max(0, p.lives)), panelX + 8, panelY + 18);
    ctx.globalAlpha = 1;

    // Shields — distinct row below lives
    if (p.shields > 0) {
      ctx.font = `${Math.max(10, Math.floor(12 * s))}px Courier New`;
      ctx.fillStyle = '#44ff88';
      ctx.globalAlpha = 0.85;
      ctx.fillText('▮'.repeat(Math.max(0, p.shields)), panelX + 8, panelY + 34);
      ctx.globalAlpha = 1;
    }

    // Score
    ctx.font = `${fs}px Courier New`;
    ctx.fillStyle = '#cccccc';
    ctx.fillText(state.score.toLocaleString(), panelX + 8, panelY + 50);

    // Combo (only when active, sits to the right of score)
    if (state.combo > 1) {
      ctx.fillStyle = '#ffdd00';
      const comboGlow = 0.7 + Math.sin(state.tick * 0.2) * 0.3;
      ctx.globalAlpha = comboGlow;
      ctx.fillText(`×${state.combo}`, panelX + 80, panelY + 50);
      ctx.globalAlpha = 1;
    }

    // Right side — coins
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(6,12,20,0.55)';
    ctx.fillRect(w - 70, h - 28, 62, 22);
    ctx.fillStyle = '#ffdd00';
    ctx.font = `${fs + 1}px Courier New`;
    ctx.fillText(`⚡${p.stars}`, w - 14, h - 12);

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

  // ── Live waveform / beat indicator ──
  // Tiny 3-band EQ in the top-left showing live BASS / MID / HIGH energy.
  // Each band flashes when its beat fires, and the bar that fired colors
  // the most recent payload's type so the player can SEE the heartbeat
  // and anticipate what kind of bullets are about to launch.
  private drawWaveformIndicator(ctx: CanvasRenderingContext2D, state: ShmupState): void {
    const baseX = 12;
    const baseY = 90;  // below the existing HUD score readout
    const barW = 6;
    const barH = 28;
    const gap = 5;
    const flash = state.beatFlashTimer / 12;

    const bands: { level: number; label: string; color: string; isLive: boolean }[] = [
      { level: state.bandBass, label: 'B', color: '#ff3366', isLive: state.currentBeatType === 'bass' && flash > 0 },
      { level: state.bandMid,  label: 'M', color: '#ffaa44', isLive: state.currentBeatType === 'mid'  && flash > 0 },
      { level: state.bandHigh, label: 'H', color: '#44ddff', isLive: state.currentBeatType === 'high' && flash > 0 },
    ];

    // Backplate
    const plateW = (barW + gap) * bands.length + 16;
    const plateH = barH + 22;
    ctx.fillStyle = 'rgba(8,14,20,0.55)';
    ctx.fillRect(baseX - 6, baseY - 6, plateW, plateH);
    ctx.strokeStyle = 'rgba(120,160,200,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(baseX - 6 + 0.5, baseY - 6 + 0.5, plateW - 1, plateH - 1);

    // Bars
    for (let i = 0; i < bands.length; i++) {
      const b = bands[i];
      const x = baseX + i * (barW + gap);
      // Dim background bar
      ctx.fillStyle = 'rgba(60,80,100,0.35)';
      ctx.fillRect(x, baseY, barW, barH);
      // Filled portion — live level
      const fill = Math.max(0, Math.min(1, b.level));
      const fy = baseY + barH - barH * fill;
      ctx.fillStyle = b.color;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x, fy, barW, barH * fill);
      ctx.globalAlpha = 1;
      // Flash if this band just fired a payload
      if (b.isLive) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.6 * flash;
        ctx.fillRect(x - 1, baseY - 1, barW + 2, barH + 2);
        ctx.globalAlpha = 1;
      }
      // Label
      ctx.fillStyle = b.isLive ? '#ffffff' : '#aaaaaa';
      ctx.font = 'bold 8px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, x + barW / 2, baseY + barH + 11);
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
      // LOK slot doubles as a phaser charge meter: 5 pips fill as power
      // recharges. Slot lights up only when fully charged and idle (ready to fire).
      {
        icon: '⊕',
        label: 'LOK',
        level: p.lockOnPhaserReady ? Math.round(p.phaserCharge * 5) : 0,
        max: 5,
        color: p.phaserBeamActive ? '#ff5522' : p.phaserCharge >= 0.99 ? '#ff8833' : '#aa6633',
        active: p.lockOnPhaserReady && p.phaserCharge >= 0.99 && !p.phaserBeamActive,
      },
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

    // HP fill — dimmed cyan while subsystems shield the hull, faction
    // color once the hull is exposed
    const boss0 = state.enemies.find(e => e.type === 'boss');
    const shielded = !!boss0?.weakPoints?.some(wp => wp.alive && wp.weaponType);
    if (shielded) {
      // Crosshatch shielded bar
      const shieldGrad = ctx.createLinearGradient(barX, barY, barX + barW * hpPct, barY);
      shieldGrad.addColorStop(0, 'rgba(80,150,200,0.4)');
      shieldGrad.addColorStop(1, 'rgba(120,200,255,0.55)');
      ctx.fillStyle = shieldGrad;
      ctx.fillRect(barX, barY, barW * hpPct, barH);
      // Diagonal hash overlay
      ctx.strokeStyle = 'rgba(180,220,255,0.5)';
      ctx.lineWidth = 1;
      for (let x = 0; x < barW * hpPct; x += 6) {
        ctx.beginPath();
        ctx.moveTo(barX + x, barY);
        ctx.lineTo(barX + x + barH, barY + barH);
        ctx.stroke();
      }
    } else {
      const grad = ctx.createLinearGradient(barX, barY, barX + barW * hpPct, barY);
      grad.addColorStop(0, bossColor);
      grad.addColorStop(1, hpPct < 0.3 ? '#ff2200' : bossColor);
      ctx.fillStyle = grad;
      ctx.fillRect(barX, barY, barW * hpPct, barH);
    }

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
      // While subsystems still shield the hull, swap the name for the
      // shield notice so the player understands why bullets bounce off.
      if (shielded) {
        ctx.fillStyle = '#88ddff';
        ctx.font = 'bold 11px Courier New';
        ctx.fillText('▼ HULL SHIELDED — DISABLE SUBSYSTEMS ▼', w / 2, barY - 8);
      } else {
        ctx.fillStyle = '#ff8888';
        ctx.fillText(`⚠ ${stage.boss.name.toUpperCase()} — HULL EXPOSED ⚠`, w / 2, barY - 8);
      }
    }

    // Weak points remaining
    if (boss?.weakPoints) {
      const total = boss.weakPoints.length;
      // T'VAK and other named-weapon bosses show color-coded subsystem
      // callouts rather than a row of dots.
      const named = boss.weakPoints.filter((wp: any) => wp.weaponType);
      if (named.length > 0) {
        ctx.font = 'bold 9px Courier New';
        const labels: string[] = [];
        for (const wp of named) {
          if (!wp.alive) continue;
          labels.push(wp.label || (wp.weaponType as string).toUpperCase());
        }
        const subY = barY + barH + 14;
        ctx.fillStyle = '#666';
        ctx.fillText('SUBSYSTEMS', w / 2, subY);
        // Render colored chips for each living subsystem in a centered row
        let chipX = 0;
        ctx.font = 'bold 8px Courier New';
        const chips: { text: string; color: string; }[] = [];
        for (const wp of named) {
          if (!wp.alive) continue;
          chips.push({ text: wp.label || '', color: wp.color || '#ffdd00' });
        }
        if (chips.length === 0) {
          ctx.fillStyle = '#664';
          ctx.fillText('ALL SUBSYSTEMS OFFLINE', w / 2, subY + 12);
        } else {
          // Lay out chips
          const padX = 4;
          const widths = chips.map(c => ctx.measureText(c.text).width + padX * 2);
          const totalChipW = widths.reduce((s, x) => s + x + 4, -4);
          let cx = w / 2 - totalChipW / 2;
          for (let i = 0; i < chips.length; i++) {
            const cw = widths[i];
            ctx.fillStyle = chips[i].color;
            ctx.globalAlpha = 0.18;
            ctx.fillRect(cx, subY + 4, cw, 11);
            ctx.globalAlpha = 1;
            ctx.fillStyle = chips[i].color;
            ctx.textAlign = 'center';
            ctx.fillText(chips[i].text, cx + cw / 2, subY + 13);
            cx += cw + 4;
          }
        }
      } else if (total > 0) {
        ctx.font = '9px Courier New';
        const alive = boss.weakPoints.filter((wp: any) => wp.alive).length;
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
    const vt = state.victoryTimer; // frames since boss died

    // ── During flyaway: NO overlay, ship is visible warping off ──
    // The stats panel only appears after the ship has cleared the screen.
    // Flyaway runs ~130 frames; gate stats UI on a small buffer past that.
    const flyawayDone = state.flyawayProgress >= 1;
    if (!flyawayDone) {
      // Just a subtle "speed lines" overlay during flyaway so the player
      // feels the ship is accelerating — no debrief UI yet.
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 24; i++) {
        const sx = (i * 73 + (state.tick * 18) % 1000) % w;
        const sy = ((i * 41 + (state.tick * 30) % h) % h);
        const sh = 6 + state.flyawayProgress * 18;
        ctx.fillRect(sx, sy, 1, sh);
      }
      ctx.globalAlpha = 1;
      return;
    }

    // ── After flyaway: dim the screen and bring the stats card in ──
    const vtPost = vt - 130; // frames since flyaway ended
    const fadeIn = Math.min(1, vtPost / 30);
    ctx.fillStyle = `rgba(0,0,10,${0.78 * fadeIn})`;
    ctx.fillRect(0, 0, w, h);

    // Celebratory rays
    ctx.save();
    ctx.translate(w / 2, h * 0.4);
    ctx.globalAlpha = 0.06 * fadeIn;
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

    // ── Stats panel — animated in over time (vtPost-relative) ──
    ctx.textAlign = 'center';
    ctx.globalAlpha = fadeIn;

    // Title
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00ccff';
    ctx.font = 'bold 32px Courier New';
    ctx.fillText('SECTOR CLEARED', w / 2, h * 0.25);
    ctx.shadowBlur = 0;

    // Stage name
    const stage = state.stages[state.currentStage];
    if (stage) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText(stage.name, w / 2, h * 0.25 + 26);
      ctx.fillStyle = '#88aacc';
      ctx.font = '10px Courier New';
      ctx.fillText(stage.subtitle, w / 2, h * 0.25 + 42);
    }

    // ── Stats card — fixed-width panel centered ──
    const ss = state.stageStats;
    const elapsedFrames = Math.max(0, ss.endTick - ss.startTick);
    const elapsedSec = Math.floor(elapsedFrames / 60);
    const mm = Math.floor(elapsedSec / 60).toString().padStart(2, '0');
    const sss = (elapsedSec % 60).toString().padStart(2, '0');
    const coinsThisStage = ss.finalCoins;

    // Each row reveals one at a time as victoryTimer climbs
    const rows: { label: string; value: string; color: string; revealAt: number }[] = [
      { label: 'TIME',              value: `${mm}:${sss}`,                       color: '#aaccee', revealAt: 30 },
      { label: 'SCORE',             value: state.score.toLocaleString(),         color: '#ffdd00', revealAt: 50 },
      { label: 'ENEMIES DOWN',      value: String(ss.kills),                     color: '#ff8866', revealAt: 70 },
      { label: 'SUBSYSTEMS DESTROYED', value: String(ss.subsystemsDestroyed),    color: '#ff44aa', revealAt: 90 },
      { label: 'SHOTS LANDED',      value: String(ss.shotsHit),                  color: '#44ddff', revealAt: 110 },
      { label: 'DAMAGE TAKEN',      value: String(ss.damageTaken),               color: ss.damageTaken === 0 ? '#44ff44' : '#aa8866', revealAt: 130 },
      { label: 'COINS COLLECTED',   value: `★ ${coinsThisStage}`,                color: '#ffdd00', revealAt: 150 },
    ];

    const cardW = Math.min(420, w * 0.78);
    const cardX = (w - cardW) / 2;
    const rowH = 24;
    const cardY = h * 0.40;
    const cardH = rows.length * rowH + 28;

    // Card background
    ctx.fillStyle = 'rgba(8, 16, 26, 0.85)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = 'rgba(120,200,255,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 0.5, cardY + 0.5, cardW - 1, cardH - 1);
    // Top accent stripe
    ctx.fillStyle = '#00ccff';
    ctx.fillRect(cardX, cardY, cardW, 2);

    // "DEBRIEF" header
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('— STAGE DEBRIEF —', w / 2, cardY + 18);

    // Rows — reveal one at a time based on vtPost (frames since flyaway done)
    ctx.textAlign = 'left';
    ctx.font = '12px Courier New';
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (vtPost < r.revealAt) continue;
      const rowAlpha = Math.min(1, (vtPost - r.revealAt) / 12);
      ctx.globalAlpha = fadeIn * rowAlpha;
      const ry = cardY + 28 + i * rowH + 16;
      // Label
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText(r.label, cardX + 22, ry);
      // Dotted leader
      ctx.fillStyle = '#3a4a5a';
      const labelW = ctx.measureText(r.label).width;
      for (let dx = cardX + 28 + labelW; dx < cardX + cardW - 90; dx += 6) {
        ctx.fillRect(dx, ry - 3, 2, 2);
      }
      // Value
      ctx.fillStyle = r.color;
      ctx.textAlign = 'right';
      ctx.fillText(r.value, cardX + cardW - 22, ry);
      ctx.textAlign = 'left';
    }
    ctx.globalAlpha = fadeIn;

    // Rank computed from score (reveals after all rows)
    if (vtPost >= 170) {
      const rankAlpha = Math.min(1, (vtPost - 170) / 30);
      ctx.globalAlpha = fadeIn * rankAlpha;
      const rank = state.score > 80000 ? 'S' : state.score > 50000 ? 'A' : state.score > 25000 ? 'B' : 'C';
      const rankColor = rank === 'S' ? '#ffdd00' : rank === 'A' ? '#00ccff' : rank === 'B' ? '#44ff44' : '#888888';
      ctx.shadowColor = rankColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = rankColor;
      ctx.font = 'bold 56px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(rank, w / 2, cardY + cardH + 64);
      ctx.shadowBlur = 0;
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#888';
      ctx.fillText('RANK', w / 2, cardY + cardH + 80);
    }

    // Continue prompt — appears after all rows have revealed
    if (vtPost >= 200) {
      ctx.globalAlpha = fadeIn * (0.6 + Math.sin(t * 0.08) * 0.3);
      ctx.fillStyle = '#aaccee';
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS ENTER TO CONTINUE', w / 2, h * 0.93);
    }
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  // ── Next-mission briefing screen ──────────────────────────
  // Shown after the player presses ENTER on the stage debrief. Displays
  // the next stage's primary background image, name, subtitle, and a
  // BEGIN MISSION prompt. ENTER advances into the next stage.
  private drawBriefing(state: ShmupState): void {
    const { ctx, w, h } = this;
    const t = state.tick;
    const nextIdx = Math.min(state.currentStage + 1, state.stages.length - 1);
    const nextStage = state.stages[nextIdx];
    if (!nextStage) return;

    // Same per-stage journey table the gameplay background uses — pick
    // the FIRST scene of the next stage as the briefing backdrop.
    const STAGE_JOURNEYS: number[][] = [
      [0, 7, 6], [2, 5, 3], [1, 6, 4], [0, 7, 5], [2, 4, 3],
      [1, 7, 6], [4, 2, 7], [0, 4, 5], [3, 6, 7], [2, 5, 7], [1, 4, 6],
    ];
    const journey = STAGE_JOURNEYS[nextIdx % STAGE_JOURNEYS.length];
    const bgImg = this.nebulaImgs[journey[0]] || this.nebulaImgs[0];

    // Solid black wipe under the image
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Background image — cover the whole canvas with slight zoom drift
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      const zoom = 1.06 + Math.sin(t * 0.003) * 0.01;
      const iw = bgImg.naturalWidth;
      const ih = bgImg.naturalHeight;
      // Cover fit
      const scale = Math.max(w / iw, h / ih) * zoom;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2 + Math.sin(t * 0.002) * 8;
      const dy = (h - dh) / 2;
      ctx.globalAlpha = 0.55;
      ctx.drawImage(bgImg, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }

    // Top + bottom dark fade so the text reads cleanly over the image
    const topG = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    topG.addColorStop(0, 'rgba(0,0,0,0.85)');
    topG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topG;
    ctx.fillRect(0, 0, w, h * 0.45);
    const botG = ctx.createLinearGradient(0, h * 0.55, 0, h);
    botG.addColorStop(0, 'rgba(0,0,0,0)');
    botG.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = botG;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);

    // Top text — incoming mission label
    ctx.textAlign = 'center';
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText('▸ INCOMING TRANSMISSION ▸', w / 2, h * 0.10);
    ctx.fillStyle = '#aaccdd';
    ctx.font = '10px Courier New';
    ctx.fillText(`STARDATE  ·  SECTOR ${nextIdx + 1} OF ${state.stages.length}`, w / 2, h * 0.13);

    // Big stage name centered upper-third
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Courier New';
    ctx.fillText('NEXT  MISSION', w / 2, h * 0.22);
    ctx.shadowBlur = 0;

    // Stage name + subtitle in the middle band
    ctx.fillStyle = '#ffdd00';
    ctx.font = 'bold 28px Courier New';
    ctx.fillText(nextStage.name, w / 2, h * 0.42);
    ctx.fillStyle = '#bbccdd';
    ctx.font = '14px Courier New';
    ctx.fillText(nextStage.subtitle, w / 2, h * 0.46);

    // Faction indicator
    const factionLabel = (nextStage.faction || 'unknown').toUpperCase();
    ctx.fillStyle = '#ff5566';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText(`⚠ HOSTILE FACTION : ${factionLabel} ⚠`, w / 2, h * 0.50);

    // Boss preview line
    if (nextStage.boss) {
      ctx.fillStyle = '#aaccdd';
      ctx.font = '11px Courier New';
      ctx.fillText(`PROJECTED CAPITAL CLASS: ${nextStage.boss.name}`, w / 2, h * 0.54);
    }

    // Bottom: continue prompt
    ctx.globalAlpha = 0.7 + Math.sin(t * 0.08) * 0.25;
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText('► PRESS ENTER TO BEGIN MISSION ◄', w / 2, h * 0.85);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
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

  private drawSpectrumHighway(ctx: CanvasRenderingContext2D, state: ShmupState, w: number, h: number): void {
    // Skip if no music data or quiet
    if (state.musicIntensity < 0.1) return;

    const t = state.tick;
    const mi = state.musicIntensity;
    const bp = state.beatPulse;
    const bins = 32; // number of frequency bars
    const vanishY = h * 0.05; // vanishing point near top
    const baseY = h * 1.1;   // below screen for perspective depth
    const centerX = w / 2;

    ctx.save();
    ctx.globalAlpha = mi * 0.12 + bp * 0.08; // subtle — music controls visibility

    // Draw 4 depth rows rushing toward viewer
    for (let row = 0; row < 4; row++) {
      const rowDepth = ((state.scrollY * 0.03 + row * 0.25) % 1); // 0-1, scrolling
      const rowY = vanishY + (baseY - vanishY) * rowDepth;
      const spread = rowDepth * w * 0.5; // wider at bottom
      const barMaxH = 40 * rowDepth * mi; // taller at bottom, scales with music
      const rowAlpha = rowDepth * 0.7;

      for (let i = 0; i < bins; i++) {
        const binFrac = (i - bins / 2) / bins;
        const x = centerX + binFrac * spread * 2;
        // Simulate FFT data using music state (since raw data isn't directly in state)
        const barH = barMaxH * (0.3 + Math.sin(i * 0.8 + t * 0.05 + row) * 0.3 + bp * 0.4);
        const barW = Math.max(1, spread / bins * 0.8);

        // Color: hue shifts per bin, brightness from beat
        const hue = (i / bins * 180 + t * 0.3 + state.currentStage * 40) % 360;
        ctx.fillStyle = `hsla(${hue}, 70%, ${40 + bp * 30}%, ${rowAlpha})`;
        ctx.fillRect(x - barW / 2, rowY - barH, barW, barH);
      }
    }

    ctx.restore();
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

    // (removed: per-beat distant orange explosion flashes, nebula lightning
    // flashes, bass-pulse purple throb from bottom, and high-energy corner
    // lens flares. These were all strobing the screen on every beat or
    // intensity threshold and made the game feel like a strobe light.)

    // Background energy wash — very subtle color tint based on intensity.
    // Slow-changing so it doesn't strobe; this just shifts the mood over time.
    const mi = state.musicIntensity;
    if (mi > 0.4) {
      const stage2 = state.stages[state.currentStage];
      const factionTint = stage2?.faction === 'klingon' ? [40,10,5] :
        stage2?.faction === 'romulan' ? [5,30,15] :
        stage2?.faction === 'orion' ? [30,20,5] : [5,15,30];
      ctx.globalAlpha = (mi - 0.4) * 0.04;
      ctx.fillStyle = `rgb(${factionTint[0]},${factionTint[1]},${factionTint[2]})`;
      ctx.fillRect(0, 0, w, h);
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

        case 'debris': {
          // Ship hull fragment — angular metal shard, not a wireframe line
          const R = obj.size;
          ctx.fillStyle = '#2a3540';
          ctx.beginPath();
          ctx.moveTo(-R * 0.9, -R * 0.2);
          ctx.lineTo(R * 0.3, -R * 0.5);
          ctx.lineTo(R * 0.8, 0.1 * R);
          ctx.lineTo(R * 0.2, R * 0.4);
          ctx.lineTo(-R * 0.5, R * 0.6);
          ctx.closePath();
          ctx.fill();
          // Hull plating highlight
          ctx.strokeStyle = '#445a6e';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = obj.opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(-R * 0.7, -R * 0.1); ctx.lineTo(R * 0.4, -R * 0.3); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-R * 0.3, R * 0.2); ctx.lineTo(R * 0.4, R * 0.1); ctx.stroke();
          // Bent edge
          ctx.fillStyle = '#556a7a';
          ctx.globalAlpha = obj.opacity * 0.4;
          ctx.beginPath();
          ctx.moveTo(R * 0.3, -R * 0.5); ctx.lineTo(R * 0.8, 0.1 * R); ctx.lineTo(R * 0.55, -R * 0.2);
          ctx.closePath(); ctx.fill();
          break;
        }

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

        case 'ring': {
          // Planetary ring — banded layers with subtle gradient, no cheesy orange ellipse
          const R = obj.size;
          ctx.globalAlpha = obj.opacity * 0.4;
          for (let band = 0; band < 4; band++) {
            const bandR = R * (0.65 + band * 0.12);
            const bandW = R * 0.04;
            const bandAlpha = 0.7 - band * 0.12;
            ctx.strokeStyle = band % 2 === 0 ? '#6677aa' : '#8899bb';
            ctx.globalAlpha = obj.opacity * bandAlpha * 0.5;
            ctx.lineWidth = bandW;
            ctx.beginPath();
            ctx.ellipse(0, 0, bandR, bandR * 0.18, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Dust glow
          ctx.globalAlpha = obj.opacity * 0.15;
          ctx.strokeStyle = '#aabbdd';
          ctx.lineWidth = R * 0.04;
          ctx.beginPath();
          ctx.ellipse(0, 0, R * 0.85, R * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'satellite': {
          // Detailed comm satellite — main body, solar arrays, dish, antenna
          const S = obj.size;
          // Solar panels (with grid)
          ctx.fillStyle = '#1a2a44';
          ctx.fillRect(-S * 0.75, -S * 0.12, S * 0.5, S * 0.24);
          ctx.fillRect(S * 0.25, -S * 0.12, S * 0.5, S * 0.24);
          // Panel cell grid
          ctx.strokeStyle = '#33558a';
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = obj.opacity * 0.5;
          for (let i = 0; i < 4; i++) {
            const px = -S * 0.75 + (S * 0.5 / 4) * i;
            ctx.beginPath(); ctx.moveTo(px, -S * 0.12); ctx.lineTo(px, S * 0.12); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(S * 0.25 + (S * 0.5 / 4) * i, -S * 0.12);
            ctx.lineTo(S * 0.25 + (S * 0.5 / 4) * i, S * 0.12); ctx.stroke();
          }
          ctx.globalAlpha = obj.opacity;
          // Panel struts
          ctx.strokeStyle = '#556677'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-S * 0.25, 0); ctx.lineTo(-S * 0.18, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(S * 0.18, 0); ctx.lineTo(S * 0.25, 0); ctx.stroke();
          // Main body — boxy
          ctx.fillStyle = '#566878';
          ctx.fillRect(-S * 0.18, -S * 0.22, S * 0.36, S * 0.44);
          // Body detail panels
          ctx.fillStyle = '#3a4854';
          ctx.fillRect(-S * 0.14, -S * 0.18, S * 0.28, S * 0.1);
          ctx.fillRect(-S * 0.14, S * 0.04, S * 0.28, S * 0.14);
          // Dish (parabolic)
          ctx.fillStyle = '#7a8c9c';
          ctx.beginPath();
          ctx.ellipse(0, -S * 0.34, S * 0.18, S * 0.06, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#2a3540';
          ctx.beginPath();
          ctx.ellipse(0, -S * 0.32, S * 0.15, S * 0.04, 0, 0, Math.PI * 2);
          ctx.fill();
          // Dish post
          ctx.strokeStyle = '#445566'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, -S * 0.22); ctx.lineTo(0, -S * 0.32); ctx.stroke();
          // Status light
          ctx.fillStyle = '#44ddff';
          ctx.globalAlpha = obj.opacity * (0.5 + Math.sin(Date.now() * 0.003) * 0.4);
          ctx.beginPath(); ctx.arc(0, S * 0.16, 1.2, 0, Math.PI * 2); ctx.fill();
          break;
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
}
