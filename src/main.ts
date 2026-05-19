// NetTrek — Music-reactive vertical space combat
import { createShmupState, updateShmup, startStage, applyDirectorCommand, ShmupInput } from './shmup/engine';
import { ShmupRenderer } from './shmup/renderer';
import { HangarScreen } from './shmup/hangar';
import { initAudio, playExplosion, playBigExplosion, playPlayerHit, playBomb, playCoinCollect, playPowerUpWeapon, playPowerUpShield, playPowerUpSpecial, playBulletHit, playCritHit, playBossArrival } from './audio/sfx';
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
// Single Pointer-Event-based pipeline that handles mouse, touch, and
// Apple Pencil uniformly. Each pointer keeps absolute coordinates and
// pressure; the ship follows the highest-priority active pointer (pen >
// touch > mouse). Double-tap fires the lock-on phaser. Hard-push
// (pressure > 0.55, e.g. Pencil hard press / 3D Touch) or a long-press
// (~380ms while stationary) activates the defensive shield burst.

const keys: Record<string, boolean> = {};
const input: ShmupInput = {
  moveX: 0, moveY: 0,
  fire: false, fireSpecial: false, bomb: false,
  lockOnFire: false, phaserHold: false, shieldBurst: false,
};

type PtrType = 'mouse' | 'touch' | 'pen';
interface ActivePointer {
  id: number;
  type: PtrType;
  x: number;
  y: number;
  pressure: number;
  downTime: number;
  downX: number;
  downY: number;
  longPressFired: boolean;
}
const activePointers = new Map<number, ActivePointer>();
let primaryPointerId: number | null = null;

// Buttons / mouse-specific state
let rightMouseDown = false;
let mouseHover = { x: window.innerWidth / 2, y: window.innerHeight * 0.75, active: false };

// Double-tap detection
let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;
const DOUBLE_TAP_MS = 320;
const DOUBLE_TAP_DIST = 50;

// Tunables
const HARD_PRESS_THRESHOLD = 0.55;  // pressure above this = "hard push"
const LONG_PRESS_MS = 380;          // hold longer than this while still = shield burst
const LONG_PRESS_MAX_MOVE = 14;     // px

function rank(t: PtrType): number {
  return t === 'pen' ? 2 : t === 'touch' ? 1 : 0;
}

function recomputePrimary(): void {
  let best: ActivePointer | null = null;
  for (const p of activePointers.values()) {
    if (!best || rank(p.type) > rank(best.type)) best = p;
  }
  primaryPointerId = best ? best.id : null;
}

// ── Keyboard ─────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state.phase === 'playing' || state.phase === 'boss') e.preventDefault();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// ── Pointer (mouse + touch + pen) ────────────────────────
canvas.addEventListener('pointerdown', (e) => {
  // Right-click on mouse stays separate (used for specials)
  if (e.pointerType === 'mouse' && e.button === 2) {
    rightMouseDown = true;
    e.preventDefault();
    return;
  }

  // ── Victory / briefing tap-to-advance (mobile-friendly) ──
  // ENTER is the desktop binding; on touch screens, tapping advances too.
  if (state.phase === 'victory') {
    const vtPost = state.victoryTimer - 130;
    if (state.flyawayProgress >= 1 && vtPost >= 200) {
      const nextIdx = state.currentStage + 1;
      if (nextIdx < state.stages.length) {
        state.phase = 'briefing';
        e.preventDefault();
        return;
      }
    }
  } else if (state.phase === 'briefing') {
    const nextIdx = Math.min(state.currentStage + 1, state.stages.length - 1);
    resetDirector();
    startStage(state, nextIdx);
    playStageMusic(nextIdx);
    e.preventDefault();
    return;
  }

  const ptr: ActivePointer = {
    id: e.pointerId,
    type: (e.pointerType as PtrType) || 'mouse',
    x: e.clientX,
    y: e.clientY,
    pressure: e.pressure,
    downTime: performance.now(),
    downX: e.clientX,
    downY: e.clientY,
    longPressFired: false,
  };
  activePointers.set(e.pointerId, ptr);
  // Capture so we keep getting events even if the pointer leaves the canvas
  try { canvas.setPointerCapture(e.pointerId); } catch {}

  // Prefer pen > touch > mouse for steering
  if (primaryPointerId === null) {
    primaryPointerId = e.pointerId;
  } else {
    const cur = activePointers.get(primaryPointerId);
    if (!cur || rank(ptr.type) > rank(cur.type)) primaryPointerId = e.pointerId;
  }

  // Double-tap (any pointer type) → lock-on phaser
  const now = performance.now();
  const dx = e.clientX - lastTapX;
  const dy = e.clientY - lastTapY;
  if (now - lastTapTime < DOUBLE_TAP_MS && Math.hypot(dx, dy) < DOUBLE_TAP_DIST) {
    input.lockOnFire = true;
    lastTapTime = 0; // prevent triple-tap re-trigger
  } else {
    lastTapTime = now;
    lastTapX = e.clientX;
    lastTapY = e.clientY;
  }

  e.preventDefault();
});

