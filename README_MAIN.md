# HomeStay Frontend - Website Đặt Phòng Homestay

Website đặt phòng homestay được xây dựng với Vue.js 3, TypeScript và các thư viện hiện đại.

## 🔧 Stack Công Nghệ

- **Vue 3** (Composition API + TypeScript)
- **Vue Router** - Điều hướng
- **Pinia** - Quản lý state  
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Heroicons** - Icons
- **Headless UI** - Accessible components
- **VueUse** - Composition utilities
- **json-server** - Mock API
- **Vite** - Build tool

## 🚀 Khởi động nhanh

```bash
# Cài đặt dependencies
npm install

# Khởi động development (cả API server và Vue app)
npm run dev:full
```

**Ứng dụng**: http://localhost:5173/  
**API Server**: http://localhost:3001/

## 📦 Scripts

```bash
npm run dev:full    # Chạy cả JSON server và Vue dev server
npm run dev         # Chỉ Vue development server
npm run server      # Chỉ JSON server (port 3001)
npm run build       # Build production
npm run preview     # Preview production build
```

## 🗃️ Database & API

Tất cả dữ liệu nằm trong `data/db.json` và phục vụ qua json-server trên port 3001:

- `/stays` - Homestays
- `/bookings` - Đặt phòng
- `/reviews` - Đánh giá  
- `/users` - Users
- `/admin-requests` - Yêu cầu admin

## 📁 Cấu trúc thư mục

```
src/
├── components/     # UI components
├── pages/         # Route pages
│   └── admin/     # Admin pages
├── store/         # Pinia stores
├── services/      # API services
├── types/         # TypeScript types
├── composables/   # Composition functions
└── constants/     # Constants & configs

data/
└── db.json        # Database (tất cả data)
```

## ✨ Tính năng chính

### Khách hàng:
- 🏠 Browse và tìm kiếm homestays
- 📅 Đặt phòng với calendar picker
- 💳 Thanh toán và quản lý booking
- ⭐ Xem và tạo reviews
- 👤 Quản lý profile

### Admin:
- 🏢 Quản lý homestays (CRUD)
- 📊 Dashboard và báo cáo
- 👥 Quản lý users
- 📋 Quản lý bookings
- ✅ Phê duyệt admin requests

### Chung:
- 🌙 Dark/Light mode
- 📱 Responsive design
- 🔐 Authentication system
- 🎨 Modern UI với Tailwind CSS

## 🛠️ Development

### Code Style:
- TypeScript cho type safety
- Vue 3 Composition API với `<script setup>`
- Tailwind CSS cho styling
- ESLint + Prettier

### Component Guidelines:
- PascalCase cho tên component
- Props với TypeScript types
- Emit events cho parent communication
- Slots cho flexible content

## 🔧 Troubleshooting

### Port conflicts:
```bash
# Kiểm tra process đang dùng port
netstat -ano | findstr :3001

# Kill process  
taskkill /PID [PID_NUMBER] /F
```

### Reset development:
```bash
# Dừng tất cả node processes
Get-Process -Name node | Stop-Process -Force

# Restart
npm run dev:full
```

## 📝 Notes

- Dữ liệu được lưu trong `data/db.json` và auto-sync khi có thay đổi
- Authentication sử dụng localStorage (development only)
- Images sử dụng Unsplash placeholders
- Responsive breakpoints: mobile (0-768px), tablet (768-1024px), desktop (1024px+)

---

*Vue.js 3 + TypeScript + Tailwind CSS Homestay Booking Platform*
