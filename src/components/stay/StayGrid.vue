<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <StayCard
      v-for="stay in stays"
      :key="stay.id"
      :stay="stay"
      @click="$emit('stay-click', stay)"
    />
  </div>
</template>

<script setup lang="ts">
import StayCard from '@/components/StayCard.vue'
import type { Stay } from '@/types'

interface Props {
  stays: Stay[]
}

interface Emits {
  (e: 'stay-click', stay: Stay): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
