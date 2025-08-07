<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md sticky top-24">
    <div class="mb-4">
      <PriceDisplay 
        :amount="stay.price" 
        variant="primary" 
        size="xl"
        class="mb-2"
      />
      <div class="text-gray-600 dark:text-gray-400 text-sm">/đêm</div>
    </div>

    <form @submit.prevent="$emit('book')" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nhận phòng
          </label>
          <input
            v-model="bookingForm.checkIn"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trả phòng
          </label>
          <input
            v-model="bookingForm.checkOut"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Số khách
        </label>
        <select
          v-model="bookingForm.guests"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option v-for="i in stay.maxGuests" :key="i" :value="i">{{ i }} khách</option>
        </select>
      </div>

      <div v-if="nights > 0" class="border-t pt-4">
        <BookingSummary 
          :nights="nights"
          :price-per-night="stay.price"
          :total-price="totalPrice"
        />
      </div>

      <button
        type="submit"
        :disabled="!canBook"
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ !isAuthenticated ? 'Đăng nhập để đặt phòng' : 'Đặt phòng' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import PriceDisplay from '@/components/common/PriceDisplay.vue'
import BookingSummary from '@/components/common/BookingSummary.vue'
import type { Stay } from '@/types'

interface Props {
  stay: Stay
  bookingForm: {
    checkIn: string
    checkOut: string
    guests: number
  }
  nights: number
  totalPrice: number
  canBook: boolean
  isAuthenticated: boolean
}

interface Emits {
  (e: 'book'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
