<template>
  <div>
    <PageHeader 
      title="Mural de Avisos" 
      subtitle="Gerencie os comunicados exibidos no portal do servidor."
    >
      <template #actions>
        <router-link 
          to="/admin/avisos/novo" 
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium"
        >
          <span>+</span> Publicar Aviso
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="avisos.length === 0"
    >
      <template #empty>
        <div class="mb-2 text-4xl text-gray-300">
          <BellIcon class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-gray-500 text-lg">Nenhum aviso publicado.</p>
      </template>

      <BaseTable :columns="tableColumns" :items="avisos">
        
        <template #cell-titulo="{ item: aviso }">
          <div class="max-w-md">
            <p class="font-bold text-gray-800 text-base mb-1">{{ aviso.titulo }}</p>
            <p class="text-sm text-gray-500 line-clamp-2">{{ aviso.conteudo }}</p>
          </div>
        </template>

        <template #cell-prioridade="{ item: aviso }">
          <BaseBadge :variant="getBadgeVariant(aviso.tipo)">
            {{ aviso.tipo }}
          </BaseBadge>
        </template>

        <template #cell-vigencia="{ item: aviso }">
          <div class="flex flex-col gap-1 text-sm text-gray-600">
            <span class="flex items-center gap-1">
              <span class="text-green-600 text-xs font-bold">INÍCIO:</span> 
              {{ formatarDataHora(aviso.dataInicio) }}
            </span>
            <span class="flex items-center gap-1">
              <span class="text-red-400 text-xs font-bold">FIM:</span> 
              {{ formatarDataHora(aviso.dataFim) }}
            </span>
          </div>
        </template>

        <template #cell-actions="{ item: aviso }">
          <div class="flex justify-end gap-2">
            <BaseActionBtn 
              action="edit" 
              @click="editar(aviso.id)" 
            />
            
            <BaseActionBtn 
              action="delete" 
              @click="excluirAviso(aviso.id)" 
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
import type { AvisoDTO, Page } from '../../../types/aviso';
import { formatarDataHora } from '../../../utils/formatters';
import { BellIcon } from '@heroicons/vue/24/outline';
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
const avisos = ref<AvisoDTO[]>([]);
const loading = ref(true);

// Configuração das Colunas
const tableColumns: TableColumn[] = [
  { key: 'titulo', label: 'Título / Descrição' },
  { key: 'prioridade', label: 'Prioridade', align: 'center', width: '120px' },
  { key: 'vigencia', label: 'Vigência', width: '220px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '100px' }
];

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const fetchAvisos = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<AvisoDTO>>(`/avisos?page=${page}&size=10&sort=dataInicio,desc`);
    avisos.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    toast.error('Erro ao carregar a lista de avisos.');
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => fetchAvisos(p);

const editar = (id: number) => {
  router.push(`/admin/avisos/${id}/editar`);
};

const excluirAviso = async (id: number) => {
  if(!confirm('Tem certeza que deseja remover este aviso permanentemente?')) return;
  
  try {
    await api.delete(`/avisos/${id}`);
    toast.success('Aviso excluído com sucesso!');
    fetchAvisos(pageAtual.value);
  } catch (error) {
    console.error(error);
    toast.error('Erro ao excluir aviso.');
  }
};

// Helper para cores do Badge
const getBadgeVariant = (tipo: string) => {
  switch (tipo) {
    case 'URGENTE': return 'danger';   // Vermelho
    case 'ALERTA': return 'warning';   // Amarelo
    case 'INFO': return 'info';        // Azul
    default: return 'neutral';
  }
};

onMounted(() => fetchAvisos());
</script>