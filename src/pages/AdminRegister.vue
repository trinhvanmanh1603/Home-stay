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
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Họ
              </label>
              <div class="mt-1">
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Nguyễn"
                />
              </div>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên
              </label>
              <div class="mt-1">
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Văn A"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input-field"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số điện thoại
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="input-field"
                placeholder="0123456789"
              />
            </div>
          </div>

          <div>
            <label for="brand" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Thương hiệu
            </label>
            <div class="mt-1">
              <input
                id="brand"
                v-model="form.brand"
                type="text"
                required
                class="input-field"
                placeholder="Ví dụ: Luxury Homestay Group, Seaside Resorts, ..."
              />
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tên thương hiệu sẽ được sử dụng để phân loại và quản lý homestay
            </p>
          </div>

          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lý do yêu cầu quyền Admin
            </label>
            <div class="mt-1">
              <textarea
                id="reason"
                v-model="form.reason"
                rows="3"
                required
                class="input-field"
                placeholder="Mô tả lý do bạn cần quyền admin và công việc sẽ thực hiện..."
              ></textarea>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'

interface AdminRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  brand: '',
  reason: '',
  acceptTerms: false
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const canSubmit = computed(() => {
  return form.value.firstName && 
         form.value.lastName && 
         form.value.email && 
         form.value.phone && 
         form.value.brand &&
         form.value.reason && 
         form.value.acceptTerms
})

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Check if email already exists
    const existingUser = await axios.get(`http://localhost:3002/users?email=${form.value.email}`)
    if (existingUser.data.length > 0) {
      throw new Error('Email này đã được sử dụng')
    }

    // Check if there's already a pending request for this email
    const existingRequest = await axios.get(`http://localhost:3002/admin-requests?email=${form.value.email}&status=pending`)
    if (existingRequest.data.length > 0) {
      throw new Error('Đã có yêu cầu admin cho email này đang chờ phê duyệt')
    }

    // Create admin request
    const adminRequest: AdminRequest = {
      id: Date.now().toString(),
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      brand: form.value.brand,
      reason: form.value.reason,
      status: 'pending',
      requestedAt: new Date().toISOString()
    }

    await axios.post('http://localhost:3002/admin-requests', adminRequest)

    successMessage.value = 'Yêu cầu đã được gửi thành công! Admin tổng sẽ xem xét và phê duyệt trong thời gian sớm nhất.'
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      brand: '',
      reason: '',
      acceptTerms: false
    }

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (error: any) {
    console.error('Error submitting admin request:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gửi yêu cầu'
  } finally {
    loading.value = false
  }
}
</script>
