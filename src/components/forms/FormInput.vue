<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="mt-1">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'input-field',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
          disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  type?: string
  label?: string
  modelValue?: string | number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  error?: string
  hint?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  id: '',
  required: false,
  disabled: false,
  readonly: false
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()
</script>
