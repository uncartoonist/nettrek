import {
  GameState, Ship, FACTION_COLORS, Faction, ShipClass, Vec2, GALAXY_SIZE,
  SHIP_CLASS_STATS, RESPAWN_TIME, CLASS_NAMES,
} from '../core/types';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private stars: { x: number; y: number; brightness: number }[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < 300; i++) {
      this.stars.push({
        x: Math.random() * GALAXY_SIZE,
        y: Math.random() * GALAXY_SIZE,
        brightness: 0.2 + Math.random() * 0.5,
      });
    }
  }

  private resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  render(state: GameState): void {
    const { ctx, w, h } = this;
    const cam = state.camera;

    ctx.fillStyle = '#000810';
    ctx.fillRect(0, 0, w, h);

    // Stars
    for (const star of this.stars) {
      const sx = ((star.x - cam.x * 0.3) % w + w) % w;
      const sy = ((star.y - cam.y * 0.3) % h + h) % h;
      ctx.fillStyle = `rgba(255,255,255,${star.brightness})`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    const toScreen = (pos: Vec2): Vec2 => ({
      x: pos.x - cam.x + w / 2,
      y: pos.y - cam.y + h / 2,
    });

    // Planets
    for (const planet of state.planets) {
      const sp = toScreen(planet.pos);
      if (sp.x < -100 || sp.x > w + 100 || sp.y < -100 || sp.y > h + 100) continue;

      const color = planet.owner ? FACTION_COLORS[planet.owner] : '#666';
      const grad = ctx.createRadialGradient(sp.x - 3, sp.y - 3, 2, sp.x, sp.y, 18);
      grad.addColorStop(0, color);
      grad.addColorStop(1, '#111');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 18, 0, Math.PI * 2);
      ctx.fill();

      // Orbit ring for player orbiting
      if (state.player.orbiting === planet.id) {
        ctx.strokeStyle = FACTION_COLORS[state.player.faction];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4 + Math.sin(state.tick * 0.1) * 0.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = '#888';
      ctx.font = '9px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, sp.x, sp.y + 28);
      ctx.fillText(`[${planet.armies}]`, sp.x, sp.y + 38);
    }

    // Explosions
    for (const exp of state.explosions) {
      const sp = toScreen(exp.pos);
      const progress = 1 - exp.ttl / exp.maxTtl;
      for (const p of exp.particles) {
        if (p.life <= 0) continue;
        const px = sp.x + p.dx * (exp.maxTtl - exp.ttl) * 1.5;
        const py = sp.y + p.dy * (exp.maxTtl - exp.ttl) * 1.5;
        const alpha = p.life / 50;
        const r = 255, g = Math.floor(100 + Math.random() * 100), b = 0;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 + (1 - alpha) * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Central flash
      if (progress < 0.3) {
        ctx.fillStyle = `rgba(255,255,200,${0.8 - progress * 2})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 15 + progress * 40, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Torpedoes
    for (const torp of state.torpedoes) {
      const sp = toScreen(torp.pos);
      if (sp.x < -20 || sp.x > w + 20 || sp.y < -20 || sp.y > h + 20) continue;
      ctx.fillStyle = FACTION_COLORS[torp.faction];
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 3, 0, Math.PI * 2);
      ctx.fill();
      // Trail
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(sp.x - torp.vel.x * 0.3, sp.y - torp.vel.y * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Phasers
    for (const ph of state.phasers) {
      const from = toScreen(ph.from);
      const to = toScreen(ph.to);
      ctx.strokeStyle = FACTION_COLORS[ph.faction];
      ctx.globalAlpha = ph.ttl / 12;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      // Glow
      ctx.lineWidth = 5;
      ctx.globalAlpha = (ph.ttl / 12) * 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Ships
    for (const ship of state.ships) {
      if (!ship.alive) continue;
      if (ship.cloaked && ship.id !== 0) continue;
      const sp = toScreen(ship.pos);
      if (sp.x < -60 || sp.x > w + 60 || sp.y < -60 || sp.y > h + 60) continue;
      this.drawShip(sp, ship, state.tick);
    }

    // Galaxy map overlay
    if (state.showMap) {
      this.drawGalaxyMap(state);
    }

    // Kill feed
    this.drawKillFeed(state);

    // Respawn overlay
    if (state.phase === 'respawning') {
      this.drawRespawnOverlay(state);
    }
  }

  private drawShip(sp: Vec2, ship: Ship, tick: number): void {
    const { ctx } = this;
    const color = FACTION_COLORS[ship.faction];
    const baseSize = { scout: 10, destroyer: 13, cruiser: 16, battleship: 20 }[ship.shipClass];
    const size = ship.id === 0 ? baseSize + 2 : baseSize;

    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.rotate(ship.heading);

    if (ship.cloaked) {
      ctx.globalAlpha = 0.25 + Math.sin(tick * 0.08) * 0.1;
    }

    // Ship shape varies by class
    ctx.fillStyle = color;
    ctx.beginPath();
    switch (ship.shipClass) {
      case 'scout':
        // Slim arrow
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.5, -size * 0.4);
        ctx.lineTo(-size * 0.2, 0);
        ctx.lineTo(-size * 0.5, size * 0.4);
        break;
      case 'destroyer':
        // Standard triangle
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.7, -size * 0.6);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size * 0.7, size * 0.6);
        break;
      case 'cruiser':
        // Wider, more angular
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.3, -size * 0.7);
        ctx.lineTo(-size * 0.8, -size * 0.5);
        ctx.lineTo(-size * 0.6, 0);
        ctx.lineTo(-size * 0.8, size * 0.5);
        ctx.lineTo(-size * 0.3, size * 0.7);
        break;
      case 'battleship':
        // Heavy, boxy
        ctx.moveTo(size, 0);
        ctx.lineTo(size * 0.3, -size * 0.5);
        ctx.lineTo(-size * 0.7, -size * 0.7);
        ctx.lineTo(-size * 0.9, -size * 0.3);
        ctx.lineTo(-size * 0.7, 0);
        ctx.lineTo(-size * 0.9, size * 0.3);
        ctx.lineTo(-size * 0.7, size * 0.7);
        ctx.lineTo(size * 0.3, size * 0.5);
        break;
    }
    ctx.closePath();
    ctx.fill();

    // Engine glow
    if (ship.speed > 1) {
      const stats = SHIP_CLASS_STATS[ship.shipClass];
      const intensity = ship.speed / stats.maxSpeed;
      ctx.fillStyle = ship.faction === 'federation' ? '#4488ff' : ship.faction === 'klingon' ? '#ff4400' : '#44ff44';
      ctx.globalAlpha = intensity * 0.7;
      ctx.beginPath();
      ctx.ellipse(-size * 0.7, 0, 2 + intensity * 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Shield ring
    const stats = SHIP_CLASS_STATS[ship.shipClass];
    if (ship.shields > 0 && !ship.cloaked) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = ship.shields / (stats.maxShields * 2);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, size + 5, 0, Math.PI * 2 * (ship.shields / stats.maxShields));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Player indicator
    if (ship.id === 0) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, size + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // Ship name (AI only, in combat range)
    if (ship.id !== 0) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.font = '8px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(`${ship.name} [${CLASS_NAMES[ship.shipClass].charAt(0)}]`, sp.x, sp.y + size + 14);
      ctx.globalAlpha = 1;
    }
  }

  private drawKillFeed(state: GameState): void {
    const { ctx, w } = this;
    ctx.font = '11px Courier New';
    ctx.textAlign = 'right';

    for (let i = 0; i < state.killFeed.length && i < 5; i++) {
      const entry = state.killFeed[i];
      const y = 50 + i * 18;
      const alpha = Math.min(entry.ttl / 60, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = FACTION_COLORS[entry.killerFaction];
      ctx.fillText(entry.killer, w - 120, y);
      ctx.fillStyle = '#888';
      ctx.fillText(' > ', w - 105, y);
      ctx.fillStyle = FACTION_COLORS[entry.victimFaction];
      ctx.fillText(entry.victim, w - 20, y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  private drawRespawnOverlay(state: GameState): void {
    const { ctx, w, h } = this;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('SHIP DESTROYED', w / 2, h / 2 - 30);

    const remaining = Math.ceil(state.player.respawnTimer / 60);
    ctx.fillStyle = '#ccc';
    ctx.font = '16px Courier New';
    ctx.fillText(`Respawning in ${remaining}s...`, w / 2, h / 2 + 10);

    // Score summary
    const p = state.player;
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(`Kills: ${p.kills} | Deaths: ${p.deaths} | Planets: ${p.planetsTaken} | Bombed: ${p.armiesBombed}`, w / 2, h / 2 + 50);
    ctx.textAlign = 'left';
  }

  private drawGalaxyMap(state: GameState): void {
    const { ctx, w, h } = this;
    const mapW = Math.min(500, w - 40);
    const mapH = Math.min(500, h - 80);
    const mx = (w - mapW) / 2;
    const my = (h - mapH) / 2;
    const scale = mapW / GALAXY_SIZE;

    ctx.fillStyle = 'rgba(0, 5, 15, 0.94)';
    ctx.fillRect(mx - 2, my - 2, mapW + 4, mapH + 4);
    ctx.strokeStyle = '#0a3060';
    ctx.lineWidth = 1;
    ctx.strokeRect(mx - 2, my - 2, mapW + 4, mapH + 4);

    // Grid
    ctx.strokeStyle = '#0a2040';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const gx = mx + (mapW / 4) * i;
      const gy = my + (mapH / 4) * i;
      ctx.beginPath(); ctx.moveTo(gx, my); ctx.lineTo(gx, my + mapH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx, gy); ctx.lineTo(mx + mapW, gy); ctx.stroke();
    }

    // Planets
    for (const planet of state.planets) {
      const px = mx + planet.pos.x * scale;
      const py = my + planet.pos.y * scale;
      ctx.fillStyle = planet.owner ? FACTION_COLORS[planet.owner] : '#444';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#556';
      ctx.font = '7px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, px, py + 8);
    }

    // Ships
    for (const ship of state.ships) {
      if (!ship.alive || ship.cloaked) continue;
      const sx = mx + ship.pos.x * scale;
      const sy = my + ship.pos.y * scale;
      ctx.fillStyle = FACTION_COLORS[ship.faction];
      const sz = ship.id === 0 ? 5 : 3;
      ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
    }

    // Scoreboard
    const scoreX = mx + mapW + 15;
    if (scoreX + 150 < w) {
      ctx.fillStyle = '#0cc';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText('SCOREBOARD', scoreX, my + 15);
      ctx.font = '10px Courier New';
      const sorted = [...state.ships].sort((a, b) => b.kills - a.kills);
      for (let i = 0; i < sorted.length && i < 9; i++) {
        const s = sorted[i];
        ctx.fillStyle = FACTION_COLORS[s.faction];
        ctx.fillText(
          `${s.name.padEnd(10)} K:${s.kills} D:${s.deaths} P:${s.planetsTaken}`,
          scoreX, my + 35 + i * 16,
        );
      }
    }

    ctx.fillStyle = '#0a6';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GALACTIC MAP — Tab to close', w / 2, my - 8);
    ctx.textAlign = 'left';
  }
}
