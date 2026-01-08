<template>
  <div class="max-w-3xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/admin/documentos" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">⬅️</router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Novo Documento</h2>
        <p class="text-gray-600 text-sm">Faça upload de arquivos ou cadastre links oficiais.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <form @submit.prevent="salvar" class="space-y-6">
        
        <div class="flex justify-center mb-6">
          <div class="bg-gray-100 p-1 rounded-lg flex">
            <button 
              type="button"
              @click="form.tipo = 'ARQUIVO'"
              :class="['px-6 py-2 rounded-md text-sm font-bold transition', form.tipo === 'ARQUIVO' ? 'bg-white shadow text-piaui-blue' : 'text-gray-500 hover:text-gray-700']"
            >
              📄 Upload de Arquivo
            </button>
            <button 
              type="button"
              @click="form.tipo = 'LINK'"
              :class="['px-6 py-2 rounded-md text-sm font-bold transition', form.tipo === 'LINK' ? 'bg-white shadow text-piaui-blue' : 'text-gray-500 hover:text-gray-700']"
            >
              🔗 Link Externo
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título do Documento <span class="text-red-500">*</span></label>
          <input v-model="form.titulo" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="Ex: Manual de Conduta 2024">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea v-model="form.descricao" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none resize-none" placeholder="Breve resumo do conteúdo..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vincular a uma Equipe/Setor</label>
          <select v-model="form.equipeId" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none bg-white">
            <option :value="null">-- Geral (Sem vínculo) --</option>
            <option v-for="eq in equipes" :key="eq.id" :value="eq.id">{{ eq.nome }}</option>
          </select>
        </div>

        <div v-if="form.tipo === 'ARQUIVO'" class="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
          <label class="block text-sm font-bold text-blue-800 mb-2">Selecione o Arquivo (PDF, DOC, IMG) <span class="text-red-500">*</span></label>
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileUpload"
            required
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          >
          <p class="text-xs text-blue-400 mt-2">Tamanho máximo recomendado: 10MB.</p>
        </div>

        <div v-if="form.tipo === 'LINK'" class="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
          <label class="block text-sm font-bold text-gray-700 mb-1">URL de Destino <span class="text-red-500">*</span></label>
          <input v-model="form.urlLink" type="url" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="https://...">
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <router-link to="/admin/documentos" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</router-link>
          <button type="submit" :disabled="salvando" class="px-6 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Enviando...' : 'Salvar Documento' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { DocumentoFormState } from '../../../types/documento';

const router = useRouter();
const salvando = ref(false);
const equipes = ref<any[]>([]); // Para o dropdown

const form = ref<DocumentoFormState>({
  titulo: '',
  descricao: '',
  equipeId: null,
  tipo: 'ARQUIVO', // Padrão
  urlLink: '',
  arquivo: null
});

// Captura o arquivo do input
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Cria um objeto File compatível se necessário
    form.value.arquivo = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
  } else {
    form.value.arquivo = null;
  }
};
onMounted(async () => {
  // Carrega equipes para o dropdown
  try {
    const { data } = await api.get('/equipes?size=100');
    equipes.value = data.content;
  } catch (error) {
    console.error('Erro ao carregar equipes');
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    // IMPORTANTE: Criar FormData para enviar binário
    const formData = new FormData();
    formData.append('titulo', form.value.titulo);
    formData.append('descricao', form.value.descricao || '');
    
    if (form.value.equipeId) {
      formData.append('equipeId', form.value.equipeId.toString());
    }

    if (form.value.tipo === 'LINK') {
      formData.append('urlLink', form.value.urlLink);
      // Backend exige arquivo? Geralmente não se for link, mas se o Java validar @NotNull no arquivo, 
      // teremos que ajustar. Pelo seu DTO, arquivo é "Opcional (se for Upload)", então ok.
    } else {
      if (!form.value.arquivo) {
        alert('Selecione um arquivo!');
        salvando.value = false;
        return;
      }
      formData.append('arquivo', form.value.arquivo);
    }

    // Axios detecta FormData e configura o header 'multipart/form-data' automaticamente
    await api.post('/documentos', formData);
    
    alert('Documento salvo com sucesso!');
    router.push('/admin/documentos');

  } catch (error: any) {
    console.error('Erro upload:', error);
    const msg = error.response?.data?.message || 'Erro ao enviar documento.';
    alert(msg);
  } finally {
    salvando.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>