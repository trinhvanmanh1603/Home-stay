<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="cancel"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="iconComponent" 
                         :class="iconColorClass" 
                         class="w-8 h-8" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
            </div>
          </div>
        </div>
        
        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-300">
            {{ message }}
          </p>
          <div v-if="details" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ details }}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end space-x-3">
          <ActionButton
            @click="cancel"
            variant="ghost"
            size="md"
          >
            {{ cancelText }}
          </ActionButton>
          <ActionButton
            @click="confirm"
            :variant="type === 'danger' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'"
            size="md"
          >
            {{ confirmText }}
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'
import ActionButton from '@/components/common/ActionButton.vue'
import type { ConfirmationModalProps } from '@/types'

const props = withDefaults(defineProps<ConfirmationModalProps>(), {
  type: 'info',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'danger':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'danger':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>
