<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
    
    <div v-if="loading" class="p-12 text-center flex-1 flex flex-col items-center justify-center">
      <slot name="loading">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
        <p class="text-gray-500 mt-2 text-sm">Carregando dados...</p>
      </slot>
    </div>

    <div v-else-if="isEmpty" class="p-12 text-center flex-1 flex flex-col items-center justify-center">
      <slot name="empty">
        <p class="text-gray-500 text-lg">Nenhum registro encontrado.</p>
      </slot>
    </div>

    <div v-else class="overflow-x-auto flex-1">
      <slot></slot>
    </div>

    <div v-if="$slots.pagination && !loading && !isEmpty" class="bg-gray-50 border-t border-gray-200">
      <slot name="pagination"></slot>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  isEmpty?: boolean;
}>();
</script>