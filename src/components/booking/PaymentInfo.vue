<template>
  <InfoCard 
    title="Thông tin thanh toán"
    icon="credit-card"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">Tổng quan</h3>
        <BookingSummary 
          :nights="nights"
          :price-per-night="pricePerNight"
          :total-price="booking.totalPrice"
          :deposit-amount="booking.depositAmount"
          :remaining-amount="booking.remainingAmount"
          show-details
        />
      </div>
      
      <!-- Payment History -->
      <div v-if="booking.paymentHistory && booking.paymentHistory.length > 0">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">Lịch sử thanh toán</h3>
        <div class="space-y-2">
          <div 
            v-for="payment in booking.paymentHistory" 
            :key="payment.id"
            class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(payment.amount) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ formatDate(payment.createdAt) }}
              </p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full"
                  :class="payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'">
              {{ payment.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </InfoCard>
</template>

<script setup lang="ts">
import InfoCard from '@/components/common/InfoCard.vue'
import BookingSummary from '@/components/common/BookingSummary.vue'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  nights: number
  pricePerNight: number
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}

defineProps<Props>()
</script>
