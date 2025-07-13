<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Đặt phòng của tôi
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Quản lý và theo dõi tất cả đặt phòng của bạn
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
                {{ getBookingCount(tab.key) }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải danh sách đặt phòng...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookings.length === 0" class="text-center py-12">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <HomeIcon class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ activeFilter === 'all' ? 'Chưa có đặt phòng nào' : `Không có đặt phòng ${getFilterLabel(activeFilter)}` }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ activeFilter === 'all' ? 'Hãy khám phá những homestay tuyệt vời và đặt phòng ngay!' : 'Thử chuyển sang tab khác để xem các đặt phòng khác.' }}
        </p>
        <RouterLink to="/stays" class="btn-primary">
          Tìm homestay
        </RouterLink>
      </div>

      <!-- Booking List -->
      <div v-else class="space-y-6">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <!-- Stay Info -->
              <div class="flex space-x-4 flex-1">
                <img
                  v-if="booking.stayImages && booking.stayImages.length > 0"
                  :src="booking.stayImages[0]"
                  :alt="booking.stayTitle"
                  class="w-24 h-24 object-cover rounded-lg"
                />
                <div v-else class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <HomeIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ booking.stayTitle || 'Homestay' }}
                      </h3>
                      <p class="text-gray-600 dark:text-gray-400">
                        {{ booking.stayLocation }}
                      </p>
                    </div>
                    <div class="text-right">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getStatusClass(booking.status)">
                        {{ getStatusText(booking.status) }}
                      </span>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        #{{ booking.id }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Booking Details -->
                  <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Nhận phòng</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ formatDate(booking.startDate || booking.checkIn) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Trả phòng</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ formatDate(booking.endDate || booking.checkOut) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Khách</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ booking.guests }} người
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">Tổng tiền</p>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ formatCurrency(booking.totalPrice) }}
                      </p>
                    </div>
                  </div>

                  <!-- Payment Status -->
                  <div class="mt-3 flex items-center justify-between">
                    <div class="text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Thanh toán:</span>
                      <span class="ml-1 font-medium"
                            :class="booking.paymentStatus === 'fully_paid' ? 'text-green-600' : 'text-yellow-600'">
                        {{ getPaymentStatusText(booking.paymentStatus) }}
                      </span>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="viewBookingDetail(booking.id)"
                        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Xem chi tiết
                      </button>
                      <span class="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        v-if="canCancelBooking(booking)"
                        @click="cancelBooking(booking)"
                        class="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {{ booking.cancellationRequest?.status === 'pending' ? 'Đang chờ xử lý hủy' : 'Hủy đặt phòng' }}
                      </button>
                      <button
                        v-else-if="booking.remainingAmount && booking.remainingAmount > 0 && booking.paymentStatus !== 'fully_paid'"
                        @click="payRemaining(booking)"
                        class="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Thanh toán còn lại
                      </button>
                    </div>
                  </div>

                  <!-- Cancellation Reason -->
                  <div v-if="booking.status === 'cancelled' && booking.cancellationReason" 
                       class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                      Lý do hủy:
                    </p>
                    <p class="text-sm text-red-700 dark:text-red-300">
                      {{ booking.cancellationReason }}
                    </p>
                  </div>

                  <!-- Cancellation Request Status -->
                  <div v-if="booking.cancellationRequest" 
                       class="mt-3 p-3 rounded-lg border"
                       :class="{
                         'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800': booking.cancellationRequest.status === 'pending',
                         'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': booking.cancellationRequest.status === 'approved',
                         'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800': booking.cancellationRequest.status === 'rejected'
                       }">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium"
                           :class="{
                             'text-yellow-800 dark:text-yellow-400': booking.cancellationRequest.status === 'pending',
                             'text-green-800 dark:text-green-400': booking.cancellationRequest.status === 'approved',
                             'text-red-800 dark:text-red-400': booking.cancellationRequest.status === 'rejected'
                           }">
                          {{ booking.cancellationRequest.status === 'pending' ? 'Yêu cầu hủy đang chờ xử lý' :
                             booking.cancellationRequest.status === 'approved' ? 'Yêu cầu hủy đã được chấp nhận' :
                             'Yêu cầu hủy bị từ chối' }}
                        </p>
                        <p class="text-xs"
                           :class="{
                             'text-yellow-600 dark:text-yellow-300': booking.cancellationRequest.status === 'pending',
                             'text-green-600 dark:text-green-300': booking.cancellationRequest.status === 'approved',
                             'text-red-600 dark:text-red-300': booking.cancellationRequest.status === 'rejected'
                           }">
                          Gửi lúc: {{ formatDate(booking.cancellationRequest.requestedAt) }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-medium"
                           :class="{
                             'text-yellow-800 dark:text-yellow-400': booking.cancellationRequest.status === 'pending',
                             'text-green-800 dark:text-green-400': booking.cancellationRequest.status === 'approved',
                             'text-red-800 dark:text-red-400': booking.cancellationRequest.status === 'rejected'
                           }">
                          {{ formatCurrency(booking.cancellationRequest.refundAmount) }}
                        </p>
                        <p class="text-xs"
                           :class="{
                             'text-yellow-600 dark:text-yellow-300': booking.cancellationRequest.status === 'pending',
                             'text-green-600 dark:text-green-300': booking.cancellationRequest.status === 'approved',
                             'text-red-600 dark:text-red-300': booking.cancellationRequest.status === 'rejected'
                           }">
                          Số tiền hoàn
                        </p>
                      </div>
                    </div>
                    <div class="mt-2">
                      <p class="text-sm"
                         :class="{
                           'text-yellow-700 dark:text-yellow-300': booking.cancellationRequest.status === 'pending',
                           'text-green-700 dark:text-green-300': booking.cancellationRequest.status === 'approved',
                           'text-red-700 dark:text-red-300': booking.cancellationRequest.status === 'rejected'
                         }">
                        <span class="font-medium">Lý do:</span> {{ booking.cancellationRequest.reason }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancellation Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showCancelModal"
      type="warning"
      title="Xác nhận hủy đặt phòng"
      :message="`Bạn có chắc chắn muốn hủy đặt phòng #${selectedBooking?.id} tại ${selectedBooking?.stayTitle}?`"
      details="Sau khi hủy, bạn có thể được hoàn lại một phần tiền đặt cọc tùy theo chính sách của homestay."
      confirmText="Hủy đặt phòng"
      cancelText="Không hủy"
      @confirm="confirmCancelBooking"
      @cancel="closeCancelModal"
    />

    <!-- Cancellation Reason Modal -->
    <div v-if="showReasonModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeReasonModal"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Lý do hủy đặt phòng
            </h3>
          </div>
          <div class="px-6 py-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Vui lòng cho biết lý do hủy đặt phòng để chúng tôi có thể cải thiện dịch vụ:
            </p>
            <textarea
              v-model="cancellationReason"
              placeholder="Nhập lý do hủy đặt phòng..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end space-x-3">
            <button
              @click="closeReasonModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="submitCancellation"
              :disabled="!cancellationReason.trim() || cancelling"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {{ cancelling ? 'Đang hủy...' : 'Xác nhận hủy' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <ConfirmationModal
      :isOpen="showSuccessModal"
      type="success"
      title="Gửi yêu cầu hủy thành công"
      message="Yêu cầu hủy đặt phòng của bạn đã được gửi đi. Admin sẽ xem xét và phản hồi trong vòng 24 giờ. Bạn sẽ nhận được thông báo qua email khi có kết quả."
      confirmText="Đóng"
      @confirm="closeSuccessModal"
      @cancel="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { cancellationService } from '@/services/cancellation.service'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import axios from 'axios'

interface BookingData {
  id: string
  stayId: string
  userId?: string
  startDate?: string
  endDate?: string
  checkIn?: string
  checkOut?: string
  guests: number
  totalPrice: number
  depositAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded'
  createdAt: string
  cancellationReason?: string
  stayTitle?: string
  stayLocation?: string
  stayImages?: string[]
  remainingAmount?: number
  stay?: any // For new booking format
  guestInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  // Add cancellation request info
  cancellationRequest?: {
    id: string
    status: 'pending' | 'approved' | 'rejected'
    reason: string
    requestedAt: string
    refundAmount: number
  }
}

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const bookings = ref<BookingData[]>([])
const activeFilter = ref<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')

// Cancellation modal states
const showCancelModal = ref(false)
const showReasonModal = ref(false)
const showSuccessModal = ref(false)
const selectedBooking = ref<BookingData | null>(null)
const cancellationReason = ref('')
const cancelling = ref(false)

const filterTabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' }
] as const

const userBookings = computed(() => {
  if (!authStore.user) return []
  
  return bookings.value.filter(booking => {
    // Priority 1: Check guestInfo.email
    if (booking.guestInfo?.email) {
      return booking.guestInfo.email === authStore.user?.email
    }
    
    // Priority 2: Check userId 
    if (booking.userId) {
      return booking.userId === authStore.user?.id
    }
    
    return false
  })
})

const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') {
    return userBookings.value
  }
  return userBookings.value.filter(booking => booking.status === activeFilter.value)
})

