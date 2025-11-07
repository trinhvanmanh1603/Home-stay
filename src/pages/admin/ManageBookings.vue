<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <AdminPageHeader 
      title="Quản lý Đặt phòng"
      :brand-description="`Quản lý đặt phòng cho homestay thuộc thương hiệu ${authStore.user?.brand}`"
      :super-admin-description="'Giám sát tất cả đặt phòng trong hệ thống (quyền xem và theo dõi)'"
      :admin-description="'Quản lý tất cả đặt phòng trong hệ thống'"
    />

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Super Admin Notice -->
      <SuperAdminNotice 
        message="Bạn đang ở chế độ giám sát. Bạn có thể xem tất cả thông tin nhưng không thể thay đổi trạng thái đặt phòng."
      />

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FormInput
            v-model="searchQuery"
            type="text"
            label="Tìm kiếm"
            placeholder="Tên khách, homestay..."
          />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select v-model="selectedStatus" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          
          <FormInput
            v-model="fromDate"
            type="date"
            label="Từ ngày"
          />
          
          <FormInput
            v-model="toDate"
            type="date"
            label="Đến ngày"
          />
          
          <div class="flex items-end">
            <ActionButton
              @click="clearFilters"
              variant="secondary"
              class="w-full"
            >
              Xóa bộ lọc
            </ActionButton>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredBookings.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng đặt phòng</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingBookings }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Chờ xác nhận</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ confirmedBookings }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đã xác nhận</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ completedBookings }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalRevenue) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng doanh thu</div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách Đặt phòng ({{ filteredBookings.length }})
          </h3>
        </div>
        
        <LoadingSpinner v-if="loading" message="Đang tải..." />

        <EmptyState 
          v-else-if="filteredBookings.length === 0"
          title="Không tìm thấy đặt phòng nào"
          description="Hãy thử thay đổi bộ lọc tìm kiếm để xem kết quả khác"
        />

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="booking in paginatedBookings" :key="booking.id" 
               class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ booking.stayTitle }}
                    </h4>
                    <p class="text-gray-600 dark:text-gray-400">
                      Mã đặt phòng: #{{ booking.id.slice(-8).toUpperCase() }}
                    </p>
                  </div>
                  <StatusBadge 
                    :status="booking.status" 
                    :label="getStatusText(booking.status)"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thông tin khách</p>
                    <p class="text-gray-900 dark:text-white">
                      {{ booking.guestInfo.firstName }} {{ booking.guestInfo.lastName }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ booking.guestInfo.email }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ booking.guestInfo.phone }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian</p>
                    <p class="text-gray-900 dark:text-white">
                      {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ booking.nights }} đêm • {{ booking.guests }} khách
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Đặt lúc: {{ formatDateTime(booking.createdAt) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thanh toán</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatCurrency(booking.totalPrice) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      <span v-if="booking.paymentStatus === 'fully_paid'" class="text-green-600">
                        Đã thanh toán: {{ formatCurrency(booking.totalPrice) }}
                      </span>
                      <span v-else-if="booking.paymentStatus === 'deposit_paid'" class="text-yellow-600">
                        Đã cọc: {{ formatCurrency(booking.depositAmount) }}
                      </span>
                      <span v-else class="text-red-600">
                        Chưa thanh toán
                      </span>
                    </p>
                    <p v-if="booking.remainingAmount > 0" class="text-sm text-red-600 dark:text-red-400">
                      Còn lại: {{ formatCurrency(booking.remainingAmount) }}
                    </p>
                  </div>
                </div>

                <!-- Cancellation reason display -->
                <div v-if="booking.status === 'cancelled' && booking.cancellationReason" 
                     class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                    Lý do hủy:
                  </p>
                  <p class="text-sm text-red-700 dark:text-red-300">
                    {{ booking.cancellationReason }}
                  </p>
                </div>

                <div class="flex justify-end space-x-2">
                  <ActionButton
                    @click="viewDetails(booking)"
                    variant="secondary"
                    size="sm"
                    icon="eye"
                  >
                    Xem chi tiết
                  </ActionButton>
                  
                  <!-- Chỉ admin có quyền chỉnh sửa booking -->
                  <ActionButton
                    v-if="booking.status === 'pending' && authStore.canEditBookings"
                    @click="confirmBooking(booking.id)"
                    variant="success"
                    size="sm"
                    icon="check"
                  >
                    Xác nhận
                  </ActionButton>
                  
                  <!-- Chỉ admin có quyền hủy booking -->
                  <ActionButton
                    v-if="['pending', 'confirmed'].includes(booking.status) && authStore.canEditBookings"
                    @click="cancelBooking(booking.id)"
                    variant="danger"
                    size="sm"
                    icon="x"
                  >
                    Hủy
                  </ActionButton>
                  
                  <!-- Chỉ admin có quyền hoàn thành booking -->
                  <ActionButton
                    v-if="booking.status === 'confirmed' && isPastCheckOut(booking.checkOut) && authStore.canEditBookings"
                    @click="completeBooking(booking.id)"
                    variant="primary"
                    size="sm"
                    icon="check-circle"
                  >
                    Hoàn thành
                  </ActionButton>
                  
                  <!-- Chỉ admin có quyền xóa booking đã hủy -->
                  <ActionButton
                    v-if="booking.status === 'cancelled' && authStore.canEditBookings && !authStore.isSuperAdmin"
                    @click="deleteBooking(booking.id)"
                    variant="danger"
                    size="sm"
                    icon="trash"
                  >
                    Xóa
                  </ActionButton>
                  
                  <!-- Nút thêm comment/phản hồi -->
                  <ActionButton
                    @click="openCommentModal(booking)"
                    variant="secondary"
                    size="sm"
                    icon="chat"
                  >
                    {{ booking.adminComments?.length ? 'Xem ghi chú' : 'Thêm ghi chú' }}
                  </ActionButton>
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
              {{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }} 
              trong {{ filteredBookings.length }} kết quả
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
  </div>

  <!-- Cancellation Reason Modal -->
  <div v-if="showCancellationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Hủy đặt phòng
      </h3>
      
      <div v-if="selectedBookingForCancel" class="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <strong>Khách hàng:</strong> {{ selectedBookingForCancel.guestInfo.firstName }} {{ selectedBookingForCancel.guestInfo.lastName }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <strong>Homestay:</strong> {{ selectedBookingForCancel.stayTitle }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <strong>Ngày:</strong> {{ formatDate(selectedBookingForCancel.checkIn) }} - {{ formatDate(selectedBookingForCancel.checkOut) }}
        </p>
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lý do hủy đặt phòng <span class="text-red-500">*</span>
        </label>
        <textarea 
          v-model="cancellationReason"
          placeholder="Nhập lý do hủy đặt phòng để thông báo cho khách hàng..."
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          required
        ></textarea>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Lý do này sẽ được gửi cho khách hàng qua email thông báo hủy đặt phòng.
        </p>
      </div>

      <div class="flex justify-end space-x-3">
        <button 
          @click="showCancellationModal = false"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Hủy bỏ
        </button>
        <button 
          @click="confirmCancellation"
          :disabled="!cancellationReason.trim()"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Xác nhận hủy
        </button>
      </div>
    </div>
  </div>
  
  <!-- Confirmation Modal -->
  <ConfirmationModal
    :is-open="confirmationModal.isOpen"
    :type="confirmationModal.type"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    :details="confirmationModal.details"
    @confirm="handleConfirm"
    @cancel="closeConfirmationModal"
  />

  <!-- Comment Modal -->
  <div v-if="showCommentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Ghi chú cho đặt phòng #{{ selectedBookingForComment?.id }}
          </h3>
          <button @click="showCommentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Existing Comments -->
        <div v-if="selectedBookingForComment?.adminComments?.length" class="mb-4 max-h-60 overflow-y-auto">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ghi chú hiện có:</h4>
          <div v-for="comment in selectedBookingForComment.adminComments" :key="comment.id" 
               class="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex justify-between items-start mb-1">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.adminName }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(comment.createdAt).toLocaleString('vi-VN') }}
              </span>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ comment.comment }}</p>
          </div>
        </div>
        
        <!-- Add New Comment -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thêm ghi chú mới:
            </label>
            <textarea
              v-model="newComment"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ghi chú của bạn..."
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button @click="showCommentModal = false" 
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Hủy
            </button>
            <button @click="addComment" 
                    :disabled="!newComment.trim() || commentLoading"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
              <span v-if="commentLoading">Đang lưu...</span>
              <span v-else>Lưu ghi chú</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import SuperAdminNotice from '@/components/admin/SuperAdminNotice.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import FormInput from '@/components/forms/FormInput.vue'
