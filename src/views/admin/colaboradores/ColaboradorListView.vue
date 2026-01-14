<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestão de Colaboradores</h2>
        <p class="text-gray-600 text-sm">Atualize dados cadastrais, equipes e status.</p>
      </div>
      </div>

    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex gap-4">
      <div class="flex-1 relative">
        <input 
          v-model="termo" 
          @keyup.enter="fetch"
          type="text" 
          placeholder="Buscar por nome, matrícula ou cargo..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none"
        >
        <span class="absolute left-3 top-2.5 text-gray-400"><MagnifyingGlassIcon class="h-5 w-5" /></span>
      </div>
      <button @click="fetch" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Filtrar</button>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="p-4 font-semibold">Colaborador</th>
              <th class="p-4 font-semibold">Matrícula / Cargo</th>
              <th class="p-4 font-semibold">Equipe</th>
              <th class="p-4 font-semibold text-center">Status</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="colab in colaboradores" :key="colab.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-piaui-blue flex items-center justify-center font-bold text-xs">
                    {{ getIniciais(colab.nome, colab.sobrenome) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-800">{{ colab.nome }} {{ colab.sobrenome }}</p>
                    <p class="text-xs text-gray-500">{{ colab.email || 'Sem e-mail' }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <p class="text-sm text-gray-800 font-medium">{{ colab.matricula }}</p>
                <p class="text-xs text-gray-500">{{ colab.cargo }}</p>
              </td>

              <td class="p-4 text-sm">
                <span v-if="colab.equipe" class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">
                  {{ colab.equipe.nome }}
                </span>
                <span v-else class="text-gray-400 text-xs italic">--</span>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-bold',
                    colab.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ colab.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <td class="p-4 text-right">
                <button 
                  @click="editar(colab.id)" 
                  class="text-piaui-blue hover:text-blue-800 font-medium text-sm hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center" v-if="totalPages > 1">
        <button @click="mudarPagina(pageAtual - 1)" :disabled="first" class="px-3 py-1 bg-white border rounded disabled:opacity-50">Anterior</button>
        <span class="text-sm text-gray-600">Página {{ pageAtual + 1 }} de {{ totalPages }}</span>
        <button @click="mudarPagina(pageAtual + 1)" :disabled="last" class="px-3 py-1 bg-white border rounded disabled:opacity-50">Próximo</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { ColaboradorRespostaDTO, Page } from '../../../types/colaborador';
import { getIniciais } from '../../../utils/formatters';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const colaboradores = ref<ColaboradorRespostaDTO[]>([]);
const loading = ref(true);
const termo = ref('');

const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const fetch = async () => {
  loading.value = true;
  try {
    let url = `/colaboradores?page=${pageAtual.value}&size=10&sort=nome,asc`;
    if (termo.value) url += `&termo=${termo.value}`;
    
    const { data } = await api.get<Page<ColaboradorRespostaDTO>>(url);
    colaboradores.value = data.content;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => {
  pageAtual.value = p;
  fetch();
};

const editar = (id: number) => router.push(`/admin/colaboradores/${id}/editar`);

onMounted(() => fetch());
</script>