const getBookingCount = (filter: string): number => {
  if (filter === 'all') return userBookings.value.length
  return userBookings.value.filter(booking => booking.status === filter).length
}

const loadBookings = async () => {
  try {
    const [bookingsResponse, staysResponse, usersResponse, cancellationRequestsResponse] = await Promise.all([
      axios.get('http://localhost:3001/bookings'),
      axios.get('http://localhost:3001/stays'),
      axios.get('http://localhost:3001/users'),
      axios.get('http://localhost:3001/cancellation-requests')
    ])
    
    const allBookings = bookingsResponse.data
    const allStays = staysResponse.data
    const allUsers = usersResponse.data
    const allCancellationRequests = cancellationRequestsResponse.data
    
    // Map bookings with stay and user info
    bookings.value = allBookings.map((booking: any) => {
      let stay, user, guestInfo
      
      // Handle new format with embedded stay object
      if (booking.stay) {
        stay = booking.stay
        guestInfo = booking.guestInfo
      } else {
        // Handle old format with stayId and userId
        stay = allStays.find((s: any) => s.id === booking.stayId)
        user = allUsers.find((u: any) => u.id === booking.userId)
        guestInfo = user ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        } : booking.guestInfo // Preserve existing guestInfo if no user found
      }
      
      // Find cancellation request for this booking
      const cancellationRequest = allCancellationRequests.find((req: any) => req.bookingId === booking.id)
      
      return {
        ...booking,
        stayTitle: stay?.title || 'Homestay không tìm thấy',
        stayLocation: stay ? `${stay.location}, ${stay.city}` : '',
        stayImages: stay?.images || [],
        remainingAmount: booking.remainingAmount || (booking.totalPrice - (booking.depositAmount || 0)),
        guestInfo: guestInfo,
        // Normalize date fields
        startDate: booking.startDate || booking.checkIn,
        endDate: booking.endDate || booking.checkOut,
        // Add cancellation request info
        cancellationRequest: cancellationRequest ? {
          id: cancellationRequest.id,
          status: cancellationRequest.status,
          reason: cancellationRequest.reason,
          requestedAt: cancellationRequest.requestedAt,
          refundAmount: cancellationRequest.refundAmount
        } : undefined
      }
    })
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loading.value = false
  }
}

