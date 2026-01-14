<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <div class="flex items-center gap-2">
        <slot name="back-button"></slot>
        <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
      </div>
      <p class="text-gray-600 text-sm mt-1">{{ subtitle }}</p>
    </div>
    
    <div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>