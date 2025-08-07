<template>
  <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="$emit('submit')" class="space-y-6">
      <!-- Name Fields -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          v-model="form.firstName"
          type="text"
          label="Họ"
          placeholder="Nguyễn"
          required
        />

        <FormInput
          id="lastName"
          v-model="form.lastName"
          type="text"
          label="Tên"
          placeholder="Văn A"
          required
        />
      </div>

      <!-- Contact Info -->
      <FormInput
        id="email"
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="example@email.com"
        required
      />

      <FormInput
        id="phone"
        v-model="form.phone"
        type="tel"
        label="Số điện thoại"
        placeholder="0123456789"
        required
      />

      <!-- Password Fields -->
      <FormInput
        id="password"
        v-model="form.password"
        type="password"
        label="Mật khẩu"
        placeholder="••••••••"
        required
      />

      <FormInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        label="Xác nhận mật khẩu"
        placeholder="••••••••"
        required
      />

      <!-- Password Validation Hints -->
      <div class="text-sm space-y-1">
        <div :class="isValidPassword ? 'text-green-600' : 'text-gray-500'">
          ✓ Mật khẩu có ít nhất 6 ký tự
        </div>
        <div :class="passwordsMatch ? 'text-green-600' : 'text-gray-500'">
          ✓ Mật khẩu xác nhận khớp
        </div>
      </div>

      <!-- Terms Agreement -->
      <div class="flex items-center">
        <input
          id="agreeToTerms"
          v-model="form.agreeToTerms"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          required
        />
        <label for="agreeToTerms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Tôi đồng ý với 
          <a href="#" class="text-primary-600 hover:text-primary-500">điều khoản sử dụng</a>
          và 
          <a href="#" class="text-primary-600 hover:text-primary-500">chính sách bảo mật</a>
        </label>
      </div>

      <ActionButton
        :label="loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'"
        variant="primary"
        type="submit"
        :disabled="!canSubmit"
        class="w-full"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import FormInput from '@/components/forms/FormInput.vue'
import ActionButton from '@/components/common/ActionButton.vue'

interface Props {
  form: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phone: string
    agreeToTerms: boolean
  }
  loading: boolean
  errorMessage: string
  successMessage: string
  canSubmit: boolean
  passwordsMatch: boolean
  isValidPassword: boolean
}

interface Emits {
  (e: 'submit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
