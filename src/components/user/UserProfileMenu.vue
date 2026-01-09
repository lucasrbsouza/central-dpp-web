<template>
  <!-- Desktop -->
  <div class="hidden md:flex items-center gap-3">
    <div class="h-8 w-px bg-blue-700 mx-2"></div>

    <router-link to="/perfil" class="text-right hover:opacity-80 transition group">
      <p class="text-white text-sm font-semibold group-hover:underline">
        {{ nome }}
      </p>
      <p class="text-blue-300 text-xs">{{ cargo }}</p>
    </router-link>

    <button
      @click="$emit('logout')"
      class="bg-blue-800 hover:bg-piaui-red text-white p-2 rounded transition ml-2"
      title="Sair"
    >
      <span class="text-sm">➜]</span>
    </button>
  </div>

  <!-- Mobile -->
  <div class="flex items-center md:hidden gap-3">
    <div class="text-right mr-1">
      <p class="text-white text-xs font-bold leading-tight">{{ nomeCurto }}</p>
    </div>

    <button
      @click="$emit('toggle-mobile')"
      class="text-white p-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white/20"
    >
      <span class="text-2xl block leading-none">{{ mobileOpen ? '✕' : '☰' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  nome: string;
  nomeCurto: string;
  cargo: string;
  mobileOpen: boolean;
}>();

defineEmits(['logout', 'toggle-mobile']);
</script>
