<template>
  <div>
    <nav class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200/20 dark:border-gray-700/30 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <RouterLink to="/" class="flex items-center group">
            <div class="relative">
              <svg class="h-10 w-10 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <!-- Subtle glow effect -->
              <div class="absolute inset-0 bg-primary-400/20 dark:bg-primary-300/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="ml-3">
              <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                HomeStay
              </span>
              <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Khám phá. Trải nghiệm. Tận hưởng.
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-1">
            <RouterLink to="/" 
                       class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group">
              <span class="text-base">🏠</span>
              <span>Trang chủ</span>
            </RouterLink>
            <RouterLink to="/stays" 
                       class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group">
              <span class="text-base">🔍</span>
              <span>Khám phá</span>
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && !authStore.isAdmin"
              to="/my-bookings" 
              class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group"
            >
              <span class="text-base">📋</span>
              <span>Đặt phòng của tôi</span>
            </RouterLink>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center space-x-3">
          <!-- Auth buttons for desktop -->
          <div class="hidden md:flex items-center space-x-3">
            <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
              <RouterLink 
                to="/login"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Đăng nhập
              </RouterLink>
              <RouterLink 
                to="/register"
                class="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Đăng ký
              </RouterLink>
              <RouterLink 
                to="/admin-register"
                class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-1"
              >
                <span>🛡️</span>
                <span>Admin</span>
              </RouterLink>
            </div>
            <div v-else class="flex items-center space-x-3">
              <!-- Admin quick toggle -->
              <div v-if="authStore.isAdmin" class="relative admin-dropdown">
                <button 
                  @click="adminQuickMenu = !adminQuickMenu; console.log('Admin menu toggled:', adminQuickMenu)"
                  class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                >
                  <span class="flex items-center space-x-1">
                    <span class="text-base">⚡</span>
                    <span>Quick Admin</span>
                  </span>
                  <ChevronDownIcon :class="['w-4 h-4 transition-transform duration-200', adminQuickMenu ? 'rotate-180' : '']" />
                </button>
                
                <!-- Quick Admin Dropdown -->
                <div v-if="adminQuickMenu" 
                     class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-3 z-50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                  <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p class="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center space-x-1">
                      <span>⚡</span>
                      <span>Truy cập nhanh</span>
                    </p>
                  </div>
                  <div class="p-2 space-y-1">
                    <RouterLink to="/admin" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-blue-500">📊</span>
                      <span class="font-medium">Dashboard</span>
                    </RouterLink>
                    <RouterLink to="/admin/stays" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-green-500">🏠</span>
                      <span class="font-medium">Homestay</span>
                    </RouterLink>
                    <RouterLink to="/admin/bookings" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-orange-500">📋</span>
                      <span class="font-medium">Đặt phòng</span>
                    </RouterLink>
                    <RouterLink to="/admin/reviews" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-yellow-500">⭐</span>
                      <span class="font-medium">Đánh giá</span>
                    </RouterLink>
                    <RouterLink to="/admin/update-ratings" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-purple-500">⚡</span>
                      <span class="font-medium">Update Rating</span>
                    </RouterLink>
                    <RouterLink v-if="authStore.canManageUsers" 
                                to="/admin/users" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-indigo-500">👥</span>
                      <span class="font-medium">Người dùng</span>
                    </RouterLink>
                    <div v-if="authStore.isSuperAdmin" class="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                      <RouterLink to="/admin/approval" 
                                  @click="adminQuickMenu = false"
                                  class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                        <span class="text-lg group-hover:scale-110 transition-transform text-red-500">🛡️</span>
                        <span class="font-medium">Phê duyệt Admin</span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- User info -->
              <div class="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ authStore.user?.firstName?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="hidden lg:block">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ authStore.isAdmin ? (authStore.isSuperAdmin ? 'Super Admin' : 'Admin') : 'Khách hàng' }}
                  </p>
                </div>
                <button
                  @click="handleLogout"
                  class="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded transition-colors"
                  title="Đăng xuất"
                >
                  <ArrowRightOnRectangleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Dark mode toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group relative"
            aria-label="Toggle dark mode"
          >
            <SunIcon v-if="themeStore.isDark" class="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <MoonIcon v-else class="h-5 w-5 text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100 transition-colors" />
            <!-- Subtle ring animation -->
            <div class="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-gray-200 dark:group-hover:ring-gray-700 transition-all duration-200"></div>
          </button>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
            aria-label="Toggle menu"
          >
            <div class="relative w-6 h-6">
              <span 
                :class="[
                  'absolute top-1 left-0 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300',
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                ]"
              ></span>
              <span 
                :class="[
                  'absolute top-2.5 left-0 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300',
                  mobileMenuOpen ? 'opacity-0' : ''
                ]"
              ></span>
              <span 
                :class="[
                  'absolute top-4 left-0 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300',
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                ]"
              ></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Enhanced Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden">
        <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200/30 dark:border-gray-700/30">
          <div class="px-4 pt-4 pb-3 space-y-2">
            <MobileNavLink to="/" @click="mobileMenuOpen = false" icon="🏠">
              Trang chủ
            </MobileNavLink>
            <MobileNavLink to="/stays" @click="mobileMenuOpen = false" icon="🔍">
              Khám phá
            </MobileNavLink>
            <MobileNavLink 
              v-if="authStore.isAuthenticated && !authStore.isAdmin"
              to="/my-bookings" 
              @click="mobileMenuOpen = false"
              icon="📋"
            >
              Đặt phòng của tôi
            </MobileNavLink>
            
            <!-- Admin menu for mobile -->
            <div v-if="authStore.isAdmin" class="border-t border-gray-200/50 dark:border-gray-700/50 pt-3 mt-3">
              <div class="px-3 py-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                ⚡ Quản trị viên
              </div>
              <div class="space-y-1">
                <MobileNavLink to="/admin" @click="mobileMenuOpen = false" icon="📊" isAdmin>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/admin/stays" @click="mobileMenuOpen = false" icon="🏠" isAdmin>
                  Quản lý Homestay
                </MobileNavLink>
                <MobileNavLink to="/admin/bookings" @click="mobileMenuOpen = false" icon="📋" isAdmin>
                  Quản lý Đặt phòng
                </MobileNavLink>
                <MobileNavLink to="/admin/reviews" @click="mobileMenuOpen = false" icon="⭐" isAdmin>
                  Quản lý Đánh giá
                </MobileNavLink>
                <MobileNavLink to="/admin/update-ratings" @click="mobileMenuOpen = false" icon="⚡" isAdmin>
                  Cập nhật Rating
                </MobileNavLink>
                <MobileNavLink 
                  v-if="authStore.canManageUsers"
                  to="/admin/users" 
                  @click="mobileMenuOpen = false" 
                  icon="👥" 
                  isAdmin
                >
                  Quản lý Người dùng
                </MobileNavLink>
                <MobileNavLink to="/admin/reports" @click="mobileMenuOpen = false" icon="📈" isAdmin>
                  Báo cáo thống kê
                </MobileNavLink>
                <div v-if="authStore.isSuperAdmin" class="border-t border-gray-200/30 dark:border-gray-700/30 pt-2 mt-2">
                  <MobileNavLink to="/admin/approval" @click="mobileMenuOpen = false" icon="🛡️" isAdmin>
                    Phê duyệt Admin
                  </MobileNavLink>
                </div>
              </div>
            </div>
            
            <!-- Mobile auth section -->
            <div class="border-t border-gray-200/50 dark:border-gray-700/50 pt-3 mt-3">
              <div v-if="!authStore.isAuthenticated" class="space-y-2">
                <MobileNavLink to="/login" @click="mobileMenuOpen = false" icon="👤">
                  Đăng nhập
                </MobileNavLink>
                <div class="px-3">
                  <RouterLink 
                    to="/register"
                    @click="mobileMenuOpen = false"
                    class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Đăng ký ngay</span>
                  </RouterLink>
                </div>
                <div class="px-3 mt-2">
                  <RouterLink 
                    to="/admin-register"
                    @click="mobileMenuOpen = false"
                    class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-1"
                  >
                    <span>🛡️</span>
                    <span>Đăng ký Admin</span>
                  </RouterLink>
                </div>
              </div>
              <div v-else>
                <!-- User info mobile -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {{ authStore.user?.firstName?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ authStore.isAdmin ? (authStore.isSuperAdmin ? 'Super Admin' : 'Admin') : 'Khách hàng' }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="px-3">
                  <button
                    @click="handleLogout"
                    class="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg text-center font-medium transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </nav>
    
    <!-- Logout Confirmation Modal - Outside nav with higher z-index -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[60] overflow-y-auto">
      <ConfirmationModal
        :isOpen="showLogoutModal"
        type="warning"
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        details="Bạn sẽ cần đăng nhập lại để truy cập các tính năng dành cho thành viên."
        confirmText="Đăng xuất"
        cancelText="Hủy"
        @confirm="confirmLogout"
        @cancel="showLogoutModal = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { 
  SunIcon, 
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const mobileMenuOpen = ref<boolean>(false)
const adminQuickMenu = ref<boolean>(false)
const showLogoutModal = ref<boolean>(false)

// Handle logout with confirmation modal
const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  showLogoutModal.value = false
}

// Define mobile nav component
const MobileNavLink = defineComponent({
  props: ['to', 'icon', 'isAdmin'],
  template: `
    <RouterLink :to="to"
                :class="[
                  'flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group',
                  isAdmin ? 'ml-2' : ''
                ]">
      <span class="text-base group-hover:scale-110 transition-transform">{{ icon }}</span>
      <span class="font-medium"><slot /></span>
    </RouterLink>
  `
})

onMounted(() => {
  // Check authentication on mount
  authStore.checkAuth()
})
</script>
