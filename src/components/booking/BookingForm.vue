<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Thông tin đặt phòng
    </h2>

    <form @submit.prevent="$emit('submit')" class="space-y-6">
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
              :value="bookingData.guestInfo.firstName"
              @input="$emit('update:firstName', ($event.target as HTMLInputElement).value)"
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
              :value="bookingData.guestInfo.lastName"
              @input="$emit('update:lastName', ($event.target as HTMLInputElement).value)"
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
              :value="bookingData.guestInfo.email"
              @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
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
              :value="bookingData.guestInfo.phone"
              @input="$emit('update:phone', ($event.target as HTMLInputElement).value)"
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
          :value="bookingData.specialRequests"
          @input="$emit('update:specialRequests', ($event.target as HTMLTextAreaElement).value)"
          rows="3"
          class="input-field"
          placeholder="Nhập yêu cầu đặc biệt nếu có..."
        />
      </div>

      <!-- Terms -->
      <div class="flex items-start space-x-2">
        <input
          :checked="acceptTerms"
          @change="$emit('update:acceptTerms', ($event.target as HTMLInputElement).checked)"
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
        :disabled="submitting || !canSubmit"
        class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="submitting">Đang xử lý...</span>
        <span v-else>Xác nhận đặt phòng</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bookingData: {
    guestInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    specialRequests: string
  }
  checkIn: string
  checkOut: string
  guests: number
  acceptTerms: boolean
  submitting: boolean
  canSubmit: boolean
  formatDate: (date: string) => string
}>()

defineEmits<{
  submit: []
  'update:firstName': [value: string]
  'update:lastName': [value: string]
  'update:email': [value: string]
  'update:phone': [value: string]
  'update:specialRequests': [value: string]
  'update:acceptTerms': [value: boolean]
}>()
</script>