import type { Booking, AdminComment } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const bookings = ref<Booking[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedStatus = ref('')
const fromDate = ref('')
const toDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Confirmation modal state
const confirmationModal = ref({
  isOpen: false,
  type: 'info' as 'success' | 'danger' | 'warning' | 'info',
  title: '',
  message: '',
  details: '',
  action: null as (() => void) | null
})

// Cancellation modal state
const showCancellationModal = ref(false)
const selectedBookingForCancel = ref<Booking | null>(null)
const cancellationReason = ref('')

// Comment modal state
const showCommentModal = ref(false)
const selectedBookingForComment = ref<Booking | null>(null)
const newComment = ref('')
const commentLoading = ref(false)

const loadBookings = async () => {
  try {
    const [bookingsResponse, staysResponse, usersResponse] = await Promise.all([
      axios.get('http://localhost:3001/bookings'),
      axios.get('http://localhost:3001/stays'),
      axios.get('http://localhost:3001/users')
    ])
    
    const allBookings = bookingsResponse.data
    const allStays = staysResponse.data
    const allUsers = usersResponse.data
    
    // Map booking with stay info and user info, then filter by brand
    let filteredBookings = allBookings.map((booking: any) => {
      const stay = allStays.find((s: any) => s.id === booking.stayId)
      const user = allUsers.find((u: any) => u.id === booking.userId)
      return {
        ...booking,
        stayTitle: stay?.title || 'N/A',
        stayBrand: stay?.brand,
        guestInfo: user ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        } : {
          firstName: 'N/A',
          lastName: 'N/A',
          email: 'N/A',
          phone: 'N/A'
        }
      }
    })
    
    // Filter by brand if user is not super admin
    if (authStore.user?.brand && !authStore.isSuperAdmin) {
      filteredBookings = filteredBookings.filter((booking: any) => 
        booking.stayBrand === authStore.user?.brand
      )
    }
    
    bookings.value = filteredBookings
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loading.value = false
  }
}

