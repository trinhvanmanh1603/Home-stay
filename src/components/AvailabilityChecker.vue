<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Kiểm tra tình trạng phòng
      </h3>
      <button
        @click="refreshAvailability"
        :disabled="loading"
        class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title="Làm mới"
      >
        <ArrowPathIcon 
          class="h-5 w-5"
          :class="{ 'animate-spin': loading }"
        />
      </button>
    </div>

    <!-- Date Range Selector -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ngày nhận phòng
        </label>
        <input
          v-model="checkIn"
          type="date"
          :min="today"
          class="input-field"
          @change="checkAvailability"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ngày trả phòng
        </label>
        <input
          v-model="checkOut"
          type="date"
          :min="minCheckOut"
          class="input-field"
          @change="checkAvailability"
        />
      </div>
    </div>

    <!-- Guests Counter -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Số khách
      </label>
      <div class="flex items-center space-x-4">
        <button
          @click="guests > 1 && guests--"
          :disabled="guests <= 1"
          class="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MinusIcon class="h-4 w-4" />
        </button>
        <span class="text-lg font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
          {{ guests }}
        </span>
        <button
          @click="guests < maxGuests && guests++"
          :disabled="guests >= maxGuests"
          class="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          (Tối đa {{ maxGuests }} khách)
        </span>
      </div>
    </div>

    <!-- Availability Status -->
    <div v-if="availabilityResult" class="mb-6">
      <div
        class="p-4 rounded-lg border"
        :class="{
          'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': availabilityResult.available,
          'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800': !availabilityResult.available
        }"
      >
        <div class="flex items-center space-x-2 mb-2">
          <CheckCircleIcon
            v-if="availabilityResult.available"
            class="h-5 w-5 text-green-600 dark:text-green-400"
          />
          <XCircleIcon
            v-else
            class="h-5 w-5 text-red-600 dark:text-red-400"
          />
          <h4
            class="font-medium"
            :class="{
              'text-green-800 dark:text-green-200': availabilityResult.available,
              'text-red-800 dark:text-red-200': !availabilityResult.available
            }"
          >
            {{ availabilityResult.available ? 'Có thể đặt phòng' : 'Không có phòng trống' }}
          </h4>
        </div>
        
        <p
          class="text-sm"
          :class="{
            'text-green-700 dark:text-green-300': availabilityResult.available,
            'text-red-700 dark:text-red-300': !availabilityResult.available
          }"
        >
          {{ 
            availabilityResult.available 
              ? `Phòng có sẵn cho ${totalNights} đêm với ${guests} khách` 
              : `Phòng không có sẵn trong thời gian này. Có ${availabilityResult.conflictingDates.length} ngày trung lịch.`
          }}
        </p>

        <!-- Conflict Details -->
        <div v-if="!availabilityResult.available && availabilityResult.conflictingDates.length > 0" class="mt-3">
          <p class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Các ngày không có sẵn:
          </p>
          <div class="space-y-1">
            <div
              v-for="date in availabilityResult.conflictingDates"
              :key="date"
              class="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/30 px-2 py-1 rounded"
            >
              {{ formatDate(date) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggested Dates -->
    <div v-if="suggestedDates.length > 0" class="mb-6">
      <h4 class="font-medium text-gray-900 dark:text-white mb-3">
        Các ngày khả dụng gần nhất
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="suggestion in suggestedDates"
          :key="`${suggestion.checkIn}-${suggestion.checkOut}`"
          class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          @click="applySuggestion(suggestion)"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(suggestion.checkIn) }} - {{ formatDate(suggestion.checkOut) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ getDaysBetween(suggestion.checkIn, suggestion.checkOut) }} đêm
              </p>
            </div>
            <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Chọn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Calculation -->
    <div v-if="availabilityResult?.available && pricePerNight" class="mb-6">
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Chi phí dự kiến</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">
              {{ formatPrice(pricePerNight) }} × {{ totalNights }} đêm
            </span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(totalNights * pricePerNight) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Phí dịch vụ</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(serviceFee) }}</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-600 pt-2">
            <div class="flex justify-between font-semibold">
              <span class="text-gray-900 dark:text-white">Tổng cộng</span>
              <span class="text-gray-900 dark:text-white">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Now Button -->
    <div v-if="availabilityResult?.available" class="flex space-x-4">
      <button
        @click="$emit('book', bookingData)"
        class="flex-1 btn-primary py-3 text-center"
      >
        Đặt ngay
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Đang kiểm tra...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAvailabilityStore } from '@/store/availability'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import type { Stay, AvailabilityCheck } from '@/types'

interface Props {
  stay: Stay
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
}

interface BookingData {
  stayId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
}

interface Emits {
  (e: 'book', data: BookingData): void
  (e: 'availability-change', available: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const availabilityStore = useAvailabilityStore()
const loading = ref(false)
const availabilityResult = ref<AvailabilityCheck | null>(null)
const suggestedDates = ref<Array<{ checkIn: string; checkOut: string }>>([])

// Form data
const checkIn = ref(props.initialCheckIn || '')
const checkOut = ref(props.initialCheckOut || '')
const guests = ref(props.initialGuests || 1)

// Computed values
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minCheckOut = computed(() => {
  if (!checkIn.value) return today.value
  const date = new Date(checkIn.value)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

const maxGuests = computed(() => props.stay.maxGuests)

const totalNights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0
  const start = new Date(checkIn.value)
  const end = new Date(checkOut.value)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const pricePerNight = computed(() => props.stay.price)

const serviceFee = computed(() => {
  return Math.round(totalNights.value * pricePerNight.value * 0.1) // 10% service fee
})

const totalPrice = computed(() => {
  return totalNights.value * pricePerNight.value + serviceFee.value
})

const bookingData = computed<BookingData>(() => ({
  stayId: props.stay.id,
  checkIn: checkIn.value,
  checkOut: checkOut.value,
  guests: guests.value,
  totalPrice: totalPrice.value
}))

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

const getDaysBetween = (start: string, end: string): number => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

const checkAvailability = async () => {
  if (!checkIn.value || !checkOut.value || checkIn.value >= checkOut.value) {
    availabilityResult.value = null
    suggestedDates.value = []
    return
  }

  loading.value = true
  try {
    const result = await availabilityStore.checkAvailability(
      props.stay.id,
      checkIn.value,
      checkOut.value
    )
    
    availabilityResult.value = result
    emit('availability-change', result.available)

    // Get suggested dates if not available
    if (!result.available && result.suggestedDates) {
      suggestedDates.value = result.suggestedDates
    } else {
      suggestedDates.value = []
    }
  } catch (error) {
    console.error('Error checking availability:', error)
    availabilityResult.value = {
      stayId: props.stay.id,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      available: false,
      conflictingDates: []
    }
  } finally {
    loading.value = false
  }
}

const refreshAvailability = () => {
  checkAvailability()
}

const applySuggestion = (suggestion: { checkIn: string; checkOut: string }) => {
  checkIn.value = suggestion.checkIn
  checkOut.value = suggestion.checkOut
  checkAvailability()
}

// Watch for changes
watch([checkIn, checkOut, guests], () => {
  checkAvailability()
})

// Initialize
onMounted(() => {
  if (checkIn.value && checkOut.value) {
    checkAvailability()
  }
})
</script>
