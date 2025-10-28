<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const isHidden = ref<boolean>(false)
let lastY: number = 0

let ticking: boolean = false

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY || document.documentElement.scrollTop
      const goingDown = y > lastY - 8
      isHidden.value = goingDown && y > 80
      lastY = y
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  lastY = window.scrollY || document.documentElement.scrollTop
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <RouterLink
    class="fixed top-5 left-1/2 -translate-x-1/2 backdrop-blur-2xl rounded-full p-5 z-10 transform transition-all duration-200 will-change-transform"
    :class="isHidden ? '-translate-y-40' : ''" to="/">
    <div class="whitespace-nowrap mix-blend-difference text-3xl sm:text-6xl font-bold">
      Saterz's Website
    </div>
  </RouterLink>
</template>
