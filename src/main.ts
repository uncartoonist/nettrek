// NetTrek — Music-reactive vertical space combat
import { createShmupState, updateShmup, startStage, applyDirectorCommand, ShmupInput } from './shmup/engine';
import { ShmupRenderer } from './shmup/renderer';
import { HangarScreen } from './shmup/hangar';
import { initAudio, playExplosion, playBigExplosion, playPlayerHit, playBomb, playCoinCollect, playPowerUpWeapon, playPowerUpShield, playPowerUpSpecial } from './audio/sfx';
import { playStageMusic, playMainTheme, stopMusic, setAnalyzer } from './audio/music';
import { MusicAnalyzer } from './audio/analyzer';
import { getDirectorCommand, resetDirector } from './shmup/director';

// ── Boot ───────────────────────────────────────────────────
const canvasEl = document.getElementById('game');
if (!(canvasEl instanceof HTMLCanvasElement)) {
  throw new Error('Missing #game canvas');
}
const canvas = canvasEl;
const renderer = new ShmupRenderer(canvas);
const state = createShmupState();
const musicAnalyzer = new MusicAnalyzer();
setAnalyzer(musicAnalyzer);

// ── Input ──────────────────────────────────────────────────
const keys: Record<string, boolean> = {};
const input: ShmupInput = { moveX: 0, moveY: 0, fire: false, fireSpecial: false, bomb: false };

// Mouse state
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight * 0.75;
let mouseDown = false;
let mouseActive = false; // becomes true on first mouse move

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseActive = true;
});
let rightMouseDown = false;
canvas.addEventListener('mousedown', (e) => {
  mouseActive = true;
  if (e.button === 0) { mouseDown = true; }
  if (e.button === 2) { rightMouseDown = true; } // Right-click = special weapons
  e.preventDefault();
});
canvas.addEventListener('mouseup', (e) => {
  if (e.button === 0) mouseDown = false;
  if (e.button === 2) rightMouseDown = false;
});
canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); });

// Touch state
let touchMoveX = 0;
let touchMoveY = 0;
let touchActive = false;
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state.phase === 'playing' || state.phase === 'boss') e.preventDefault();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// Touch controls
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  if (!t) return;
  touchActive = true;
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  input.fire = true;
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!touchActive) return;
  const t = e.touches[0];
  if (!t) return;
  touchMoveX = (t.clientX - touchStartX) * 0.15;
  touchMoveY = (t.clientY - touchStartY) * 0.15;
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  touchActive = false;
  touchMoveX = 0;
  touchMoveY = 0;
  input.fire = false;
});

function updateInput(): void {
  if (mouseActive && (state.phase === 'playing' || state.phase === 'boss')) {
    // Mouse: direct position tracking — ship snaps to cursor
    const dx = mouseX - state.player.pos.x;
    const dy = mouseY - state.player.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 2) {
      // Normalize and scale — full speed toward cursor, no smoothing lag
      const speed = Math.min(dist, 60) / 60; // ramp up quickly
      input.moveX = (dx / dist) * speed;
      input.moveY = (dy / dist) * speed;
    } else {
      input.moveX = 0;
      input.moveY = 0;
    }
    // Auto-fire while in combat
    input.fire = true;
    input.fireSpecial = mouseDown || rightMouseDown; // left-click OR right-click fires specials
  } else if (touchActive) {
    input.moveX = Math.max(-1, Math.min(1, touchMoveX));
    input.moveY = Math.max(-1, Math.min(1, touchMoveY));
    touchMoveX *= 0.5;
    touchMoveY *= 0.5;
  } else {
    // Keyboard fallback
    input.moveX = (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
    input.moveY = (keys['ArrowDown'] || keys['KeyS'] ? 1 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);
    input.fire = keys['Space'] || keys['KeyZ'] || false;
    input.fireSpecial = keys['ShiftLeft'] || keys['ShiftRight'] || false;
  }
  if (keys['KeyX'] || keys['KeyB']) {
    input.bomb = true;
    keys['KeyX'] = false;
    keys['KeyB'] = false;
  }
}

// ── HUD ────────────────────────────────────────────────────
const hud = document.getElementById('hud');
const controls = document.getElementById('controls');
if (!hud || !controls) {
  throw new Error('Missing HUD or controls element');
}
hud.style.display = 'none';
controls.textContent = 'Mouse: move & auto-fire | Right-click: special weapons | X/B: bomb | ESC: exit';

