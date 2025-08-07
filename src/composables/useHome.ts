import { computed, onMounted } from 'vue'
import { useStayStore } from '@/store/stays'

export function useHome() {
  const stayStore = useStayStore()

  // Computed
  const loading = computed(() => stayStore.loading)
  const featuredStays = computed(() => stayStore.stays.slice(0, 6))

  // Methods
  const initializeHome = async () => {
    await stayStore.fetchStays()
  }

  return {
    // State
    loading,
    featuredStays,
    
    // Methods
    initializeHome
  }
}
