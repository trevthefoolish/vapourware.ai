<script lang="ts">
  /**
   * Verse - A complete verse with Hebrew text and English translation
   *
   * Features:
   * - Staggered word-by-word reveal animation
   * - RTL Hebrew text with proper wrapping
   * - Linked word highlighting between Hebrew and English
   * - Integration with scroll-triggered animations
   */
  import { onMount } from 'svelte';
  import AnimatedWord from './AnimatedWord.svelte';
  import type { Verse as VerseType, HebrewWord } from '$lib/types';

  interface Props {
    verse: VerseType;
    isActive?: boolean;
    isRevealed?: boolean;
    onWordClick?: (word: HebrewWord, element: HTMLElement) => void;
    highlightedLink?: string | null;
  }

  let {
    verse,
    isActive = false,
    isRevealed = false,
    onWordClick,
    highlightedLink = null,
  }: Props = $props();

  let container: HTMLElement;
  let localHighlight = $state<string | null>(null);

  // Use either external or local highlight
  const activeHighlight = $derived(highlightedLink ?? localHighlight);

  function handleWordClick(word: HebrewWord, element: HTMLElement) {
    // Toggle local highlight if same word, otherwise set new highlight
    if (localHighlight === word.linkId) {
      localHighlight = null;
    } else {
      localHighlight = word.linkId ?? null;
    }
    onWordClick?.(word, element);
  }

  function handleWordHover(word: HebrewWord | null) {
    // Only show hover highlight if no word is actively selected
    if (!localHighlight) {
      localHighlight = word?.linkId ?? null;
    }
  }

  // Clear highlight when clicking outside words
  function handleContainerClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.word')) {
      localHighlight = null;
    }
  }

  // Animate verse reveal when it becomes active
  onMount(async () => {
    if (isRevealed && container) {
      const { animate, stagger, spring } = await import('motion');
      const words = container.querySelectorAll('.word');

      if (words.length) {
        await animate(
          words,
          {
            opacity: [0, 1],
            y: [30, 0],
            scale: [0.95, 1],
            filter: ['blur(4px)', 'blur(0px)'],
          },
          {
            delay: stagger(0.08),
            type: spring,
            stiffness: 200,
            damping: 20,
          }
        );
      }
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<div
  bind:this={container}
  class="verse"
  class:active={isActive}
  class:revealed={isRevealed}
  data-verse={verse.number}
  onclick={handleContainerClick}
  role="article"
  aria-label="Verse {verse.number}"
>
  <!-- Hebrew text (RTL) -->
  <div class="verse-hebrew hebrew" dir="rtl">
    {#each verse.hebrew as word, i (word.hebrew + i)}
      <AnimatedWord
        {word}
        type="hebrew"
        index={i}
        isRevealed={isRevealed}
        isLit={activeHighlight === word.linkId}
        onWordClick={handleWordClick}
        onWordHover={handleWordHover}
      />
    {/each}
  </div>

  <!-- English translation -->
  <div class="verse-english english">
    {#each verse.hebrew as word, i (word.english + i)}
      <AnimatedWord
        {word}
        type="english"
        index={i + verse.hebrew.length}
        isRevealed={isRevealed}
        isLit={activeHighlight === word.linkId}
        onWordClick={handleWordClick}
        onWordHover={handleWordHover}
      />
    {/each}
  </div>
</div>

<style>
  .verse {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    max-width: min(90vw, 900px);
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .verse.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .verse.active {
    /* Active verse gets full opacity */
  }

  .verse-hebrew {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: baseline;
    gap: 0.3em 0.45em;
    line-height: 1.6;
  }

  .verse-english {
    font-size: var(--text-base);
    font-weight: 400;
    font-style: italic;
    line-height: 2.2;
    margin-top: 0.5em;
    text-align: center;
    color: var(--text-secondary);
    letter-spacing: 0.03em;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 0.15em;
  }
</style>
