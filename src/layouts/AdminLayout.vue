<template>
  <div class="flex h-screen bg-gray-100">
    
    <aside 
      class="bg-piaui-blue text-white w-64 flex-shrink-0 transition-all duration-300 hidden md:flex flex-col"
    >
      <div class="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-900">
        <span class="font-bold text-lg tracking-wider">Central DPP <span class="text-xs bg-piaui-yellow text-piaui-blue px-1 rounded">Gestão</span></span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1">
          <li>
            <router-link to="/admin/dashboard" class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">📊</span> Dashboard
            </router-link>
          </li>

          <li v-if="authStore.isAdmin" class="px-6 pt-4 pb-2 text-xs text-blue-300 uppercase font-semibold">
            Administração
          </li>
          <li v-if="authStore.isAdmin">
            <router-link to="/admin/usuarios" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">👥</span> Usuários
            </router-link>
          </li>
          <li v-if="authStore.isAdmin">
            <router-link to="/admin/equipes" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">🏢</span> Equipes / Setores
            </router-link>
          </li>
          
          <li class="px-6 pt-4 pb-2 text-xs text-blue-300 uppercase font-semibold">
            Conteúdo
          </li>
          <li>
            <router-link to="/admin/avisos" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">📢</span> Avisos Mural
            </router-link>
          </li>
          <li>
            <router-link to="/admin/eventos" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">📅</span> Agenda Eventos
            </router-link>
          </li>
          <li>
            <router-link to="/admin/enquetes" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">📊</span> Enquetes
            </router-link>
          </li>
          <li>
            <router-link to="/admin/ferramentas" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">🔧</span> Ferramentas
            </router-link>
          </li>
          <li>
            <router-link to="/admin/documentos" class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors" active-class="bg-white/20 border-r-4 border-piaui-yellow">
              <span class="mr-3">📂</span> Documentos
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-blue-800 bg-blue-900">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-piaui-yellow flex items-center justify-center text-piaui-blue font-bold text-xs">
            {{ userInitials }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium truncate">{{ authStore.nomeCompleto }}</p>
            <p class="text-xs text-blue-300 truncate">{{ authStore.user?.cargo || 'Gestor' }}</p>
          </div>
        </div>
        <button @click="authStore.logout()" class="mt-3 w-full text-xs text-center text-blue-200 hover:text-white hover:underline">
          Sair do Sistema
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="md:hidden bg-piaui-blue text-white p-4 flex justify-between items-center shadow-md">
        <span class="font-bold">Central DPP</span>
        <button class="text-white text-2xl">☰</button>
      </header>

      <div class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const userInitials = computed(() => {
  const nome = authStore.user?.nome || '';
  const sobrenome = authStore.user?.sobrenome || '';
  if (!nome) return 'U';
  return (nome.charAt(0) + (sobrenome.charAt(0) || '')).toUpperCase();
});
</script>