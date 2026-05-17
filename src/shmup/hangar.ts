import { ShmupState } from './types';
import { saveProgress, startStage } from './engine';

interface UpgradeDef {
  id: string;
  name: string;
  maxLevel: number;
  costs: number[];
  description: string[];
}

const UPGRADES: UpgradeDef[] = [
  { id: 'mainGun', name: 'MAIN CANNON', maxLevel: 4, costs: [5, 15, 30, 60], description: ['Double shot', 'Triple shot', 'Quad burst', 'Plasma stream'] },
  { id: 'wingGun', name: 'WING GUNS', maxLevel: 4, costs: [8, 20, 40, 80], description: ['Basic wings', 'Rapid wings', 'Spread wings', 'Homing wings'] },
  { id: 'missile', name: 'MISSILES', maxLevel: 3, costs: [12, 30, 60], description: ['Homing missile', 'Dual missile', 'Swarm missiles'] },
  { id: 'laser', name: 'LASER BEAM', maxLevel: 2, costs: [20, 50], description: ['Beam emitter', 'Heavy beam'] },
  { id: 'phaser', name: 'PHASER ARRAY', maxLevel: 3, costs: [15, 35, 70], description: ['Phaser sweep', 'Wide phaser', 'Heavy phaser'] },
  { id: 'shield', name: 'SHIELDS', maxLevel: 4, costs: [10, 25, 50, 100], description: ['+1 shield', '+2 shields', '+3 shields', '+4 shields'] },
  { id: 'bomb', name: 'BOMB PAYLOAD', maxLevel: 3, costs: [8, 20, 40], description: ['+1 bomb', '+2 bombs', '+3 bombs'] },
];

export class HangarScreen {
  private container: HTMLDivElement;
  private state: ShmupState;
  private onLaunch: (stageIdx: number) => void;

  constructor(state: ShmupState, onLaunch: (stageIdx: number) => void) {
    this.state = state;
    this.onLaunch = onLaunch;
    this.container = document.createElement('div');
    this.container.id = 'hangar-screen';
    document.body.appendChild(this.container);
    this.applyStyles();
    this.hide();
  }

  private wireframeCanvas: HTMLCanvasElement | null = null;
  private wireframeAnim: number = 0;

  show(): void {
    this.container.style.display = 'flex';
    this.render();
    this.startWireframe();
  }

  hide(): void {
    this.container.style.display = 'none';
    if (this.wireframeAnim) cancelAnimationFrame(this.wireframeAnim);
    if (this.wireframeCanvas) { this.wireframeCanvas.remove(); this.wireframeCanvas = null; }
  }

  private startWireframe(): void {
    if (this.wireframeCanvas) return;
    const c = document.createElement('canvas');
    c.id = 'hangar-wireframe';
    c.width = 800; c.height = 900;
    this.container.appendChild(c);
    this.wireframeCanvas = c;

    let tick = 0;
    const draw = () => {
      if (!this.wireframeCanvas || this.container.style.display === 'none') return;
      tick++;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, 800, 900);
      const rot = tick * 0.002;
      ctx.save();
      ctx.translate(400, 440);

      const persp = Math.cos(rot * 0.5); // perspective oscillation

      // ── Helper: draw line at given opacity ──
      const wl = (x1: number, y1: number, x2: number, y2: number, alpha: number = 1, w: number = 0.5) => {
        ctx.strokeStyle = '#0cc'; ctx.globalAlpha = alpha * 0.9; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      const we = (cx: number, cy: number, rx: number, ry: number, alpha: number = 1, w: number = 0.5) => {
        ctx.strokeStyle = '#0cc'; ctx.globalAlpha = alpha * 0.9; ctx.lineWidth = w;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      };

      // ── Saucer section ──
      const sr = 180; // saucer radius
      const sry = 65; // saucer height (perspective)
      const sy = -120; // saucer Y center
      // Outer rim
      we(0, sy, sr, sry, 0.7, 0.7);
      // Inner rim rings
      we(0, sy, sr * 0.85, sry * 0.85, 0.3);
      we(0, sy, sr * 0.65, sry * 0.65, 0.2);
      we(0, sy, sr * 0.4, sry * 0.4, 0.15);
      // Radial spokes (deck sections)
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i + rot * 0.3;
        const ix = Math.cos(a) * sr * 0.4;
        const iy = Math.sin(a) * sry * 0.4;
        const ox = Math.cos(a) * sr * 0.85;
        const oy = Math.sin(a) * sry * 0.85;
        wl(ix, sy + iy, ox, sy + oy, 0.12);
      }
      // Phaser strip (arc on rim)
      ctx.strokeStyle = '#0cc'; ctx.globalAlpha = 0.25; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(0, sy, sr * 0.92, sry * 0.92, 0, -0.5, 0.5); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, sy, sr * 0.92, sry * 0.92, 0, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke();
      // Bridge module
      we(0, sy - 5, 22, 14, 0.5, 0.6);
      we(0, sy - 8, 12, 8, 0.3);
      // Bridge windows
      for (let i = -3; i <= 3; i++) {
        const wx = i * 5;
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#0cc';
        ctx.fillRect(wx - 1, sy - 12, 2, 2);
      }
      // Impulse engines (rear of saucer)
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#0cc';
      ctx.fillRect(-15, sy + sry - 5, 30, 4);

      // ── Neck / dorsal connector ──
      wl(-10, sy + sry - 3, -12, 50, 0.4);
      wl(10, sy + sry - 3, 12, 50, 0.4);
      // Neck ribs
      for (let i = 0; i < 5; i++) {
        const ny = sy + sry + i * 20;
        const nw = 10 + i * 0.5;
        wl(-nw, ny, nw, ny, 0.1);
      }

      // ── Engineering hull (secondary hull) ──
      const ey = 110; // engineering center
      // Main body — tapered shape
      ctx.strokeStyle = '#0cc'; ctx.globalAlpha = 0.5; ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-12, 50);
      ctx.quadraticCurveTo(-35, 70, -38, ey);
      ctx.quadraticCurveTo(-35, ey + 55, -15, ey + 65);
      ctx.lineTo(15, ey + 65);
      ctx.quadraticCurveTo(35, ey + 55, 38, ey);
      ctx.quadraticCurveTo(35, 70, 12, 50);
      ctx.stroke();
      // Hull panel lines
      for (let i = 0; i < 4; i++) {
        const hy = 65 + i * 28;
        wl(-34 + i * 2, hy, 34 - i * 2, hy, 0.1);
      }
      // Shuttle bay (rear)
      we(0, ey + 55, 10, 6, 0.25);
      ctx.globalAlpha = 0.1; ctx.fillStyle = '#0cc';
      ctx.fillRect(-8, ey + 50, 16, 10);

