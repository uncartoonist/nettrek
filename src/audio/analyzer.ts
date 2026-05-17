// MusicAnalyzer — real-time FFT analysis of the music track
// Extracts bass, mid, high energy + beat detection every frame

export interface MusicEnergy {
  bass: number;       // 0-1 — kick drums, low rumble
  mid: number;        // 0-1 — snares, vocals, body
  high: number;       // 0-1 — hihats, sparkle, detail
  overall: number;    // 0-1 — total energy
  bassHit: boolean;   // true on bass transient (kick detection)
  midHit: boolean;    // true on mid transient (snare detection)
  isBuildUp: boolean; // true when energy is steadily rising
  isQuiet: boolean;   // true when energy drops below threshold
  isDrop: boolean;    // true on frame energy spikes after quiet
  raw: any;    // full frequency data for visualization
}

const FFT_SIZE = 512;
const BASS_END = 8;      // bins 0-8 (~0-340Hz)
const MID_START = 8;
const MID_END = 40;      // bins 8-40 (~340-1700Hz)
const HIGH_START = 40;
const HIGH_END = 128;    // bins 40-128 (~1700-5500Hz)

const BEAT_THRESHOLD = 1.4;  // energy must be 1.4x the recent average to count as beat
const BEAT_COOLDOWN = 12;    // minimum frames between beats (prevents double-triggers)
const QUIET_THRESHOLD = 0.08;
const BUILD_WINDOW = 60;     // frames to track for build-up detection

export class MusicAnalyzer {
  private ctx: AudioContext;
  private analyser: AnalyserNode;
  private source: MediaElementAudioSourceNode | null = null;
  private freqData: Uint8Array;
  private connected = false;

  // Beat detection state
  private bassHistory: number[] = [];
  private midHistory: number[] = [];
  private energyHistory: number[] = [];
  private bassCooldown = 0;
  private midCooldown = 0;
  private lastEnergy = 0;
  private quietFrames = 0;

  // Current frame output
  private _energy: MusicEnergy;

  constructor() {
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.smoothingTimeConstant = 0.75;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this._energy = this.emptyEnergy();
  }

  get energy(): MusicEnergy { return this._energy; }
  get audioContext(): AudioContext { return this.ctx; }

  // Connect an HTMLAudioElement to the analyzer chain
  connectAudio(audio: HTMLAudioElement): void {
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Disconnect previous source
    if (this.source) {
      try { this.source.disconnect(); } catch {}
    }

    try {
      this.source = this.ctx.createMediaElementSource(audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.connected = true;
    } catch {
      // MediaElementSource can only be created once per element
      // If re-connecting same element, just resume
      this.connected = true;
    }
  }

  // Call every frame to update energy readings
  update(): void {
    if (!this.connected) {
      this._energy = this.emptyEnergy();
      return;
    }

    this.analyser.getByteFrequencyData(this.freqData as any);

    // Calculate band energies (0-1 normalized)
    const bass = this.bandEnergy(0, BASS_END);
    const mid = this.bandEnergy(MID_START, MID_END);
    const high = this.bandEnergy(HIGH_START, HIGH_END);
    const overall = bass * 0.4 + mid * 0.35 + high * 0.25;

    // Track history for beat detection
    this.bassHistory.push(bass);
    this.midHistory.push(mid);
    this.energyHistory.push(overall);
    if (this.bassHistory.length > BUILD_WINDOW) this.bassHistory.shift();
    if (this.midHistory.length > BUILD_WINDOW) this.midHistory.shift();
    if (this.energyHistory.length > BUILD_WINDOW) this.energyHistory.shift();

    // Beat detection — compare current energy to recent average
    const bassAvg = this.avg(this.bassHistory);
    const midAvg = this.avg(this.midHistory);

    let bassHit = false;
    let midHit = false;

    this.bassCooldown--;
    this.midCooldown--;

    if (bass > bassAvg * BEAT_THRESHOLD && bass > 0.15 && this.bassCooldown <= 0) {
      bassHit = true;
      this.bassCooldown = BEAT_COOLDOWN;
    }
    if (mid > midAvg * BEAT_THRESHOLD && mid > 0.12 && this.midCooldown <= 0) {
      midHit = true;
      this.midCooldown = BEAT_COOLDOWN;
    }

    // Quiet detection
    const isQuiet = overall < QUIET_THRESHOLD;
    if (isQuiet) this.quietFrames++;
    else this.quietFrames = 0;

    // Build-up detection — energy trending upward over BUILD_WINDOW
    let isBuildUp = false;
    if (this.energyHistory.length >= BUILD_WINDOW) {
      const firstHalf = this.avg(this.energyHistory.slice(0, BUILD_WINDOW / 2));
      const secondHalf = this.avg(this.energyHistory.slice(BUILD_WINDOW / 2));
      isBuildUp = secondHalf > firstHalf * 1.3 && secondHalf > 0.2;
    }

    // Drop detection — big energy spike after quiet period
    const isDrop = this.quietFrames === 0 && overall > 0.4 && this.lastEnergy < 0.15;

    this.lastEnergy = overall;

    this._energy = {
      bass, mid, high, overall,
      bassHit, midHit,
      isBuildUp, isQuiet: this.quietFrames > 30, isDrop,
      raw: this.freqData,
    };
  }

  private bandEnergy(start: number, end: number): number {
    let sum = 0;
    const count = end - start;
    for (let i = start; i < end && i < this.freqData.length; i++) {
      sum += this.freqData[i];
    }
    return (sum / count) / 255; // normalize to 0-1
  }

  private avg(arr: number[]): number {
    if (arr.length === 0) return 0;
    let sum = 0;
    for (const v of arr) sum += v;
    return sum / arr.length;
  }

  private emptyEnergy(): MusicEnergy {
    return {
      bass: 0, mid: 0, high: 0, overall: 0,
      bassHit: false, midHit: false,
      isBuildUp: false, isQuiet: true, isDrop: false,
      raw: new Uint8Array(0),
    };
  }
}
