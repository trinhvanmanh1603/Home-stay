<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="space-y-4">
      <div :class="[imageClass, 'bg-gray-300 dark:bg-gray-700 rounded-lg']"></div>
      <div class="space-y-2">
        <div :class="[titleClass, 'bg-gray-300 dark:bg-gray-700 rounded h-4']"></div>
        <div :class="[subtitleClass, 'bg-gray-300 dark:bg-gray-700 rounded h-3']"></div>
        <div v-if="showPrice" class="bg-gray-300 dark:bg-gray-700 rounded h-4 w-20"></div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list'" class="flex space-x-4">
      <div :class="[avatarClass, 'bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0']"></div>
      <div class="flex-1 space-y-2">
        <div :class="[titleClass, 'bg-gray-300 dark:bg-gray-700 rounded h-4']"></div>
        <div :class="[subtitleClass, 'bg-gray-300 dark:bg-gray-700 rounded h-3']"></div>
      </div>
    </div>

    <!-- Table Row Skeleton -->
    <div v-else-if="type === 'table'" class="flex space-x-4 items-center">
      <div v-for="(width, index) in columnWidths" :key="index" 
           :class="['bg-gray-300 dark:bg-gray-700 rounded h-4', width]"></div>
    </div>

    <!-- Stats Card Skeleton -->
    <div v-else-if="type === 'stats'" class="flex items-center space-x-4">
      <div :class="[iconClass, 'bg-gray-300 dark:bg-gray-700 rounded-lg']"></div>
      <div class="flex-1 space-y-2">
        <div :class="[titleClass, 'bg-gray-300 dark:bg-gray-700 rounded h-4']"></div>
        <div :class="[valueClass, 'bg-gray-300 dark:bg-gray-700 rounded h-6']"></div>
      </div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else-if="type === 'custom'" class="space-y-3">
      <div v-for="(item, index) in customPattern" :key="index"
           :class="['bg-gray-300 dark:bg-gray-700 rounded', item.class, `h-${item.height}`]"></div>
    </div>

    <!-- Default: Simple lines -->
    <div v-else class="space-y-3">
      <div class="bg-gray-300 dark:bg-gray-700 rounded h-4 w-full"></div>
      <div class="bg-gray-300 dark:bg-gray-700 rounded h-4 w-3/4"></div>
      <div class="bg-gray-300 dark:bg-gray-700 rounded h-4 w-1/2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'table' | 'stats' | 'custom' | 'lines'
  count?: number
  showPrice?: boolean
  containerClass?: string
  imageClass?: string
  titleClass?: string
  subtitleClass?: string
  avatarClass?: string
  iconClass?: string
  valueClass?: string
  columnWidths?: string[]
  customPattern?: Array<{ height: number; class: string }>
}

withDefaults(defineProps<SkeletonLoaderProps>(), {
  type: 'lines',
  count: 1,
  showPrice: false,
  containerClass: '',
  imageClass: 'h-48',
  titleClass: 'w-3/4',
  subtitleClass: 'w-1/2',
  avatarClass: 'w-12 h-12',
  iconClass: 'w-12 h-12',
  valueClass: 'w-16',
  columnWidths: () => ['w-1/4', 'w-1/2', 'w-1/4'],
  customPattern: () => []
})
</script>
