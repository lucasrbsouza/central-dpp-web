<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} 
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none transition disabled:bg-gray-100 disabled:text-gray-500"
      :class="{ 'border-red-500 focus:ring-red-200': error }"
    />

    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string | number | undefined;
  required?: boolean;
  error?: string; // Se você implementar validação no futuro, já está pronto
}>();

// O vue define automaticamente os emits de update:modelValue
</script>