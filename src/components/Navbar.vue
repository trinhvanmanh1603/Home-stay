<template>
  <div>
  <nav :class="navClass">
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
                       :class="[linkBaseClass, 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group']">
              <span class="text-base">🏠</span>
              <span>Trang chủ</span>
            </RouterLink>
            <RouterLink to="/stays" 
                       :class="[linkBaseClass, 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group']">
              <span class="text-base">🔍</span>
              <span>Khám phá</span>
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && !authStore.isAdmin"
              to="/my-bookings" 
              :class="[linkBaseClass, 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group']"
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
              <ActionButton
                to="/login"
                variant="ghost"
                size="sm"
              >
                Đăng nhập
              </ActionButton>
              <ActionButton
                to="/register"
                variant="primary"
                size="sm"
              >
                Đăng ký
              </ActionButton>
              <ActionButton
                to="/admin-register"
                variant="secondary"
                size="sm"
                icon="shield"
              >
                Admin
              </ActionButton>
            </div>
            <div v-else class="flex items-center space-x-3">
              <!-- Admin quick toggle -->
              <div v-if="authStore.isAdmin" class="relative admin-dropdown">
                <button 
                  @click="adminQuickMenu = !adminQuickMenu"
                  :class="[linkBaseClass, 'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group border border-transparent']"
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
                    <RouterLink to="/admin/cancellations" 
                                @click="adminQuickMenu = false"
                                class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                      <span class="text-lg group-hover:scale-110 transition-transform text-red-500">❌</span>
                      <span class="font-medium">Yêu cầu hủy</span>
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
              <div :class="['flex items-center space-x-3 rounded-lg px-4 py-2', userInfoBgClass]">
                <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ authStore.user?.firstName?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="hidden lg:block">
                  <p class="text-sm font-medium bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ authStore.isAdmin ? (authStore.isSuperAdmin ? 'Super Admin' : 'Admin') : 'Khách hàng' }}
                  </p>
                </div>
                <ActionButton
                  @click="handleLogout"
                  variant="ghost"
                  size="sm"
                  icon="logout"
                  title="Đăng xuất"
                />
              </div>
            </div>
          </div>

          <!-- Dark mode toggle -->
          <ActionButton
            @click="themeStore.toggleTheme"
            variant="ghost"
            size="md"
            :icon="themeStore.isDark ? 'sun' : 'moon'"
            title="Toggle dark mode"
            class="relative"
          />

          <!-- Mobile menu button -->
          <ActionButton
            @click="mobileMenuOpen = !mobileMenuOpen"
            variant="ghost"
            size="md"
            :icon="mobileMenuOpen ? 'x-mark' : 'bars-3'"
            class="md:hidden relative z-40"
            title="Toggle menu"
          />
        </div>
      </div>

      <!-- Enhanced Mobile menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 transform -translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-2"
      >
        <div v-show="mobileMenuOpen" class="md:hidden relative z-50">
          <div class="bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <div class="px-4 pt-4 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
              <!-- Main navigation -->
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
                  <MobileNavLink to="/admin/cancellations" @click="mobileMenuOpen = false" icon="❌" isAdmin>
                    Yêu cầu hủy phòng
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
              <div class="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-3">
                <div v-if="!authStore.isAuthenticated" class="space-y-3">
                  <div class="px-3 py-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                    🔐 Đăng nhập / Đăng ký
                  </div>
                  <div class="space-y-2">
                    <div class="px-3">
                      <ActionButton
                        to="/login"
                        @click="mobileMenuOpen = false"
                        variant="primary"
                        size="md"
                        icon="user"
                        class="w-full justify-center"
                      >
                        Đăng nhập
                      </ActionButton>
                    </div>
                    <div class="px-3">
                      <ActionButton
                        to="/register"
                        @click="mobileMenuOpen = false"
                        variant="success"
                        size="md"
                        icon="sparkles"
                        class="w-full justify-center"
                      >
                        Đăng ký ngay
                      </ActionButton>
                    </div>
                    <div class="px-3 mt-2">
                      <ActionButton
                        to="/admin-register"
                        @click="mobileMenuOpen = false"
                        variant="secondary"
                        size="sm"
                        icon="shield"
                        class="w-full justify-center"
                      >
                        Đăng ký Admin
                      </ActionButton>
                    </div>
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
                    <ActionButton
                      @click="handleLogout"
                      variant="danger"
                      size="md"
                      icon="logout"
                      class="w-full justify-center"
                    >
                      Đăng xuất
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import MobileNavLink from '@/components/common/MobileNavLink.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{ transparent?: boolean }>(), { transparent: false })

const route = useRoute()

// If parent explicitly passes transparent prop, use it. Otherwise make navbar transparent on home route.
const navTransparent = computed(() => {
  if (props.transparent) return true
  return route.path === '/' || route.name === 'Home'
})

const navClass = computed(() => {
  if (navTransparent.value) {
    return 'absolute inset-x-0 top-0 z-50 bg-transparent'
  }
  return 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200/20 dark:border-gray-700/30 sticky top-0 z-50'
})

const linkBaseClass = computed(() => {
  return navTransparent.value
    ? 'flex items-center space-x-2 text-white hover:text-primary-200'
    : 'flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
})

const userInfoBgClass = computed(() => {
  return navTransparent.value ? 'bg-white/10 text-white' : 'bg-gray-50 dark:bg-gray-800'
})

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

onMounted(() => {
  authStore.checkAuth()
})
</script>
