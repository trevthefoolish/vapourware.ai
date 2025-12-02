import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Optimize GSAP and Motion for better tree-shaking
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger', 'motion']
  },
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020'
  }
});
