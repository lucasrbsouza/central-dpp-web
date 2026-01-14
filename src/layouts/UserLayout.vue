<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-piaui-blue shadow-lg relative z-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">

          <!-- Branding -->
          <router-link to="/home" class="flex items-center gap-4 group">
            <img src="../assets/public/logo2.png" alt="Logo"
              class="w-10 h-10 bg-white rounded object-contain p-1 group-hover:scale-105 transition-transform" />
            <div>
              <h1 class="text-white font-bold text-lg leading-tight">Central DPP</h1>
              <p class="text-blue-200 text-xs">Governo do Piauí</p>
            </div>
          </router-link>

          <!-- Navigation -->
          <UserNavMenu :mobileOpen="mobileMenuOpen" @close="mobileMenuOpen = false" @logout="authStore.logout()" />

          <!-- User Profile -->
          <UserProfileMenu :nome="authStore.nomeCompleto" :nomeCurto="authStore.user?.nome || ''"
            :cargo="authStore.user?.cargo || 'Colaborador'" :mobileOpen="mobileMenuOpen" @logout="authStore.logout()"
            @toggle-mobile="mobileMenuOpen = !mobileMenuOpen" />
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view />
    </main>

<Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

import UserNavMenu from '../components/navigation/UserNavMenu.vue';
import Footer from '../components/common/Footer.vue';
import UserProfileMenu from '../components/user/UserProfileMenu.vue';

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
</script>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.2s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
