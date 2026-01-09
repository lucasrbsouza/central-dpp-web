<template>
  <div class="max-w-4xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/colaboradores" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Editar Colaborador</h2>
        <p class="text-gray-600 text-sm">Atualize as informações funcionais e pessoais.</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <form @submit.prevent="salvar" class="space-y-6">
        
        <h3 class="text-sm font-bold text-gray-400 uppercase border-b pb-2">Identificação</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="label-form">Nome <span class="text-red-500">*</span></label>
            <input v-model="form.nome" type="text" required class="input-form">
          </div>
          <div>
            <label class="label-form">Sobrenome <span class="text-red-500">*</span></label>
            <input v-model="form.sobrenome" type="text" required class="input-form">
          </div>
          <div>
            <label class="label-form">Matrícula <span class="text-red-500">*</span></label>
            <input v-model="form.matricula" type="text" required class="input-form">
          </div>
          <div>
            <label class="label-form">Gênero <span class="text-red-500">*</span></label>
            <select v-model="form.genero" class="input-form bg-white">
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <h3 class="text-sm font-bold text-gray-400 uppercase border-b pb-2 pt-4">Dados Funcionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="label-form">Equipe / Setor <span class="text-red-500">*</span></label>
            <select v-model="form.equipeId" required class="input-form bg-white">
              <option :value="null" disabled>Selecione uma equipe</option>
              <option v-for="eq in equipes" :key="eq.id" :value="eq.id">
                {{ eq.nome }}
              </option>
            </select>
          </div>
          <div>
            <label class="label-form">Cargo <span class="text-red-500">*</span></label>
            <input v-model="form.cargo" type="text" required class="input-form">
          </div>
          <div>
            <label class="label-form">Data de Entrada no Setor</label>
            <input v-model="form.dataEntradaSetor" type="date" class="input-form">
          </div>
          <div class="md:col-span-2">
            <label class="label-form">Atribuição Principal</label>
            <textarea v-model="form.atribuicao" rows="2" class="input-form resize-none"></textarea>
          </div>
        </div>

        <h3 class="text-sm font-bold text-gray-400 uppercase border-b pb-2 pt-4">Dados Pessoais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="label-form">Telefone</label>
            <input v-model="form.telefone" type="text" placeholder="(XX) XXXXX-XXXX" class="input-form">
          </div>
          <div>
            <label class="label-form">Data de Nascimento</label>
            <input v-model="form.dataDeNascimento" type="date" class="input-form">
          </div>
          <div>
            <label class="label-form">Escolaridade</label>
            <select v-model="form.escolaridade" class="input-form bg-white">
              <option value="">Selecione...</option>
              <option value="Ensino Médio">Ensino Médio</option>
              <option value="Superior Incompleto">Superior Incompleto</option>
              <option value="Superior Completo">Superior Completo</option>
              <option value="Pós-Graduação">Pós-Graduação</option>
            </select>
          </div>
          <div>
            <label class="label-form">Formação (Curso)</label>
            <input v-model="form.formacao" type="text" class="input-form">
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded border border-gray-200 flex items-center gap-3">
          <input type="checkbox" id="ativo" v-model="form.ativo" class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue">
          <label for="ativo" class="text-sm font-bold text-gray-700 cursor-pointer select-none">Colaborador Ativo no Sistema</label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/colaboradores" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</router-link>
          <button type="submit" :disabled="salvando" class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Salvando...' : 'Atualizar Dados' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { ColaboradorAdminForm } from '../../../types/colaborador';
import type { EquipeDTO } from '../../../types/equipe';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const salvando = ref(false);
const equipes = ref<EquipeDTO[]>([]);

const form = ref<ColaboradorAdminForm>({
  nome: '',
  sobrenome: '',
  matricula: '',
  genero: 'OUTRO',
  cargo: '',
  atribuicao: '',
  dataEntradaSetor: '',
  escolaridade: '',
  formacao: '',
  dataDeNascimento: '',
  telefone: '',
  ativo: true,
  equipeId: null
});

onMounted(async () => {
  const id = route.params.id;
  if (!id) return;

  try {
    // 1. Carrega Equipes para o dropdown
    const resEquipes = await api.get('/equipes?size=100');
    equipes.value = resEquipes.data.content;

    // 2. Carrega Dados do Colaborador
    const { data } = await api.get(`/colaboradores/${id}`);
    
    // 3. Popula o formulário
    form.value = {
      nome: data.nome,
      sobrenome: data.sobrenome,
      matricula: data.matricula,
      genero: data.genero || 'OUTRO',
      cargo: data.cargo,
      atribuicao: data.atribuicao || '',
      dataEntradaSetor: data.dataEntradaSetor || '',
      escolaridade: data.escolaridade || '',
      formacao: data.formacao || '',
      dataDeNascimento: data.dataDeNascimento || '',
      telefone: data.telefone || '',
      ativo: data.ativo,
      equipeId: data.equipe ? data.equipe.id : null
    };

  } catch (error) {
    alert('Erro ao carregar dados.');
    router.push('/admin/colaboradores');
  } finally {
    loading.value = false;
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    // PUT para /colaboradores/{id} com o DTO completo
    await api.put(`/colaboradores/${route.params.id}`, form.value);
    alert('Colaborador atualizado com sucesso!');
    router.push('/admin/colaboradores');
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erro ao salvar.';
    alert(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};
</script>

<style scoped>
.label-form {
  @apply block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide;
}
.input-form {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none transition;
}
</style>