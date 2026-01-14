<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gerenciar Usuários</h2>
        <p class="text-gray-600 text-sm">Administre os acessos e permissões do sistema.</p>
      </div>
      <router-link 
        to="/admin/usuarios/novo" 
        class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
      >
        <span>+</span> Novo Usuário
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
        <p class="text-gray-500 mt-2 text-sm">Carregando usuários...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <th class="p-4 font-semibold">Usuário / E-mail</th>
              <th class="p-4 font-semibold">Permissões (Roles)</th>
              <th class="p-4 font-semibold text-center">Status</th>
              <th class="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition">
              
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                    {{ user.username.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ user.username }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>

              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="role in user.roles" 
                    :key="role"
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-medium border',
                      role === 'ROLE_ADMIN' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : role === 'ROLE_GESTOR'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    ]"
                  >
                    {{ formatRole(role) }}
                  </span>
                </div>
              </td>

              <td class="p-4 text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1',
                    user.ativo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ user.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    class="text-gray-400 hover:text-piaui-blue p-1 rounded-md hover:bg-blue-50 transition" 
                    title="Editar"
                    @click="editarUsuario(user.id)"
                  >
                    <PencilSquareIcon class="h-5 w-5" />
                  </button>
                  <button 
                    v-if="user.ativo"
                    class="text-gray-400 hover:text-piaui-red p-1 rounded-md hover:bg-red-50 transition" 
                    title="Bloquear Acesso"
                    @click="alterarStatus(user, false)"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                  <button 
                    v-else
                    class="text-gray-400 hover:text-piaui-green p-1 rounded-md hover:bg-green-50 transition" 
                    title="Reativar Acesso"
                    @click="alterarStatus(user, true)"
                  >
                    <CheckCircleIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
        <span class="text-sm text-gray-600">
          Mostrando página <strong>{{ pageAtual + 1 }}</strong> de <strong>{{ totalPages }}</strong>
        </span>
        <div class="flex gap-2">
          <button 
            @click="mudarPagina(pageAtual - 1)"
            :disabled="first"
            class="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button 
            @click="mudarPagina(pageAtual + 1)"
            :disabled="last"
            class="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { UsuarioDTO, Page } from '../../../types/user';
import { XMarkIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const users = ref<UsuarioDTO[]>([]);
const loading = ref(true);

// Estado da Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Carregar Usuários
const fetchUsers = async (page = 0) => {
  loading.value = true;
  try {
    // Backend usa paginação baseada em 0 (page=0 é a primeira)
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

// Funções Auxiliares
const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 0 && novaPagina < totalPages.value) {
    fetchUsers(novaPagina);
  }
};

const formatRole = (role: string) => {
  // Remove o prefixo "ROLE_" para ficar mais bonito
  return role.replace('ROLE_', '');
};

const editarUsuario = (id: number) => {
  // Navega para a tela de edição (que criaremos depois)
  router.push(`/admin/usuarios/${id}/editar`);
};

const alterarStatus = async (user: UsuarioDTO, novoStatus: boolean) => {
  if (!confirm(`Tem certeza que deseja ${novoStatus ? 'ativar' : 'bloquear'} o usuário ${user.username}?`)) return;

  try {
    // Supondo que existe um endpoint PATCH ou PUT para status
    // Ajuste conforme seu backend: /usuarios/{id}/status ou update completo
    await api.patch(`/usuarios/${user.id}/status`, { ativo: novoStatus });
    
    // Atualiza localmente para feedback instantâneo
    user.ativo = novoStatus;
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert('Não foi possível alterar o status. Verifique suas permissões.');
  }
};

// Inicialização
onMounted(() => {
  fetchUsers();
});
</script>