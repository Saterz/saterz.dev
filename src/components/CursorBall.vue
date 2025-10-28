<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const INTERACTIVE_ELEMENTS = 'a, button'

const cursX = ref(0),
  cursY = ref(0)
const ballX = ref(0),
  ballY = ref(0)
const ringX = ref(0),
  ringY = ref(0)

let raf: number | null = null

const A_BALL = 0.5
const A_RING = 0.15

const isInteractive = ref(false)
const hasMoved = ref(false)
const prefersReducedMotion = ref(false)
let motionMql: MediaQueryList | null = null

function handleMotionChange(event?: MediaQueryListEvent) {
  prefersReducedMotion.value = event ? event.matches : motionMql?.matches ?? false

  if (prefersReducedMotion.value && raf) {
    cancelAnimationFrame(raf)
    raf = null
  } else if (!prefersReducedMotion.value && raf === null) {
    raf = requestAnimationFrame(tick)
  }
}

function onMove(e: MouseEvent) {
  cursX.value = e.clientX
  cursY.value = e.clientY

  const el = e.target as Element | null
  isInteractive.value = !!el?.closest(INTERACTIVE_ELEMENTS)

  hasMoved.value = true
}

function tick() {
  ballX.value += (cursX.value - ballX.value) * A_BALL
  ballY.value += (cursY.value - ballY.value) * A_BALL

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
  if (prefersReducedMotion.value) return

  window.addEventListener('mousemove', onMove, { passive: true })
  ballX.value = ringX.value = cursX.value
  ballY.value = ringY.value = cursY.value
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => {
  if (motionMql) motionMql.removeEventListener('change', handleMotionChange)
  window.removeEventListener('mousemove', onMove)
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
    class="fixed p-2.5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-white mix-blend-difference transition-transform duration-150 ease-out will-change-transform z-50"
    :class="[isInteractive ? 'scale-200' : 'scale-100', hasMoved ? 'hidden lg:block motion-reduce:hidden' : 'hidden']"
    :style="{
      left: ballX + 'px',
      top: ballY + 'px',
    }"></div>
</template>
