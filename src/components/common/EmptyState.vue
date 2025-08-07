<template>
  <div class="text-center py-12">
    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
      <component :is="icon" class="h-8 w-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p v-if="description" class="text-gray-600 dark:text-gray-400 mb-6">
      {{ description }}
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  description?: string
  icon?: any
}

withDefaults(defineProps<Props>(), {
  icon: ExclamationTriangleIcon
})
</script>
