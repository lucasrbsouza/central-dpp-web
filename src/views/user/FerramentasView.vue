<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-800">Ferramentas & Sistemas</h2>
      <p class="text-gray-600 mt-2">Acesso rápido aos principais links externos da secretaria.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
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
            🔗
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

    <div v-if="!loading && ferramentas.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
      <p class="text-xl">🛠️</p>
      <p class="mt-2">Nenhuma ferramenta disponível no momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { FerramentaDTO, Page } from '../../types/ferramenta';

const ferramentas = ref<FerramentaDTO[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Busca apenas as ferramentas ATIVAS (podes ter um endpoint específico ou filtrar no front se a paginação permitir)
    // Supondo que o endpoint padrão traga tudo, num cenário real idealmente terias /ferramentas/publicas
    const { data } = await api.get<Page<FerramentaDTO>>('/ferramentas?size=50&sort=titulo,asc');
    // Filtra no front por garantia se a API retornar inativos
    ferramentas.value = data.content.filter(f => f.ativo);
  } catch (error) {
    console.error('Erro ao carregar ferramentas', error);
  } finally {
    loading.value = false;
  }
});
</script>