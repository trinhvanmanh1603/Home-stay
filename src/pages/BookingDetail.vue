<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner size="lg" message="Đang tải thông tin đặt phòng..." />
      </div>

      <!-- Error State -->
      <EmptyState 
        v-else-if="error"
        icon="error"
        title="Không tìm thấy thông tin đặt phòng"
        :description="error"
        action-text="Về trang chủ"
        action-link="/"
      />

      <!-- Booking Detail -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Header -->
        <BookingHeader 
          :booking="booking"
          :format-date="formatDate"
          :get-status-text="getStatusText"
          :get-payment-status-text="getPaymentStatusText"
        />

        <!-- Cancellation Reason -->
        <div v-if="booking.status === 'cancelled' && booking.cancellationReason" 
             class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
            Lý do hủy đặt phòng
          </h2>
          <p class="text-red-700 dark:text-red-300">
            {{ booking.cancellationReason }}
          </p>
        </div>

        <!-- Stay Information -->
        <StayInfo v-if="stay" :stay="stay" />

        <!-- Booking Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Check-in/out Info -->
          <InfoCard 
            title="Thông tin lưu trú"
            icon="calendar"
          >
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Nhận phòng:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ formatDate(booking.checkIn) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Trả phòng:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ formatDate(booking.checkOut) }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Số đêm:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ calculateNights() }} đêm
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Số khách:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ booking.guests }} người
                </dd>
              </div>
            </dl>
          </InfoCard>

          <!-- Guest Information -->
          <InfoCard 
            title="Thông tin khách hàng"
            icon="user"
          >
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Họ tên:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ booking.guestInfo.firstName }} {{ booking.guestInfo.lastName }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Email:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ booking.guestInfo.email }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Điện thoại:</dt>
                <dd class="text-gray-900 dark:text-white font-medium">
                  {{ booking.guestInfo.phone }}
                </dd>
              </div>
            </dl>
          </InfoCard>
        </div>

        <!-- Payment Information -->
        <PaymentInfo
          :booking="booking"
          :nights="calculateNights()"
          :price-per-night="stay?.price || 0"
          :format-currency="formatCurrency"
          :format-date="formatDate"
        />

        <!-- Special Requests -->
        <div v-if="booking.specialRequests" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Yêu cầu đặc biệt
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ booking.specialRequests }}</p>
        </div>

        <!-- Action Buttons -->
        <BookingActions
          :booking="booking"
          :can-cancel="canCancel"
          @go-home="goHome"
          @pay-remaining="payRemaining"
          @cancel-booking="cancelBooking"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookingDetail } from '@/composables/useBookingDetail'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import InfoCard from '@/components/common/InfoCard.vue'
import BookingHeader from '@/components/booking/BookingHeader.vue'
import StayInfo from '@/components/booking/StayInfo.vue'
import PaymentInfo from '@/components/booking/PaymentInfo.vue'
import BookingActions from '@/components/booking/BookingActions.vue'

// Use composable for all logic
const {
  // State
  booking,
  stay,
  loading,
  error,
  
  // Computed
  canCancel,
  
  // Methods
  formatDate,
  formatCurrency,
  calculateNights,
  getStatusText,
  getPaymentStatusText,
  loadBookingDetail,
  payRemaining,
  cancelBooking,
  goHome
} = useBookingDetail()

// Load data on mount
onMounted(() => {
  loadBookingDetail()
})
</script>
