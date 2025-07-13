<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Báo cáo & Thống kê
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Xem tổng quan hiệu suất và xu hướng kinh doanh
            </p>
          </div>
          <div class="flex space-x-2">
            <select v-model="selectedPeriod" 
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">3 tháng qua</option>
              <option value="365">12 tháng qua</option>
            </select>
            <button @click="exportReport" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(metrics.totalRevenue) }}
              </p>
              <p :class="metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'" 
                 class="text-sm font-medium">
                {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth.toFixed(1) }}%
              </p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CurrencyDollarIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Đặt phòng mới</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.newBookings }}
              </p>
              <p :class="metrics.bookingGrowth >= 0 ? 'text-green-600' : 'text-red-600'" 
                 class="text-sm font-medium">
                {{ metrics.bookingGrowth >= 0 ? '+' : '' }}{{ metrics.bookingGrowth.toFixed(1) }}%
              </p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CalendarIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ lấp đầy</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.occupancyRate.toFixed(1) }}%
              </p>
              <p :class="metrics.occupancyGrowth >= 0 ? 'text-green-600' : 'text-red-600'" 
                 class="text-sm font-medium">
                {{ metrics.occupancyGrowth >= 0 ? '+' : '' }}{{ metrics.occupancyGrowth.toFixed(1) }}%
              </p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <HomeIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Người dùng mới</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.newUsers }}
              </p>
              <p :class="metrics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'" 
                 class="text-sm font-medium">
                {{ metrics.userGrowth >= 0 ? '+' : '' }}{{ metrics.userGrowth.toFixed(1) }}%
              </p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <UsersIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Doanh thu theo thời gian
          </h3>
          <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <!-- Placeholder for chart -->
            <ChartBarIcon class="w-16 h-16" />
            <span class="ml-2">Biểu đồ doanh thu</span>
          </div>
        </div>

        <!-- Bookings Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Xu hướng đặt phòng
          </h3>
          <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <!-- Placeholder for chart -->
            <ChartBarIcon class="w-16 h-16" />
            <span class="ml-2">Biểu đồ đặt phòng</span>
          </div>
        </div>
      </div>

      <!-- Performance Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Homestays -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Top Homestay theo doanh thu
            </h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(stay, index) in topStays" :key="stay.id" 
                   class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white text-sm">
                      {{ stay.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ stay.bookings }} đặt phòng
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ formatCurrency(stay.revenue) }}
                  </p>
                  <div class="flex items-center">
                    <StarIcon class="w-3 h-3 text-yellow-400 mr-1" />
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ stay.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Locations -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Địa điểm phổ biến
            </h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(location, index) in topLocations" :key="location.city" 
                   class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white text-sm">
                      {{ location.city }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ location.stays }} homestay
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ location.bookings }} đặt phòng
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(location.revenue) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showConfirmationModal"
      :type="confirmationConfig.type"
      :title="confirmationConfig.title"
      :message="confirmationConfig.message"
      :details="confirmationConfig.details"
      @confirm="confirmationConfig.onConfirm"
      @cancel="showConfirmationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { 
  CurrencyDollarIcon,
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const authStore = useAuthStore()

interface Metrics {
  totalRevenue: number
  revenueGrowth: number
  newBookings: number
  bookingGrowth: number
  occupancyRate: number
  occupancyGrowth: number
  newUsers: number
  userGrowth: number
}

interface TopStay {
  id: string
  title: string
  revenue: number
  bookings: number
  rating: number
}

interface TopLocation {
  city: string
  stays: number
  bookings: number
  revenue: number
}

const selectedPeriod = ref(30)

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  type: 'info' as 'success' | 'danger' | 'warning' | 'info',
  title: '',
  message: '',
  details: '',
  onConfirm: () => {}
})

// Helper function to open confirmation modal
const openConfirmationModal = (config: typeof confirmationConfig.value) => {
  confirmationConfig.value = config
  showConfirmationModal.value = true
}
const metrics = ref<Metrics>({
  totalRevenue: 0,
  revenueGrowth: 0,
  newBookings: 0,
  bookingGrowth: 0,
  occupancyRate: 0,
  occupancyGrowth: 0,
  newUsers: 0,
  userGrowth: 0
})

const topStays = ref<TopStay[]>([])
const topLocations = ref<TopLocation[]>([])

