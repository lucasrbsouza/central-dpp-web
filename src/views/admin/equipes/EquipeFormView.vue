<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="loadingInicial" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        :title="isEdicao ? 'Editar Equipe' : 'Nova Equipe'"
        subtitle="Defina o nome, hierarquia e liderança."
      >
        <template #back-button>
          <router-link 
            to="/admin/equipes" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-6">
      
      <BaseInput 
        v-model="form.nome" 
        label="Nome da Equipe / Setor" 
        placeholder="Ex: Coordenação de TI" 
        required 
        maxlength="100"
      />

      <BaseInput 
        v-model="form.descricao" 
        label="Descrição" 
        placeholder="Ex: Responsável pela infraestrutura..." 
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <BaseSelect 
            v-model="form.idEquipePai" 
            label="Equipe Superior (Hierarquia)" 
            :options="opcoesEquipes" 
            placeholder="Selecione..."
            option-label="label"
            option-value="value"
          />
          <p class="text-xs text-gray-500 mt-1 ml-1">Selecione a qual setor esta equipe responde.</p>
        </div>

        <BaseSelect 
          v-model="form.idLider" 
          label="Líder / Responsável" 
          :options="opcoesLideres" 
          placeholder="-- Sem Líder --"
        />

      </div>

      <BaseCheckbox 
        v-model="form.ativo" 
        label="Equipe Ativa" 
      />

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/equipes')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ isEdicao ? 'Salvar Alterações' : 'Criar Equipe' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { EquipeForm, EquipeDTO } from '../../../types/equipe';
import { toast } from 'vue-sonner';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

// Import dos Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseSelect from '../../../components/common/BaseSelect.vue';
import BaseCheckbox from '../../../components/common/BaseCheckbox.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

// Tipos auxiliares para dropdown
interface OptionItem { label: string; value: number | null; }

const route = useRoute();
const router = useRouter();

const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Opções formatadas para os Selects
const opcoesEquipes = ref<OptionItem[]>([]);
const opcoesLideres = ref<OptionItem[]>([]);

const form = ref<EquipeForm>({
  nome: '',
  descricao: '',
  ativo: true,
  idEquipePai: null, // null representa Raiz
  idLider: null
});

onMounted(async () => {
  loadingInicial.value = true;
  try {
    // 1. Carrega dados em paralelo
    const [resEquipes, resColab] = await Promise.all([
      api.get('/equipes?size=100'),
      api.get('/colaboradores?resumo=true')
    ]);

    // 2. Prepara lista de Colaboradores (Formatando Nome Completo)
    const rawColabs = Array.isArray(resColab.data) ? resColab.data : resColab.data.content || [];
    opcoesLideres.value = rawColabs.map((c: any) => ({
      value: c.id,
      label: `${c.nome} ${c.sobrenome}`
    }));
    // Adiciona opção "Sem Líder" no topo se necessário, ou deixa o placeholder cuidar disso
    opcoesLideres.value.unshift({ value: null, label: '-- Sem Líder Definido --' });

    // 3. Prepara lista de Equipes (Removendo a própria equipe se for edição)
    const rawEquipes = resEquipes.data.content || [];
    const idAtual = isEdicao.value ? Number(route.params.id) : -1;

    const equipesFiltradas = rawEquipes.filter((eq: EquipeDTO) => eq.id !== idAtual);
    
    opcoesEquipes.value = [
      { value: null, label: '-- Nenhuma (Raiz) --' }, // Opção padrão
      ...equipesFiltradas.map((eq: EquipeDTO) => ({
        value: eq.id,
        label: eq.nome
      }))
    ];

    // 4. Se for edição, popula o formulário
    if (isEdicao.value) {
      const { data } = await api.get(`/equipes/${idAtual}`);
      form.value = {
        nome: data.nome,
        descricao: data.descricao,
        ativo: data.ativo,
        idEquipePai: data.idEquipePai || null,
        idLider: data.idLider || null
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    toast.error('Erro ao carregar formulário.');
    router.push('/admin/equipes');
  } finally {
    loadingInicial.value = false;
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    const payload = { ...form.value };
    
    if (isEdicao.value) {
      await api.put(`/equipes/${route.params.id}`, payload);
      toast.success('Equipe atualizada!');
    } else {
      await api.post('/equipes', payload);
      toast.success('Equipe criada com sucesso!');
    }
    router.push('/admin/equipes');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao salvar.';
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};
</script>