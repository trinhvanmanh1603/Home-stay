import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AvailabilityCheck } from '@/types'

const API_BASE_URL = 'http://localhost:3001'

export const useAvailabilityStore = defineStore('availability', () => {
  const loading = ref<boolean>(false)
  const availabilityCache = ref<Map<string, AvailabilityCheck>>(new Map())

  const checkAvailability = async (
    stayId: string, 
    checkIn: string, 
    checkOut: string
  ): Promise<AvailabilityCheck> => {
    const cacheKey = `${stayId}-${checkIn}-${checkOut}`
    
    // Check cache first
    if (availabilityCache.value.has(cacheKey)) {
      return availabilityCache.value.get(cacheKey)!
    }

    loading.value = true
    try {
      // Get stay data and existing bookings
      const [stayResponse, bookingsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/stays/${stayId}`),
        axios.get(`${API_BASE_URL}/bookings?stayId=${stayId}`)
      ])

      const stay = stayResponse.data
      const existingBookings = bookingsResponse.data

      // Check for conflicts with existing bookings
      const requestStart = new Date(checkIn)
      const requestEnd = new Date(checkOut)
      const conflictingDates: string[] = []

      // Check against unavailable dates in stay data
      if (stay.unavailableDates) {
        stay.unavailableDates.forEach((date: string) => {
          const unavailableDate = new Date(date)
          if (unavailableDate >= requestStart && unavailableDate < requestEnd) {
            conflictingDates.push(date)
          }
        })
      }

      // Check against existing confirmed bookings
      existingBookings.forEach((booking: any) => {
        if (booking.status === 'confirmed' || booking.status === 'deposit_paid') {
          const bookingStart = new Date(booking.checkIn)
          const bookingEnd = new Date(booking.checkOut)

          // Check for overlap
          if (
            (requestStart < bookingEnd && requestEnd > bookingStart) ||
            (bookingStart < requestEnd && bookingEnd > requestStart)
          ) {
            // Add all dates in the conflicting booking range
            const current = new Date(Math.max(requestStart.getTime(), bookingStart.getTime()))
            const end = new Date(Math.min(requestEnd.getTime(), bookingEnd.getTime()))
            
            while (current < end) {
              conflictingDates.push(current.toISOString().split('T')[0])
              current.setDate(current.getDate() + 1)
            }
          }
        }
      })

      const isAvailable = conflictingDates.length === 0
      
      // Generate suggested alternative dates if not available
      const suggestedDates = isAvailable ? undefined : generateSuggestedDates(
        checkIn, 
        checkOut, 
        stay.unavailableDates || [],
        existingBookings
      )

      const result: AvailabilityCheck = {
        stayId,
        checkIn,
        checkOut,
        available: isAvailable,
        conflictingDates: [...new Set(conflictingDates)], // Remove duplicates
        suggestedDates
      }

      // Cache the result
      availabilityCache.value.set(cacheKey, result)

      return result
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const generateSuggestedDates = (
    originalCheckIn: string,
    originalCheckOut: string,
    unavailableDates: string[],
    existingBookings: any[]
  ) => {
    const suggestions = []
    const originalStart = new Date(originalCheckIn)
    const originalEnd = new Date(originalCheckOut)
    const nightCount = Math.ceil((originalEnd.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24))

    // Try dates before the original dates
    for (let i = 1; i <= 30; i++) {
      const suggestedStart = new Date(originalStart)
      suggestedStart.setDate(suggestedStart.getDate() - i)
      
      const suggestedEnd = new Date(suggestedStart)
      suggestedEnd.setDate(suggestedEnd.getDate() + nightCount)

      if (isDateRangeAvailable(suggestedStart, suggestedEnd, unavailableDates, existingBookings)) {
        suggestions.push({
          checkIn: suggestedStart.toISOString().split('T')[0],
          checkOut: suggestedEnd.toISOString().split('T')[0]
        })
        
        if (suggestions.length >= 3) break
      }
    }

    // Try dates after the original dates if we need more suggestions
    if (suggestions.length < 3) {
      for (let i = 1; i <= 30; i++) {
        const suggestedStart = new Date(originalEnd)
        suggestedStart.setDate(suggestedStart.getDate() + i)
        
        const suggestedEnd = new Date(suggestedStart)
        suggestedEnd.setDate(suggestedEnd.getDate() + nightCount)

        if (isDateRangeAvailable(suggestedStart, suggestedEnd, unavailableDates, existingBookings)) {
          suggestions.push({
            checkIn: suggestedStart.toISOString().split('T')[0],
            checkOut: suggestedEnd.toISOString().split('T')[0]
          })
          
          if (suggestions.length >= 3) break
        }
      }
    }

    return suggestions
  }

  const isDateRangeAvailable = (
    start: Date,
    end: Date,
    unavailableDates: string[],
    existingBookings: any[]
  ): boolean => {
    // Check against unavailable dates
    const current = new Date(start)
    while (current < end) {
      const dateStr = current.toISOString().split('T')[0]
      if (unavailableDates.includes(dateStr)) {
        return false
      }
      current.setDate(current.getDate() + 1)
    }

    // Check against existing bookings
    for (const booking of existingBookings) {
      if (booking.status === 'confirmed' || booking.status === 'deposit_paid') {
        const bookingStart = new Date(booking.checkIn)
        const bookingEnd = new Date(booking.checkOut)

        if (
          (start < bookingEnd && end > bookingStart) ||
          (bookingStart < end && bookingEnd > start)
        ) {
          return false
        }
      }
    }

    return true
  }

  const clearCache = (): void => {
    availabilityCache.value.clear()
  }

  return {
    loading,
    checkAvailability,
    clearCache
  }
})
