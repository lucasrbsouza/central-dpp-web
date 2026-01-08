<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Visão Geral do Sistema</h2>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-piaui-blue">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total de Usuários</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats?.totalUsuarios || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-full text-piaui-blue text-xl">👥</div>
          </div>
          <p class="text-xs text-gray-400 mt-2">
            <span class="text-piaui-green font-bold">{{ stats?.totalUsuariosAtivos || 0 }}</span> ativos agora
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-piaui-yellow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Equipes/Setores</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats?.totalEquipes || 0 }}</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-full text-yellow-700 text-xl">🏢</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-piaui-green">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Documentos</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats?.totalDocumentos || 0 }}</p>
            </div>
            <div class="p-3 bg-green-50 rounded-full text-piaui-green text-xl">📂</div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-piaui-red">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="text-sm font-medium text-gray-500">Armazenamento</p>
              <p class="text-xl font-bold text-gray-800">{{ formatarBytes(stats?.armazenamentoUsadoBytes || 0) }}</p>
            </div>
            <div class="p-3 bg-red-50 rounded-full text-piaui-red text-xl">💾</div>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              class="bg-piaui-red h-2.5 rounded-full transition-all duration-500" 
              :style="{ width: percentualUso + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 text-right">{{ percentualUso }}% de 4GB</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-gray-800 text-lg">Últimas Ações do Sistema</h3>
          <button class="text-sm text-piaui-blue hover:underline">Ver todos os logs</button>
        </div>
        
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th class="p-4 font-semibold">Data/Hora</th>
              <th class="p-4 font-semibold">Usuário</th>
              <th class="p-4 font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(log, index) in stats?.ultimasAcoesDoSistema" :key="index" class="hover:bg-gray-50 transition">
              <td class="p-4 text-sm text-gray-600 font-mono">
                {{ formatarDataHora(log.data) }}
              </td>
              <td class="p-4 text-sm font-medium text-gray-800">
                {{ log.usuario }}
              </td>
              <td class="p-4 text-sm text-gray-600">
                {{ log.acao }}
              </td>
            </tr>
            <tr v-if="!stats?.ultimasAcoesDoSistema.length">
              <td colspan="3" class="p-8 text-center text-gray-500">
                Nenhuma atividade registada recentemente.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import type { AdminDashboardData } from '../../types/admin';
import { formatarBytes, formatarDataHora } from '../../utils/formatters';

const stats = ref<AdminDashboardData | null>(null);
const loading = ref(true);

// Limite físico da VM (4GB em Bytes)
const LIMITE_ARMAZENAMENTO = 4 * 1024 * 1024 * 1024;

const percentualUso = computed(() => {
  if (!stats.value?.armazenamentoUsadoBytes) return 0;
  const p = (stats.value.armazenamentoUsadoBytes / LIMITE_ARMAZENAMENTO) * 100;
  return Math.min(p, 100).toFixed(1); // Limita a 100% visualmente
});

onMounted(async () => {
  try {
    const response = await api.get('/admin/dashboard');
    stats.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar dashboard admin:', error);
  } finally {
    loading.value = false;
  }
});
</script>