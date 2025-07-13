/**
 * Admin dashboard and management types
 */

export interface Stats {
  totalStays: number
  totalBookings: number
  totalUsers: number
  totalRevenue: number
}

export interface ConfirmationModalConfig {
  type: 'success' | 'danger' | 'warning' | 'info'
  title: string
  message: string
  details: string
  onConfirm: () => void
}
