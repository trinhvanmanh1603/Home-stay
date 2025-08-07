<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Đăng nhập tài khoản
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Hoặc 
        <RouterLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          đăng ký tài khoản mới
        </RouterLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
                Đang đăng nhập...
              </span>
              <span v-else>Đăng nhập</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import FormInput from '@/components/forms/FormInput.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const errorMessage = ref('')
const loading = computed(() => authStore.loading)

const canSubmit = computed(() => {
  return form.value.email && form.value.password
})

const handleSubmit = async () => {
  if (!canSubmit.value) return

  errorMessage.value = ''

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })

    // Redirect to the intended page or home
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (error: any) {
    errorMessage.value = error.message || 'Email hoặc mật khẩu không đúng'
  }
}
</script>
