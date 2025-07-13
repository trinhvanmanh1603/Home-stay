<template>
  <div>
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

    <!-- Featured Stays -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Homestay nổi bật
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Những lựa chọn được yêu thích nhất từ cộng đồng du lịch
          </p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
            <div class="space-y-2">
              <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
            </div>
          </div>
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

    <!-- Features Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tại sao chọn HomeStay?
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Trải nghiệm như ở nhà
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Cảm nhận không gian ấm cúng và thân thiện như chính ngôi nhà của bạn
            </p>
          </div>

          <div class="text-center">
            <div class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Giá cả hợp lý
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Tận hưởng kỳ nghỉ tuyệt vời với mức giá phù hợp với túi tiền
            </p>
          </div>

          <div class="text-center">
            <div class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              An toàn & tin cậy
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Hệ thống đánh giá minh bạch và chính sách bảo vệ khách hàng toàn diện
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStayStore } from '@/store/stays'
import SearchBar from '@/components/SearchBar.vue'
import StayCard from '@/components/StayCard.vue'
import {
  ArrowRightIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const stayStore = useStayStore()

const loading = computed(() => stayStore.loading)
const featuredStays = computed(() => stayStore.stays.slice(0, 6))

onMounted(() => {
  stayStore.fetchStays()
})
</script>
