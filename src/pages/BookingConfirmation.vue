<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Success Header -->
      <div class="text-center mb-8">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <CheckCircleIcon class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Đặt phòng thành công!
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Cảm ơn bạn đã đặt phòng. Đây là thông tin chi tiết về booking của bạn.
        </p>
      </div>

      <!-- Booking Details Card -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" v-if="booking">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Thông tin đặt phòng #{{ booking.id }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Đặt ngày: {{ formatDate(booking.createdAt) }}
          </p>
        </div>

        <div class="px-6 py-4 space-y-6">
          <!-- Stay Info -->
          <div v-if="booking.stay">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Thông tin homestay
            </h3>
            <div class="flex items-start space-x-4">
              <ImagePlaceholder
                :src="booking.stay.images[0]" 
                :alt="booking.stay.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ booking.stay.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ booking.stay.location }}, {{ booking.stay.city }}
                </p>
                <div class="flex items-center mt-1">
                  <StarIcon class="h-4 w-4 text-yellow-400" />
                  <span class="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {{ booking.stay.rating }} ({{ booking.stay.reviewCount }} đánh giá)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Chi tiết đặt phòng
              </h3>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Check-in:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDate(booking.checkIn) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Check-out:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDate(booking.checkOut) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Số khách:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.guests }} người
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Số đêm:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ calculateNights() }} đêm
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Thông tin khách
              </h3>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Họ tên:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.guestInfo.firstName }} {{ booking.guestInfo.lastName }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Email:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.guestInfo.email }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600 dark:text-gray-400">Điện thoại:</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.guestInfo.phone }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Payment Info -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Thông tin thanh toán
            </h3>
            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <BookingSummary 
                :nights="calculateNights()"
                :price-per-night="booking.stay?.price || 0"
                :total-price="booking.totalPrice"
                :deposit-amount="booking.depositAmount"
                :remaining-amount="booking.remainingAmount"
                show-details
              />
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                <dt class="text-sm font-medium text-gray-900 dark:text-white">Trạng thái:</dt>
                <dd>
                  <StatusBadge 
                    :status="booking.paymentStatus"
                    :label="getStatusText(booking.paymentStatus)"
                  />
                </dd>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div v-if="booking.specialRequests">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Yêu cầu đặc biệt
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              {{ booking.specialRequests }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="router.push('/')"
          class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Về trang chủ
        </button>
        <button
          @click="router.push('/stays')"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tìm homestay khác
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải thông tin...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Không tìm thấy thông tin đặt phòng
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ error }}
        </p>
        <button
          @click="router.push('/')"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/store/booking'
import { CheckCircleIcon, StarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import BookingSummary from '@/components/common/BookingSummary.vue'
import type { Booking } from '@/types'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const booking = ref<Booking | null>(null)
const loading = ref(true)
const error = ref<string>('')

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateNights = (): number => {
  if (!booking.value) return 0
  const checkIn = new Date(booking.value.checkIn)
  const checkOut = new Date(booking.value.checkOut)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'fully_paid':
      return 'Đã thanh toán đầy đủ'
    case 'deposit_paid':
      return 'Đã đặt cọc'
    case 'unpaid':
      return 'Chưa thanh toán'
    case 'refunded':
      return 'Đã hoàn tiền'
    default:
      return 'Không xác định'
  }
}

onMounted(async () => {
  const bookingId = route.params.id as string
  
  try {
    // Tìm booking theo ID
    await bookingStore.getBookings()
    booking.value = bookingStore.bookings.find(b => b.id === bookingId) || null
    
    if (!booking.value) {
      error.value = 'Không tìm thấy thông tin đặt phòng với ID này.'
    }
  } catch (err) {
    console.error('Error fetching booking:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin đặt phòng.'
  } finally {
    loading.value = false
  }
})
</script>
