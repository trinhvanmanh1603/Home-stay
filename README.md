# HomeStay Frontend - Website Đặt Phòng Homestay

Trang web đặt phòng homestay được xây dựng bằng Vue.js 3, Tailwind CSS và các thư viện hiện đại. Dữ liệu tạm thời sử dụng json-server.

## 🔧 Stack Công Nghệ

- **Vue 3** (Composition API với TypeScript)
- **Vue Router** - Điều hướng
- **Pinia** - Quản lý state
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Heroicons** - Icons
- **Headless UI** - Accessible components
- **VueUse** - Composition utilities
- **json-server** - Mock API
- **Vite** - Build tool

## 📦 Tính Năng

1. **Trang chủ** với thanh tìm kiếm (địa điểm, ngày check-in/out, số lượng khách)
2. **Danh sách homestay** với hình ảnh, giá, đánh giá, bộ lọc (giá, loại, khu vực...)
3. **Trang chi tiết homestay**: ảnh, mô tả, đánh giá, tiện ích, form đặt phòng
4. **Trang đặt phòng**: điền thông tin và xác nhận đặt
5. **Thiết kế responsive** cho mobile, tablet, desktop
6. **Dark mode** (hỗ trợ chuyển đổi chế độ sáng/tối)
7. **Component tái sử dụng** (StayCard, SearchBar, Navbar...)
8. **Dữ liệu mock** từ json-server

## 🚀 Cài Đặt và Chạy

### Yêu cầu
- Node.js >= 16
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
# Chỉ chạy frontend
npm run dev

# Chỉ chạy json-server (API mock)
npm run server

# Chạy cả frontend và backend
npm run dev:full
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📁 Cấu Trúc Thư Mục

```
src/
├── assets/          # CSS, images và static files
├── components/      # Reusable Vue components
│   ├── Navbar.vue
│   ├── Footer.vue
│   ├── SearchBar.vue
│   └── StayCard.vue
├── pages/           # Route-level components
│   ├── Home.vue
│   ├── StayList.vue
│   ├── StayDetail.vue
│   └── Booking.vue
├── router/          # Vue Router configuration
├── store/           # Pinia stores
│   ├── stays.ts
│   ├── booking.ts
│   └── theme.ts
├── composables/     # Reusable composition functions
├── types/           # TypeScript type definitions
└── App.vue
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray
- **Background**: Light/Dark adaptive

### Components
- **Cards**: Rounded corners với shadow
- **Buttons**: Primary và Secondary variants
- **Inputs**: Consistent styling với focus states
- **Dark Mode**: Automatic theme switching

## 🔗 API Endpoints (Mock)

Base URL: `http://localhost:3001`

- `GET /stays` - Lấy danh sách homestay
- `GET /stays/:id` - Chi tiết homestay
- `POST /bookings` - Tạo booking mới
- `GET /bookings` - Lấy danh sách booking

## 🛠️ Development

### TypeScript Support
Project sử dụng TypeScript với strict mode. Tất cả types được định nghĩa trong `src/types/`.

### State Management
Sử dụng Pinia với Composition API:
- `useStayStore` - Quản lý homestays và filters
- `useBookingStore` - Quản lý bookings
- `useThemeStore` - Quản lý dark/light mode

### Styling
- Tailwind CSS với custom configuration
- Dark mode support
- Responsive design
- Custom components trong `@layer components`

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🌙 Dark Mode

Tự động detect system preference và cho phép toggle manual. Theme được lưu trong localStorage.

## 🧪 Testing & Quality

- TypeScript strict mode
- ESLint configuration
- Proper error handling
- Loading states cho tất cả async operations

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

---

Được phát triển với ❤️ bằng Vue.js và TypeScript
# Home-stay
