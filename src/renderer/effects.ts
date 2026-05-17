// Visual polish — screen shake, shield flicker, warp trail, hit indicators

import { GameState, Ship, SHIP_CLASS_STATS, FACTION_COLORS, Vec2 } from '../core/types';

export class EffectsRenderer {
  private shakeX = 0;
  private shakeY = 0;
  private shakeDecay = 0;
  private lastShields = -1;
  private hitFlash = 0;
  private warpTrail: { x: number; y: number; alpha: number }[] = [];

  triggerShake(intensity: number = 4): void {
    this.shakeX = (Math.random() - 0.5) * intensity;
    this.shakeY = (Math.random() - 0.5) * intensity;
    this.shakeDecay = 10;
  }

  triggerHitFlash(): void {
    this.hitFlash = 8;
  }

  getShakeOffset(): Vec2 {
    if (this.shakeDecay > 0) {
      this.shakeDecay--;
      this.shakeX *= 0.7;
      this.shakeY *= 0.7;
      return { x: this.shakeX, y: this.shakeY };
    }
    return { x: 0, y: 0 };
  }

  update(state: GameState): void {
    const p = state.player;
    if (!p.alive) return;

    // Detect shield loss → shake
    if (this.lastShields >= 0 && p.shields < this.lastShields) {
      const loss = this.lastShields - p.shields;
      this.triggerShake(Math.min(loss * 0.3, 8));
      this.triggerHitFlash();
    }
    this.lastShields = p.shields;

    // Warp trail at high speed
    const stats = SHIP_CLASS_STATS[p.shipClass];
    if (p.speed > stats.maxSpeed * 0.7) {
      this.warpTrail.push({ x: p.pos.x, y: p.pos.y, alpha: 0.5 });
      if (this.warpTrail.length > 20) this.warpTrail.shift();
    }
    for (const t of this.warpTrail) t.alpha *= 0.9;
    this.warpTrail = this.warpTrail.filter(t => t.alpha > 0.02);
  }

  renderPreShips(ctx: CanvasRenderingContext2D, state: GameState, toScreen: (pos: Vec2) => Vec2): void {
    // Warp trail
    if (this.warpTrail.length > 1) {
      const color = FACTION_COLORS[state.player.faction];
      for (const point of this.warpTrail) {
        const sp = toScreen(point);
        ctx.fillStyle = color;
        ctx.globalAlpha = point.alpha * 0.3;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  renderPostAll(ctx: CanvasRenderingContext2D, w: number, h: number, state: GameState): void {
    // Hit flash (red vignette)
    if (this.hitFlash > 0) {
      const alpha = this.hitFlash / 8 * 0.3;
      const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.7);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, `rgba(255,0,0,${alpha})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      this.hitFlash--;
    }

    // Shield arc when player has low shields
    const p = state.player;
    if (p.alive) {
      const stats = SHIP_CLASS_STATS[p.shipClass];
      const pct = p.shields / stats.maxShields;
      if (pct < 0.3 && pct > 0) {
        // Flicker warning
        const flicker = Math.sin(state.tick * 0.3) > 0;
        if (flicker) {
          ctx.strokeStyle = 'rgba(255,50,50,0.3)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  }
}
