import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for handling touch, wheel, and keyboard gestures
 */
export function useGestures({ onNudge, onSnap, onNext, onPrev, onScroll }) {
  const touch = ref({ y: 0, scrolling: false, pendingTap: null })
  let keyHeld = false
  let keyTimer = null
  let wheelTimer = null

  // Keyboard handling
  function handleKeyDown(e) {
    if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault()
      if (!keyHeld) {
        onNext?.()
        keyHeld = true
        keyTimer = setInterval(() => onNudge?.(0.06), 50)
      }
    } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault()
      if (!keyHeld) {
        onPrev?.()
        keyHeld = true
        keyTimer = setInterval(() => onNudge?.(-0.06), 50)
      }
    }
  }

  function handleKeyUp(e) {
    if (['ArrowDown', 'ArrowRight', ' ', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
      keyHeld = false
      clearInterval(keyTimer)
      onSnap?.()
    }
  }

  // Touch handling
  function handleTouchStart(e) {
    touch.value.y = e.touches[0].clientY
    touch.value.scrolling = false
  }

  function handleTouchMove(e) {
    const dy = e.touches[0].clientY - touch.value.y

    if (Math.abs(dy) > 8) {
      touch.value.scrolling = true

      // Cancel pending tap
      if (touch.value.pendingTap) {
        touch.value.pendingTap = null
      }

      onScroll?.()
    }

    if (touch.value.scrolling) {
      onNudge?.(-dy / 280)
      touch.value.y = e.touches[0].clientY
    }
  }

  function handleTouchEnd() {
    if (touch.value.scrolling) {
      onSnap?.()
    }
  }

  // Wheel handling
  function handleWheel(e) {
    e.preventDefault()
    onScroll?.()
    onNudge?.(e.deltaY / 320)
    clearTimeout(wheelTimer)
    wheelTimer = setTimeout(() => onSnap?.(), 100)
  }

  // Setup/teardown
  function setup() {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('wheel', handleWheel, { passive: false })
  }

  function cleanup() {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    document.removeEventListener('wheel', handleWheel)
    clearInterval(keyTimer)
    clearTimeout(wheelTimer)
  }

  return {
    touch,
    setup,
    cleanup,
    setPendingTap(tap) {
      touch.value.pendingTap = tap
    },
    clearPendingTap() {
      touch.value.pendingTap = null
    }
  }
}
