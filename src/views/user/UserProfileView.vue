<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Meu Perfil</h2>
      <p class="text-gray-600 mt-1">Gerencie suas informações pessoais e foto de identificação.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div class="md:col-span-1">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden text-center p-6">
          <div class="relative w-40 h-40 mx-auto mb-4 group">
            <div
              class="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
              <img v-if="fotoUrl" :src="fotoUrl" class="w-full h-full object-cover" alt="Foto de Perfil">
              <span v-else class="text-4xl text-gray-300 font-bold">
                {{ getIniciais(form.nome, form.sobrenome) }}
              </span>
            </div>

            <label
              class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white font-medium text-sm">
              📷 Alterar Foto
              <input type="file" class="hidden" accept="image/png, image/jpeg" @change="handleFileUpload">
            </label>

            <div v-if="uploadingFoto"
              class="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
              <LoadingSpinner class="w-8 h-8" />
            </div>
          </div>

          <h3 class="text-xl font-bold text-gray-800">{{ form.nome }} {{ form.sobrenome }}</h3>
          <p class="text-piaui-blue font-medium text-sm mb-1">{{ form.cargo || 'Cargo não definido' }}</p>
          <p class="text-gray-500 text-xs">{{ perfil?.email }}</p>
          <p class="text-gray-500 text-xs">Matrícula: {{ perfil?.matricula }}</p>

          <div class="mt-6 pt-6 border-t border-gray-100 text-left space-y-3">
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold">Equipe / Setor</p>
              <p class="text-sm font-semibold text-gray-700">{{ perfil?.equipe?.nome || 'Sem Equipe' }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-400 uppercase font-bold">Data de Admissão</p>
              <p class="text-sm font-semibold text-gray-700">{{ formatarData(perfil?.dataEntradaSetor) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8">

          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800">Dados Pessoais & Profissionais</h3>
            <button v-if="!editando" @click="editando = true"
              class="text-piaui-blue hover:text-blue-800 font-bold text-sm flex items-center gap-1">
              <PencilSquareIcon class="w-4 h-4" /> Editar Dados
            </button>
          </div>

          <form @submit.prevent="salvar">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <BaseInput 
                v-model="form.nome"
                label="Nome"
                :disabled="!editando"
                required
              />

              <BaseInput 
                v-model="form.sobrenome"
                label="Sobrenome"
                :disabled="!editando"
                required
              />

              <BaseInput 
                v-model="form.telefone"
                label="Telefone / Celular"
                :disabled="!editando"
                required
                placeholder="(99) 99999-9999"
                minlength="8"
              />

              <BaseInput 
                v-model="form.dataDeNascimento"
                label="Data de Nascimento"
                type="date"
                :disabled="!editando"
                required
              />

              <BaseSelect
                v-model="form.genero"
                label="Gênero"
                :options="[
                  { label: 'Masculino', value: 'MASCULINO' },
                  { label: 'Feminino', value: 'FEMININO' },
                  { label: 'Outro', value: 'OUTRO' }
                ]"
                :disabled="!editando"
                required
              />

              <BaseSelect
                v-model="form.escolaridade"
                label="Escolaridade"
                :options="store.escolaridadesOptions"
                :disabled="!editando"
                optionLabel="label"
                optionValue="label"
              />

              <div class="sm:col-span-1">
                <BaseSelect
                  v-model="form.cargo"
                  label="Cargo / Função"
                  :options="store.cargosOptions"
                  :disabled="!editando"
                  required
                  optionLabel="label"
                  optionValue="label"
                />
              </div>

              <div class="sm:col-span-1">
                <BaseInput 
                  v-model="form.dataEntradaSetor"
                  label="Data de Entrada no Setor"
                  type="date"
                  :disabled="!editando"
                />
              </div>

              <div class="sm:col-span-2">
                <BaseSelect
                  v-model="form.formacao"
                  label="Formação Acadêmica (Curso)"
                  :options="store.formacoesOptions"
                  :disabled="!editando"
                  placeholder="Selecione a área..."
                  optionLabel="label"
                  optionValue="label"
                />
              </div>

              <div class="sm:col-span-2">
                <BaseTextarea 
                  v-model="form.atribuicao"
                  label="Principais Atribuições"
                  :disabled="!editando"
                  rows="3"
                />
              </div>
            </div>

            <div v-if="editando"
              class="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100 animate-fade-in">
              
              <BaseButton 
                variant="secondary" 
                @click="cancelarEdicao"
              >
                Cancelar
              </BaseButton>

              <BaseButton 
                type="submit" 
                :loading="salvando"
                :disabled="salvando"
                variant="primary"
              >
                Salvar Alterações
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { ColaboradorPerfil, AtualizarPerfilForm } from '../../types/colaborador';
import { useAuthStore } from '../../stores/auth';
import { useAuxiliaresStore } from '../../stores/auxiliares'; 
import ColaboradorService from '../../services/ColaboradorService';

// Componentes Base
import BaseInput from '../../components/common/BaseInput.vue';
import BaseSelect from '../../components/common/BaseSelect.vue';
import BaseTextarea from '../../components/common/BaseTextarea.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const store = useAuxiliaresStore(); 

const loading = ref(true);
const salvando = ref(false);
const editando = ref(false);
const uploadingFoto = ref(false);

const perfil = ref<ColaboradorPerfil | null>(null);
const fotoUrl = ref<string | null>(null);

const form = ref<AtualizarPerfilForm>({
  nome: '',
  sobrenome: '',
  genero: 'OUTRO',
  dataDeNascimento: '',
  telefone: '',
  cargo: '',
  escolaridade: '',
  formacao: '',
  atribuicao: '',
  dataEntradaSetor: ''
});

onMounted(async () => {
  await Promise.all([
    store.buscarDadosSeNecessario(),
    carregarPerfil()
  ]);
});

const carregarPerfil = async () => {
  loading.value = true;
  try {
    const { data } = await ColaboradorService.buscarMeuPerfil();
    perfil.value = data;

    form.value = {
      nome: data.nome,
      sobrenome: data.sobrenome,
      genero: data.genero as any,
      dataDeNascimento: data.dataDeNascimento,
      telefone: data.telefone || '',
      cargo: data.cargo || '', 
      escolaridade: data.escolaridade || '',
      formacao: data.formacao || '',
      atribuicao: data.atribuicao || '',
      dataEntradaSetor: data.dataEntradaSetor || ''
    };

    if (data.id) {
      await carregarFoto(data.id);
    }

  } catch (error) {
    console.error('Erro ao carregar perfil', error);
  } finally {
    loading.value = false;
  }
};

const carregarFoto = async (id: number) => {
  try {
    const response = await api.get(`/colaboradores/${id}/foto`, { responseType: 'blob' });
    if (fotoUrl.value) URL.revokeObjectURL(fotoUrl.value);
    fotoUrl.value = URL.createObjectURL(response.data);
  } catch (error) {
    fotoUrl.value = null;
  }
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files || target.files.length === 0 || !perfil.value) return;

  const arquivo = target.files[0];
  if (!arquivo) return;

  if (arquivo.size > 10 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 10MB.');
    target.value = '';
    return;
  }

  uploadingFoto.value = true;
  try {
    await ColaboradorService.uploadFoto(perfil.value.id, arquivo);
    await carregarFoto(perfil.value.id);
    authStore.fetchUserProfile();
  } catch (error) {
    alert('Erro ao enviar foto.');
  } finally {
    uploadingFoto.value = false;
    target.value = '';
  }
};

const salvar = async () => {
  salvando.value = true;
  try {
    const { data } = await ColaboradorService.atualizarMeuPerfil(form.value);

    perfil.value = data; 
    editando.value = false;
    alert('Perfil atualizado com sucesso!');
    authStore.fetchUserProfile();

  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erro ao atualizar perfil.';
    alert(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};

const cancelarEdicao = () => {
  editando.value = false;
  if (perfil.value) {
    form.value.nome = perfil.value.nome;
    form.value.sobrenome = perfil.value.sobrenome;
    form.value.telefone = perfil.value.telefone || '';
    form.value.genero = perfil.value.genero as any;
    form.value.dataDeNascimento = perfil.value.dataDeNascimento;
    form.value.cargo = perfil.value.cargo || '';
    form.value.escolaridade = perfil.value.escolaridade || '';
    form.value.formacao = perfil.value.formacao || '';
    form.value.atribuicao = perfil.value.atribuicao || '';
    form.value.dataEntradaSetor = perfil.value.dataEntradaSetor || '';
  }
};

const getIniciais = (nome: string, sobrenome: string) => {
  return (nome.charAt(0) + (sobrenome?.charAt(0) || '')).toUpperCase();
};

const formatarData = (data: string | undefined) => {
  if (!data) return '--/--/----';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>