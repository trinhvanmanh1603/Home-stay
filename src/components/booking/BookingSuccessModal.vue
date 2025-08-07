<template>
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
            @click="$emit('goToHome')"
            class="w-full btn-primary"
          >
            Về trang chủ
          </button>
          <button
            @click="$emit('close')"
            class="w-full btn-secondary"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  showSuccessModal: boolean
}>()

defineEmits<{
  goToHome: []
  close: []
}>()
</script>
