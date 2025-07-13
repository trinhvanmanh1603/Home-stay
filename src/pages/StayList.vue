<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Khám phá homestay
        </h1>
        <SearchBar />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bộ lọc
            </h3>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Khoảng giá (VNĐ/đêm)
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="filters.priceRange[0]"
                  type="number"
                  placeholder="Từ"
                  class="input-field text-sm"
                  @input="updateFilters"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model="filters.priceRange[1]"
                  type="number"
                  placeholder="Đến"
                  class="input-field text-sm"
                  @input="updateFilters"
                />
              </div>
            </div>

            <!-- Stay Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại hình
              </label>
              <select
                v-model="filters.stayType"
                class="input-field"
                @change="updateFilters"
              >
                <option value="">Tất cả</option>
                <option value="villa">Villa</option>
                <option value="apartment">Căn hộ</option>
                <option value="house">Nhà riêng</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <!-- Amenities -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiện ích
              </label>
              <div class="space-y-2">
                <label
                  v-for="amenity in availableAmenities"
                  :key="amenity"
                  class="flex items-center"
                >
                  <input
                    v-model="filters.amenities"
                    type="checkbox"
                    :value="amenity"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    @change="updateFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full btn-secondary text-sm py-2"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-3">
          <!-- Results Header -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              Tìm thấy {{ filteredStays.length }} kết quả
            </p>
            <select
              v-model="sortBy"
              class="input-field w-auto"
              @change="sortStays"
            >
              <option value="default">Sắp xếp mặc định</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="n in 9" :key="n" class="animate-pulse">
              <div class="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
              <div class="space-y-2">
                <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Stay Cards -->
          <div v-else-if="sortedStays.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <StayCard
              v-for="stay in sortedStays"
              :key="stay.id"
              :stay="stay"
            />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.172A7.962 7.962 0 016 12c0-2.034.785-3.9 2.172-5.291A7.962 7.962 0 0112 9c2.034 0 3.9.785 5.291 2.172A7.962 7.962 0 0118 12c0 2.034-.785 3.9-2.172 5.291z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy kết quả
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Hãy thử điều chỉnh bộ lọc để tìm thấy homestay phù hợp
            </p>
            <button @click="clearFilters" class="btn-primary">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import { useStayStore } from '@/store/stays'
import SearchBar from '@/components/SearchBar.vue'
import StayCard from '@/components/StayCard.vue'
import { AMENITY_LABELS } from '@/constants/amenities'

const stayStore = useStayStore()
const sortBy = ref<string>('default')

const filters = reactive({
  priceRange: [0, 20000000], // Đồng bộ với store
  stayType: '',
  amenities: [] as string[]
})

const availableAmenities = AMENITY_LABELS

const loading = computed(() => stayStore.loading)
const filteredStays = computed(() => stayStore.filteredStays)

const sortedStays = computed(() => {
  let sorted = [...filteredStays.value]
  
  switch (sortBy.value) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      // Keep original order
      break
  }
  
  return sorted
})

const updateFilters = () => {
  stayStore.updateSearchFilters({
    priceRange: [filters.priceRange[0], filters.priceRange[1]],
    stayType: filters.stayType,
    amenities: filters.amenities
  })
}

const clearFilters = () => {
  filters.priceRange = [0, 20000000] // Đồng bộ với store
  filters.stayType = ''
  filters.amenities = []
  sortBy.value = 'default'
  updateFilters()
}

const sortStays = () => {
  // Sorting is handled by computed property
}

onMounted(() => {
  stayStore.fetchStays()
})
</script>
