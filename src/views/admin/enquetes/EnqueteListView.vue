<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Enquetes e Votações</h2>
        <p class="text-gray-600 text-sm">Crie pesquisas para interagir com os colaboradores.</p>
      </div>
      <router-link 
        to="/admin/enquetes/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Nova Enquete
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="p-4 font-semibold">Pergunta / Descrição</th>
              <th class="p-4 font-semibold text-center">Tipo</th>
              <th class="p-4 font-semibold text-center">Encerramento</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="enquete in enquetes" :key="enquete.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4">
                <p class="font-bold text-gray-800">{{ enquete.pergunta }}</p>
                <p class="text-xs text-gray-500">{{ enquete.descricao || 'Sem descrição adicional' }}</p>
                <p class="text-xs text-piaui-blue mt-1 font-medium">
                  {{ calcularTotalVotos(enquete) }} votos computados
                </p>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    enquete.multiplaEscolha ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ enquete.multiplaEscolha ? 'Múltipla' : 'Única' }}
                </span>
              </td>

              <td class="p-4 text-center text-sm">
                <span :class="isExpirada(enquete.dataFim) ? 'text-red-500 font-bold' : 'text-green-600'">
                  {{ formatarDataHora(enquete.dataFim) }}
                </span>
                <p v-if="isExpirada(enquete.dataFim)" class="text-xs text-red-400">Encerrada</p>
              </td>

              <td class="p-4 text-right">
                <button 
                  @click="excluir(enquete.id)"
                  class="text-gray-400 hover:text-piaui-red p-2 rounded hover:bg-red-50 transition"
                  title="Excluir Enquete"
                >
                  🗑️
                </button>
              </td>
            </tr>

            <tr v-if="enquetes.length === 0">
              <td colspan="4" class="p-10 text-center text-gray-500">Nenhuma enquete encontrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import type { EnqueteDTO, Page } from '../../../types/enquete';
import { formatarDataHora } from '../../../utils/formatters';

const enquetes = ref<EnqueteDTO[]>([]);
const loading = ref(true);

const fetch = async () => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<EnqueteDTO>>('/enquetes?sort=dataFim,desc');
    enquetes.value = data.content;
  } catch (error) {
    console.error('Erro ao listar enquetes:', error);
  } finally {
    loading.value = false;
  }
};

const calcularTotalVotos = (e: EnqueteDTO) => {
  return e.opcoes.reduce((acc, curr) => acc + curr.totalVotos, 0);
};

const isExpirada = (dataFim: string) => {
  return new Date(dataFim) < new Date();
};

const excluir = async (id: number) => {
  if(!confirm('Ao excluir, todos os votos serão perdidos. Continuar?')) return;
  try {
    await api.delete(`/enquetes/${id}`);
    fetch();
  } catch (error) {
    alert('Erro ao excluir.');
  }
};

onMounted(() => fetch());
</script>