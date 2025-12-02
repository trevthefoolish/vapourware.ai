<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { verses } from './data/words'
import { useTimeline } from './composables/useTimeline'
import { useGestures } from './composables/useGestures'

import TitleEnglish from './components/TitleEnglish.vue'
import TitleHebrew from './components/TitleHebrew.vue'
import VerseDisplay from './components/VerseDisplay.vue'
import WordTooltip from './components/WordTooltip.vue'
import VerseSelector from './components/VerseSelector.vue'
import ProgressBar from './components/ProgressBar.vue'
import NavigationHints from './components/NavigationHints.vue'

// Element refs
const sceneRef = ref(null)
const qoheletRef = ref(null)
const verseSelectorRef = ref(null)
const hintsRef = ref(null)
const placeholderRefs = ref({})

// Timeline state
const timeline = useTimeline()

// Tooltip state
const tooltipVisible = ref(false)
const tooltipLink = ref(null)
const tooltipTargetEl = ref(null)
const tooltipIsHebrew = ref(true)
const activeWordEl = ref(null)

// Highlighting state
const litLink = ref(null)
const litStagger = ref(false)
const staggerTimers = ref([])

// Touch feedback state
const touchActiveLink = ref(null)

function clearLit() {
  staggerTimers.value.forEach(t => clearTimeout(t))
  staggerTimers.value = []
  litLink.value = null
  litStagger.value = false
}

function lightUp(link, stagger = false) {
  if (!link) return
  clearLit()
  litLink.value = link
  litStagger.value = stagger
}

function showTooltip(el, link, isHebrew = true) {
  tooltipTargetEl.value = el
  tooltipLink.value = link
  tooltipIsHebrew.value = isHebrew
  tooltipVisible.value = true
  activeWordEl.value = el
  hintsRef.value?.hideTapHint()
}

function hideTooltip() {
  tooltipVisible.value = false
  activeWordEl.value = null
}

function toggleTooltip(el, link, isHebrew = true) {
  if (tooltipVisible.value && activeWordEl.value === el) {
    hideTooltip()
  } else {
    showTooltip(el, link, isHebrew)
  }
}

// Word interaction handlers
function handleWordClick({ el, link, event }) {
  event.preventDefault()
  event.stopPropagation()
  const wasVisible = tooltipVisible.value && activeWordEl.value === el
  if (!wasVisible) {
    lightUp(link, true)
  }
  toggleTooltip(el, link, el.classList.contains('word-he'))
}

function handleWordHover(link) {
  if (!tooltipVisible.value) {
    lightUp(link, false)
  }
}

function handleWordLeave() {
  if (!tooltipVisible.value) {
    clearLit()
  }
}

function handleWordTouchstart({ el, link, event }) {
  event.preventDefault()
  gestures.setPendingTap({ el, link, isHebrew: el.classList.contains('word-he') })
  touchActiveLink.value = link
}

// Qohelet (Hebrew title) handlers
function handleQoheletClick(e) {
  e.preventDefault()
  e.stopPropagation()
  const wasVisible = tooltipVisible.value && tooltipLink.value === 'teacher'
  if (!wasVisible) {
    lightUp('teacher', true)
  }
  toggleTooltip(qoheletRef.value.$el || qoheletRef.value, 'teacher', true)
}

function handleQoheletHover() {
  if (!tooltipVisible.value) {
    lightUp('teacher', false)
  }
}

function handleQoheletLeave() {
  if (!tooltipVisible.value) {
    clearLit()
  }
}

function handleQoheletTouchstart(e) {
  e.preventDefault()
  gestures.setPendingTap({ el: qoheletRef.value.$el || qoheletRef.value, link: 'teacher', isHebrew: true })
  touchActiveLink.value = 'teacher'
}

// Gestures
const gestures = useGestures({
  onNudge: (delta) => timeline.spring.nudge(delta),
  onSnap: () => timeline.snap(),
  onNext: () => timeline.next(),
  onPrev: () => timeline.prev(),
  onScroll: () => {
    if (tooltipVisible.value) {
      hideTooltip()
      clearLit()
    }
    verseSelectorRef.value?.closeSelector()
  }
})

