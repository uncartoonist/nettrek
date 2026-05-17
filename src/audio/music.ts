// Music manager — plays through Web Audio API for analyzer access

import { MusicAnalyzer } from './analyzer';

const MAIN_THEME = '/music/Orbital Billing-maintheme.mp3';

const STAGE_TRACKS: string[] = [
  '/music/Bass Barcode.mp3',            // Stage 1: Neutral Zone
  '/music/Circuit Synesthesia.mp3',     // Stage 2: Romulan Nebula
  '/music/Loop Circuit Love.mp3',       // Stage 3: Orion Syndicate
  '/music/Gravitational Lull.mp3',      // Stage 4: Gravity Well (NEW)
  '/music/Static Pulse.mp3',            // Stage 5: Deep Space Anomaly
  '/music/Ultrasonic Pilgrimage.mp3',   // Stage 6: Wormhole Transit
  '/music/Nebula Drumline.mp3',         // Stage 7: Final Fortress
  '/music/Dark Lattice Groove.mp3',     // Stage 8: Black Hole Perimeter
  '/music/Gravitational Lull1.mp3',     // Stage 9: Singularity Core (NEW)
  '/music/Subglobe Drone.mp3',          // Stage 10: Subspace Rift
  '/music/Static Pulse.mp3',            // Stage 11: Omega Citadel
];

let currentAudio: HTMLAudioElement | null = null;
let currentTrack = '';
let volume = 0.4;
let analyzer: MusicAnalyzer | null = null;

export function setAnalyzer(a: MusicAnalyzer): void {
  analyzer = a;
}

export function playMainTheme(): void {
  playTrack(MAIN_THEME);
}

export function playStageMusic(stageIdx: number): void {
  const track = STAGE_TRACKS[stageIdx % STAGE_TRACKS.length];
  playTrack(track);
}

function playTrack(track: string): void {
  if (track === currentTrack && currentAudio && !currentAudio.paused) return;

  stopMusic();
  currentTrack = track;
  currentAudio = new Audio(track);
  currentAudio.crossOrigin = 'anonymous'; // required for analyzer
  currentAudio.loop = true;
  currentAudio.volume = 0;

  // Connect to analyzer if available
  if (analyzer) {
    try {
      analyzer.connectAudio(currentAudio);
    } catch {
      // Fallback — play without analyzer
    }
  }

  currentAudio.play().catch(() => {});

  // Fade in
  let fadeVol = 0;
  const fadeIn = setInterval(() => {
    fadeVol += 0.02;
    if (currentAudio) currentAudio.volume = Math.min(fadeVol, volume);
    if (fadeVol >= volume) clearInterval(fadeIn);
  }, 50);
}

export function stopMusic(): void {
  if (currentAudio) {
    const audio = currentAudio;
    let fadeVol = audio.volume;
    const fadeOut = setInterval(() => {
      fadeVol -= 0.03;
      audio.volume = Math.max(0, fadeVol);
      if (fadeVol <= 0) {
        clearInterval(fadeOut);
        audio.pause();
        audio.src = '';
      }
    }, 40);
    currentAudio = null;
    currentTrack = '';
  }
}

export function setMusicVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (currentAudio) currentAudio.volume = volume;
}
