<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div v-if="showLogo" class="flex justify-center">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <span class="ml-3 text-2xl font-bold text-gray-900 dark:text-white">HomeStay</span>
        </div>
      </div>
      
      <h2 v-if="title" class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ title }}
      </h2>
      
      <p v-if="subtitle" class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {{ subtitle }}
        <slot name="subtitle-action" />
      </p>
    </div>

    <!-- Form Container -->
    <div class="mt-8 sm:mx-auto sm:w-full"
         :class="containerWidth">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  showLogo?: boolean
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  width: 'md'
})

const containerWidth = computed(() => {
  const widths = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  }
  return widths[props.width]
})
</script>
