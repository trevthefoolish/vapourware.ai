<script setup>
import { ref, watch, nextTick } from 'vue'
import { wordData } from '../data/words'

const props = defineProps({
  visible: Boolean,
  link: String,
  targetEl: Object,
  isHebrew: Boolean
})

const emit = defineEmits(['hide'])

const tooltipRef = ref(null)
const position = ref({ left: 0, top: 0 })
const isAbove = ref(false)
const isHiding = ref(false)

let hideTimer = null

// Get word data for current link
const data = ref(null)

watch(() => props.link, (newLink) => {
  if (newLink && wordData[newLink]) {
    data.value = wordData[newLink]
  }
}, { immediate: true })

// Position tooltip when visible
watch(() => [props.visible, props.targetEl], async ([visible, targetEl]) => {
  if (!visible || !targetEl) return

  isHiding.value = false
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  await nextTick()

  const rect = targetEl.getBoundingClientRect()
  const tooltipWidth = Math.min(400, window.innerWidth * 0.85)
  let left = rect.left + rect.width / 2 - tooltipWidth / 2

  // Adjust if too close to edges
  const padding = 12
  if (left < padding) left = padding
  if (left + tooltipWidth > window.innerWidth - padding) {
    left = window.innerWidth - tooltipWidth - padding
  }

  // Position based on word type
  const offset = Math.max(14, window.innerWidth * 0.015)
  let top
  let above

  if (props.isHebrew) {
    top = rect.top - offset
    above = true
  } else {
    top = rect.bottom + offset
    above = false
  }

  // Safety fallback
  if (above && top < 150) {
    top = rect.bottom + 14
    above = false
  } else if (!above && top + 150 > window.innerHeight) {
    top = rect.top - 14
    above = true
  }

  isAbove.value = above
  position.value = { left, top }
}, { immediate: true })

// Handle hiding with animation
watch(() => props.visible, (visible) => {
  if (!visible && data.value) {
    isHiding.value = true
    hideTimer = setTimeout(() => {
      isHiding.value = false
    }, 250)
  }
})

function getTransform() {
  if (isAbove.value) {
    return 'translateY(-100%)'
  }
  return ''
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="tooltipRef"
      class="word-tooltip"
      :class="{
        visible: visible && !isHiding,
        hiding: isHiding,
        above: isAbove
      }"
      :style="{
        left: position.left + 'px',
        top: position.top + 'px',
        transform: getTransform()
      }"
    >
      <div v-if="data" class="word-tooltip-hebrew">{{ data.hebrew }}</div>
      <div v-if="data" class="word-tooltip-transliteration">{{ data.transliteration }}</div>
      <div v-if="data" class="word-tooltip-tidbit">{{ data.tidbit }}</div>
    </div>
  </Teleport>
</template>
