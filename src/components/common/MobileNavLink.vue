<template>
  <RouterLink 
    :to="to"
    @click="$emit('click')"
    :class="[
      'flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group',
      isAdmin ? 'ml-2' : ''
    ]"
  >
    <span class="text-base group-hover:scale-110 transition-transform">{{ icon }}</span>
    <span class="font-medium"><slot /></span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  to: string
  icon?: string
  isAdmin?: boolean
}

interface Emits {
  (e: 'click'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
