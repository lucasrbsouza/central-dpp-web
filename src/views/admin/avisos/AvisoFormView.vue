<template>
  <div class="max-w-4xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link 
        to="/admin/avisos" 
        class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition"
        title="Voltar"
      >
        <ArrowLeftIcon class="w-5 h-5"/>
      </router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isEdicao ? 'Editar Aviso' : 'Nova Publicação' }}
        </h2>
        <p class="text-gray-600 text-sm">Preencha os dados do comunicado para o mural.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      
      <div v-if="loadingInicial" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <form v-else @submit.prevent="salvar" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Aviso <span class="text-red-500">*</span></label>
            <input 
              v-model="form.titulo"
              type="text" 
              required
              maxlength="150"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none"
              placeholder="Ex: Manutenção no Sistema"
            >
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo / Gravidade <span class="text-red-500">*</span></label>
            <select 
              v-model="form.tipo" 
              required
              @change="atualizarPrioridadeAuto"
              :class="[
                'w-full px-4 py-2 border rounded-md focus:ring-2 outline-none font-bold',
                form.tipo === 'URGENTE' ? 'bg-red-50 border-red-300 text-red-700 focus:ring-red-500' :
                form.tipo === 'ALERTA' ? 'bg-yellow-50 border-yellow-300 text-yellow-800 focus:ring-yellow-500' :
                'bg-blue-50 border-blue-300 text-blue-700 focus:ring-blue-500'
              ]"
            >
              <option value="INFO">🔵 Informativo</option>
              <option value="ALERTA">🟡 Alerta</option>
              <option value="URGENTE">🔴 Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Conteúdo <span class="text-red-500">*</span></label>
          <textarea 
            v-model="form.conteudo"
            required
            rows="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none resize-none"
            placeholder="Digite os detalhes do aviso aqui..."
          ></textarea>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <CalendarDateRangeIcon class="w-4 h-4" /> Período de Exibição
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Data/Hora Início</label>
              <input 
                v-model="form.dataInicio"
                type="datetime-local" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Data/Hora Fim</label>
              <input 
                v-model="form.dataFim"
                type="datetime-local" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none"
              >
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link 
            to="/admin/avisos"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </router-link>
          
          <button 
            type="submit" 
            :disabled="salvando"
            class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50"
          >
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Salvando...' : (isEdicao ? 'Atualizar Aviso' : 'Publicar Agora') }}
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
import type { AvisoForm } from '../../../types/aviso';
import { ArrowLeftIcon, CalendarDateRangeIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Datas Iniciais
const hoje = new Date();
const semanaQueVem = new Date();
semanaQueVem.setDate(hoje.getDate() + 7);

const toInputDate = (date: Date) => date.toISOString().slice(0, 16);

// Estado do Formulário
const form = ref<AvisoForm>({
  titulo: '',
  conteudo: '', // Corrigido para bater com o DTO Java
  tipo: 'INFO',
  prioridade: 1, // Padrão
  ativo: true,   // Padrão
  dataInicio: toInputDate(hoje),
  dataFim: toInputDate(semanaQueVem)
});

// Lógica Automática de Prioridade (Opcional, mas útil)
const atualizarPrioridadeAuto = () => {
  switch (form.value.tipo) {
    case 'URGENTE': form.value.prioridade = 3; break;
    case 'ALERTA': form.value.prioridade = 2; break;
    default: form.value.prioridade = 1;
  }
};

onMounted(async () => {
  if (isEdicao.value) {
    loadingInicial.value = true;
    try {
      const { data } = await api.get(`/avisos/${route.params.id}`);
      form.value = {
        titulo: data.titulo,
        conteudo: data.conteudo, // Backend retorna 'conteudo'
        tipo: data.tipo,
        prioridade: data.prioridade,
        ativo: data.ativo,
        dataInicio: data.dataInicio.slice(0, 16),
        dataFim: data.dataFim.slice(0, 16)
      };
    } catch (error) {
      console.error('Erro ao carregar aviso', error);
      alert('Erro ao carregar dados.');
      router.push('/admin/avisos');
    } finally {
      loadingInicial.value = false;
    }
  }
});

const salvar = async () => {
  if (form.value.dataFim <= form.value.dataInicio) {
    alert('A data de fim deve ser maior que a data de início.');
    return;
  }

  salvando.value = true;
  try {
    // Clona o formulário para ajustar dados antes de enviar
    const payload = { ...form.value };
    
    // Ajusta formato de data para o Java (adiciona segundos :00)
    if (payload.dataInicio.length === 16) payload.dataInicio += ':00';
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    if (isEdicao.value) {
      await api.put(`/avisos/${route.params.id}`, payload);
      alert('Aviso atualizado com sucesso!');
    } else {
      await api.post('/avisos', payload);
      alert('Aviso publicado com sucesso!');
    }
    
    router.push('/admin/avisos');
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    // Feedback de erro mais detalhado
    const msg = error.response?.data?.message || 'Verifique os campos obrigatórios.';
    alert(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};
</script>