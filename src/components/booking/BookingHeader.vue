<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Chi tiết đặt phòng #{{ booking.id }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Đặt ngày: {{ formatDate(booking.createdAt) }}
        </p>
      </div>
      <div class="text-right">
        <StatusBadge 
          :status="booking.status"
          :label="getStatusText(booking.status)"
        />
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Thanh toán: {{ getPaymentStatusText(booking.paymentStatus) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  formatDate: (date: string) => string
  getStatusText: (status: string) => string
  getPaymentStatusText: (status: string) => string
}

defineProps<Props>()
</script>
