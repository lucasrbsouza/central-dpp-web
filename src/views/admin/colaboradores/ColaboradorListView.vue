<template>
  <div>
    <PageHeader title="Gestão de Colaboradores" subtitle="Atualize dados cadastrais, equipes e status." />

    <BaseSearchFilter v-model="termo" placeholder="Buscar por nome, matrícula ou cargo..." @search="fetch"
      :loading="loading" />

    <BaseListLayout :loading="loading" :is-empty="colaboradores.length === 0">

      <BaseTable :columns="tableColumns" :items="colaboradores">

        <template #cell-colaborador="{ item: colab }">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-blue-100 text-piaui-blue flex items-center justify-center font-bold text-xs shrink-0">
              {{ getIniciais(colab.nome, colab.sobrenome) }}
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ colab.nome }} {{ colab.sobrenome }}</p>
              <p class="text-xs text-gray-500">{{ colab.email || 'Sem e-mail' }}</p>
            </div>
          </div>
        </template>

        <template #cell-cargo="{ item: colab }">
          <p class="text-sm text-gray-800 font-medium">{{ colab.matricula }}</p>
          <p class="text-xs text-gray-500">{{ colab.cargo }}</p>
        </template>

        <template #cell-equipe="{ item: colab }">
          <span v-if="colab.equipe" class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-medium">
            {{ colab.equipe.nome }}
          </span>
          <span v-else class="text-gray-400 text-xs italic">--</span>
        </template>

        <template #cell-status="{ item: colab }">
          <BaseBadge :variant="colab.ativo ? 'success' : 'danger'" show-dot>
            {{ colab.ativo ? 'Ativo' : 'Inativo' }}
          </BaseBadge>
        </template>

        <template #cell-actions="{ item: colab }">
          <div class="flex justify-end">
            <BaseActionBtn action="edit" @click="editar(colab.id)" />
          </div>
        </template>

      </BaseTable>

      <template #pagination>
        <BasePagination :page="pageAtual" :total-pages="totalPages" :first="first" :last="last"
          @change-page="mudarPagina" />
      </template>

    </BaseListLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { ColaboradorRespostaDTO, Page } from '../../../types/colaborador';
import { getIniciais } from '../../../utils/formatters';

import PageHeader from '../../../components/common/PageHeader.vue';
import BaseListLayout from '../../../components/layout/BaseListLayout.vue';
import BaseTable from '../../../components/common/BaseTable.vue';
import type { TableColumn } from '../../../types/table';
import BaseBadge from '../../../components/common/BaseBadge.vue';
import BasePagination from '../../../components/common/BasePagination.vue';
import BaseActionBtn from '../../../components/common/BaseActionBtn.vue';
import BaseSearchFilter from '../../../components/common/BaseSearchFilter.vue';

const router = useRouter();
const colaboradores = ref<ColaboradorRespostaDTO[]>([]);
const loading = ref(true);
const termo = ref('');

const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const tableColumns: TableColumn[] = [
  { key: 'colaborador', label: 'Colaborador' }, // Sem width, ocupa o espaço livre
  { key: 'cargo', label: 'Matrícula / Cargo' },
  { key: 'equipe', label: 'Equipe' },
  { key: 'status', label: 'Status', align: 'center', width: '100px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '100px' }
];

const fetch = async () => {
  loading.value = true;
  try {
    let url = `/colaboradores?page=${pageAtual.value}&size=10&sort=nome,asc`;
    if (termo.value) url += `&termo=${termo.value}`;

    const { data } = await api.get<Page<ColaboradorRespostaDTO>>(url);
    colaboradores.value = data.content;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (p: number) => {
  pageAtual.value = p;
  fetch();
};

const editar = (id: number) => router.push(`/admin/colaboradores/${id}/editar`);

onMounted(() => fetch());
</script>