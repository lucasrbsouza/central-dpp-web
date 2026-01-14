<template>
  <div class="max-w-4xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/eventos" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">
        ⬅️
      </router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Evento' : 'Novo Evento' }}</h2>
        <p class="text-gray-600 text-sm">Agende reuniões, treinamentos ou datas comemorativas.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8 relative">
      
      <div v-if="loadingInicial" class="absolute inset-0 bg-white/90 z-10 flex items-center justify-center rounded-lg">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-piaui-blue"></div>
      </div>

      <form @submit.prevent="salvar" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Evento <span class="text-red-500">*</span></label>
            <input 
              v-model="form.titulo"
              type="text" 
              required
              maxlength="150"
              class="input-padrao w-full"
              placeholder="Ex: Reunião de Planejamento"
            >
          </div>
          
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
            <div class="relative">
              <select 
                v-model="form.tipo" 
                required
                class="input-padrao w-full appearance-none"
              >
                <option value="" disabled>Selecione...</option>
                <option 
                  v-for="tipo in store.tiposEventos" 
                  :key="tipo.id" 
                  :value="tipo.nome"
                  v-show="tipo.ativo"
                >
                  {{ tipo.nome }}
                </option>
              </select>
              <div 
                v-if="corSelecionada" 
                class="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300 shadow-sm pointer-events-none"
                :style="{ backgroundColor: corSelecionada }"
              ></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Início <span class="text-red-500">*</span></label>
            <input 
              v-model="form.dataInicio"
              type="datetime-local" 
              required
              class="input-padrao w-full"
            >
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fim <span class="text-red-500">*</span></label>
            <input 
              v-model="form.dataFim"
              type="datetime-local" 
              required
              class="input-padrao w-full"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Equipe Vinculada</label>
            <select v-model="form.equipeId" class="input-padrao w-full">
              <option :value="null">-- Sem equipe específica --</option>
              <option v-for="eq in equipesOptions" :key="eq.id" :value="eq.id">
                {{ eq.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Organizador / Responsável</label>
            <select v-model="form.colaboradorId" class="input-padrao w-full">
              <option :value="null">-- Selecione --</option>
              <option v-for="colab in colaboradoresOptions" :key="colab.id" :value="colab.id">
                {{ colab.label }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição / Pauta</label>
          <textarea 
            v-model="form.descricao"
            rows="4"
            class="input-padrao w-full resize-none"
            placeholder="Detalhes opcionais sobre o evento..."
          ></textarea>
        </div>

        <div class="flex items-center">
            <input v-model="form.ativo" type="checkbox" id="eventoAtivo" class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label for="eventoAtivo" class="ml-2 text-sm text-gray-700 cursor-pointer select-none">Evento Ativo</label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/eventos" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
            Cancelar
          </router-link>
          <button type="submit" :disabled="salvando" class="btn-primary flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isEdicao ? 'Salvar Alterações' : 'Agendar Evento' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import { useAuxiliaresStore } from '../../../stores/auxiliares';
import EquipeService from '../../../services/EquipeService';
import ColaboradorService from '../../../services/ColaboradorService';

import type { EventoForm } from '../../../types/evento';
import type { OptionDTO } from '../../../types/auxiliares';

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
    // Ajusta para o fuso local ISO string (YYYY-MM-DDTHH:mm)
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
  tipo: '', // Será preenchido pelo select
  ativo: true,
  dataInicio: toInputDate(agora),
  dataFim: toInputDate(umaHoraDepois),
  equipeId: null,
  colaboradorId: null
});

// Computed para cor
const corSelecionada = computed(() => {
  if (!form.value.tipo) return null;
  return store.mapaCoresEventos[form.value.tipo] || null;
});

// Carregamento
onMounted(async () => {
  loadingInicial.value = true;
  try {
    // 1. Carrega dados auxiliares (Tipos, Equipes, Colaboradores) em paralelo
    await Promise.all([
      store.buscarDadosSeNecessario(),
      carregarEquipes(),
      carregarColaboradores()
    ]);

    // 2. Se for edição, busca o evento
    if (isEdicao.value) {
      const { data } = await api.get(`/eventos/${route.params.id}`);
      form.value = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo, // O backend retorna a String do nome do tipo
        ativo: data.ativo,
        dataInicio: data.dataInicio?.slice(0, 16) || '',
        dataFim: data.dataFim?.slice(0, 16) || '',
        equipeId: data.equipe ? data.equipe.id : null,
        colaboradorId: data.colaborador ? data.colaborador.id : null
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados', error);
    alert('Erro ao carregar dados do formulário.');
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
    alert('A data de fim deve ser posterior à data de início.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { ...form.value };
    
    // Adiciona segundos para compatibilidade com LocalDateTime do Java
    if (payload.dataInicio.length === 16) payload.dataInicio += ':00';
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    if (isEdicao.value) {
      await api.put(`/eventos/${route.params.id}`, payload);
      alert('Evento atualizado com sucesso!');
    } else {
      await api.post('/eventos', payload);
      alert('Evento agendado com sucesso!');
    }
    router.push('/admin/eventos');
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    const msg = error.response?.data?.message || 'Verifique os dados informados.';
    alert(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};
</script>

<style scoped>
/* Estilo utilitário para inputs consistente com o resto do sistema */
.input-padrao {
  @apply border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-gray-700;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors;
}
</style>