import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStayStore } from '@/store/stays'
import { useBookingStore } from '@/store/booking'
import { useAuthStore } from '@/store/auth'
import type { Stay } from '@/types'

export function useBooking() {
  const route = useRoute()
  const router = useRouter()
  const stayStore = useStayStore()
  const bookingStore = useBookingStore()
  const authStore = useAuthStore()

  // State
  const stay = ref<Stay | null>(null)
  const loading = ref(true)
  const submitting = ref(false)
  const acceptTerms = ref(false)
  const showSuccessModal = ref(false)

  // Get query params
  const checkIn = route.query.checkIn as string
  const checkOut = route.query.checkOut as string
  const guests = parseInt(route.query.guests as string) || 1

  const bookingData = reactive({
    stayId: route.params.id as string,
    stayTitle: '',
    userId: authStore.user?.id || '',
    guestInfo: {
      firstName: authStore.user?.firstName || '',
      lastName: authStore.user?.lastName || '',
      email: authStore.user?.email || '',
      phone: authStore.user?.phone || ''
    },
    checkIn,
    checkOut,
    guests,
    nights: 0,
    totalPrice: 0,
    specialRequests: ''
  })

  // Computed
  const nights = computed(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  const serviceFee = computed(() => {
    if (!stay.value) return 0
    return Math.round(stay.value.price * nights.value * 0.1) // 10% service fee
  })

  const totalAmount = computed(() => {
    if (!stay.value) return 0
    return (stay.value.price * nights.value) + serviceFee.value
  })

  const canSubmit = computed(() => {
    return Boolean(stay.value && 
                   acceptTerms.value && 
                   bookingData.guestInfo.firstName &&
                   bookingData.guestInfo.lastName &&
                   bookingData.guestInfo.email &&
                   bookingData.guestInfo.phone &&
                   !submitting.value)
  })

  // Methods
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit.value || !stay.value) return
    
    submitting.value = true
    
    try {
      // Update booking data with calculated values and stay object
      bookingData.totalPrice = totalAmount.value
      bookingData.nights = nights.value
      bookingData.stayTitle = stay.value.title
      
      // Add full stay object for new format compatibility
      const bookingDataWithStay = {
        ...bookingData,
        stay: stay.value
      }
      
      await bookingStore.createBooking(bookingDataWithStay)
      showSuccessModal.value = true
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.')
    } finally {
      submitting.value = false
    }
  }

  const goToHome = () => {
    router.push('/')
  }

  const goBack = () => {
    router.go(-1)
  }

  const closeSuccessModal = () => {
    showSuccessModal.value = false
  }

  const validateAccess = () => {
    // Check authentication
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return false
    }
    
    if (!checkIn || !checkOut) {
      router.push(`/stay/${route.params.id}`)
      return false
    }
    
    return true
  }

  const loadStayData = async () => {
    if (!validateAccess()) return

    loading.value = true
    
    try {
      const stayId = route.params.id as string
      stay.value = await stayStore.getStayById(stayId)
      
      // Update booking data with stay title
      if (stay.value) {
        bookingData.stayTitle = stay.value.title
        bookingData.nights = nights.value
      }
    } catch (error) {
      console.error('Error loading stay:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const initializeBooking = async () => {
    await loadStayData()
  }

  return {
    // State
    stay,
    loading,
    submitting,
    acceptTerms,
    showSuccessModal,
    bookingData,
    checkIn,
    checkOut,
    guests,
    
    // Computed
    nights,
    serviceFee,
    totalAmount,
    canSubmit,
    
    // Methods
    formatPrice,
    formatDate,
    handleSubmit,
    goToHome,
    goBack,
    closeSuccessModal,
    initializeBooking
  }
}
