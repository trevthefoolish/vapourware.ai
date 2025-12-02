import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpring } from './useSpring'
import { verses } from '../data/words'

const INTRO_ANCHORS = 3 // Number of intro states before verses begin
const VERSE_COUNT = verses.length
const MAX = INTRO_ANCHORS + VERSE_COUNT - 1
const SNAP_THRESHOLD = 0.02

// Easing function
function ease(t) {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return (1 - Math.cos(t * Math.PI)) / 2
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function useTimeline() {
  const spring = useSpring(0, MAX)
  const position = ref({ cx: 0, cy: 0, slot1: { x: 0, y: 0 }, slot2: { x: 0, y: 0 }, scale: 1 })
  const state = ref(null)
  const startTime = ref(Date.now())

  // Helper: generate verse visibility states for a given active verse index (-1 = none active)
  function generateVerseStates(activeVerseIndex) {
    const v = {}
    const vWords = {}
    const vEn = {}

    verses.forEach((_, i) => {
      const isActive = i === activeVerseIndex
      const isPast = i < activeVerseIndex

      v[i] = {
        opacity: isActive ? 1 : 0,
        y: isPast ? -15 : (isActive ? 0 : 25)
      }
      vWords[i] = isActive ? 1 : 0
      vEn[i] = isActive ? 1 : 0
    })

    return { v, vWords, vEn }
  }

  function getAnchorState(anchor) {
    const pos = position.value
    const activeVerse = anchor >= INTRO_ANCHORS ? anchor - INTRO_ANCHORS : -1
    const { v, vWords, vEn } = generateVerseStates(activeVerse)

    const state = { v, vWords, vEn, verseNum: '' }

    // Intro states (0, 1, 2) - unique configurations
    if (anchor === 0) {
      state.en = { x: pos.cx, y: pos.cy, opacity: 1 }
      state.q = { x: pos.cx, y: pos.cy + 70, scale: 1, opacity: 0 }
    } else if (anchor === 1) {
      state.en = { x: pos.cx, y: pos.cy - 50, opacity: 1 }
      state.q = { x: pos.cx, y: pos.cy + 40, scale: 1, opacity: 1 }
    } else if (anchor === 2) {
      state.en = { x: pos.cx, y: pos.cy - 75, opacity: 0 }
      state.q = { x: pos.cx, y: pos.cy, scale: 1, opacity: 1 }
    } else {
      // Verse states (anchor >= 3)
      state.en = { x: pos.cx, y: pos.cy - 75, opacity: 0 }

      if (activeVerse === 0) {
        state.q = { x: pos.slot1.x, y: pos.slot1.y, scale: pos.scale, opacity: 1 }
      } else if (activeVerse === 1) {
        state.q = { x: pos.slot2.x, y: pos.slot2.y, scale: pos.scale, opacity: 1 }
      } else {
        state.q = { x: pos.slot2.x, y: pos.slot2.y, scale: pos.scale, opacity: 0 }
      }

      state.verseNum = verses[activeVerse].ref
    }

    return state
  }

  function lerpState(s1, s2, t) {
    const e = ease(t)

    const v = {}
    const vWords = {}
    const vEn = {}

    verses.forEach((_, i) => {
      v[i] = {
        opacity: lerp(s1.v[i].opacity, s2.v[i].opacity, e),
        y: lerp(s1.v[i].y, s2.v[i].y, e)
      }
      vWords[i] = lerp(s1.vWords[i], s2.vWords[i], e)
      vEn[i] = lerp(s1.vEn[i], s2.vEn[i], e)
    })

    return {
      en: {
        x: lerp(s1.en.x, s2.en.x, e),
        y: lerp(s1.en.y, s2.en.y, e),
        opacity: lerp(s1.en.opacity, s2.en.opacity, e)
      },
      q: {
        x: lerp(s1.q.x, s2.q.x, e),
        y: lerp(s1.q.y, s2.q.y, e),
        scale: lerp(s1.q.scale, s2.q.scale, e),
        opacity: lerp(s1.q.opacity, s2.q.opacity, e)
      },
      v,
      vWords,
      vEn,
      verseNum: e > 0.5 ? s2.verseNum : s1.verseNum
    }
  }

  function getState(p) {
    p = Math.max(0, Math.min(MAX, p))

    const nearestAnchor = Math.round(p)
    if (Math.abs(p - nearestAnchor) < SNAP_THRESHOLD) {
      return getAnchorState(nearestAnchor)
    }

    const lower = Math.floor(p)
    const upper = Math.ceil(p)
    const t = p - lower
    return lerpState(getAnchorState(lower), getAnchorState(upper), t)
  }

  // Measure positions from DOM
  function measure(sceneEl, ph1El, ph2El, qoheletEl) {
    if (!sceneEl || !ph1El || !ph2El || !qoheletEl) return

    const scene = sceneEl.getBoundingClientRect()
    const ph1R = ph1El.getBoundingClientRect()
    const ph2R = ph2El.getBoundingClientRect()

    position.value = {
      cx: scene.left + scene.width / 2,
      cy: scene.top + scene.height / 2,
      slot1: { x: ph1R.left + ph1R.width / 2, y: ph1R.top + ph1R.height / 2 },
      slot2: { x: ph2R.left + ph2R.width / 2, y: ph2R.top + ph2R.height / 2 },
      scale: parseFloat(getComputedStyle(ph1El).fontSize) / parseFloat(getComputedStyle(qoheletEl).fontSize)
    }
  }

  // Animation loop
  let animationId = null

  function update() {
    const p = spring.update()
    const time = Date.now() - startTime.value

    // Calculate ambient motion
    const atRest = Math.abs(spring.velocity.value) < 0.01
    const ambY = atRest ? Math.sin(time * 0.0006) * 2 : 0
    const ambS = atRest ? 1 + Math.sin(time * 0.0008) * 0.002 : 1

    state.value = {
      ...getState(p),
      ambY,
      ambS,
      atRest,
      p
    }
  }

  function startLoop() {
    function loop() {
      update()
      animationId = requestAnimationFrame(loop)
    }
    loop()
  }

  function stopLoop() {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  // Navigation
  function snap() {
    spring.set(Math.round(spring.target.value))
  }

  function next() {
    const nextAnchor = Math.floor(spring.target.value + 0.95)
    if (nextAnchor <= MAX) spring.set(nextAnchor)
  }

  function prev() {
    const prevAnchor = Math.ceil(spring.target.value - 0.95)
    if (prevAnchor >= 0) spring.set(prevAnchor)
  }

  function navigateToVerse(verseIndex) {
    const targetAnchor = INTRO_ANCHORS + verseIndex
    spring.set(targetAnchor)
  }

  // Computed values
  const currentVerseIndex = computed(() => {
    if (!state.value) return -1
    const p = state.value.p
    if (p < INTRO_ANCHORS) return -1
    return Math.max(0, Math.round(p) - INTRO_ANCHORS)
  })

  const progress = computed(() => {
    if (!state.value) return 0
    return state.value.p / MAX
  })

  return {
    state,
    position,
    spring,
    currentVerseIndex,
    progress,
    measure,
    startLoop,
    stopLoop,
    snap,
    next,
    prev,
    navigateToVerse,
    INTRO_ANCHORS,
    MAX
  }
}
