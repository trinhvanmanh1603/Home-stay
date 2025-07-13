<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/store/theme'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
