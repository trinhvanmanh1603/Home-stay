<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <AdminPageHeader
      title="Quản lý Homestay"
      :actions="authStore.canCreateHomestays ? [
        {
          type: 'link',
          to: '/admin/stays/add',
          text: 'Thêm Homestay',
          icon: 'plus'
        }
      ] : []"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SuperAdminNotice 
        v-if="authStore.isSuperAdmin"
        message="Với quyền Super Admin, bạn có thể xem và theo dõi tất cả homestay nhưng không thể chỉnh sửa. Chỉ brand admin mới có quyền quản lý homestay thuộc thương hiệu của họ."
        class="mb-6"
      />

      <!-- Filters -->

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
        
        <LoadingSpinner v-if="loading" message="Đang tải..." />

        <EmptyState 
          v-else-if="filteredStays.length === 0"
          title="Không tìm thấy homestay nào"
          description="Hãy thử thay đổi bộ lọc tìm kiếm để xem kết quả khác"
        />

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
                  <StatusBadge 
                    :status="stay.available ? 'active' : 'inactive'" 
                    :label="stay.available ? 'Hoạt động' : 'Tạm dừng'"
                  />
                  
                  <div class="flex space-x-1">
                    <ActionButton
                      @click="viewStay(stay)"
                      variant="ghost"
                      size="sm"
                      icon="eye"
                      title="Xem chi tiết"
                    />
                    <ActionButton
                      v-if="authStore.canEditHomestays"
                      @click="editStay(stay)"
                      variant="ghost"
                      size="sm"
                      icon="pencil"
                      title="Chỉnh sửa"
                    />
                    <ActionButton
                      v-if="authStore.canDeleteHomestays"
                      @click="deleteStay(stay.id)"
                      variant="ghost"
                      size="sm"
                      icon="trash"
                      title="Xóa"
                    />
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
import { useRouter } from 'vue-router'
import { StarIcon } from '@heroicons/vue/24/outline'
import { useStayStore } from '@/store/stays'
import { useAuthStore } from '@/store/auth'
import type { Stay } from '@/types'
import axios from 'axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import SuperAdminNotice from '@/components/admin/SuperAdminNotice.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ActionButton from '@/components/common/ActionButton.vue'

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
  loadStays()
})
</script>
