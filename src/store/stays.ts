import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Stay, SearchFilters } from '@/types'

const API_BASE_URL = 'http://localhost:3001'

export const useStayStore = defineStore('stay', () => {
  const stays = ref<Stay[]>([])
  const loading = ref<boolean>(false)
  const searchFilters = ref<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 20000000], // Tăng lên 20 triệu để hiển thị tất cả
    stayType: '',
    amenities: []
  })

  const filteredStays = computed<Stay[]>(() => {
    let filtered = stays.value

    if (searchFilters.value.location) {
      filtered = filtered.filter(stay => 
        stay.location.toLowerCase().includes(searchFilters.value.location.toLowerCase()) ||
        stay.city.toLowerCase().includes(searchFilters.value.location.toLowerCase())
      )
    }

    if (searchFilters.value.stayType) {
      filtered = filtered.filter(stay => stay.type === searchFilters.value.stayType)
    }

    filtered = filtered.filter(stay => 
      stay.price >= searchFilters.value.priceRange[0] && 
      stay.price <= searchFilters.value.priceRange[1]
    )

    if (searchFilters.value.amenities.length > 0) {
      filtered = filtered.filter(stay => 
        searchFilters.value.amenities.some(amenity => 
          stay.amenities.includes(amenity)
        )
      )
    }

    return filtered
  })

  const fetchStays = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await axios.get<Stay[]>(`${API_BASE_URL}/stays`)
      stays.value = response.data
    } catch (error) {
      console.error('Error fetching stays:', error)
    } finally {
      loading.value = false
    }
  }

  const getStayById = async (id: string): Promise<Stay | null> => {
    try {
      const response = await axios.get<Stay>(`${API_BASE_URL}/stays/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching stay:', error)
      return null
    }
  }

  const updateSearchFilters = (filters: Partial<SearchFilters>): void => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  return {
    stays,
    loading,
    searchFilters,
    filteredStays,
    fetchStays,
    getStayById,
    updateSearchFilters
  }
})
