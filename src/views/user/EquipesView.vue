<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-800">Estrutura Organizacional</h2>
      <p class="text-gray-600 mt-2">Conheça os setores, lideranças e equipes da nossa secretaria.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="equipe in equipes" 
        :key="equipe.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
          <span v-if="equipe.nomeEquipePai" class="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
             ↳ Pertence a: {{ equipe.nomeEquipePai }}
          </span>
          <span v-else class="text-xs font-bold text-piaui-blue uppercase tracking-wide">
            ★ Setor Principal
          </span>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-blue-50 text-piaui-blue rounded-lg flex items-center justify-center text-2xl">
              🏢
            </div>
          </div>

          <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-piaui-blue transition-colors">
            {{ equipe.nome }}
          </h3>
          <p class="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
            {{ equipe.descricao || 'Sem descrição definida.' }}
          </p>

          <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <span v-if="!equipe.nomeLider" class="text-gray-400 text-xs">?</span>
              <span v-else class="font-bold text-gray-600 text-xs">{{ getIniciais(equipe.nomeLider) }}</span>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase font-bold">Líder / Responsável</p>
              <p class="text-sm font-medium text-gray-800 truncate w-40">
                {{ equipe.nomeLider || 'Não definido' }}
              </p>
            </div>
          </div>

          <button @click="abrirDetalhesEquipe(equipe)" class="mt-6 w-full py-2 bg-white border border-piaui-blue text-piaui-blue rounded-lg hover:bg-piaui-blue hover:text-white transition font-medium flex items-center justify-center gap-2">
            <span>👥</span> Ver Integrantes
          </button>
        </div>
      </div>
    </div>

    <div v-if="equipeSelecionada" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" @click.self="fecharModalEquipe">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in">
        
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ equipeSelecionada.nome }}</h3>
            <p class="text-sm text-gray-500">Lista de colaboradores vinculados</p>
          </div>
          <button @click="fecharModalEquipe" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <div v-if="loadingMembros" class="py-10 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
            <p class="text-sm text-gray-500 mt-2">Buscando equipe...</p>
          </div>

          <div v-else-if="membros.length === 0" class="py-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p class="text-2xl">🤷‍♂️</p>
            <p class="text-gray-500 mt-2">Nenhum colaborador vinculado a esta equipe no momento.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="membro in membros" 
              :key="membro.id"
              @click="membroSelecionado = membro"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group relative"
              title="Clique para ver detalhes"
            >
              <div class="w-10 h-10 rounded-full bg-piaui-blue text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                {{ getIniciais(membro.nome, membro.sobrenome) }}
              </div>
              
              <div class="overflow-hidden">
                <p class="font-bold text-gray-800 text-sm truncate group-hover:text-piaui-blue">{{ membro.nome }} {{ membro.sobrenome }}</p>
                <p class="text-xs text-gray-500 truncate">{{ membro.cargo || 'Colaborador' }}</p>
                <p class="text-xs text-blue-400 truncate">{{ membro.email }}</p>
              </div>

              <div v-if="membro.id === equipeSelecionada.idLider" class="ml-auto" title="Líder da Equipe">
                <span class="text-lg">👑</span>
              </div>
              
              <span class="absolute right-2 top-2 text-gray-300 opacity-0 group-hover:opacity-100 text-xs">ℹ️</span>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl text-right">
          <button @click="fecharModalEquipe" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition">
            Fechar
          </button>
        </div>
      </div>
    </div>

    <ColaboradorDetalhesModal 
      v-if="membroSelecionado" 
      :colaborador="membroSelecionado" 
      @close="membroSelecionado = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import type { EquipeDTO } from '../../types/equipe';
// Importamos ColaboradorRespostaDTO para garantir compatibilidade com o modal de detalhes
import type { ColaboradorRespostaDTO, Page } from '../../types/colaborador';
import { getIniciais } from '../../utils/formatters';
import ColaboradorDetalhesModal from '../../components/user/ColaboradorDetalhesModal.vue';

const equipes = ref<EquipeDTO[]>([]);
const loading = ref(true);
const loadingMembros = ref(false);

const equipeSelecionada = ref<EquipeDTO | null>(null);
const membros = ref<ColaboradorRespostaDTO[]>([]); // Tipado corretamente
const membroSelecionado = ref<ColaboradorRespostaDTO | null>(null); // Controle do segundo modal

onMounted(async () => {
  try {
    const { data } = await api.get<Page<EquipeDTO>>('/equipes?size=50&sort=nome,asc');
    equipes.value = data.content;
  } catch (error) {
    console.error('Erro ao listar equipes', error);
  } finally {
    loading.value = false;
  }
});

const abrirDetalhesEquipe = async (equipe: EquipeDTO) => {
  equipeSelecionada.value = equipe;
  membros.value = [];
  loadingMembros.value = true;
  
  try {
    // Usamos ColaboradorRespostaDTO aqui também
    const { data } = await api.get<Page<ColaboradorRespostaDTO>>(`/colaboradores?equipeId=${equipe.id}&size=100`);
    membros.value = data.content;
  } catch (error) {
    console.error('Erro ao buscar membros', error);
  } finally {
    loadingMembros.value = false;
  }
};

const fecharModalEquipe = () => {
  equipeSelecionada.value = null;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>