const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(booking => 
      booking.stayTitle.toLowerCase().includes(query) ||
      booking.guestInfo.firstName.toLowerCase().includes(query) ||
      booking.guestInfo.lastName.toLowerCase().includes(query) ||
      booking.guestInfo.email.toLowerCase().includes(query) ||
      booking.id.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(booking => booking.status === selectedStatus.value)
  }

  if (fromDate.value) {
    filtered = filtered.filter(booking => 
      new Date(booking.createdAt) >= new Date(fromDate.value)
    )
  }

  if (toDate.value) {
    filtered = filtered.filter(booking => 
      new Date(booking.createdAt) <= new Date(toDate.value + 'T23:59:59')
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredBookings.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage)
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

const pendingBookings = computed(() => 
  filteredBookings.value.filter(booking => booking.status === 'pending').length
)

const confirmedBookings = computed(() => 
  filteredBookings.value.filter(booking => booking.status === 'confirmed').length
)

const completedBookings = computed(() => 
  filteredBookings.value.filter(booking => booking.status === 'completed').length
)

const totalRevenue = computed(() => {
  return filteredBookings.value
    .filter(booking => ['confirmed', 'completed'].includes(booking.status))
    .reduce((sum, booking) => {
      // Tính số tiền đã thanh toán thực tế
      if (booking.paymentStatus === 'fully_paid') {
        return sum + booking.totalPrice
      } else if (booking.paymentStatus === 'deposit_paid') {
        return sum + booking.depositAmount
      }
      return sum
    }, 0)
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  fromDate.value = ''
  toDate.value = ''
  currentPage.value = 1
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN')
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'pending':
      return 'Chờ xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    case 'completed':
      return 'Hoàn thành'
    default:
      return 'Không xác định'
  }
}

const isPastCheckOut = (checkOutDate: string): boolean => {
  return new Date(checkOutDate) < new Date()
}

const viewDetails = (booking: Booking) => {
  router.push(`/booking-detail/${booking.id}`)
}

// Modal helper functions
const openConfirmationModal = (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string, details: string, action: () => void) => {
  confirmationModal.value = {
    isOpen: true,
    type,
    title,
    message,
    details,
    action
  }
}

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false
  confirmationModal.value.action = null
}

