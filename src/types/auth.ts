/**
 * Authentication related types
 */

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar?: string
  verified: boolean
  role: 'guest' | 'host' | 'admin' | 'super_admin'
  super_admin?: boolean // Thêm trường này cho super admin
  brand?: string // Thương hiệu - chỉ dành cho admin
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
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
