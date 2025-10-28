<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// Interactive selectors that trigger the cursor resizing logic.
const INTERACTIVE_ELEMENTS = 'a, button, [expand-ball="true"]'

// Pointer coordinates captured from the latest pointer move event.
const cursX = ref(0),
  cursY = ref(0)
// Animated ball coordinates that ease toward the pointer target.
const ballX = ref(0),
  ballY = ref(0)
// Ring coordinates that trail the pointer position.
const ringX = ref(0),
  ringY = ref(0)

let raf: number | null = null

// Easing coefficients for the ball fill and outer ring.
const A_BALL = 1
const A_RING = 0.1

// Cursor state flags that drive visibility and motion preferences.
const isInteractive = ref(false)
const hasMoved = ref(false)
const prefersReducedMotion = ref(false)
let motionMql: MediaQueryList | null = null

// Sync reduced-motion preference and start/stop the animation loop.
function handleMotionChange(event?: MediaQueryListEvent) {
  prefersReducedMotion.value = event ? event.matches : motionMql?.matches ?? false

  if (prefersReducedMotion.value) {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    } else {
      if (raf === null) raf = requestAnimationFrame(tick)
    }
  }
}

// Minimum cursor size when not expanding to match an element.
const BASE_SIZE = 20

const hoveredRect = ref<DOMRect | null>(null)
const ballBorderRadius = ref('9999px')
const ballClipPath = ref('none')

const targetHeightSize = ref<number>(BASE_SIZE)
const targerWidthSize = ref<number>(BASE_SIZE)

const ballHeightSize = ref<number>(BASE_SIZE)
const ballWidthSize = ref<number>(BASE_SIZE)

let activeEl: HTMLElement | null = null

// Measure the active interactive element to match its geometry.
function measureActive() {
  if (!activeEl) {
    hoveredRect.value = null
    return
  }

  hoveredRect.value = activeEl.getBoundingClientRect()
  if (hoveredRect.value) {
    targetHeightSize.value = hoveredRect.value.height
    targerWidthSize.value = hoveredRect.value.width
  }

  const cs = getComputedStyle(activeEl)
  const br = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].join(' ')
  ballBorderRadius.value = br

  const cp = cs.clipPath
  ballClipPath.value = cp && cp !== 'none' ? cp : 'none'
}

// Reset cursor visuals when no element is being hovered.
function clearActive() {
  activeEl = null
  hoveredRect.value = null
  targetHeightSize.value = BASE_SIZE
  targerWidthSize.value = BASE_SIZE
  isInteractive.value = false
  ballBorderRadius.value = '9999px'
  ballClipPath.value = 'none'
}

// Activate the interactive state when entering a tracked element.
function onPointerOver(e: PointerEvent) {
  const el = (e.target as Element | null)?.closest(INTERACTIVE_ELEMENTS) as HTMLElement | null
  if (!el || el === activeEl) return
  activeEl = el
  isInteractive.value = true
  measureActive()
}

// Restore the default cursor when leaving the tracked element.
function onPointerOut(e: PointerEvent) {
  const related = e.relatedTarget as Element | null
  if (activeEl && related && activeEl.contains(related)) return
  clearActive()
}

// Store the current pointer location and reveal the custom cursor.
function onPointerMove(e: MouseEvent) {
  cursX.value = e.clientX
  cursY.value = e.clientY
  hasMoved.value = true
}

// Keep measurements in sync with layout changes.
function onScrollOrResize() {
  if (activeEl) measureActive()
}

// Animation loop that eases the ball toward the pointer or hovered element.
function tick() {
  const targetX = hoveredRect.value ? hoveredRect.value.left + hoveredRect.value.width / 2 : cursX.value
  const targetY = hoveredRect.value ? hoveredRect.value.top + hoveredRect.value.height / 2 : cursY.value

  ballX.value += (targetX - ballX.value) * A_BALL
  ballY.value += (targetY - ballY.value) * A_BALL

  ballHeightSize.value += (targetHeightSize.value - ballHeightSize.value) * 0.15
  ballWidthSize.value += (targerWidthSize.value - ballWidthSize.value) * 0.15

  ringX.value += (cursX.value - ringX.value) * A_RING
  ringY.value += (cursY.value - ringY.value) * A_RING

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
  if ('addEventListener' in motionMql) {
    motionMql.addEventListener('change', handleMotionChange)
  }
  handleMotionChange()

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerover', onPointerOver)
  window.addEventListener('pointerout', onPointerOut)

  window.addEventListener('resize', onScrollOrResize, { passive: true })
  window.addEventListener('scroll', onScrollOrResize, { passive: true })

  ballX.value = ringX.value = cursX.value
  ballY.value = ringY.value = cursY.value

  if (!prefersReducedMotion.value) raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (motionMql) motionMql.removeEventListener('change', handleMotionChange)

  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerover', onPointerOver)
  window.removeEventListener('pointerout', onPointerOut)

  window.removeEventListener('resize', onScrollOrResize)
  window.removeEventListener('scroll', onScrollOrResize)

  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <!-- Ring -->
  <div
    class="p-5 border-white border-2 rounded-full -translate-x-1/2 -translate-y-1/2 fixed pointer-events-none bg-transparent mix-blend-difference transition-transform duration-150 ease-out will-change-transform z-50"
    :class="[isInteractive ? 'scale-0' : 'scale-100', hasMoved ? 'hidden lg:block motion-reduce:hidden' : 'hidden']"
    :style="{
      left: ringX + 'px',
      top: ringY + 'px',
    }"></div>
  <!-- Ball -->
  <div
    class="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-white mix-blend-difference transition-transform duration-150 ease-out will-change-transform z-50"
    :class="[hasMoved ? 'hidden lg:block motion-reduce:hidden' : 'hidden']" :style="{
      width: `${ballWidthSize}px`,
      height: `${ballHeightSize}px`,
      left: ballX + 'px',
      top: ballY + 'px',
      borderRadius: ballBorderRadius,
      clipPath: ballClipPath,
    }"></div>
</template>
