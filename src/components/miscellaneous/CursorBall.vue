<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const INTERACTIVE_ELEMENT_SELECTOR = 'a, button, [expand-ball]'

const SIZE_EASING = 0.25
const BALL_POSITION_EASING = 1
const RING_POSITION_EASING = 0.3

const pointerX = ref(0),
  pointerY = ref(0)
const ballX = ref(0),
  ballY = ref(0)
const ringX = ref(0),
  ringY = ref(0)

let raf: number | null = null

const isInteractive = ref(false)
const hasPointerMoved = ref(false)
const prefersReducedMotion = ref(false)
let motionMql: MediaQueryList | null = null

function handleMotionChange(event?: MediaQueryListEvent) {
  prefersReducedMotion.value = event ? event.matches : (motionMql?.matches ?? false)

  if (prefersReducedMotion.value) {
    if (raf !== null) cancelAnimationFrame(raf)
    raf = null
  } else {
    if (raf === null) raf = requestAnimationFrame(tick)
  }
}


const BASE_SIZE = 20

const hoveredRect = ref<DOMRect | null>(null)
const ballBorderRadius = ref('9999px')
const ballClipPath = ref('none')

const targetBallHeight = ref<number>(BASE_SIZE)
const targetBallWidth = ref<number>(BASE_SIZE)

const ballHeight = ref<number>(BASE_SIZE)
const ballWidth = ref<number>(BASE_SIZE)

let hoveredElement: HTMLElement | null = null

function measureHoveredElement() {
  if (!hoveredElement) {
    hoveredRect.value = null
    return
  }

  hoveredRect.value = hoveredElement.getBoundingClientRect()
  if (hoveredRect.value) {
    targetBallHeight.value = hoveredRect.value.height
    targetBallWidth.value = hoveredRect.value.width
  }

  const computedStyle = getComputedStyle(hoveredElement)
  const borderRadius = [
    computedStyle.borderTopLeftRadius,
    computedStyle.borderTopRightRadius,
    computedStyle.borderBottomRightRadius,
    computedStyle.borderBottomLeftRadius,
  ].join(' ')
  ballBorderRadius.value = borderRadius

  const clipPath = computedStyle.clipPath
  ballClipPath.value = clipPath && clipPath !== 'none' ? clipPath : 'none'
}

function clearActive() {
  hoveredElement = null
  hoveredRect.value = null
  targetBallHeight.value = BASE_SIZE
  targetBallWidth.value = BASE_SIZE
  isInteractive.value = false
  ballBorderRadius.value = '9999px'
  ballClipPath.value = 'none'
}

function onPointerOver(e: PointerEvent) {
  const targetElement = (e.target as Element | null)?.closest(INTERACTIVE_ELEMENT_SELECTOR) as HTMLElement | null
  if (!targetElement || targetElement === hoveredElement) return
  hoveredElement = targetElement
  isInteractive.value = true
  measureHoveredElement()
}

function onPointerOut(e: PointerEvent) {
  const related = e.relatedTarget as Element | null
  if (hoveredElement && related && hoveredElement.contains(related)) return
  clearActive()
}

function onPointerMove(e: MouseEvent) {
  pointerX.value = e.clientX
  pointerY.value = e.clientY
  hasPointerMoved.value = true
}

function onScrollOrResize() {
  if (hoveredElement) measureHoveredElement()
}

function tick() {
  const targetX = hoveredRect.value
    ? hoveredRect.value.left + hoveredRect.value.width / 2
    : pointerX.value
  const targetY = hoveredRect.value
    ? hoveredRect.value.top + hoveredRect.value.height / 2
    : pointerY.value

  ballX.value += (targetX - ballX.value) * BALL_POSITION_EASING
  ballY.value += (targetY - ballY.value) * BALL_POSITION_EASING

  ballHeight.value += (targetBallHeight.value - ballHeight.value) * SIZE_EASING
  ballWidth.value += (targetBallWidth.value - ballWidth.value) * SIZE_EASING

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
  <div class="cursor cursor-ring"
    :class="{ 'cursor--visible': hasPointerMoved, 'cursor--interactive-hidden': isInteractive }" :style="{
      left: ringX + 'px',
      top: ringY + 'px',
    }"></div>
  <div class="cursor cursor-blob" :class="{ 'cursor--visible': hasPointerMoved }" :style="{
    width: `${ballWidth}px`,
    height: `${ballHeight}px`,
    left: ballX + 'px',
    top: ballY + 'px',
    borderRadius: ballBorderRadius,
    clipPath: ballClipPath,
  }"></div>
</template>

<style>
.cursor {
  position: fixed;
  z-index: 50;
  display: none;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 150ms ease-out;
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

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .cursor--visible {
    display: block;
  }

  .cursor-ring.cursor--interactive-hidden {
    display: none;
  }
}
</style>
