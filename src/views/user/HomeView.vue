<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        Olá, <span class="text-piaui-blue">{{ primeiroNome }}</span>! <PhHandWaving class="inline-block w-8 h-9" />
      </h2>
      <p class="text-gray-600 mt-1">Aqui está o resumo da sua semana na DPP.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <section class="lg:col-span-2 space-y-6">
        <h3 class="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
          <span class="mr-2"><BellAlertIcon class="w-5 h-5" /></span> Mural de Avisos
        </h3>

        <div v-if="dashboardData?.avisosVigentes.length === 0" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
          Nenhum aviso vigente no momento.
        </div>

        <div 
          v-for="aviso in dashboardData?.avisosVigentes" 
          :key="aviso.id"
          :class="[
            'bg-white p-6 rounded-lg shadow-md border-l-8 relative',
            aviso.tipo === 'URGENTE' ? 'border-piaui-red' : 
            aviso.tipo === 'ALERTA' ? 'border-piaui-yellow' : 'border-piaui-blue'
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <span 
                :class="[
                  'text-xs font-bold px-2 py-1 rounded uppercase tracking-wide',
                  aviso.tipo === 'URGENTE' ? 'bg-red-100 text-red-800' : 
                  aviso.tipo === 'ALERTA' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ aviso.tipo }}
              </span>
              <h4 class="text-lg font-bold text-gray-800 mt-2">{{ aviso.titulo }}</h4>
              <p class="text-gray-500 text-sm mt-1">Publicado em {{ formatarDataHora(aviso.dataInicio) }}</p>
            </div>
          </div>
        </div>
      </section>

      <aside class="space-y-8">
        
        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-piaui-green">
          <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center">
            <span class="mr-2"><CalendarDateRangeIcon class="w-5 h-5" /></span> Agenda da Semana
          </h3>
          
          <ul class="space-y-4">
            <li v-for="evento in dashboardData?.agendaSemana" :key="evento.id" class="flex gap-3">
              <div class="bg-green-50 text-piaui-green font-bold rounded p-2 text-center min-w-[3.5rem]">
                <div class="text-xl">{{ formatarDiaMes(evento.dataInicio).dia }}</div>
                <div class="text-xs uppercase">{{ formatarDiaMes(evento.dataInicio).mes }}</div>
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ evento.titulo }}</p>
                <p class="text-xs text-gray-500">{{ evento.local }} • {{ formatarHora(evento.dataInicio) }}</p>
              </div>
            </li>
            <li v-if="!dashboardData?.agendaSemana.length" class="text-sm text-gray-500">
              Sem eventos para esta semana.
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-piaui-yellow">
          <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center">
            <span class="mr-2"><PhConfetti :size="20"/></span> Aniversariantes do Mês
          </h3>
          
          <ul class="space-y-3">
            <li v-for="(aniver, index) in dashboardData?.aniversariantesMes" :key="index" class="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-0">
              <div class="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold">
                {{ aniver.nome.charAt(0) }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">{{ aniver.nome }} {{ aniver.sobrenome }}</p>
                <p class="text-xs text-gray-500">{{ formatarDataSimples(aniver.dataNascimento) }} • {{ aniver.equipeNome }}</p>
              </div>
            </li>
            <li v-if="!dashboardData?.aniversariantesMes.length" class="text-sm text-gray-500">
              Nenhum aniversariante encontrado.
            </li>
          </ul>
        </div>

      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import type { DashboardData } from '../../types/dashboard';
import { formatarDataHora, formatarDataSimples, formatarDiaMes, formatarHora } from '../../utils/formatters';
import { PhConfetti, PhHandWaving } from '@phosphor-icons/vue';
import { BellAlertIcon, CalendarDateRangeIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const dashboardData = ref<DashboardData | null>(null);
const loading = ref(true);

const primeiroNome = computed(() => authStore.user?.nome || 'Colaborador');

onMounted(async () => {
  try {
    const response = await api.get('/dashboard');
    dashboardData.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar dashboard', error);
  } finally {
    loading.value = false;
  }
});
</script>