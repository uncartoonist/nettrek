import { FACTION_COLORS, Faction } from '../core/types';

export interface ChatMessage {
  from: string;
  faction: Faction;
  text: string;
  team: boolean;
  ttl: number;
}

export class ChatRenderer {
  private messages: ChatMessage[] = [];
  private inputActive = false;
  private inputText = '';
  private teamMode = false;
  private onSend: ((text: string, team: boolean) => void) | null = null;

  constructor(onSend: (text: string, team: boolean) => void) {
    this.onSend = onSend;
    window.addEventListener('keydown', (e) => this.handleKey(e));
  }

  get isInputActive() { return this.inputActive; }

  addMessage(msg: ChatMessage): void {
    this.messages.push({ ...msg, ttl: 360 }); // 6 seconds
    if (this.messages.length > 20) this.messages.shift();
  }

  private handleKey(e: KeyboardEvent): void {
    if (this.inputActive) {
      if (e.key === 'Escape') {
        this.inputActive = false;
        this.inputText = '';
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (this.inputText.trim()) {
          this.onSend?.(this.inputText.trim(), this.teamMode);
        }
        this.inputActive = false;
        this.inputText = '';
        e.preventDefault();
      } else if (e.key === 'Backspace') {
        this.inputText = this.inputText.slice(0, -1);
        e.preventDefault();
      } else if (e.key.length === 1) {
        this.inputText += e.key;
        e.preventDefault();
      }
      e.stopPropagation();
    } else {
      if (e.key === 'Enter') {
        this.inputActive = true;
        this.teamMode = false;
        this.inputText = '';
        e.preventDefault();
      } else if (e.key === 't' || e.key === 'T') {
        // T opens team chat — but only if not already handling game input
        // We'll check in main.ts if chat is active before processing game input
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const x = 12;
    const baseY = h - 60;

    // Decay messages
    for (const msg of this.messages) msg.ttl--;
    this.messages = this.messages.filter(m => m.ttl > 0);

    // Draw messages (bottom up)
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    const visible = this.messages.slice(-8);
    for (let i = 0; i < visible.length; i++) {
      const msg = visible[i];
      const y = baseY - (visible.length - 1 - i) * 16;
      const alpha = Math.min(msg.ttl / 60, 1);
      ctx.globalAlpha = alpha;

      const prefix = msg.team ? '[TEAM] ' : '';
      ctx.fillStyle = FACTION_COLORS[msg.faction];
      ctx.fillText(`${prefix}${msg.from}: `, x, y);
      const nameWidth = ctx.measureText(`${prefix}${msg.from}: `).width;
      ctx.fillStyle = '#ccc';
      ctx.fillText(msg.text, x + nameWidth, y);
    }
    ctx.globalAlpha = 1;

    // Input box
    if (this.inputActive) {
      const iy = h - 30;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(x - 4, iy - 14, 350, 20);
      ctx.strokeStyle = '#0cc';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 4, iy - 14, 350, 20);
      ctx.fillStyle = '#0cc';
      ctx.font = '11px Courier New';
      const label = this.teamMode ? '[TEAM]> ' : '[ALL]> ';
      ctx.fillText(label + this.inputText + '█', x, iy);
    }
  }
}
