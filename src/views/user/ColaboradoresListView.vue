<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-800">Diretório de Colaboradores</h2>
      <p class="text-gray-600 mt-1">Encontre contatos e veja quem faz parte da nossa equipe.</p>
    </div>

    <div class="max-w-xl mx-auto mb-10 relative">
      <input 
        v-model="termoBusca" 
        @keyup.enter="pesquisar"
        type="text" 
        placeholder="Buscar por nome, cargo ou matrícula..." 
        class="w-full pl-12 pr-12 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-piaui-blue outline-none transition"
      >
      <span class="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
      <button v-if="termoBusca" @click="limparBusca" class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">✕</button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
    </div>

    <div v-else-if="colaboradores.length === 0" class="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
      <p class="text-4xl mb-2">🤷‍♂️</p>
      <p class="text-gray-500">Nenhum colaborador encontrado.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="colab in colaboradores" 
        :key="colab.id"
        @click="selecionado = colab" 
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md hover:-translate-y-1 transition cursor-pointer group"
      >
        <div class="w-20 h-20 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xl font-bold mb-4 border-2 border-white shadow-sm group-hover:border-piaui-blue transition-colors">
          {{ getIniciais(colab.nome, colab.sobrenome) }}
        </div>

        <h3 class="font-bold text-gray-800 text-center truncate w-full group-hover:text-piaui-blue transition">
          {{ colab.nome }} {{ colab.sobrenome }}
        </h3>
        <p class="text-xs text-piaui-blue font-medium uppercase tracking-wide mb-1 text-center truncate w-full">
          {{ colab.cargo }}
        </p>
        <p class="text-xs text-gray-400 truncate w-full text-center">
          {{ colab.equipe?.nome || 'Sem Equipe' }}
        </p>
      </div>
    </div>

    <div v-if="totalPages > 1 && !loading" class="flex justify-center mt-10 gap-2">
      <button @click="mudarPagina(pageAtual - 1)" :disabled="first" class="px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
      <span class="px-4 py-2 text-gray-600">Página <strong>{{ pageAtual + 1 }}</strong> de <strong>{{ totalPages }}</strong></span>
      <button @click="mudarPagina(pageAtual + 1)" :disabled="last" class="px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Próximo</button>
    </div>

    <ColaboradorDetalhesModal 
      v-if="selecionado" 
      :colaborador="selecionado" 
      @close="selecionado = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../../services/api';
import type { ColaboradorRespostaDTO, Page } from '../../types/colaborador';
import { getIniciais } from '../../utils/formatters';
import ColaboradorDetalhesModal from '../../components/user/ColaboradorDetalhesModal.vue';


const colaboradores = ref<ColaboradorRespostaDTO[]>([]);
const loading = ref(true);
const termoBusca = ref('');
const selecionado = ref<ColaboradorRespostaDTO | null>(null);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

let timeout: ReturnType<typeof setTimeout>;
watch(termoBusca, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    pageAtual.value = 0;
    fetchColaboradores();
  }, 500);
});

const fetchColaboradores = async () => {
  loading.value = true;
  try {
    let url = `/colaboradores?page=${pageAtual.value}&size=12&sort=nome,asc`;
    if (termoBusca.value) url += `&termo=${termoBusca.value}`;
    const { data } = await api.get<Page<ColaboradorRespostaDTO>>(url);
    colaboradores.value = data.content;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao buscar colaboradores', error);
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 0 && novaPagina < totalPages.value) {
    pageAtual.value = novaPagina;
    fetchColaboradores();
  }
};
const pesquisar = () => { pageAtual.value = 0; fetchColaboradores(); };
const limparBusca = () => { termoBusca.value = ''; };

onMounted(() => fetchColaboradores());
</script>