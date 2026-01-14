<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Meu Perfil</h2>
      <p class="text-gray-600 mt-1">Gerencie suas informações pessoais e foto de identificação.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
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
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
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
              ✏️ Editar Dados
            </button>
          </div>

          <form @submit.prevent="salvar">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nome <span
                    class="text-red-500">*</span></label>
                <input v-model="form.nome" :disabled="!editando" type="text" required class="input-padrao">
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Sobrenome <span
                    class="text-red-500">*</span></label>
                <input v-model="form.sobrenome" :disabled="!editando" type="text" required class="input-padrao">
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone / Celular <span
                    class="text-red-500">*</span></label>
                <input v-model="form.telefone" :disabled="!editando" type="text" minlength="8"
                  placeholder="(99) 99999-9999" class="input-padrao">
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Nascimento <span
                    class="text-red-500">*</span></label>
                <input v-model="form.dataDeNascimento" :disabled="!editando" type="date" required class="input-padrao">
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gênero <span
                    class="text-red-500">*</span></label>
                <select v-model="form.genero" :disabled="!editando" class="input-padrao bg-white">
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Escolaridade</label>
                <select v-model="form.escolaridade" :disabled="!editando" class="input-padrao bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="esc in store.escolaridadesOptions" :key="esc.id" :value="esc.label">
                    {{ esc.label }}
                  </option>
                </select>
              </div>

              <div class="sm:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Cargo / Função <span
                    class="text-red-500">*</span></label>
                <select v-model="form.cargo" :disabled="!editando" class="input-padrao bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="cargo in store.cargosOptions" :key="cargo.id" :value="cargo.label">
                    {{ cargo.label }}
                  </option>
                </select>
              </div>

              <div class="sm:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Entrada no Setor</label>
                <input v-model="form.dataEntradaSetor" :disabled="!editando" type="date" class="input-padrao">
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Formação Acadêmica (Curso)</label>
                <select v-model="form.formacao" :disabled="!editando" class="input-padrao bg-white">
                  <option value="">Selecione a área...</option>
                  <option v-for="formacao in store.formacoesOptions" :key="formacao.id" :value="formacao.label">
                    {{ formacao.label }}
                  </option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Principais Atribuições</label>
                <textarea v-model="form.atribuicao" :disabled="!editando" rows="3"
                  class="input-padrao resize-none"></textarea>
              </div>
            </div>

            <div v-if="editando"
              class="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100 animate-fade-in">
              <button type="button" @click="cancelarEdicao"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" :disabled="salvando"
                class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition shadow-lg flex items-center gap-2 disabled:opacity-50">
                <span v-if="salvando" class="animate-spin">⚪</span>
                {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
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
import { useAuxiliaresStore } from '../../stores/auxiliares'; // Import da Store Nova
import ColaboradorService from '../../services/ColaboradorService';

const authStore = useAuthStore();
const store = useAuxiliaresStore(); // Instância da Store

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
  // Carrega listas auxiliares (Cargos, Formações, etc) + Perfil
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

    // Mapear dados para o form
    form.value = {
      nome: data.nome,
      sobrenome: data.sobrenome,
      genero: data.genero as any,
      dataDeNascimento: data.dataDeNascimento,
      telefone: data.telefone || '',
      cargo: data.cargo || '', // Binding com o valor string do select
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

  // 1. Verificações iniciais
  if (!target.files || target.files.length === 0 || !perfil.value) return;

  const arquivo = target.files[0];

  // 2. CORREÇÃO: Verificação explícita para o TypeScript
  if (!arquivo) return;

  // 3. Validação de tamanho
  if (arquivo.size > 10 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 2MB.');
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

    perfil.value = data; // Atualiza visualização estática
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
/* Estilo reutilizado para inputs e selects para manter consistência */
.input-padrao {
  @apply w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-piaui-blue outline-none disabled:bg-gray-50 disabled:text-gray-600;
}

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