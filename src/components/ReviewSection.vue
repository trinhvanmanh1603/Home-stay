<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Đánh giá homestay
    </h3>

    <!-- Existing Reviews -->
    <div v-if="reviews.length > 0" class="mb-6">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Đánh giá từ khách hàng ({{ reviews.length }})
      </h4>
      <div class="space-y-4">
        <div v-for="review in reviews" :key="review.id" 
             class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center">
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
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(review.createdAt) }}
            </span>
          </div>
          <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
          
          <!-- Admin Reply -->
          <div v-if="review.adminReply" class="mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
            <div class="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
              Phản hồi từ chủ nhà:
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ review.adminReply }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Review Form (Only for guests who have completed bookings) -->
    <div v-if="canAddReview && !hasUserReviewed">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Thêm đánh giá của bạn
      </h4>
      <form @submit.prevent="submitReview" class="space-y-4">
        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Đánh giá *
          </label>
          <div class="flex items-center space-x-1">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="newReview.rating = i"
              class="focus:outline-none"
            >
              <StarIcon 
                :class="i <= newReview.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'"
                class="h-6 w-6 transition-colors"
              />
            </button>
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({{ newReview.rating }}/5)
            </span>
          </div>
        </div>

        <!-- Comment -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nhận xét *
          </label>
          <textarea
            v-model="newReview.comment"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Chia sẻ trải nghiệm của bạn về homestay này..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelReview"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="!newReview.rating || !newReview.comment.trim() || submitting"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <span v-if="submitting">Đang gửi...</span>
            <span v-else>Gửi đánh giá</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Messages -->
    <div v-if="hasUserReviewed && canAddReview" 
         class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <p class="text-blue-800 dark:text-blue-200 text-sm">
        Bạn đã đánh giá homestay này rồi. Cảm ơn phản hồi của bạn!
      </p>
    </div>

    <div v-if="!canAddReview && authStore.user?.role === 'guest'" 
         class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Bạn cần hoàn thành ít nhất một lần lưu trú tại homestay này để có thể đánh giá.
      </p>
    </div>

    <div v-if="!authStore.isAuthenticated" 
         class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Vui lòng <RouterLink to="/login" class="text-primary-600 hover:text-primary-700">đăng nhập</RouterLink> để đánh giá homestay.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
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

interface Props {
  stayId: string
}

const props = defineProps<Props>()

const authStore = useAuthStore()

// State
const reviews = ref<Review[]>([])
const loading = ref(true)
const submitting = ref(false)
const newReview = ref({
  rating: 0,
  comment: ''
})

// Computed
const canAddReview = computed(() => {
  if (!authStore.isAuthenticated || authStore.user?.role !== 'guest') {
    return false
  }
  
  // Check if user has completed bookings for this stay
  return userHasCompletedBooking.value
})

const hasUserReviewed = computed(() => {
  if (!authStore.user) return false
  return reviews.value.some(review => review.guestId === authStore.user?.id)
})

const userHasCompletedBooking = ref(false)

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const loadReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/reviews?stayId=${props.stayId}&_sort=createdAt&_order=desc`)
    reviews.value = response.data
  } catch (error) {
    console.error('Error loading reviews:', error)
  }
}

const checkUserBookings = async () => {
  if (!authStore.user) return
  
  try {
    // Check if user has completed bookings for this stay
    const response = await axios.get(`http://localhost:3001/bookings?guestInfo.email=${authStore.user.email}&status=completed`)
    const completedBookings = response.data.filter((booking: any) => 
      booking.stayId === props.stayId || booking.stay?.id === props.stayId
    )
    userHasCompletedBooking.value = completedBookings.length > 0
  } catch (error) {
    console.error('Error checking user bookings:', error)
  }
}

const submitReview = async () => {
  if (!authStore.user || !newReview.value.rating || !newReview.value.comment.trim()) {
    return
  }

  submitting.value = true
  try {
    const review: Omit<Review, 'id'> = {
      stayId: props.stayId,
      guestId: authStore.user.id,
      guestName: `${authStore.user.firstName} ${authStore.user.lastName}`,
      rating: newReview.value.rating,
      comment: newReview.value.comment.trim(),
      createdAt: new Date().toISOString()
    }

    const response = await axios.post('http://localhost:3001/reviews', {
      ...review,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

    reviews.value.unshift(response.data)
    
    // Update stay rating
    await updateStayRating()
    
    // Reset form
    newReview.value = { rating: 0, comment: '' }
    
    alert('Đánh giá của bạn đã được gửi thành công!')
  } catch (error) {
    console.error('Error submitting review:', error)
    alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.')
  } finally {
    submitting.value = false
  }
}

const updateStayRating = async () => {
  try {
    // Calculate new average rating
    const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = Number((totalRating / reviews.value.length).toFixed(1))
    
    // Update stay
    const stayResponse = await axios.get(`http://localhost:3001/stays/${props.stayId}`)
    const stay = stayResponse.data
    
    await axios.put(`http://localhost:3001/stays/${props.stayId}`, {
      ...stay,
      rating: averageRating,
      reviewCount: reviews.value.length
    })
  } catch (error) {
    console.error('Error updating stay rating:', error)
  }
}

const cancelReview = () => {
  newReview.value = { rating: 0, comment: '' }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    loadReviews(),
    checkUserBookings()
  ])
  loading.value = false
})
</script>
