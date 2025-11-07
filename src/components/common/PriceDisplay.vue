<template>
  <span :class="priceClass">
    {{ formattedPrice }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PriceDisplayProps {
  amount: number | string
  currency?: string
  locale?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'muted'
  showCurrency?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<PriceDisplayProps>(), {
  currency: 'VND',
  locale: 'vi-VN',
  size: 'md',
  variant: 'default',
  showCurrency: true,
  compact: false
})

const priceClass = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const variants = {
    default: 'text-gray-900 dark:text-white font-semibold',
    primary: 'text-primary-600 dark:text-primary-400 font-bold',
    success: 'text-green-600 dark:text-green-400 font-semibold',
    danger: 'text-red-600 dark:text-red-400 font-semibold',
    muted: 'text-gray-600 dark:text-gray-400 font-medium'
  }
  
  return `${sizes[props.size]} ${variants[props.variant]}`
})

const formattedPrice = computed(() => {
  const amount = Number(props.amount)
  
  if (props.compact && amount >= 1000000) {
    const millions = amount / 1000000
    return `${millions.toFixed(1).replace('.0', '')}tr ${props.showCurrency ? 'VND' : ''}`
  }
  
  if (props.compact && amount >= 1000) {
    const thousands = amount / 1000
    return `${thousands.toFixed(1).replace('.0', '')}k ${props.showCurrency ? 'VND' : ''}`
  }
  
  try {
    return new Intl.NumberFormat(props.locale, {
      style: props.showCurrency ? 'currency' : 'decimal',
      currency: props.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    return `${amount.toLocaleString()} ${props.showCurrency ? props.currency : ''}`
  }
})
</script>
