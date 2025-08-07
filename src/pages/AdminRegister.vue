<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        🛡️ Đăng ký tài khoản Admin
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Tài khoản cần được phê duyệt bởi Admin tổng
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <AdminRegisterForm
        :form="form"
        :loading="loading"
        :error-message="errorMessage"
        :success-message="successMessage"
        :can-submit="canSubmit"
        @submit="handleSubmit"
        @update:first-name="form.firstName = $event"
        @update:last-name="form.lastName = $event"
        @update:email="form.email = $event"
        @update:phone="form.phone = $event"
        @update:brand="form.brand = $event"
        @update:reason="form.reason = $event"
        @update:accept-terms="form.acceptTerms = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminRegister } from '@/composables/useAdminRegister'
import AdminRegisterForm from '@/components/auth/AdminRegisterForm.vue'

// Composable
const {
  // State
  loading,
  errorMessage,
  successMessage,
  form,
  
  // Computed
  canSubmit,
  
  // Methods
  handleSubmit,
  initializeAdminRegister
} = useAdminRegister()

onMounted(() => {
  initializeAdminRegister()
})
</script>
