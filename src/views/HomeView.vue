<script setup lang="ts">
import {
  getCurrentlyWatchingAnime,
  getRecentlyFinished,
  type CurrentlyWatchingAnime,
  type RecentlyFinishedAnime,
} from '@/api/anilist'
import { getLastFMImage, getRecentTracks } from '@/api/lastfm'
import { computed, ref } from 'vue'
import { ChartNoAxesColumn } from '@lucide/vue'

const siteTitle = `
  █████████    █████████   ███████████ ██████████ ███████████   ███████████
 ███▒▒▒▒▒███  ███▒▒▒▒▒███ ▒█▒▒▒███▒▒▒█▒▒███▒▒▒▒▒█▒▒███▒▒▒▒▒███ ▒█▒▒▒▒▒▒███
▒███    ▒▒▒  ▒███    ▒███ ▒   ▒███  ▒  ▒███  █ ▒  ▒███    ▒███ ▒     ███▒
▒▒█████████  ▒███████████     ▒███     ▒██████    ▒██████████       ███
 ▒▒▒▒▒▒▒▒███ ▒███▒▒▒▒▒███     ▒███     ▒███▒▒█    ▒███▒▒▒▒▒███     ███
 ███    ▒███ ▒███    ▒███     ▒███     ▒███ ▒   █ ▒███    ▒███   ████     █
▒▒█████████  █████   █████    █████    ██████████ █████   █████ ███████████
 ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒   ▒▒▒▒▒    ▒▒▒▒▒    ▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒   ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒
`

const birthDate = ref(new Date('10/11/2009'))
const currentDate = ref(new Date())
// const isBirthday = computed(() => {
//   if (
//     currentDate.value.getMonth() === birthDate.value.getMonth() &&
//     currentDate.value.getDay() === birthDate.value.getDay()
//   ) {
//     return true
//   }

//   return false
// })
const currentAge = computed(() => {
  let age = currentDate.value.getFullYear() - birthDate.value.getFullYear()
  if (
    currentDate.value.getMonth() < birthDate.value.getMonth() ||
    (currentDate.value.getMonth() === birthDate.value.getMonth() &&
      currentDate.value.getDay() < birthDate.value.getDay())
  ) {
    age--
  }
  return age
})

const recentTracks = ref<Awaited<ReturnType<typeof getRecentTracks>> | null>(null)
const currentAnimes = ref<CurrentlyWatchingAnime[] | null>(null)
const recentlyFinishedAnimes = ref<RecentlyFinishedAnime[] | null>(null)

getRecentTracks(15).then((tracks) => {
  recentTracks.value = tracks
})
getCurrentlyWatchingAnime(10).then((animes) => {
  currentAnimes.value = animes
})
getRecentlyFinished(10).then((animes) => {
  recentlyFinishedAnimes.value = animes
})
</script>

<template>
  <div class="home">
    <div class="home__main">
      <div class="home__bio">
        <h1 class="home-bio__title" aria-label="Saterz">{{ siteTitle }}</h1>
        <p class="home-bio__subtitle">
          A {{ currentAge }}yo Caribbean-born bilingual aspiring developer, <a href="/photos">photographer</a> and artist.
        </p>
      </div>
    </div>

    <aside class="home__music">
      <div class="home-music__header">
        <h3 class="home-music__title">Music</h3>
        <p v-if="recentTracks" class="home-music__scrobbles">
          {{ recentTracks['@attr'].total }}+ scrobbles
        </p>
      </div>
      <div v-if="recentTracks" class="home-music__tracks">
        <div v-for="track in recentTracks.track" :key="track.url" class="home-music__track">
          <img
            :src="getLastFMImage(track.image, 'medium')"
            class="home-music__track-image u-no-flex-shrink"
            alt=""
          />
          <div class="home-music__track-details">
            <a :href="track.url">
              <p>{{ track.name }}</p>
            </a>
            <p>{{ track.artist['#text'] }}</p>
          </div>
          <p
            v-if="track['@attr']?.nowplaying === 'true'"
            class="home-music__now-playing u-no-flex-shrink"
            title="Now playing"
          >
            <ChartNoAxesColumn />
          </p>
        </div>
      </div>
      <p v-else class="home-music__loading">Loading tracks...</p>
    </aside>
  </div>
</template>

<style>
.u-horizontal-scroll {
  display: flex;
  gap: 2rem;
  overflow-x: scroll;
}

.u-no-flex-shrink {
  flex-shrink: 0;
}

.u-width-content {
  width: fit-content;
}

.home {
  display: grid;
  grid-template-columns: 85% 15%;
  height: 100dvh;
}

.home__bio {
  display: flex;
  flex-direction: column;
}

.home-bio__title {
  margin-bottom: 1rem;
  overflow-x: auto;
  white-space: pre;
  font-family: 'JetBrains Mono';
  font-weight: normal;
  font-size: 2rem;
  line-height: 1;
}

.home-bio__subtitle {
    font-size: 2rem;
}

.home__music {
  display: flex;
  flex-direction: column;
  max-height: 50%;
  overflow: hidden;
}

.home-music__title {
  font-size: 2rem;
}

.home-music__tracks {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 1rem;
}

.home-music__track {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.home-music__track-image {
  border-radius: 10%;
  flex-shrink: 0;
}

.home-music__track-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.home-music__track-details p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
