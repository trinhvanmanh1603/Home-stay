/**
 * Stay Service for handling stay/homestay operations
 */
import { mainApiService } from './api.service'
import type { Stay, SearchFilters } from '@/types'

export class StayService {
  private apiService = mainApiService

  async getStays(): Promise<Stay[]> {
    return await this.apiService.get<Stay[]>('/stays')
  }

  async getStayById(id: string): Promise<Stay> {
    return await this.apiService.get<Stay>(`/stays/${id}`)
  }

  async createStay(stayData: Omit<Stay, 'id'>): Promise<Stay> {
    const newStay: Stay = {
      ...stayData,
      id: Date.now().toString()
    }
    
    return await this.apiService.post<Stay>('/stays', newStay)
  }

  async updateStay(stayId: string, stayData: Partial<Stay>): Promise<Stay> {
    const stay = await this.getStayById(stayId)
    const updatedStay = { ...stay, ...stayData }
    
    return await this.apiService.put<Stay>(`/stays/${stayId}`, updatedStay)
  }

  async deleteStay(stayId: string): Promise<void> {
    await this.apiService.delete(`/stays/${stayId}`)
  }

  searchStays(stays: Stay[], filters: SearchFilters): Stay[] {
    return stays.filter(stay => {
      // Location filter
      if (filters.location && !stay.location.toLowerCase().includes(filters.location.toLowerCase()) &&
          !stay.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Price range filter
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange
        if (stay.price < minPrice || stay.price > maxPrice) {
          return false
        }
      }

      // Guest capacity filter
      if (filters.guests && stay.maxGuests < filters.guests) {
        return false
      }

      // Stay type filter
      if (filters.stayType && filters.stayType !== 'all' && stay.type !== filters.stayType) {
        return false
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          stay.amenities.includes(amenity)
        )
        if (!hasAllAmenities) {
          return false
        }
      }

      // Date availability filter (basic check)
      if (filters.checkIn && filters.checkOut) {
        const checkIn = new Date(filters.checkIn)
        const checkOut = new Date(filters.checkOut)
        
        // Check if any of the unavailable dates fall within the requested range
        const hasConflict = stay.unavailableDates.some(unavailableDate => {
          const date = new Date(unavailableDate)
          return date >= checkIn && date <= checkOut
        })
        
        if (hasConflict) {
          return false
        }
      }

      return true
    })
  }

  getStaysByBrand(stays: Stay[], brand: string): Stay[] {
    return stays.filter(stay => stay.brand === brand)
  }

  getPopularStays(stays: Stay[], limit: number = 6): Stay[] {
    return stays
      .filter(stay => stay.available)
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit)
  }

  getFeaturedStays(stays: Stay[], limit: number = 4): Stay[] {
    return stays
      .filter(stay => stay.available && stay.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  checkAvailability(stay: Stay, checkIn: string, checkOut: string): boolean {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    
    return !stay.unavailableDates.some(unavailableDate => {
      const date = new Date(unavailableDate)
      return date >= checkInDate && date <= checkOutDate
    })
  }
}

export const stayService = new StayService()
