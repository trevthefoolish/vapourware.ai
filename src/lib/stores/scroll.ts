/**
 * Scroll management with Lenis smooth scrolling and GSAP ScrollTrigger integration
 *
 * Lenis provides buttery-smooth scrolling through linear interpolation (lerp),
 * while ScrollTrigger handles scroll-linked animation choreography.
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Scroll state
export const scrollProgress = writable(0);
export const scrollDirection = writable<'up' | 'down'>('down');
export const isScrolling = writable(false);

// Lenis instance (initialized on mount)
let lenis: any = null;

/**
 * Initialize Lenis smooth scrolling with GSAP integration
 */
export async function initLenis(): Promise<void> {
  if (!browser) return;

  const Lenis = (await import('lenis')).default;

  lenis = new Lenis({
    duration: 1.2,           // Scroll duration
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Track scroll progress
  lenis.on('scroll', ({ progress, direction }: { progress: number; direction: number }) => {
    scrollProgress.set(progress);
    scrollDirection.set(direction > 0 ? 'down' : 'up');
  });

  // Animation frame loop
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Integrate with GSAP ticker for ScrollTrigger sync
  initScrollTrigger();
}

/**
 * Initialize GSAP ScrollTrigger with Lenis integration
 */
export async function initScrollTrigger(): Promise<void> {
  if (!browser) return;

  const gsap = (await import('gsap')).default;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.registerPlugin(ScrollTrigger);

  // Sync Lenis scroll with ScrollTrigger
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time: number) => {
      lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
}

/**
 * Scroll to a specific verse
 */
export function scrollToVerse(verseNumber: number): void {
  if (!browser || !lenis) return;

  const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
  if (verseElement) {
    lenis.scrollTo(verseElement, {
      offset: -100, // Account for any fixed headers
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Ease out quart
    });
  }
}

/**
 * Stop smooth scrolling (for modal overlays, etc.)
 */
export function stopScroll(): void {
  lenis?.stop();
  isScrolling.set(false);
}

/**
 * Resume smooth scrolling
 */
export function startScroll(): void {
  lenis?.start();
}

/**
 * Clean up Lenis instance
 */
export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

/**
 * Get current Lenis instance (for advanced usage)
 */
export function getLenis(): any {
  return lenis;
}
