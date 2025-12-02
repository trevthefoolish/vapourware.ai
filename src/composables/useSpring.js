import { ref, readonly } from 'vue'

/**
 * Spring physics composable for smooth, responsive animations
 * @param {number} initial - Initial value
 * @param {number} max - Maximum value (for clamping)
 */
export function useSpring(initial = 0, max = 1) {
  const value = ref(initial)
  const target = ref(initial)
  const velocity = ref(0)

  // Spring parameters
  const baseTension = 30
  const baseFriction = 9
  let intensity = 0
  let lastInput = 0

  function nudge(delta) {
    target.value = Math.max(0, Math.min(max, target.value + delta))
    intensity = Math.min(1, intensity + 0.25)
    lastInput = Date.now()
  }

  function set(t) {
    target.value = Math.max(0, Math.min(max, t))
    intensity = Math.min(1, intensity + 0.15)
    lastInput = Date.now()
  }

  function snap(v) {
    value.value = Math.max(0, Math.min(max, v))
    target.value = value.value
    velocity.value = 0
    intensity = 0
  }

  function update(dt = 1/60) {
    // Decay intensity
    if (Date.now() - lastInput > 80) {
      intensity *= 0.92
    }

    // Responsive physics
    const tension = baseTension + intensity * 60
    const friction = baseFriction + intensity * 5

    const d = target.value - value.value
    velocity.value += (d * tension - velocity.value * friction) * dt
    value.value += velocity.value * dt

    // Clamp to valid range and kill velocity at boundaries
    if (value.value <= 0) {
      value.value = 0
      if (velocity.value < 0) velocity.value = 0
    }
    if (value.value >= max) {
      value.value = max
      if (velocity.value > 0) velocity.value = 0
    }

    // Snap to target when close enough (decisive settling)
    if (Math.abs(d) < 0.015 && Math.abs(velocity.value) < 0.01) {
      value.value = target.value
      velocity.value = 0
    }

    return value.value
  }

  return {
    value: readonly(value),
    target: readonly(target),
    velocity: readonly(velocity),
    nudge,
    set,
    snap,
    update
  }
}