const handleConfirm = () => {
  if (confirmationModal.value.action) {
    confirmationModal.value.action()
  }
  closeConfirmationModal()
}

const confirmBooking = async (bookingId: string) => {
  // Chỉ brand admin mới có quyền xác nhận booking
  if (authStore.isSuperAdmin || !authStore.user?.brand) {
    openConfirmationModal(
      'warning',
      'Không có quyền truy cập',
      'Bạn không có quyền thực hiện thao tác này.',
      'Chỉ brand admin mới có thể xác nhận booking.',
      () => {}
    )
    return
  }
  
  const booking = bookings.value.find(b => b.id === bookingId)
  const guestName = booking ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : 'N/A'
  
  openConfirmationModal(
    'success',
    'Xác nhận đặt phòng',
    `Bạn có chắc chắn muốn xác nhận đặt phòng này?`,
    `Khách: ${guestName} - Homestay: ${booking?.stayTitle}`,
    async () => {
      try {
        await axios.patch(`http://localhost:3001/bookings/${bookingId}`, {
          status: 'confirmed'
        })
        const booking = bookings.value.find(b => b.id === bookingId)
        if (booking) {
          booking.status = 'confirmed'
        }
      } catch (error) {
        console.error('Error confirming booking:', error)
        openConfirmationModal(
          'danger',
          'Lỗi xác nhận',
          'Có lỗi xảy ra khi xác nhận đặt phòng.',
          'Vui lòng thử lại sau.',
          () => {}
        )
      }
    }
  )
}

const cancelBooking = async (bookingId: string) => {
  // Chỉ brand admin mới có quyền hủy booking
  if (authStore.isSuperAdmin || !authStore.user?.brand) {
    openConfirmationModal(
      'warning',
      'Không có quyền truy cập',
      'Bạn không có quyền thực hiện thao tác này.',
      'Chỉ brand admin mới có thể hủy booking.',
      () => {}
    )
    return
  }
  
  const booking = bookings.value.find(b => b.id === bookingId)
  if (!booking) return
  
  // Mở modal nhập lý do hủy
  selectedBookingForCancel.value = booking
  cancellationReason.value = ''
  showCancellationModal.value = true
}

const confirmCancellation = async () => {
  if (!selectedBookingForCancel.value || !cancellationReason.value.trim()) {
    openConfirmationModal(
      'warning',
      'Thiếu thông tin',
      'Vui lòng nhập lý do hủy đặt phòng.',
      'Lý do hủy là bắt buộc để thông báo cho khách hàng.',
      () => {}
    )
    return
  }

  try {
    const bookingId = selectedBookingForCancel.value.id
    await axios.patch(`http://localhost:3001/bookings/${bookingId}`, {
      status: 'cancelled',
      cancellationReason: cancellationReason.value.trim()
    })
    
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.status = 'cancelled'
      booking.cancellationReason = cancellationReason.value.trim()
    }
    
    showCancellationModal.value = false
    openConfirmationModal(
      'success',
      'Hủy đặt phòng thành công',
      'Đã hủy đặt phòng và gửi thông báo cho khách hàng.',
      `Lý do hủy: ${cancellationReason.value.trim()}`,
      () => {}
    )
  } catch (error) {
    console.error('Error cancelling booking:', error)
    openConfirmationModal(
      'danger',
      'Lỗi hủy đặt phòng',
      'Có lỗi xảy ra khi hủy đặt phòng.',
      'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
      () => {}
    )
  }
}

