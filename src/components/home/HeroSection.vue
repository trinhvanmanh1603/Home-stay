<template>
  <!-- Hero Section -->
  <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Khám phá những trải nghiệm
          <span class="text-yellow-300">độc đáo</span>
        </h1>
        <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Tìm kiếm và đặt phòng homestay tuyệt vời tại những địa điểm đẹp nhất Việt Nam
        </p>
      </div>
    </div>
  </section>

  <!-- Search Section -->
  <section class="relative -mt-16 mb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchBar />
    </div>
  </section>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
</script>
