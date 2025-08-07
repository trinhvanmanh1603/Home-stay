<template>
  <div class="flex justify-end space-x-4">
    <ActionButton
      label="Hủy"
      variant="secondary"
      to="/admin/stays"
    />
    <ActionButton
      :label="loading ? 'Đang cập nhật...' : 'Cập nhật homestay'"
      variant="primary"
      type="submit"
      :disabled="!canSubmit || loading"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import ActionButton from '@/components/common/ActionButton.vue'

interface Props {
  canSubmit: boolean
  loading: boolean
}

interface Emits {
  (e: 'submit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
