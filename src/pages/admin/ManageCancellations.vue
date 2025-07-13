<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Quản lý yêu cầu hủy đặt phòng
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Xem xét và xử lý các yêu cầu hủy đặt phòng từ khách hàng
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              @click="activeFilter = tab.key"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeFilter === tab.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              {{ tab.label }}
              <span class="ml-2 py-0.5 px-2 rounded-full text-xs"
                    :class="activeFilter === tab.key
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
                {{ getRequestCount(tab.key) }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải danh sách yêu cầu hủy...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRequests.length === 0" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <ExclamationTriangleIcon class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ activeFilter === 'all' ? 'Chưa có yêu cầu hủy nào' : `Không có yêu cầu hủy ${getFilterLabel(activeFilter)}` }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ activeFilter === 'all' ? 'Tất cả yêu cầu hủy sẽ hiển thị ở đây.' : 'Thử chuyển sang tab khác để xem các yêu cầu khác.' }}
        </p>
      </div>

      <!-- Cancellation Requests List -->
      <div v-else class="space-y-6">
        <div
          v-for="request in filteredRequests"
          :key="request.id"
          class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Request Header -->
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      Yêu cầu hủy #{{ request.id }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Đặt phòng #{{ request.bookingId }} - {{ request.booking.stayTitle }}
                    </p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(request.status)">
                    {{ getStatusText(request.status) }}
                  </span>
                </div>

                <!-- Guest Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Thông tin khách hàng</h4>
                    <div class="space-y-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Tên:</span> {{ request.guestInfo.firstName }} {{ request.guestInfo.lastName }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Email:</span> {{ request.guestInfo.email }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Số điện thoại:</span> {{ request.guestInfo.phone }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Thông tin đặt phòng</h4>
                    <div class="space-y-2">
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Nhận phòng:</span> {{ formatDate(request.booking.checkIn) }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Trả phòng:</span> {{ formatDate(request.booking.checkOut) }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Tổng tiền:</span> {{ formatCurrency(request.booking.totalPrice) }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        <span class="font-medium">Tiền cọc:</span> {{ formatCurrency(request.booking.depositAmount) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Cancellation Details -->
                <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Lý do hủy</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ request.reason }}</p>
                  <div class="mt-3 flex items-center justify-between">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      <span class="font-medium">Yêu cầu lúc:</span> {{ formatDateTime(request.requestedAt) }}
                    </p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      Số tiền hoàn: {{ formatCurrency(request.refundAmount) }}
                    </p>
                  </div>
                </div>

                <!-- Review Info (if processed) -->
                <div v-if="request.reviewedAt" class="mt-4 p-4 rounded-lg"
                     :class="{
                       'bg-green-50 dark:bg-green-900/20': request.status === 'approved',
                       'bg-red-50 dark:bg-red-900/20': request.status === 'rejected'
                     }">
                  <h4 class="text-sm font-medium mb-2"
                      :class="{
                        'text-green-800 dark:text-green-400': request.status === 'approved',
                        'text-red-800 dark:text-red-400': request.status === 'rejected'
                      }">
                    Kết quả xử lý
                  </h4>
                  <div class="space-y-1">
                    <p class="text-sm"
                       :class="{
                         'text-green-600 dark:text-green-300': request.status === 'approved',
                         'text-red-600 dark:text-red-300': request.status === 'rejected'
                       }">
                      <span class="font-medium">Xử lý bởi:</span> {{ request.reviewedBy }}
                    </p>
                    <p class="text-sm"
                       :class="{
                         'text-green-600 dark:text-green-300': request.status === 'approved',
                         'text-red-600 dark:text-red-300': request.status === 'rejected'
                       }">
                      <span class="font-medium">Xử lý lúc:</span> {{ formatDateTime(request.reviewedAt) }}
                    </p>
                    <p v-if="request.rejectionReason" class="text-sm text-red-600 dark:text-red-300">
                      <span class="font-medium">Lý do từ chối:</span> {{ request.rejectionReason }}
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="request.status === 'pending'" class="mt-6 flex space-x-3">
                  <button
                    @click="approveRequest(request)"
                    :disabled="processing"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {{ processing && selectedRequest?.id === request.id ? 'Đang xử lý...' : 'Chấp nhận' }}
                  </button>
                  <button
                    @click="openRejectModal(request)"
                    :disabled="processing"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeRejectModal"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Từ chối yêu cầu hủy
            </h3>
          </div>
          <div class="px-6 py-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Vui lòng cho biết lý do từ chối yêu cầu hủy này:
            </p>
            <textarea
              v-model="rejectionReason"
              placeholder="Nhập lý do từ chối..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end space-x-3">
            <button
              @click="closeRejectModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="rejectRequest"
              :disabled="!rejectionReason.trim() || processing"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {{ processing ? 'Đang xử lý...' : 'Xác nhận từ chối' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { cancellationService, type CancellationRequest } from '@/services/cancellation.service'

const authStore = useAuthStore()

const loading = ref(true)
const processing = ref(false)
const requests = ref<CancellationRequest[]>([])
const activeFilter = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')

// Rejection modal
const showRejectModal = ref(false)
const selectedRequest = ref<CancellationRequest | null>(null)
const rejectionReason = ref('')

const filterTabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'approved', label: 'Đã chấp nhận' },
  { key: 'rejected', label: 'Đã từ chối' }
] as const