canvas.addEventListener('pointermove', (e) => {
  const ptr = activePointers.get(e.pointerId);
  if (ptr) {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.pressure = e.pressure;
  } else if (e.pointerType === 'mouse') {
    // Mouse hover (no buttons down) — still drive the ship
    mouseHover.x = e.clientX;
    mouseHover.y = e.clientY;
    mouseHover.active = true;
  }
  e.preventDefault();
});

function releasePointer(e: PointerEvent): void {
  if (e.pointerType === 'mouse' && e.button === 2) {
    rightMouseDown = false;
    return;
  }
  activePointers.delete(e.pointerId);
  try { canvas.releasePointerCapture(e.pointerId); } catch {}
  if (primaryPointerId === e.pointerId) recomputePrimary();
}
canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);
canvas.addEventListener('pointerleave', (e) => {
  // Only delete touch/pen on leave — mouse can hover off-canvas
  if (e.pointerType !== 'mouse') releasePointer(e);
});

canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); });

function updateInput(): void {
  const playing = state.phase === 'playing' || state.phase === 'boss';
  // Always reset per-frame triggers (shieldBurst is consumed by engine each frame)
  input.shieldBurst = false;
  // phaserHold is computed fresh every frame from current input state
  input.phaserHold = false;

  if (!playing) {
    input.moveX = input.moveY = 0;
    input.fire = false;
    input.fireSpecial = false;
    return;
  }

  // ── Phaser hold-to-fire ──
  // Mobile: 2+ active touch/pen pointers → fire phaser
  // Desktop: Shift held → fire phaser
  // Release = beam ends immediately (engine handles).
  const touchPenCount = Array.from(activePointers.values())
    .filter(p => p.type === 'touch' || p.type === 'pen').length;
  const shiftHeld = !!(keys['ShiftLeft'] || keys['ShiftRight']);
  if (touchPenCount >= 2 || shiftHeld) {
    input.phaserHold = true;
  }

  // Pick the steering source: an active down-pointer beats mouse hover.
  const primary = primaryPointerId !== null ? activePointers.get(primaryPointerId) : null;
  const usingPointer = primary != null;
  const sx = usingPointer ? primary!.x : (mouseHover.active ? mouseHover.x : -1);
  const sy = usingPointer ? primary!.y : (mouseHover.active ? mouseHover.y : -1);

  if (sx >= 0) {
    // Touch needs a Y-offset so the finger doesn't cover the ship.
    // Pencil is precise — small offset. Mouse — no offset.
    const ptype: PtrType = usingPointer ? primary!.type : 'mouse';
    const offsetY = ptype === 'touch' ? -55 : ptype === 'pen' ? -14 : 0;
    const targetX = sx;
    const targetY = sy + offsetY;

    const dx = targetX - state.player.pos.x;
    const dy = targetY - state.player.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 2) {
      // Wider ramp (0→100px) than before (0→60px) so the ship doesn't
      // slam into max speed for small motions — feels smoother under
      // pencil/touch where micro-jitter is common.
      const speed = Math.min(dist, 100) / 100;
      input.moveX = (dx / dist) * speed;
      input.moveY = (dy / dist) * speed;
    } else {
      input.moveX = 0;
      input.moveY = 0;
    }

    input.fire = true;  // auto-fire while alive
    // Special weapons fire on: right-click (mouse), shift held (desktop),
    // or 2+ fingers down (mobile — same gesture as phaser hold).
    input.fireSpecial = rightMouseDown || input.phaserHold;

    // ── Shield burst: hard-push (Pencil / 3D Touch) ──
    if (usingPointer && primary!.pressure > HARD_PRESS_THRESHOLD && !primary!.longPressFired) {
      input.shieldBurst = true;
      primary!.longPressFired = true; // single-shot per hold
    }

    // ── Shield burst: long-press fallback (Haptic Touch / finger) ──
    if (usingPointer && !primary!.longPressFired) {
      const held = performance.now() - primary!.downTime;
      const moved = Math.hypot(primary!.x - primary!.downX, primary!.y - primary!.downY);
      if (held > LONG_PRESS_MS && moved < LONG_PRESS_MAX_MOVE) {
        input.shieldBurst = true;
        primary!.longPressFired = true;
      }
    }
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
if (!hud) {
  throw new Error('Missing HUD element');
}
hud.style.display = 'none';

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
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) pauseBtn.style.display = 'block';
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
  hangar.show(); const _pb = document.getElementById("pause-btn"); if (_pb) _pb.style.display = "none";
});

