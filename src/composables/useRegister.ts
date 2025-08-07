import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useRegister() {
  const router = useRouter()
  const authStore = useAuthStore()

  // State
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  })

  // Computed
  const canSubmit = computed(() => {
    return Boolean(form.value.firstName && 
                   form.value.lastName && 
                   form.value.email && 
                   form.value.password && 
                   form.value.confirmPassword && 
                   form.value.phone && 
                   form.value.agreeToTerms && 
                   form.value.password === form.value.confirmPassword &&
                   form.value.password.length >= 6 &&
                   !loading.value)
  })

  const passwordsMatch = computed(() => {
    return form.value.password === form.value.confirmPassword
  })

  const isValidPassword = computed(() => {
    return form.value.password.length >= 6
  })

  // Methods
  const resetForm = () => {
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false
    }
    errorMessage.value = ''
    successMessage.value = ''
  }

  const validateForm = (): string | null => {
    if (!form.value.firstName.trim()) return 'Vui lòng nhập họ'
    if (!form.value.lastName.trim()) return 'Vui lòng nhập tên'
    if (!form.value.email.trim()) return 'Vui lòng nhập email'
    if (!form.value.password) return 'Vui lòng nhập mật khẩu'
    if (form.value.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    if (form.value.password !== form.value.confirmPassword) return 'Mật khẩu xác nhận không khớp'
    if (!form.value.phone.trim()) return 'Vui lòng nhập số điện thoại'
    if (!form.value.agreeToTerms) return 'Vui lòng đồng ý với điều khoản sử dụng'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      errorMessage.value = validationError
      return
    }

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      await authStore.register({
        firstName: form.value.firstName.trim(),
        lastName: form.value.lastName.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        phone: form.value.phone.trim()
      })

      successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...'
      
      // Redirect after success
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error: any) {
      console.error('Register error:', error)
      errorMessage.value = error.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  const initializeRegister = () => {
    // If already logged in, redirect to home
    if (authStore.isAuthenticated) {
      router.push('/')
      return
    }
    resetForm()
  }

  return {
    // State
    loading,
    errorMessage,
    successMessage,
    form,
    
    // Computed
    canSubmit,
    passwordsMatch,
    isValidPassword,
    
    // Methods
    resetForm,
    handleSubmit,
    initializeRegister
  }
}
