<script lang="ts">
  /**
   * Tooltip - Word information popup with spring animation
   *
   * Features:
   * - Glassmorphism design
   * - Direction-aware positioning (above/below target)
   * - Spring animation entrance
   * - Staggered content reveal
   */
  import { onMount } from 'svelte';
  import type { TooltipData } from '$lib/types';

  interface Props {
    data: TooltipData;
    onClose: () => void;
  }

  let { data, onClose }: Props = $props();

  let element: HTMLElement;
  let isVisible = $state(false);

  // Calculate position
  const style = $derived(() => {
    const tooltipWidth = Math.min(400, window.innerWidth * 0.85);
    let left = data.position.x - tooltipWidth / 2;

    // Keep within viewport
    const margin = 10;
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));

    let top = data.position.y;
    const offset = Math.max(14, window.innerWidth * 0.015);

    if (data.direction === 'above') {
      top -= offset;
    } else {
      top += offset;
    }

    return `
      left: ${left}px;
      top: ${top}px;
      max-width: ${tooltipWidth}px;
      ${data.direction === 'above' ? 'transform: translateY(-100%);' : ''}
    `;
  });

  onMount(async () => {
    // Animate in with Motion
    const { animate, spring } = await import('motion');

    // Small delay to allow DOM to settle
    await new Promise((r) => setTimeout(r, 10));

    isVisible = true;

    await animate(
      element,
      {
        opacity: [0, 1],
        scale: [0.9, 1],
        y: data.direction === 'above' ? [10, 0] : [-10, 0],
      },
      {
        type: spring,
        stiffness: 300,
        damping: 25,
      }
    );

    // Stagger content elements
    const content = element.querySelectorAll('.tooltip-content > *');
    await animate(
      content,
      { opacity: [0, 1], y: [10, 0] },
      { delay: (i) => 0.05 + i * 0.07, duration: 0.3 }
    );
  });
</script>

<div
  bind:this={element}
  class="tooltip"
  class:above={data.direction === 'above'}
  class:visible={isVisible}
  style={style()}
  role="tooltip"
  aria-label="Word information"
>
  <div class="tooltip-content">
    <div class="tooltip-hebrew hebrew">{data.word.hebrew}</div>
    <div class="tooltip-transliteration">{data.word.transliteration}</div>
    {#if data.word.tidbit}
      <div class="tooltip-tidbit">{data.word.tidbit}</div>
    {/if}
  </div>

  <button class="tooltip-close" onclick={onClose} aria-label="Close tooltip">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
      />
    </svg>
  </button>
</div>

<style>
  .tooltip {
    position: fixed;
    z-index: 1000;
    padding: 1em 1.25em;
    border-radius: 12px;

    /* Glassmorphism */
    background: rgba(20, 20, 30, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(201, 162, 39, 0.2);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 0 20px rgba(201, 162, 39, 0.1);

    /* Initial state */
    opacity: 0;
    pointer-events: none;
  }

  .tooltip.visible {
    pointer-events: auto;
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .tooltip-hebrew {
    font-size: var(--text-xl);
    color: var(--accent-gold);
    text-shadow: var(--glow-hebrew);
    text-align: center;
  }

  .tooltip-transliteration {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-style: italic;
    text-align: center;
    letter-spacing: 0.05em;
  }

  .tooltip-tidbit {
    font-size: var(--text-sm);
    color: var(--text-primary);
    line-height: 1.6;
    margin-top: 0.5em;
    padding-top: 0.75em;
    border-top: 1px solid rgba(201, 162, 39, 0.15);
  }

  .tooltip-close {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25em;
    border-radius: 4px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .tooltip-close:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.1);
  }

  /* Border shimmer animation */
  @keyframes borderShimmer {
    0%,
    100% {
      border-color: rgba(201, 162, 39, 0.2);
    }
    50% {
      border-color: rgba(201, 162, 39, 0.4);
    }
  }

  .tooltip.visible {
    animation: borderShimmer 3s ease-in-out infinite;
  }
</style>
