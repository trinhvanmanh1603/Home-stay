/**
 * API Service for handling HTTP requests
 */
import axios, { AxiosResponse } from 'axios'

export class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`)
    return response.data
  }

  async post<T, D = any>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<T> = await axios.post(`${this.baseURL}${endpoint}`, data)
    return response.data
  }

  async put<T, D = any>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<T> = await axios.put(`${this.baseURL}${endpoint}`, data)
    return response.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await axios.delete(`${this.baseURL}${endpoint}`)
    return response.data
  }

  async patch<T, D = any>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<T> = await axios.patch(`${this.baseURL}${endpoint}`, data)
    return response.data
  }
}

// Export configured instances
export const mainApiService = new ApiService('http://localhost:3001')
export const authApiService = new ApiService('http://localhost:3002')
