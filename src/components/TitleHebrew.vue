<script setup>
defineProps({
  state: Object,
  ambY: Number,
  ambS: Number,
  showAmbient: Boolean,
  isLit: Boolean,
  isTouchActive: Boolean
})

defineEmits(['click', 'mouseenter', 'mouseleave', 'touchstart'])
</script>

<template>
  <div
    class="title-he"
    :class="{
      'lit': isLit,
      'touch-active': isTouchActive
    }"
    data-link="teacher"
    :style="{
      left: state?.x + 'px',
      top: (state?.y + (showAmbient ? (ambY ?? 0) : 0)) + 'px',
      transform: `translate(-50%, -50%) scale(${(state?.scale ?? 1) * (showAmbient ? (ambS ?? 1) : 1)})`,
      opacity: state?.opacity ?? 0,
      pointerEvents: (state?.opacity ?? 0) > 0.5 ? 'auto' : 'none'
    }"
    @click="$emit('click', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @touchstart="$emit('touchstart', $event)"
  >קֹהֶלֶת</div>
</template>
