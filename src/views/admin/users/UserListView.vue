<template>
  <div>
    <PageHeader title="Gerenciar Usuários" subtitle="Administre os acessos e permissões do sistema.">
      <template #actions>
        <router-link to="/admin/usuarios/novo"
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium">
          <span>+</span> Novo Usuário
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout :loading="loading" :is-empty="users.length === 0">

      <BaseTable :columns="userColumns" :items="users">

        <template #cell-info="{ item: user }">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase shrink-0">
              {{ user.username.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="font-medium text-gray-800 truncate">{{ user.username }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
            </div>
          </div>
        </template>

        <template #cell-roles="{ item: user }">
          <div class="flex flex-wrap gap-1">
            <BaseBadge v-for="role in user.roles" :key="role" :variant="getRoleVariant(role)">
              {{ formatRole(role) }}
            </BaseBadge>
          </div>
        </template>

        <template #cell-status="{ item: user }">
          <BaseBadge :variant="user.ativo ? 'success' : 'danger'" show-dot>
            {{ user.ativo ? 'Ativo' : 'Inativo' }}
          </BaseBadge>
        </template>

        <template #cell-actions="{ item: user }">
          <div class="flex items-center justify-end gap-2">

            <BaseActionBtn action="edit" @click="editarUsuario(user.id)" />

            <BaseActionBtn v-if="user.ativo" action="block" label="Bloquear Acesso"
              @click="alterarStatus(user, false)" />

            <BaseActionBtn v-else action="activate" label="Reativar Acesso" @click="alterarStatus(user, true)" />

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
import type { UsuarioDTO, Page } from '../../../types/user';

import PageHeader from '../../../components/common/PageHeader.vue';
import BaseListLayout from '../../../components/layout/BaseListLayout.vue';
import BaseTable from '../../../components/common/BaseTable.vue';
import BaseBadge from '../../../components/common/BaseBadge.vue';
import BasePagination from '../../../components/common/BasePagination.vue';
import BaseActionBtn from '../../../components/common/BaseActionBtn.vue';

import type { TableColumn } from '../../../types/table';

const router = useRouter();
const users = ref<UsuarioDTO[]>([]);
const loading = ref(true);

const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

const userColumns: TableColumn[] = [
  { key: 'info', label: 'Usuário / E-mail' },
  { key: 'roles', label: 'Permissões (Roles)', width: '200px' },
  { key: 'status', label: 'Status', align: 'center', width: '120px' },
  { key: 'actions', label: 'Ações', align: 'right', width: '120px' }
];

// --- Lógica de Negócio ---

const fetchUsers = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<UsuarioDTO>>(`/usuarios?page=${page}&size=10&sort=id,desc`);
    users.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    alert('Erro ao carregar a lista de usuários.');
  } finally {
    loading.value = false;
  }
};

const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 0 && novaPagina < totalPages.value) {
    fetchUsers(novaPagina);
  }
};

const editarUsuario = (id: number) => {
  router.push(`/admin/usuarios/${id}/editar`);
};

const alterarStatus = async (user: UsuarioDTO, novoStatus: boolean) => {
  const acao = novoStatus ? 'ativar' : 'bloquear';
  if (!confirm(`Tem certeza que deseja ${acao} o usuário ${user.username}?`)) return;

  try {
    await api.patch(`/usuarios/${user.id}/status`, { ativo: novoStatus });
    user.ativo = novoStatus; // Feedback otimista
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert('Não foi possível alterar o status.');
  }
};

// --- Helpers de Formatação ---

const formatRole = (role: string) => {
  return role.replace('ROLE_', '');
};

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN': return 'neutral';
    case 'ROLE_GESTOR': return 'info';
    default: return 'neutral';
  }
};

onMounted(() => {
  fetchUsers();
});
</script>