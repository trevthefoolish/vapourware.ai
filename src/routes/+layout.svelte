<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initLenis, destroyLenis } from '$lib/stores/scroll';

  let { children } = $props();

  onMount(() => {
    initLenis();
    return () => destroyLenis();
  });
</script>

<svelte:head>
  <title>Hebrew Bible - Cinematic Experience</title>
</svelte:head>

{@render children()}
