<template>
  <div v-if="loading" class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="animate-pulse">
        <div class="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg mb-6"></div>
        <div class="space-y-4">
          <div class="bg-gray-300 dark:bg-gray-700 h-8 rounded w-3/4"></div>
          <div class="bg-gray-300 dark:bg-gray-700 h-6 rounded w-1/2"></div>
          <div class="bg-gray-300 dark:bg-gray-700 h-20 rounded"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="stay" class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Image Gallery -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div class="lg:col-span-1">
          <img
            :src="stay.images[0]"
            :alt="stay.title"
            class="w-full h-80 object-cover rounded-lg"
          />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <img
            v-for="(image, index) in stay.images.slice(1, 5)"
            :key="index"
            :src="image"
            :alt="`${stay.title} ${index + 2}`"
            class="w-full h-39 object-cover rounded-lg"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Title and Info -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ stay.title }}
            </h1>
            <!-- Brand Display -->
            <div v-if="stay.brand" class="mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <BuildingOfficeIcon class="w-4 h-4 mr-1" />
                {{ stay.brand }}
              </span>
            </div>
            <div class="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <RatingDisplay 
                :rating="actualRating.roundedRating" 
                :review-count="actualRating.totalReviews"
                show-rating-text
              />
              <div class="flex items-center space-x-1">
                <MapPinIcon class="h-5 w-5" />
                <span>{{ stay.location }}, {{ stay.city }}</span>
              </div>
            </div>
          </div>

          <!-- Host Info -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div class="flex items-center space-x-4">
              <img
                :src="stay.host.avatar"
                :alt="stay.host.name"
                class="w-12 h-12 rounded-full"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Chủ nhà: {{ stay.host.name }}
                </h3>
                <div class="flex items-center space-x-3 mt-1">
                  <div class="flex items-center space-x-1">
                    <CheckBadgeIcon v-if="stay.host.verified" class="h-4 w-4 text-primary-600" />
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ stay.host.verified ? 'Đã xác minh' : 'Chưa xác minh' }}
                    </span>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <UserIcon class="w-3 h-3 mr-1" />
                    Quản trị viên
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Mô tả
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ stay.description }}
            </p>
          </div>

          <!-- Property Details -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin chi tiết
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="flex items-center space-x-2">
                <UserGroupIcon class="h-5 w-5 text-gray-500" />
                <span class="text-gray-700 dark:text-gray-300">{{ stay.maxGuests }} khách</span>
              </div>
              <div class="flex items-center space-x-2">
                <HomeIcon class="h-5 w-5 text-gray-500" />
                <span class="text-gray-700 dark:text-gray-300">{{ stay.bedrooms }} phòng ngủ</span>
              </div>
              <div class="flex items-center space-x-2">
                <BeakerIcon class="h-5 w-5 text-gray-500" />
                <span class="text-gray-700 dark:text-gray-300">{{ stay.bathrooms }} phòng tắm</span>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tiện ích
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="amenity in stay.amenities"
                :key="amenity"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                <CheckIcon class="h-5 w-5 text-green-500" />
                <span>{{ amenity }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <ReviewSection :stay-id="stay.id" />
        </div>

        <!-- Booking Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
            <div class="mb-6">
              <div class="flex items-baseline space-x-2">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatPrice(stay.price) }}
                </span>
                <span class="text-gray-600 dark:text-gray-400">/đêm</span>
              </div>
              <RatingDisplay 
                :rating="actualRating.roundedRating" 
                :review-count="actualRating.totalReviews"
                size="sm"
              />
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nhận phòng
                  </label>
                  <input
                    v-model="bookingForm.checkIn"
                    type="date"
                    required
                    class="input-field text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trả phòng
                  </label>
                  <input
                    v-model="bookingForm.checkOut"
                    type="date"
                    required
                    class="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số khách
                </label>
                <select v-model="bookingForm.guests" class="input-field">
                  <option v-for="num in stay.maxGuests" :key="num" :value="num">
                    {{ num }} khách
                  </option>
                </select>
              </div>

              <div v-if="totalPrice > 0" class="border-t pt-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-600 dark:text-gray-400">{{ nights }} đêm x {{ formatPrice(stay.price) }}</span>
                  <span class="text-gray-900 dark:text-white">{{ formatPrice(stay.price * nights) }}</span>
                </div>
                <div class="flex justify-between items-center font-semibold text-lg">
                  <span class="text-gray-900 dark:text-white">Tổng cộng</span>
                  <span class="text-gray-900 dark:text-white">{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>

              <button
                @click="openBookingModal"
                :disabled="!canBook"
                class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đặt phòng ngay
              </button>
            </div>
          </div>
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
      @close="showBookingModal = false"
      @booking-created="handleBookingCreated"
    />
  </div>

  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Không tìm thấy homestay
      </h2>
      <RouterLink to="/stays" class="btn-primary">
        Quay lại danh sách
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useStayStore } from '@/store/stays'
import { useAuthStore } from '@/store/auth'
import { useRatings } from '@/composables/useRatings'
import BookingModal from '@/components/BookingModal.vue'
import ReviewSection from '@/components/ReviewSection.vue'
import RatingDisplay from '@/components/RatingDisplay.vue'
import {
  MapPinIcon,
  UserGroupIcon,
  HomeIcon,
  BeakerIcon,
  CheckIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import type { Stay, Booking } from '@/types'

const route = useRoute()
const router = useRouter()
const stayStore = useStayStore()
const authStore = useAuthStore()
const { loadReviews, getStayRating } = useRatings()

const stay = ref<Stay | null>(null)
const loading = ref<boolean>(true)
const showBookingModal = ref<boolean>(false)

// Tính toán rating thực tế từ reviews
const actualRating = computed(() => 
  stay.value ? getStayRating(stay.value.id) : { roundedRating: 0, totalReviews: 0 }
)

const bookingForm = reactive({
  checkIn: '',
  checkOut: '',
  guests: 1
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const nights = computed(() => {
  if (!bookingForm.checkIn || !bookingForm.checkOut) return 0
  const checkIn = new Date(bookingForm.checkIn)
  const checkOut = new Date(bookingForm.checkOut)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (!stay.value || nights.value <= 0) return 0
  return stay.value.price * nights.value
})

const canBook = computed(() => {
  return bookingForm.checkIn && 
         bookingForm.checkOut && 
         bookingForm.guests > 0 && 
         nights.value > 0 &&
         stay.value?.available
})

const openBookingModal = () => {
  // Kiểm tra đăng nhập trước khi mở booking modal
  if (!authStore.isAuthenticated) {
    // Redirect to login with current page as return path
    router.push({
      name: 'Login',
      query: { redirect: route.fullPath }
    })
    return
  }
  
  showBookingModal.value = true
}

const handleBookingCreated = (booking: Booking) => {
  // Navigate to booking confirmation or show success message
  router.push({
    name: 'BookingConfirmation', 
    params: { id: booking.id }
  })
}

onMounted(async () => {
  const stayId = route.params.id as string
  try {
    // Load stay data and reviews in parallel
    await Promise.all([
      stayStore.getStayById(stayId).then(data => stay.value = data),
      loadReviews()
    ])
  } catch (error) {
    console.error('Error loading stay:', error)
  } finally {
    loading.value = false
  }
})
</script>
