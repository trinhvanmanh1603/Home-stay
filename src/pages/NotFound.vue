<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Trang không tồn tại
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
      </p>
      
      <div class="space-y-4">
        <button
          @click="$router.back()"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Quay lại
        </button>
        <router-link
          to="/"
          class="block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Về trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.error('404 - Page not found:', window.location.href)
})
</script>
