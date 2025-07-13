<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Image -->
    <div class="relative h-48">
      <img
        :src="stay.images[0]"
        :alt="stay.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-md">
        <RatingDisplay 
          :rating="actualRating.roundedRating" 
          :review-count="actualRating.totalReviews"
          size="sm"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
          {{ stay.title }}
        </h3>
      </div>

      <!-- Brand Display -->
      <div v-if="stay.brand" class="mb-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <BuildingOfficeIcon class="w-3 h-3 mr-1" />
          {{ stay.brand }}
        </span>
      </div>

      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
        <MapPinIcon class="h-4 w-4 mr-1" />
        <span>{{ stay.location }}, {{ stay.city }}</span>
      </div>

      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
        <UserGroupIcon class="h-4 w-4 mr-1" />
        <span>{{ stay.maxGuests }} khách</span>
        <span class="mx-2">•</span>
        <span>{{ stay.bedrooms }} phòng ngủ</span>
        <span class="mx-2">•</span>
        <span>{{ stay.bathrooms }} phòng tắm</span>
      </div>

      <!-- Amenities -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="amenity in stay.amenities.slice(0, 3)"
          :key="amenity"
          class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
        >
          {{ amenity }}
        </span>
        <span
          v-if="stay.amenities.length > 3"
          class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
        >
          +{{ stay.amenities.length - 3 }} khác
        </span>
      </div>

      <!-- Price and CTA -->
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            {{ formatPrice(stay.price) }}
          </span>
          <span class="text-gray-600 dark:text-gray-400">/đêm</span>
        </div>
        <RouterLink
          :to="`/stay/${stay.id}`"
          class="btn-primary text-sm px-4 py-2"
        >
          Xem chi tiết
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPinIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import { useRatings } from '@/composables/useRatings'
import RatingDisplay from '@/components/RatingDisplay.vue'
import type { StayCardProps } from '@/types'

const props = defineProps<StayCardProps>()

const { loadReviews, getStayRating } = useRatings()

// Tính toán rating thực tế từ reviews
const actualRating = computed(() => getStayRating(props.stay.id))

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

onMounted(() => {
  loadReviews()
})
</script>
