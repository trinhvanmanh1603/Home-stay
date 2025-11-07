<template>
  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center text-white min-h-[600px]"
    :style="{ backgroundImage: `url(${heroImage})` }"
  >
  <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36"></div>
  </section>

  <!-- Search Section -->
  <section class="relative -mt-48 bg-transparent">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchBar />
    </div>
  </section>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'

const heroImage = 'https://static.vinwonders.com/production/homestay-la-gi-banner.jpg'
</script>
