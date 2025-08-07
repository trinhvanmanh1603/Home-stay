<template>
  <div>
    <HeroSection />
    <FeaturedStays 
      :loading="loading"
      :featured-stays="featuredStays"
    />
    <FeaturesSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHome } from '@/composables/useHome'
import HeroSection from '@/components/home/HeroSection.vue'
import FeaturedStays from '@/components/home/FeaturedStays.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'

// Composable
const {
  // State
  loading,
  featuredStays,
  
  // Methods
  initializeHome
} = useHome()

onMounted(() => {
  initializeHome()
})
</script>
