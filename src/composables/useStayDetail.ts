import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStayStore } from '@/store/stays'
import { useAuthStore } from '@/store/auth'
import { useRatings } from '@/composables/useRatings'
import type { Stay, Booking } from '@/types'

export function useStayDetail() {
  const route = useRoute()
  const router = useRouter()
  const stayStore = useStayStore()
  const authStore = useAuthStore()
  const { loadReviews, getStayRating } = useRatings()

  // State
  const stay = ref<Stay | null>(null)
  const loading = ref<boolean>(true)
  const showBookingModal = ref<boolean>(false)

  // Tính toán rating thực tế từ reviews
  const actualRating = computed(() => 
    stay.value ? getStayRating(stay.value.id) : { roundedRating: 0, totalReviews: 0 }
  )

  const bookingForm = reactive({
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  // Computed
  const nights = computed(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0
    const checkIn = new Date(bookingForm.checkIn)
    const checkOut = new Date(bookingForm.checkOut)
    const diffTime = checkOut.getTime() - checkIn.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  const totalPrice = computed(() => {
    if (!stay.value || nights.value <= 0) return 0
    return stay.value.price * nights.value
  })

  const canBook = computed(() => {
    return Boolean(bookingForm.checkIn && 
                   bookingForm.checkOut && 
                   bookingForm.guests > 0 && 
                   nights.value > 0 &&
                   authStore.isAuthenticated)
  })

  // Methods
  const loadStayDetail = async () => {
    const stayId = route.params.id as string
    
    try {
      loading.value = true
      await stayStore.fetchStays()
      
      stay.value = stayStore.stays.find(s => s.id === stayId) || null
      
      if (stay.value) {
        await loadReviews()
      }
    } catch (error) {
      console.error('Error loading stay:', error)
    } finally {
      loading.value = false
    }
  }

  const openBookingModal = () => {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }
    showBookingModal.value = true
  }

  const closeBookingModal = () => {
    showBookingModal.value = false
  }

  const handleBookingCreated = (booking: Booking) => {
    router.push(`/booking-detail/${booking.id}`)
  }

  const resetForm = () => {
    bookingForm.checkIn = ''
    bookingForm.checkOut = ''
    bookingForm.guests = 1
  }

  return {
    // State
    stay,
    loading,
    showBookingModal,
    bookingForm,
    
    // Computed
    actualRating,
    nights,
    totalPrice,
    canBook,
    
    // Methods
    loadStayDetail,
    openBookingModal,
    closeBookingModal,
    handleBookingCreated,
    resetForm
  }
}
