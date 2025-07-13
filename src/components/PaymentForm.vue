<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ getPaymentTitle() }}
      </h2>
      <div class="text-right">
        <p class="text-sm text-gray-600 dark:text-gray-400">Số tiền thanh toán</p>
        <p class="text-2xl font-bold text-primary-600">{{ formatPrice(amount) }}</p>
      </div>
    </div>

    <!-- Booking Summary -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Thông tin đặt phòng</h3>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Mã đặt phòng:</span>
          <span class="text-gray-900 dark:text-white">#{{ booking.id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
          <span class="text-gray-900 dark:text-white">{{ formatPrice(booking.totalPrice) }}</span>
        </div>
        <div v-if="paymentType === 'deposit'" class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">
            Thanh toán ({{ getDepositPercentage() }}%):
          </span>
          <span class="text-gray-900 dark:text-white">{{ formatPrice(booking.depositAmount) }}</span>
        </div>
        <div v-if="paymentType === 'remaining'" class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Còn lại:</span>
          <span class="text-gray-900 dark:text-white">{{ formatPrice(booking.remainingAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Chọn phương thức thanh toán</h3>
      <div class="space-y-3">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer transition-colors"
          :class="{
            'border-primary-500 bg-primary-50 dark:bg-primary-900/20': selectedMethod === method.id,
            'hover:border-gray-300 dark:hover:border-gray-500': selectedMethod !== method.id
          }"
          @click="selectedMethod = method.id as Payment['method']"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <input
                :value="method.id"
                v-model="selectedMethod"
                type="radio"
                class="text-primary-600 focus:ring-primary-500"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ method.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ method.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 dark:text-gray-400">Thời gian xử lý</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ method.processingTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Form for Credit Card -->
    <div v-if="selectedMethod === 'credit_card'" class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
      <h4 class="font-medium text-gray-900 dark:text-white mb-4">Thông tin thẻ tín dụng</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Số thẻ
          </label>
          <input
            v-model="cardForm.number"
            type="text"
            placeholder="1234 5678 9012 3456"
            class="input-field"
            @input="formatCardNumber"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tháng/Năm hết hạn
          </label>
          <input
            v-model="cardForm.expiry"
            type="text"
            placeholder="MM/YY"
            class="input-field"
            @input="formatExpiry"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mã CVV
          </label>
          <input
            v-model="cardForm.cvv"
            type="text"
            placeholder="123"
            maxlength="4"
            class="input-field"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tên chủ thẻ
          </label>
          <input
            v-model="cardForm.name"
            type="text"
            placeholder="NGUYEN VAN A"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Bank Transfer Info -->
    <div v-if="selectedMethod === 'bank_transfer'" class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
      <h4 class="font-medium text-gray-900 dark:text-white mb-4">Thông tin chuyển khoản</h4>
      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Ngân hàng:</span>
          <span class="text-gray-900 dark:text-white font-medium">Vietcombank</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Số tài khoản:</span>
          <span class="text-gray-900 dark:text-white font-medium">1234567890</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Chủ tài khoản:</span>
          <span class="text-gray-900 dark:text-white font-medium">HOMESTAY COMPANY</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Nội dung:</span>
          <span class="text-gray-900 dark:text-white font-medium">{{ booking.id }} {{ booking.guestInfo.lastName }}</span>
        </div>
      </div>
      <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p class="text-yellow-800 dark:text-yellow-200 text-sm">
          <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý tự động.
        </p>
      </div>
    </div>

    <!-- Security Info -->
    <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <ShieldCheckIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
        <h4 class="font-medium text-green-800 dark:text-green-200">Bảo mật thanh toán</h4>
      </div>
      <p class="text-green-700 dark:text-green-300 text-sm mt-2">
        Thông tin thanh toán của bạn được mã hóa và bảo vệ bởi SSL 256-bit.
        Chúng tôi không lưu trữ thông tin thẻ tín dụng.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-4">
      <button
        @click="$emit('cancel')"
        class="flex-1 btn-secondary py-3"
        :disabled="processing"
      >
        Hủy
      </button>
      <button
        @click="processPayment"
        :disabled="!canPay || processing"
        class="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="processing" class="flex items-center justify-center space-x-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </span>
        <span v-else>
          Thanh toán {{ formatPrice(amount) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { usePaymentStore } from '@/store/payment'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'
import type { Booking, Payment } from '@/types'

interface Props {
  booking: Booking
  paymentType: 'deposit' | 'remaining'
  amount: number
}

interface Emits {
  (e: 'success', payment: Payment): void
  (e: 'cancel'): void
  (e: 'error', error: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const paymentStore = usePaymentStore()
const processing = ref(false)
const selectedMethod = ref<Payment['method']>('bank_transfer')

const cardForm = reactive({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

const paymentMethods = paymentStore.getPaymentMethods()

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatCardNumber = () => {
  // Remove all non-digits and add spaces every 4 digits
  cardForm.number = cardForm.number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpiry = () => {
  // Format as MM/YY
  const value = cardForm.expiry.replace(/\D/g, '')
  if (value.length >= 2) {
    cardForm.expiry = value.slice(0, 2) + '/' + value.slice(2, 4)
  } else {
    cardForm.expiry = value
  }
}

const canPay = computed(() => {
  if (selectedMethod.value === 'credit_card') {
    return cardForm.number.length >= 16 && 
           cardForm.expiry.length === 5 && 
           cardForm.cvv.length >= 3 && 
           cardForm.name.length > 0
  }
  return true // Other payment methods don't require additional validation
})

const getDepositPercentage = (): number => {
  if (props.booking.totalPrice === 0) return 0
  return Math.round((props.booking.depositAmount / props.booking.totalPrice) * 100)
}

const getPaymentTitle = (): string => {
  if (props.paymentType === 'deposit') {
    const percentage = getDepositPercentage()
    if (percentage === 100) {
      return 'Thanh toán toàn bộ'
    } else {
      return `Thanh toán đặt cọc (${percentage}%)`
    }
  }
  return 'Thanh toán số tiền còn lại'
}

const processPayment = async () => {
  if (!canPay.value) return

  processing.value = true
  try {
    let payment: Payment

    if (props.paymentType === 'deposit') {
      payment = await paymentStore.processDeposit(
        props.booking.id,
        props.amount,
        selectedMethod.value
      )
    } else {
      payment = await paymentStore.processRemainingPayment(
        props.booking.id,
        props.amount,
        selectedMethod.value
      )
    }

    emit('success', payment)
  } catch (error) {
    console.error('Payment failed:', error)
    emit('error', 'Thanh toán thất bại. Vui lòng thử lại.')
  } finally {
    processing.value = false
  }
}
</script>
