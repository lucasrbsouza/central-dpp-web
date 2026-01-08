<template>
  <div class="max-w-3xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/equipes" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Equipe' : 'Nova Equipe' }}</h2>
        <p class="text-gray-600 text-sm">Defina o nome, hierarquia e liderança.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      
      <div v-if="loadingInicial" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piaui-blue"></div>
      </div>

      <form v-else @submit.prevent="salvar" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Equipe / Setor <span class="text-red-500">*</span></label>
          <input 
            v-model="form.nome" 
            type="text" 
            required 
            maxlength="100"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" 
            placeholder="Ex: Coordenação de TI"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input 
            v-model="form.descricao" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" 
            placeholder="Ex: Responsável pela infraestrutura..."
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Equipe Superior (Hierarquia)</label>
            <select 
              v-model="form.idEquipePai" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none bg-white"
            >
              <option :value="null">-- Nenhuma (Raiz) --</option>
              <option 
                v-for="eq in listaEquipes" 
                :key="eq.id" 
                :value="eq.id"
                :disabled="isEdicao && eq.id === Number(route.params.id)"
              >
                {{ eq.nome }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Selecione a qual setor esta equipe responde.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Líder / Responsável</label>
            <select 
              v-model="form.idLider" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none bg-white"
            >
              <option :value="null">-- Sem Líder --</option>
              <option v-for="colab in listaColaboradores" :key="colab.id" :value="colab.id">
                {{ colab.nome }} {{ colab.sobrenome }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" id="ativo" v-model="form.ativo" class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue">
          <label for="ativo" class="text-sm font-medium text-gray-700">Equipe Ativa</label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/equipes" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</router-link>
          <button type="submit" :disabled="salvando" class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Salvando...' : 'Salvar' }}
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
import type { EquipeForm, EquipeDTO } from '../../../types/equipe';
// Importamos tipos auxiliares se necessário
interface ColaboradorResumo { id: number; nome: string; sobrenome: string; }

const route = useRoute();
const router = useRouter();

const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Listas para os Dropdowns
const listaEquipes = ref<EquipeDTO[]>([]);
const listaColaboradores = ref<ColaboradorResumo[]>([]);

const form = ref<EquipeForm>({
  nome: '',
  descricao: '',
  ativo: true,
  idEquipePai: null,
  idLider: null
});

onMounted(async () => {
  loadingInicial.value = true;
  try {
    // 1. Carrega listas auxiliares em paralelo para ser rápido
    const [resEquipes, resColab] = await Promise.all([
      api.get('/equipes?size=100'), // Pega todas para o dropdown (aumente size se tiver muitas)
      api.get('/colaboradores?resumo=true')
    ]);

    listaEquipes.value = resEquipes.data.content;
    listaColaboradores.value = Array.isArray(resColab.data) ? resColab.data : resColab.data.content || [];

    // 2. Se for edição, carrega os dados da equipe atual
    if (isEdicao.value) {
      const { data } = await api.get(`/equipes/${route.params.id}`);
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
    alert('Erro ao carregar formulário.');
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
      alert('Equipe atualizada!');
    } else {
      await api.post('/equipes', payload);
      alert('Equipe criada com sucesso!');
    }
    router.push('/admin/equipes');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao salvar.';
    alert(msg);
  } finally {
    salvando.value = false;
  }
};
</script>