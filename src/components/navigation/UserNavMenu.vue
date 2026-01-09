<template>
  <nav class="hidden md:flex space-x-6 text-sm font-medium text-white">
    <router-link
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      class="hover:text-piaui-yellow transition"
      active-class="text-piaui-yellow font-bold"
    >
      {{ item.label }}
    </router-link>
  </nav>

<div
  v-if="mobileOpen"
  class="fixed inset-0 z-50 bg-piaui-blue md:hidden"
>
  <div class="flex items-center justify-between h-16 px-4 border-b border-blue-700">
    <span class="text-white font-bold">Menu</span>
    <button
      @click="$emit('close')"
      class="text-white text-2xl"
    >
      ✕
    </button>
  </div>

  <div class="px-4 py-4 space-y-2">
    <router-link
      v-for="item in menuItemsMobile"
      :key="item.to"
      :to="item.to"
      @click="$emit('close')"
      class="block text-white py-3 px-3 rounded hover:bg-blue-700"
      active-class="bg-blue-900 font-bold border-l-4 border-piaui-yellow"
    >
      {{ item.icon }} {{ item.label }}
    </router-link>

    <div class="pt-4 mt-4 border-t border-blue-600">
      <button
        @click="$emit('logout')"
        class="w-full text-left text-red-200 hover:text-white py-3 px-3 rounded hover:bg-red-900/50 flex items-center gap-2 transition"
      >
        ➜] Sair do Sistema
      </button>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
defineProps<{
  mobileOpen: boolean;
}>();

defineEmits(['close', 'logout']);

const menuItems = [
  { label: 'Início', to: '/home' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Equipes', to: '/equipes' },
  { label: 'Colaboradores', to: '/colaboradores' },
  { label: 'Ferramentas', to: '/ferramentas' },
  { label: 'Documentos', to: '/documentos' },
  { label: 'Enquetes', to: '/enquetes' }
];

const menuItemsMobile = [
  { label: 'Início', to: '/home', icon: '🏠' },
  { label: 'Meu Perfil', to: '/perfil', icon: '👤' },
  { label: 'Equipes', to: '/equipes', icon: '🏢' },
  { label: 'Ferramentas', to: '/ferramentas', icon: '🔧' },
  { label: 'Documentos', to: '/documentos', icon: '📂' },
  { label: 'Enquetes', to: '/enquetes', icon: '📊' },
  { label: 'Agenda', to: '/agenda', icon: '📅' }
];
</script>
