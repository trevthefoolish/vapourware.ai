<script lang="ts">
  /**
   * AnimatedWord - A single Hebrew or English word with spring-physics animations
   *
   * Features:
   * - Word reveal animation with Motion spring physics
   * - Glow pulse effect on hover/active state
   * - Touch feedback for mobile
   * - Linked highlighting across Hebrew/English pairs
   */
  import { onMount } from 'svelte';
  import type { HebrewWord } from '$lib/types';

  interface Props {
    word: HebrewWord;
    type: 'hebrew' | 'english';
    index: number;
    isRevealed?: boolean;
    isLit?: boolean;
    staggerDelay?: number;
    onWordClick?: (word: HebrewWord, element: HTMLElement) => void;
    onWordHover?: (word: HebrewWord | null, element: HTMLElement | null) => void;
  }

  let {
    word,
    type,
    index,
    isRevealed = false,
    isLit = false,
    staggerDelay = 0.08,
    onWordClick,
    onWordHover,
  }: Props = $props();

  let element: HTMLElement;
  let isTouchActive = $state(false);

  // Calculate animation delay based on index (derived for reactivity)
  const animationDelay = $derived(`${index * staggerDelay}s`);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onWordClick?.(word, element);
  }

  function handleMouseEnter() {
    onWordHover?.(word, element);
  }

  function handleMouseLeave() {
    onWordHover?.(null, null);
  }

  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    isTouchActive = true;
  }

  function handleTouchEnd(e: TouchEvent) {
    isTouchActive = false;
    onWordClick?.(word, element);
  }

  // Animate word reveal when isRevealed becomes true
  onMount(async () => {
    if (isRevealed && element) {
      // Use Motion for spring-physics reveal
      const { animate, spring } = await import('motion');

      await animate(
        element,
        {
          opacity: [0, 1],
          y: [30, 0],
          scale: [0.95, 1],
          filter: ['blur(4px)', 'blur(0px)'],
        },
        {
          delay: index * staggerDelay,
          type: spring,
          stiffness: 200,
          damping: 20,
        }
      );
    }
  });
</script>

<span
  bind:this={element}
  class="word"
  class:hebrew={type === 'hebrew'}
  class:english={type === 'english'}
  class:revealed={isRevealed}
  class:lit={isLit}
  class:touch-active={isTouchActive}
  data-link={word.linkId}
  style:animation-delay={animationDelay}
  role="button"
  tabindex="0"
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  onkeydown={(e) => e.key === 'Enter' && handleClick(e as any)}
>
  {type === 'hebrew' ? word.hebrew : word.english}
</span>

<style>
  .word {
    padding: 0.1em 0.15em;
    cursor: pointer;
    transition: color 0.25s ease, text-shadow 0.25s ease, transform 0.1s ease;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    user-select: none;
  }

  /* Hebrew word styles */
  .word.hebrew {
    font-family: var(--font-hebrew);
    font-size: var(--text-xl);
    font-weight: 400;
    color: var(--accent-gold);
    padding: 0.15em 0.2em;
  }

  .word.hebrew.lit {
    color: #f0d060;
    text-shadow: 0 0 20px rgba(218, 165, 32, 0.6);
    animation: glowPulse 2.5s ease-in-out infinite;
  }

  .word.hebrew.revealed {
    animation: wordReveal 0.4s var(--spring-bounce) forwards;
  }

  .word.hebrew.revealed.lit {
    animation:
      wordReveal 0.4s var(--spring-bounce) forwards,
      glowPulse 2.5s ease-in-out 0.4s infinite;
  }

  /* English word styles */
  .word.english {
    font-family: var(--font-english);
    font-size: var(--text-base);
    font-weight: 400;
    font-style: italic;
    color: var(--text-secondary);
  }

  .word.english.lit {
    color: #fff;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    animation: glowPulse 2.5s ease-in-out infinite;
  }

  .word.english.revealed {
    animation: wordReveal 0.4s var(--spring-bounce) forwards;
  }

  /* Touch feedback */
  .word.touch-active {
    transform: scale(0.95);
  }

  /* Focus state for accessibility */
  .word:focus-visible {
    outline: 2px solid var(--accent-gold);
    outline-offset: 2px;
    border-radius: 4px;
  }
</style>
