<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Thông tin homestay
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <ImagePlaceholder
          :src="stay.images[0]" 
          :alt="stay.title"
          class="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <div class="md:col-span-2">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          {{ stay.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-3">
          {{ stay.location }}, {{ stay.city }}
        </p>
        <div class="flex items-center mb-3">
          <StarIcon class="h-5 w-5 text-yellow-400" />
          <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">
            {{ stay.rating }} ({{ stay.reviewCount }} đánh giá)
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Tối đa:</span>
            <span class="ml-2 text-gray-900 dark:text-white">{{ stay.maxGuests }} khách</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Phòng ngủ:</span>
            <span class="ml-2 text-gray-900 dark:text-white">{{ stay.bedrooms }}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Phòng tắm:</span>
            <span class="ml-2 text-gray-900 dark:text-white">{{ stay.bathrooms }}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Giá/đêm:</span>
            <PriceDisplay 
              :amount="stay.price" 
              variant="muted" 
              size="sm" 
              class="ml-2 inline"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/solid'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import PriceDisplay from '@/components/common/PriceDisplay.vue'
import type { Stay } from '@/types'

interface Props {
  stay: Stay
}

defineProps<Props>()
</script>
