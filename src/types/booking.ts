/**
 * Booking related types
 */

import type { Stay } from './index'

export interface BookingData {
  stayId?: string
  checkIn: string
  checkOut: string
  guests: number
  nights?: number
  totalPrice: number
  depositAmount?: number
}

export interface Booking {
  id: string
  stayId: string
  stayTitle: string
  stayBrand?: string
  userId?: string // For linking to user
  stay?: Stay
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
  depositAmount: number
  remainingAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded'
  cancellationReason?: string
  adminComments?: AdminComment[]
  specialRequests?: string
  paymentHistory?: any[]
  createdAt: string
}

export interface AdminComment {
  id: string
  adminName: string
  adminEmail: string
  comment: string
  createdAt: string
}

export interface RecentBooking {
  id: string
  guestName: string
  stayTitle: string
  totalPrice: number
  status: string
}
