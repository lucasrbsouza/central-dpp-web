<template>
  <header class="md:hidden bg-piaui-blue text-white h-16 flex justify-between items-center px-4 shadow-md z-10">
    <div class="flex items-center gap-2">
      <button
        @click="$emit('open-sidebar')"
        class="text-white text-2xl focus:outline-none p-1 rounded hover:bg-blue-800"
      >
        ☰
      </button>
      <span class="font-bold tracking-wide">Central DPP</span>
    </div>

    <div class="w-8 h-8 rounded-full bg-piaui-yellow text-piaui-blue flex items-center justify-center font-bold text-xs">
      {{ initials }}
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

defineEmits(['open-sidebar']);

const authStore = useAuthStore();

const initials = computed(() => {
  const nome = authStore.user?.nome || '';
  const sobrenome = authStore.user?.sobrenome || '';
  if (!nome) return 'U';
  return (nome.charAt(0) + (sobrenome.charAt(0) || '')).toUpperCase();
});
</script>
