import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Payment } from '@/types'
import { paymentService } from '@/services'

export const usePaymentStore = defineStore('payment', () => {
  const loading = ref<boolean>(false)
  const payments = ref<Payment[]>([])
  const currentPayment = ref<Payment | null>(null)

  const processDeposit = async (
    bookingId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> => {
    loading.value = true
    try {
      const payment = await paymentService.processDeposit(bookingId, amount, method)
      
      // Update booking payment status
      await updateBookingPaymentStatus(bookingId, 'deposit_paid')
      
      payments.value.push(payment)
      currentPayment.value = payment
      
      return payment
    } catch (error) {
      console.error('Error processing deposit:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const processRemainingPayment = async (
    bookingId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> => {
    loading.value = true
    try {
      const payment = await paymentService.processRemainingPayment(bookingId, amount, method)
      
      // Update booking payment status
      await updateBookingPaymentStatus(bookingId, 'fully_paid')
      
      payments.value.push(payment)
      currentPayment.value = payment
      
      return payment
    } catch (error) {
      console.error('Error processing remaining payment:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const processRefund = async (
    bookingId: string,
    amount: number,
    reason: string
  ): Promise<Payment> => {
    loading.value = true
    try {
      const payment = await paymentService.processRefund(bookingId, amount, reason)
      
      // Update booking payment status
      await updateBookingPaymentStatus(bookingId, 'refunded')
      
      payments.value.push(payment)
      currentPayment.value = payment
      
      return payment
    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getPaymentHistory = async (bookingId: string): Promise<Payment[]> => {
    try {
      return await paymentService.getPaymentHistory(bookingId)
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }

  // This should be moved to booking service/store, but keeping for compatibility
  const updateBookingPaymentStatus = async (
    bookingId: string,
    paymentStatus: 'deposit_paid' | 'fully_paid' | 'refunded'
  ): Promise<void> => {
    try {
      const { bookingService } = await import('@/services')
      await bookingService.updateBookingPaymentStatus(bookingId, paymentStatus)
    } catch (error) {
      console.error('Error updating booking payment status:', error)
      throw error
    }
  }

  const calculateDepositAmount = (totalPrice: number, percentage: number = 30): number => {
    return paymentService.calculateDepositAmount(totalPrice, percentage)
  }

  const calculatePaymentAmount = (totalPrice: number, percentage: 50 | 100): number => {
    return paymentService.calculatePaymentAmount(totalPrice, percentage)
  }

  const getPaymentMethods = () => {
    return paymentService.getPaymentMethods()
  }

  return {
    loading,
    payments,
    currentPayment,
    processDeposit,
    processRemainingPayment,
    processRefund,
    getPaymentHistory,
    calculateDepositAmount,
    calculatePaymentAmount,
    getPaymentMethods
  }
})
