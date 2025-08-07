<template>
  <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
    <form @submit.prevent="$emit('submit')" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          v-model="localForm.firstName"
          type="text"
          label="Họ"
          placeholder="Nguyễn"
          required
        />
        <FormInput
          id="lastName"
          v-model="localForm.lastName"
          type="text"
          label="Tên"
          placeholder="Văn A"
          required
        />
      </div>

      <FormInput
        id="email"
        v-model="localForm.email"
        type="email"
        label="Email"
        placeholder="admin@company.com"
        required
      />

      <FormInput
        id="phone"
        v-model="localForm.phone"
        type="tel"
        label="Số điện thoại"
        placeholder="0123456789"
        required
      />

      <FormInput
        id="brand"
        v-model="localForm.brand"
        type="text"
        label="Thương hiệu"
        placeholder="Ví dụ: Luxury Homestay Group, Seaside Resorts, ..."
        hint="Tên thương hiệu sẽ được sử dụng để phân loại và quản lý homestay"
        required
      />

      <div>
        <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Lý do yêu cầu quyền Admin
        </label>
        <div class="mt-1">
          <textarea
            id="reason"
            v-model="localForm.reason"
            rows="3"
            required
            class="input-field"
            placeholder="Mô tả lý do bạn cần quyền admin và công việc sẽ thực hiện..."
          />
        </div>
      </div>

      <div class="flex items-center">
        <input
          id="terms"
          v-model="localForm.acceptTerms"
          type="checkbox"
          required
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Tôi đồng ý với 
          <a href="#" class="text-primary-600 hover:text-primary-500">điều khoản sử dụng</a>
          và cam kết sử dụng quyền admin một cách có trách nhiệm
        </label>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              {{ errorMessage }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
        <div class="flex">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ successMessage }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang gửi yêu cầu...
          </span>
          <span v-else>Gửi yêu cầu Admin</span>
        </button>
      </div>
    </form>

    <!-- Navigation Links -->
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Hoặc
          </span>
        </div>
      </div>

      <div class="mt-6 text-center">
        <RouterLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Quay lại đăng nhập
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import FormInput from '@/components/forms/FormInput.vue'

// Props
const props = defineProps<{
  form: {
    firstName: string
    lastName: string
    email: string
    phone: string
    brand: string
    reason: string
    acceptTerms: boolean
  }
  loading: boolean
  errorMessage: string
  successMessage: string
  canSubmit: boolean
}>()

// Emits
const emit = defineEmits<{
  submit: []
  'update:firstName': [value: string]
  'update:lastName': [value: string]
  'update:email': [value: string]
  'update:phone': [value: string]
  'update:brand': [value: string]
  'update:reason': [value: string]
  'update:acceptTerms': [value: boolean]
}>()

// Local form with computed getters/setters
const localForm = computed({
  get: () => props.form,
  set: (newValue) => {
    emit('update:firstName', newValue.firstName)
    emit('update:lastName', newValue.lastName)
    emit('update:email', newValue.email)
    emit('update:phone', newValue.phone)
    emit('update:brand', newValue.brand)
    emit('update:reason', newValue.reason)
    emit('update:acceptTerms', newValue.acceptTerms)
  }
})
</script>
