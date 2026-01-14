<template>
  <div class="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
    <input 
      type="checkbox" 
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      :id="uuid"
      class="h-4 w-4 text-piaui-blue rounded border-gray-300 focus:ring-piaui-blue cursor-pointer"
    />
    <label :for="uuid" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none w-full">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  modelValue: boolean;
  label: string;
}>();

defineEmits(['update:modelValue']);

// Gera ID único para o label funcionar
const uuid = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
</script>