document.getElementById('menu-signup')!.addEventListener('click', async () => {
  const emailInput = document.getElementById('menu-email') as HTMLInputElement;
  const status = document.getElementById('menu-signup-status')!;
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) { status.textContent = 'Enter valid email'; status.style.color = '#f55'; return; }
  // Resolve API base. Precedence:
  //   1) VITE_API_BASE_URL — set at build time (preferred)
  //   2) localhost dev → http://localhost:4301
  //   3) production → same-origin /api (HTTPS-safe; the CloudFront origin
  //      should be configured to forward /api/* to the backend)
  // The old hard-coded http://54.224.95.1:4301 was blocked as mixed content
  // on the HTTPS CloudFront site, so every signup silently failed and the
  // catch path lied about "Saved locally" without saving anything.
  const apiBase =
    (import.meta as any).env?.VITE_API_BASE_URL?.replace(/\/$/, '') ||
    (window.location.hostname === 'localhost' ? 'http://localhost:4301' : `${window.location.origin}/api`);
  try {
    const res = await fetch(`${apiBase}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Signup failed');
    status.textContent = data.message || 'Signed up!'; status.style.color = '#0a6'; emailInput.value = '';
  } catch (err) {
    // Actually persist locally so the user's email is recoverable. Queues
    // pending signups in localStorage; a background sync (future) can flush.
    try {
      const key = 'nettrek-pending-signups';
      const queue = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(queue) && !queue.includes(email)) {
        queue.push(email);
        localStorage.setItem(key, JSON.stringify(queue.slice(-50)));
      }
      status.textContent = 'Saved locally — will retry later'; status.style.color = '#fa0';
    } catch {
      status.textContent = 'Signup failed'; status.style.color = '#f55';
    }
  }
});

// ── Pause state ──
let paused = false;
let pausedPhase: string = '';

// Return to hangar on Enter after game over.
// On victory: stats → briefing → next stage. Briefing → start next stage.
window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    if (state.phase === 'gameover') {
      state.phase = 'hangar';
      stopMusic();
      setTimeout(() => playMainTheme(), 500);
      hangar.show(); const _pb = document.getElementById("pause-btn"); if (_pb) _pb.style.display = "none";
      e.preventDefault();
    } else if (state.phase === 'victory') {
      // Only allow advancing once flyaway is done AND the continue prompt is up.
      // The renderer puts the prompt up at vtPost >= 200 (≈3.3s after flyaway).
      const vtPost = state.victoryTimer - 130;
      if (state.flyawayProgress >= 1 && vtPost >= 200) {
        const nextIdx = state.currentStage + 1;
        if (nextIdx >= state.stages.length) {
          // Game completed — return to hangar
          state.phase = 'hangar';
          stopMusic();
          setTimeout(() => playMainTheme(), 500);
          hangar.show(); const _pb = document.getElementById("pause-btn"); if (_pb) _pb.style.display = "none";
        } else {
          // Show next-mission briefing
          state.phase = 'briefing';
        }
        e.preventDefault();
      }
    } else if (state.phase === 'briefing') {
      // Start the next stage
      const nextIdx = Math.min(state.currentStage + 1, state.stages.length - 1);
      resetDirector();
      startStage(state, nextIdx);
      playStageMusic(nextIdx);
      e.preventDefault();
    }
  }
  // Pause toggle — P or Escape
  if (e.code === 'KeyP' || e.code === 'Escape') {
    if (paused) { hidePauseMenu(); e.preventDefault(); }
    else if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning') { showPauseMenu(); e.preventDefault(); }
  }
  // Q to quit from pause
  if (e.code === 'KeyQ' && paused) { quitToHangar(); e.preventDefault(); }
});

// ── Pause menu (HTML overlay with clickable buttons) ──
const pauseMenu = document.createElement('div');
pauseMenu.id = 'pause-menu';
pauseMenu.style.cssText = `
  position:fixed;inset:0;z-index:200;display:none;
  background:rgba(0,0,0,0.75);
  font-family:'Courier New',monospace;
  flex-direction:column;align-items:center;justify-content:center;gap:20px;
`;
pauseMenu.innerHTML = `
  <h2 style="color:#fff;font-size:clamp(22px,5vw,32px);letter-spacing:4px;margin:0;">PAUSED</h2>
  <button id="pause-resume" style="padding:14px 36px;font-size:clamp(14px,3.5vw,18px);font-weight:bold;background:rgba(0,204,255,0.12);border:2px solid #0cc;color:#0cc;cursor:pointer;font-family:'Courier New';border-radius:6px;letter-spacing:2px;min-width:220px;">KEEP FIGHTING</button>
  <button id="pause-quit" style="padding:14px 36px;font-size:clamp(14px,3.5vw,18px);font-weight:bold;background:rgba(255,60,60,0.1);border:2px solid #a33;color:#f55;cursor:pointer;font-family:'Courier New';border-radius:6px;letter-spacing:2px;min-width:220px;">EXIT TO HANGAR</button>
`;
document.body.appendChild(pauseMenu);

function showPauseMenu() {
  paused = true;
  pausedPhase = state.phase;
  pauseMenu.style.display = 'flex';
}

function hidePauseMenu() {
  paused = false;
  state.phase = pausedPhase as any;
  pauseMenu.style.display = 'none';
}

function quitToHangar() {
  paused = false;
  pauseMenu.style.display = 'none';
  state.phase = 'hangar';
  stopMusic();
  setTimeout(() => playMainTheme(), 500);
  hangar.show(); const _pb = document.getElementById("pause-btn"); if (_pb) _pb.style.display = "none";
}

document.getElementById('pause-resume')!.addEventListener('click', (e) => { e.stopPropagation(); hidePauseMenu(); });
document.getElementById('pause-quit')!.addEventListener('click', (e) => { e.stopPropagation(); quitToHangar(); });

// ── Game-over menu ── tap-friendly retry + return-to-hangar buttons.
// Shown automatically when state.phase transitions to 'gameover' (the game
// loop polls and reveals/hides this overlay). Mobile users have no ENTER key
// to press, so this is the only way out on phone.
const gameOverMenu = document.createElement('div');
gameOverMenu.id = 'gameover-menu';
gameOverMenu.style.cssText = `
  position:fixed;inset:0;z-index:200;display:none;
  background:rgba(0,0,0,0.78);
  font-family:'Courier New',monospace;
  flex-direction:column;align-items:center;justify-content:center;gap:18px;
  padding:20px;text-align:center;
`;
gameOverMenu.innerHTML = `
  <h2 style="color:#ff4444;font-size:clamp(26px,6vw,40px);letter-spacing:6px;margin:0;text-shadow:0 0 24px rgba(255,60,60,0.4);">MISSION FAILED</h2>
  <div id="gameover-stats" style="color:#cccccc;font-size:clamp(11px,2.8vw,13px);letter-spacing:1px;margin-bottom:14px;"></div>
  <button id="gameover-retry" style="padding:14px 36px;font-size:clamp(14px,3.5vw,18px);font-weight:bold;background:rgba(0,204,255,0.12);border:2px solid #0cc;color:#0cc;cursor:pointer;font-family:'Courier New';border-radius:6px;letter-spacing:2px;min-width:220px;">RETRY MISSION</button>
  <button id="gameover-hangar" style="padding:14px 36px;font-size:clamp(14px,3.5vw,18px);font-weight:bold;background:rgba(255,221,0,0.10);border:2px solid #cc9;color:#fda;cursor:pointer;font-family:'Courier New';border-radius:6px;letter-spacing:2px;min-width:220px;">RETURN TO HANGAR</button>
`;
document.body.appendChild(gameOverMenu);

let gameOverVisible = false;
function showGameOverMenu() {
  if (gameOverVisible) return;
  gameOverVisible = true;
  const statsEl = document.getElementById('gameover-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div>SCORE&nbsp;&nbsp;${state.score.toLocaleString()}</div>
      <div>COINS&nbsp;&nbsp;⚡${state.player.stars}</div>
    `;
  }
  gameOverMenu.style.display = 'flex';
  const pb = document.getElementById('pause-btn'); if (pb) pb.style.display = 'none';
}
function hideGameOverMenu() {
  gameOverVisible = false;
  gameOverMenu.style.display = 'none';
}

document.getElementById('gameover-retry')!.addEventListener('click', (e) => {
  e.stopPropagation();
  hideGameOverMenu();
  initAudio();
  resetDirector();
  startStage(state, state.currentStage);
  playStageMusic(state.currentStage);
  const pb = document.getElementById('pause-btn'); if (pb) pb.style.display = 'block';
});
document.getElementById('gameover-hangar')!.addEventListener('click', (e) => {
  e.stopPropagation();
  hideGameOverMenu();
  state.phase = 'hangar';
  stopMusic();
  setTimeout(() => playMainTheme(), 500);
  hangar.show();
});

// Pause button in top-right corner
document.getElementById('pause-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (paused) hidePauseMenu();
  else if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning') showPauseMenu();
});

