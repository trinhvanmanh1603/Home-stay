<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Title -->
    <FormInput
      id="title"
      v-model="form.title"
      label="Tên homestay"
      type="text"
      required
      placeholder="Ví dụ: Villa sang trọng bên bờ biển"
    />
    
    <!-- Type -->
    <div>
      <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Loại hình *
      </label>
      <select
        id="type"
        v-model="form.type"
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">Chọn loại hình</option>
        <option value="villa">Villa</option>
        <option value="apartment">Căn hộ</option>
        <option value="house">Nhà riêng</option>
        <option value="resort">Resort</option>
        <option value="hotel">Khách sạn</option>
      </select>
    </div>

    <!-- Location -->
    <FormInput
      id="location"
      v-model="form.location"
      label="Địa điểm"
      type="text"
      required
      placeholder="Ví dụ: Đà Nẵng, Việt Nam"
    />

    <!-- Price -->
    <FormInput
      id="price"
      v-model.number="form.price"
      label="Giá (VND/đêm)"
      type="number"
      required
      :min="0"
      placeholder="1500000"
    />

    <!-- Guests -->
    <FormInput
      id="guests"
      v-model.number="form.guests"
      label="Số khách"
      type="number"
      required
      :min="1"
      placeholder="4"
    />
    
    <!-- Bedrooms -->
    <FormInput
      id="bedrooms"
      v-model.number="form.bedrooms"
      label="Số phòng ngủ"
      type="number"
      required
      :min="1"
      placeholder="2"
    />
    
    <!-- Bathrooms -->
    <FormInput
      id="bathrooms"
      v-model.number="form.bathrooms"
      label="Số phòng tắm"
      type="number"
      required
      :min="1"
      placeholder="2"
    />

    <!-- Available Status -->
    <div>
      <label for="available" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Trạng thái
      </label>
      <select
        id="available"
        v-model="form.available"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option :value="true">Có sẵn</option>
        <option :value="false">Không có sẵn</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormInput from '@/components/forms/FormInput.vue'

interface Props {
  form: {
    title: string
    location: string
    price: number
    type: string
    guests: number
    bedrooms: number
    bathrooms: number
    available: boolean
  }
}

defineProps<Props>()
</script>
