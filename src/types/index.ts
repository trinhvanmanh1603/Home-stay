/**
 * Core entity types - the main business objects
 */

export interface Stay {
  id: string
  title: string
  description: string
  location: string
  city: string
  price: number
  rating: number
  reviewCount: number
  type: string
  images: string[]
  amenities: string[]
  brand?: string // Thương hiệu của homestay
  host: {
    name: string
    avatar: string
    verified: boolean
  }
  maxGuests: number
  bedrooms: number
  bathrooms: number
  available: boolean
  unavailableDates: string[] // Thêm để check phòng trống
}

export interface SearchFilters {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  priceRange: [number, number]
  stayType: string
  amenities: string[]
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  type: 'deposit' | 'remaining' | 'refund'
  method: 'bank_transfer' | 'credit_card' | 'paypal' | 'cash'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  transactionId?: string
  createdAt: string
  processedAt?: string
  description: string
}

export interface AvailabilityCheck {
  stayId: string
  checkIn: string
  checkOut: string
  available: boolean
  conflictingDates: string[]
  suggestedDates?: {
    checkIn: string
    checkOut: string
  }[]
}

export interface Host {
  name: string
  avatar: string
  verified: boolean
  joinedDate: string
  responseRate: number
  responseTime: string
}

// Re-export specialized types from other modules
export type { User, LoginCredentials, RegisterData, AdminRequest } from './auth'
export type { Booking, BookingData, AdminComment, RecentBooking } from './booking'
export type { Stats, ConfirmationModalConfig } from './admin'
export type { Review, StayRating } from './review'
export type { 
  BookingModalProps, 
  BookingModalEmits,
  AvailabilityCheckerProps,
  AvailabilityCheckerEmits,
  StayCardProps,
  PaymentFormProps,
  PaymentFormEmits,
  ConfirmationModalProps,
  ReviewSectionProps,
  RatingDisplayProps,
  PaymentData
} from './components'
