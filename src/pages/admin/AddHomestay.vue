<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Thêm Homestay Mới
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Tạo homestay mới trong hệ thống
            </p>
          </div>
          <RouterLink 
            to="/admin/stays"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ← Quay lại
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên homestay *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ví dụ: Villa sang trọng bên bờ biển"
              />
            </div>
            
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại hình *
              </label>
              <select
                id="type"
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Chọn loại hình</option>
                <option value="villa">Villa</option>
                <option value="apartment">Căn hộ</option>
                <option value="house">Nhà riêng</option>
                <option value="resort">Resort</option>
                <option value="hotel">Khách sạn</option>
              </select>
            </div>
          </div>

          <!-- Location -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa điểm *
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ví dụ: Đà Nẵng, Việt Nam"
              />
            </div>
            
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá/đêm (VNĐ) *
              </label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="1500000"
              />
            </div>
          </div>

          <!-- Capacity -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="guests" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số khách *
              </label>
              <input
                id="guests"
                v-model.number="form.guests"
                type="number"
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="4"
              />
            </div>
            
            <div>
              <label for="bedrooms" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số phòng ngủ *
              </label>
              <input
                id="bedrooms"
                v-model.number="form.bedrooms"
                type="number"
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="2"
              />
            </div>
            
            <div>
              <label for="bathrooms" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số phòng tắm *
              </label>
              <input
                id="bathrooms"
                v-model.number="form.bathrooms"
                type="number"
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="2"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Mô tả chi tiết về homestay..."
            ></textarea>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh *
            </label>
            <div class="space-y-3">
              <div v-for="(_, index) in form.images" :key="index" class="flex items-center space-x-3">
                <input
                  v-model="form.images[index]"
                  type="url"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  v-if="form.images.length > 1"
                  @click="removeImage(index)"
                  type="button"
                  class="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  Xóa
                </button>
              </div>
              <button
                @click="addImage"
                type="button"
                class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 text-sm font-medium"
              >
                + Thêm hình ảnh
              </button>
            </div>
          </div>

          <!-- Amenities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tiện nghi
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label v-for="amenity in availableAmenities" :key="amenity.key" class="flex items-center space-x-2">
                <input
                  v-model="form.amenities"
                  :value="amenity.key"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ amenity.label }}</span>
              </label>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="text-red-800 dark:text-red-200">{{ errorMessage }}</div>
          </div>

          <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div class="text-green-800 dark:text-green-200">{{ successMessage }}</div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <RouterLink 
              to="/admin/stays"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </RouterLink>
            <button
              type="submit"
              :disabled="loading || !canSubmit"
              class="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <span v-if="loading">Đang tạo...</span>
              <span v-else>Tạo Homestay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useStayStore } from '@/store/stays'
import { useAuthStore } from '@/store/auth'
import { AVAILABLE_AMENITIES, getAmenityLabel } from '@/constants/amenities'
import axios from 'axios'

const router = useRouter()
const stayStore = useStayStore()
const authStore = useAuthStore()

const form = ref({
  title: '',
  type: '',
  location: '',
  price: 0,
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  description: '',
  images: [''],
  amenities: [] as string[]
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const availableAmenities = AVAILABLE_AMENITIES

const canSubmit = computed(() => {
  return form.value.title && 
         form.value.type && 
         form.value.location && 
         form.value.price > 0 && 
         form.value.guests > 0 && 
         form.value.bedrooms > 0 && 
         form.value.bathrooms > 0 && 
         form.value.description &&
         form.value.images.every(img => img.trim() !== '')
})

const addImage = () => {
  form.value.images.push('')
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const homestay = {
      id: Date.now().toString(),
      title: form.value.title,
      description: form.value.description,
      location: form.value.location,
      city: form.value.location, // Thêm city field
      price: form.value.price,
      rating: 0,
      reviewCount: 0,
      type: form.value.type,
      images: form.value.images.filter(img => img.trim() !== ''),
      amenities: form.value.amenities.map(amenity => getAmenityLabel(amenity)),
      brand: authStore.user?.brand || 'Default Brand', // Thêm brand từ admin user
      host: {
        name: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Admin System',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        verified: true
      },
      maxGuests: form.value.guests,
      bedrooms: form.value.bedrooms,
      bathrooms: form.value.bathrooms,
      available: true,
      unavailableDates: []
    }

    await axios.post('http://localhost:3001/stays', homestay)

    // Refresh stays store để cập nhật danh sách
    await stayStore.fetchStays()

    successMessage.value = 'Homestay đã được tạo thành công!'
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/stays')
    }, 2000)

  } catch (error: any) {
    console.error('Error creating homestay:', error)
    errorMessage.value = error.message || 'Có lỗi xảy ra khi tạo homestay'
  } finally {
    loading.value = false
  }
}
</script>
