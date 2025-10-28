<script setup lang="ts">
import { RouterView } from 'vue-router'
import LayoutNavbar from './components/LayoutNavbar.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import CursorBall from './components/CursorBall.vue'
</script>

<template>
  <CursorBall />

  <LayoutNavbar />
  <main class="min-h-screen pt-[var(--layout-main-padding-top)] pb-[var(--layout-main-padding-bottom)]">
    <RouterView />
  </main>
  <LayoutFooter />
</template>
