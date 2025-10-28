<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
<template>
  <footer
    class="sm:fixed bottom-0 w-full p-3 backdrop-blur-2xl">
    <div class="mix-blend-difference flex gap-3 flex-col-reverse sm:flex-row">
      <div class="flex-1">&copy; 2023-{{ currentYear }} Saterz</div>
      <div class="flex-1 sm:justify-center flex">
        <span>
          v4 -<RouterLink to="/previous"> View previous versions of this website</RouterLink>
        </span>
      </div>
      <div class="flex-1 sm:justify-end flex">
        <a href="https://github.com/Saterz/saterz.dev">Source on Github</a>
      </div>
    </div>
  </footer>
</template>
