<script setup lang="ts">
import photoManifest from '@/data/photo-manifest.json'

const photos = [...photoManifest].sort((a, b) => b.takenAt.localeCompare(a.takenAt))
</script>

<template>
  <section class="gallery">
    <a
      v-for="photo in photos"
      :key="photo.src"
      :href="photo.src"
      target="_blank"
      class="gallery__photo"
      hide-ball
    >
      <img
        :src="photo.src"
        :alt="photo.location ?? photo.filename"
        loading="lazy"
        class="gallery__photo-image"
      />

      <div class="gallery__photo-details">
        <p v-if="photo.location">{{ photo.location }}</p>
        <p v-if="photo.takenAt">{{ photo.takenAt }}</p>
        <p v-if="photo.camera">{{ photo.camera }}</p>
      </div>
    </a>
  </section>
</template>

<style lang="css">
.gallery {
  columns: 3;
  gap: 1rem;
  padding-block: 5rem;
}

.gallery__photo {
  position: relative;
  display: block;
  height: fit-content;
  overflow: hidden;
  break-inside: avoid;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.gallery__photo:hover .gallery__photo-details {
  opacity: 1;
}

.gallery__photo-image {
  display: block;
  width: 100%;
  height: auto;
}

.gallery__photo-details {
  position: absolute;

  text-decoration: none;
  color: white;
  text-shadow: 0 1px 3px rgb(0 0 0 / 80%);

  backdrop-filter: blur(15px);

  width: 100%;
  padding: 0.5rem;
  z-index: 1;
  opacity: 0%;
  bottom: 0;
  left: 0;

  transition: opacity 200ms ease;
}

@media (max-width: 64rem) {
    .gallery {
        columns: 2;
    }
}

@media (max-width: 40rem) {
    .gallery {
        columns: 1;
    }
}
</style>
