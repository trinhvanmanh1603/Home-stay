<template>
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(f, idx) in featuresRef"
          :key="f.id || idx"
          class="text-center"
        >
          <div :class="['w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', f.bg || 'bg-primary-100 dark:bg-primary-900']">
            <component :is="f.icon" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ f.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ f.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  HomeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { siteService } from '@/services'

const props = withDefaults(defineProps<{ features?: Array<any> }>(), { features: undefined })

const defaultFeatures = [
  {
    id: 'f_home',
    title: 'Trải nghiệm như ở nhà',
    description: 'Cảm nhận không gian ấm cúng và thân thiện như chính ngôi nhà của bạn',
    icon: HomeIcon,
    bg: 'bg-primary-100 dark:bg-primary-900'
  },
  {
    id: 'f_price',
    title: 'Giá cả hợp lý',
    description: 'Tận hưởng kỳ nghỉ tuyệt vời với mức giá phù hợp với túi tiền',
    icon: CurrencyDollarIcon,
    bg: 'bg-primary-100 dark:bg-primary-900'
  },
  {
    id: 'f_safe',
    title: 'An toàn & tin cậy',
    description: 'Hệ thống đánh giá minh bạch và chính sách bảo vệ khách hàng toàn diện',
    icon: ShieldCheckIcon,
    bg: 'bg-primary-100 dark:bg-primary-900'
  }
]

const featuresRef = ref<Array<any>>(props.features && Array.isArray(props.features) ? props.features : defaultFeatures)

onMounted(async () => {
  // try to fetch features from mock API, fallback to defaults
  try {
    const list = await siteService.getFeatures()
    // map icon string to real components where possible
    const iconMap: Record<string, any> = {
      HomeIcon,
      CurrencyDollarIcon,
      ShieldCheckIcon
    }
    if (Array.isArray(list) && list.length > 0) {
      featuresRef.value = list.map((f: any) => ({
        ...f,
        icon: iconMap[f.icon] || HomeIcon
      }))
    }
  } catch (e) {
    // use defaults
  }
})
</script>
