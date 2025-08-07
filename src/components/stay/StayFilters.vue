<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Bộ lọc tìm kiếm
      </h3>
      <button
        @click="handleReset"
        class="text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        Xóa tất cả
      </button>
    </div>

    <div class="space-y-6">
      <!-- Location/City -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Địa điểm
        </label>
        <input
          v-model="selectedCity"
          type="text"
          placeholder="Tìm theo thành phố..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <!-- Price Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Khoảng giá (VNĐ/đêm)
        </label>
        <div class="space-y-3">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <input
                :value="priceRange[0]"
                @input="updatePriceRange('min', parseInt(($event.target as HTMLInputElement).value) || 0)"
                type="number"
                placeholder="Từ"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <span class="text-gray-500">-</span>
            <div class="flex-1">
              <input
                :value="priceRange[1]"
                @input="updatePriceRange('max', parseInt(($event.target as HTMLInputElement).value) || 0)"
                type="number"
                placeholder="Đến"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div class="text-center text-sm text-gray-500">
            {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
          </div>
        </div>
      </div>

      <!-- Property Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Loại chỗ ở
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="type in propertyTypes"
            :key="type.value"
            @click="togglePropertyType(type.value)"
            :class="[
              'flex flex-col items-center p-3 rounded-lg border transition-all',
              selectedPropertyType === type.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <span class="text-2xl mb-1">{{ type.icon }}</span>
            <span class="text-sm font-medium">{{ type.label }}</span>
          </button>
        </div>
      </div>

      <!-- Guests -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Số khách
        </label>
        <div class="flex items-center space-x-4">
          <button
            @click="decreaseGuests"
            :disabled="guests <= 1"
            class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="text-lg">-</span>
          </button>
          <span class="flex-1 text-center font-medium">{{ guests }} khách</span>
          <button
            @click="increaseGuests"
            :disabled="guests >= 10"
            class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="text-lg">+</span>
          </button>
        </div>
      </div>

      <!-- Amenities -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tiện nghi
        </label>
        <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          <label
            v-for="amenity in AVAILABLE_AMENITIES"
            :key="amenity.key"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <input
              :checked="selectedAmenities.includes(amenity.key)"
              @change="toggleAmenity(amenity.key)"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm">{{ amenity.label }}</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="mobile" class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ActionButton
          variant="secondary"
          class="flex-1"
          @click="handleReset"
        >
          Xóa bộ lọc
        </ActionButton>
        <ActionButton
          variant="primary"
          class="flex-1"
          @click="$emit('apply')"
        >
          Áp dụng
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SearchFilters } from '@/types'
import ActionButton from '@/components/common/ActionButton.vue'
import { AVAILABLE_AMENITIES } from '@/constants/amenities'

interface Props {
  filters: SearchFilters
  mobile?: boolean
}

interface Emits {
  (e: 'update:filters', filters: Partial<SearchFilters>): void
  (e: 'reset'): void
  (e: 'apply'): void
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false
})

const emit = defineEmits<Emits>()

// Property Types
const propertyTypes = [
  { value: 'apartment', label: 'Căn hộ', icon: '🏢' },
  { value: 'house', label: 'Nhà riêng', icon: '🏠' },
  { value: 'villa', label: 'Biệt thự', icon: '🏡' },
  { value: 'room', label: 'Phòng riêng', icon: '🛏️' },
  { value: 'studio', label: 'Studio', icon: '🏨' }
]

// Computed properties để binding với SearchFilters
const selectedPropertyType = computed({
  get: () => props.filters.stayType,
  set: (value: string) => {
    emit('update:filters', { stayType: value })
  }
})

const priceRange = computed({
  get: () => props.filters.priceRange,
  set: (value: [number, number]) => {
    emit('update:filters', { priceRange: value })
  }
})

const selectedAmenities = computed({
  get: () => props.filters.amenities,
  set: (value: string[]) => {
    emit('update:filters', { amenities: value })
  }
})

const selectedCity = computed({
  get: () => props.filters.location,
  set: (value: string) => {
    emit('update:filters', { location: value })
  }
})

const guests = computed({
  get: () => props.filters.guests,
  set: (value: number) => {
    emit('update:filters', { guests: value })
  }
})

// Methods
const updatePriceRange = (type: 'min' | 'max', value: number) => {
  const current = [...priceRange.value] as [number, number]
  if (type === 'min') {
    current[0] = value
  } else {
    current[1] = value
  }
  priceRange.value = current
}

const togglePropertyType = (type: string) => {
  selectedPropertyType.value = selectedPropertyType.value === type ? '' : type
}

const toggleAmenity = (amenity: string) => {
  const current = [...selectedAmenities.value]
  const index = current.indexOf(amenity)
  
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(amenity)
  }
  
  selectedAmenities.value = current
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const handleReset = () => {
  emit('reset')
}

const increaseGuests = () => {
  if (guests.value < 10) {
    guests.value++
  }
}

const decreaseGuests = () => {
  if (guests.value > 1) {
    guests.value--
  }
}
</script>
