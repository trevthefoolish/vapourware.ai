<script setup>
defineProps({
  state: Object,
  ambY: Number
})
</script>

<template>
  <div
    class="title-en"
    :style="{
      left: state?.x + 'px',
      top: (state?.y + (state?.opacity > 0.5 ? (ambY ?? 0) * 0.5 : 0)) + 'px',
      transform: 'translate(-50%, -50%)',
      opacity: state?.opacity ?? 0
    }"
  >
    Ecclesiastes
  </div>
</template>
