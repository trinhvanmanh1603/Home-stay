import { ref, computed } from 'vue'
import axios from 'axios'
import type { Review, StayRating } from '@/types/review'

export function useRatings() {
  const reviews = ref<Review[]>([])
  const loading = ref(false)

  // Load tất cả reviews
  const loadReviews = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3001/reviews')
      reviews.value = response.data
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      loading.value = false
    }
  }

  // Tính toán rating cho một homestay cụ thể
  const getStayRating = (stayId: string): StayRating => {
    const stayReviews = reviews.value.filter(review => review.stayId === stayId)
    
    if (stayReviews.length === 0) {
      return {
        stayId,
        averageRating: 0,
        totalReviews: 0,
        roundedRating: 0
      }
    }

    const totalRating = stayReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / stayReviews.length
    const roundedRating = Math.round(averageRating * 10) / 10 // Làm tròn 1 chữ số thập phân

    return {
      stayId,
      averageRating,
      totalReviews: stayReviews.length,
      roundedRating
    }
  }

  // Tính toán rating cho tất cả homestays
  const getAllStayRatings = computed(() => {
    const stayIds = [...new Set(reviews.value.map(review => review.stayId))]
    return stayIds.map(stayId => getStayRating(stayId))
  })

  // Cập nhật rating trong database stays
  const updateStayRatings = async () => {
    try {
      const staysResponse = await axios.get('http://localhost:3001/stays')
      const stays = staysResponse.data

      for (const stay of stays) {
        const rating = getStayRating(stay.id)
        
        // Chỉ cập nhật nếu có thay đổi
        if (stay.rating !== rating.roundedRating || stay.reviewCount !== rating.totalReviews) {
          await axios.patch(`http://localhost:3001/stays/${stay.id}`, {
            rating: rating.roundedRating,
            reviewCount: rating.totalReviews
          })
        }
      }
    } catch (error) {
      console.error('Error updating stay ratings:', error)
    }
  }

  // Format rating cho hiển thị
  const formatRating = (rating: number): string => {
    if (rating === 0) return '0.0'
    return rating.toFixed(1)
  }

  // Lấy text mô tả rating
  const getRatingText = (rating: number): string => {
    if (rating >= 4.8) return 'Xuất sắc'
    if (rating >= 4.5) return 'Rất tốt'
    if (rating >= 4.0) return 'Tốt'
    if (rating >= 3.5) return 'Khá'
    if (rating >= 3.0) return 'Trung bình'
    return 'Cần cải thiện'
  }

  // Lấy màu sắc cho rating
  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400'
    if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400'
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return {
    reviews,
    loading,
    loadReviews,
    getStayRating,
    getAllStayRatings,
    updateStayRatings,
    formatRating,
    getRatingText,
    getRatingColor
  }
}