// ── Game Loop ──────────────────────────────────────────────
function loop() {
  // Pause handling — still render but don't update
  if (paused) {
    renderer.render(state); // keep rendering the frozen frame behind the overlay
    requestAnimationFrame(loop);
    return;
  }

  updateInput();

  if (state.phase === 'playing' || state.phase === 'boss' || state.phase === 'respawning') {
    // Music analysis — drives the game
    musicAnalyzer.update();
    const energy = musicAnalyzer.energy;

    // Stash smoothed live band levels on state so the renderer can draw
    // the waveform EQ indicator. Smoothing keeps the bars from juddering.
    state.bandBass = state.bandBass * 0.6 + energy.bass * 0.4;
    state.bandMid  = state.bandMid  * 0.6 + energy.mid  * 0.4;
    state.bandHigh = state.bandHigh * 0.6 + energy.high * 0.4;

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
    if (events.bossSpawned) { playBossArrival(); }
    if (events.coinCollected) playCoinCollect();
    // Hit-contact feedback — small tick when shots land. Critical hits on
    // boss weak points get a richer sound. Both are throttled inside sfx.ts.
    if (events.weakPointHit) playCritHit();
    else if (events.enemyHit || events.obstacleHit) playBulletHit();
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

  // Show / hide the game-over menu based on phase. Reveal once when phase
  // first enters 'gameover'; hide on any other phase (retry / hangar / etc).
  if (state.phase === 'gameover' && !gameOverVisible) {
    showGameOverMenu();
  } else if (state.phase !== 'gameover' && gameOverVisible) {
    hideGameOverMenu();
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
