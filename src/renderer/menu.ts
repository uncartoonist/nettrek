import {
  Faction, ShipClass, FACTION_COLORS, FACTION_NAMES, CLASS_NAMES,
  SHIP_CLASS_STATS, GameState,
} from '../core/types';

const FACTIONS: Faction[] = ['federation', 'klingon', 'romulan', 'orion'];
const CLASSES: ShipClass[] = ['scout', 'destroyer', 'cruiser', 'battleship'];

export class MenuRenderer {
  private container: HTMLDivElement;
  private onStart: () => void;

  constructor(private state: GameState, onStart: () => void) {
    this.onStart = onStart;
    this.container = document.createElement('div');
    this.container.id = 'menu-overlay';
    this.container.innerHTML = this.buildHTML();
    this.applyStyles();
    document.body.appendChild(this.container);
    this.bindEvents();
    this.updateSelection();
  }

  private buildHTML(): string {
    return `
      <div class="menu-panel">
        <h1 class="menu-title">NETTREK</h1>
        <p class="menu-subtitle">TACTICAL SPACE COMBAT — BETA</p>

        <div class="menu-section">
          <h2>SELECT FACTION</h2>
          <div class="menu-options faction-options">
            ${FACTIONS.map(f => `
              <button class="menu-btn faction-btn" data-faction="${f}">
                <span class="btn-dot" style="background:${FACTION_COLORS[f]}"></span>
                ${FACTION_NAMES[f]}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="menu-section">
          <h2>SELECT SHIP CLASS</h2>
          <div class="menu-options class-options">
            ${CLASSES.map(c => {
              const s = SHIP_CLASS_STATS[c];
              return `
                <button class="menu-btn class-btn" data-class="${c}">
                  <span class="btn-label">${CLASS_NAMES[c]}</span>
                  <span class="btn-stats">SPD:${s.maxSpeed} SHD:${s.maxShields} HUL:${s.maxHull} ARM:${s.maxArmies}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <button class="launch-btn" id="menu-launch">LAUNCH</button>

        <div class="menu-section beta-signup">
          <h2>JOIN THE BETA</h2>
          <div class="signup-row">
            <input type="email" id="beta-email" placeholder="your@email.com" class="signup-input" />
            <button id="beta-submit" class="signup-btn">SIGN UP</button>
          </div>
          <div id="beta-status" class="signup-status"></div>
        </div>

        <div class="menu-controls">
          <p>WASD/Arrows: move | Space: torpedo | F: phaser | C: cloak</p>
          <p>Tab: map/scores | B: bomb | V: beam down | G: beam up</p>
          <p style="margin-top:8px; color:#334;">Mobile: touch controls auto-enabled on touchscreens</p>
        </div>
      </div>
    `;
  }

  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      #menu-overlay {
        position: fixed; inset: 0; z-index: 100;
        background: radial-gradient(ellipse at center, #001020 0%, #000508 100%);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace; color: #ccc;
      }
      .menu-panel {
        text-align: center; max-width: 600px; padding: 40px;
      }
      .menu-title {
        font-size: 48px; color: #0cc; margin: 0;
        text-shadow: 0 0 20px rgba(0,204,255,0.4);
        letter-spacing: 8px;
      }
      .menu-subtitle {
        color: #668; font-size: 12px; margin: 8px 0 30px; letter-spacing: 2px;
      }
      .menu-section { margin: 20px 0; }
      .menu-section h2 { font-size: 11px; color: #556; letter-spacing: 2px; margin-bottom: 10px; }
      .menu-options { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
      .menu-btn {
        background: rgba(255,255,255,0.03); border: 1px solid #333;
        color: #aaa; padding: 10px 16px; cursor: pointer; border-radius: 4px;
        font-family: 'Courier New', monospace; font-size: 12px;
        transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px;
      }
      .menu-btn:hover { border-color: #666; background: rgba(255,255,255,0.06); }
      .menu-btn.selected { border-color: #0cc; background: rgba(0,204,255,0.08); color: #0cc; }
      .btn-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
      .btn-stats { font-size: 9px; color: #556; }
      .btn-label { font-weight: bold; }
      .faction-btn { flex-direction: row; }
      .launch-btn {
        margin-top: 30px; padding: 14px 40px; font-size: 16px; font-weight: bold;
        background: rgba(0,204,255,0.1); border: 2px solid #0cc; color: #0cc;
        cursor: pointer; font-family: 'Courier New', monospace; border-radius: 4px;
        letter-spacing: 3px; transition: all 0.2s;
      }
      .launch-btn:hover { background: rgba(0,204,255,0.2); transform: scale(1.02); }
      .menu-controls { margin-top: 30px; font-size: 10px; color: #445; line-height: 1.8; }
      .beta-signup { margin-top: 24px; }
      .signup-row { display: flex; gap: 8px; justify-content: center; align-items: center; }
      .signup-input {
        padding: 8px 12px; border: 1px solid #333; border-radius: 4px;
        background: rgba(255,255,255,0.03); color: #ccc; font-family: 'Courier New', monospace;
        font-size: 12px; width: 220px; outline: none; transition: border-color 0.2s;
      }
      .signup-input:focus { border-color: #0cc; }
      .signup-btn {
        padding: 8px 14px; border: 1px solid #0a6; border-radius: 4px;
        background: rgba(0,170,100,0.1); color: #0a6; cursor: pointer;
        font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold;
      }
      .signup-btn:hover { background: rgba(0,170,100,0.2); }
      .signup-status { margin-top: 8px; font-size: 10px; color: #0a6; min-height: 16px; }
    `;
    document.head.appendChild(style);
  }

  private bindEvents(): void {
    this.container.querySelectorAll('.faction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedFaction = (btn as HTMLElement).dataset.faction as Faction;
        this.updateSelection();
      });
    });
    this.container.querySelectorAll('.class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedClass = (btn as HTMLElement).dataset.class as ShipClass;
        this.updateSelection();
      });
    });
    document.getElementById('menu-launch')!.addEventListener('click', () => {
      this.hide();
      this.onStart();
    });

    document.getElementById('beta-submit')!.addEventListener('click', () => this.submitSignup());
    document.getElementById('beta-email')!.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.submitSignup();
    });
  }

  private async submitSignup(): Promise<void> {
    const input = document.getElementById('beta-email') as HTMLInputElement;
    const status = document.getElementById('beta-status')!;
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      status.textContent = 'Please enter a valid email';
      status.style.color = '#f55';
      return;
    }
    status.textContent = 'Submitting...';
    status.style.color = '#888';
    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:4301' : 'http://54.224.95.1:4301';
      const res = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      status.textContent = data.message || 'Signed up!';
      status.style.color = '#0a6';
      input.value = '';
    } catch {
      status.textContent = 'Signup saved locally — server offline';
      status.style.color = '#fa0';
    }
  }

  private updateSelection(): void {
    this.container.querySelectorAll('.faction-btn').forEach(btn => {
      btn.classList.toggle('selected', (btn as HTMLElement).dataset.faction === this.state.selectedFaction);
    });
    this.container.querySelectorAll('.class-btn').forEach(btn => {
      btn.classList.toggle('selected', (btn as HTMLElement).dataset.class === this.state.selectedClass);
    });
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  show(): void {
    this.container.style.display = 'flex';
  }
}
