<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <AdminPageHeader
      title="Chỉnh sửa Homestay"
      :description="`Cập nhật thông tin homestay ${homestayData?.title || ''}`"
      :actions="[
        {
          type: 'link',
          to: '/admin/stays',
          text: '← Quay lại',
          variant: 'secondary'
        }
      ]"
    />

    <!-- Loading State -->
    <div v-if="loadingData" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoadingSpinner message="Đang tải thông tin homestay..." />
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EmptyState
        title="Lỗi tải dữ liệu"
        :description="loadError"
        icon="exclamation-triangle"
      />
    </div>

    <!-- Form -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FormContainer title="Cập nhật thông tin Homestay" width="xl">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Info -->
          <HomestayBasicInfo :form="form" />

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về homestay..."
            ></textarea>
          </div>

          <!-- Images -->
          <HomestayImageManager
            :images="form.images"
            @add-image="addImage"
            @remove-image="removeImage"
            @update:images="form.images = $event"
          />

          <!-- Amenities -->
          <HomestayAmenities
            :available-amenities="availableAmenities"
            :selected-amenities="form.amenities"
            @update:amenities="form.amenities = $event"
          />

          <!-- Submit Actions -->
          <HomestayFormActions
            :can-submit="canSubmit"
            :loading="loading"
            @submit="handleSubmit"
          />
        </form>
      </FormContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEditHomestay } from '@/composables/useEditHomestay'

// Components
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import FormContainer from '@/components/forms/FormContainer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import HomestayBasicInfo from '@/components/admin/HomestayBasicInfo.vue'
import HomestayImageManager from '@/components/admin/HomestayImageManager.vue'
import HomestayAmenities from '@/components/admin/HomestayAmenities.vue'
import HomestayFormActions from '@/components/admin/HomestayFormActions.vue'

// Composable
const {
  // State
  loadingData,
  loading,
  loadError,
  errorMessage,
  successMessage,
  homestayData,
  form,
  availableAmenities,
  
  // Computed
  canSubmit,
  
  // Methods
  addImage,
  removeImage,
  handleSubmit,
  initializeEdit
} = useEditHomestay()

onMounted(() => {
  initializeEdit()
})
</script>
