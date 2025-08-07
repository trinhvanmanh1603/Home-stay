<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="badgeClasses">
    <span v-if="showDot" 
          class="w-1.5 h-1.5 rounded-full mr-1.5"
          :class="dotClasses">
    </span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  label?: string
  variant?: 'default' | 'dot'
  customColors?: Record<string, { bg: string; text: string; dot?: string }>
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  label: ''
})

const showDot = computed(() => props.variant === 'dot')

const defaultColors = {
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-300',
    dot: 'bg-yellow-400'
  },
  confirmed: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-400'
  },
  completed: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-300',
    dot: 'bg-blue-400'
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-400'
  },
  approved: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-400'
  },
  rejected: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-400'
  },
  active: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-300',
    dot: 'bg-blue-400'
  },
  inactive: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-gray-300',
    dot: 'bg-gray-400'
  }
}

const colors = computed(() => props.customColors || defaultColors)

const badgeClasses = computed(() => {
  const colorConfig = (colors.value as any)[props.status] || (colors.value as any).inactive
  return `${colorConfig.bg} ${colorConfig.text}`
})

const dotClasses = computed(() => {
  const colorConfig = (colors.value as any)[props.status] || (colors.value as any).inactive
  return colorConfig.dot || 'bg-gray-400'
})
</script>
