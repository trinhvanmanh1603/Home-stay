<template>
  <div class="space-y-6">
    <!-- Title and Rating -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ stay.title }}</h1>
      
      <!-- Brand Display -->
      <div v-if="stay.brand" class="mb-3">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <BuildingOfficeIcon class="w-4 h-4 mr-1" />
          {{ stay.brand }}
        </span>
      </div>
      
      <div class="flex items-center gap-4">
        <RatingDisplay 
          :rating="actualRating.roundedRating" 
          :reviewCount="actualRating.totalReviews" 
        />
        <div class="flex items-center space-x-1">
          <MapPinIcon class="h-5 w-5 text-gray-500" />
          <span class="text-gray-600 dark:text-gray-400">{{ stay.location }}, {{ stay.city }}</span>
        </div>
      </div>
    </div>

    <!-- Host Info -->
    <div v-if="stay.host" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div class="flex items-center space-x-4">
        <img
          :src="stay.host.avatar"
          :alt="stay.host.name"
          class="w-12 h-12 rounded-full"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            Chủ nhà: {{ stay.host.name }}
          </h3>
          <div class="flex items-center space-x-3 mt-1">
            <div class="flex items-center space-x-1">
              <CheckBadgeIcon v-if="stay.host.verified" class="h-4 w-4 text-primary-600" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ stay.host.verified ? 'Đã xác minh' : 'Chưa xác minh' }}
              </span>
            </div>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <UserIcon class="w-3 h-3 mr-1" />
              Quản trị viên
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Description -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mô tả</h3>
      <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
        {{ stay.description }}
      </p>
    </div>
    
    <!-- Property Details -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thông tin chi tiết</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="flex items-center space-x-2">
          <UserGroupIcon class="h-5 w-5 text-gray-500" />
          <span class="text-gray-700 dark:text-gray-300">{{ stay.maxGuests }} khách</span>
        </div>
        <div class="flex items-center space-x-2">
          <HomeIcon class="h-5 w-5 text-gray-500" />
          <span class="text-gray-700 dark:text-gray-300">{{ stay.bedrooms }} phòng ngủ</span>
        </div>
        <div class="flex items-center space-x-2">
          <BeakerIcon class="h-5 w-5 text-gray-500" />
          <span class="text-gray-700 dark:text-gray-300">{{ stay.bathrooms }} phòng tắm</span>
        </div>
      </div>
    </div>

    <!-- Amenities -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tiện ích</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="amenity in stay.amenities"
          :key="amenity"
          class="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
        >
          <CheckIcon class="h-5 w-5 text-green-500" />
          <span>{{ amenity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RatingDisplay from '@/components/RatingDisplay.vue'
import { 
  MapPinIcon, 
  UserGroupIcon, 
  HomeIcon, 
  BeakerIcon, 
  CheckIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import type { Stay } from '@/types'

interface Props {
  stay: Stay
  actualRating: { roundedRating: number; totalReviews: number }
}

defineProps<Props>()
</script>
