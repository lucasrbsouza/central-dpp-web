<template>
  <div>
    <PageHeader 
      title="Ferramentas Externas" 
      subtitle="Gerencie os links úteis disponíveis para os colaboradores."
    >
      <template #actions>
        <router-link 
          to="/admin/ferramentas/novo" 
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium"
        >
          <span>+</span> Nova Ferramenta
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="ferramentas.length === 0"
    >
      <template #empty>
        <div class="mb-2 text-4xl text-gray-300">
          <WrenchScrewdriverIcon class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-gray-500 text-lg">Nenhuma ferramenta cadastrada.</p>
      </template>

      <BaseTable :columns="tableColumns" :items="ferramentas">
        
        <template #cell-info="{ item: tool }">
          <div>
            <p class="font-bold text-gray-800">{{ tool.titulo }}</p>
            <p class="text-xs text-gray-500">{{ tool.descricao || 'Sem descrição' }}</p>
          </div>
        </template>

        <template #cell-link="{ item: tool }">
          <a 
            :href="tool.link" 
            target="_blank" 
            class="text-piaui-blue hover:text-blue-800 hover:underline text-sm flex items-center gap-1 group w-fit"
            title="Abrir link externo"
          >
            <LinkIcon class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
            <span class="truncate max-w-[250px]">{{ tool.link }}</span>
          </a>
        </template>

        <template #cell-status="{ item: tool }">
          <BaseBadge 
            :variant="tool.ativo ? 'success' : 'danger'" 
            show-dot
          >
            {{ tool.ativo ? 'Ativo' : 'Inativo' }}
          </BaseBadge>
        </template>

        <template #cell-actions="{ item: tool }">
          <div class="flex justify-end gap-2">
            <BaseActionBtn 
              action="edit" 
              @click="editar(tool.id)" 
            />
            <BaseActionBtn 
              action="delete" 
              @click="excluir(tool.id)" 
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
          @change-page="fetch" 
        />
      </template>

    </BaseListLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { FerramentaDTO, Page } from '../../../types/ferramenta';
import { WrenchScrewdriverIcon, LinkIcon } from '@heroicons/vue/24/outline';
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
const ferramentas = ref<FerramentaDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Configuração das Colunas
const tableColumns: TableColumn[] = [
  { key: 'info', label: 'Título / Descrição' },
  { key: 'link', label: 'Link de Destino', width: '300px' },
  { key: 'status', label: 'Status', align: 'center', width: '120px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '100px' }
];

const fetch = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<FerramentaDTO>>(`/ferramentas?page=${page}&size=10&sort=titulo,asc`);
    ferramentas.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar ferramentas:', error);
    toast.error('Erro ao carregar lista de ferramentas.');
  } finally {
    loading.value = false;
  }
};

const editar = (id: number) => router.push(`/admin/ferramentas/${id}/editar`);

const excluir = async (id: number) => {
  if(!confirm('Deseja realmente remover esta ferramenta?')) return;
  try {
    await api.delete(`/ferramentas/${id}`);
    toast.success('Ferramenta removida com sucesso!');
    fetch(pageAtual.value);
  } catch (error) {
    console.error(error);
    toast.error('Erro ao excluir ferramenta.');
  }
};

onMounted(() => fetch());
</script>