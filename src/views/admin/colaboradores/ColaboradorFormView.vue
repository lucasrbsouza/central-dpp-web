<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="loading" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        :title="id ? 'Editar Colaborador' : 'Novo Colaborador'"
        subtitle="Preencha os dados pessoais e profissionais."
      >
        <template #back-button>
          <router-link 
            to="/admin/colaboradores" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-8">
      
      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
          Dados Pessoais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput 
            v-model="form.nome" 
            label="Nome" 
            placeholder="Primeiro nome" 
            required 
          />
          <BaseInput 
            v-model="form.sobrenome" 
            label="Sobrenome" 
            placeholder="Sobrenome completo" 
            required 
          />
          <BaseInput 
            v-model="form.dataDeNascimento" 
            type="date" 
            label="Data de Nascimento" 
            required 
          />
          <BaseSelect 
            v-model="form.genero" 
            label="Gênero" 
            :options="['MASCULINO', 'FEMININO', 'OUTRO']" 
            required 
          />
          <BaseInput 
            v-model="form.telefone" 
            type="tel" 
            label="Telefone" 
            placeholder="(99) 99999-9999" 
            v-mask="'(##) #####-####'" 
          />
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
          Dados Profissionais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput 
            v-model="form.matricula" 
            label="Matrícula" 
            required 
          />
          <BaseInput 
            v-model="form.dataEntradaSetor" 
            type="date" 
            label="Data Entrada Setor" 
          />
          
          <div class="md:col-span-2">
            <BaseSelect 
              v-model="form.equipeId" 
              label="Equipe / Setor" 
              :options="equipesOptions" 
              option-label="label"
              option-value="id"
              required 
              placeholder="Selecione a equipe..."
            />
          </div>

          <BaseSelect 
            v-model="form.cargo" 
            label="Cargo" 
            :options="store.cargosOptions"
            option-label="label"
            option-value="label"
          />
          
          <BaseInput 
            v-model="form.atribuicao" 
            label="Atribuição / Função" 
            placeholder="Ex: Desenvolvedor Frontend" 
          />
        </div>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
          Escolaridade e Formação
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseSelect 
            v-model="form.escolaridade" 
            label="Nível de Escolaridade" 
            :options="store.escolaridadesOptions"
            option-label="label"
            option-value="label"
          />
          <BaseSelect 
            v-model="form.formacao" 
            label="Área de Formação" 
            :options="store.formacoesOptions"
            option-label="label"
            option-value="label"
          />
        </div>
      </div>

      <BaseCheckbox 
        v-model="form.ativo" 
        label="Colaborador Ativo no Sistema" 
      />

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="voltar">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ id ? 'Salvar Alterações' : 'Cadastrar Colaborador' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
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
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

// Components UI Kit
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseSelect from '../../../components/common/BaseSelect.vue';
import BaseCheckbox from '../../../components/common/BaseCheckbox.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

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
  }
};

const carregarColaborador = async (colabId: number) => {
  try {
    const colaborador = await ColaboradorService.buscarPorId(colabId);
    
    // Mapeamento
    form.value = {
      nome: colaborador.nome,
      sobrenome: colaborador.sobrenome,
      matricula: colaborador.matricula,
      genero: (colaborador.genero as any) || 'OUTRO',
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
    toast.error("Colaborador não encontrado.");
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
      toast.success("Colaborador criado com sucesso!");
    }
    router.push('/admin/colaboradores');
  } catch (error: any) {
    console.error("Erro ao salvar", error);
    const msg = error.response?.data?.message || "Erro ao salvar dados.";
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};

const voltar = () => {
  router.push('/admin/colaboradores');
};
</script>