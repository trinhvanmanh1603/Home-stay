<template>
  <div v-if="loading" class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SkeletonLoader variant="detail" />
    </div>
  </div>

  <div v-else-if="stay" class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Image Gallery -->
      <StayGallery :stay="stay" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Stay Information -->
          <StayInfo :stay="stay" :actual-rating="actualRating" />

          <!-- Reviews -->
          <ReviewSection :stay-id="stay.id" />
        </div>

        <!-- Booking Card -->
        <div class="lg:col-span-1">
          <BookingCard
            :stay="stay"
            :booking-form="bookingForm"
            :nights="nights"
            :total-price="totalPrice"
            :can-book="canBook"
            :is-authenticated="authStore.isAuthenticated"
            @book="openBookingModal"
          />
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModal
      :is-open="showBookingModal"
      :stay="stay"
      :initial-check-in="bookingForm.checkIn"
      :initial-check-out="bookingForm.checkOut"
      :initial-guests="bookingForm.guests"
      @close="closeBookingModal"
      @booking-created="handleBookingCreated"
    />
  </div>

  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <EmptyState 
        title="Không tìm thấy thông tin chỗ ở" 
        description="Chỗ ở bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
        action-text="Quay về trang chủ"
        @action="$router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useStayDetail } from '@/composables/useStayDetail'

// Components
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StayGallery from '@/components/stay/StayGallery.vue'
import StayInfo from '@/components/stay/StayInfo.vue'
import BookingCard from '@/components/stay/BookingCard.vue'
import ReviewSection from '@/components/ReviewSection.vue'
import BookingModal from '@/components/BookingModal.vue'

// Stores
const authStore = useAuthStore()

// Composable
const {
  // State
  stay,
  loading,
  showBookingModal,
  bookingForm,
  
  // Computed
  actualRating,
  nights,
  totalPrice,
  canBook,
  
  // Methods
  loadStayDetail,
  openBookingModal,
  closeBookingModal,
  handleBookingCreated
} = useStayDetail()

onMounted(() => {
  loadStayDetail()
})
</script>
