# 🏠 HomeStay Booking Website

Dự án website đặt phòng Homestay được xây dựng với Vue.js 3, TypeScript, Tailwind CSS và tích hợp đầy đủ chức năng thanh toán và kiểm tra phòng trống.

## ✨ Tính năng chính

### 🔐 **Hệ thống Đăng ký/Đăng nhập**
- Đăng ký tài khoản mới với email, họ tên, số điện thoại
- Đăng nhập với email/password hoặc tài khoản demo
- Phân quyền: Guest (khách), Host (chủ nhà), Brand Admin, Super Admin
- Role-based access control với brand segregation
- Persistent session với localStorage

### 👑 **Quản lý Admin đa cấp**
- **Super Admin**: Toàn quyền xem dữ liệu, quản lý users, KHÔNG thao tác bookings
- **Brand Admin**: Quản lý homestays và bookings chỉ trong brand của mình
- Admin registration với brand assignment
- Brand-based data filtering và statistics

### 🏡 **Quản lý Homestay**
- Danh sách 6+ homestay với thông tin chi tiết
- Tìm kiếm và lọc theo vị trí, giá, tiện nghi
- Hình ảnh gallery, đánh giá, thông tin host
- View responsive trên mobile/desktop

### 📅 **Kiểm tra Phòng trống**
- Real-time availability checking
- Conflict detection với booking hiện tại
- Suggested dates khi không có phòng
- Integration với unavailable dates

### 💳 **Hệ thống Thanh toán**
- Đặt cọc 30% trước, thanh toán phần còn lại sau
- Nhiều phương thức: Chuyển khoản, Thẻ tín dụng, PayPal, Tiền mặt
- Payment history tracking
- Refund processing
- SSL security và validation

### 📱 **Booking Management**
- 4-step booking flow: Availability → Info → Payment → Confirmation
- Guest information collection
- Special requests handling
- Email confirmation
- Booking status tracking

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 18
- npm >= 8

### Cài đặt dependencies
```bash
cd home-stay-frontend
npm install
```

### Chạy development
```bash
# Chạy Vue.js dev server
npm run dev

# Chạy JSON Server (database)
npm run server

# Hoặc chạy cả 2 cùng lúc
npm run dev:full
```

### Build production
```bash
npm run build
npm run preview
```

## 🌐 Services

- **Frontend**: http://localhost:5174 (Vue.js)
- **API**: http://localhost:3002 (JSON Server)
- **Database**: `data/db.json`

## 📊 API Endpoints

```
GET    /stays          # Danh sách homestays
GET    /stays/:id      # Chi tiết homestay
POST   /bookings       # Tạo booking mới
GET    /bookings       # Danh sách bookings
PUT    /bookings/:id   # Cập nhật booking
POST   /payments       # Tạo payment
GET    /payments       # Lịch sử payments
POST   /users          # Đăng ký user
GET    /users          # Danh sách users
```

## 🎯 Demo Accounts

### Khách (Guest)
- **Email**: guest@demo.com
- **Role**: guest
- **Chức năng**: Tìm kiếm, đặt phòng, thanh toán

### Chủ nhà (Host)
- **Email**: host@demo.com  
- **Role**: host
- **Chức năng**: Quản lý homestay, xem bookings

### Super Admin
- **Email**: admin@homestay.com
- **Role**: admin (super_admin: true)
- **Chức năng**: 
  - Xem tất cả homestays và bookings (toàn hệ thống)
  - Quản lý users và admin requests
  - KHÔNG được phép thay đổi trạng thái bookings (chỉ xem)
  - Truy cập dashboard và reports tổng thể

### Brand Admin
- **Email**: mmmmanh345@gmail.com (VinhHomes)
- **Email**: vu@gmail.com (SunGroup)  
- **Email**: manh@example.com (luxyry)
- **Role**: admin (super_admin: false, có brand)
- **Chức năng**:
  - Chỉ xem homestays và bookings của brand mình
  - Xác nhận, hủy, hoàn thành bookings của brand
  - Dashboard và reports theo brand
  - KHÔNG được quản lý users

