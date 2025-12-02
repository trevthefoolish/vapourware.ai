/**
 * Motion animation utilities
 *
 * Provides spring-physics animations using the Motion library.
 * Motion runs on the Web Animations API for GPU acceleration.
 */

import { browser } from '$app/environment';

// Types for animation options
export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface RevealOptions {
  staggerDelay?: number;
  spring?: SpringOptions;
  blur?: boolean;
}

// Default spring configurations
export const springs = {
  // Cinematic word reveal - bouncy but controlled
  wordReveal: { stiffness: 200, damping: 20, mass: 1 },

  // Subtle breathing/glow animation
  breathing: { stiffness: 100, damping: 30, mass: 1 },

  // Snappy UI interactions
  snappy: { stiffness: 400, damping: 30, mass: 0.5 },

  // Smooth transitions
  smooth: { stiffness: 150, damping: 25, mass: 1 },
};

/**
 * Animate word-by-word reveal with spring physics
 *
 * @param selector - CSS selector for word elements
 * @param options - Animation configuration
 */
export async function animateWordReveal(
  selector: string | Element[],
  options: RevealOptions = {}
): Promise<void> {
  if (!browser) return;

  const { animate, stagger, spring } = await import('motion');

  const {
    staggerDelay = 0.08, // 80ms between words
    spring: springOpts = springs.wordReveal,
    blur = true,
  } = options;

  const elements = typeof selector === 'string'
    ? document.querySelectorAll(selector)
    : selector;

  if (!elements.length) return;

  const keyframes = blur
    ? {
        opacity: [0, 1],
        y: [30, 0],
        scale: [0.95, 1],
        filter: ['blur(4px)', 'blur(0px)'],
      }
    : {
        opacity: [0, 1],
        y: [20, 0],
        scale: [0.98, 1],
      };

  await animate(elements, keyframes, {
    delay: stagger(staggerDelay),
    type: spring,
    ...springOpts,
  });
}

/**
 * Animate breathing glow effect on Hebrew text
 *
 * @param selector - CSS selector for text elements
 */
export async function animateBreathingGlow(selector: string): Promise<void> {
  if (!browser) return;

  const gsap = (await import('gsap')).default;

  gsap.to(selector, {
    textShadow: '0 0 30px rgba(201, 162, 39, 0.6), 0 0 60px rgba(201, 162, 39, 0.3)',
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/**
 * Create scroll-triggered verse reveal timeline
 *
 * @param container - Container element
 * @param verses - Array of verse elements
 */
export async function createVerseTimeline(
  container: Element,
  verses: Element[]
): Promise<any> {
  if (!browser) return null;

  const gsap = (await import('gsap')).default;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.registerPlugin(ScrollTrigger);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${verses.length * 100}%`,
      pin: true,
      scrub: 1, // 1 second smooth lag for cinematic feel
      snap: {
        snapTo: 'labels',
        duration: { min: 0.3, max: 0.6 },
        ease: 'power2.inOut',
      },
    },
  });

  verses.forEach((verse, index) => {
    const label = `verse${index + 1}`;
    const words = verse.querySelectorAll('.word');

    timeline
      .addLabel(label)
      .fromTo(
        words,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.2)',
        },
        label
      );
  });

  return timeline;
}

/**
 * Animate element into view with spring physics
 */
export async function animateInView(element: Element): Promise<void> {
  if (!browser) return;

  const { animate, spring } = await import('motion');

  await animate(
    element,
    {
      opacity: [0, 1],
      scale: [0.95, 1],
      y: [20, 0],
    },
    {
      type: spring,
      ...springs.smooth,
    }
  );
}

/**
 * Animate tooltip appearance
 */
export async function animateTooltip(
  element: Element,
  direction: 'in' | 'out'
): Promise<void> {
  if (!browser) return;

  const { animate, spring } = await import('motion');

  if (direction === 'in') {
    await animate(
      element,
      {
        opacity: [0, 1],
        scale: [0.9, 1],
        y: [10, 0],
      },
      {
        type: spring,
        stiffness: 300,
        damping: 25,
      }
    );
  } else {
    await animate(
      element,
      {
        opacity: [1, 0],
        scale: [1, 0.95],
      },
      {
        duration: 0.15,
        easing: 'ease-out',
      }
    );
  }
}
