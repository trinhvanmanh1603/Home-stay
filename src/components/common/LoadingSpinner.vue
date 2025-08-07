<template>
  <div class="text-center py-12">
    <div class="animate-spin rounded-full border-b-2 mx-auto"
         :class="[
           sizeClasses[size],
           colorClasses[color]
         ]"></div>
    <p v-if="message" class="mt-4 text-gray-600 dark:text-gray-400">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'blue' | 'green' | 'red' | 'gray'
  message?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  message: 'Đang tải...'
})

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const colorClasses = {
  primary: 'border-primary-600',
  blue: 'border-blue-600',
  green: 'border-green-600', 
  red: 'border-red-600',
  gray: 'border-gray-600'
}
</script>
