import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/store/booking'
import axios from 'axios'
import type { Booking, Stay } from '@/types'

export function useBookingDetail() {
  const route = useRoute()
  const router = useRouter()
  const bookingStore = useBookingStore()

  // State
  const booking = ref<Booking | null>(null)
  const stay = ref<Stay | null>(null)
  const loading = ref(true)
  const error = ref<string>('')

  // Computed
  const canCancel = computed(() => {
    if (!booking.value) return false
    const now = new Date()
    const checkIn = new Date(booking.value.checkIn)
    const timeDiff = checkIn.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    
    return booking.value.status === 'pending' || 
           (booking.value.status === 'confirmed' && daysDiff > 1)
  })

  // Methods
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const calculateNights = (): number => {
    if (!booking.value) return 0
    const checkIn = new Date(booking.value.checkIn)
    const checkOut = new Date(booking.value.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

  const loadBookingDetail = async () => {
    const bookingId = route.params.id as string
    
    try {
      loading.value = true
      error.value = ''

      // Load all bookings first
      await bookingStore.getBookings()
      
      // Find the specific booking
      booking.value = bookingStore.bookings.find(b => b.id === bookingId) || null
      
      if (!booking.value) {
        error.value = 'Không tìm thấy thông tin đặt phòng với ID này.'
        return
      }

      // Load stay information
      await loadStayInfo(booking.value.stayId)
      
    } catch (err) {
      console.error('Error fetching booking:', err)
      error.value = 'Có lỗi xảy ra khi tải thông tin đặt phòng.'
    } finally {
      loading.value = false
    }
  }

  const loadStayInfo = async (stayId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/stays/${stayId}`)
      stay.value = response.data
    } catch (stayError) {
      console.error('Error loading stay:', stayError)
      // Keep booking info even if stay loading fails
    }
  }

  const payRemaining = () => {
    // TODO: Implement payment for remaining amount
    alert('Chức năng thanh toán số tiền còn lại sẽ được triển khai sau.')
  }

  const cancelBooking = async () => {
    if (!booking.value || !confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) return
    
    try {
      // TODO: Implement booking cancellation
      alert('Chức năng hủy đặt phòng sẽ được triển khai sau.')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Có lỗi xảy ra khi hủy đặt phòng.')
    }
  }

  const goHome = () => {
    router.push('/')
  }

  return {
    // State
    booking,
    stay,
    loading,
    error,
    
    // Computed
    canCancel,
    
    // Methods
    formatDate,
    formatCurrency,
    calculateNights,
    getStatusText,
    getPaymentStatusText,
    loadBookingDetail,
    payRemaining,
    cancelBooking,
    goHome
  }
}
