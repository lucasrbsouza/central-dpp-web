<template>
  <div class="max-w-4xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/eventos" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Evento' : 'Novo Evento' }}</h2>
        <p class="text-gray-600 text-sm">Adicione reuniões ou datas importantes à agenda.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <div v-if="loadingInicial" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <form v-else @submit.prevent="salvar" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Evento <span class="text-red-500">*</span></label>
            <input 
              v-model="form.titulo"
              type="text" 
              required
              maxlength="150"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none"
              placeholder="Ex: Reunião de Alinhamento"
            >
          </div>
          
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo <span class="text-red-500">*</span></label>
            <select 
              v-model="form.tipo" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none bg-white"
            >
              <option value="REUNIAO">Reunião</option>
              <option value="TREINAMENTO">Treinamento</option>
              <option value="FERIADO">Feriado</option>
              <option value="ANIVERSARIO">Aniversário</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Início <span class="text-red-500">*</span></label>
            <input 
              v-model="form.dataInicio"
              type="datetime-local" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none"
            >
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fim <span class="text-red-500">*</span></label>
            <input 
              v-model="form.dataFim"
              type="datetime-local" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição / Pauta</label>
          <textarea 
            v-model="form.descricao"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none resize-none"
            placeholder="Detalhes opcionais sobre o evento..."
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/eventos" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
            Cancelar
          </router-link>
          <button type="submit" :disabled="salvando" class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Salvando...' : (isEdicao ? 'Salvar Alterações' : 'Agendar Evento') }}
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
import type { EventoForm } from '../../../types/evento';

const route = useRoute();
const router = useRouter();

const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Helpers de Data
const toInputDate = (date: Date) => date.toISOString().slice(0, 16);
const agora = new Date();
const umaHoraDepois = new Date(agora.getTime() + 60 * 60 * 1000);

const form = ref<EventoForm>({
  titulo: '',
  descricao: '',
  tipo: 'REUNIAO',
  ativo: true,
  dataInicio: toInputDate(agora),
  dataFim: toInputDate(umaHoraDepois),
  equipeId: null,
  colaboradorId: null
});

onMounted(async () => {
  if (isEdicao.value) {
    loadingInicial.value = true;
    try {
      const { data } = await api.get(`/eventos/${route.params.id}`);
      form.value = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        ativo: data.ativo,
        dataInicio: data.dataInicio?.slice(0, 16) || '',
        dataFim: data.dataFim?.slice(0, 16) || ''
      };
    } catch (error) {
      console.error('Erro ao carregar evento', error);
      alert('Erro ao carregar dados.');
      router.push('/admin/eventos');
    } finally {
      loadingInicial.value = false;
    }
  }
});

const salvar = async () => {
  if (form.value.dataFim <= form.value.dataInicio) {
    alert('A data de fim deve ser posterior à data de início.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { ...form.value };
    // Adiciona segundos para compatibilidade total com LocalDateTime
    if (payload.dataInicio.length === 16) payload.dataInicio += ':00';
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    if (isEdicao.value) {
      await api.put(`/eventos/${route.params.id}`, payload);
      alert('Evento atualizado!');
    } else {
      await api.post('/eventos', payload);
      alert('Evento agendado com sucesso!');
    }
    router.push('/admin/eventos');
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    const msg = error.response?.data?.message || 'Verifique os dados.';
    alert(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};
</script>