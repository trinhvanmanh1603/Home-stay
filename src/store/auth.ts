import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

const API_BASE_URL = 'http://localhost:3002'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)

  const login = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true
    try {
      // Simulate login API call
      const response = await axios.get<User[]>(`${API_BASE_URL}/users?email=${credentials.email}`)
      const foundUser = response.data.find(u => u.email === credentials.email)
      
      if (foundUser) {
        user.value = foundUser
        isAuthenticated.value = true
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(foundUser))
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        throw new Error('Tài khoản không tồn tại')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (registerData: RegisterData): Promise<void> => {
    loading.value = true
    try {
      // Check if user exists
      const existingUsersResponse = await axios.get<User[]>(`${API_BASE_URL}/users?email=${registerData.email}`)
      if (existingUsersResponse.data.length > 0) {
        throw new Error('Email đã được sử dụng')
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        verified: false,
        role: 'guest',
        createdAt: new Date().toISOString()
      }

      const response = await axios.post<User>(`${API_BASE_URL}/users`, newUser)
      user.value = response.data
      isAuthenticated.value = true
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
      localStorage.setItem('isAuthenticated', 'true')
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const checkAuth = (): void => {
    const storedUser = localStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated')
    
    if (storedUser && storedAuth === 'true') {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user.value) throw new Error('Chưa đăng nhập')
    
    loading.value = true
    try {
      const updatedUser = { ...user.value, ...userData }
      const response = await axios.put<User>(`${API_BASE_URL}/users/${user.value.id}`, updatedUser)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Computed properties for role checking
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin' || user.value?.super_admin === true)
  const isHost = computed(() => user.value?.role === 'host')
  const isGuest = computed(() => user.value?.role === 'guest')
  const isSuperAdmin = computed(() => user.value?.super_admin === true || user.value?.email === 'admin@homestay.com' || user.value?.role === 'super_admin')
  const canManageUsers = computed(() => user.value?.super_admin === true || user.value?.email === 'admin@homestay.com' || user.value?.role === 'super_admin')
  const canManageAdmins = computed(() => user.value?.super_admin === true || user.value?.email === 'admin@homestay.com' || user.value?.role === 'super_admin')
  
  // Permission for homestay management - Super admin can view/access but not modify
  const canCreateHomestays = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canEditHomestays = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canDeleteHomestays = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canViewHomestays = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin') // Both admin and super_admin
  const canAccessHomestayManagement = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin') // Access to management page
  
  // Permission for booking management - Super admin can view/access but not modify
  const canCreateBookings = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canEditBookings = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canDeleteBookings = computed(() => (user.value?.role === 'admin' || user.value?.role === 'super_admin') && !user.value?.super_admin)
  const canViewBookings = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin') // Both admin and super_admin
  const canAccessBookingManagement = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin') // Access to management page

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    isHost,
    isGuest,
    isSuperAdmin,
    canManageUsers,
    canManageAdmins,
    canCreateHomestays,
    canEditHomestays,
    canDeleteHomestays,
    canViewHomestays,
    canAccessHomestayManagement,
    canCreateBookings,
    canEditBookings,
    canDeleteBookings,
    canViewBookings,
    canAccessBookingManagement,
    login,
    register,
    logout,
    checkAuth,
    updateProfile
  }
})
