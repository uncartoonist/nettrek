// Web Audio SFX — Trek-inspired sound design

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function initAudio(): void {
  const a = ac();
  a.resume().then(() => {
    const o = a.createOscillator();
    const g = a.createGain(); g.gain.value = 0;
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.001);
  });
}

function osc(type: OscillatorType, freq: number, freqEnd: number, dur: number, vol: number, delay = 0): void {
  const a = ac(); const t = a.currentTime + delay;
  const o = a.createOscillator(); const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + dur);
}

function noise(dur: number, vol: number, freqStart: number, freqEnd: number, delay = 0): void {
  const a = ac(); const t = a.currentTime + delay;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = a.createBufferSource(); src.buffer = buf;
  const filt = a.createBiquadFilter(); filt.type = 'lowpass';
  filt.frequency.setValueAtTime(freqStart, t);
  filt.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(filt); filt.connect(g); g.connect(a.destination);
  src.start(t);
}

// ── EXPLOSIONS — multiple variations, randomized ──

export function playExplosion(): void {
  const variant = Math.floor(Math.random() * 4);
  switch (variant) {
    case 0:
      // Classic photon torpedo impact — deep thud + crackle
      noise(0.5, 0.3, 500, 40);
      osc('sine', 80, 30, 0.3, 0.15);
      noise(0.2, 0.1, 2000, 400, 0.05); // crackle
      break;
    case 1:
      // Disruptor hit — sharp crack then rumble
      noise(0.08, 0.25, 3000, 800);
      noise(0.5, 0.2, 400, 30, 0.06);
      osc('sawtooth', 120, 25, 0.25, 0.1, 0.04);
      break;
    case 2:
      // Warp core breach — rising tone then deep boom
      osc('sine', 200, 500, 0.12, 0.12);
      noise(0.6, 0.28, 600, 25, 0.1);
      osc('triangle', 60, 20, 0.4, 0.1, 0.12);
      break;
    case 3:
      // Hull rupture — metallic crunch
      noise(0.1, 0.2, 4000, 1000);
      noise(0.4, 0.22, 300, 40, 0.05);
      osc('square', 150, 40, 0.15, 0.06, 0.03);
      osc('sine', 50, 25, 0.3, 0.08, 0.1);
      break;
  }
}

// Big ship explosion — longer, more dramatic
export function playBigExplosion(): void {
  noise(0.15, 0.2, 3000, 600);
  noise(0.7, 0.3, 500, 25, 0.08);
  osc('sine', 100, 20, 0.5, 0.15, 0.05);
  osc('triangle', 60, 15, 0.6, 0.1, 0.15);
  // Secondary detonation
  noise(0.4, 0.15, 400, 30, 0.25);
  osc('sine', 80, 25, 0.3, 0.08, 0.3);
}

export function playPlayerHit(): void {
  noise(0.25, 0.3, 500, 40);
  osc('square', 200, 60, 0.15, 0.1);
}

export function playShieldHit(): void {
  osc('triangle', 250, 80, 0.08, 0.1);
}

// ── POWERUP SOUNDS — distinct per type ──

export function playPowerUpWeapon(): void {
  // Ascending power-up chime
  osc('sine', 600, 1200, 0.15, 0.1);
  osc('sine', 900, 1600, 0.12, 0.08, 0.08);
  osc('triangle', 1200, 2000, 0.1, 0.05, 0.14);
}

export function playPowerUpShield(): void {
  // Warm harmonic hum
  osc('sine', 300, 400, 0.25, 0.1);
  osc('sine', 450, 600, 0.2, 0.06, 0.05);
}

export function playPowerUpSpecial(): void {
  // Sci-fi warp sound
  osc('sawtooth', 400, 1500, 0.2, 0.08);
  osc('sine', 800, 200, 0.15, 0.06, 0.1);
}

export function playCoinCollect(): void {
  // Cash register bling — two-tone sparkle
  const a = ac(); const t = a.currentTime;
  const o1 = a.createOscillator(); const g1 = a.createGain();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(2200, t); o1.frequency.setValueAtTime(2800, t + 0.03);
  g1.gain.setValueAtTime(0.08, t); g1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  o1.connect(g1); g1.connect(a.destination);
  o1.start(t); o1.stop(t + 0.07);
  const o2 = a.createOscillator(); const g2 = a.createGain();
  o2.type = 'sine';
  o2.frequency.setValueAtTime(3300, t + 0.03); o2.frequency.setValueAtTime(4000, t + 0.05);
  g2.gain.setValueAtTime(0, t); g2.gain.setValueAtTime(0.06, t + 0.03);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  o2.connect(g2); g2.connect(a.destination);
  o2.start(t + 0.03); o2.stop(t + 0.1);
}

export function playBomb(): void {
  // Screen-clearing detonation wave
  osc('sine', 200, 800, 0.15, 0.15);
  noise(0.6, 0.25, 800, 30, 0.1);
  osc('triangle', 100, 20, 0.5, 0.1, 0.15);
}

export function playPhaser(): void {
  osc('sine', 1200, 400, 0.3, 0.1);
  osc('sine', 1250, 380, 0.3, 0.06);
}

// ── Hit contact — quick tick when a player bullet connects ──
// Throttled by the caller; this should be tiny so it never
// overwhelms explosions or music. Subtle but consistent feedback
// that shots are landing.
let lastHitTime = 0;
export function playBulletHit(): void {
  const a = ac();
  const now = a.currentTime;
  // Throttle to ~12 hits/sec max so it doesn't machine-gun
  if (now - lastHitTime < 0.045) return;
  lastHitTime = now;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'square';
  // Slight pitch randomization so it doesn't get repetitive
  const f0 = 1700 + Math.random() * 400;
  o.frequency.setValueAtTime(f0, now);
  o.frequency.exponentialRampToValueAtTime(800, now + 0.04);
  g.gain.setValueAtTime(0.045, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  o.connect(g); g.connect(a.destination);
  o.start(now); o.stop(now + 0.05);
}

// Heavier hit for crit weak-point hits
let lastCritTime = 0;
export function playCritHit(): void {
  const a = ac();
  const now = a.currentTime;
  if (now - lastCritTime < 0.06) return;
  lastCritTime = now;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(2400, now);
  o.frequency.exponentialRampToValueAtTime(900, now + 0.07);
  g.gain.setValueAtTime(0.08, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  o.connect(g); g.connect(a.destination);
  o.start(now); o.stop(now + 0.08);
}

export function playCloak(): void {
  osc('sine', 300, 1200, 0.25, 0.1);
}

export function playEngineHum(speed: number): void {
  if (speed < 2) return;
  osc('sawtooth', 30 + speed * 4, 25 + speed * 3, 0.06, 0.03);
}
