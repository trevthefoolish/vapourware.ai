/**
 * Animation stores using Svelte's built-in spring physics
 *
 * These stores provide reactive spring animations that integrate
 * naturally with Svelte's reactivity system.
 */

import { spring, tweened } from 'svelte/motion';
import { writable, derived } from 'svelte/store';
import { cubicOut, elasticOut } from 'svelte/easing';

/**
 * Default spring configuration matching the original vanilla JS implementation
 *
 * Original used: tension 30-90, friction 9-14
 * Svelte spring uses: stiffness (≈tension/10), damping (≈friction/10)
 */
export const springConfig = {
  standard: { stiffness: 0.08, damping: 0.25 },
  bouncy: { stiffness: 0.15, damping: 0.15 },
  smooth: { stiffness: 0.05, damping: 0.35 },
  snappy: { stiffness: 0.25, damping: 0.4 },
};

/**
 * Create a spring store for a single numeric value
 */
export function createSpring(initial: number = 0, config = springConfig.standard) {
  return spring(initial, config);
}

/**
 * Create a spring store for position (x, y)
 */
export function createPositionSpring(x: number = 0, y: number = 0, config = springConfig.standard) {
  return spring({ x, y }, config);
}

/**
 * Create a tweened store for timeline progress
 */
export function createTimeline(initial: number = 0) {
  return tweened(initial, {
    duration: 400,
    easing: cubicOut,
  });
}

/**
 * Current animation intensity (affects spring parameters)
 * Higher intensity = more responsive springs
 */
export const animationIntensity = writable(0);

// Decay intensity over time (like the original 0.92 multiplier)
let intensityDecayInterval: ReturnType<typeof setInterval> | null = null;

export function startIntensityDecay() {
  if (intensityDecayInterval) return;

  intensityDecayInterval = setInterval(() => {
    animationIntensity.update(i => {
      const newValue = i * 0.92;
      return newValue < 0.01 ? 0 : newValue;
    });
  }, 80);
}

export function stopIntensityDecay() {
  if (intensityDecayInterval) {
    clearInterval(intensityDecayInterval);
    intensityDecayInterval = null;
  }
}

/**
 * Adaptive spring config that responds to intensity
 */
export const adaptiveSpringConfig = derived(animationIntensity, ($intensity) => ({
  stiffness: 0.08 + ($intensity * 0.15),
  damping: 0.25 - ($intensity * 0.1),
}));

/**
 * Verse reveal state management
 */
export interface VerseState {
  index: number;
  isRevealed: boolean;
  isActive: boolean;
  wordProgress: number; // 0-1, how many words have been revealed
}

export const currentVerseIndex = writable(0);
export const revealedVerses = writable<Set<number>>(new Set([0]));

export function revealVerse(index: number) {
  revealedVerses.update(set => {
    set.add(index);
    return set;
  });
  currentVerseIndex.set(index);
}

export function setActiveVerse(index: number) {
  currentVerseIndex.set(index);
}
