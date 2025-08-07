<template>
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
</template>

<script setup lang="ts">
import {
  HomeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
</script>
