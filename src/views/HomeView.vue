<script setup lang="ts">
import backgroundImgBlack from '@/assets/in-construction-black.webp'
import backgroundImgWhite from '@/assets/in-construction-white.webp'
import { ref } from 'vue';

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const backgroundImg = ref<string | null>(null)
const imgUrl = ref<string | undefined>(undefined)

if (isDarkMode) {
  backgroundImg.value = backgroundImgBlack
  imgUrl.value = "https://wallhaven.cc/w/5yd6d5"
} else {
  backgroundImg.value = backgroundImgWhite
  imgUrl.value = "https://wallhaven.cc/w/j839vy"
}
</script>

<template>
  <div class="relative w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
    :style="{ backgroundImage: `url(${backgroundImg})`, height: '100vh', marginTop: 'calc(var(--layout-main-padding-top) * -1)', marginBottom: 'calc(var(--layout-main-padding-bottom) * -1)' }">
    <div class="absolute inset-0" :class="isDarkMode ? 'bg-black/50' : 'bg-white/25'"></div>
    <div class="flex flex-col items-center justify-center h-full px-5">
      <div class="flex-col p-3 backdrop-blur-md rounded-3xl gap-2 flex">
        <h2 class="text-4xl font-bold">A new look's coming soon...</h2>
        <p>
          I'm currently working on revamping my website to make it look as good as possible. <br />
          Bookmark it and check back soon to see how it all comes together. <br />
          In the meanwhile you can see the previous versions of it :
        </p>
        <RouterLink to="/previous" class="p-3 border cursor-pointer flex justify-center rounded-3xl">
          See previous versions
        </RouterLink>
      </div>
    </div>
    <span class="absolute top-2 left-2">Background image from <a :href="imgUrl" class="underline">wallhaven.cc</a></span>
  </div>
</template>
