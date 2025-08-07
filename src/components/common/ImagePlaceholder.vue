<template>
  <div :class="containerClass">
    <!-- Image with Error Handling -->
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- Placeholder -->
    <div v-else :class="placeholderClass">
      <!-- Custom Icon -->
      <component 
        v-if="icon" 
        :is="iconComponent" 
        :class="iconClass" 
      />
      
      <!-- Default Icon -->
      <PhotoIcon v-else :class="iconClass" />
      
      <!-- Placeholder Text -->
      <span v-if="showText" :class="textClass">
        {{ placeholderText }}
      </span>
    </div>
    
    <!-- Loading Overlay -->
    <div v-if="loading" :class="loadingOverlayClass">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
    
    <!-- Badge/Overlay Content -->
    <div v-if="$slots.overlay" class="absolute inset-0 flex items-center justify-center">
      <slot name="overlay" />
    </div>
    
    <!-- Top Right Badge -->
    <div v-if="$slots.badge" class="absolute top-2 right-2">
      <slot name="badge" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  PhotoIcon,
  HomeIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

interface ImagePlaceholderProps {
  src?: string
  alt?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  aspect?: 'square' | 'landscape' | 'portrait' | 'wide'
  variant?: 'default' | 'rounded' | 'circle'
  placeholderText?: string
  showText?: boolean
  backgroundColor?: string
}

const props = withDefaults(defineProps<ImagePlaceholderProps>(), {
  alt: 'Image',
  size: 'md',
  aspect: 'landscape',
  variant: 'default',
  placeholderText: 'No Image',
  showText: true,
  backgroundColor: 'bg-gray-200 dark:bg-gray-700'
})

const imageError = ref(false)
const loading = ref(false)

const iconMap = {
  photo: PhotoIcon,
  home: HomeIcon,
  user: UserIcon,
  building: BuildingOfficeIcon
}

const iconComponent = computed(() => {
  return props.icon ? iconMap[props.icon as keyof typeof iconMap] : PhotoIcon
})

const containerClass = computed(() => {
  const base = 'relative overflow-hidden'
  
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }
  
  const aspects = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/9]'
  }
  
  const variants = {
    default: 'rounded-lg',
    rounded: 'rounded-xl',
    circle: 'rounded-full'
  }
  
  // Use aspect ratio for responsive sizing, fall back to fixed sizes for circle
  const sizeClass = props.variant === 'circle' ? sizes[props.size] : aspects[props.aspect]
  
  return `${base} ${sizeClass} ${variants[props.variant]}`
})

const imageClass = computed(() => {
  return 'w-full h-full object-cover'
})

const placeholderClass = computed(() => {
  return `w-full h-full ${props.backgroundColor} flex flex-col items-center justify-center text-gray-400 dark:text-gray-500`
})

const iconClass = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  return sizes[props.size]
})

const textClass = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }
  
  return `${sizes[props.size]} font-medium mt-1 text-center`
})

const loadingOverlayClass = computed(() => {
  return 'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'
})

const handleImageError = () => {
  imageError.value = true
  loading.value = false
}

const handleImageLoad = () => {
  loading.value = false
}

// Watch for src changes to reset error state
watch(() => props.src, () => {
  if (props.src) {
    imageError.value = false
    loading.value = true
  }
})
</script>
