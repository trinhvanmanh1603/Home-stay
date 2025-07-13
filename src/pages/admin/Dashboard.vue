<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
              <span v-if="authStore.user?.brand && !authStore.isSuperAdmin" class="text-lg text-blue-600 dark:text-blue-400 block">
                {{ authStore.user.brand }}
              </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              <span v-if="authStore.user?.brand && !authStore.isSuperAdmin">
                Quản lý hệ thống HomeStay - {{ authStore.user.brand }}
              </span>
              <span v-else>
                Quản lý hệ thống HomeStay
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Xin chào, {{ authStore.user?.firstName }}
            </span>
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.firstName?.charAt(0) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse">
          <div class="flex items-center">
            <div class="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-12 h-12"></div>
            <div class="ml-4 flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actual stats cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <HomeIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tổng Homestay
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalStays }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CalendarIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tổng Đặt phòng
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalBookings }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UsersIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tổng Người dùng
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalUsers }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <CurrencyDollarIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Doanh thu
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(stats.totalRevenue) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Bookings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Đặt phòng gần đây
            </h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="booking in recentBookings" :key="booking.id" 
                   class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ booking.guestName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ booking.stayTitle }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(booking.totalPrice) }}
                  </p>
                  <p class="text-sm" :class="getStatusColor(booking.status)">
                    {{ getStatusText(booking.status) }}
                  </p>
                </div>
              </div>
            </div>
            <router-link to="/admin/bookings" 
                        class="block mt-4 text-center py-2 text-blue-600 dark:text-blue-400 hover:underline">
              Xem tất cả đặt phòng
            </router-link>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Thao tác nhanh
            </h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <router-link to="/admin/stays" 
                          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <HomeIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span class="text-blue-600 dark:text-blue-400 font-medium">
                  Quản lý Homestay
                </span>
              </router-link>

              <router-link to="/admin/bookings" 
                          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <CalendarIcon class="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span class="text-green-600 dark:text-green-400 font-medium">
                  Quản lý Đặt phòng
                </span>
              </router-link>

              <router-link to="/admin/cancellations" 
                          class="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <span class="text-red-600 dark:text-red-400 font-medium">
                  Yêu cầu Hủy phòng
                </span>
              </router-link>

              <router-link to="/admin/reviews" 
                          class="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                <ChatBubbleLeftEllipsisIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                <span class="text-indigo-600 dark:text-indigo-400 font-medium">
                  Quản lý Đánh giá
                </span>
              </router-link>

              <router-link to="/admin/update-ratings" 
                          class="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                <StarIcon class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                <span class="text-orange-600 dark:text-orange-400 font-medium">
                  Cập nhật Rating
                </span>
              </router-link>

              <router-link to="/admin/users" 
                          class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <UsersIcon class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span class="text-purple-600 dark:text-purple-400 font-medium">
                  Quản lý Người dùng
                </span>
              </router-link>

              <router-link to="/admin/reports" 
                          class="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                <ChartBarIcon class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <span class="text-yellow-600 dark:text-yellow-400 font-medium">
                  Báo cáo thống kê
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import type { Stats, RecentBooking } from '@/types'

const authStore = useAuthStore()

const stats = ref<Stats>({
  totalStays: 0,
  totalBookings: 0,
  totalUsers: 0,
  totalRevenue: 0
})

const recentBookings = ref<RecentBooking[]>([])
const loading = ref(true)

const loadStats = async () => {
  loading.value = true
  try {
    // Set default values first
    stats.value = {
      totalStays: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalRevenue: 0
    }
    recentBookings.value = []

    // Load stays
    const staysResponse = await axios.get('http://localhost:3001/stays')
    let filteredStays = staysResponse.data
    
    // Filter by brand if not super admin
    if (authStore.user?.brand && !authStore.isSuperAdmin) {
      filteredStays = filteredStays.filter((stay: any) => stay.brand === authStore.user?.brand)
    }
    
    // Chỉ tính homestays đang hoạt động (available = true)
    stats.value.totalStays = filteredStays.filter((stay: any) => stay.available === true).length

    // Load bookings
    const bookingsResponse = await axios.get('http://localhost:3001/bookings')
    let filteredBookings = bookingsResponse.data
    
    // Filter bookings by brand
    if (authStore.user?.brand && !authStore.isSuperAdmin) {
      const stayIds = filteredStays.map((stay: any) => stay.id)
      filteredBookings = filteredBookings.filter((booking: any) => 
        stayIds.includes(booking.stayId)
      )
    }
    
    // Chỉ tính bookings đang hoạt động (confirmed hoặc completed)
    stats.value.totalBookings = filteredBookings
      .filter((booking: any) => ['confirmed', 'completed'].includes(booking.status)).length
    
    // Tính doanh thu dựa trên trạng thái thanh toán thực tế
    stats.value.totalRevenue = filteredBookings
      .filter((booking: any) => ['confirmed', 'completed'].includes(booking.status))
      .reduce((sum: number, booking: any) => {
        if (booking.paymentStatus === 'fully_paid') {
          return sum + booking.totalPrice
        } else if (booking.paymentStatus === 'deposit_paid') {
          return sum + booking.depositAmount
        }
        return sum
      }, 0)

    // Load users - fallback to mock data if server not available
    let allUsers = []
    try {
      const usersResponse = await axios.get('http://localhost:3001/users')
      allUsers = usersResponse.data
      stats.value.totalUsers = usersResponse.data.length
    } catch (error) {
      console.warn('Users server not available, using mock data')
      // Mock user data
      allUsers = [
        { id: 1, firstName: 'Trịnh Văn', lastName: 'Trịnh', email: 'admin@test.com' },
        { id: 2, firstName: 'Nguyễn', lastName: 'An', email: 'user@test.com' }
      ]
      stats.value.totalUsers = allUsers.length
    }

    // Load recent bookings (last 5) với user info
    const recent = filteredBookings
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((booking: any) => {
        const user = allUsers.find((u: any) => u.id === booking.userId)
        const stay = filteredStays.find((s: any) => s.id === booking.stayId)
        return {
          id: booking.id,
          guestName: user ? `${user.firstName} ${user.lastName}` : 'N/A',
          stayTitle: stay?.title || 'N/A',
          totalPrice: booking.totalPrice,
          status: booking.status
        }
      })
    
    recentBookings.value = recent
  } catch (error) {
    console.error('Error loading stats:', error)
    // Set fallback data if API fails
    stats.value = {
      totalStays: 0,
      totalBookings: 0,
      totalUsers: 2,
      totalRevenue: 0
    }
    recentBookings.value = []
    
    // Show error message to user
    alert('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'text-green-600 dark:text-green-400'
    case 'pending':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'cancelled':
      return 'text-red-600 dark:text-red-400'
    case 'completed':
      return 'text-blue-600 dark:text-blue-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'pending':
      return 'Chờ xác nhận'
    case 'cancelled':
      return 'Đã hủy'
    case 'completed':
      return 'Hoàn thành'
    default:
      return status
  }
}

onMounted(() => {
  loadStats()
})
</script>

