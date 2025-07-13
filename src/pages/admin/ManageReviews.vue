<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Quản lý đánh giá
      </h3>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        {{ reviews.length }} đánh giá
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lọc theo homestay
        </label>
        <select 
          v-model="selectedStayId" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Tất cả homestay</option>
          <option v-for="stay in stays" :key="stay.id" :value="stay.id">
            {{ stay.title }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trạng thái phản hồi
        </label>
        <select 
          v-model="replyFilter" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Tất cả</option>
          <option value="replied">Đã phản hồi</option>
          <option value="not-replied">Chưa phản hồi</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Đánh giá
        </label>
        <select 
          v-model="ratingFilter" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>
    </div>

    <!-- Reviews List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
    </div>

    <div v-else-if="filteredReviews.length === 0" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">Không có đánh giá nào</p>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="review in filteredReviews" 
        :key="review.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center mb-2">
              <div class="flex items-center mr-3">
                <StarIcon 
                  v-for="i in 5" 
                  :key="i"
                  :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  class="h-4 w-4"
                />
              </div>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ review.guestName }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ getStayTitle(review.stayId) }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(review.createdAt) }}
          </span>
        </div>

        <!-- Existing Admin Reply -->
        <div v-if="review.adminReply" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
            Phản hồi từ chủ nhà:
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-sm">{{ review.adminReply }}</p>
          <button
            v-if="authStore.canEditBookings"
            @click="editReply(review)"
            class="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Chỉnh sửa phản hồi
          </button>
        </div>

        <!-- Add/Edit Reply Form -->
        <div v-if="(!review.adminReply || editingReply === review.id) && authStore.canEditBookings">
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {{ review.adminReply ? 'Chỉnh sửa phản hồi' : 'Thêm phản hồi' }}
            </h4>
            <form @submit.prevent="submitReply(review)" class="space-y-3">
              <textarea
                v-model="replyText[review.id]"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nhập phản hồi của bạn..."
                required
              ></textarea>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  @click="cancelReply(review.id)"
                  class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="!replyText[review.id]?.trim() || submittingReply === review.id"
                  class="px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  <span v-if="submittingReply === review.id">Đang gửi...</span>
                  <span v-else>{{ review.adminReply ? 'Cập nhật' : 'Gửi phản hồi' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Add Reply Button -->
        <div v-else-if="!review.adminReply && authStore.canEditBookings" class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            @click="startReply(review)"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Thêm phản hồi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/store/auth'
import { StarIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'

interface Review {
  id: string
  stayId: string
  guestId: string
  guestName: string
  rating: number
  comment: string
  adminReply?: string
  createdAt: string
  updatedAt?: string
}

interface Stay {
  id: string
  title: string
}

const authStore = useAuthStore()

// State
const reviews = ref<Review[]>([])
const stays = ref<Stay[]>([])
const loading = ref(true)
const selectedStayId = ref('')
const replyFilter = ref('')
const ratingFilter = ref('')
const editingReply = ref<string | null>(null)
const submittingReply = ref<string | null>(null)
const replyText = reactive<Record<string, string>>({})

// Computed
const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (selectedStayId.value) {
    filtered = filtered.filter(review => review.stayId === selectedStayId.value)
  }

  if (replyFilter.value === 'replied') {
    filtered = filtered.filter(review => review.adminReply)
  } else if (replyFilter.value === 'not-replied') {
    filtered = filtered.filter(review => !review.adminReply)
  }

  if (ratingFilter.value) {
    filtered = filtered.filter(review => review.rating === parseInt(ratingFilter.value))
  }

  // Filter by brand for non-super admin
  if (!authStore.isSuperAdmin && authStore.user?.brand) {
    const brandStayIds = stays.value
      .filter(stay => (stay as any).brand === authStore.user?.brand)
      .map(stay => stay.id)
    filtered = filtered.filter(review => brandStayIds.includes(review.stayId))
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStayTitle = (stayId: string): string => {
  const stay = stays.value.find(s => s.id === stayId)
  return stay ? stay.title : 'Homestay không tìm thấy'
}

const loadData = async () => {
  try {
    const [reviewsResponse, staysResponse] = await Promise.all([
      axios.get('http://localhost:3001/reviews?_sort=createdAt&_order=desc'),
      axios.get('http://localhost:3001/stays')
    ])
    
    reviews.value = reviewsResponse.data
    stays.value = staysResponse.data
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const startReply = (review: Review) => {
  editingReply.value = review.id
  replyText[review.id] = review.adminReply || ''
}

const editReply = (review: Review) => {
  editingReply.value = review.id
  replyText[review.id] = review.adminReply || ''
}

const cancelReply = (reviewId: string) => {
  editingReply.value = null
  delete replyText[reviewId]
}

const submitReply = async (review: Review) => {
  const reply = replyText[review.id]?.trim()
  if (!reply) return

  submittingReply.value = review.id
  try {
    const updatedReview = {
      ...review,
      adminReply: reply,
      updatedAt: new Date().toISOString()
    }

    await axios.put(`http://localhost:3001/reviews/${review.id}`, updatedReview)
    
    // Update local data
    const index = reviews.value.findIndex(r => r.id === review.id)
    if (index !== -1) {
      reviews.value[index] = updatedReview
    }
    
    editingReply.value = null
    delete replyText[review.id]
    
    alert('Phản hồi đã được gửi thành công!')
  } catch (error) {
    console.error('Error submitting reply:', error)
    alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại.')
  } finally {
    submittingReply.value = null
  }
}

onMounted(() => {
  loadData()
})
</script>
