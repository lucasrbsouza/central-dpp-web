<template>
  <div>
    <PageHeader 
      title="Diretório de Colaboradores" 
      subtitle="Encontre contatos e veja quem faz parte da nossa equipe."
    />

    <div class="max-w-xl mx-auto mb-10">
      <BaseSearchInput 
        v-model="termoBusca"
        placeholder="Buscar por nome, cargo ou matrícula..."
        @search="pesquisar"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <BaseEmptyState 
      v-else-if="colaboradores.length === 0"
      title="Nenhum colaborador encontrado"
      description="Tente ajustar sua busca ou limpar os filtros."
    >
      <template #icon><FaceFrownIcon class="w-12 h-12 text-gray-300" /></template>
      <template #action>
        <button @click="limparBusca" class="text-piaui-blue underline font-bold">Limpar filtros</button>
      </template>
    </BaseEmptyState>

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

    <div v-if="totalPages > 1 && !loading" class="mt-10 flex justify-center">
      <BasePagination 
        :page="pageAtual" 
        :totalPages="totalPages"
        :first="first"
        :last="last"
        @change-page="mudarPagina"
      />
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

// Componentes
import ColaboradorDetalhesModal from '../../components/user/ColaboradorDetalhesModal.vue';
import PageHeader from '../../components/common/PageHeader.vue';
import BaseEmptyState from '../../components/common/BaseEmptyState.vue';
import BaseSearchInput from '../../components/common/BaseSearchInput.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import BasePagination from '../../components/common/BasePagination.vue'; 
import { FaceFrownIcon } from '@heroicons/vue/24/outline';

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
    pesquisar();
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
  pageAtual.value = novaPagina;
  fetchColaboradores();
};
const pesquisar = () => { pageAtual.value = 0; fetchColaboradores(); };
const limparBusca = () => { termoBusca.value = ''; };

onMounted(() => fetchColaboradores());
</script>