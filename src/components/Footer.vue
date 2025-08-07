<template>
  <footer class="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white">
    <div class="max-w-7xl mx-auto">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 py-12">
        <!-- Logo and description -->
        <div class="lg:col-span-2">
          <div class="flex items-center mb-6">
            <div class="relative">
              <svg class="h-10 w-10 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <div class="absolute inset-0 bg-primary-400/20 rounded-full blur-lg"></div>
            </div>
            <div class="ml-3">
              <span class="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                HomeStay
              </span>
              <div class="text-xs text-gray-400 font-medium">
                Khám phá. Trải nghiệm. Tận hưởng.
              </div>
            </div>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed max-w-md">
            Khám phá những trải nghiệm lưu trú tuyệt vời với HomeStay. 
            Tìm kiếm và đặt phòng dễ dàng tại những địa điểm đẹp nhất Việt Nam.
          </p>
          
          <!-- Social Media -->
          <div class="flex space-x-4 mt-6">
            <a href="#" class="group p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="group p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" class="group p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
            <a href="#" class="group p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-6 relative">
            Liên kết nhanh
            <div class="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400"></div>
          </h3>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/" class="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center group">
                <span class="mr-2 group-hover:translate-x-1 transition-transform duration-200">🏠</span>
                Trang chủ
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/stays" class="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center group">
                <span class="mr-2 group-hover:translate-x-1 transition-transform duration-200">🔍</span>
                Khám phá
              </RouterLink>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center group">
                <span class="mr-2 group-hover:translate-x-1 transition-transform duration-200">📖</span>
                Hướng dẫn
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center group">
                <span class="mr-2 group-hover:translate-x-1 transition-transform duration-200">❓</span>
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact & Support -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-6 relative">
            Liên hệ & Hỗ trợ
            <div class="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400"></div>
          </h3>
          <ul class="space-y-3">
            <li class="flex items-center text-gray-300 text-sm">
              <span class="mr-3 p-1.5 bg-gray-800 rounded-lg">📧</span>
              <div>
                <div class="text-xs text-gray-400">Email</div>
                <a href="mailto:info@homestay.vn" class="hover:text-primary-400 transition-colors">info@homestay.vn</a>
              </div>
            </li>
            <li class="flex items-center text-gray-300 text-sm">
              <span class="mr-3 p-1.5 bg-gray-800 rounded-lg">📞</span>
              <div>
                <div class="text-xs text-gray-400">Hotline 24/7</div>
                <a href="tel:19001234" class="hover:text-primary-400 transition-colors">1900 1234</a>
              </div>
            </li>
            <li class="flex items-center text-gray-300 text-sm">
              <span class="mr-3 p-1.5 bg-gray-800 rounded-lg">📍</span>
              <div>
                <div class="text-xs text-gray-400">Địa chỉ</div>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </li>
            <li class="flex items-center text-gray-300 text-sm">
              <span class="mr-3 p-1.5 bg-gray-800 rounded-lg">💬</span>
              <div>
                <div class="text-xs text-gray-400">Chat hỗ trợ</div>
                <button class="hover:text-primary-400 transition-colors">Bắt đầu chat</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter Subscription -->
      <div class="border-t border-gray-700 px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-md mx-auto text-center">
          <h3 class="text-lg font-semibold text-white mb-2">Đăng ký nhận tin</h3>
          <p class="text-gray-400 text-sm mb-4">Nhận thông tin ưu đãi và địa điểm mới nhất</p>
          <div class="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              class="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <ActionButton
              variant="primary"
              size="md"
              class="rounded-l-none"
            >
              Đăng ký
            </ActionButton>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-gray-700 px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} HomeStay. Tất cả quyền được bảo lưu.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Chính sách bảo mật</a>
            <a href="#" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Điều khoản sử dụng</a>
            <a href="#" class="text-gray-400 hover:text-primary-400 text-sm transition-colors">Quy định chung</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ActionButton from '@/components/common/ActionButton.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
