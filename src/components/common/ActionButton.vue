<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :type="!to ? type : undefined"
    :disabled="!to && (disabled || loading)"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses[size],
      variantClasses[variant],
      (disabled || loading) && !to ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5',
      fullWidth ? 'w-full' : ''
    ]"
    @click="!to && $emit('click')"
  >
    <!-- Loading Spinner -->
    <svg v-if="loading" 
         class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
         xmlns="http://www.w3.org/2000/svg" 
         fill="none" 
         viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icon -->
    <component v-else-if="iconComponent" :is="iconComponent" :class="iconSizeClasses[size]" />
    <span v-else-if="icon && typeof icon === 'string'" :class="iconSizeClasses[size]">
      {{ getIconEmoji(icon) }}
    </span>

    <!-- Label -->
    <span v-if="!iconOnly">{{ label }}</span>
    
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  UserIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  EyeIcon,
  CheckIcon,
  CheckCircleIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'

interface Props {
  to?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconOnly?: boolean
  icon?: string | any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconOnly: false
})

defineEmits<{
  click: []
}>()

const iconComponent = computed(() => {
  if (typeof props.icon !== 'string') return props.icon
  
  const iconMap: Record<string, any> = {
    user: UserIcon,
    shield: ShieldCheckIcon,
    sun: SunIcon,
    moon: MoonIcon,
    logout: ArrowRightOnRectangleIcon,
    'bars-3': Bars3Icon,
    'x-mark': XMarkIcon,
    sparkles: SparklesIcon,
    eye: EyeIcon,
    check: CheckIcon,
    'check-circle': CheckCircleIcon,
    trash: TrashIcon,
    chat: ChatBubbleLeftIcon,
    x: XMarkIcon,
    pencil: PencilIcon
  }
  
  return iconMap[props.icon] || null
})

const getIconEmoji = (iconName: string): string => {
  const emojiMap: Record<string, string> = {
    user: '👤',
    shield: '🛡️',
    sun: '☀️',
    moon: '🌙',
    logout: '🚪',
    'bars-3': '☰',
    'x-mark': '✕',
    sparkles: '✨',
    eye: '👁️',
    check: '✓',
    'check-circle': '✅',
    trash: '🗑️',
    chat: '💬',
    x: '✕',
    pencil: '✏️'
  }
  
  return emojiMap[iconName] || iconName
}

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs rounded',
  sm: 'px-3 py-2 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl'
}

const iconSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7'
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md focus:ring-primary-500',
  secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white shadow-md focus:ring-gray-500',
  success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md focus:ring-green-500',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md focus:ring-red-500',
  warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white shadow-md focus:ring-yellow-500',
  ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500'
}
</script>
