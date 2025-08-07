import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export function useLogin() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  // State
  const loading = ref(false)
  const errorMessage = ref('')
  const rememberMe = ref(false)

  const form = ref({
    email: '',
    password: ''
  })

  // Computed
  const canSubmit = computed(() => {
    return Boolean(form.value.email && 
                   form.value.password && 
                   !loading.value)
  })

  // Methods
  const resetForm = () => {
    form.value = {
      email: '',
      password: ''
    }
    rememberMe.value = false
    errorMessage.value = ''
  }

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      await authStore.login({
        email: form.value.email,
        password: form.value.password,
        rememberMe: rememberMe.value
      })

      // Redirect to intended page or home
      const redirectTo = route.query.redirect as string || '/'
      router.push(redirectTo)

    } catch (error: any) {
      console.error('Login error:', error)
      errorMessage.value = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  const initializeLogin = () => {
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
    rememberMe,
    form,
    
    // Computed
    canSubmit,
    
    // Methods
    resetForm,
    handleSubmit,
    initializeLogin
  }
}