const filteredRequests = computed(() => {
  if (activeFilter.value === 'all') {
    return requests.value
  }
  return requests.value.filter(request => request.status === activeFilter.value)
})

const getRequestCount = (filter: string): number => {
  if (filter === 'all') return requests.value.length
  return requests.value.filter(request => request.status === filter).length
}

const loadRequests = async () => {
  try {
    requests.value = await cancellationService.getCancellationRequests()
    // Sort by request date, newest first
    requests.value.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
  } catch (error) {
    console.error('Error loading cancellation requests:', error)
  } finally {
    loading.value = false
  }
}

const getFilterLabel = (filter: string): string => {
  const tab = filterTabs.find(t => t.key === filter)
  return tab ? tab.label.toLowerCase() : ''
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'Đã chấp nhận'
    case 'pending':
      return 'Chờ xử lý'
    case 'rejected':
      return 'Đã từ chối'
    default:
      return 'Không xác định'
  }
}

const approveRequest = async (request: CancellationRequest) => {
  if (!authStore.user) return
  
  processing.value = true
  selectedRequest.value = request
  
  try {
    await cancellationService.updateCancellationRequestStatus(
      request.id,
      'approved',
      authStore.user.email
    )
    
    // Update local data
    const requestIndex = requests.value.findIndex(r => r.id === request.id)
    if (requestIndex !== -1) {
      requests.value[requestIndex].status = 'approved'
      requests.value[requestIndex].reviewedAt = new Date().toISOString()
      requests.value[requestIndex].reviewedBy = authStore.user.email
    }
    
    alert('Yêu cầu hủy đã được chấp nhận thành công!')
  } catch (error) {
    console.error('Error approving cancellation request:', error)
    alert('Có lỗi xảy ra khi chấp nhận yêu cầu hủy.')
  } finally {
    processing.value = false
    selectedRequest.value = null
  }
}

const openRejectModal = (request: CancellationRequest) => {
  selectedRequest.value = request
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedRequest.value = null
  rejectionReason.value = ''
}

const rejectRequest = async () => {
  if (!selectedRequest.value || !rejectionReason.value.trim() || !authStore.user) return
  
  processing.value = true
  
  try {
    await cancellationService.updateCancellationRequestStatus(
      selectedRequest.value.id,
      'rejected',
      authStore.user.email,
      rejectionReason.value.trim()
    )
    
    // Update local data
    const requestIndex = requests.value.findIndex(r => r.id === selectedRequest.value!.id)
    if (requestIndex !== -1) {
      requests.value[requestIndex].status = 'rejected'
      requests.value[requestIndex].reviewedAt = new Date().toISOString()
      requests.value[requestIndex].reviewedBy = authStore.user.email
      requests.value[requestIndex].rejectionReason = rejectionReason.value.trim()
    }
    
    alert('Yêu cầu hủy đã được từ chối!')
    closeRejectModal()
  } catch (error) {
    console.error('Error rejecting cancellation request:', error)
    alert('Có lỗi xảy ra khi từ chối yêu cầu hủy.')
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang này')
    return
  }

  await loadRequests()
})
</script>
