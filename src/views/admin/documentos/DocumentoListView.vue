<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestão de Documentos</h2>
        <p class="text-gray-600 text-sm">Repositório de arquivos e links oficiais.</p>
      </div>
      <router-link 
        to="/admin/documentos/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Novo Documento
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
              <th class="p-4 font-semibold">Documento</th>
              <th class="p-4 font-semibold text-center">Tipo</th>
              <th class="p-4 font-semibold text-right">Acesso / Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="doc in documentos" :key="doc.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4">
                <div class="flex items-start gap-3">
                  <span class="text-2xl mt-1">{{ getIcone(doc) }}</span>
                  <div>
                    <p class="font-bold text-gray-800">{{ doc.titulo }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">{{ doc.descricao }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    doc.urlLink ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                  ]"
                >
                  {{ doc.urlLink ? 'Link Externo' : 'Arquivo PDF/Doc' }}
                </span>
              </td>

              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  
                  <a 
                    v-if="doc.urlLink" 
                    :href="doc.urlLink" 
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline mr-2"
                  >
                    Abrir Link ↗
                  </a>
                  <button 
                    v-else 
                    @click="downloadArquivo(doc)"
                    class="text-piaui-green hover:text-green-800 text-sm font-medium hover:underline mr-2 flex items-center ml-auto"
                  >
                    ⬇ Baixar
                  </button>

                  <button 
                    @click="excluir(doc.id)"
                    class="text-gray-400 hover:text-piaui-red p-2 rounded hover:bg-red-50 transition"
                    title="Excluir Permanentemente"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="documentos.length === 0">
              <td colspan="3" class="p-10 text-center text-gray-500">Nenhum documento encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center" v-if="totalPages > 1">
        <button @click="fetch(pageAtual - 1)" :disabled="first" class="px-3 py-1 bg-white border rounded disabled:opacity-50">Anterior</button>
        <span class="text-sm text-gray-600">Página {{ pageAtual + 1 }} de {{ totalPages }}</span>
        <button @click="fetch(pageAtual + 1)" :disabled="last" class="px-3 py-1 bg-white border rounded disabled:opacity-50">Próximo</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import type { DocumentoDTO, Page } from '../../../types/documento';

const documentos = ref<DocumentoDTO[]>([]);
const loading = ref(true);

const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const fetch = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<DocumentoDTO>>(`/documentos?page=${page}&size=10&sort=id,desc`);
    documentos.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
  } finally {
    loading.value = false;
  }
};

const getIcone = (doc: DocumentoDTO) => {
  return doc.urlLink ? '🔗' : '📄';
};

const downloadArquivo = async (doc: DocumentoDTO) => {
  try {
    // Faz a requisição pedindo BLOB (Binary Large Object)
    const response = await api.get(`/documentos/${doc.id}/download`, {
      responseType: 'blob'
    });
    
    // Cria um link temporário no navegador para forçar o download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Tenta pegar o nome do arquivo do Header ou usa o título
    link.setAttribute('download', `${doc.titulo}.pdf`); // Extensão genérica se não vier no header
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert('Erro ao baixar arquivo. Talvez ele tenha sido movido.');
  }
};

const excluir = async (id: number) => {
  if(!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
  try {
    await api.delete(`/documentos/${id}`);
    fetch(pageAtual.value);
  } catch (error) {
    alert('Erro ao excluir documento.');
  }
};

onMounted(() => fetch());
</script>