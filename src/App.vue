<script setup lang="ts">
import { RouterView } from 'vue-router'
import CursorBall from './components/miscellaneous/CursorBall.vue'
// import LayoutNavbar from './components/LayoutNavbar.vue';
</script>

<template>
  <CursorBall />

  <main class="main-app">
    <RouterView />
  </main>
</template>

<style>
.main-app {
  margin: auto;
  min-height: 100dvh;
  max-width: 80dvw;
}
</style>
