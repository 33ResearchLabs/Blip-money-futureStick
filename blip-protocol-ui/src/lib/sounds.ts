/* ============================================
   LINEAR-INSPIRED SOUND EFFECTS SYSTEM
   Subtle, satisfying interaction sounds
   ============================================ */

// Sound URLs - Using Web Audio API synthesized sounds
// Lazy-init AudioContext on first user interaction to avoid browser autoplay warning
let _audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_audioContext) {
    _audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return _audioContext;
}

// Enable/disable sounds globally
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  localStorage.setItem('soundEnabled', String(enabled));
};

export const getSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('soundEnabled');
  return stored === null ? true : stored === 'true';
};

// Initialize sound state
if (typeof window !== 'undefined') {
  soundEnabled = getSoundEnabled();
}

/* ---------------- Sound Generators ---------------- */

// Soft click sound
const playClick = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
};

// Soft hover sound
const playHover = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.03);

  gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.03);
};

// Success sound
const playSuccess = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const playNote = (freq: number, startTime: number, duration: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0.06, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playNote(523.25, now, 0.1);        // C5
  playNote(659.25, now + 0.08, 0.1); // E5
  playNote(783.99, now + 0.16, 0.15); // G5
};

// Error sound
const playError = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

// Toggle switch sound
const playToggle = (on: boolean) => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';

  if (on) {
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
  } else {
    oscillator.frequency.setValueAtTime(900, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
  }

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.08);
};

// Pop sound
const playPop = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
};

// Whoosh sound (for transitions)
const playWhoosh = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  noise.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);
  filter.Q.value = 1;

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.15);
};

// Tick sound (for typing)
const playTick = () => {
  const ctx = getAudioContext();
  if (!ctx || !soundEnabled) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1800 + Math.random() * 200, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.015);
};

/* ---------------- Export Sound Functions ---------------- */

export const sounds = {
  click: playClick,
  hover: playHover,
  success: playSuccess,
  error: playError,
  toggle: playToggle,
  pop: playPop,
  whoosh: playWhoosh,
  tick: playTick,
};

/* ---------------- React Hooks ---------------- */

import { useCallback, useRef } from 'react';

// Hook for click sound
export const useClickSound = () => {
  return useCallback(() => {
    playClick();
  }, []);
};

// Hook for hover sound with debounce
export const useHoverSound = (debounceMs = 50) => {
  const lastPlayedRef = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastPlayedRef.current > debounceMs) {
      playHover();
      lastPlayedRef.current = now;
    }
  }, [debounceMs]);
};

// Hook for typing sounds
export const useTypingSound = () => {
  return useCallback(() => {
    playTick();
  }, []);
};

// Combined hook for interactive elements
export const useInteractionSounds = () => {
  const playClickSound = useClickSound();
  const playHoverSound = useHoverSound();

  return {
    onClick: playClickSound,
    onMouseEnter: playHoverSound,
  };
};

/* ---------------- Initialize Audio Context on First Interaction ---------------- */

export const initializeAudio = () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
};

// Auto-initialize on first user interaction
if (typeof window !== 'undefined') {
  const initOnInteraction = () => {
    initializeAudio();
    window.removeEventListener('click', initOnInteraction);
    window.removeEventListener('keydown', initOnInteraction);
    window.removeEventListener('touchstart', initOnInteraction);
  };

  window.addEventListener('click', initOnInteraction);
  window.addEventListener('keydown', initOnInteraction);
  window.addEventListener('touchstart', initOnInteraction);
}

export default sounds;
