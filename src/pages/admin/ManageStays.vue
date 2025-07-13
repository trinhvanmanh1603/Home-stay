<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Quản lý Homestay
              <span v-if="authStore.user?.brand && !authStore.isSuperAdmin" class="text-lg text-blue-600 dark:text-blue-400 block">
                {{ authStore.user.brand }}
              </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              <span v-if="authStore.user?.brand && !authStore.isSuperAdmin">
                Quản lý homestay thuộc thương hiệu {{ authStore.user.brand }}
              </span>
              <span v-else-if="authStore.isSuperAdmin">
                Giám sát tất cả homestay trong hệ thống (quyền xem và theo dõi)
              </span>
              <span v-else>
                Quản lý tất cả homestay trong hệ thống
              </span>
            </p>
          </div>
          <RouterLink 
            v-if="authStore.canCreateHomestays"
            to="/admin/stays/add"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Thêm Homestay
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Super Admin Notice -->
      <div v-if="authStore.isSuperAdmin" class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
              Quyền Super Admin
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>Bạn đang ở chế độ giám sát. Bạn có thể xem tất cả thông tin nhưng không thể thêm, sửa, hoặc xóa homestay.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <input v-model="searchQuery" 
                   type="text" 
                   placeholder="Tên homestay, địa chỉ..."
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại phòng
            </label>
            <select v-model="selectedType" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="villa">Villa</option>
              <option value="apartment">Căn hộ</option>
              <option value="house">Nhà riêng</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select v-model="selectedStatus" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="clearFilters" 
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredStays.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng Homestay</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ activeStays }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ inactiveStays }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tạm dừng</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ averageRating.toFixed(1) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đánh giá TB</div>
        </div>
      </div>

      <!-- Homestay List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách Homestay ({{ filteredStays.length }})
          </h3>
        </div>
        
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>

        <div v-else-if="filteredStays.length === 0" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">Không tìm thấy homestay nào</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="stay in paginatedStays" :key="stay.id" 
               class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img :src="stay.images[0]" 
                     :alt="stay.title"
                     class="w-20 h-20 object-cover rounded-lg">
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ stay.title }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ stay.location }}
                  </p>
                  <div class="flex items-center mt-2 space-x-4">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ stay.type }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ stay.bedrooms }} phòng ngủ
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ stay.maxGuests }} khách
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatCurrency(stay.price) }}/đêm
                  </div>
                  <div class="flex items-center">
                    <StarIcon class="w-4 h-4 text-yellow-400 mr-1" />
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ stay.rating }} ({{ stay.reviewCount }} đánh giá)
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span :class="getStatusBadgeClass(stay.available ? 'active' : 'inactive')" 
                        class="px-2 py-1 text-xs rounded-full">
                    {{ getStatusText(stay.available ? 'active' : 'inactive') }}
                  </span>
                  
                  <div class="flex space-x-1">
                    <button @click="viewStay(stay)" 
                            class="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Xem chi tiết">
                      <EyeIcon class="w-4 h-4" />
                    </button>
                    <button v-if="authStore.canEditHomestays"
                            @click="editStay(stay)" 
                            class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Chỉnh sửa">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button v-if="authStore.canDeleteHomestays"
                            @click="deleteStay(stay.id)" 
                            class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Xóa">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredStays.length) }} 
              trong {{ filteredStays.length }} kết quả
            </div>
            <div class="flex space-x-2">
              <button @click="currentPage--" 
                      :disabled="currentPage === 1"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button v-for="page in visiblePages" :key="page"
                      @click="currentPage = page"
                      :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded">
                {{ page }}
              </button>
              <button @click="currentPage++" 
                      :disabled="currentPage === totalPages"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showConfirmationModal"
      :type="confirmationConfig.type"
      :title="confirmationConfig.title"
      :message="confirmationConfig.message"
      :details="confirmationConfig.details"
      @confirm="confirmationConfig.onConfirm"
      @cancel="showConfirmationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { useStayStore } from '@/store/stays'
