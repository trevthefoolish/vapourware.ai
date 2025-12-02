<script setup>
defineProps({
  progress: Number
})
</script>

<template>
  <div
    class="progress"
    :style="{ width: (progress * 100) + '%' }"
  />
</template>
