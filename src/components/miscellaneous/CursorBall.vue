<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * The HTML elements the ball should take the shape of.
 * Currently it should take the shape of a `<a>link</a>`, `<button>button</button>`, and any other element marked with the `expand-ball` property `<img expand-ball></img>`
 */
const INTERACTIVE_ELEMENT_SELECTOR = 'a, button, [expand-ball]'
const HIDE_CURSOR_SELECTOR = 'canvas, [hide-ball]'
const route = useRoute()

/** The ball base size */
const BASE_SIZE = 20
/** The lowest difference between the ball's actual size and it's base size to determine if it's morphing */
const SIZE_EPSILON = 0.1
const SIZE_EASING = 0.25

const BALL_POSITION_EASING = 1
const RING_POSITION_EASING = 0.3

const pointerX = ref(0)
const pointerY = ref(0)

const ballX = ref(0)
const ballY = ref(0)

const ringX = ref(0)
const ringY = ref(0)

let raf: number | null = null

const hasPointerMoved = ref(false)
const isCursorHidden = ref(false)

const prefersReducedMotion = ref(false)
let motionMql: MediaQueryList | null = null

function handleMotionChange(event?: MediaQueryListEvent) {
  prefersReducedMotion.value = event ? event.matches : (motionMql?.matches ?? false)

  if (prefersReducedMotion.value) {
    if (raf !== null) cancelAnimationFrame(raf)
    raf = null
  }
}

const ballBorderRadius = ref('9999px')
const ballClipPath = ref('none')

const targetBallHeight = ref<number>(BASE_SIZE)
const targetBallWidth = ref<number>(BASE_SIZE)

const ballHeight = ref<number>(BASE_SIZE)
const ballWidth = ref<number>(BASE_SIZE)

let hoveredElement: HTMLElement | null = null
let hoveredRect: DOMRect | null = null

/**
 * Measures the size and position of the element being hovered by the cursor
 */
function measureHoveredElement() {
  if (!hoveredElement) return

  // We create a rect variable to not have to manage the null value from hoveredRect
  const rect = (hoveredRect = hoveredElement.getBoundingClientRect())
  targetBallHeight.value = rect.height
  targetBallWidth.value = rect.width

  const style = getComputedStyle(hoveredElement)
  ballBorderRadius.value = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ].join(' ')
  ballClipPath.value = style.clipPath
}

/** Resets the ball's size and radius values */
function clearActive() {
  hoveredElement = null
  hoveredRect = null
  targetBallHeight.value = targetBallWidth.value = BASE_SIZE
  ballBorderRadius.value = '9999px'
  ballClipPath.value = 'none'
}

watch(
  () => route.fullPath,
  () => {
    clearActive()
  },
)

/** Makes the ball take the shape of the hovered element if it's interactive */
function onPointerOver(e: PointerEvent) {
  const hiddenElement = (e.target as Element | null)?.closest(HIDE_CURSOR_SELECTOR)

  if (hiddenElement) {
    isCursorHidden.value = true
    clearActive()
    return
  }

  isCursorHidden.value = false

  const targetElement = (e.target as Element | null)?.closest(
    INTERACTIVE_ELEMENT_SELECTOR,
  ) as HTMLElement | null
  if (!targetElement || targetElement === hoveredElement) return
  hoveredElement = targetElement
  measureHoveredElement()
}

/** When the user stops hovering the element, it reset the ball values  */
function onPointerOut(e: PointerEvent) {
  const related = e.relatedTarget as Element | null

  if (related?.closest(HIDE_CURSOR_SELECTOR)) return
  isCursorHidden.value = false

  if (hoveredElement && related && hoveredElement.contains(related)) return

  clearActive()
}

/** Sets the pointerX and pointerY values to the cursor coordinates when moving. */
function onPointerMove(e: MouseEvent) {
  pointerX.value = e.clientX
  pointerY.value = e.clientY
  hasPointerMoved.value = true
}

/** Recalculates the hovered element size and position when scrolling or resizing the viewport to make the expanded ball always stick to actual element size */
function onScrollOrResize() {
  if (hoveredElement) measureHoveredElement()
}

function tick() {
  let targetX = pointerX.value
  let targetY = pointerY.value

  if (hoveredRect) {
    targetX = hoveredRect.left + hoveredRect.width / 2
    targetY = hoveredRect.top + hoveredRect.height / 2
  }

  /** Defines if the size of the ball is actively changing */
  const isMorphing =
    hoveredRect !== null ||
    Math.abs(ballHeight.value - BASE_SIZE) > SIZE_EPSILON ||
    Math.abs(ballWidth.value - BASE_SIZE) > SIZE_EPSILON
  // Sets the position value to SIZE_EASING if morphing to have a smooth animation and to BALL_POSITION_EASING if not for the ball to instantly follow the cursor. (Which does not seem to be the case now for some reason???)
  const positionEasing = isMorphing ? SIZE_EASING : BALL_POSITION_EASING

  ballX.value += (targetX - ballX.value) * positionEasing
  ballY.value += (targetY - ballY.value) * positionEasing

  ballHeight.value += (targetBallHeight.value - ballHeight.value) * SIZE_EASING
  ballWidth.value += (targetBallWidth.value - ballWidth.value) * SIZE_EASING

  // Directly set the ball's height and width to the base size if no element is hovered and it's not morphing.
  if (!hoveredRect && !isMorphing) {
    ballHeight.value = BASE_SIZE
    ballWidth.value = BASE_SIZE
  }

  ringX.value += (pointerX.value - ringX.value) * RING_POSITION_EASING
  ringY.value += (pointerY.value - ringY.value) * RING_POSITION_EASING

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

  ballX.value = ringX.value = pointerX.value
  ballY.value = ringY.value = pointerY.value

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
  <div
    id="ring"
    class="cursor cursor-ring"
    :class="{
      'cursor--visible': hasPointerMoved,
      'cursor--interactive-hidden': hoveredRect,
      'cursor--hidden': isCursorHidden,
    }"
    :style="{
      left: ringX + 'px',
      top: ringY + 'px',
    }"
  ></div>

  <div
    id="ball"
    ref="ballElement"
    class="cursor cursor-blob"
    :class="{ 'cursor--visible': hasPointerMoved, 'cursor--hidden': isCursorHidden }"
    :style="{
      width: `${ballWidth}px`,
      height: `${ballHeight}px`,
      left: ballX + 'px',
      top: ballY + 'px',
      borderRadius: ballBorderRadius,
      clipPath: ballClipPath,
    }"
  ></div>
</template>

<style>
.cursor {
  position: fixed;
  z-index: 50;
  display: none;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 150ms cubic-bezier(1, 0, 0, 1);
  mix-blend-mode: difference;
  will-change: transform;
}

.cursor-ring {
  padding: 1.25rem;
  border: 2px solid white;
  border-radius: 9999px;
  background: transparent;
}

.cursor-blob {
  border-radius: 9999px;
  background: white;
}

.cursor.cursor--hidden {
  display: none;
}

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .cursor--visible {
    display: block;
  }

  .cursor-ring.cursor--interactive-hidden {
    display: none;
  }
}
</style>
