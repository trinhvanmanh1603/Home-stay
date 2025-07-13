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
            @click="$router.go(-1)"
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
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Thông tin đặt phòng
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Stay Details -->
              <div class="border-b pb-4">
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">Ngày nhận:</span>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(checkIn) }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">Ngày trả:</span>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(checkOut) }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">Số khách:</span>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ guests }} khách</p>
                  </div>
                </div>
              </div>

              <!-- Guest Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin khách hàng
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ *
                    </label>
                    <input
                      v-model="bookingData.guestInfo.firstName"
                      type="text"
                      required
                      class="input-field"
                      placeholder="Nhập họ"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên *
                    </label>
                    <input
                      v-model="bookingData.guestInfo.lastName"
                      type="text"
                      required
                      class="input-field"
                      placeholder="Nhập tên"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      v-model="bookingData.guestInfo.email"
                      type="email"
                      required
                      class="input-field"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      v-model="bookingData.guestInfo.phone"
                      type="tel"
                      required
                      class="input-field"
                      placeholder="0123456789"
                    />
                  </div>
                </div>
              </div>

              <!-- Special Requests -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yêu cầu đặc biệt (tuỳ chọn)
                </label>
                <textarea
                  v-model="bookingData.specialRequests"
                  rows="3"
                  class="input-field"
                  placeholder="Nhập yêu cầu đặc biệt nếu có..."
                ></textarea>
              </div>

              <!-- Terms -->
              <div class="flex items-start space-x-2">
                <input
                  v-model="acceptTerms"
                  type="checkbox"
                  required
                  class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label class="text-sm text-gray-700 dark:text-gray-300">
                  Tôi đồng ý với 
                  <a href="#" class="text-primary-600 hover:underline">điều khoản sử dụng</a> 
                  và 
                  <a href="#" class="text-primary-600 hover:underline">chính sách bảo mật</a>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="submitting || !acceptTerms"
                class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting">Đang xử lý...</span>
                <span v-else>Xác nhận đặt phòng</span>
              </button>
            </form>
          </div>

          <!-- Booking Summary -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Tóm tắt đặt phòng
            </h2>

            <!-- Stay Info -->
            <div class="flex space-x-4 mb-6">
              <img
                :src="stay.images[0]"
                :alt="stay.title"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ stay.title }}</h3>
                <div class="flex items-center space-x-1 mt-1">
                  <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ stay.rating }} ({{ stay.reviewCount }} đánh giá)
                  </span>
                </div>
                <div class="flex items-center space-x-1 mt-1">
                  <MapPinIcon class="h-4 w-4 text-gray-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ stay.location }}, {{ stay.city }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-3 border-t pt-4">
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{{ nights }} đêm x {{ formatPrice(stay.price) }}</span>
                <span>{{ formatPrice(stay.price * nights) }}</span>
              </div>
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Phí dịch vụ</span>
                <span>{{ formatPrice(serviceFee) }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
                <span>Tổng cộng</span>
                <span>{{ formatPrice(totalAmount) }}</span>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <ShieldCheckIcon class="h-5 w-5 text-green-500" />
                <span class="font-semibold text-gray-900 dark:text-white">Thanh toán an toàn</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Bạn sẽ thanh toán sau khi chủ nhà xác nhận đặt phòng
              </p>
            </div>
          </div>
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
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
        <div class="text-center">
          <CheckCircleIcon class="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Đặt phòng thành công!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Chúng tôi đã gửi thông tin đặt phòng đến email của bạn. 
            Chủ nhà sẽ liên hệ xác nhận trong vòng 24 giờ.
          </p>
          <div class="space-y-3">
            <button
              @click="goToHome"
              class="w-full btn-primary"
            >
              Về trang chủ
            </button>
            <button
              @click="showSuccessModal = false"
              class="w-full btn-secondary"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useStayStore } from '@/store/stays'
import { useBookingStore } from '@/store/booking'
import {
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import type { Stay } from '@/types'

const route = useRoute()
const router = useRouter()
const stayStore = useStayStore()
const bookingStore = useBookingStore()

const stay = ref<Stay | null>(null)
const loading = ref<boolean>(true)
const submitting = ref<boolean>(false)
const acceptTerms = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)

// Get query params
const checkIn = route.query.checkIn as string
const checkOut = route.query.checkOut as string
const guests = parseInt(route.query.guests as string) || 1

const bookingData = reactive({
  stayId: route.params.id as string,
  guestInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  checkIn,
  checkOut,
  guests,
  totalPrice: 0,
  specialRequests: ''
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const nights = computed(() => {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const serviceFee = computed(() => {
  if (!stay.value) return 0
  return Math.round(stay.value.price * nights.value * 0.1) // 10% service fee
})

const totalAmount = computed(() => {
  if (!stay.value) return 0
  return (stay.value.price * nights.value) + serviceFee.value
})

const handleSubmit = async () => {
  if (!stay.value || !acceptTerms.value) return
  
  submitting.value = true
  
  try {
    bookingData.totalPrice = totalAmount.value
    await bookingStore.createBooking(bookingData)
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error creating booking:', error)
    alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.')
  } finally {
    submitting.value = false
  }
}

const goToHome = () => {
  router.push('/')
}

onMounted(async () => {
  const stayId = route.params.id as string
  
  if (!checkIn || !checkOut) {
    router.push(`/stay/${stayId}`)
    return
  }
  
  try {
    stay.value = await stayStore.getStayById(stayId)
  } catch (error) {
    console.error('Error loading stay:', error)
  } finally {
    loading.value = false
  }
})
</script>
