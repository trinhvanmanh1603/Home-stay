<template>
  <section class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Homestay nổi bật
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Những lựa chọn được yêu thích nhất từ cộng đồng du lịch
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader 
          v-for="n in 6" 
          :key="n" 
          variant="card" 
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StayCard
          v-for="stay in featuredStays"
          :key="stay.id"
          :stay="stay"
        />
      </div>

      <div class="text-center mt-12">
        <RouterLink to="/stays" class="btn-primary inline-flex items-center space-x-2 px-8 py-3">
          <span>Xem tất cả homestay</span>
          <ArrowRightIcon class="h-5 w-5" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StayCard from '@/components/StayCard.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { Stay } from '@/types'

defineProps<{
  loading: boolean
  featuredStays: Stay[]
}>()
</script>
