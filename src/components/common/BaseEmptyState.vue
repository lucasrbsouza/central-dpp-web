<template>
  <div class="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
    <div class="text-4xl mb-3 flex justify-center text-gray-400">
      <slot name="icon">📂</slot>
    </div>
    <h3 class="text-lg font-medium text-gray-600">{{ title }}</h3>
    <p v-if="description" class="text-gray-500 mt-1 text-sm">{{ description }}</p>
    
    <div v-if="$slots.action" class="mt-4">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>