<template>
  <div :class="['mx-auto w-full', maxWidthClass]">
    
    <div class="mb-6">
      <slot name="header"></slot>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
      
      <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <form @submit.prevent="$emit('submit')" class="p-6 md:p-8">
        
        <div class="space-y-6">
          <slot></slot>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <slot name="actions"></slot>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  loading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}>();

defineEmits(['submit']);

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-xl';
    case 'md': return 'max-w-2xl';
    case 'lg': return 'max-w-4xl';
    case 'xl': return 'max-w-5xl';
    default: return 'max-w-4xl';
  }
});
</script>