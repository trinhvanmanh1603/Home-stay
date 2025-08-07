<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="onGoHome"
        class="btn-secondary flex-1"
      >
        Về trang chủ
      </button>
      <button
        v-if="showPayRemaining"
        @click="onPayRemaining"
        class="btn-primary flex-1"
      >
        Thanh toán số tiền còn lại
      </button>
      <button
        v-if="canCancel"
        @click="onCancelBooking"
        class="btn-danger flex-1"
      >
        Hủy đặt phòng
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  canCancel: boolean
}

interface Emits {
  (e: 'go-home'): void
  (e: 'pay-remaining'): void
  (e: 'cancel-booking'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showPayRemaining = computed(() => {
  return props.booking.remainingAmount > 0 && props.booking.paymentStatus !== 'fully_paid'
})

const onGoHome = () => emit('go-home')
const onPayRemaining = () => emit('pay-remaining')
const onCancelBooking = () => emit('cancel-booking')
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
