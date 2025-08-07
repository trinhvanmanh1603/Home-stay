<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Tóm tắt đặt phòng
    </h2>

    <!-- Stay Info -->
    <div class="flex space-x-4 mb-6">
      <img
        :src="stay.images[0]"
        :alt="stay.title"
        class="w-20 h-20 object-cover rounded-lg"
      />
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ stay.title }}</h3>
        <div class="flex items-center space-x-1 mt-1">
          <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ stay.rating }} ({{ stay.reviewCount }} đánh giá)
          </span>
        </div>
        <div class="flex items-center space-x-1 mt-1">
          <MapPinIcon class="h-4 w-4 text-gray-500" />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ stay.location }}, {{ stay.city }}
          </span>
        </div>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="space-y-3 border-t pt-4">
      <div class="flex justify-between text-gray-700 dark:text-gray-300">
        <span>{{ nights }} đêm x {{ formatPrice(stay.price) }}</span>
        <span>{{ formatPrice(stay.price * nights) }}</span>
      </div>
      <div class="flex justify-between text-gray-700 dark:text-gray-300">
        <span>Phí dịch vụ</span>
        <span>{{ formatPrice(serviceFee) }}</span>
      </div>
      <div class="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
        <span>Tổng cộng</span>
        <span>{{ formatPrice(totalAmount) }}</span>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div class="flex items-center space-x-2 mb-2">
        <ShieldCheckIcon class="h-5 w-5 text-green-500" />
        <span class="font-semibold text-gray-900 dark:text-white">Thanh toán an toàn</span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Bạn sẽ thanh toán sau khi chủ nhà xác nhận đặt phòng
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import type { Stay } from '@/types'

defineProps<{
  stay: Stay
  nights: number
  serviceFee: number
  totalAmount: number
  formatPrice: (price: number) => string
}>()
</script>
