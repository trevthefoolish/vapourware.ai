<script lang="ts">
  /**
   * Chapter - Container for verses with GSAP ScrollTrigger integration
   *
   * Features:
   * - Scroll-driven verse reveal with pinning
   * - Smooth scrub animation between verses
   * - Snap-to-verse navigation
   * - Progress indicator
   * - Verse selector UI
   */
  import { onMount, onDestroy } from 'svelte';
  import Verse from './Verse.svelte';
  import Tooltip from './Tooltip.svelte';
  import type { Verse as VerseType, HebrewWord, TooltipData } from '$lib/types';
  import { scrollToVerse } from '$lib/stores/scroll';

  interface Props {
    book: string;
    bookHebrew: string;
    chapter: number;
    verses: VerseType[];
  }

  let { book, bookHebrew, chapter, verses }: Props = $props();

  let container: HTMLElement;
  let timeline: any = null;
  let currentVerseIndex = $state(0);
  let revealedVerses = $state<Set<number>>(new Set([0]));
  let scrollProgress = $state(0);
  let tooltipData = $state<TooltipData | null>(null);
  let selectorOpen = $state(false);

  // Track which verses are revealed
  $effect(() => {
    if (currentVerseIndex >= 0) {
      revealedVerses = new Set([...revealedVerses, currentVerseIndex]);
    }
  });

  function handleWordClick(word: HebrewWord, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const isHebrew = element.classList.contains('hebrew');

    tooltipData = {
      word,
      position: {
        x: rect.left + rect.width / 2,
        y: isHebrew ? rect.top : rect.bottom,
      },
      direction: isHebrew ? 'above' : 'below',
    };
  }

  function closeTooltip() {
    tooltipData = null;
  }

  function navigateToVerse(index: number) {
    currentVerseIndex = index;
    revealedVerses = new Set([...revealedVerses, index]);
    scrollToVerse(index + 1);
    selectorOpen = false;
  }

  function toggleSelector() {
    selectorOpen = !selectorOpen;
  }

  // Close selector when clicking outside
  function handleDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.verse-selector')) {
      selectorOpen = false;
    }
    if (!target.closest('.word') && !target.closest('.tooltip')) {
      closeTooltip();
    }
  }

  onMount(async () => {
    if (typeof window === 'undefined') return;

    const gsap = (await import('gsap')).default;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);

    // Create scroll-triggered timeline
    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${verses.length * 100}vh`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (verses.length - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          scrollProgress = self.progress;
          const newIndex = Math.round(self.progress * (verses.length - 1));
          if (newIndex !== currentVerseIndex) {
            currentVerseIndex = newIndex;
          }
        },
      },
    });

    // Add verse transitions to timeline
    verses.forEach((_, index) => {
      if (index < verses.length - 1) {
        timeline.to({}, { duration: 1 }, `verse${index}`);
      }
    });

    document.addEventListener('click', handleDocumentClick);

    return () => {
      timeline?.kill();
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleDocumentClick);
    }
  });
</script>

<section bind:this={container} class="chapter" aria-label="{book} Chapter {chapter}">
  <!-- Chapter header -->
  <header class="chapter-header">
    <h1 class="book-title english">{book}</h1>
    <h2 class="book-title-hebrew hebrew">{bookHebrew}</h2>
  </header>

  <!-- Verses container -->
  <div class="verses-container">
    {#each verses as verse, index (verse.number)}
      <Verse
        {verse}
        isActive={index === currentVerseIndex}
        isRevealed={revealedVerses.has(index)}
        onWordClick={handleWordClick}
      />
    {/each}
  </div>

  <!-- Verse selector -->
  <nav class="verse-selector" class:open={selectorOpen}>
    {#each verses as verse, index (verse.number)}
      <button
        class="verse-option"
        class:current={index === currentVerseIndex}
        onclick={() => navigateToVerse(index)}
        aria-label="Go to verse {verse.number}"
      >
        {chapter}:{verse.number}
      </button>
    {/each}
  </nav>

  <!-- Progress bar -->
  <div
    class="progress-bar"
    style:width="{scrollProgress * 100}%"
    role="progressbar"
    aria-valuenow={Math.round(scrollProgress * 100)}
    aria-valuemin={0}
    aria-valuemax={100}
  ></div>

  <!-- Tooltip -->
  {#if tooltipData}
    <Tooltip data={tooltipData} onClose={closeTooltip} />
  {/if}
</section>

<style>
  .chapter {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--bg-deep);
    padding: var(--space-lg);
  }

  .chapter-header {
    position: absolute;
    top: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    opacity: 0.8;
  }

  .book-title {
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .book-title-hebrew {
    font-size: var(--text-xl);
    color: var(--accent-gold);
    margin-top: var(--space-xs);
    text-shadow: var(--glow-hebrew);
    animation: glowPulse 2.5s ease-in-out infinite;
  }

  .verses-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
  }

  .verse-selector {
    position: fixed;
    top: var(--space-md);
    right: var(--space-md);
    display: flex;
    align-items: center;
    gap: 0;
    font-size: var(--text-sm);
    z-index: 100;
  }

  .verse-option {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 0.5em 0.75em;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    border-radius: 6px;
    transition: all 0.2s ease;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .verse-option.current {
    max-width: 5em;
    opacity: 1;
    color: var(--text-secondary);
  }

  .verse-option.current:hover {
    background: rgba(201, 162, 39, 0.1);
    color: var(--text-primary);
  }

  .verse-selector.open .verse-option {
    max-width: 5em;
    opacity: 1;
    color: var(--text-muted);
  }

  .verse-selector.open .verse-option:hover {
    background: rgba(201, 162, 39, 0.15);
    color: var(--text-primary);
  }

  .verse-selector.open .verse-option.current {
    color: var(--accent-gold);
  }

  .progress-bar {
    position: fixed;
    bottom: env(safe-area-inset-bottom, 0);
    left: 0;
    height: clamp(3px, 0.4vw, 5px);
    background: linear-gradient(
      90deg,
      rgba(201, 162, 39, 0.7),
      rgba(218, 188, 80, 0.85)
    );
    box-shadow: 0 0 12px rgba(201, 162, 39, 0.4);
    z-index: 100;
  }
</style>
