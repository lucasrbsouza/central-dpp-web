<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Mural de Avisos</h2>
        <p class="text-gray-600 text-sm">Gerencie os comunicados exibidos no portal do servidor.</p>
      </div>
      <router-link 
        to="/admin/avisos/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Publicar Aviso
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
              <th class="p-4 font-semibold">Título / Descrição</th>
              <th class="p-4 font-semibold text-center">Prioridade</th>
              <th class="p-4 font-semibold">Vigência</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="aviso in avisos" :key="aviso.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4 max-w-md">
                <p class="font-bold text-gray-800 text-base mb-1">{{ aviso.titulo }}</p>
                <p class="text-sm text-gray-500 line-clamp-2">{{ aviso.conteudo }}</p>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase tracking-wide',
                    aviso.tipo === 'URGENTE' ? 'bg-red-100 text-red-700' : 
                    aviso.tipo === 'ALERTA' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ aviso.tipo }}
                </span>
              </td>

              <td class="p-4 text-sm text-gray-600">
                <div class="flex flex-col gap-1">
                  <span class="flex items-center gap-1">
                    <span class="text-green-600 text-xs font-bold">INÍCIO:</span> 
                    {{ formatarDataHora(aviso.dataInicio) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="text-red-400 text-xs font-bold">FIM:</span> 
                    {{ formatarDataHora(aviso.dataFim) }}
                  </span>
                </div>
              </td>

              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                   <button 
                    @click="excluirAviso(aviso.id)"
                    class="text-gray-400 hover:text-piaui-red p-2 rounded-md hover:bg-red-50 transition" 
                    title="Excluir Aviso"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="avisos.length === 0">
              <td colspan="4" class="p-10 text-center text-gray-500">
                <div class="mb-2 text-4xl">📢</div>
                Nenhum aviso publicado.
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
import api from '../../../services/api';
import type { AvisoDTO, Page } from '../../../types/aviso';
import { formatarDataHora } from '../../../utils/formatters';

const avisos = ref<AvisoDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const fetchAvisos = async (page = 0) => {
  loading.value = true;
  try {
    // Endpoint do backend (Verifique se é /avisos ou /avisos/admin)
    const { data } = await api.get<Page<AvisoDTO>>(`/avisos?page=${page}&size=10&sort=dataInicio,desc`);
    
    avisos.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => fetchAvisos(p);

const excluirAviso = async (id: number) => {
  if(!confirm('Tem certeza que deseja remover este aviso permanentemente?')) return;
  
  try {
    await api.delete(`/avisos/${id}`);
    fetchAvisos(pageAtual.value); // Recarrega a lista
  } catch (error) {
    alert('Erro ao excluir aviso.');
  }
};

onMounted(() => fetchAvisos());
</script>