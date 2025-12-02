<script setup>
defineProps({
  text: String,
  link: String,
  isLit: Boolean,
  isLitStagger: Boolean,
  isTouchActive: Boolean
})

defineEmits(['click', 'mouseenter', 'mouseleave', 'touchstart'])
</script>

<template>
  <span
    class="word-en"
    :class="{
      'lit': isLit,
      'lit-stagger': isLitStagger,
      'touch-active': isTouchActive
    }"
    :data-link="link"
    @click="$emit('click', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @touchstart="$emit('touchstart', $event)"
  >{{ text }}</span>
</template>
