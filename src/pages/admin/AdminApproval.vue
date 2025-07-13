<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Phê duyệt Admin
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Quản lý yêu cầu quyền admin từ người dùng
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Chỉ admin tổng mới có thể phê duyệt
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingRequests.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Chờ phê duyệt</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ approvedRequests.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đã phê duyệt</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ rejectedRequests.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đã từ chối</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select v-model="statusFilter" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Đã từ chối</option>
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

      <!-- Requests List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách yêu cầu ({{ filteredRequests.length }})
          </h3>
        </div>
        
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>

        <div v-else-if="filteredRequests.length === 0" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">Không có yêu cầu nào</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="request in filteredRequests" :key="request.id" 
               class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ request.firstName }} {{ request.lastName }}
                    </h4>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ request.email }}
                    </p>
                  </div>
                  <span :class="getStatusBadgeClass(request.status)" 
                        class="px-3 py-1 text-sm rounded-full">
                    {{ getStatusText(request.status) }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thông tin liên hệ</p>
                    <p class="text-gray-900 dark:text-white">{{ request.phone }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thương hiệu</p>
                    <p class="text-blue-600 dark:text-blue-400 font-medium">
                      {{ request.brand }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian</p>
                    <p class="text-gray-900 dark:text-white">
                      Yêu cầu: {{ formatDateTime(request.requestedAt) }}
                    </p>
                    <p v-if="request.reviewedAt" class="text-sm text-gray-600 dark:text-gray-400">
                      Xử lý: {{ formatDateTime(request.reviewedAt) }}
                    </p>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lý do yêu cầu</p>
                  <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {{ request.reason }}
                  </p>
                </div>

                <div v-if="request.rejectionReason" class="mb-4">
                  <p class="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Lý do từ chối</p>
                  <p class="text-red-900 dark:text-red-100 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {{ request.rejectionReason }}
                  </p>
                </div>

                <div v-if="request.status === 'pending'" class="flex space-x-3">
                  <button @click="approveRequest(request)" 
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <CheckIcon class="w-4 h-4 inline mr-1" />
                    Phê duyệt
                  </button>
                  <button @click="showRejectModal(request)" 
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <XMarkIcon class="w-4 h-4 inline mr-1" />
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Từ chối yêu cầu
        </h3>
        
        <form @submit.prevent="rejectRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lý do từ chối
            </label>
            <textarea v-model="rejectionReason" 
                      rows="4"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Mô tả lý do từ chối yêu cầu..."></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <button type="button" 
                    @click="showRejectForm = false"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Hủy
            </button>
            <button type="submit" 
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Từ chối
            </button>
          </div>
        </form>
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
import { useAuthStore } from '@/store/auth'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import type { AdminRequest } from '@/types'

const authStore = useAuthStore()
const requests = ref<AdminRequest[]>([])
const loading = ref(true)
const statusFilter = ref('')

const showRejectForm = ref(false)
const selectedRequest = ref<AdminRequest | null>(null)
const rejectionReason = ref('')

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  type: 'success' as 'success' | 'danger' | 'warning' | 'info',
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

const loadRequests = async () => {
  try {
    const response = await axios.get('http://localhost:3001/admin-requests')
    requests.value = response.data.sort((a: AdminRequest, b: AdminRequest) => 
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    )
  } catch (error) {
    console.error('Error loading admin requests:', error)
  } finally {
    loading.value = false
  }
}

const filteredRequests = computed(() => {
  let filtered = requests.value

  if (statusFilter.value) {
    filtered = filtered.filter(req => req.status === statusFilter.value)
  }

  return filtered
})

const pendingRequests = computed(() => 
  requests.value.filter(req => req.status === 'pending')
)

const approvedRequests = computed(() => 
  requests.value.filter(req => req.status === 'approved')
)

const rejectedRequests = computed(() => 
  requests.value.filter(req => req.status === 'rejected')
)

const clearFilters = () => {
  statusFilter.value = ''
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Chờ phê duyệt'
    case 'approved':
      return 'Đã phê duyệt'
    case 'rejected':
      return 'Đã từ chối'
    default:
      return status
  }
}

const approveRequest = async (request: AdminRequest) => {
  if (!confirm('Bạn có chắc chắn muốn phê duyệt yêu cầu này?')) return

  try {
    // Update request status
    const updatedRequest = {
      ...request,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: authStore.user?.email
    }
    
    await axios.put(`http://localhost:3001/admin-requests/${request.id}`, updatedRequest)

    // Create admin user
    const newAdmin = {
      id: Date.now().toString(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      brand: request.brand,
      verified: true,
      role: 'admin',
      createdAt: new Date().toISOString()
    }

    await axios.post('http://localhost:3001/users', newAdmin)

    // Update local state
    const index = requests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
      requests.value[index] = updatedRequest as AdminRequest
    }

    openConfirmationModal({
      type: 'success',
      title: 'Phê duyệt thành công',
      message: 'Yêu cầu đã được phê duyệt thành công!',
      details: `Admin mới cho thương hiệu ${request.brand} đã được tạo và có thể đăng nhập ngay.`,
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })

  } catch (error) {
    console.error('Error approving request:', error)
    openConfirmationModal({
      type: 'danger',
      title: 'Lỗi phê duyệt',
      message: 'Có lỗi xảy ra khi phê duyệt yêu cầu',
      details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })
  }
}

const showRejectModal = (request: AdminRequest) => {
  selectedRequest.value = request
  rejectionReason.value = ''
  showRejectForm.value = true
}

const rejectRequest = async () => {
  if (!selectedRequest.value || !rejectionReason.value) return

  try {
    const updatedRequest = {
      ...selectedRequest.value,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: authStore.user?.email,
      rejectionReason: rejectionReason.value
    }
    
    await axios.put(`http://localhost:3001/admin-requests/${selectedRequest.value.id}`, updatedRequest)

    // Update local state
    const index = requests.value.findIndex(r => r.id === selectedRequest.value!.id)
    if (index !== -1) {
      requests.value[index] = updatedRequest as AdminRequest
    }

    showRejectForm.value = false
    openConfirmationModal({
      type: 'success',
      title: 'Từ chối thành công',
      message: 'Yêu cầu đã được từ chối',
      details: `Lý do từ chối: ${rejectionReason.value}`,
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })

  } catch (error) {
    console.error('Error rejecting request:', error)
    openConfirmationModal({
      type: 'danger',
      title: 'Lỗi từ chối',
      message: 'Có lỗi xảy ra khi từ chối yêu cầu',
      details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })
  }
}

onMounted(() => {
  loadRequests()
})
</script>

