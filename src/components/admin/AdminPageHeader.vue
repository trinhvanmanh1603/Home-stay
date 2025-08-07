<template>
  <div class="bg-white dark:bg-gray-800 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ title }}
            <span v-if="authStore.user?.brand && !authStore.isSuperAdmin && showBrand" 
                  class="text-lg text-blue-600 dark:text-blue-400 block">
              {{ authStore.user.brand }}
            </span>
          </h1>
          <p v-if="description" class="text-gray-600 dark:text-gray-400">
            {{ description }}
          </p>
          <p v-else-if="showBrand" class="text-gray-600 dark:text-gray-400">
            <span v-if="authStore.user?.brand && !authStore.isSuperAdmin">
              {{ brandDescription }}
            </span>
            <span v-else-if="authStore.isSuperAdmin">
              {{ superAdminDescription }}
            </span>
            <span v-else>
              {{ adminDescription }}
            </span>
          </p>
        </div>
        
        <!-- Action Button Slot -->
        <div v-if="$slots.actions" class="flex space-x-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

interface Props {
  title: string
  description?: string
  showBrand?: boolean
  brandDescription?: string
  superAdminDescription?: string
  adminDescription?: string
}

withDefaults(defineProps<Props>(), {
  showBrand: true,
  brandDescription: '',
  superAdminDescription: '',
  adminDescription: ''
})

const authStore = useAuthStore()
</script>