import { useAuthStore } from '@/store/auth'
import type { Stay } from '@/types'
import axios from 'axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const stayStore = useStayStore()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  type: 'danger' as 'success' | 'danger' | 'warning' | 'info',
  title: '',
  message: '',
  details: '',
  onConfirm: () => {}
})

// Helper function to open confirmation modal
const openConfirmationModal = (config: typeof confirmationConfig.value) => {
  confirmationConfig.value = config
  showConfirmationModal.value = true
}

// Use store data instead of local state
const stays = computed(() => stayStore.stays)

const loadStays = async () => {
  loading.value = true
  try {
    await stayStore.fetchStays()
  } catch (error) {
    console.error('Error loading stays:', error)
  } finally {
    loading.value = false
  }
}

const filteredStays = computed(() => {
  let filtered = stays.value

  // Filter theo brand của admin (chỉ brand admin, không phải super admin)
  if (authStore.user?.role === 'admin' && authStore.user?.brand && !authStore.isSuperAdmin) {
    filtered = filtered.filter(stay => stay.brand === authStore.user?.brand)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(stay => 
      stay.title.toLowerCase().includes(query) ||
      stay.location.toLowerCase().includes(query) ||
      stay.city.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(stay => stay.type === selectedType.value)
  }

  if (selectedStatus.value) {
    if (selectedStatus.value === 'active') {
      filtered = filtered.filter(stay => stay.available === true)
    } else if (selectedStatus.value === 'inactive') {
      filtered = filtered.filter(stay => stay.available === false)
    }
  }

  return filtered
})

const paginatedStays = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStays.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStays.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const activeStays = computed(() => 
  filteredStays.value.filter(stay => stay.available === true).length
)

const inactiveStays = computed(() => 
  filteredStays.value.filter(stay => stay.available === false).length
)

const averageRating = computed(() => {
  if (filteredStays.value.length === 0) return 0
  const total = filteredStays.value.reduce((sum, stay) => sum + stay.rating, 0)
  return total / filteredStays.value.length
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'maintenance':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Hoạt động'
    case 'inactive':
      return 'Tạm dừng'
    case 'maintenance':
      return 'Bảo trì'
    default:
      return status
  }
}

const viewStay = (stay: Stay) => {
  router.push(`/stay/${stay.id}`)
}

const editStay = (stay: Stay) => {
  router.push(`/admin/stays/edit/${stay.id}`)
}

const deleteStay = async (stayId: string) => {
  const stay = stays.value.find(s => s.id === stayId)
  
  openConfirmationModal({
    type: 'danger',
    title: 'Xác nhận xóa homestay',
    message: `Bạn có chắc chắn muốn xóa homestay "${stay?.title || 'này'}"?`,
    details: 'Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.',
    onConfirm: async () => {
      try {
        await axios.delete(`http://localhost:3001/stays/${stayId}`)
        await stayStore.fetchStays()
        showConfirmationModal.value = false
      } catch (error) {
        console.error('Error deleting stay:', error)
        openConfirmationModal({
          type: 'danger',
          title: 'Lỗi xóa homestay',
          message: 'Có lỗi xảy ra khi xóa homestay',
          details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
          onConfirm: () => {
            showConfirmationModal.value = false
          }
        })
      }
    }
  })
}

onMounted(() => {
  console.log('User role:', authStore.user?.role)
  console.log('Super admin:', authStore.user?.super_admin)
  console.log('Is super admin:', authStore.isSuperAdmin)
  console.log('Is admin:', authStore.isAdmin)
  console.log('Can create homestays:', authStore.canCreateHomestays)
  console.log('Can edit homestays:', authStore.canEditHomestays)
  console.log('Can delete homestays:', authStore.canDeleteHomestays)
  
  loadStays()
})
</script>
