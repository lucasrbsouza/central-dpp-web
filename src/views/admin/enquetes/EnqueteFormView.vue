<template>
  <div class="max-w-3xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/enquetes" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Nova Enquete</h2>
        <p class="text-gray-600 text-sm">Defina a pergunta e as opções de voto.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <form @submit.prevent="salvar" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pergunta Principal <span class="text-red-500">*</span></label>
          <input v-model="form.pergunta" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="Ex: Qual o tema do próximo workshop?">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
          <textarea v-model="form.descricao" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none resize-none"></textarea>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label class="block text-sm font-bold text-gray-700 mb-3">Opções de Resposta <span class="text-red-500">*</span></label>
          
          <div class="space-y-3">
            <div v-for="(opcao, index) in form.opcoesTexto" :key="index" class="flex gap-2">
              <span class="py-2 text-gray-400 font-mono text-sm">{{ index + 1 }}.</span>
              <input 
                v-model="form.opcoesTexto[index]" 
                type="text" 
                required 
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none"
                placeholder="Digite uma opção..."
              >
              <button 
                type="button" 
                @click="removerOpcao(index)" 
                class="text-red-400 hover:text-red-600 px-2"
                v-if="form.opcoesTexto.length > 2"
                title="Remover opção"
              >
                ✕
              </button>
            </div>
          </div>

          <button 
            type="button" 
            @click="adicionarOpcao"
            class="mt-4 text-sm text-piaui-blue font-bold hover:underline flex items-center gap-1"
          >
            + Adicionar outra opção
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Encerramento <span class="text-red-500">*</span></label>
            <input v-model="form.dataFim" type="datetime-local" required class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-piaui-blue outline-none">
          </div>
          
          <div class="flex items-center h-full pt-6">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.multiplaEscolha" class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue">
              <div class="ml-3">
                <span class="block text-sm font-medium text-gray-800">Permitir Múltipla Escolha</span>
                <span class="block text-xs text-gray-500">Usuário pode marcar mais de uma opção.</span>
              </div>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/enquetes" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</router-link>
          <button type="submit" :disabled="salvando" class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Criando...' : 'Publicar Enquete' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { EnqueteForm } from '../../../types/enquete';

const router = useRouter();
const salvando = ref(false);

// Datas helpers
const agora = new Date();
const semanaQueVem = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
const toInputDate = (d: Date) => d.toISOString().slice(0, 16);

const form = ref<EnqueteForm>({
  pergunta: '',
  descricao: '',
  multiplaEscolha: false,
  dataFim: toInputDate(semanaQueVem),
  opcoesTexto: ['', ''] // Começa com 2 vazias
});

const adicionarOpcao = () => form.value.opcoesTexto.push('');

const removerOpcao = (index: number) => {
  if (form.value.opcoesTexto.length > 2) {
    form.value.opcoesTexto.splice(index, 1);
  }
};

const salvar = async () => {
  // Validação: Remover opções vazias
  const opcoesValidas = form.value.opcoesTexto.filter(t => t.trim() !== '');
  if (opcoesValidas.length < 2) {
    alert('A enquete precisa ter pelo menos 2 opções preenchidas.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { ...form.value, opcoesTexto: opcoesValidas };
    // Ajuste de data para o Java (segundos)
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    await api.post('/enquetes', payload);
    alert('Enquete publicada!');
    router.push('/admin/enquetes');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao criar enquete.';
    alert(msg);
  } finally {
    salvando.value = false;
  }
};
</script>