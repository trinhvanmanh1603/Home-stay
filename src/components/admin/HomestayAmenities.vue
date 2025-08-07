<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Tiện nghi
    </label>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="amenity in availableAmenities" :key="amenity.value" class="flex items-center">
        <input
          :id="`amenity-${amenity.value}`"
          :checked="selectedAmenities.includes(amenity.value)"
          :value="amenity.value"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          @change="handleAmenityChange($event, amenity.value)"
        />
        <label
          :for="`amenity-${amenity.value}`"
          class="ml-2 text-sm text-gray-700 dark:text-gray-300"
        >
          {{ amenity.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Amenity {
  value: string
  label: string
}

interface Props {
  availableAmenities: Amenity[]
  selectedAmenities: string[]
}

interface Emits {
  (e: 'update:amenities', amenities: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleAmenityChange = (event: Event, amenityValue: string) => {
  const target = event.target as HTMLInputElement
  const newAmenities = [...props.selectedAmenities]
  
  if (target.checked) {
    if (!newAmenities.includes(amenityValue)) {
      newAmenities.push(amenityValue)
    }
  } else {
    const index = newAmenities.indexOf(amenityValue)
    if (index > -1) {
      newAmenities.splice(index, 1)
    }
  }
  
  emit('update:amenities', newAmenities)
}
</script>
