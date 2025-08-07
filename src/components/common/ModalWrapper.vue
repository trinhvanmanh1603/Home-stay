<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black transition-opacity"
          :class="backdropOpacity"
          @click="handleBackdropClick"
        ></div>
        
        <!-- Modal Container -->
        <div :class="containerClass">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="isOpen" :class="modalClass">
              <!-- Close Button -->
              <button 
                v-if="showCloseButton"
                @click="closeModal"
                class="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>

              <!-- Modal Content -->
              <slot />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface ModalWrapperProps {
  isOpen: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  position?: 'center' | 'top'
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  backdropOpacity?: string
}

interface ModalWrapperEmits {
  close: []
}

const props = withDefaults(defineProps<ModalWrapperProps>(), {
  size: 'md',
  position: 'center',
  closeOnBackdrop: true,
  showCloseButton: true,
  backdropOpacity: 'bg-opacity-50'
})

const emit = defineEmits<ModalWrapperEmits>()

const containerClass = computed(() => {
  const base = 'flex min-h-full p-4 text-center'
  
  return props.position === 'center' 
    ? `${base} items-center justify-center`
    : `${base} items-start justify-center pt-16`
})

const modalClass = computed(() => {
  const base = 'relative w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all'
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-7xl'
  }
  
  return `${base} ${sizeClasses[props.size]}`
})

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}
</script>
