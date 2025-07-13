<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <form @submit.prevent="handleSearch" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Địa điểm
          </label>
          <div class="relative">
            <MapPinIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="location"
              v-model="searchForm.location"
              type="text"
              placeholder="Bạn muốn đi đâu?"
              class="input-field pl-10"
            />
          </div>
        </div>

        <!-- Check-in -->
        <div>
          <label for="checkin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ngày nhận phòng
          </label>
          <div class="relative">
            <CalendarIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="checkin"
              v-model="searchForm.checkIn"
              type="date"
              class="input-field pl-10"
            />
          </div>
        </div>

        <!-- Check-out -->
        <div>
          <label for="checkout" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ngày trả phòng
          </label>
          <div class="relative">
            <CalendarIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="checkout"
              v-model="searchForm.checkOut"
              type="date"
              class="input-field pl-10"
            />
          </div>
        </div>

        <!-- Guests -->
        <div>
          <label for="guests" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Số khách
          </label>
          <div class="relative">
            <UserGroupIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              id="guests"
              v-model="searchForm.guests"
              class="input-field pl-10 appearance-none"
            >
              <option v-for="num in 8" :key="num" :value="num">{{ num }} khách</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Search Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          class="btn-primary flex items-center space-x-2 px-8 py-3"
        >
          <MagnifyingGlassIcon class="h-5 w-5" />
          <span>Tìm kiếm</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStayStore } from '@/store/stays'
import {
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const stayStore = useStayStore()

const searchForm = reactive({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 1
})

const handleSearch = () => {
  stayStore.updateSearchFilters({
    location: searchForm.location,
    checkIn: searchForm.checkIn,
    checkOut: searchForm.checkOut,
    guests: searchForm.guests
  })
  
  router.push('/stays')
}
</script>
