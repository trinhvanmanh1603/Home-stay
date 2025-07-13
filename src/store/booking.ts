import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Booking } from '@/types'
import { bookingService, paymentService } from '@/services'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<Booking[]>([])
  const currentBooking = ref<Booking | null>(null)
  const loading = ref<boolean>(false)

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'paymentHistory' | 'depositAmount' | 'remainingAmount'>,
    paymentPercentage: 50 | 100 = 50
  ): Promise<Booking> => {
    loading.value = true
    try {
      const depositAmount = paymentService.calculatePaymentAmount(bookingData.totalPrice, paymentPercentage)
      const remainingAmount = bookingData.totalPrice - depositAmount
      const paymentStatus = paymentPercentage === 100 ? 'fully_paid' : 'deposit_paid'

      const booking = await bookingService.createBooking(
        bookingData,
        depositAmount,
        remainingAmount,
        paymentStatus
      )
      
      bookings.value.push(booking)
      currentBooking.value = booking
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getBookings = async (): Promise<void> => {
    loading.value = true
    try {
      bookings.value = await bookingService.getBookings()
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      loading.value = false
    }
  }

  const getBookingById = async (id: string): Promise<Booking | null> => {
    try {
      const booking = await bookingService.getBookingById(id)
      
      // Get payment history for this booking
      const paymentHistory = await paymentService.getPaymentHistory(id)
      
      const bookingWithPayments = {
        ...booking,
        paymentHistory
      }
      
      return bookingWithPayments
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  }

  const updateBookingStatus = async (
    bookingId: string, 
    status: Booking['status']
  ): Promise<void> => {
    try {
      const updatedBooking = await bookingService.updateBookingStatus(bookingId, status)
      
      // Update local state
      const index = bookings.value.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        bookings.value[index] = updatedBooking
      }
      
      if (currentBooking.value?.id === bookingId) {
        currentBooking.value = updatedBooking
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  const cancelBooking = async (bookingId: string, reason: string): Promise<void> => {
    try {
      const updatedBooking = await bookingService.cancelBooking(bookingId, reason)
      
      // Update local state
      const index = bookings.value.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        bookings.value[index] = updatedBooking
      }
      
      // If deposit was paid, initiate refund process
      if (updatedBooking.paymentStatus === 'deposit_paid') {
        await paymentService.processRefund(bookingId, updatedBooking.depositAmount, reason)
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }

  const getBookingsByDateRange = (startDate: string, endDate: string): Booking[] => {
    return bookingService.getBookingsByDateRange(bookings.value, startDate, endDate)
  }

  const getBookingStats = () => {
    return bookingService.calculateBookingStats(bookings.value)
  }

  return {
    bookings,
    currentBooking,
    loading,
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getBookingsByDateRange,
    getBookingStats
  }
})
