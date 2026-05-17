import { GameState, FACTION_COLORS, GALAXY_SIZE } from '../core/types';

export class MinimapRenderer {
  private size = 150;
  private margin = 12;

  render(ctx: CanvasRenderingContext2D, state: GameState, screenW: number, screenH: number): void {
    if (state.showMap) return; // Don't show minimap when full map is open

    const { size, margin } = this;
    const x = screenW - size - margin;
    const y = screenH - size - margin - 30; // above controls
    const scale = size / GALAXY_SIZE;

    // Background
    ctx.fillStyle = 'rgba(0,5,15,0.85)';
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = 'rgba(0,204,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    // Grid
    ctx.strokeStyle = 'rgba(0,204,255,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const gp = x + (size / 4) * i;
      ctx.beginPath(); ctx.moveTo(gp, y); ctx.lineTo(gp, y + size); ctx.stroke();
      const gpy = y + (size / 4) * i;
      ctx.beginPath(); ctx.moveTo(x, gpy); ctx.lineTo(x + size, gpy); ctx.stroke();
    }

    // Planets
    for (const planet of state.planets) {
      const px = x + planet.pos.x * scale;
      const py = y + planet.pos.y * scale;
      ctx.fillStyle = planet.owner ? FACTION_COLORS[planet.owner] : '#333';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Ships
    for (const ship of state.ships) {
      if (!ship.alive || (ship.cloaked && ship.id !== state.player.id)) continue;
      const sx = x + ship.pos.x * scale;
      const sy = y + ship.pos.y * scale;

      if (ship.id === state.player.id) {
        // Player — bright + larger
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx - 2, sy - 2, 4, 4);
        // View cone
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, ship.heading - 0.4, ship.heading + 0.4);
        ctx.stroke();
      } else {
        ctx.fillStyle = FACTION_COLORS[ship.faction];
        ctx.globalAlpha = 0.8;
        ctx.fillRect(sx - 1, sy - 1, 2, 2);
        ctx.globalAlpha = 1;
      }
    }

    // Label
    ctx.fillStyle = 'rgba(0,204,255,0.4)';
    ctx.font = '8px Courier New';
    ctx.textAlign = 'right';
    ctx.fillText('TACTICAL', x + size - 3, y + 9);
    ctx.textAlign = 'left';
  }
}
