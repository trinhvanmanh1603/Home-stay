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
                        Hủy đặt phòng
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { HomeIcon } from '@heroicons/vue/24/outline'
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
}

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const bookings = ref<BookingData[]>([])
const activeFilter = ref<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')

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
    // Handle both old and new booking formats
    const userMatches = booking.userId === authStore.user?.id || 
                       booking.guestInfo?.email === authStore.user?.email
    return userMatches
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
    const [bookingsResponse, staysResponse, usersResponse] = await Promise.all([
      axios.get('http://localhost:3001/bookings'),
      axios.get('http://localhost:3001/stays'),
      axios.get('http://localhost:3002/users')
    ])
    
    const allBookings = bookingsResponse.data
    const allStays = staysResponse.data
    const allUsers = usersResponse.data
    
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
        } : null
      }
      
      return {
        ...booking,
        stayTitle: stay?.title || 'Homestay không tìm thấy',
        stayLocation: stay ? `${stay.location}, ${stay.city}` : '',
        stayImages: stay?.images || [],
        remainingAmount: booking.remainingAmount || (booking.totalPrice - (booking.depositAmount || 0)),
        guestInfo: guestInfo,
        // Normalize date fields
        startDate: booking.startDate || booking.checkIn,
        endDate: booking.endDate || booking.checkOut
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

const cancelBooking = async (booking: BookingData) => {
  if (!confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) return
  
  try {
    console.log('Cancelling booking:', booking.id)
    // TODO: Implement booking cancellation in store
    alert('Chức năng hủy đặt phòng sẽ được triển khai sau.')
  } catch (error) {
    console.error('Error cancelling booking:', error)
    alert('Có lỗi xảy ra khi hủy đặt phòng.')
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
