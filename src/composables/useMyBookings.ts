import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/store/booking'
import { useAuthStore } from '@/store/auth'
import type { Booking } from '@/types'

export function useMyBookings() {
  const router = useRouter()
  const bookingStore = useBookingStore()
  const authStore = useAuthStore()

  // State
  const loading = ref<boolean>(true)
  const activeTab = ref<string>('all')
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(6)

  // Computed
  const userBookings = computed(() => {
    if (!authStore.user?.id) {
      return []
    }
    
    const filtered = bookingStore.bookings.filter(booking => {
      // Match by userId when available. Fall back to guest email for older bookings
      const matchById = booking.userId && booking.userId === authStore.user?.id
      const matchByEmail = booking.guestInfo?.email && booking.guestInfo.email === authStore.user?.email
      const match = Boolean(matchById || matchByEmail)
      if (!match) {
        // no match for this booking
      }
      return match
    })
    
    return filtered
  })

  const filteredBookings = computed(() => {
    if (activeTab.value === 'all') return userBookings.value
    return userBookings.value.filter(booking => booking.status === activeTab.value)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredBookings.value.length / itemsPerPage.value)
  )

  const paginatedBookings = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredBookings.value.slice(start, end)
  })

  const hasBookings = computed(() => userBookings.value.length > 0)
  const hasFilteredResults = computed(() => filteredBookings.value.length > 0)

  const tabs = computed(() => [
    { key: 'all', label: 'Tất cả', count: userBookings.value.length },
    { 
      key: 'pending', 
      label: 'Chờ xác nhận', 
      count: userBookings.value.filter(b => b.status === 'pending').length 
    },
    { 
      key: 'confirmed', 
      label: 'Đã xác nhận', 
      count: userBookings.value.filter(b => b.status === 'confirmed').length 
    },
    { 
      key: 'completed', 
      label: 'Hoàn thành', 
      count: userBookings.value.filter(b => b.status === 'completed').length 
    },
    { 
      key: 'cancelled', 
      label: 'Đã hủy', 
      count: userBookings.value.filter(b => b.status === 'cancelled').length 
    }
  ])

  // Stats computed
  const totalPaidAmount = computed(() => {
    const total = filteredBookings.value.reduce((sum, booking) => {
      if (booking.paymentStatus === 'fully_paid') {
        return sum + booking.totalPrice
      } else if (booking.paymentStatus === 'deposit_paid' && booking.depositAmount) {
        return sum + booking.depositAmount
      }
      return sum
    }, 0)
    return formatCurrency(total)
  })

  const pendingBookingsCount = computed(() => 
    userBookings.value.filter(b => b.status === 'pending').length
  )

  const upcomingBookingsCount = computed(() => {
    const today = new Date()
    return userBookings.value.filter(b => 
      b.status === 'confirmed' && new Date(b.checkIn) > today
    ).length
  })

  const getActiveTabLabel = computed(() => {
    const tab = tabs.value.find(t => t.key === activeTab.value)
    return tab ? tab.label : 'Tất cả'
  })

  // Methods
  const loadBookings = async () => {
    try {
      loading.value = true
      await bookingStore.getBookings()
      // bookings loaded
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      loading.value = false
    }
  }

  const handleTabChange = (tab: string) => {
    activeTab.value = tab
    currentPage.value = 1 // Reset to first page when changing tabs
  }

  const handlePageChange = (page: number) => {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const viewBookingDetail = (booking: Booking) => {
    router.push(`/booking-detail/${booking.id}`)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'cancelled':
        return 'red'
      case 'completed':
        return 'blue'
      default:
        return 'gray'
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
      default:
        return 'Không xác định'
    }
  }

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

  return {
    // State
    loading,
    activeTab,
    currentPage,
    itemsPerPage,
    
    // Computed
    userBookings,
    filteredBookings,
    paginatedBookings,
    totalPages,
    hasBookings,
    hasFilteredResults,
    tabs,
    totalPaidAmount,
    pendingBookingsCount,
    upcomingBookingsCount,
    
    // Methods
    loadBookings,
    handleTabChange,
    handlePageChange,
    viewBookingDetail,
    getStatusColor,
    getStatusText,
    formatDate,
    formatCurrency,
    getActiveTabLabel
  }
}
