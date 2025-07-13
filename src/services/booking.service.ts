/**
 * Booking Service for handling booking operations
 */
import { mainApiService } from './api.service'
import type { Booking } from '@/types'

export class BookingService {
  private apiService = mainApiService

  async createBooking(
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'paymentHistory' | 'depositAmount' | 'remainingAmount'>,
    depositAmount: number,
    remainingAmount: number,
    paymentStatus: Booking['paymentStatus']
  ): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus,
      depositAmount,
      remainingAmount,
      paymentHistory: []
      // Stay object will be embedded based on input data
    }
    
    return await this.apiService.post<Booking>('/bookings', newBooking)
  }

  async getBookings(): Promise<Booking[]> {
    return await this.apiService.get<Booking[]>('/bookings')
  }

  async getBookingById(id: string): Promise<Booking> {
    return await this.apiService.get<Booking>(`/bookings/${id}`)
  }

  async updateBookingStatus(
    bookingId: string, 
    status: Booking['status']
  ): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)
    const updatedBooking = { ...booking, status }
    
    return await this.apiService.put<Booking>(`/bookings/${bookingId}`, updatedBooking)
  }

  async updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: Booking['paymentStatus']
  ): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)
    
    // Determine new booking status based on payment status
    let newStatus = booking.status
    if (paymentStatus === 'deposit_paid') {
      newStatus = 'pending'
    } else if (paymentStatus === 'fully_paid') {
      newStatus = 'confirmed'
    } else if (paymentStatus === 'refunded') {
      newStatus = 'cancelled'
    }

    const updatedBooking = {
      ...booking,
      paymentStatus,
      status: newStatus
    }
    
    return await this.apiService.put<Booking>(`/bookings/${bookingId}`, updatedBooking)
  }

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)
    const updatedBooking = {
      ...booking,
      status: 'cancelled' as const,
      cancellationReason: reason
    }
    
    return await this.apiService.put<Booking>(`/bookings/${bookingId}`, updatedBooking)
  }

  getBookingsByDateRange(bookings: Booking[], startDate: string, endDate: string): Booking[] {
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.checkIn)
      const bookingEnd = new Date(booking.checkOut)
      const rangeStart = new Date(startDate)
      const rangeEnd = new Date(endDate)

      return (
        (booking.status === 'confirmed' || booking.status === 'completed') &&
        ((bookingStart >= rangeStart && bookingStart <= rangeEnd) ||
         (bookingEnd >= rangeStart && bookingEnd <= rangeEnd) ||
         (bookingStart <= rangeStart && bookingEnd >= rangeEnd))
      )
    })
  }

  calculateBookingStats(bookings: Booking[]) {
    const total = bookings.length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const pending = bookings.filter(b => b.status === 'pending').length
    const cancelled = bookings.filter(b => b.status === 'cancelled').length
    const depositPaid = bookings.filter(b => b.paymentStatus === 'deposit_paid').length
    
    // Tính doanh thu từ số tiền đã thanh toán thực tế
    const totalRevenue = bookings
      .filter(b => ['confirmed', 'completed'].includes(b.status))
      .reduce((sum, b) => {
        if (b.paymentStatus === 'fully_paid') {
          return sum + b.totalPrice
        } else if (b.paymentStatus === 'deposit_paid') {
          return sum + b.depositAmount
        }
        return sum
      }, 0)
    
    const pendingRevenue = bookings
      .filter(b => b.paymentStatus === 'deposit_paid')
      .reduce((sum, b) => sum + b.remainingAmount, 0)

    return {
      total,
      confirmed,
      pending,
      cancelled,
      depositPaid,
      totalRevenue,
      pendingRevenue
    }
  }
}

export const bookingService = new BookingService()
