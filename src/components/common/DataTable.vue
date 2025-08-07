<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
    <!-- Header -->
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <slot name="header" />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="column in columns" 
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                :class="column.headerClass">
              {{ column.title }}
            </th>
            <th v-if="$slots.actions" 
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(item, index) in items" 
              :key="getItemKey(item, index)"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td v-for="column in columns" 
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                :class="column.cellClass">
              <slot :name="`cell-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                {{ getNestedValue(item, column.key) }}
              </slot>
            </td>
            <td v-if="$slots.actions" 
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item" :index="index" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="text-center py-12">
      <slot name="empty">
        <EmptyState 
          :title="emptyTitle || 'Không có dữ liệu'"
          :description="emptyDescription || 'Không tìm thấy dữ liệu nào.'"
        />
      </slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/common/EmptyState.vue'

interface Column {
  key: string
  title: string
  headerClass?: string
  cellClass?: string
}

interface Props {
  title?: string
  columns: Column[]
  items: any[]
  itemKey?: string
  emptyTitle?: string
  emptyDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id'
})

const getItemKey = (item: any, index: number) => {
  return item[props.itemKey] || index
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
</script>