const completeBooking = async (bookingId: string) => {
  // Chỉ brand admin mới có quyền hoàn thành booking
  if (authStore.isSuperAdmin || !authStore.user?.brand) {
    openConfirmationModal(
      'warning',
      'Không có quyền truy cập',
      'Bạn không có quyền thực hiện thao tác này.',
      'Chỉ brand admin mới có thể hoàn thành booking.',
      () => {}
    )
    return
  }
  
  const booking = bookings.value.find(b => b.id === bookingId)
  const guestName = booking ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : 'N/A'
  
  openConfirmationModal(
    'success',
    'Hoàn thành đặt phòng',
    'Bạn có chắc chắn muốn đánh dấu đặt phòng này là hoàn thành?',
    `Khách: ${guestName} - Homestay: ${booking?.stayTitle}`,
    async () => {
      try {
        await axios.patch(`http://localhost:3001/bookings/${bookingId}`, {
          status: 'completed'
        })
        const booking = bookings.value.find(b => b.id === bookingId)
        if (booking) {
          booking.status = 'completed'
        }
      } catch (error) {
        console.error('Error completing booking:', error)
        openConfirmationModal(
          'danger',
          'Lỗi hoàn thành',
          'Có lỗi xảy ra khi hoàn thành đặt phòng.',
          'Vui lòng thử lại sau.',
          () => {}
        )
      }
    }
  )
}

const deleteBooking = async (bookingId: string) => {
  // Chỉ brand admin mới có quyền xóa booking đã hủy, super admin không thể xóa
  if (authStore.isSuperAdmin || !authStore.user?.brand) {
    openConfirmationModal(
      'warning',
      'Không có quyền truy cập',
      'Bạn không có quyền thực hiện thao tác này.',
      'Chỉ brand admin mới có thể xóa booking đã hủy.',
      () => {}
    )
    return
  }
  
  const booking = bookings.value.find(b => b.id === bookingId)
  if (!booking || booking.status !== 'cancelled') {
    openConfirmationModal(
      'warning',
      'Không thể xóa',
      'Chỉ có thể xóa những đặt phòng đã bị hủy.',
      '',
      () => {}
    )
    return
  }
  
  const guestName = booking ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : 'N/A'
  
  openConfirmationModal(
    'danger',
    'Xóa đặt phòng đã hủy',
    'Bạn có chắc chắn muốn xóa vĩnh viễn đặt phòng này?',
    `Khách: ${guestName} - Homestay: ${booking.stayTitle}\nHành động này không thể hoàn tác.`,
    async () => {
      try {
        await axios.delete(`http://localhost:3001/bookings/${bookingId}`)
        
        // Remove from local state
        const index = bookings.value.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          bookings.value.splice(index, 1)
        }
        
        openConfirmationModal(
          'success',
          'Xóa thành công',
          'Đặt phòng đã được xóa vĩnh viễn.',
          '',
          () => {}
        )
      } catch (error) {
        console.error('Error deleting booking:', error)
        openConfirmationModal(
          'danger',
          'Lỗi xóa đặt phòng',
          'Có lỗi xảy ra khi xóa đặt phòng.',
          'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
          () => {}
        )
      }
    }
  )
}

// Hàm mở modal comment
const openCommentModal = (booking: Booking) => {
  selectedBookingForComment.value = booking
  newComment.value = ''
  showCommentModal.value = true
}

// Hàm thêm comment
const addComment = async () => {
  if (!selectedBookingForComment.value || !newComment.value.trim()) return
  
  commentLoading.value = true
  try {
    const comment: AdminComment = {
      id: Date.now().toString(),
      adminName: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Admin',
      adminEmail: authStore.user?.email || '',
      comment: newComment.value.trim(),
      createdAt: new Date().toISOString()
    }
    
    const updatedBooking = {
      ...selectedBookingForComment.value,
      adminComments: [...(selectedBookingForComment.value.adminComments || []), comment]
    }
    
    await axios.put(`http://localhost:3001/bookings/${selectedBookingForComment.value.id}`, updatedBooking)
    
    // Cập nhật local state
    const index = bookings.value.findIndex(b => b.id === selectedBookingForComment.value!.id)
    if (index !== -1) {
      bookings.value[index] = updatedBooking
    }
    
    showCommentModal.value = false
    newComment.value = ''
    
    openConfirmationModal(
      'success',
      'Thành công',
      'Đã thêm ghi chú thành công.',
      '',
      () => {}
    )
  } catch (error) {
    console.error('Error adding comment:', error)
    openConfirmationModal(
      'danger',
      'Lỗi thêm ghi chú',
      'Có lỗi xảy ra khi thêm ghi chú.',
      'Vui lòng thử lại sau.',
      () => {}
    )
  } finally {
    commentLoading.value = false
  }
}

onMounted(() => {
  loadBookings()
})
</script>

