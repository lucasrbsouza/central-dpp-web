<template>
  <div class="flex h-screen bg-gray-100">

    <!-- Backdrop Mobile -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden"
    ></div>

    <!-- Sidebar -->
    <AdminSidebar
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <!-- Main -->
    <main class="flex-1 flex flex-col overflow-hidden w-full">

      <AdminTopBar @open-sidebar="isSidebarOpen = true" />

      <div class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
        <router-view />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import AdminSidebar from '../components/admin/AdminSidebar.vue';
import AdminTopBar from '../components/admin/AdminTopBar.vue';

const isSidebarOpen = ref(false);
</script>
