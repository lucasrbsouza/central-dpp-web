<template>
  <div>
    <PageHeader 
      title="Documentos Oficiais" 
      subtitle="Modelos, manuais e arquivos para download."
    />

    <div class="max-w-xl mx-auto mb-8">
      <BaseSearchInput 
        v-model="termo" 
        placeholder="Pesquisar documento..." 
        @search="fetch"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <BaseEmptyState 
      v-else-if="documentos.length === 0"
      title="Nenhum documento disponível"
      description="Tente buscar por outros termos."
    >
      <template #icon><DocumentIcon class="w-8 h-8" /></template>
      <template #action>
         <button v-if="termo" @click="limparBusca" class="text-piaui-blue underline font-bold">Ver todos</button>
      </template>
    </BaseEmptyState>

    <div v-else class="space-y-3">
      <div 
        v-for="doc in documentos" 
        :key="doc.id"
        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-blue-300 transition-colors"
      >
        <div class="p-3 rounded-lg shrink-0" :class="doc.urlLink ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'">
          <LinkIcon v-if="doc.urlLink" class="w-6 h-6" />
          <DocumentTextIcon v-else class="w-6 h-6" />
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-gray-800">{{ doc.titulo }}</h3>
            <span v-if="doc.urlLink" class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">Link</span>
            <span v-else class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">Arquivo</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ doc.descricao || 'Sem descrição.' }}</p>
        </div>

        <div class="mt-2 md:mt-0">
          <a 
            v-if="doc.urlLink" 
            :href="doc.urlLink" 
            target="_blank"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
          >
            Acessar <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          </a>
          
          <button 
            v-else 
            @click="baixar(doc)"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition"
          >
            Baixar <ArrowDownTrayIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../../services/api';
import { toast } from 'vue-sonner';
import { 
  DocumentTextIcon, 
  LinkIcon, 
  ArrowDownTrayIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/vue/24/outline';

// Componentes
import PageHeader from '../../components/common/PageHeader.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import BaseEmptyState from '../../components/common/BaseEmptyState.vue';
import BaseSearchInput from '../../components/common/BaseSearchInput.vue';

const documentos = ref<any[]>([]);
const loading = ref(true);
const termo = ref('');

let timeout: ReturnType<typeof setTimeout>;

// Opcional: Busca automática ao digitar (igual aos colaboradores)
watch(termo, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch();
  }, 500);
});

const fetch = async () => {
  loading.value = true;
  try {
    let url = `/documentos?page=0&size=20&sort=titulo,asc`;
    if (termo.value) url += `&titulo=${termo.value}`;
    const { data } = await api.get(url);
    documentos.value = data.content;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const limparBusca = () => {
  termo.value = '';
};

const baixar = async (doc: any) => {
  const t = toast.loading('Baixando...');
  try {
    const response = await api.get(`/documentos/${doc.id}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${doc.titulo}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.dismiss(t);
    toast.success('Concluído!');
  } catch (e) {
    toast.dismiss(t);
    toast.error('Erro no download.');
  }
};

onMounted(() => fetch());
</script>