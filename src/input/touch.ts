import { InputState } from '../core/game';

export class TouchControls {
  private container: HTMLDivElement;
  private joystickActive = false;
  private joystickOrigin = { x: 0, y: 0 };
  private joystickPos = { x: 0, y: 0 };
  private visible = false;

  constructor(private input: InputState) {
    this.container = document.createElement('div');
    this.container.id = 'touch-controls';
    this.container.innerHTML = this.buildHTML();
    this.applyStyles();
    document.body.appendChild(this.container);

    // Only show on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.visible = true;
      this.container.style.display = 'block';
      this.bindEvents();
    }
  }

  get isActive() { return this.visible; }

  private buildHTML(): string {
    return `
      <div class="touch-joystick" id="touch-joystick">
        <div class="joystick-ring"></div>
        <div class="joystick-knob" id="joystick-knob"></div>
      </div>
      <div class="touch-buttons">
        <button class="touch-btn fire-btn" id="btn-torp">TORP</button>
        <button class="touch-btn fire-btn phaser-btn" id="btn-phaser">PHAS</button>
        <button class="touch-btn util-btn" id="btn-cloak">CLK</button>
        <button class="touch-btn util-btn" id="btn-bomb">BMB</button>
        <button class="touch-btn util-btn" id="btn-map">MAP</button>
      </div>
    `;
  }

  private applyStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      #touch-controls { display: none; position: fixed; inset: 0; pointer-events: none; z-index: 20; }
      .touch-joystick {
        position: absolute; bottom: 40px; left: 40px;
        width: 120px; height: 120px; pointer-events: auto;
      }
      .joystick-ring {
        position: absolute; inset: 0; border: 2px solid rgba(0,204,255,0.3);
        border-radius: 50%; background: rgba(0,10,20,0.4);
      }
      .joystick-knob {
        position: absolute; top: 50%; left: 50%; width: 40px; height: 40px;
        margin: -20px 0 0 -20px; border-radius: 50%;
        background: rgba(0,204,255,0.4); border: 2px solid rgba(0,204,255,0.6);
        transition: transform 0.05s;
      }
      .touch-buttons {
        position: absolute; bottom: 40px; right: 20px;
        display: flex; flex-direction: column; gap: 10px; pointer-events: auto;
      }
      .touch-btn {
        width: 56px; height: 56px; border-radius: 50%;
        border: 2px solid rgba(0,204,255,0.4); background: rgba(0,10,20,0.6);
        color: #0cc; font-family: 'Courier New'; font-size: 10px; font-weight: bold;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; user-select: none; -webkit-user-select: none;
      }
      .touch-btn:active { background: rgba(0,204,255,0.3); }
      .phaser-btn { border-color: rgba(255,100,50,0.4); color: #f64; }
      .util-btn { width: 44px; height: 44px; font-size: 9px; border-color: rgba(100,200,100,0.3); color: #8c8; }
      @media (min-width: 769px) { #touch-controls { display: none !important; } }
    `;
    document.head.appendChild(style);
  }

  private bindEvents(): void {
    const joystick = document.getElementById('touch-joystick')!;
    const knob = document.getElementById('joystick-knob')!;

    // Joystick
    joystick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = joystick.getBoundingClientRect();
      this.joystickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this.joystickActive = true;
    });

    joystick.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.joystickActive) return;
      const touch = e.touches[0];
      const dx = touch.clientX - this.joystickOrigin.x;
      const dy = touch.clientY - this.joystickOrigin.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 40;
      const clampedDist = Math.min(dist, maxDist);
      const angle = Math.atan2(dy, dx);
      this.joystickPos = { x: Math.cos(angle) * clampedDist, y: Math.sin(angle) * clampedDist };
      knob.style.transform = `translate(${this.joystickPos.x}px, ${this.joystickPos.y}px)`;

      // Convert to input
      const normX = this.joystickPos.x / maxDist;
      const normY = this.joystickPos.y / maxDist;
      this.input.turnLeft = normX < -0.3;
      this.input.turnRight = normX > 0.3;
      this.input.thrust = normY < -0.3;
      this.input.brake = normY > 0.3;
    });

    const endJoystick = () => {
      this.joystickActive = false;
      this.joystickPos = { x: 0, y: 0 };
      knob.style.transform = 'translate(0, 0)';
      this.input.thrust = false;
      this.input.brake = false;
      this.input.turnLeft = false;
      this.input.turnRight = false;
    };
    joystick.addEventListener('touchend', endJoystick);
    joystick.addEventListener('touchcancel', endJoystick);

    // Buttons
    this.bindButton('btn-torp', () => { this.input.fireTorp = true; });
    this.bindButton('btn-phaser', () => { this.input.firePhaser = true; });
    this.bindButton('btn-cloak', () => { this.input.cloakPressed = true; });
    this.bindButton('btn-bomb', () => { this.input.bombKey = true; });
    this.bindButton('btn-map', () => { this.input.mapToggle = true; });
  }

  private bindButton(id: string, action: () => void): void {
    const btn = document.getElementById(id)!;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); action(); });
  }
}
