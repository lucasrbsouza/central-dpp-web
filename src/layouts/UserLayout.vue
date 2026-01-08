<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-piaui-blue shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-white rounded flex items-center justify-center text-piaui-blue font-bold text-xl">
              PI
            </div>
            <div>
              <h1 class="text-white font-bold text-lg leading-tight">Central DPP</h1>
              <p class="text-blue-200 text-xs">Governo do Piauí</p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <nav class="hidden md:flex space-x-6 text-sm font-medium text-white">
              <router-link to="/home" class="hover:text-piaui-yellow transition" active-class="text-piaui-yellow font-bold">
                Início
              </router-link>
              <router-link to="/ferramentas" class="hover:text-piaui-yellow transition" active-class="text-piaui-yellow font-bold">
                Ferramentas
              </router-link>
              <router-link to="/documentos" class="hover:text-piaui-yellow transition" active-class="text-piaui-yellow font-bold">
                Documentos
              </router-link>
              <router-link to="/enquetes" class="hover:text-piaui-yellow transition" active-class="text-piaui-yellow font-bold">
                Enquetes
              </router-link>
            </nav>

            <div class="hidden md:block h-6 w-px bg-blue-700"></div>

            <div class="flex items-center gap-3">
              <div class="text-right hidden sm:block">
                <p class="text-white text-sm font-semibold">{{ authStore.nomeCompleto }}</p>
                <p class="text-blue-300 text-xs">{{ authStore.user?.cargo }}</p>
              </div>
              <button 
                @click="authStore.logout()"
                class="bg-blue-800 hover:bg-piaui-red text-white p-2 rounded transition"
                title="Sair"
              >
                <span class="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <footer class="bg-white border-t border-gray-200 py-6 mt-auto">
      <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {{ new Date().getFullYear() }} Diretoria de Pagamento de Pessoal - SEAD/PI
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>