      // ── Deflector dish ──
      we(0, ey + 68, 22, 14, 0.5, 0.7);
      we(0, ey + 68, 15, 9, 0.3);
      we(0, ey + 68, 8, 5, 0.2);

      // ── Nacelle pylons ──
      const pyS = 110 + Math.sin(rot) * 8; // nacelle spread with subtle sway
      // Diagonal pylons from engineering hull
      wl(-25, ey - 15, -pyS, ey - 50, 0.45, 0.6);
      wl(25, ey - 15, pyS, ey - 50, 0.45, 0.6);
      // Pylon inner structure lines
      wl(-25, ey - 10, -pyS, ey - 45, 0.15);
      wl(25, ey - 10, pyS, ey - 45, 0.15);

      // ── Warp nacelles ──
      const nl = 110; // nacelle length
      const nw = 14; // nacelle width
      const ny = ey - 60; // nacelle center Y
      for (const side of [-1, 1]) {
        const nx = side * pyS;
        // Nacelle body
        ctx.strokeStyle = '#0cc'; ctx.globalAlpha = 0.5; ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(nx - nw, ny + nl * 0.45);
        ctx.quadraticCurveTo(nx - nw, ny - nl * 0.35, nx - nw * 0.6, ny - nl * 0.45);
        ctx.lineTo(nx + nw * 0.6, ny - nl * 0.45);
        ctx.quadraticCurveTo(nx + nw, ny - nl * 0.35, nx + nw, ny + nl * 0.45);
        ctx.closePath();
        ctx.stroke();
        // Warp coil grille lines
        for (let i = 0; i < 8; i++) {
          const gy = ny - nl * 0.35 + i * (nl * 0.8 / 8);
          wl(nx - nw + 2, gy, nx + nw - 2, gy, 0.08);
        }
        // Warp field emitter (blue strip along nacelle)
        ctx.strokeStyle = '#0cc'; ctx.globalAlpha = 0.2; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nx, ny - nl * 0.4);
        ctx.lineTo(nx, ny + nl * 0.4);
        ctx.stroke();
        // Bussard collector (front cap)
        we(nx, ny - nl * 0.45, nw * 0.7, nw * 0.7, 0.4, 0.6);
        we(nx, ny - nl * 0.45, nw * 0.4, nw * 0.4, 0.2);
        // Bussard intake vanes
        for (let v = 0; v < 4; v++) {
          const va = (Math.PI * 2 / 4) * v + tick * 0.008;
          const vr1 = nw * 0.3;
          const vr2 = nw * 0.65;
          wl(nx + Math.cos(va)*vr1, ny-nl*0.45+Math.sin(va)*vr1,
             nx + Math.cos(va)*vr2, ny-nl*0.45+Math.sin(va)*vr2, 0.15);
        }
        // Nacelle end cap
        we(nx, ny + nl * 0.45, nw * 0.5, nw * 0.5, 0.2);
      }

      // ── Registration markings (very faint) ──
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#0cc';
      ctx.font = '10px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('NCC-1701', 0, sy + 10);
      ctx.fillText('U.S.S. ENTERPRISE', 0, sy + 22);

      ctx.globalAlpha = 1;
      ctx.restore();
      this.wireframeAnim = requestAnimationFrame(draw);
    };
    draw();
  }

  private render(): void {
    const s = this.state;
    const stars = s.player.totalStars;

    this.container.innerHTML = `
      <div class="hangar-panel">
        <h1 class="hangar-title">FEDERATION HANGAR</h1>
        <div class="hangar-stars">⚡ ${stars} COINS AVAILABLE</div>

        <div class="hangar-upgrades">
          ${UPGRADES.map(u => {
            const currentLevel = s.upgrades[u.id] || 0;
            const canUpgrade = currentLevel < u.maxLevel;
            const cost = canUpgrade ? u.costs[currentLevel] : 0;
            const canAfford = stars >= cost;
            return `
              <div class="upgrade-row">
                <div class="upgrade-info">
                  <span class="upgrade-name">${u.name}</span>
                  <span class="upgrade-level">LVL ${currentLevel}/${u.maxLevel}</span>
                  ${canUpgrade ? `<span class="upgrade-desc">${u.description[currentLevel]}</span>` : '<span class="upgrade-desc maxed">MAXED</span>'}
                </div>
                <div class="upgrade-bar">
                  ${Array.from({length: u.maxLevel}, (_, i) => `<div class="bar-seg ${i < currentLevel ? 'filled' : ''}"></div>`).join('')}
                </div>
                ${canUpgrade ? `<button class="upgrade-btn ${canAfford ? '' : 'disabled'}" data-id="${u.id}" data-cost="${cost}">⚡${cost}</button>` : '<span class="upgrade-max">MAX</span>'}
              </div>
            `;
          }).join('')}
        </div>

        <div class="hangar-stages">
          <h2>SELECT MISSION</h2>
          <div class="stage-list">
            ${s.stages.map((stage, i) => `
              <button class="stage-btn" data-stage="${i}">
                <span class="stage-name">${stage.name}</span>
                <span class="stage-sub">${stage.subtitle}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind events
    this.container.querySelectorAll('.upgrade-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id!;
        const cost = parseInt((btn as HTMLElement).dataset.cost!);
        if (s.player.totalStars >= cost) {
          s.player.totalStars -= cost;
          s.upgrades[id] = (s.upgrades[id] || 0) + 1;
          saveProgress(s);
          this.render(); // Re-render
        }
      });
    });

    this.container.querySelectorAll('.stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).dataset.stage!);
        this.hide();
        this.onLaunch(idx);
      });
    });
  }

  private applyStyles(): void {
    const style = document.createElement('style');
    style.id = 'hangar-styles';
    if (document.getElementById('hangar-styles')) return;
    style.textContent = `
      #hangar-screen {
        position: fixed; inset: 0; z-index: 100;
        background: radial-gradient(ellipse at center, #001525 0%, #000508 100%);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace; color: #ccc; overflow-y: auto;
      }
      #hangar-wireframe {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
        pointer-events: none; z-index: 0; opacity: 0.035;
      }
      .hangar-panel { text-align: center; max-width: 700px; padding: 30px; width: 100%; position: relative; z-index: 1; }
      .hangar-title { color: #0cc; font-size: 42px; letter-spacing: 6px; margin-bottom: 6px; text-shadow: 0 0 30px rgba(0,204,255,0.3); }
      .hangar-stars { color: #ffdd00; font-size: 18px; margin-bottom: 28px; }
      .hangar-upgrades { text-align: left; margin-bottom: 30px; }
      .upgrade-row {
        display: flex; align-items: center; gap: 14px; padding: 12px 14px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .upgrade-info { flex: 1; }
      .upgrade-name { display: block; font-size: 14px; color: #0cc; font-weight: bold; }
      .upgrade-level { font-size: 11px; color: #667; }
      .upgrade-desc { display: block; font-size: 11px; color: #888; margin-top: 3px; }
      .upgrade-desc.maxed { color: #4a4; }
      .upgrade-bar { display: flex; gap: 4px; }
      .bar-seg { width: 16px; height: 10px; border: 1px solid #334; border-radius: 2px; }
      .bar-seg.filled { background: #0cc; border-color: #0cc; }
      .upgrade-btn {
        padding: 6px 14px; border: 1px solid #ffdd00; border-radius: 4px;
        background: rgba(255,221,0,0.1); color: #ffdd00; cursor: pointer;
        font-family: 'Courier New'; font-size: 13px;
      }
      .upgrade-btn:hover { background: rgba(255,221,0,0.2); }
      .upgrade-btn.disabled { border-color: #444; color: #444; cursor: not-allowed; background: none; }
      .upgrade-max { font-size: 11px; color: #4a4; }
      .hangar-stages { margin-top: 24px; }
      .hangar-stages h2 { font-size: 14px; color: #667; letter-spacing: 3px; margin-bottom: 14px; }
      .stage-list { display: flex; flex-direction: column; gap: 10px; }
      .stage-btn {
        padding: 14px 18px; border: 1px solid #334; border-radius: 6px;
        background: rgba(0,204,255,0.04); cursor: pointer; text-align: left;
        font-family: 'Courier New'; transition: all 0.2s;
      }
      .stage-btn:hover { border-color: #0cc; background: rgba(0,204,255,0.1); }
      .stage-name { display: block; color: #0cc; font-size: 16px; font-weight: bold; }
      .stage-sub { display: block; color: #667; font-size: 12px; margin-top: 3px; }
    `;
    document.head.appendChild(style);
  }
}
