<template>
  <div class="max-w-3xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/ferramentas" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Ferramenta' : 'Nova Ferramenta' }}</h2>
        <p class="text-gray-600 text-sm">Adicione links para sistemas externos.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <form @submit.prevent="salvar" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Título do Sistema/Site <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.titulo" 
            type="text" 
            required 
            maxlength="100"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" 
            placeholder="Ex: Portal do Servidor"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
          <input 
            v-model="form.descricao" 
            type="text" 
            maxlength="255"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" 
            placeholder="Ex: Acesso ao contracheque e dados funcionais"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            URL (Link) <span class="text-red-500">*</span>
          </label>
          <div class="flex">
            <!-- PROTOCOLO -->
            <select 
              v-model="protocolo" 
              class="px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-sm focus:outline-none"
            >
              <option value="http://">http://</option>
              <option value="https://">https://</option>
            </select>

            <!-- LINK SEM PROTOCOLO -->
            <input 
              v-model="linkSemProtocolo" 
              type="text" 
              required 
              class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-piaui-blue outline-none" 
              placeholder="www.exemplo.pi.gov.br"
            >
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="ativo" 
            v-model="form.ativo" 
            class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue"
          >
          <label for="ativo" class="text-sm font-medium text-gray-700">
            Ferramenta Ativa (Visível para usuários)
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link 
            to="/admin/ferramentas" 
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
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { FerramentaForm } from '../../../types/ferramenta';

const route = useRoute();
const router = useRouter();
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

const form = ref<FerramentaForm>({
  titulo: '',
  descricao: '',
  link: '',
  ativo: true
});

const linkSemProtocolo = ref('');
const protocolo = ref('https://');

// Atualiza o link completo sempre que mudar o protocolo ou o texto
watch([linkSemProtocolo, protocolo], () => {
  const limpo = linkSemProtocolo.value.replace(/^https?:\/\//, '');
  form.value.link = `${protocolo.value}${limpo}`;
});

onMounted(async () => {
  if (isEdicao.value) {
    try {
      const { data } = await api.get(`/ferramentas/${route.params.id}`);
      form.value = data;

      if (data.link.startsWith('https://')) {
        protocolo.value = 'https://';
      } else {
        protocolo.value = 'http://';
      }

      linkSemProtocolo.value = data.link.replace(/^https?:\/\//, '');
    } catch (error) {
      alert('Erro ao carregar.');
      router.push('/admin/ferramentas');
    }
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    if (isEdicao.value) {
      await api.put(`/ferramentas/${route.params.id}`, form.value);
    } else {
      await api.post('/ferramentas', form.value);
    }
    router.push('/admin/ferramentas');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao salvar.';
    alert(msg);
  } finally {
    salvando.value = false;
  }
};
</script>
