<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Agenda de Eventos</h2>
        <p class="text-gray-600 text-sm">Gerencie reuniões, feriados e treinamentos da secretaria.</p>
      </div>
      <router-link 
        to="/admin/eventos/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Novo Evento
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
              <th class="p-4 font-semibold">Evento</th>
              <th class="p-4 font-semibold text-center">Tipo</th>
              <th class="p-4 font-semibold">Data e Hora</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="evento in eventos" :key="evento.id" class="hover:bg-gray-50 transition">
              
              <td class="p-4">
                <p class="font-bold text-gray-800">{{ evento.titulo }}</p>
                <p class="text-xs text-gray-500 line-clamp-1">{{ evento.descricao || 'Sem descrição' }}</p>
              </td>

              <td class="p-4 text-center">
                <span :class="['px-2 py-1 rounded text-xs font-bold uppercase tracking-wide', getCorTipo(evento.tipo)]">
                  {{ evento.tipo }}
                </span>
              </td>

              <td class="p-4 text-sm text-gray-600">
                <div class="flex flex-col">
                  <span>📅 {{ formatarDataHora(evento.dataInicio) }}</span>
                  <span class="text-xs text-gray-400">até {{ formatarHora(evento.dataFim) }}</span>
                </div>
              </td>

              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="editar(evento.id)"
                    class="text-gray-400 hover:text-piaui-blue p-2 rounded hover:bg-blue-50 transition"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="excluir(evento.id)"
                    class="text-gray-400 hover:text-piaui-red p-2 rounded hover:bg-red-50 transition"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="eventos.length === 0">
              <td colspan="4" class="p-10 text-center text-gray-500">
                Nenhum evento agendado.
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
import type { EventoDTO, Page } from '../../../types/evento';
import { formatarDataHora, formatarHora } from '../../../utils/formatters';

const router = useRouter();
const eventos = ref<EventoDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const getCorTipo = (tipo: string) => {
  switch (tipo) {
    case 'REUNIAO': return 'bg-blue-100 text-blue-700';
    case 'TREINAMENTO': return 'bg-purple-100 text-purple-700';
    case 'FERIADO': return 'bg-green-100 text-green-700';
    case 'ANIVERSARIO': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const fetchEventos = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<EventoDTO>>(`/eventos?page=${page}&size=10&sort=dataInicio,desc`);
    eventos.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => fetchEventos(p);

const editar = (id: number) => router.push(`/admin/eventos/${id}/editar`);

const excluir = async (id: number) => {
  if(!confirm('Deseja realmente remover este evento?')) return;
  try {
    await api.delete(`/eventos/${id}`);
    fetchEventos(pageAtual.value);
  } catch (error) {
    alert('Erro ao excluir evento.');
  }
};

onMounted(() => fetchEventos());
</script>