<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Hình ảnh *
    </label>
    <div class="space-y-3">
      <div v-for="(_, index) in images" :key="index" class="flex gap-2">
        <input
          v-model="images[index]"
          type="url"
          required
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
          @input="$emit('update:images', images)"
        />
        <ActionButton
          label="Xóa"
          variant="danger"
          size="sm"
          :disabled="images.length <= 1"
          @click="$emit('remove-image', index)"
        />
      </div>
      <ActionButton
        label="+ Thêm hình ảnh"
        variant="success"
        size="sm"
        @click="$emit('add-image')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/common/ActionButton.vue'

interface Props {
  images: string[]
}

interface Emits {
  (e: 'update:images', images: string[]): void
  (e: 'add-image'): void
  (e: 'remove-image', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