const getFilterLabel = (filter: string): string => {
  const tab = filterTabs.find(t => t.key === filter)
  return tab ? tab.label.toLowerCase() : ''
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
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
    case 'deposit_paid':
      return 'Đã đặt cọc'
    default:
      return 'Không xác định'
  }
}

const getPaymentStatusText = (paymentStatus: string): string => {
  switch (paymentStatus) {
    case 'fully_paid':
      return 'Đã thanh toán đầy đủ'
    case 'deposit_paid':
      return 'Đã đặt cọc'
    case 'unpaid':
      return 'Chưa thanh toán'
    case 'refunded':
      return 'Đã hoàn tiền'
    default:
      return 'Không xác định'
  }
}

const canCancelBooking = (booking: BookingData): boolean => {
  // Cannot cancel if already cancelled
  if (booking.status === 'cancelled') return false
  
  // Cannot cancel if there's already a pending cancellation request
  if (booking.cancellationRequest && booking.cancellationRequest.status === 'pending') return false
  
  // Cannot cancel if cancellation request was rejected
  if (booking.cancellationRequest && booking.cancellationRequest.status === 'rejected') return false
  
  const startDate = booking.startDate || booking.checkIn
  if (!startDate) return false
  
  const now = new Date()
  const checkIn = new Date(startDate)
  const timeDiff = checkIn.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return booking.status === 'pending' || 
         (booking.status === 'confirmed' && daysDiff > 1)
}

const viewBookingDetail = (bookingId: string) => {
  router.push(`/booking-detail/${bookingId}`)
}

const cancelBooking = (booking: BookingData) => {
  selectedBooking.value = booking
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedBooking.value = null
}

const confirmCancelBooking = () => {
  showCancelModal.value = false
  showReasonModal.value = true
}

const closeReasonModal = () => {
  showReasonModal.value = false
  selectedBooking.value = null
  cancellationReason.value = ''
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  selectedBooking.value = null
}

const submitCancellation = async () => {
  if (!selectedBooking.value || !cancellationReason.value.trim() || !authStore.user) return
  
  cancelling.value = true
  
  try {
    // Create cancellation request instead of cancelling directly
    const cancellationRequest = await cancellationService.createCancellationRequest(
      selectedBooking.value.id,
      authStore.user.id,
      cancellationReason.value.trim(),
      selectedBooking.value,
      selectedBooking.value.guestInfo || {
        firstName: authStore.user.firstName,
        lastName: authStore.user.lastName,
        email: authStore.user.email,
        phone: authStore.user.phone || ''
      }
    )
    
    // Update local booking data with cancellation request info
    const bookingIndex = bookings.value.findIndex(b => b.id === selectedBooking.value!.id)
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].cancellationRequest = {
        id: cancellationRequest.id,
        status: cancellationRequest.status,
        reason: cancellationRequest.reason,
        requestedAt: cancellationRequest.requestedAt,
        refundAmount: cancellationRequest.refundAmount
      }
    }
    
    // Close reason modal and show success modal
    showReasonModal.value = false
    cancellationReason.value = ''
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Error creating cancellation request:', error)
    alert('Có lỗi xảy ra khi gửi yêu cầu hủy đặt phòng. Vui lòng thử lại!')
  } finally {
    cancelling.value = false
  }
}

const payRemaining = (booking: BookingData) => {
  // TODO: Implement payment for remaining amount
  const remaining = booking.remainingAmount || 0
  alert(`Thanh toán ${formatCurrency(remaining)} còn lại cho đặt phòng #${booking.id}`)
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await loadBookings()
})
</script>
