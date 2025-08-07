<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
    <div class="p-6">
      <!-- Header with title and status -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {{ booking.stayTitle }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mã đặt phòng: #{{ booking.id.slice(-8).toUpperCase() }}
          </p>
          <div v-if="booking.stay" class="flex items-center space-x-1 mt-2">
            <MapPinIcon class="h-4 w-4 text-gray-400" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ booking.stay.location }}, {{ booking.stay.city }}
            </span>
          </div>
        </div>
        <StatusBadge 
          :status="booking.status" 
          :label="getStatusText(booking.status)"
        />
      </div>

      <div class="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
        <!-- Stay Image -->
        <ImagePlaceholder
          :src="booking.stay?.images?.[0] || '/placeholder-stay.jpg'"
          :alt="booking.stayTitle"
          class="w-full lg:w-32 h-24 lg:h-24 rounded-lg flex-shrink-0 mb-4 lg:mb-0"
        />
        
        <!-- Booking Info -->
        <div class="flex-1 min-w-0">
          <!-- Guest Info -->
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thông tin khách
            </p>
            <p class="text-gray-900 dark:text-white">
              {{ booking.guestInfo.firstName }} {{ booking.guestInfo.lastName }}
            </p>
            <div class="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>{{ booking.guestInfo.email }}</span>
              <span>•</span>
              <span>{{ booking.guestInfo.phone }}</span>
            </div>
          </div>
          
          <!-- Booking Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thời gian
              </p>
              <p class="text-gray-900 dark:text-white text-sm">
                {{ formatDate(booking.checkIn) }}
              </p>
              <p class="text-gray-900 dark:text-white text-sm">
                {{ formatDate(booking.checkOut) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ booking.nights }} đêm • {{ booking.guests }} khách
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thanh toán
              </p>
              <PriceDisplay 
                :amount="booking.totalPrice" 
                variant="primary" 
                size="md" 
                class="mb-1"
              />
              <div class="text-xs">
                <span v-if="booking.paymentStatus === 'fully_paid'" class="text-green-600 dark:text-green-400">
                  ✓ Đã thanh toán đầy đủ
                </span>
                <span v-else-if="booking.paymentStatus === 'deposit_paid'" class="text-yellow-600 dark:text-yellow-400">
                  ⏳ Đã cọc: {{ formatCurrency(booking.depositAmount) }}
                </span>
                <span v-else class="text-red-600 dark:text-red-400">
                  ⚠️ Chưa thanh toán
                </span>
              </div>
              <p v-if="booking.remainingAmount && booking.remainingAmount > 0" 
                 class="text-xs text-red-600 dark:text-red-400 mt-1">
                Còn lại: {{ formatCurrency(booking.remainingAmount) }}
              </p>
            </div>
            <div class="sm:col-span-2 lg:col-span-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày đặt
              </p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ formatDateTime(booking.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Cancellation reason display -->
          <div v-if="booking.status === 'cancelled' && booking.cancellationReason" 
               class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
              Lý do hủy:
            </p>
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ booking.cancellationReason }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end">
            <ActionButton
              label="Xem chi tiết"
              variant="primary"
              size="sm"
              @click="$emit('view-detail', booking)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon } from '@heroicons/vue/24/outline'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriceDisplay from '@/components/common/PriceDisplay.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
  formatDate: (date: string) => string
}

interface Emits {
  (e: 'view-detail', booking: Booking): void
}

defineProps<Props>()
defineEmits<Emits>()

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
