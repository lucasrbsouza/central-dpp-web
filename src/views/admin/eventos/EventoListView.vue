<template>
  <div>
    <PageHeader 
      title="Agenda de Eventos" 
      subtitle="Gerencie reuniões, feriados e treinamentos da secretaria."
    >
      <template #actions>
        <router-link 
          to="/admin/eventos/novo" 
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium"
        >
          <span>+</span> Novo Evento
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="eventos.length === 0"
    >
      <template #empty>
        <div class="mb-2 text-4xl text-gray-300">
          <CalendarDaysIcon class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-gray-500 text-lg">Nenhum evento agendado.</p>
      </template>

      <BaseTable :columns="tableColumns" :items="eventos">
        
        <template #cell-evento="{ item: evento }">
          <div>
            <p class="font-bold text-gray-800">{{ evento.titulo }}</p>
            <p class="text-xs text-gray-500 line-clamp-1">
              {{ evento.descricao || 'Sem descrição' }}
            </p>
          </div>
        </template>

        <template #cell-tipo="{ item: evento }">
          <BaseBadge :variant="getBadgeVariant(evento.tipo)">
            {{ evento.tipo }}
          </BaseBadge>
        </template>

        <template #cell-data="{ item: evento }">
          <div class="flex flex-col text-sm text-gray-700">
            <span class="font-medium flex items-center gap-1">
              📅 {{ formatarDataHora(evento.dataInicio) }}
            </span>
            <span class="text-xs text-gray-400 ml-5">
              até {{ formatarHora(evento.dataFim) }}
            </span>
          </div>
        </template>

        <template #cell-actions="{ item: evento }">
          <div class="flex justify-end gap-2">
            <BaseActionBtn 
              action="edit" 
              @click="editar(evento.id)" 
            />
            <BaseActionBtn 
              action="delete" 
              @click="excluir(evento.id)" 
            />
          </div>
        </template>

      </BaseTable>

      <template #pagination>
        <BasePagination 
          :page="pageAtual" 
          :total-pages="totalPages" 
          :first="first" 
          :last="last"
          @change-page="mudarPagina" 
        />
      </template>

    </BaseListLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { EventoDTO, Page } from '../../../types/evento';
import { formatarDataHora, formatarHora } from '../../../utils/formatters';
import { CalendarDaysIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseListLayout from '../../../components/layout/BaseListLayout.vue';
import BaseTable from '../../../components/common/BaseTable.vue';
import type { TableColumn } from '../../../types/table';
import BaseBadge from '../../../components/common/BaseBadge.vue';
import BasePagination from '../../../components/common/BasePagination.vue';
import BaseActionBtn from '../../../components/common/BaseActionBtn.vue';

const router = useRouter();
const eventos = ref<EventoDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Configuração das Colunas
const tableColumns: TableColumn[] = [
  { key: 'evento', label: 'Evento' },
  { key: 'tipo', label: 'Tipo', align: 'center', width: '130px' },
  { key: 'data', label: 'Data e Hora', width: '200px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '100px' }
];

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
    toast.error('Erro ao carregar a lista de eventos.');
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
    toast.success('Evento removido com sucesso!');
    fetchEventos(pageAtual.value);
  } catch (error) {
    console.error(error);
    toast.error('Erro ao excluir evento.');
  }
};

// Mapeamento de Cores para o BaseBadge
const getBadgeVariant = (tipo: string) => {
  // Ajuste conforme os nomes que vêm do seu backend
  switch (tipo?.toUpperCase()) {
    case 'REUNIAO': 
    case 'REUNIÃO': return 'info';       // Azul
    
    case 'TREINAMENTO': return 'neutral'; // Cinza/Roxo
    
    case 'FERIADO': return 'success';     // Verde
    
    case 'ANIVERSARIO':
    case 'ANIVERSÁRIO': return 'warning'; // Amarelo
    
    default: return 'neutral';
  }
};

onMounted(() => fetchEventos());
</script>