<template>
  <div class="relative w-full">
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('search')"
      type="text" 
      :placeholder="placeholder" 
      class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-piaui-blue outline-none transition bg-white"
    >
    
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>

    <button 
      v-if="modelValue" 
      @click="$emit('update:modelValue', ''); $emit('search')" 
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

defineEmits(['update:modelValue', 'search']);
</script>