const loadReports = async () => {
  try {
    // Load bookings for revenue calculation
    const bookingsResponse = await axios.get('http://localhost:3001/bookings')
    const staysResponse = await axios.get('http://localhost:3001/stays')
    const usersResponse = await axios.get('http://localhost:3002/users')

    let filteredBookings = bookingsResponse.data
    let filteredStays = staysResponse.data
    const users = usersResponse.data

    // Filter by brand if not super admin
    if (authStore.user?.brand && !authStore.isSuperAdmin) {
      filteredStays = filteredStays.filter((stay: any) => stay.brand === authStore.user?.brand)
      const stayIds = filteredStays.map((stay: any) => stay.id)
      filteredBookings = filteredBookings.filter((booking: any) => 
        stayIds.includes(booking.stayId)
      )
    }

    // Calculate period dates
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - selectedPeriod.value)

    // Filter data by period
    const periodBookings = filteredBookings.filter((booking: any) => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= startDate && bookingDate <= endDate
    })

    const periodUsers = users.filter((user: any) => {
      const userDate = new Date(user.createdAt)
      return userDate >= startDate && userDate <= endDate
    })

    // Calculate metrics
    const completedBookings = periodBookings.filter((b: any) => ['confirmed', 'completed'].includes(b.status))
    
    metrics.value = {
      totalRevenue: completedBookings.reduce((sum: number, b: any) => {
        if (b.paymentStatus === 'fully_paid') {
          return sum + b.totalPrice
        } else if (b.paymentStatus === 'deposit_paid') {
          return sum + b.depositAmount
        }
        return sum
      }, 0),
      revenueGrowth: Math.random() * 20 - 10, // Mock growth
      newBookings: periodBookings.length,
      bookingGrowth: Math.random() * 30 - 15,
      occupancyRate: Math.random() * 30 + 60, // Mock 60-90%
      occupancyGrowth: Math.random() * 10 - 5,
      newUsers: periodUsers.length,
      userGrowth: Math.random() * 25 - 10
    }

    // Calculate top homestays
    const stayRevenue = new Map()
    const stayBookings = new Map()
    
    completedBookings.forEach((booking: any) => {
      const currentRevenue = stayRevenue.get(booking.stayId) || 0
      const bookingCount = stayBookings.get(booking.stayId) || 0
      
      // Tính revenue dựa trên paymentStatus
      let revenue = 0
      if (booking.paymentStatus === 'fully_paid') {
        revenue = booking.totalPrice
      } else if (booking.paymentStatus === 'deposit_paid') {
        revenue = booking.depositAmount
      }
      
      stayRevenue.set(booking.stayId, currentRevenue + revenue)
      stayBookings.set(booking.stayId, bookingCount + 1)
    })

    topStays.value = filteredStays
      .map((stay: any) => ({
        id: stay.id,
        title: stay.title,
        revenue: stayRevenue.get(stay.id) || 0,
        bookings: stayBookings.get(stay.id) || 0,
        rating: stay.rating
      }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)

    // Calculate top locations
    const locationStats = new Map()
    
    filteredStays.forEach((stay: any) => {
      const city = stay.city
      if (!locationStats.has(city)) {
        locationStats.set(city, { stays: 0, bookings: 0, revenue: 0 })
      }
      const stats = locationStats.get(city)
      stats.stays += 1
      stats.bookings += stayBookings.get(stay.id) || 0
      stats.revenue += stayRevenue.get(stay.id) || 0
    })

    topLocations.value = Array.from(locationStats.entries())
      .map(([city, stats]: [string, any]) => ({
        city,
        ...stats
      }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)

  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const exportReport = () => {
  // TODO: Implement export functionality
  console.log('Export report for period:', selectedPeriod.value)
  openConfirmationModal({
    type: 'info',
    title: 'Tính năng đang phát triển',
    message: 'Tính năng xuất báo cáo sẽ được phát triển trong phiên bản tới',
    details: 'Chúng tôi đang làm việc để hoàn thiện tính năng này. Vui lòng quay lại sau.',
    onConfirm: () => {
      showConfirmationModal.value = false
    }
  })
}

onMounted(() => {
  loadReports()
})

// Watch for period changes
watch(selectedPeriod, () => {
  loadReports()
})
</script>
