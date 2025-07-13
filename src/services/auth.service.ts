/**
 * Authentication Service for handling auth operations
 */
import { authApiService } from './api.service'
import type { User, LoginCredentials, RegisterData } from '@/types'

export class AuthService {
  private apiService = authApiService

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // In a real app, this would call your auth API
    const users = await this.apiService.get<User[]>('/users')
    const user = users.find(u => 
      u.email === credentials.email && 
      // In real app, you'd hash and compare passwords
      credentials.password === 'password'
    )

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }

    if (!user.verified) {
      throw new Error('Tài khoản chưa được xác thực')
    }

    // Generate mock token
    const token = this.generateMockToken(user)

    return { user, token }
  }

  async register(userData: RegisterData): Promise<User> {
    // Check if email already exists
    const users = await this.apiService.get<User[]>('/users')
    const existingUser = users.find(u => u.email === userData.email)

    if (existingUser) {
      throw new Error('Email đã được sử dụng')
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      avatar: '',
      verified: false,
      role: 'guest',
      createdAt: new Date().toISOString()
    }

    return await this.apiService.post<User>('/users', newUser)
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.apiService.get<User>(`/users/${userId}`)
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = { ...user, ...userData }
    return await this.apiService.put<User>(`/users/${userId}`, updatedUser)
  }

  private generateMockToken(user: User): string {
    // In a real app, this would be a JWT token from your backend
    return btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }))
  }

  validateToken(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token))
      return decoded.exp > Date.now()
    } catch {
      return false
    }
  }

  getUserFromToken(token: string): Partial<User> | null {
    try {
      const decoded = JSON.parse(atob(token))
      if (decoded.exp <= Date.now()) {
        return null
      }
      return {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()
