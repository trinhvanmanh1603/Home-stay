/**
 * Cancellation Service for handling booking cancellation requests
 */
import { mainApiService } from './api.service'

export interface CancellationRequest {
  id: string
  bookingId: string
  userId: string
  reason: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  refundAmount: number
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  booking: {
    id: string
    stayTitle: string
    checkIn: string
    checkOut: string
    totalPrice: number
    depositAmount: number
  }
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export class CancellationService {
  private apiService = mainApiService

  async createCancellationRequest(
    bookingId: string,
    userId: string,
    reason: string,
    booking: any,
    guestInfo: any
  ): Promise<CancellationRequest> {
    // Calculate refund amount (usually deposit amount or based on cancellation policy)
    const refundAmount = booking.depositAmount || booking.totalPrice * 0.5

    const newRequest: CancellationRequest = {
      id: Date.now().toString(),
      bookingId,
      userId,
      reason,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      refundAmount,
      booking: {
        id: booking.id,
        stayTitle: booking.stayTitle,
        checkIn: booking.startDate || booking.checkIn,
        checkOut: booking.endDate || booking.checkOut,
        totalPrice: booking.totalPrice,
        depositAmount: booking.depositAmount || 0
      },
      guestInfo
    }

    return await this.apiService.post<CancellationRequest>('/cancellation-requests', newRequest)
  }

  async getCancellationRequests(): Promise<CancellationRequest[]> {
    return await this.apiService.get<CancellationRequest[]>('/cancellation-requests')
  }

  async getCancellationRequestById(id: string): Promise<CancellationRequest> {
    return await this.apiService.get<CancellationRequest>(`/cancellation-requests/${id}`)
  }

  async getCancellationRequestsByUser(userId: string): Promise<CancellationRequest[]> {
    const requests = await this.getCancellationRequests()
    return requests.filter(request => request.userId === userId)
  }

  async getCancellationRequestByBooking(bookingId: string): Promise<CancellationRequest | null> {
    const requests = await this.getCancellationRequests()
    return requests.find(request => request.bookingId === bookingId) || null
  }

  async updateCancellationRequestStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    rejectionReason?: string
  ): Promise<CancellationRequest> {
    const request = await this.getCancellationRequestById(requestId)
    const updatedRequest = {
      ...request,
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      ...(rejectionReason && { rejectionReason })
    }

    // Update the cancellation request
    const result = await this.apiService.put<CancellationRequest>(`/cancellation-requests/${requestId}`, updatedRequest)

    // If approved, also cancel the booking
    if (status === 'approved') {
      try {
        // Get the booking and update its status
        const booking = await this.apiService.get(`/bookings/${request.bookingId}`)
        const updatedBooking = {
          ...(booking as any),
          status: 'cancelled',
          cancellationReason: request.reason
        }
        await this.apiService.put(`/bookings/${request.bookingId}`, updatedBooking)
      } catch (error) {
        console.error('Error updating booking status:', error)
        // Note: We still return the updated request even if booking update fails
        // Admin can manually update booking status if needed
      }
    }

    return result
  }
}

export const cancellationService = new CancellationService()