## 🏗️ Cấu trúc Project

```
src/
├── components/          # Vue components
│   ├── Navbar.vue      # Navigation bar
│   ├── SearchBar.vue   # Tìm kiếm homestay
│   ├── StayCard.vue    # Card hiển thị homestay
│   ├── PaymentForm.vue # Form thanh toán
│   ├── AvailabilityChecker.vue # Kiểm tra phòng trống
│   └── BookingModal.vue # Modal đặt phòng
├── pages/              # Vue pages
│   ├── Home.vue        # Trang chủ
│   ├── StayList.vue    # Danh sách homestay
│   ├── StayDetail.vue  # Chi tiết homestay
│   ├── Login.vue       # Đăng nhập
│   ├── Register.vue    # Đăng ký
│   └── Booking.vue     # Trang booking
├── store/              # Pinia stores
│   ├── auth.ts         # Authentication
│   ├── stays.ts        # Homestay management
│   ├── booking.ts      # Booking management
│   ├── payment.ts      # Payment processing
│   ├── availability.ts # Availability checking
│   └── theme.ts        # Dark/Light mode
├── types/              # TypeScript types
│   └── index.ts        # All interfaces
└── router/             # Vue Router
    └── index.ts        # Route definitions
```

## 💾 Database Schema

### Stays
```typescript
{
  id: string
  title: string
  description: string
  location: string
  city: string
  price: number
  rating: number
  type: "villa" | "apartment" | "house"
  images: string[]
  amenities: string[]
  host: { name, avatar, verified }
  maxGuests: number
  bedrooms: number
  bathrooms: number
  available: boolean
  unavailableDates: string[]
}
```

### Bookings
```typescript
{
  id: string
  stayId: string
  guestInfo: { firstName, lastName, email, phone }
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  depositAmount: number
  remainingAmount: number
  status: "pending" | "confirmed" | "cancelled"
  paymentStatus: "unpaid" | "deposit_paid" | "fully_paid"
  paymentHistory: Payment[]
  specialRequests?: string
  createdAt: string
}
```

### Payments
```typescript
{
  id: string
  bookingId: string
  amount: number
  type: "deposit" | "remaining" | "refund"
  method: "bank_transfer" | "credit_card" | "paypal" | "cash"
  status: "pending" | "completed" | "failed"
  transactionId?: string
  createdAt: string
  processedAt?: string
  description: string
}
```

## 🎨 Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Composition API
- **Styling**: Tailwind CSS v3 + HeadlessUI
- **Icons**: Heroicons
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Database**: JSON Server (mock API)
- **Utilities**: VueUse

## 🔧 Scripts Có sẵn

```bash
npm run dev          # Chạy Vue.js dev server
npm run build        # Build production
npm run preview      # Preview production build
npm run server       # Chạy JSON Server
npm run dev:full     # Chạy cả dev server và JSON server
```

## 🌟 Highlights

- ✅ **Full TypeScript** với strict type checking
- ✅ **Responsive Design** hoạt động tốt trên mọi thiết bị
- ✅ **Dark/Light Mode** với persistent preference
- ✅ **Real-time Validation** cho forms và payments
- ✅ **Error Handling** comprehensive
- ✅ **Loading States** cho UX tốt
- ✅ **Accessibility** tuân thủ WCAG
- ✅ **SEO Friendly** với proper meta tags
- ✅ **Performance Optimized** với code splitting

## 🐛 Troubleshooting

### Port conflicts
Nếu port 5174 hoặc 3002 đã được sử dụng:
```bash
# Change frontend port
npm run dev -- --port 5175

# Change API port  
npm run server -- --port 3003
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database issues
```bash
# Reset database to default
git checkout HEAD -- data/db.json
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Verify services đang chạy
3. Check network requests trong DevTools
4. Restart development servers

## 🎉 Demo

Website đang chạy tại: http://localhost:5174

**Happy Booking! 🏠✨**
