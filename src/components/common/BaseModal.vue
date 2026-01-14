<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div 
        class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        @click="$emit('close')"
      ></div>

      <div 
        class="relative w-full bg-white rounded-xl shadow-2xl ring-1 ring-gray-900/5 overflow-hidden flex flex-col max-h-[90vh] transition-all transform scale-100"
        :class="maxWidthClass"
      >
        
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <slot></slot>
        </div>

        <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}>(), {
  maxWidth: 'md'
});

defineEmits(['close']);

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    default: return 'max-w-md';
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>