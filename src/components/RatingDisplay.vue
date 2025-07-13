<template>
  <div class="flex items-center space-x-1">
    <!-- Rating stars -->
    <div class="flex items-center">
      <svg
        v-for="star in 5"
        :key="star"
        :class="[
          'w-4 h-4',
          star <= Math.floor(props.rating) 
            ? 'text-yellow-400 fill-current' 
            : star === Math.ceil(props.rating) && props.rating % 1 !== 0
            ? 'text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        ]"
        viewBox="0 0 20 20"
      >
        <path
          v-if="star === Math.ceil(props.rating) && props.rating % 1 !== 0"
          :fill="star <= Math.floor(props.rating) ? 'currentColor' : `url(#half-star-${componentId})`"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
        <path
          v-else
          :fill="star <= props.rating ? 'currentColor' : 'none'"
          :stroke="star <= props.rating ? 'currentColor' : 'currentColor'"
          stroke-width="1"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
        <!-- Half star gradient definition -->
        <defs v-if="star === Math.ceil(props.rating) && props.rating % 1 !== 0">
          <linearGradient :id="`half-star-${componentId}`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop :offset="`${(props.rating % 1) * 100}%`" stop-color="currentColor" />
            <stop :offset="`${(props.rating % 1) * 100}%`" stop-color="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Rating text -->
    <div class="flex items-center space-x-1 text-sm">
      <span :class="getRatingColor(props.rating)" class="font-semibold">
        {{ formatRating(props.rating) }}
      </span>
      <span class="text-gray-600 dark:text-gray-400">
        ({{ props.reviewCount }} {{ props.reviewCount === 1 ? 'đánh giá' : 'đánh giá' }})
      </span>
      <span v-if="props.showRatingText" :class="getRatingColor(props.rating)" class="text-xs font-medium">
        • {{ getRatingText(props.rating) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRatings } from '@/composables/useRatings'
import type { RatingDisplayProps } from '@/types'

const props = withDefaults(defineProps<RatingDisplayProps>(), {
  showRatingText: false,
  size: 'md'
})

const { formatRating, getRatingText, getRatingColor } = useRatings()

// Tạo ID duy nhất cho component để tránh xung đột gradient
const componentId = computed(() => Math.random().toString(36).substr(2, 9))
</script>