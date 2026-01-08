<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Ferramentas Externas</h2>
        <p class="text-gray-600 text-sm">Gerencie os links úteis disponíveis para os colaboradores.</p>
      </div>
      <router-link 
        to="/admin/ferramentas/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Nova Ferramenta
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
              <th class="p-4 font-semibold">Título / Descrição</th> <th class="p-4 font-semibold">Link de Destino</th>
              <th class="p-4 font-semibold text-center">Status</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in ferramentas" :key="item.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4">
                <p class="font-bold text-gray-800">{{ item.titulo }}</p>
                <p class="text-xs text-gray-500">{{ item.descricao }}</p>
              </td>

              <td class="p-4">
                <a :href="item.link" target="_blank" class="text-piaui-blue hover:underline text-sm flex items-center gap-1">
                  {{ item.link }} 🔗
                </a>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-bold',
                    item.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editar(item.id)" class="text-gray-400 hover:text-piaui-blue p-2 rounded hover:bg-blue-50 transition">✏️</button>
                  <button @click="excluir(item.id)" class="text-gray-400 hover:text-piaui-red p-2 rounded hover:bg-red-50 transition">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="ferramentas.length === 0">
              <td colspan="4" class="p-10 text-center text-gray-500">Nenhuma ferramenta cadastrada.</td>
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
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { FerramentaDTO, Page } from '../../../types/ferramenta';

const router = useRouter();
const ferramentas = ref<FerramentaDTO[]>([]);
const loading = ref(true);

const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const fetch = async (page = 0) => {
  loading.value = true;
  try {
    // CORREÇÃO: sort=titulo (era sort=nome)
    const { data } = await api.get<Page<FerramentaDTO>>(`/ferramentas?page=${page}&size=10&sort=titulo,asc`);
    ferramentas.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar ferramentas:', error);
  } finally {
    loading.value = false;
  }
};

const editar = (id: number) => router.push(`/admin/ferramentas/${id}/editar`);

const excluir = async (id: number) => {
  if(!confirm('Remover esta ferramenta?')) return;
  try {
    await api.delete(`/ferramentas/${id}`);
    fetch(pageAtual.value);
  } catch (error) {
    alert('Erro ao excluir.');
  }
};

onMounted(() => fetch());
</script>