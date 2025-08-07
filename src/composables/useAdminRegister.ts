import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { AdminRequest } from '@/types/admin'

export function useAdminRegister() {
  const router = useRouter()

  // State
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    brand: '',
    reason: '',
    acceptTerms: false
  })

  // Computed
  const canSubmit = computed(() => {
    return Boolean(form.value.firstName && 
                   form.value.lastName && 
                   form.value.email && 
                   form.value.phone && 
                   form.value.brand &&
                   form.value.reason && 
                   form.value.acceptTerms &&
                   !loading.value)
  })

  // Methods
  const resetForm = () => {
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      brand: '',
      reason: '',
      acceptTerms: false
    }
    errorMessage.value = ''
    successMessage.value = ''
  }

  const checkExistingUser = async (email: string) => {
    const response = await axios.get(`http://localhost:3001/users?email=${email}`)
    return response.data.length > 0
  }

  const checkExistingRequest = async (email: string) => {
    const response = await axios.get(`http://localhost:3001/admin-requests?email=${email}&status=pending`)
    return response.data.length > 0
  }

  const createAdminRequest = async (formData: typeof form.value): Promise<AdminRequest> => {
    const adminRequest: AdminRequest = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      brand: formData.brand,
      reason: formData.reason,
      status: 'pending',
      requestedAt: new Date().toISOString()
    }

    await axios.post('http://localhost:3001/admin-requests', adminRequest)
    return adminRequest
  }

  const handleSubmit = async () => {
    if (!canSubmit.value) return

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      // Check if email already exists
      const userExists = await checkExistingUser(form.value.email)
      if (userExists) {
        throw new Error('Email này đã được sử dụng')
      }

      // Check if there's already a pending request for this email
      const requestExists = await checkExistingRequest(form.value.email)
      if (requestExists) {
        throw new Error('Đã có yêu cầu admin cho email này đang chờ phê duyệt')
      }

      // Create admin request
      await createAdminRequest(form.value)

      successMessage.value = 'Yêu cầu đã được gửi thành công! Admin tổng sẽ xem xét và phê duyệt trong thời gian sớm nhất.'
      
      // Reset form
      resetForm()

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (error: any) {
      console.error('Error submitting admin request:', error)
      errorMessage.value = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gửi yêu cầu'
    } finally {
      loading.value = false
    }
  }

  const initializeAdminRegister = () => {
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
    
    // Methods
    resetForm,
    handleSubmit,
    initializeAdminRegister
  }
}
