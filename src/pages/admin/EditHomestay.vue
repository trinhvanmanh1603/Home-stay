<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Chỉnh sửa Homestay
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Cập nhật thông tin homestay {{ homestayData?.title }}
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

    <!-- Loading State -->
    <div v-if="loadingData" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải thông tin homestay...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p class="text-red-600 dark:text-red-400">{{ loadError }}</p>
        <RouterLink 
          to="/admin/stays"
          class="mt-4 inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Quay lại danh sách
        </RouterLink>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
          {{ errorMessage }}
        </div>

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
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Chọn loại hình</option>
                <option value="villa">Villa</option>
                <option value="apartment">Căn hộ</option>
                <option value="house">Nhà riêng</option>
                <option value="resort">Resort</option>
                <option value="hotel">Khách sạn</option>
              </select>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa điểm *
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ví dụ: Đà Nẵng, Việt Nam"
              />
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá (VND/đêm) *
              </label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1500000"
              />
            </div>

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

            <div>
              <label for="available" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trạng thái
              </label>
              <select
                id="available"
                v-model="form.available"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option :value="true">Có sẵn</option>
                <option :value="false">Không có sẵn</option>
              </select>
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
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về homestay..."
            ></textarea>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh *
            </label>
            <div class="space-y-3">
              <div v-for="(_, index) in form.images" :key="index" class="flex gap-2">
                <input
                  v-model="form.images[index]"
                  type="url"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  :disabled="form.images.length <= 1"
                >
                  Xóa
                </button>
              </div>
              <button
                type="button"
                @click="addImage"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Thêm hình ảnh
              </button>
            </div>
          </div>

          <!-- Amenities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiện nghi
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div v-for="amenity in availableAmenities" :key="amenity.value" class="flex items-center">
                <input
                  :id="`amenity-${amenity.value}`"
                  v-model="form.amenities"
                  :value="amenity.value"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <RouterLink
              to="/admin/stays"
              class="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </RouterLink>
            <button
              type="submit"
              :disabled="!canSubmit || loading"
              class="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              <span v-if="loading">Đang cập nhật...</span>
              <span v-else>Cập nhật homestay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useStayStore } from '@/store/stays'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const stayStore = useStayStore()

const loadingData = ref(true)
const loading = ref(false)
const loadError = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const homestayData = ref<any>(null)

const form = ref({
  title: '',
  description: '',
  location: '',
  price: 0,
  type: '',
  images: [''],
  amenities: [] as string[],
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  available: true
})

const availableAmenities = [
  { value: 'wifi', label: 'WiFi miễn phí' },
  { value: 'parking', label: 'Chỗ đậu xe' },
  { value: 'pool', label: 'Hồ bơi' },
  { value: 'kitchen', label: 'Nhà bếp' },
  { value: 'aircon', label: 'Điều hòa' },
  { value: 'tv', label: 'TV' },
  { value: 'washer', label: 'Máy giặt' },
  { value: 'balcony', label: 'Ban công' },
  { value: 'gym', label: 'Phòng gym' },
  { value: 'breakfast', label: 'Bữa sáng' },
  { value: 'pets', label: 'Cho phép thú cưng' },
  { value: 'smoking', label: 'Cho phép hút thuốc' }
]

const canSubmit = computed(() => {
  return form.value.title && 
         form.value.description && 
         form.value.location && 
         form.value.price > 0 && 
         form.value.type && 
         form.value.guests > 0 && 
         form.value.bedrooms > 0 && 
         form.value.bathrooms > 0 && 
         form.value.images.every(img => img.trim() !== '')
})

const addImage = () => {
  form.value.images.push('')
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const getAmenityLabel = (value: string): string => {
  const amenity = availableAmenities.find(a => a.value === value)
  return amenity ? amenity.label : value
}

const loadHomestay = async () => {
  try {
    const homestayId = route.params.id as string
    const response = await axios.get(`http://localhost:3001/stays/${homestayId}`)
    homestayData.value = response.data
    
    // Fill form with existing data
    form.value = {
      title: homestayData.value.title || '',
      description: homestayData.value.description || '',
      location: homestayData.value.location || '',
      price: homestayData.value.price || 0,
      type: homestayData.value.type || '',
      images: homestayData.value.images?.length ? [...homestayData.value.images] : [''],
      amenities: homestayData.value.amenities?.map((amenity: string) => {
        // Convert back from label to value if needed
        const found = availableAmenities.find(a => a.label === amenity)
        return found ? found.value : amenity
      }) || [],
      guests: homestayData.value.maxGuests || 1,
      bedrooms: homestayData.value.bedrooms || 1,
      bathrooms: homestayData.value.bathrooms || 1,
      available: homestayData.value.available !== false
    }
  } catch (error: any) {
    console.error('Error loading homestay:', error)
    loadError.value = 'Không thể tải thông tin homestay. Vui lòng thử lại sau.'
  } finally {
    loadingData.value = false
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const homestayId = route.params.id as string
    const updatedHomestay = {
      ...homestayData.value,
      title: form.value.title,
      description: form.value.description,
      location: form.value.location,
      city: form.value.location, // Update city field
      price: form.value.price,
      type: form.value.type,
      images: form.value.images.filter(img => img.trim() !== ''),
      amenities: form.value.amenities.map(amenity => getAmenityLabel(amenity)),
      maxGuests: form.value.guests,
      bedrooms: form.value.bedrooms,
      bathrooms: form.value.bathrooms,
      available: form.value.available,
      // Keep existing data
      brand: homestayData.value.brand || authStore.user?.brand || 'Default Brand',
      host: homestayData.value.host || {
        name: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Admin System',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        verified: true
      },
      rating: homestayData.value.rating || 0,
      reviewCount: homestayData.value.reviewCount || 0,
      unavailableDates: homestayData.value.unavailableDates || []
    }

    await axios.put(`http://localhost:3001/stays/${homestayId}`, updatedHomestay)

    // Refresh stays store để cập nhật danh sách
    await stayStore.fetchStays()

    successMessage.value = 'Homestay đã được cập nhật thành công!'
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/admin/stays')
    }, 2000)

  } catch (error: any) {
    console.error('Error updating homestay:', error)
    errorMessage.value = error.message || 'Có lỗi xảy ra khi cập nhật homestay'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
    router.push('/login')
    return
  }

  await loadHomestay()
})
</script>
