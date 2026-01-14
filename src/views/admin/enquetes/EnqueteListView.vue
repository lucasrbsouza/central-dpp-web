<template>
  <div>
    <PageHeader 
      title="Enquetes e Votações" 
      subtitle="Crie pesquisas para interagir com os colaboradores."
    >
      <template #actions>
        <router-link 
          to="/admin/enquetes/novo" 
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium"
        >
          <span>+</span> Nova Enquete
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="enquetes.length === 0"
    >
      <template #empty>
        <div class="mb-2 text-4xl text-gray-300">
          <ChatBubbleBottomCenterTextIcon class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-gray-500 text-lg">Nenhuma enquete encontrada.</p>
      </template>

      <BaseTable :columns="tableColumns" :items="enquetes">
        
        <template #cell-pergunta="{ item: enquete }">
          <div>
            <p class="font-bold text-gray-800 text-base">{{ enquete.pergunta }}</p>
            <p class="text-xs text-gray-500 mb-1">{{ enquete.descricao || 'Sem descrição adicional' }}</p>
            
            <span class="inline-flex items-center gap-1 text-xs font-bold text-piaui-blue bg-blue-50 px-2 py-0.5 rounded-full">
              {{ calcularTotalVotos(enquete) }} votos computados
            </span>
          </div>
        </template>

        <template #cell-tipo="{ item: enquete }">
          <BaseBadge :variant="enquete.multiplaEscolha ? 'neutral' : 'info'">
            {{ enquete.multiplaEscolha ? 'Múltipla' : 'Única' }}
          </BaseBadge>
        </template>

        <template #cell-encerramento="{ item: enquete }">
          <div class="flex flex-col items-center">
            <span 
              class="font-medium text-sm"
              :class="isExpirada(enquete.dataFim) ? 'text-red-600' : 'text-green-600'"
            >
              {{ formatarDataHora(enquete.dataFim) }}
            </span>
            <span v-if="isExpirada(enquete.dataFim)" class="text-[10px] uppercase font-bold text-red-400 bg-red-50 px-1 rounded mt-0.5">
              Encerrada
            </span>
            <span v-else class="text-[10px] uppercase font-bold text-green-500 bg-green-50 px-1 rounded mt-0.5">
              Aberta
            </span>
          </div>
        </template>

        <template #cell-actions="{ item: enquete }">
          <div class="flex justify-end">
            <BaseActionBtn 
              action="delete" 
              @click="excluir(enquete.id)" 
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
import api from '../../../services/api';
import type { EnqueteDTO, Page } from '../../../types/enquete';
import { formatarDataHora } from '../../../utils/formatters';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes UI
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseListLayout from '../../../components/layout/BaseListLayout.vue';
import BaseTable from '../../../components/common/BaseTable.vue';
import type { TableColumn } from '../../../types/table';
import BaseBadge from '../../../components/common/BaseBadge.vue';
import BasePagination from '../../../components/common/BasePagination.vue';
import BaseActionBtn from '../../../components/common/BaseActionBtn.vue';

const enquetes = ref<EnqueteDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Configuração das Colunas
const tableColumns: TableColumn[] = [
  { key: 'pergunta', label: 'Pergunta / Descrição' },
  { key: 'tipo', label: 'Tipo', align: 'center', width: '120px' },
  { key: 'encerramento', label: 'Encerramento', align: 'center', width: '180px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '80px' }
];

const fetch = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<EnqueteDTO>>(`/enquetes?page=${page}&size=10&sort=dataFim,desc`);
    enquetes.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar enquetes:', error);
    toast.error('Erro ao carregar enquetes.');
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => fetch(p);

// --- Lógica de Negócio ---

const calcularTotalVotos = (e: EnqueteDTO) => {
  if (!e.opcoes) return 0;
  return e.opcoes.reduce((acc, curr) => acc + curr.totalVotos, 0);
};

const isExpirada = (dataFim: string) => {
  return new Date(dataFim) < new Date();
};

const excluir = async (id: number) => {
  if(!confirm('Ao excluir, todos os votos serão perdidos. Tem certeza?')) return;
  try {
    await api.delete(`/enquetes/${id}`);
    toast.success('Enquete excluída.');
    fetch(pageAtual.value);
  } catch (error) {
    console.error(error);
    toast.error('Erro ao excluir enquete.');
  }
};

onMounted(() => fetch());
</script>