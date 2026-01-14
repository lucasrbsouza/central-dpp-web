<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="px-4 py-2 rounded-md transition flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
  >
    <span 
      v-if="loading" 
      class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
    ></span>
    
    <slot name="icon"></slot>
    
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'primary',
  type: 'button',
  loading: false
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-piaui-blue text-white hover:bg-blue-800';
    case 'secondary': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    case 'danger': return 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200';
    case 'outline': return 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50';
    default: return 'bg-piaui-blue text-white';
  }
});
</script>