// Handle pending taps from touch gestures
function handleTouchEnd() {
  const pending = gestures.touch.value.pendingTap
  if (pending && !gestures.touch.value.scrolling) {
    const { el, link, isHebrew } = pending
    const wasVisible = tooltipVisible.value && activeWordEl.value === el
    if (!wasVisible) {
      lightUp(link, true)
    }
    toggleTooltip(el, link, isHebrew)
  }
  gestures.clearPendingTap()
  touchActiveLink.value = null
}

// Click outside handlers
function handleDocumentClick(e) {
  // Hide tooltip when clicking outside
  if (tooltipVisible.value) {
    const isWord = e.target.closest('[data-link]')
    const isTooltip = e.target.closest('.word-tooltip')
    if (!isWord && !isTooltip) {
      hideTooltip()
      clearLit()
    }
  }
  // Close selector when clicking outside
  verseSelectorRef.value?.handleClickOutside()
}

function handleKeydown(e) {
  verseSelectorRef.value?.handleKeydown(e)
}

// Placeholder refs for positioning
function handlePlaceholderRef(verseIndex, el) {
  if (el) {
    placeholderRefs.value[verseIndex] = el
  }
}

// Measure and start animation
async function init() {
  await nextTick()

  // Reset styles for measurement
  const ph1 = placeholderRefs.value[0]
  const ph2 = placeholderRefs.value[1]
  const qEl = qoheletRef.value?.$el || qoheletRef.value

  if (sceneRef.value && ph1 && ph2 && qEl) {
    timeline.measure(sceneRef.value, ph1, ph2, qEl)
  }

  timeline.spring.snap(0)
  timeline.startLoop()
}

// Computed state values
const showQoheletAmbient = computed(() => {
  const p = timeline.state.value?.p ?? 0
  return p >= 1.8 && p <= 2.2 && timeline.state.value?.atRest
})

const verseStates = computed(() => {
  if (!timeline.state.value) return {}
  return timeline.state.value.v
})

const verseWordProgress = computed(() => {
  if (!timeline.state.value) return {}
  return timeline.state.value.vWords
})

const verseEnOpacity = computed(() => {
  if (!timeline.state.value) return {}
  return timeline.state.value.vEn
})

onMounted(() => {
  gestures.setup()
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchend', handleTouchEnd)
  window.addEventListener('resize', () => setTimeout(init, 100))
  init()
})

onUnmounted(() => {
  gestures.cleanup()
  timeline.stopLoop()
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="scene" ref="sceneRef">
    <TitleEnglish
      :state="timeline.state.value?.en"
      :amb-y="timeline.state.value?.ambY"
    />

    <VerseDisplay
      v-for="(verse, i) in verses"
      :key="i"
      :verse="verse"
      :verse-index="i"
      :state="verseStates[i]"
      :word-progress="verseWordProgress[i] ?? 0"
      :en-opacity="verseEnOpacity[i] ?? 0"
      :lit-link="litLink"
      :lit-stagger="litStagger"
      :touch-active-link="touchActiveLink"
      @word-click="handleWordClick"
      @word-hover="handleWordHover"
      @word-leave="handleWordLeave"
      @word-touchstart="handleWordTouchstart"
      @placeholder-ref="handlePlaceholderRef"
    />
  </div>

  <TitleHebrew
    ref="qoheletRef"
    :state="timeline.state.value?.q"
    :amb-y="timeline.state.value?.ambY"
    :amb-s="timeline.state.value?.ambS"
    :show-ambient="showQoheletAmbient"
    :is-lit="litLink === 'teacher'"
    :is-touch-active="touchActiveLink === 'teacher'"
    @click="handleQoheletClick"
    @mouseenter="handleQoheletHover"
    @mouseleave="handleQoheletLeave"
    @touchstart="handleQoheletTouchstart"
  />

  <ProgressBar :progress="timeline.progress.value" />

  <VerseSelector
    ref="verseSelectorRef"
    :current-verse-index="timeline.currentVerseIndex.value"
    :visible="!!timeline.state.value?.verseNum"
    @select="timeline.navigateToVerse"
  />

  <WordTooltip
    :visible="tooltipVisible"
    :link="tooltipLink"
    :target-el="tooltipTargetEl"
    :is-hebrew="tooltipIsHebrew"
  />

  <NavigationHints
    ref="hintsRef"
    :position="timeline.state.value?.p ?? 0"
  />
</template>
