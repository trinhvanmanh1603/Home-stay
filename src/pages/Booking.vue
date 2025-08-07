<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse">
        <div class="bg-gray-300 dark:bg-gray-700 h-8 rounded w-1/3 mb-6"></div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div class="space-y-4">
            <div class="bg-gray-300 dark:bg-gray-700 h-6 rounded w-1/2"></div>
            <div class="bg-gray-300 dark:bg-gray-700 h-20 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="stay">
        <!-- Header -->
        <div class="mb-8">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            <span>Quay lại</span>
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Đặt phòng: {{ stay.title }}
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Booking Form -->
          <BookingForm
            :booking-data="bookingData"
            :check-in="checkIn"
            :check-out="checkOut"
            :guests="guests"
            :accept-terms="acceptTerms"
            :submitting="submitting"
            :can-submit="canSubmit"
            :format-date="formatDate"
            @submit="handleSubmit"
            @update:first-name="bookingData.guestInfo.firstName = $event"
            @update:last-name="bookingData.guestInfo.lastName = $event"
            @update:email="bookingData.guestInfo.email = $event"
            @update:phone="bookingData.guestInfo.phone = $event"
            @update:special-requests="bookingData.specialRequests = $event"
            @update:accept-terms="acceptTerms = $event"
          />

          <!-- Booking Summary -->
          <BookingSummaryCard
            :stay="stay"
            :nights="nights"
            :service-fee="serviceFee"
            :total-amount="totalAmount"
            :format-price="formatPrice"
          />
        </div>
      </div>

      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Không tìm thấy thông tin homestay
        </h2>
        <RouterLink to="/stays" class="btn-primary">
          Quay lại danh sách
        </RouterLink>
      </div>
    </div>

    <!-- Success Modal -->
    <BookingSuccessModal
      :show-success-modal="showSuccessModal"
      @go-to-home="goToHome"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBooking } from '@/composables/useBooking'
import BookingForm from '@/components/booking/BookingForm.vue'
import BookingSummaryCard from '@/components/booking/BookingSummaryCard.vue'
import BookingSuccessModal from '@/components/booking/BookingSuccessModal.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

// Composable
const {
  // State
  stay,
  loading,
  submitting,
  acceptTerms,
  showSuccessModal,
  bookingData,
  checkIn,
  checkOut,
  guests,
  
  // Computed
  nights,
  serviceFee,
  totalAmount,
  canSubmit,
  
  // Methods
  formatPrice,
  formatDate,
  handleSubmit,
  goToHome,
  goBack,
  closeSuccessModal,
  initializeBooking
} = useBooking()

onMounted(() => {
  initializeBooking()
})
</script>
