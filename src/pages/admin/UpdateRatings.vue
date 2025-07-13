<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cập nhật Rating Homestays
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Tính toán và cập nhật rating thực tế cho tất cả homestays dựa trên đánh giá của khách hàng
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalStays }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng Homestays</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalReviews }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng Đánh giá</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ averageRating.toFixed(1) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Rating Trung bình</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ updatedCount }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Đã Cập nhật</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Cập nhật Rating
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Nhấn nút để tính toán và cập nhật rating cho tất cả homestays
            </p>
          </div>
          <button
            @click="updateAllRatings"
            :disabled="updating"
            class="btn-primary flex items-center space-x-2"
          >
            <svg v-if="updating" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ updating ? 'Đang cập nhật...' : 'Cập nhật Rating' }}</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="ratingsData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách Rating Homestays
          </h3>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="item in ratingsData" :key="item.stay.id" 
               class="p-6 flex items-center justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white mb-1">
                {{ item.stay.title }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ item.stay.location }}, {{ item.stay.city }}
              </p>
              <div v-if="item.stay.brand" class="mt-1">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ item.stay.brand }}
                </span>
              </div>
            </div>
            
            <div class="text-right">
              <!-- Rating cũ vs mới -->
              <div class="flex items-center space-x-4 mb-2">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Cũ</div>
                  <RatingDisplay 
                    :rating="item.stay.rating" 
                    :review-count="item.stay.reviewCount"
                    size="sm"
                  />
                </div>
                <div class="text-gray-400">→</div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Mới</div>
                  <RatingDisplay 
                    :rating="item.rating.roundedRating" 
                    :review-count="item.rating.totalReviews"
                    size="sm"
                  />
                </div>
              </div>
              
              <!-- Thay đổi -->
              <div class="text-xs">
                <span v-if="item.rating.roundedRating !== item.stay.rating" 
                      :class="item.rating.roundedRating > item.stay.rating ? 'text-green-600' : 'text-red-600'">
                  {{ item.rating.roundedRating > item.stay.rating ? '+' : '' }}{{ (item.rating.roundedRating - item.stay.rating).toFixed(1) }}
                </span>
                <span v-else class="text-gray-500">Không đổi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Log Messages -->
      <div v-if="messages.length > 0" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Log Cập nhật
          </h3>
        </div>
        <div class="p-4 max-h-60 overflow-y-auto">
          <div v-for="(message, index) in messages" :key="index" 
               :class="[
                 'text-sm mb-2 p-2 rounded',
                 message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                 message.type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
               ]">
            <span class="font-mono text-xs text-gray-500">{{ message.time }}</span>
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRatings } from '@/composables/useRatings'
import RatingDisplay from '@/components/RatingDisplay.vue'
import axios from 'axios'

interface Stay {
  id: string
  title: string
  location: string
  city: string
  rating: number
  reviewCount: number
  brand?: string
}

interface RatingData {
  stay: Stay
  rating: {
    roundedRating: number
    totalReviews: number
  }
}

const { loadReviews, getStayRating } = useRatings()

const stays = ref<Stay[]>([])
const ratingsData = ref<RatingData[]>([])
const updating = ref(false)
const updatedCount = ref(0)
const messages = ref<{ text: string; type: 'info' | 'success' | 'error'; time: string }[]>([])

const totalStays = computed(() => stays.value.length)
const totalReviews = computed(() => 
  ratingsData.value.reduce((sum, item) => sum + item.rating.totalReviews, 0)
)
const averageRating = computed(() => {
  if (ratingsData.value.length === 0) return 0
  const sum = ratingsData.value.reduce((acc, item) => acc + item.rating.roundedRating, 0)
  return sum / ratingsData.value.length
})

const addMessage = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
  messages.value.push({
    text,
    type,
    time: new Date().toLocaleTimeString('vi-VN')
  })
  
  // Cuộn xuống cuối
  setTimeout(() => {
    const logContainer = document.querySelector('.overflow-y-auto')
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight
    }
  }, 100)
}

const loadData = async () => {
  try {
    addMessage('Đang tải dữ liệu homestays và reviews...')
    
    // Load stays và reviews
    const [staysResponse] = await Promise.all([
      axios.get('http://localhost:3001/stays'),
      loadReviews()
    ])
    
    stays.value = staysResponse.data
    
    // Tính toán ratings cho tất cả stays
    ratingsData.value = stays.value.map(stay => ({
      stay,
      rating: getStayRating(stay.id)
    }))
    
    addMessage(`Đã tải ${stays.value.length} homestays và tính toán rating`, 'success')
  } catch (error) {
    console.error('Error loading data:', error)
    addMessage('Lỗi khi tải dữ liệu', 'error')
  }
}

const updateAllRatings = async () => {
  updating.value = true
  updatedCount.value = 0
  
  try {
    addMessage('Bắt đầu cập nhật rating cho tất cả homestays...')
    
    for (const item of ratingsData.value) {
      const { stay, rating } = item
      
      // Chỉ cập nhật nếu có thay đổi
      if (stay.rating !== rating.roundedRating || stay.reviewCount !== rating.totalReviews) {
        try {
          await axios.patch(`http://localhost:3001/stays/${stay.id}`, {
            rating: rating.roundedRating,
            reviewCount: rating.totalReviews
          })
          
          // Cập nhật local data
          stay.rating = rating.roundedRating
          stay.reviewCount = rating.totalReviews
          
          updatedCount.value++
          addMessage(`✓ Cập nhật ${stay.title}: ${rating.roundedRating}/5 (${rating.totalReviews} đánh giá)`, 'success')
        } catch (error) {
          addMessage(`✗ Lỗi cập nhật ${stay.title}: ${error}`, 'error')
        }
      } else {
        addMessage(`- Bỏ qua ${stay.title}: không có thay đổi`)
      }
    }
    
    addMessage(`Hoàn thành! Đã cập nhật ${updatedCount.value}/${stays.value.length} homestays`, 'success')
  } catch (error) {
    addMessage(`Lỗi trong quá trình cập nhật: ${error}`, 'error')
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
