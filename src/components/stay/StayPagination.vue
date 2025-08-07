<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="text-gray-600 dark:text-gray-400">
      Hiển thị {{ startItem }}-{{ endItem }} trong tổng số {{ totalItems }} kết quả
    </div>
    
    <div v-if="totalPages > 1" class="flex justify-center">
      <nav class="flex space-x-2">
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="typeof page === 'number' && $emit('page-change', page)"
          :disabled="typeof page !== 'number'"
          :class="[
            'px-3 py-2 text-sm rounded-md border',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
            typeof page !== 'number' && 'cursor-default'
          ]"
        >
          {{ page }}
        </button>
        
        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface Emits {
  (e: 'page-change', page: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const startItem = computed(() => 
  (props.currentPage - 1) * props.itemsPerPage + 1
)

const endItem = computed(() => 
  Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
)

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, props.currentPage - delta); 
       i <= Math.min(props.totalPages - 1, props.currentPage + delta); 
       i++) {
    range.push(i)
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push('...', props.totalPages)
  } else if (props.totalPages > 1) {
    rangeWithDots.push(props.totalPages)
  }

  return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index)
})
</script>
