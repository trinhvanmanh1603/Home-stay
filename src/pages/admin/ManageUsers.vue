<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Quản lý Người dùng
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <input v-model="searchQuery" 
                   type="text" 
                   placeholder="Tên, email, SĐT..."
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vai trò
            </label>
            <select v-model="selectedRole" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="guest">Khách hàng</option>
              <option value="host">Chủ nhà</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select v-model="selectedStatus" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tất cả</option>
              <option value="verified">Đã xác thực</option>
              <option value="unverified">Chưa xác thực</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="clearFilters" 
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredUsers.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Tổng người dùng</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ guestUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Khách hàng</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ hostUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Chủ nhà</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ adminUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Quản trị viên</div>
        </div>
      </div>

      <!-- Users List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Danh sách Người dùng ({{ filteredUsers.length }})
          </h3>
        </div>
        
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">Không tìm thấy người dùng nào</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="user in paginatedUsers" :key="user.id" 
               class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <img v-if="user.avatar" 
                       :src="user.avatar" 
                       :alt="user.firstName"
                       class="w-12 h-12 rounded-full object-cover">
                  <span v-else class="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ user.firstName }} {{ user.lastName }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ user.email }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.phone }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="flex items-center space-x-2 mb-2">
                    <span :class="getRoleBadgeClass(user.role)" 
                          class="px-2 py-1 text-xs rounded-full">
                      {{ getRoleText(user.role) }}
                    </span>
                    <span :class="user.verified ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'" 
                          class="px-2 py-1 text-xs rounded-full">
                      {{ user.verified ? 'Đã xác thực' : 'Chưa xác thực' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tham gia: {{ formatDate(user.createdAt) }}
                  </p>
                </div>
                
                <div class="flex space-x-1">
                  <button @click="editUser(user)" 
                          class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  
                  <button v-if="!user.verified" 
                          @click="verifyUser(user.id)"
                          class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  
                  <button v-if="user.id !== authStore.user?.id" 
                          @click="deleteUser(user.id)" 
                          class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} 
              trong {{ filteredUsers.length }} kết quả
            </div>
            <div class="flex space-x-2">
              <button @click="currentPage--" 
                      :disabled="currentPage === 1"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button v-for="page in visiblePages" :key="page"
                      @click="currentPage = page"
                      :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded">
                {{ page }}
              </button>
              <button @click="currentPage++" 
                      :disabled="currentPage === totalPages"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Chỉnh sửa người dùng
        </h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vai trò
            </label>
            <select v-model="editingUser.role" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="guest">Khách hàng</option>
              <option value="host">Chủ nhà</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          
          <div>
            <label class="flex items-center">
              <input v-model="editingUser.verified" 
                     type="checkbox" 
                     class="rounded border-gray-300 text-blue-600 mr-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">Đã xác thực</span>
            </label>
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <button type="button" 
                    @click="showEditModal = false"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Hủy
            </button>
            <button type="submit" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lưu
            </button>
          </div>
        </form>
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { 
  PencilIcon, 
  TrashIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import type { User } from '@/types'

const authStore = useAuthStore()
const users = ref<User[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showEditModal = ref(false)
const editingUser = ref<Partial<User>>({})

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationConfig = ref({
  type: 'danger' as 'success' | 'danger' | 'warning' | 'info',
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

const loadUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3002/users')
    users.value = response.data
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => 
      selectedStatus.value === 'verified' ? user.verified : !user.verified
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const guestUsers = computed(() => 
  users.value.filter(user => user.role === 'guest').length
)

const hostUsers = computed(() => 
  users.value.filter(user => user.role === 'host').length
)

const adminUsers = computed(() => 
  users.value.filter(user => user.role === 'admin').length
)

const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'host':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'guest':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getRoleText = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên'
    case 'host':
      return 'Chủ nhà'
    case 'guest':
      return 'Khách hàng'
    default:
      return role
  }
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const saveUser = async () => {
  try {
    await axios.put(`http://localhost:3002/users/${editingUser.value.id}`, editingUser.value)
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = editingUser.value as User
    }
    showEditModal.value = false
  } catch (error) {
    console.error('Error updating user:', error)
    openConfirmationModal({
      type: 'danger',
      title: 'Lỗi cập nhật',
      message: 'Có lỗi xảy ra khi cập nhật người dùng',
      details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })
  }
}

const verifyUser = async (userId: string) => {
  try {
    await axios.patch(`http://localhost:3002/users/${userId}`, {
      verified: true
    })
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.verified = true
    }
  } catch (error) {
    console.error('Error verifying user:', error)
    openConfirmationModal({
      type: 'danger',
      title: 'Lỗi xác thực',
      message: 'Có lỗi xảy ra khi xác thực người dùng',
      details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
      onConfirm: () => {
        showConfirmationModal.value = false
      }
    })
  }
}

const deleteUser = async (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  
  openConfirmationModal({
    type: 'danger',
    title: 'Xác nhận xóa người dùng',
    message: `Bạn có chắc chắn muốn xóa người dùng "${user?.firstName} ${user?.lastName}"?`,
    details: 'Hành động này không thể hoàn tác. Tất cả dữ liệu của người dùng sẽ bị xóa vĩnh viễn.',
    onConfirm: async () => {
      try {
        await axios.delete(`http://localhost:3002/users/${userId}`)
        users.value = users.value.filter(user => user.id !== userId)
        showConfirmationModal.value = false
      } catch (error) {
        console.error('Error deleting user:', error)
        openConfirmationModal({
          type: 'danger',
          title: 'Lỗi xóa người dùng',
          message: 'Có lỗi xảy ra khi xóa người dùng',
          details: 'Vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.',
          onConfirm: () => {
            showConfirmationModal.value = false
          }
        })
      }
    }
  })
}

onMounted(() => {
  loadUsers()
})
</script>
