<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="loadingInicial" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        :title="isEdicao ? 'Editar Evento' : 'Novo Evento'"
        subtitle="Agende reuniões, treinamentos ou datas comemorativas."
      >
        <template #back-button>
          <router-link 
            to="/admin/eventos" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <BaseInput 
            v-model="form.titulo" 
            label="Título do Evento" 
            placeholder="Ex: Reunião de Planejamento"
            maxlength="150"
            required 
          />
        </div>
        
        <div class="md:col-span-1">
          <BaseSelect 
            v-model="form.tipo" 
            label="Tipo de Evento" 
            :options="tiposOpcoes"
            option-label="nome"
            option-value="nome"
            required
            placeholder="Selecione..."
          />
          
          <div v-if="corSelecionada" class="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span 
              class="w-3 h-3 rounded-full border border-gray-200 shadow-sm" 
              :style="{ backgroundColor: corSelecionada }"
            ></span>
            <span>Cor de exibição na agenda</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <BaseInput 
          v-model="form.dataInicio" 
          type="datetime-local" 
          label="Início" 
          required 
        />
        <BaseInput 
          v-model="form.dataFim" 
          type="datetime-local" 
          label="Fim" 
          required 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseSelect 
          v-model="form.equipeId" 
          label="Equipe Vinculada" 
          :options="equipesOptions"
          option-label="label"
          option-value="id"
          placeholder="-- Sem equipe específica --"
        />
        
        <BaseSelect 
          v-model="form.colaboradorId" 
          label="Organizador / Responsável" 
          :options="colaboradoresOptions"
          option-label="label"
          option-value="id"
          placeholder="-- Selecione --"
        />
      </div>

      <BaseTextarea 
        v-model="form.descricao" 
        label="Descrição / Pauta" 
        placeholder="Detalhes opcionais sobre o evento..."
        rows="4" 
      />

      <BaseCheckbox 
        v-model="form.ativo" 
        label="Evento Ativo" 
      />

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/eventos')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ isEdicao ? 'Salvar Alterações' : 'Agendar Evento' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import { useAuxiliaresStore } from '../../../stores/auxiliares';
import EquipeService from '../../../services/EquipeService';
import ColaboradorService from '../../../services/ColaboradorService';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

import type { EventoForm } from '../../../types/evento';
import type { OptionDTO } from '../../../types/auxiliares';

// Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseSelect from '../../../components/common/BaseSelect.vue';
import BaseTextarea from '../../../components/common/BaseTextarea.vue';
import BaseCheckbox from '../../../components/common/BaseCheckbox.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

// Config
const route = useRoute();
const router = useRouter();
const store = useAuxiliaresStore();

// State
const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Options para Selects
const equipesOptions = ref<OptionDTO[]>([]);
const colaboradoresOptions = ref<OptionDTO[]>([]);

// Helpers de Data
const toInputDate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
};

const agora = new Date();
const umaHoraDepois = new Date(agora.getTime() + 60 * 60 * 1000);

// Form
const form = ref<EventoForm>({
  titulo: '',
  descricao: '',
  tipo: '', 
  ativo: true,
  dataInicio: toInputDate(agora),
  dataFim: toInputDate(umaHoraDepois),
  equipeId: null,
  colaboradorId: null
});

// Computed: Opções de Tipo (Filtra apenas os ativos do Store)
const tiposOpcoes = computed(() => {
  return store.tiposEventos.filter(t => t.ativo);
});

// Computed: Cor Selecionada
const corSelecionada = computed(() => {
  if (!form.value.tipo) return null;
  return store.mapaCoresEventos[form.value.tipo] || '#cbd5e1';
});

// Carregamento
onMounted(async () => {
  loadingInicial.value = true;
  try {
    await Promise.all([
      store.buscarDadosSeNecessario(),
      carregarEquipes(),
      carregarColaboradores()
    ]);

    if (isEdicao.value) {
      const { data } = await api.get(`/eventos/${route.params.id}`);
      form.value = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        ativo: data.ativo,
        dataInicio: data.dataInicio?.slice(0, 16) || '',
        dataFim: data.dataFim?.slice(0, 16) || '',
        equipeId: data.equipe ? data.equipe.id : null,
        colaboradorId: data.colaborador ? data.colaborador.id : null
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados', error);
    toast.error('Erro ao carregar dados do formulário.');
    router.push('/admin/eventos');
  } finally {
    loadingInicial.value = false;
  }
});

const carregarEquipes = async () => {
  try {
    equipesOptions.value = await EquipeService.getEquipesDropdown();
  } catch (e) { console.error("Erro equipes", e); }
};

const carregarColaboradores = async () => {
  try {
    colaboradoresOptions.value = await ColaboradorService.getColaboradoresDropdown();
  } catch (e) { console.error("Erro colaboradores", e); }
};

// Salvar
const salvar = async () => {
  if (new Date(form.value.dataFim) <= new Date(form.value.dataInicio)) {
    toast.warning('A data de fim deve ser posterior à data de início.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { ...form.value };
    
    // Adiciona segundos para compatibilidade Java
    if (payload.dataInicio.length === 16) payload.dataInicio += ':00';
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    if (isEdicao.value) {
      await api.put(`/eventos/${route.params.id}`, payload);
      toast.success('Evento atualizado com sucesso!');
    } else {
      await api.post('/eventos', payload);
      toast.success('Evento agendado com sucesso!');
    }
    router.push('/admin/eventos');
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    const msg = error.response?.data?.message || 'Verifique os dados informados.';
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};
</script>