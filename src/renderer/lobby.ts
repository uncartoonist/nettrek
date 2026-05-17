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

    el.innerHTML = ships.map(s => `
      <div style="padding:6px 12px; margin:4px 0; border-left:3px solid ${FACTION_COLORS[s.faction]}; background:rgba(255,255,255,0.02);">
        <span style="color:${FACTION_COLORS[s.faction]}">${s.name}</span>
        <span style="color:#556; margin-left:8px;">${s.alive ? 'IN GAME' : 'SPECTATING'}</span>
      </div>
    `).join('');

    const status = document.getElementById('lobby-status');
    if (status) status.textContent = `${ships.length} player(s) connected`;
  }

  get isVisible() { return this.visible; }
}
