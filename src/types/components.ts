/**
 * Component Props types
 */

// Booking Modal Props
export interface BookingModalProps {
  isOpen: boolean
  stay: Stay
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
}

export interface BookingModalEmits {
  close: []
  'booking-created': [booking: Booking]
}

// Availability Checker Props
export interface AvailabilityCheckerProps {
  stayId: string
  pricePerNight: number
  maxGuests: number
}

export interface AvailabilityCheckerEmits {
  bookingDataChange: [data: BookingData | null]
}

// Stay Card Props
export interface StayCardProps {
  stay: Stay
}

// Payment Form Props  
export interface PaymentFormProps {
  booking: BookingData
  stay: Stay
}

export interface PaymentFormEmits {
  success: [paymentData: PaymentData]
  cancel: []
}

// Confirmation Modal Props
export interface ConfirmationModalProps {
  isOpen: boolean
  type: 'success' | 'danger' | 'warning' | 'info'
  title: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
}

// Review Section Props
export interface ReviewSectionProps {
  stayId: string
}

// Rating Display Props
export interface RatingDisplayProps {
  rating: number
  reviewCount: number
  showRatingText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Re-export core types
import type { Stay, SearchFilters, Payment, AvailabilityCheck, Host } from './index'
import type { BookingData, Booking } from './booking'

export type { Stay, SearchFilters, Payment, AvailabilityCheck, Host, BookingData, Booking }

// PaymentData interface for Payment Form
export interface PaymentData {
  method: 'credit_card' | 'bank_transfer' | 'e_wallet'
  amount: number
  transactionId: string
}
