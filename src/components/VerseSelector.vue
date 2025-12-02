<script setup>
import { ref } from 'vue'
import { verses } from '../data/words'

const props = defineProps({
  currentVerseIndex: Number,
  visible: Boolean
})

const emit = defineEmits(['select', 'escape'])

const isOpen = ref(false)

function openSelector() {
  if (!isOpen.value) {
    isOpen.value = true
  }
}

function closeSelector() {
  if (isOpen.value) {
    isOpen.value = false
  }
}

function handleClick(index, e) {
  e.stopPropagation()
  if (isOpen.value) {
    emit('select', index)
    closeSelector()
  } else {
    openSelector()
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    closeSelector()
    emit('escape')
  }
}

function handleClickOutside() {
  if (isOpen.value) {
    closeSelector()
  }
}

// Expose methods
defineExpose({ closeSelector, handleClickOutside, handleKeydown })
</script>

<template>
  <div
    class="verse-num"
    :class="{ open: isOpen }"
    :style="{ opacity: visible ? 1 : 0 }"
  >
    <span
      v-for="(verse, i) in verses"
      :key="i"
      class="verse-num-option"
      :class="{ current: i === currentVerseIndex && visible }"
      :data-index="i"
      @click="handleClick(i, $event)"
    >
      {{ verse.ref }}
    </span>
  </div>
</template>
