<template>
  <div>
    <PageHeader 
      title="Ferramentas & Sistemas" 
      subtitle="Acesso rápido aos principais links externos da secretaria."
    />

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <a 
        v-for="item in ferramentas" 
        :key="item.id"
        :href="item.link"
        target="_blank"
        class="bg-white p-6 rounded-lg shadow-md border-b-4 border-piaui-blue hover:-translate-y-1 hover:shadow-xl transition duration-300 group flex flex-col h-full"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-piaui-blue group-hover:text-white transition">
            <PhLink :size="32"/>
          </div>
          <span class="text-gray-400 text-sm">Externo ↗</span>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 group-hover:text-piaui-blue mb-2">{{ item.titulo }}</h3>
        <p class="text-gray-500 text-sm flex-1">{{ item.descricao }}</p>
        
        <div class="mt-4 text-piaui-blue font-semibold text-sm group-hover:underline">
          Entrar Agora &rarr;
        </div>
      </a>
    </div>

    <BaseEmptyState 
      v-if="!loading && ferramentas.length === 0"
      title="Nenhuma ferramenta disponível"
      description="No momento não há links externos cadastrados."
    >
      <template #icon>🛠️</template>
    </BaseEmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { FerramentaDTO, Page } from '../../types/ferramenta';
// Imports dos componentes
import PageHeader from '../../components/common/PageHeader.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'; // Assumindo que existe
import BaseEmptyState from '../../components/common/BaseEmptyState.vue';
import { PhLink } from '@phosphor-icons/vue';

const ferramentas = ref<FerramentaDTO[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get<Page<FerramentaDTO>>('/ferramentas?size=50&sort=titulo,asc');
    ferramentas.value = data.content.filter(f => f.ativo);
  } catch (error) {
    console.error('Erro ao carregar ferramentas', error);
  } finally {
    loading.value = false;
  }
});
</script>