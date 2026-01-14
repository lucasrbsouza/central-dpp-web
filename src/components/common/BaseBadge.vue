<template>
  <span 
    class="px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 uppercase tracking-wide"
    :class="colorClasses"
  >
    <span v-if="showDot" class="w-1.5 h-1.5 rounded-full bg-current"></span>
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  showDot?: boolean;
}>();

const colorClasses = computed(() => {
  switch (props.variant) {
    case 'success': return 'bg-green-100 text-green-700';
    case 'danger': return 'bg-red-100 text-red-700';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-700'; // Azul do sistema
    case 'neutral': return 'bg-gray-100 text-gray-600'; // Roxo/Cinza admin
    default: return 'bg-gray-100 text-gray-600';
  }
});
</script>