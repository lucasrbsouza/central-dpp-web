<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-800">Documentos Oficiais</h2>
      <p class="text-gray-600 mt-2">Repositório de arquivos, manuais e links importantes da secretaria.</p>
    </div>

    <div class="max-w-md mx-auto mb-10 relative">
      <input 
        v-model="filtro" 
        type="text" 
        placeholder="Buscar documento por título..." 
        class="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-piaui-blue outline-none"
      >
      <span class="absolute left-4 top-3.5 text-gray-400">🔍</span>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div 
        v-for="doc in documentosFiltrados" 
        :key="doc.id" 
        class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden"
      >
        <div :class="['h-2 bg-gradient-to-r', doc.urlLink ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600']"></div>
        
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-start justify-between mb-4">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-2', doc.urlLink ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600']">
              {{ doc.urlLink ? '🔗' : '📄' }}
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
              {{ doc.urlLink ? 'Link Externo' : 'Arquivo' }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-piaui-blue transition-colors">
            {{ doc.titulo }}
          </h3>
          
          <p class="text-sm text-gray-600 mb-4 flex-1">
            {{ doc.descricao || 'Sem descrição.' }}
          </p>

          <div class="mt-auto pt-4 border-t border-gray-50">
            <a 
              v-if="doc.urlLink"
              :href="doc.urlLink" 
              target="_blank"
              class="flex items-center justify-center w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold transition"
            >
              Acessar Link ↗
            </a>

            <button 
              v-else
              @click="downloadArquivo(doc)"
              :disabled="baixando === doc.id"
              class="flex items-center justify-center w-full py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 font-semibold transition disabled:opacity-50"
            >
              <span v-if="baixando === doc.id" class="animate-spin mr-2">⚪</span>
              {{ baixando === doc.id ? 'Baixando...' : '⬇ Baixar Arquivo' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && documentosFiltrados.length === 0" class="text-center py-16">
      <div class="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
        📂
      </div>
      <h3 class="text-lg font-medium text-gray-900">Nenhum documento encontrado</h3>
      <p class="text-gray-500 mt-1">Tente buscar por outro termo.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import type { DocumentoDTO, Page } from '../../types/documento';

const documentos = ref<DocumentoDTO[]>([]);
const loading = ref(true);
const filtro = ref('');
const baixando = ref<number | null>(null);

// Computada para filtrar localmente (UX mais rápida)
const documentosFiltrados = computed(() => {
  if (!filtro.value) return documentos.value;
  const termo = filtro.value.toLowerCase();
  return documentos.value.filter(d => 
    d.titulo.toLowerCase().includes(termo) || 
    d.descricao?.toLowerCase().includes(termo)
  );
});

onMounted(async () => {
  try {
    // Busca os documentos (assumindo paginação grande para trazer "todos" ou paginar depois)
    const { data } = await api.get<Page<DocumentoDTO>>('/documentos?size=50&sort=id,desc');
    documentos.value = data.content;
  } catch (error) {
    console.error('Erro ao carregar documentos', error);
  } finally {
    loading.value = false;
  }
});

const downloadArquivo = async (doc: DocumentoDTO) => {
  baixando.value = doc.id;
  try {
    const response = await api.get(`/documentos/${doc.id}/download`, {
      responseType: 'blob'
    });
    
    // Cria link invisível para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.titulo}.pdf`); // Tenta nome padrão
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert('Erro ao baixar arquivo. Verifique se ele ainda existe.');
  } finally {
    baixando.value = null;
  }
};
</script>