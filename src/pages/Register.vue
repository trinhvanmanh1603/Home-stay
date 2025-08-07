<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Đăng ký tài khoản
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Hoặc 
        <RouterLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          đăng nhập nếu đã có tài khoản
        </RouterLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <RegisterForm
        :form="form"
        :loading="loading"
        :error-message="errorMessage"
        :success-message="successMessage"
        :can-submit="canSubmit"
        :passwords-match="passwordsMatch"
        :is-valid-password="isValidPassword"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRegister } from '@/composables/useRegister'
import RegisterForm from '@/components/auth/RegisterForm.vue'

// Composable
const {
  // State
  loading,
  errorMessage,
  successMessage,
  form,
  
  // Computed
  canSubmit,
  passwordsMatch,
  isValidPassword,
  
  // Methods
  handleSubmit,
  initializeRegister
} = useRegister()

onMounted(() => {
  initializeRegister()
})
</script>
