/**
 * Admin dashboard and management types
 */

export interface Stats {
  totalStays: number
  totalBookings: number
  totalUsers: number
  totalRevenue: number
}

export interface AdminRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface ConfirmationModalConfig {
  type: 'success' | 'danger' | 'warning' | 'info'
  title: string
  message: string
  details: string
  onConfirm: () => void
}
