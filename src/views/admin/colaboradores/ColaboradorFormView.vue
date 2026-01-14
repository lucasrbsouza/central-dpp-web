<template>
  <div class="bg-white p-6 rounded-lg shadow-lg relative">
    
    <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ id ? 'Editar' : 'Novo' }} Colaborador</h2>
      <button @click="voltar" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">
        &times;
      </button>
    </div>
    
    <form @submit.prevent="salvar" class="space-y-6">
      
      <div>
        <h3 class="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Dados Pessoais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome <span class="text-red-500">*</span></label>
            <input 
              v-model="form.nome" 
              type="text" 
              class="input-padrao w-full mt-1" 
              required 
              placeholder="Primeiro nome" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Sobrenome <span class="text-red-500">*</span></label>
            <input 
              v-model="form.sobrenome" 
              type="text" 
              class="input-padrao w-full mt-1" 
              required 
              placeholder="Sobrenome completo" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Data de Nascimento <span class="text-red-500">*</span></label>
            <input 
              v-model="form.dataDeNascimento" 
              type="date" 
              class="input-padrao w-full mt-1" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Gênero <span class="text-red-500">*</span></label>
            <select v-model="form.genero" class="input-padrao w-full mt-1" required>
              <option value="" disabled>Selecione...</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input 
              v-model="form.telefone" 
              type="tel" 
              class="input-padrao w-full mt-1" 
              placeholder="(99) 99999-9999" 
            />
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Dados Profissionais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Matrícula <span class="text-red-500">*</span></label>
            <input 
              v-model="form.matricula" 
              type="text" 
              class="input-padrao w-full mt-1" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Data Entrada Setor</label>
            <input 
              v-model="form.dataEntradaSetor" 
              type="date" 
              class="input-padrao w-full mt-1" 
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Equipe / Setor <span class="text-red-500">*</span></label>
            <select v-model="form.equipeId" class="input-padrao w-full mt-1" required>
              <option :value="null" disabled>Selecione a equipe...</option>
              <option v-for="equipe in equipesOptions" :key="equipe.id" :value="equipe.id">
                {{ equipe.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Cargo</label>
            <select v-model="form.cargo" class="input-padrao w-full mt-1">
              <option value="" disabled>Selecione...</option>
              <option v-for="c in store.cargosOptions" :key="c.id" :value="c.label">
                {{ c.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Atribuição / Função</label>
            <input 
              v-model="form.atribuicao" 
              type="text" 
              class="input-padrao w-full mt-1" 
              placeholder="Ex: Desenvolvedor Frontend" 
            />
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Escolaridade e Formação</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Nível de Escolaridade</label>
            <select v-model="form.escolaridade" class="input-padrao w-full mt-1">
              <option value="" disabled>Selecione...</option>
              <option v-for="esc in store.escolaridadesOptions" :key="esc.id" :value="esc.label">
                {{ esc.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Área de Formação</label>
            <select v-model="form.formacao" class="input-padrao w-full mt-1">
              <option value="" disabled>Selecione...</option>
              <option v-for="f in store.formacoesOptions" :key="f.id" :value="f.label">
                {{ f.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
        <input 
          v-model="form.ativo" 
          type="checkbox" 
          id="ativoColab" 
          class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
        />
        <label for="ativoColab" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
          Colaborador Ativo
        </label>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
         <button 
           type="button" 
           @click="voltar" 
           class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
         >
           Cancelar
         </button>
         <button 
           type="submit" 
           :disabled="salvando" 
           class="btn-primary flex items-center gap-2"
         >
            <span v-if="salvando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ id ? 'Atualizar Colaborador' : 'Criar Colaborador' }}
         </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuxiliaresStore } from '../../../stores/auxiliares';
import ColaboradorService from '../../../services/ColaboradorService';
import EquipeService from '../../../services/EquipeService';
import type { OptionDTO } from '../../../types/auxiliares';
import type { ColaboradorAdminForm } from '../../../types/colaborador';
import { toast } from 'vue-sonner';

// Utils
const route = useRoute();
const router = useRouter();
const store = useAuxiliaresStore();

// State
const id = route.params.id ? Number(route.params.id) : null;
const loading = ref(false);
const salvando = ref(false);
const equipesOptions = ref<OptionDTO[]>([]);

// Form State tipado
const form = ref<ColaboradorAdminForm>({
  nome: '',
  sobrenome: '',
  matricula: '',
  genero: 'MASCULINO', 
  dataDeNascimento: '',
  telefone: '',
  cargo: '',        
  atribuicao: '',
  equipeId: null,
  dataEntradaSetor: '',
  escolaridade: '', 
  formacao: '',     
  ativo: true
});

// Lifecycle
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      store.buscarDadosSeNecessario(),
      carregarEquipes()
    ]);

    if (id) {
      await carregarColaborador(id);
    }
  } catch (error) {
    console.error("Erro ao inicializar formulário", error);
    toast.error("Erro de conexão ao carregar dados.");
  } finally {
    loading.value = false;
  }
});

// Métodos de Carga
const carregarEquipes = async () => {
  try {
    const data = await EquipeService.getEquipesDropdown();
    equipesOptions.value = data;
  } catch (error) {
    console.error("Erro ao carregar equipes", error);
    toast.error("Erro ao carregar equipes.");
    equipesOptions.value = [];
  }
};

const carregarColaborador = async (colabId: number) => {
  try {
    // CORREÇÃO: O Service já retorna o objeto direto, não { data }
    const colaborador = await ColaboradorService.buscarPorId(colabId);
    
    // Mapear resposta da API para o form
    form.value = {
      nome: colaborador.nome,
      sobrenome: colaborador.sobrenome,
      matricula: colaborador.matricula,
      genero: (colaborador.genero as 'MASCULINO' | 'FEMININO' | 'OUTRO') || 'OUTRO',
      dataDeNascimento: colaborador.dataDeNascimento || '',
      telefone: colaborador.telefone || '',
      cargo: colaborador.cargo || '',
      atribuicao: colaborador.atribuicao || '',
      equipeId: colaborador.equipe ? colaborador.equipe.id : null,
      dataEntradaSetor: colaborador.dataEntradaSetor || '',
      escolaridade: colaborador.escolaridade || '',
      formacao: colaborador.formacao || '',
      ativo: colaborador.ativo
    };
  } catch (error) {
    console.error("Erro ao buscar colaborador", error);
    toast.info("Colaborador não encontrado.");
    router.push('/admin/colaboradores');
  }
};

// Ações
const salvar = async () => {
  salvando.value = true;
  try {
    if (id) {
      await ColaboradorService.atualizar(id, form.value);
      toast.success("Colaborador atualizado com sucesso!");
    } else {
      await ColaboradorService.criar(form.value);
      alert("Colaborador criado com sucesso!");
    }
    router.push('/admin/colaboradores');
  } catch (error: any) {
    console.error("Erro ao salvar", error);
    const msg = error.response?.data?.message || "Erro ao salvar dados. Verifique os campos.";
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};

const voltar = () => {
  router.back();
};
</script>