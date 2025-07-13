// Danh sách tiện nghi đồng bộ cho toàn bộ ứng dụng

export interface Amenity {
  key: string
  label: string
}

export const AVAILABLE_AMENITIES: Amenity[] = [
  { key: 'wifi', label: 'WiFi miễn phí' },
  { key: 'aircon', label: 'Điều hòa' },
  { key: 'pool', label: 'Hồ bơi' },
  { key: 'parking', label: 'Chỗ đỗ xe' },
  { key: 'kitchen', label: 'Bếp' },
  { key: 'tv', label: 'TV' },
  { key: 'washing', label: 'Máy giặt' },
  { key: 'balcony', label: 'Ban công' },
  { key: 'garden', label: 'Sân vườn' },
  { key: 'gym', label: 'Phòng gym' },
  { key: 'spa', label: 'Spa' },
  { key: 'beach', label: 'Gần biển' },
  { key: 'restaurant', label: 'Nhà hàng' },
  { key: 'bar', label: 'Quầy bar' },
  { key: 'elevator', label: 'Thang máy' },
  { key: 'pets', label: 'Cho phép thú cưng' }
]

// Export chỉ labels để tương thích với code cũ
export const AMENITY_LABELS = AVAILABLE_AMENITIES.map(amenity => amenity.label)

// Export chỉ keys để mapping
export const AMENITY_KEYS = AVAILABLE_AMENITIES.map(amenity => amenity.key)

// Helper function để convert key thành label
export const getAmenityLabel = (key: string): string => {
  const amenity = AVAILABLE_AMENITIES.find(a => a.key === key)
  return amenity?.label || key
}

// Helper function để convert label thành key
export const getAmenityKey = (label: string): string => {
  const amenity = AVAILABLE_AMENITIES.find(a => a.label === label)
  return amenity?.key || label
}
