<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <RouterLink to="/">Go back home</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.not-found__code {
  font-size: clamp(5rem, 20vw, 10rem);
  line-height: 0.8;
}

.not-found a {
  color: inherit;
}
</style>
