<template>
  <div :class="containerClass">
    <!-- Header -->
    <div v-if="title" class="flex items-center justify-between mb-4">
      <h4 :class="titleClass">{{ title }}</h4>
      <StatusBadge v-if="status" :status="status" :type="statusType" />
    </div>

    <!-- Stay Information -->
    <div v-if="stay" class="mb-4">
      <div class="flex items-center space-x-3">
        <ImagePlaceholder
          :src="stay.image || stay.images?.[0]"
          :alt="stay.title || stay.name"
          size="md"
          variant="rounded"
          icon="home"
        />
        <div class="flex-1">
          <h5 class="font-medium text-gray-900 dark:text-white">
            {{ stay.title || stay.name }}
          </h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ stay.location }}
          </p>
        </div>
      </div>
    </div>

    <!-- Booking Details -->
    <div class="space-y-2">
      <!-- Check-in/Check-out -->
      <div v-if="checkIn && checkOut" class="grid grid-cols-2 gap-4">
        <InfoCard
          icon="calendar"
          title="Nhận phòng"
          :description="formatDate(checkIn)"
          size="sm"
          variant="feature"
        />
        <InfoCard
          icon="calendar"
          title="Trả phòng"
          :description="formatDate(checkOut)"
          size="sm"
          variant="feature"
        />
      </div>

      <!-- Guests and Nights -->
      <div class="grid grid-cols-1 gap-4">
        <InfoCard
          v-if="guests"
          icon="user"
          title="Số khách"
          :description="`${guests} người`"
          size="sm"
          variant="feature"
        />
        <InfoCard
          v-if="nights"
          icon="clock"
          title="Số đêm"
          :description="`${nights} đêm`"
          size="sm"
          variant="feature"
        />
      </div>

      <!-- Price Breakdown -->
      <div v-if="showPriceBreakdown" class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Giá phòng ({{ nights }} đêm):</span>
          <PriceDisplay :amount="basePrice || 0" size="sm" variant="muted" />
        </div>
        
        <div v-if="serviceFee" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Phí dịch vụ:</span>
          <PriceDisplay :amount="serviceFee || 0" size="sm" variant="muted" />
        </div>
        
        <div v-if="cleaningFee" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Phí vệ sinh:</span>
          <PriceDisplay :amount="cleaningFee || 0" size="sm" variant="muted" />
        </div>
        
        <div v-if="discount" class="flex justify-between text-sm">
          <span class="text-green-600 dark:text-green-400">Giảm giá:</span>
          <PriceDisplay :amount="-(discount || 0)" size="sm" variant="success" />
        </div>
      </div>

      <!-- Total Price -->
      <div v-if="totalPrice" class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-gray-900 dark:text-white">Tổng tiền:</span>
          <PriceDisplay :amount="totalPrice || 0" size="lg" variant="primary" />
        </div>
      </div>

      <!-- Payment Information -->
      <div v-if="showPaymentInfo && (paidAmount || remainingAmount)" class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
        <div v-if="paidAmount" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Đã thanh toán:</span>
          <PriceDisplay :amount="paidAmount || 0" size="sm" variant="success" />
        </div>
        
        <div v-if="remainingAmount" class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Còn lại:</span>
          <PriceDisplay :amount="remainingAmount || 0" size="sm" variant="danger" />
        </div>
      </div>

      <!-- Special Requests -->
      <div v-if="specialRequests" class="border-t border-gray-200 dark:border-gray-700 pt-3">
        <InfoCard
          icon="info"
          title="Yêu cầu đặc biệt"
          :description="specialRequests"
          size="sm"
          variant="feature"
        />
      </div>

      <!-- Booking ID -->
      <div v-if="bookingId" class="text-center">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          Mã đặt phòng: <span class="font-mono font-medium">#{{ bookingId }}</span>
        </span>
      </div>
    </div>

    <!-- Actions Slot -->
    <div v-if="$slots.actions" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InfoCard from './InfoCard.vue'
import PriceDisplay from './PriceDisplay.vue'
import StatusBadge from './StatusBadge.vue'
import ImagePlaceholder from './ImagePlaceholder.vue'

interface BookingSummaryProps {
  title?: string
  bookingId?: string | number
  stay?: {
    title?: string
    name?: string
    location?: string
    image?: string
    images?: string[]
  }
  checkIn?: string
  checkOut?: string
  guests?: number
  nights?: number
  basePrice?: number
  serviceFee?: number
  cleaningFee?: number
  discount?: number
  totalPrice?: number
  paidAmount?: number
  remainingAmount?: number
  specialRequests?: string
  status?: string
  statusType?: 'booking' | 'payment'
  showPriceBreakdown?: boolean
  showPaymentInfo?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<BookingSummaryProps>(), {
  showPriceBreakdown: false,
  showPaymentInfo: false,
  variant: 'default',
  size: 'md',
  statusType: 'booking'
})

const containerClass = computed(() => {
  const base = 'bg-gray-50 dark:bg-gray-700 rounded-lg'
  
  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return `${base} ${sizes[props.size]}`
})

const titleClass = computed(() => {
  const sizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold'
  }
  
  return `${sizes[props.size]} text-gray-900 dark:text-white`
})

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
