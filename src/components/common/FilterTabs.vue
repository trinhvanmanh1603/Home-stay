<template>
  <div class="mb-6">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="$emit('change', tab.key)"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="activeTab === tab.key
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" 
                class="ml-2 py-0.5 px-2 rounded-full text-xs"
                :class="activeTab === tab.key
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  key: string
  label: string
  count?: number
}

interface Props {
  tabs: Tab[]
  activeTab: string
}

defineProps<Props>()
defineEmits<{
  change: [tab: string]
}>()
</script>
