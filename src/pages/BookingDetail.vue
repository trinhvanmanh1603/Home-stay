<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải thông tin đặt phòng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Không tìm thấy thông tin đặt phòng
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <RouterLink to="/" class="btn-primary">
          Về trang chủ
        </RouterLink>
      </div>

      <!-- Booking Detail -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Header -->
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
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(booking.status)">
                {{ getStatusText(booking.status) }}
              </span>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Thanh toán: {{ getPaymentStatusText(booking.paymentStatus) }}
              </p>
            </div>
          </div>
        </div>

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
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6" v-if="stay">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin homestay
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1">
              <img 
                :src="stay.images[0]" 
                :alt="stay.title"
                class="w-full h-48 object-cover rounded-lg"
              >
            </div>
            <div class="md:col-span-2">
              <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {{ stay.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-3">
                {{ stay.location }}, {{ stay.city }}
              </p>
              <div class="flex items-center mb-3">
                <StarIcon class="h-5 w-5 text-yellow-400" />
                <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ stay.rating }} ({{ stay.reviewCount }} đánh giá)
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600 dark:text-gray-400">Tối đa:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ stay.maxGuests }} khách</span>
                </div>
                <div>
                  <span class="text-gray-600 dark:text-gray-400">Phòng ngủ:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ stay.bedrooms }}</span>
                </div>
                <div>
                  <span class="text-gray-600 dark:text-gray-400">Phòng tắm:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ stay.bathrooms }}</span>
                </div>
                <div>
                  <span class="text-gray-600 dark:text-gray-400">Giá/đêm:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ formatCurrency(stay.price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Check-in/out Info -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin lưu trú
            </h2>
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
          </div>

          <!-- Guest Information -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin khách hàng
            </h2>
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
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin thanh toán
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-3">Tổng quan</h3>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Tổng tiền:</dt>
                  <dd class="text-gray-900 dark:text-white font-medium">
                    {{ formatCurrency(booking.totalPrice) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Đã thanh toán:</dt>
                  <dd class="text-green-600 font-medium">
                    {{ formatCurrency(booking.depositAmount) }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-600 dark:text-gray-400">Còn lại:</dt>
                  <dd class="text-gray-900 dark:text-white font-medium">
                    {{ formatCurrency(booking.remainingAmount) }}
                  </dd>
                </div>
              </dl>
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
        </div>

        <!-- Special Requests -->
        <div v-if="booking.specialRequests" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Yêu cầu đặc biệt
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ booking.specialRequests }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="router.push('/')"
              class="btn-secondary flex-1"
            >
              Về trang chủ
            </button>
            <button
              v-if="booking.remainingAmount > 0 && booking.paymentStatus !== 'fully_paid'"
              @click="payRemaining"
              class="btn-primary flex-1"
            >
              Thanh toán số tiền còn lại
            </button>
            <button
              v-if="canCancel"
              @click="cancelBooking"
              class="btn-danger flex-1"
            >
              Hủy đặt phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useBookingStore } from '@/store/booking'
import { StarIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'
import type { Booking, Stay } from '@/types'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const booking = ref<Booking | null>(null)
const stay = ref<Stay | null>(null)
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const calculateNights = (): number => {
  if (!booking.value) return 0
  const checkIn = new Date(booking.value.checkIn)
  const checkOut = new Date(booking.value.checkOut)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'pending':
      return 'Chờ xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    case 'completed':
      return 'Hoàn thành'
    case 'deposit_paid':
      return 'Đã đặt cọc'
    default:
      return 'Không xác định'
  }
}

const getPaymentStatusText = (paymentStatus: string): string => {
  switch (paymentStatus) {
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

const canCancel = computed(() => {
  if (!booking.value) return false
  const now = new Date()
  const checkIn = new Date(booking.value.checkIn)
  const timeDiff = checkIn.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return booking.value.status === 'pending' || 
         (booking.value.status === 'confirmed' && daysDiff > 1)
})

const payRemaining = () => {
  // TODO: Implement payment for remaining amount
  alert('Chức năng thanh toán số tiền còn lại sẽ được triển khai sau.')
}

const cancelBooking = async () => {
  if (!booking.value || !confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) return
  
  try {
    // TODO: Implement booking cancellation
    alert('Chức năng hủy đặt phòng sẽ được triển khai sau.')
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert('Có lỗi xảy ra khi hủy đặt phòng.')
  }
}

onMounted(async () => {
  const bookingId = route.params.id as string
  
  try {
    // Load all bookings first
    await bookingStore.getBookings()
    
    // Find the specific booking
    booking.value = bookingStore.bookings.find(b => b.id === bookingId) || null
    
    if (!booking.value) {
      error.value = 'Không tìm thấy thông tin đặt phòng với ID này.'
    } else {
      // Load stay information
      try {
        const response = await axios.get(`http://localhost:3001/stays/${booking.value.stayId}`)
        stay.value = response.data
      } catch (stayError) {
        console.error('Error loading stay:', stayError)
        // Keep booking info even if stay loading fails
      }
    }
  } catch (err) {
    console.error('Error fetching booking:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin đặt phòng.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
</style>
