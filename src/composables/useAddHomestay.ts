import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useStayStore } from '@/store/stays'
import axios from 'axios'

export function useAddHomestay() {
  const router = useRouter()
  const authStore = useAuthStore()
  const stayStore = useStayStore()

  // State
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

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

  const resetForm = () => {
    form.value = {
      title: '',
      description: '',
      location: '',
      price: 0,
      type: '',
      images: [''],
      amenities: [],
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      available: true
    }
    errorMessage.value = ''
    successMessage.value = ''
  }

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const newHomestay = {
        id: `stay_${Date.now()}`,
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
        brand: authStore.user?.brand || 'Default Brand',
        host: {
          name: authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Admin System',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          verified: true
        },
        rating: 0,
        reviewCount: 0,
        unavailableDates: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await axios.post('http://localhost:3001/stays', newHomestay)

      // Refresh stays store
      await stayStore.fetchStays()

      successMessage.value = 'Homestay đã được tạo thành công!'
      
      // Reset form after success
      setTimeout(() => {
        resetForm()
        router.push('/admin/stays')
      }, 2000)

    } catch (error: any) {
      console.error('Error creating homestay:', error)
      errorMessage.value = error.message || 'Có lỗi xảy ra khi tạo homestay'
    } finally {
      loading.value = false
    }
  }

  const initializeAdd = () => {
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
      router.push('/login')
      return
    }
    resetForm()
  }

  return {
    // State
    loading,
    errorMessage,
    successMessage,
    form,
    availableAmenities,
    
    // Computed
    canSubmit,
    
    // Methods
    addImage,
    removeImage,
    resetForm,
    handleSubmit,
    initializeAdd
  }
}
