import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStayStore } from '@/store/stays'
import type { Stay, SearchFilters } from '@/types'

export function useStayList() {
  const route = useRoute()
  const router = useRouter()
  const stayStore = useStayStore()

  // State
  const loading = ref<boolean>(true)
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(12)
  const showFilters = ref<boolean>(false)
  const showMobileFilters = ref<boolean>(false)

  // Computed - sử dụng filteredStays từ store
  const filteredStays = computed(() => stayStore.filteredStays)
  
  const totalPages = computed(() => 
    Math.ceil(filteredStays.value.length / itemsPerPage.value)
  )
  
  const paginatedStays = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredStays.value.slice(start, end)
  })

  const hasResults = computed(() => filteredStays.value.length > 0)

  // Lấy filters từ store
  const filters = computed(() => stayStore.searchFilters)

  // Methods
  const loadStays = async () => {
    try {
      loading.value = true
      await stayStore.fetchStays()
      
      // Apply search filters from query params
      if (route.query.location) {
        stayStore.updateSearchFilters({
          location: route.query.location as string
        })
      }
      
    } catch (error) {
      console.error('Error loading stays:', error)
    } finally {
      loading.value = false
    }
  }

  const handleSearch = (filters: any) => {
    stayStore.updateSearchFilters(filters)
    currentPage.value = 1 // Reset to first page when searching
    
    // Update URL with search params
    router.push({
      query: {
        ...route.query,
        location: filters.location || undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
        guests: filters.guests || undefined
      }
    })
  }

  const handlePageChange = (page: number) => {
    currentPage.value = page
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStayClick = (stay: Stay) => {
    router.push(`/stays/${stay.id}`)
  }

  const resetFilters = () => {
    // Sử dụng updateSearchFilters từ store thay vì logic riêng
    stayStore.updateSearchFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceRange: [0, 20000000],
      stayType: '',
      amenities: []
    })
    currentPage.value = 1
    router.push({ query: {} })
  }

  const applyFilters = (newFilters: Partial<SearchFilters>): void => {
    stayStore.updateSearchFilters(newFilters)
    currentPage.value = 1 // Reset to first page when filters change
  }

  const toggleFilters = (): void => {
    showFilters.value = !showFilters.value
  }

  const toggleMobileFilters = (): void => {
    showMobileFilters.value = !showMobileFilters.value
  }

  return {
    // State
    loading,
    currentPage,
    itemsPerPage,
    showFilters,
    showMobileFilters,
    filters,
    
    // Computed
    filteredStays,
    paginatedStays,
    totalPages,
    hasResults,
    
    // Methods
    loadStays,
    handleSearch,
    handlePageChange,
    handleStayClick,
    resetFilters,
    applyFilters,
    toggleFilters,
    toggleMobileFilters
  }
}

// Export SearchFilters type từ types thay vì tạo mới
export type { SearchFilters } from '@/types'
