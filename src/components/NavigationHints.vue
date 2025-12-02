<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  position: Number
})

const emit = defineEmits(['tap-hint-hidden'])

const scrollHintHidden = ref(false)
const tapHintVisible = ref(false)
const tapHintHidden = ref(false)

// Hide scroll hint when user starts scrolling
watch(() => props.position, (p) => {
  if (p > 0.3 && !scrollHintHidden.value) {
    scrollHintHidden.value = true
  }

  // Show tap hint when on Qohelet-only screen (anchor 2)
  if (p > 1.8 && p < 2.2 && !tapHintHidden.value) {
    tapHintVisible.value = true
  } else if (p < 1.5 || p > 2.5) {
    if (tapHintVisible.value) {
      hideTapHint()
    }
  }
})

function hideTapHint() {
  if (tapHintVisible.value) {
    tapHintHidden.value = true
    tapHintVisible.value = false
    emit('tap-hint-hidden')
  }
}

// Expose for external calls
defineExpose({ hideTapHint })
</script>

<template>
  <!-- Scroll hint -->
  <div
    class="scroll-hint"
    :class="{ hidden: scrollHintHidden }"
    :style="scrollHintHidden ? { transition: 'opacity 0.5s ease', opacity: 0 } : {}"
  >
    <span class="scroll-hint-text">Swipe to explore</span>
    <div class="scroll-hint-chevron" />
  </div>

  <!-- Tap hint -->
  <div
    class="tap-hint"
    :class="{
      visible: tapHintVisible,
      hidden: tapHintHidden
    }"
  >
    <span class="tap-hint-text">Tap the word to explore</span>
  </div>
</template>
