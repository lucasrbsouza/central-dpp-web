<template>
  <div class="p-4 border-t border-blue-800 bg-blue-900">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-piaui-yellow flex items-center justify-center text-piaui-blue font-bold text-xs">
        {{ initials }}
      </div>
      <div class="overflow-hidden">
        <p class="text-sm font-medium truncate">{{ nomeCompleto }}</p>
        <p class="text-xs text-blue-300 truncate">{{ cargo }}</p>
      </div>
    </div>

    <button
      @click="authStore.logout()"
      class="mt-3 w-full text-xs text-center text-blue-200 hover:text-white hover:underline flex items-center justify-center gap-1"
    >
      <span>➜]</span> Sair do Sistema
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const nomeCompleto = computed(() => authStore.nomeCompleto);
const cargo = computed(() => authStore.user?.cargo || 'Acesso Restrito');

const initials = computed(() => {
  const nome = authStore.user?.nome || '';
  const sobrenome = authStore.user?.sobrenome || '';
  if (!nome) return 'U';
  return (nome.charAt(0) + (sobrenome.charAt(0) || '')).toUpperCase();
});
</script>
