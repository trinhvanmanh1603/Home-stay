<template>
  <ModalWrapper 
    :is-open="isOpen" 
    @close="closeModal"
    max-width="4xl"
    class="z-50"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        {{ currentStep === 'availability' ? 'Kiểm tra phòng trống' : 
           currentStep === 'booking' ? 'Thông tin đặt phòng' :
           currentStep === 'payment' ? 'Thanh toán' : 'Xác nhận' }}
      </h3>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
                <!-- Step 1: Availability Check -->
                <div v-if="currentStep === 'availability'">
                  <AvailabilityChecker
                    :stay="stay"
                    :initial-check-in="bookingData.checkIn"
                    :initial-check-out="bookingData.checkOut"
                    :initial-guests="bookingData.guests"
                    @book="handleBookingRequest"
                    @availability-change="handleAvailabilityChange"
                  />
                </div>

                <!-- Step 2: Booking Form -->
                <div v-if="currentStep === 'booking'">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Booking Form -->
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Thông tin khách hàng
                      </h4>
                      <form @submit.prevent="handleCreateBooking" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Họ *
                            </label>
                            <input
                              v-model="guestInfo.lastName"
                              type="text"
                              required
                              class="input-field"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Tên *
                            </label>
                            <input
                              v-model="guestInfo.firstName"
                              type="text"
                              required
                              class="input-field"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email *
                          </label>
                          <input
                            v-model="guestInfo.email"
                            type="email"
                            required
                            class="input-field"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            v-model="guestInfo.phone"
                            type="tel"
                            required
                            class="input-field"
                          />
                        </div>
                        
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Yêu cầu đặc biệt
                          </label>
                          <textarea
                            v-model="specialRequests"
                            rows="3"
                            class="input-field"
                            placeholder="Ví dụ: Phòng không hút thuốc, cần thêm giường..."
                          ></textarea>
                        </div>

                        <div class="flex space-x-4 mt-6">
                          <button
                            type="button"
                            @click="currentStep = 'availability'"
                            class="flex-1 btn-secondary py-3"
                          >
                            Quay lại
                          </button>
                          <button
                            type="submit"
                            :disabled="!canCreateBooking || creating"
                            class="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span v-if="creating">Đang tạo...</span>
                            <span v-else>Tạo đặt phòng</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    <!-- Booking Summary -->
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Thông tin đặt phòng
                      </h4>
                      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Homestay:</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ stay.title }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Nhận phòng:</span>
                          <span class="text-gray-900 dark:text-white">{{ formatDate(bookingData.checkIn) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Trả phòng:</span>
                          <span class="text-gray-900 dark:text-white">{{ formatDate(bookingData.checkOut) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Số khách:</span>
                          <span class="text-gray-900 dark:text-white">{{ bookingData.guests }} người</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Số đêm:</span>
                          <span class="text-gray-900 dark:text-white">{{ totalNights }} đêm</span>
                        </div>
                        <hr class="border-gray-200 dark:border-gray-600">
                        
                        <!-- Payment Options -->
                        <div>
                          <span class="text-gray-600 dark:text-gray-400 block mb-2">Tùy chọn thanh toán:</span>
                          <div class="space-y-2">
                            <label class="flex items-center">
                              <input
                                v-model="paymentPercentage"
                                type="radio"
                                :value="50"
                                class="mr-2 text-primary-600"
                              />
                              <span class="text-sm text-gray-700 dark:text-gray-300">
                                Đặt cọc 50% ({{ formatPrice(bookingData.totalPrice * 0.5) }})
                              </span>
                            </label>
                            <label class="flex items-center">
                              <input
                                v-model="paymentPercentage"
                                type="radio"
                                :value="100"
                                class="mr-2 text-primary-600"
                              />
                              <span class="text-sm text-gray-700 dark:text-gray-300">
                                Thanh toán 100% ({{ formatPrice(bookingData.totalPrice) }})
                              </span>
                            </label>
                          </div>
                        </div>
                        
                        <hr class="border-gray-200 dark:border-gray-600">
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                          <span class="text-gray-900 dark:text-white font-bold text-lg">{{ formatPrice(bookingData.totalPrice) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">
                            {{ paymentPercentage === 100 ? 'Thanh toán ngay' : `Đặt cọc (${paymentPercentage}%)` }}:
                          </span>
                          <span class="text-primary-600 font-medium">{{ formatPrice(depositAmount) }}</span>
                        </div>
                        <div v-if="paymentPercentage === 50" class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Còn lại:</span>
                          <span class="text-gray-900 dark:text-white">{{ formatPrice(remainingAmount) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Payment -->
                <div v-if="currentStep === 'payment' && createdBooking">
                  <PaymentForm
                    :booking="createdBooking"
                    :payment-type="'deposit'"
                    :amount="depositAmount"
                    @success="handlePaymentSuccess"
                    @cancel="handlePaymentCancel"
                    @error="handlePaymentError"
                  />
                </div>

                <!-- Step 4: Confirmation -->
                <div v-if="currentStep === 'confirmation' && completedPayment">
                  <div class="text-center py-8">
                    <CheckCircleIcon class="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Đặt phòng thành công!
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                      Chúng tôi đã gửi email xác nhận đến {{ guestInfo.email }}
                    </p>
                    
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-left max-w-md mx-auto">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Thông tin đặt phòng</h4>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Mã đặt phòng:</span>
                          <span class="text-gray-900 dark:text-white font-medium">#{{ createdBooking?.id }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Đã thanh toán:</span>
                          <span class="text-green-600 font-medium">{{ formatPrice(completedPayment?.amount || 0) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600 dark:text-gray-400">Còn lại:</span>
                          <span class="text-gray-900 dark:text-white">{{ formatPrice(createdBooking?.remainingAmount || 0) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex space-x-4 mt-8 justify-center">
                      <button
                        @click="closeModal"
                        class="btn-secondary px-6 py-2"
                      >
                        Đóng
                      </button>
                      <button
                        @click="viewBooking"
                        class="btn-primary px-6 py-2"
                      >
                        Xem đặt phòng
                      </button>
                    </div>
                  </div>
                </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/store/booking'
import { useAuthStore } from '@/store/auth'
import {
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import AvailabilityChecker from './AvailabilityChecker.vue'
import PaymentForm from './PaymentForm.vue'
import ModalWrapper from './common/ModalWrapper.vue'
import type { Booking, Payment, BookingModalProps, BookingModalEmits, BookingData } from '@/types'

const props = defineProps<BookingModalProps>()
const emit = defineEmits<BookingModalEmits>()

const router = useRouter()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

// State
const currentStep = ref<'availability' | 'booking' | 'payment' | 'confirmation'>('availability')
const isAvailable = ref<boolean>(false)
const creating = ref<boolean>(false)
const createdBooking = ref<Booking | null>(null)
const completedPayment = ref<Payment | null>(null)

// Form data
const bookingData = reactive<BookingData>({
  stayId: props.stay.id,
  checkIn: props.initialCheckIn || '',
  checkOut: props.initialCheckOut || '',
  guests: props.initialGuests || 1,
  totalPrice: 0
})

const guestInfo = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const specialRequests = ref<string>('')
const paymentPercentage = ref<50 | 100>(50) // Thêm tùy chọn thanh toán

// Tự động điền thông tin từ user đã đăng nhập
const fillUserInfo = () => {
  if (authStore.user) {
    guestInfo.firstName = authStore.user.firstName
    guestInfo.lastName = authStore.user.lastName
    guestInfo.email = authStore.user.email
    guestInfo.phone = authStore.user.phone
  }
}

// Watch for auth changes
watch(() => authStore.user, fillUserInfo, { immediate: true })

// Computed
const totalNights = computed(() => {
  if (!bookingData.checkIn || !bookingData.checkOut) return 0
  const start = new Date(bookingData.checkIn)
  const end = new Date(bookingData.checkOut)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const depositAmount = computed(() => {
  return Math.round(bookingData.totalPrice * (paymentPercentage.value / 100))
})

const remainingAmount = computed(() => {
  return bookingData.totalPrice - depositAmount.value
})

const canCreateBooking = computed(() => {
  return guestInfo.firstName && 
         guestInfo.lastName && 
         guestInfo.email && 
         guestInfo.phone &&
         isAvailable.value
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  currentStep.value = 'availability'
  isAvailable.value = false
  creating.value = false
  createdBooking.value = null
  completedPayment.value = null
  paymentPercentage.value = 50 // Reset về 50%
  Object.assign(guestInfo, {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  specialRequests.value = ''
  
  // Tự động điền lại thông tin user nếu đã đăng nhập
  fillUserInfo()
}

const handleAvailabilityChange = (available: boolean) => {
  isAvailable.value = available
}

const handleBookingRequest = (data: BookingData) => {
  Object.assign(bookingData, data)
  if (isAvailable.value) {
    currentStep.value = 'booking'
  }
}

const handleCreateBooking = async () => {
  if (!canCreateBooking.value) return

  creating.value = true
  try {
    const booking = await bookingStore.createBooking({
      stayId: bookingData.stayId || props.stay.id,
      stayTitle: props.stay.title,
      guestInfo,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights: totalNights.value,
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      specialRequests: specialRequests.value
    }, paymentPercentage.value)

    createdBooking.value = booking
    emit('booking-created', booking)
    currentStep.value = 'payment'
  } catch (error) {
    console.error('Error creating booking:', error)
    alert('Có lỗi xảy ra khi tạo đặt phòng. Vui lòng thử lại.')
  } finally {
    creating.value = false
  }
}

const handlePaymentSuccess = (payment: Payment) => {
  completedPayment.value = payment
  currentStep.value = 'confirmation'
}

const handlePaymentCancel = () => {
  currentStep.value = 'booking'
}

const handlePaymentError = (error: string) => {
  alert(`Lỗi thanh toán: ${error}`)
}

const viewBooking = () => {
  if (createdBooking.value) {
    router.push(`/booking-detail/${createdBooking.value.id}`)
    closeModal()
  }
}

// Watch for prop changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    Object.assign(bookingData, {
      stayId: props.stay.id,
      checkIn: props.initialCheckIn || '',
      checkOut: props.initialCheckOut || '',
      guests: props.initialGuests || 1,
      totalPrice: 0
    })
  } else {
    resetForm()
  }
})
</script>
