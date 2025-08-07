import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useStayStore } from '@/store/stays'
import axios from 'axios'

export function useEditHomestay() {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const stayStore = useStayStore()

  // State
  const loadingData = ref(true)
  const loading = ref(false)
  const loadError = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  const homestayData = ref<any>(null)

  const form = ref({
    title: '',
    description: '',
    location: '',
    price: 0,
    type: '',
    images: [''],
    amenities: [] as string[],
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    available: true
  })

  // Available amenities list
  const availableAmenities = [
    { value: 'wifi', label: 'WiFi miễn phí' },
    { value: 'parking', label: 'Chỗ đậu xe' },
    { value: 'pool', label: 'Hồ bơi' },
    { value: 'kitchen', label: 'Nhà bếp' },
    { value: 'aircon', label: 'Điều hòa' },
    { value: 'tv', label: 'TV' },
    { value: 'washer', label: 'Máy giặt' },
    { value: 'balcony', label: 'Ban công' },
    { value: 'gym', label: 'Phòng gym' },
    { value: 'breakfast', label: 'Bữa sáng' },
    { value: 'pets', label: 'Cho phép thú cưng' },
    { value: 'smoking', label: 'Cho phép hút thuốc' }
  ]

  // Computed
  const canSubmit = computed(() => {
    return Boolean(form.value.title && 
                   form.value.description && 
                   form.value.location && 
                   form.value.price > 0 && 
                   form.value.type && 
                   form.value.guests > 0 && 
                   form.value.bedrooms > 0 && 
                   form.value.bathrooms > 0 && 
                   form.value.images.every(img => img.trim() !== ''))
  })

  // Methods
  const addImage = () => {
    form.value.images.push('')
  }

  const removeImage = (index: number) => {
    if (form.value.images.length > 1) {
      form.value.images.splice(index, 1)
    }
  }

  const getAmenityLabel = (value: string): string => {
    const amenity = availableAmenities.find(a => a.value === value)
    return amenity ? amenity.label : value
  }

  const loadHomestay = async () => {
    try {
      loadingData.value = true
      const homestayId = route.params.id as string
      const response = await axios.get(`http://localhost:3001/stays/${homestayId}`)
      homestayData.value = response.data
      
      // Fill form with existing data
      form.value = {
        title: homestayData.value.title || '',
        description: homestayData.value.description || '',
        location: homestayData.value.location || '',
        price: homestayData.value.price || 0,
        type: homestayData.value.type || '',
        images: homestayData.value.images?.length ? [...homestayData.value.images] : [''],
        amenities: homestayData.value.amenities?.map((amenity: string) => {
          // Convert back from label to value if needed
          const found = availableAmenities.find(a => a.label === amenity)
          return found ? found.value : amenity
        }) || [],
        guests: homestayData.value.maxGuests || 1,
        bedrooms: homestayData.value.bedrooms || 1,
        bathrooms: homestayData.value.bathrooms || 1,
        available: homestayData.value.available !== false
      }
    } catch (error: any) {
      console.error('Error loading homestay:', error)
      loadError.value = 'Không thể tải thông tin homestay. Vui lòng thử lại sau.'
    } finally {
      loadingData.value = false
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const homestayId = route.params.id as string
      const updatedHomestay = {
        ...homestayData.value,
        title: form.value.title,
        description: form.value.description,
        location: form.value.location,
        city: form.value.location,
        price: form.value.price,
        type: form.value.type,
        images: form.value.images.filter(img => img.trim() !== ''),
        amenities: form.value.amenities.map(amenity => getAmenityLabel(amenity)),
        maxGuests: form.value.guests,
        bedrooms: form.value.bedrooms,
        bathrooms: form.value.bathrooms,
        available: form.value.available,
        // Keep existing data
        brand: homestayData.value.brand || authStore.user?.brand || 'Default Brand',
        host: homestayData.value.host || {
          name: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Admin System',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          verified: true
        },
        rating: homestayData.value.rating || 0,
        reviewCount: homestayData.value.reviewCount || 0,
        unavailableDates: homestayData.value.unavailableDates || []
      }

      await axios.put(`http://localhost:3001/stays/${homestayId}`, updatedHomestay)

      // Refresh stays store
      await stayStore.fetchStays()

      successMessage.value = 'Homestay đã được cập nhật thành công!'
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/stays')
      }, 2000)

    } catch (error: any) {
      console.error('Error updating homestay:', error)
      errorMessage.value = error.message || 'Có lỗi xảy ra khi cập nhật homestay'
    } finally {
      loading.value = false
    }
  }

  const initializeEdit = async () => {
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
      router.push('/login')
      return
    }
    await loadHomestay()
  }

  return {
    // State
    loadingData,
    loading,
    loadError,
    errorMessage,
    successMessage,
    homestayData,
    form,
    availableAmenities,
    
    // Computed
    canSubmit,
    
    // Methods
    addImage,
    removeImage,
    getAmenityLabel,
    loadHomestay,
    handleSubmit,
    initializeEdit
  }
}
