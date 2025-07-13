import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Home from '../pages/Home.vue'
import StayList from '../pages/StayList.vue'
import StayDetail from '../pages/StayDetail.vue'
import Booking from '../pages/Booking.vue'
import BookingDetail from '../pages/BookingDetail.vue'
import MyBookings from '../pages/MyBookings.vue'
import BookingConfirmation from '../pages/BookingConfirmation.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import AdminRegister from '../pages/AdminRegister.vue'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard.vue'
import ManageStays from '../pages/admin/ManageStays.vue'
import ManageBookings from '../pages/admin/ManageBookings.vue'
import ManageUsers from '../pages/admin/ManageUsers.vue'
import Reports from '../pages/admin/Reports.vue'
import AdminApproval from '../pages/admin/AdminApproval.vue'
import UpdateRatings from '../pages/admin/UpdateRatings.vue'
import ManageReviews from '../pages/admin/ManageReviews.vue'
import ManageCancellations from '../pages/admin/ManageCancellations.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin-register',
    name: 'AdminRegister',
    component: AdminRegister
  },
  {
    path: '/stays',
    name: 'StayList',
    component: StayList
  },
  {
    path: '/stay/:id',
    name: 'StayDetail',
    component: StayDetail,
    props: true
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/:id',
    name: 'Booking',
    component: Booking,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-detail/:id',
    name: 'BookingDetail',
    component: BookingDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-confirmation/:id',
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    props: true,
    meta: { requiresAuth: true }
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/stays',
    name: 'AdminManageStays',
    component: ManageStays,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/stays/add',
    name: 'AdminAddHomestay',
    component: () => import('../pages/admin/AddHomestay.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, requiresCreateHomestays: true }
  },
  {
    path: '/admin/stays/edit/:id',
    name: 'AdminEditHomestay',
    component: () => import('../pages/admin/EditHomestay.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, requiresEditHomestays: true }
  },
  {
    path: '/admin/bookings',
    name: 'AdminManageBookings',
    component: ManageBookings,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cancellations',
    name: 'AdminManageCancellations',
    component: ManageCancellations,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminManageUsers',
    component: ManageUsers,
    meta: { requiresAuth: true, requiresSuperAdmin: true }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: Reports,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reviews',
    name: 'AdminManageReviews',
    component: ManageReviews,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/update-ratings',
    name: 'AdminUpdateRatings',
    component: UpdateRatings,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/approval',
    name: 'AdminApproval',
    component: AdminApproval,
    meta: { requiresAuth: true, requiresSuperAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with return path
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    // Redirect to admin dashboard if not super admin
    next({ name: 'AdminDashboard' })
  } else if (to.meta.requiresCreateHomestays && !authStore.canCreateHomestays) {
    // Redirect to manage stays if cannot create homestays
    next({ name: 'AdminManageStays' })
  } else if (to.meta.requiresEditHomestays && !authStore.canEditHomestays) {
    // Redirect to manage stays if cannot edit homestays
    next({ name: 'AdminManageStays' })
  } else if (to.meta.requiresAdmin && !(authStore.isAdmin || authStore.isSuperAdmin)) {
    // Redirect to home if not admin or super admin
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
