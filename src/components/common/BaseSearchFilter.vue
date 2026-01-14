<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
    
    <div class="flex-1 relative">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="$emit('search')"
        type="text" 
        :placeholder="placeholder" 
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none transition"
      >
      <span class="absolute left-3 top-2.5 text-gray-400">
        <MagnifyingGlassIcon class="h-5 w-5" />
      </span>
    </div>

    <slot name="extra"></slot>

    <BaseButton 
      variant="secondary" 
      @click="$emit('search')"
      :loading="loading"
    >
      {{ buttonLabel }}
    </BaseButton>

  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import BaseButton from './BaseButton.vue'; // Reaproveitando nosso botão

withDefaults(defineProps<{
  modelValue: string;          // O valor do v-model
  placeholder?: string;        // Texto de ajuda
  buttonLabel?: string;        // Texto do botão (Padrão: Filtrar)
  loading?: boolean;           // Se está carregando
}>(), {
  placeholder: 'Buscar...',
  buttonLabel: 'Filtrar',
  loading: false
});

defineEmits(['update:modelValue', 'search']);
</script>