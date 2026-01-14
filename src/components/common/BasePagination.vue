<template>
  <div class="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between" v-if="totalPages > 0">
    <span class="text-sm text-gray-600">
      Mostrando página <strong>{{ page + 1 }}</strong> de <strong>{{ totalPages }}</strong>
    </span>
    <div class="flex gap-2">
      <button 
        @click="$emit('change-page', page - 1)"
        :disabled="first"
        class="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Anterior
      </button>
      <button 
        @click="$emit('change-page', page + 1)"
        :disabled="last"
        class="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}>();

defineEmits(['change-page']);
</script>