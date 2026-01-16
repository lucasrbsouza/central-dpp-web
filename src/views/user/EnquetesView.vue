<template>
  <div>
    <PageHeader 
      title="Enquetes Ativas" 
      subtitle="Participe das decisões e pesquisas da secretaria."
    />

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <BaseEmptyState 
      v-else-if="enquetes.length === 0"
      title="Nenhuma enquete ativa"
      description="No momento não há votações em andamento."
    >
      <template #icon>📊</template>
    </BaseEmptyState>

    <div v-else class="space-y-8 max-w-4xl mx-auto">
      <div 
        v-for="enquete in enquetes" 
        :key="enquete.id" 
        class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      >
        <div class="p-6 border-b border-gray-100 bg-gray-50">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ enquete.pergunta }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ enquete.descricao }}</p>
            </div>
            <div v-if="enquete.usuarioJaVotou" class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Votado <CheckIcon class="w-4 h-4 inline-block ml-1" />
            </div>
            <div v-else class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Aberta
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-3 flex items-center gap-1">
            ⏱ Encerra em: {{ formatarDataHora(enquete.dataFim) }}
            <span v-if="enquete.multiplaEscolha" class="ml-2">• Múltipla Escolha</span>
          </p>
        </div>

        <div v-if="enquete.usuarioJaVotou || isExpirada(enquete.dataFim)" class="p-6 space-y-4">
          <div v-for="opcao in enquete.opcoes" :key="opcao.id">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700">{{ opcao.texto }}</span>
              <span class="font-bold text-gray-900">{{ calcularPorcentagem(opcao.totalVotos, enquete) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-piaui-blue h-2.5 rounded-full transition-all duration-1000" 
                :style="{ width: calcularPorcentagem(opcao.totalVotos, enquete) + '%' }"
              ></div>
            </div>
            <p class="text-xs text-gray-400 text-right mt-1">{{ opcao.totalVotos }} votos</p>
          </div>
          <p v-if="isExpirada(enquete.dataFim) && !enquete.usuarioJaVotou" class="text-center text-red-500 font-bold mt-4">
            Votação Encerrada.
          </p>
        </div>

        <div v-else class="p-6">
          <form @submit.prevent="votar(enquete)">
            <div class="space-y-3">
              <label 
                v-for="opcao in enquete.opcoes" 
                :key="opcao.id"
                class="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition group"
                :class="{'border-piaui-blue bg-blue-50': isSelecionada(enquete.id, opcao.id)}"
              >
                <input 
                  :type="enquete.multiplaEscolha ? 'checkbox' : 'radio'" 
                  :name="'enquete_' + enquete.id"
                  :value="opcao.id"
                  @change="selecionarOpcao(enquete, opcao.id, $event)"
                  class="w-5 h-5 text-piaui-blue focus:ring-piaui-blue"
                >
                <span class="ml-3 text-gray-700 group-hover:text-gray-900">{{ opcao.texto }}</span>
              </label>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button 
                type="submit" 
                class="bg-piaui-green hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!temSelecao(enquete.id)"
              >
                Confirmar Voto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api';
import type { EnqueteDTO, Page } from '../../types/enquete';
import { formatarDataHora } from '../../utils/formatters';

// Components
import PageHeader from '../../components/common/PageHeader.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import BaseEmptyState from '../../components/common/BaseEmptyState.vue';
import { CheckIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

const enquetes = ref<EnqueteDTO[]>([]);
const loading = ref(true);
const selecoes = reactive<Record<number, number[]>>({});

const fetch = async () => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<EnqueteDTO>>('/enquetes?sort=dataFim,desc');
    enquetes.value = data.content;
  } catch (error) {
    console.error('Erro ao buscar enquetes', error);
  } finally {
    loading.value = false;
  }
};

const selecionarOpcao = (enquete: EnqueteDTO, opcaoId: number, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  const selecaoAtual = selecoes[enquete.id] || [];
  
  if (enquete.multiplaEscolha) {
    if (checked) {
      if (!selecaoAtual.includes(opcaoId)) selecoes[enquete.id] = [...selecaoAtual, opcaoId];
    } else {
      selecoes[enquete.id] = selecaoAtual.filter(id => id !== opcaoId);
    }
  } else {
    selecoes[enquete.id] = checked ? [opcaoId] : [];
  }
};

const isSelecionada = (enqueteId: number, opcaoId: number) => selecoes[enqueteId]?.includes(opcaoId);
const temSelecao = (enqueteId: number) => selecoes[enqueteId] && selecoes[enqueteId].length > 0;
const isExpirada = (dataFim: string) => new Date(dataFim) < new Date();

const calcularPorcentagem = (votosOpcao: number, enquete: EnqueteDTO) => {
  const total = enquete.opcoes.reduce((acc, curr) => acc + curr.totalVotos, 0);
  if (total === 0) return 0;
  return Math.round((votosOpcao / total) * 100);
};

const votar = async (enquete: EnqueteDTO) => {
  const opcoesEscolhidas = selecoes[enquete.id];
  if (!opcoesEscolhidas || opcoesEscolhidas.length === 0) return;
  try {
    await api.post(`/enquetes/${enquete.id}/votar`, { opcoesIds: opcoesEscolhidas });
    toast.success('Voto registrado com sucesso!');
    await fetch();
    delete selecoes[enquete.id];
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erro ao votar.';
    toast.error(msg);
  }
};

onMounted(() => fetch());
</script>