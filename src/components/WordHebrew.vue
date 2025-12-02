<script setup>
defineProps({
  text: String,
  link: String,
  isLit: Boolean,
  isLitStagger: Boolean,
  isTouchActive: Boolean,
  style: Object
})

defineEmits(['click', 'mouseenter', 'mouseleave', 'touchstart'])
</script>

<template>
  <span
    class="word-he"
    :class="{
      'lit': isLit,
      'lit-stagger': isLitStagger,
      'touch-active': isTouchActive
    }"
    :data-link="link"
    :style="style"
    @click="$emit('click', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @touchstart="$emit('touchstart', $event)"
  >{{ text }}</span>
</template>
