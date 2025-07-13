/**
 * Review and rating related types
 */

export interface Review {
  id: string
  stayId: string
  guestId: string
  guestName: string
  rating: number
  comment: string
  adminReply?: string
  createdAt: string
}

export interface StayRating {
  stayId: string
  averageRating: number
  totalReviews: number
  roundedRating: number
}
