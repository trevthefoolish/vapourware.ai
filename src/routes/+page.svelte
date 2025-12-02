<script lang="ts">
  import { onMount } from 'svelte';
  import Chapter from '$lib/components/Chapter.svelte';
  import { ecclesiastes1 } from '$lib/data/ecclesiastes';
  import { initScrollTrigger } from '$lib/stores/scroll';

  onMount(() => {
    initScrollTrigger();
  });
</script>

<main class="bible-reader">
  <Chapter
    book="Ecclesiastes"
    bookHebrew="קֹהֶלֶת"
    chapter={1}
    verses={ecclesiastes1}
  />
</main>

<style>
  .bible-reader {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-deep);
  }
</style>