// ── Menu ───────────────────────────────────────────────────
const menuOverlay = document.createElement('div');
menuOverlay.id = 'shmup-menu';
menuOverlay.style.cssText = `
  position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at center,#001020 0%,#000508 100%);
  font-family:'Courier New',monospace;color:#ccc;flex-direction:column;
`;
menuOverlay.innerHTML = `
  <h1 style="color:#0cc;font-size:clamp(28px,8vw,48px);letter-spacing:clamp(4px,1.5vw,8px);text-shadow:0 0 20px rgba(0,204,255,0.4);margin:0;">NETTREK</h1>
  <p style="color:#556;font-size:clamp(9px,2.5vw,11px);letter-spacing:clamp(1px,0.8vw,3px);margin:8px 0 clamp(20px,5vw,40px);">TACTICAL ASSAULT — BETA</p>
  <button id="start-btn" style="padding:clamp(10px,3vw,14px) clamp(24px,6vw,40px);font-size:clamp(13px,3.5vw,16px);font-weight:bold;background:rgba(0,204,255,0.1);border:2px solid #0cc;color:#0cc;cursor:pointer;font-family:'Courier New';border-radius:4px;letter-spacing:clamp(1px,0.5vw,3px);width:auto;max-width:90vw;">START MISSION</button>
  <div style="margin-top:30px;font-size:10px;color:#445;text-align:center;line-height:1.8;">
    <p>Mouse: move & auto-fire | Right-click: special weapons</p>
    <p>X/B: bomb | Shift: special (keyboard) | ESC: exit</p>
    <p>Touch: drag to move, auto-fire enabled</p>
  </div>
  <div style="margin-top:24px;">
    <input type="email" id="menu-email" placeholder="your@email.com" style="padding:8px 12px;border:1px solid #333;border-radius:4px;background:rgba(255,255,255,0.03);color:#ccc;font-family:'Courier New';font-size:12px;width:200px;outline:none;" />
    <button id="menu-signup" style="padding:8px 12px;border:1px solid #0a6;border-radius:4px;background:rgba(0,170,100,0.1);color:#0a6;cursor:pointer;font-family:'Courier New';font-size:11px;margin-left:6px;">BETA SIGNUP</button>
    <div id="menu-signup-status" style="margin-top:6px;font-size:10px;color:#0a6;min-height:14px;"></div>
  </div>
`;
document.body.appendChild(menuOverlay);

// ── Hangar ─────────────────────────────────────────────────
const hangar = new HangarScreen(state, (stageIdx) => {
  initAudio();
  resetDirector();
  startStage(state, stageIdx);
  playStageMusic(stageIdx);
  controls.style.display = 'block';
});

// ── Event bindings ─────────────────────────────────────────
// Start theme music on first user interaction (before they hit START)
let musicStarted = false;
function startThemeOnInteraction() {
  if (musicStarted) return;
  musicStarted = true;
  initAudio();
  playMainTheme();
}
document.addEventListener('click', startThemeOnInteraction, { once: false });
document.addEventListener('keydown', startThemeOnInteraction, { once: false });
document.addEventListener('touchstart', startThemeOnInteraction, { once: false });

document.getElementById('start-btn')!.addEventListener('click', () => {
  startThemeOnInteraction();
  menuOverlay.style.display = 'none';
  state.phase = 'hangar';
  hangar.show();
});

document.getElementById('menu-signup')!.addEventListener('click', async () => {
  const emailInput = document.getElementById('menu-email') as HTMLInputElement;
  const status = document.getElementById('menu-signup-status')!;
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) { status.textContent = 'Enter valid email'; status.style.color = '#f55'; return; }
  try {
    const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:4301' : 'http://54.224.95.1:4301';
    const res = await fetch(`${apiUrl}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    status.textContent = data.message || 'Signed up!'; status.style.color = '#0a6'; emailInput.value = '';
  } catch { status.textContent = 'Saved locally'; status.style.color = '#fa0'; }
});

// Return to hangar on Enter after game over / victory
window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    if (state.phase === 'gameover' || state.phase === 'victory') {
      state.phase = 'hangar';
      stopMusic();
      setTimeout(() => playMainTheme(), 500);
      hangar.show();
      e.preventDefault();
    }
  }
  if (e.code === 'Escape') {
    if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning') {
      state.phase = 'hangar';
      stopMusic();
      setTimeout(() => playMainTheme(), 500);
      hangar.show();
      e.preventDefault();
    }
  }
});

// ── Game Loop ──────────────────────────────────────────────
function loop() {
  updateInput();

  if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning') {
    // Music analysis — drives the game
    musicAnalyzer.update();
    const energy = musicAnalyzer.energy;

    // Director translates music energy into gameplay commands
    if (state.phase === 'playing' && !state.bossActive) {
      const cmd = getDirectorCommand(energy, state);
      applyDirectorCommand(state, cmd);
    }

    const events = updateShmup(state, input);

    // Audio — impact sounds with variety
    if (events.enemyKilled) playExplosion();
    if (events.playerHit) playPlayerHit();
    if (events.bombUsed) playBomb();
    if (events.bossKilled) { playBigExplosion(); }
    if (events.coinCollected) playCoinCollect();
    // Distinct sounds per powerup type
    if (events.powerUpCollected && events.powerUpCollected !== 'star') {
      const pu = events.powerUpCollected;
      if (pu === 'weapon' || pu === 'missile' || pu === 'laser' || pu === 'phaser') playPowerUpWeapon();
      else if (pu === 'shield' || pu === 'life') playPowerUpShield();
      else playPowerUpSpecial();
    }
  }

  if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning' || state.phase === 'gameover' || state.phase === 'victory') {
    renderer.render(state);
  }

  requestAnimationFrame(loop);
}

// ── iframe communication ───────────────────────────────────
window.addEventListener('message', (e) => {
  if (e.data?.type === 'nettrek:ping') {
    window.parent.postMessage({ type: 'nettrek:pong', status: state.phase, score: state.score }, '*');
  }
});
window.parent.postMessage({ type: 'nettrek:ready' }, '*');

requestAnimationFrame(loop);
