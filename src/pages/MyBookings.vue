<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Đặt phòng của tôi
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Quản lý và theo dõi tất cả đặt phòng của bạn
        </p>
      </div>

      <!-- Filter Tabs -->
      <FilterTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @change="handleTabChange"
        class="mb-6"
      />

      <!-- Loading State -->
      <LoadingSpinner 
        v-if="loading"
        text="Đang tải danh sách đặt phòng..."
        class="py-12"
      />

      <!-- No Bookings State -->
      <EmptyState
        v-else-if="!hasBookings"
        icon="home"
        title="Chưa có đặt phòng nào"
        description="Hãy khám phá những homestay tuyệt vời và đặt phòng ngay!"
        action-text="Tìm homestay"
        @action="$router.push('/stays')"
        class="py-12"
      />

      <!-- No Filtered Results -->
      <EmptyState
        v-else-if="!hasFilteredResults"
        title="Không có kết quả"
        description="Thử chuyển sang tab khác để xem các đặt phòng khác."
        class="py-12"
      />

      <!-- Booking List -->
      <div v-else>
        <!-- Stats Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ filteredBookings.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ activeTab === 'all' ? 'Tổng đặt phòng' : getActiveTabLabel }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ totalPaidAmount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Đã thanh toán
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ pendingBookingsCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Chờ xác nhận
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ upcomingBookingsCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Sắp tới
            </div>
          </div>
        </div>

        <!-- Bookings Grid -->
        <div class="space-y-4">
          <BookingCard
            v-for="booking in paginatedBookings"
            :key="booking.id"
            :booking="booking"
            :get-status-color="getStatusColor"
            :get-status-text="getStatusText"
            :format-date="formatDate"
            @view-detail="viewBookingDetail"
          />
        </div>

        <!-- Pagination -->
        <StayPagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredBookings.length"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMyBookings } from '@/composables/useMyBookings'

// Components
import FilterTabs from '@/components/common/FilterTabs.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import BookingCard from '@/components/booking/BookingCard.vue'
import StayPagination from '@/components/stay/StayPagination.vue'

// Stores

// Composable
const {
  // State
  loading,
  activeTab,
  currentPage,
  itemsPerPage,
  
  // Computed
  filteredBookings,
  paginatedBookings,
  totalPages,
  hasBookings,
  hasFilteredResults,
  tabs,
  totalPaidAmount,
  pendingBookingsCount,
  upcomingBookingsCount,
  
  // Methods
  loadBookings,
  handleTabChange,
  handlePageChange,
  viewBookingDetail,
  getStatusColor,
  getStatusText,
  formatDate,
  getActiveTabLabel
} = useMyBookings()

onMounted(() => {
  loadBookings()
})
</script>
