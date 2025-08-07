<template>
  <div :class="cardClass">
    <!-- Icon -->
    <div v-if="icon" class="flex-shrink-0">
      <div :class="iconContainerClass">
        <component :is="iconComponent" :class="iconClass" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1" :class="{ 'ml-4': icon }">
      <!-- Title -->
      <h3 v-if="title" :class="titleClass">
        {{ title }}
      </h3>
      
      <!-- Description -->
      <p v-if="description" :class="descriptionClass">
        {{ description }}
      </p>
      
      <!-- Value -->
      <div v-if="value !== undefined" :class="valueClass">
        {{ formattedValue }}
      </div>
      
      <!-- Slot for custom content -->
      <slot />
    </div>

    <!-- Action slot -->
    <div v-if="$slots.action" class="flex-shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

interface InfoCardProps {
  icon?: string
  title?: string
  description?: string
  value?: string | number
  variant?: 'default' | 'stats' | 'feature' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  iconColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  formatValue?: 'currency' | 'number' | 'percent' | 'none'
  horizontal?: boolean
}

const props = withDefaults(defineProps<InfoCardProps>(), {
  variant: 'default',
  size: 'md',
  iconColor: 'blue',
  formatValue: 'none',
  horizontal: true
})

const iconMap = {
  home: HomeIcon,
  user: UserIcon,
  calendar: CalendarIcon,
  currency: CurrencyDollarIcon,
  star: StarIcon,
  location: MapPinIcon,
  check: CheckCircleIcon,
  x: XCircleIcon,
  clock: ClockIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const iconComponent = computed(() => {
  return props.icon ? iconMap[props.icon as keyof typeof iconMap] : null
})

const cardClass = computed(() => {
  const base = 'flex items-start'
  const variants = {
    default: 'bg-white dark:bg-gray-800 rounded-lg p-4',
    stats: 'bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm',
    feature: 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg p-4'
  }
  
  const direction = props.horizontal ? 'flex-row' : 'flex-col'
  
  return `${base} ${variants[props.variant]} ${direction}`
})

const iconContainerClass = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  }
  
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    red: 'bg-red-100 dark:bg-red-900/20',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    gray: 'bg-gray-100 dark:bg-gray-700'
  }
  
  return `${sizes[props.size]} ${colors[props.iconColor]} rounded-lg flex items-center justify-center`
})

const iconClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-300'
  }
  
  return `${sizes[props.size]} ${colors[props.iconColor]}`
})

const titleClass = computed(() => {
  const sizes = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold'
  }
  
  return `${sizes[props.size]} text-gray-900 dark:text-white`
})

const descriptionClass = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  return `${sizes[props.size]} text-gray-600 dark:text-gray-400 ${props.title ? 'mt-1' : ''}`
})

const valueClass = computed(() => {
  const sizes = {
    sm: 'text-lg font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold'
  }
  
  return `${sizes[props.size]} text-gray-900 dark:text-white ${props.title || props.description ? 'mt-2' : ''}`
})

const formattedValue = computed(() => {
  if (props.value === undefined) return ''
  
  switch (props.formatValue) {
    case 'currency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(Number(props.value))
    case 'number':
      return new Intl.NumberFormat('vi-VN').format(Number(props.value))
    case 'percent':
      return `${props.value}%`
    default:
      return String(props.value)
  }
})
</script>
