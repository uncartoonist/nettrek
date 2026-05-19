import { FACTION_COLORS, Faction } from '../core/types';

export interface LobbyPlayer {
  id: number;
  name: string;
  faction: Faction;
  ready: boolean;
}

export class LobbyOverlay {
  private container: HTMLDivElement;
  private players: LobbyPlayer[] = [];
  private visible = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'lobby-overlay';
    this.container.style.cssText = `
      position:fixed; inset:0; z-index:90; display:none;
      background:rgba(0,5,15,0.95); font-family:'Courier New',monospace;
      display:none; flex-direction:column; align-items:center; justify-content:center; color:#ccc;
    `;
    this.container.innerHTML = `
      <div style="text-align:center; max-width:500px;">
        <h2 style="color:#0cc; font-size:18px; letter-spacing:3px; margin-bottom:20px;">MULTIPLAYER LOBBY</h2>
        <div id="lobby-status" style="color:#556; font-size:11px; margin-bottom:16px;">Connecting...</div>
        <div id="lobby-players" style="margin:16px 0; text-align:left;"></div>
        <div style="margin-top:20px; font-size:10px; color:#445;">
          Players in lobby will appear here. Select faction & ship, then LAUNCH to join.
        </div>
      </div>
    `;
    document.body.appendChild(this.container);
  }

  show(): void {
    this.visible = true;
    this.container.style.display = 'flex';
  }

  hide(): void {
    this.visible = false;
    this.container.style.display = 'none';
  }

  updatePlayers(ships: { name: string; faction: Faction; alive: boolean; id: number }[]): void {
    if (!this.visible) return;
    const el = document.getElementById('lobby-players');
    if (!el) return;

    // Build DOM nodes with textContent so remote player names cannot inject
    // HTML/JS. The faction lookup is enum-bounded (TS Faction type) but
    // names come from another client and must be treated as untrusted.
    el.replaceChildren();
    for (const s of ships) {
      const color = FACTION_COLORS[s.faction] || '#888';
      const row = document.createElement('div');
      row.style.cssText = `padding:6px 12px; margin:4px 0; border-left:3px solid ${color}; background:rgba(255,255,255,0.02);`;

      const nameSpan = document.createElement('span');
      nameSpan.style.color = color;
      nameSpan.textContent = s.name;       // <-- safe: no HTML interpolation
      row.appendChild(nameSpan);

      const statusSpan = document.createElement('span');
      statusSpan.style.cssText = 'color:#556; margin-left:8px;';
      statusSpan.textContent = s.alive ? 'IN GAME' : 'SPECTATING';
      row.appendChild(statusSpan);

      el.appendChild(row);
    }

    const status = document.getElementById('lobby-status');
    if (status) status.textContent = `${ships.length} player(s) connected`;
  }

  get isVisible() { return this.visible; }
}
