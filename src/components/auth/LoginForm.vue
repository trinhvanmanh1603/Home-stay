<template>
  <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="$emit('submit')" class="space-y-6">
      <FormInput
        id="email"
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="example@email.com"
        required
      />

      <FormInput
        id="password"
        v-model="form.password"
        type="password"
        label="Mật khẩu"
        placeholder="••••••••"
        required
      />

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Ghi nhớ đăng nhập
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Quên mật khẩu?
          </a>
        </div>
      </div>

      <ActionButton
        :label="loading ? 'Đang đăng nhập...' : 'Đăng nhập'"
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
    email: string
    password: string
  }
  rememberMe: boolean
  loading: boolean
  errorMessage: string
  canSubmit: boolean
}

interface Emits {
  (e: 'submit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
