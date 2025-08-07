<template>
  <div class="mb-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <img 
        :src="stay.images[0]" 
        :alt="stay.title" 
        class="w-full h-96 object-cover rounded-lg mb-4"
      >
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <img 
          v-for="(image, index) in stay.images.slice(1, 5)" 
          :key="index" 
          :src="image" 
          :alt="`${stay.title} - Hình ${index + 2}`" 
          class="w-full h-24 object-cover rounded-lg"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stay } from '@/types'

interface Props {
  stay: Stay
}

defineProps<Props>()
</script>
