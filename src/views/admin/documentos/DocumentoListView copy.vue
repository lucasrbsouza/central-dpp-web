<template>
  <div>
    <PageHeader 
      title="Gestão de Documentos" 
      subtitle="Repositório de arquivos e links oficiais."
    >
      <template #actions>
        <router-link 
          to="/admin/documentos/novo" 
          class="bg-piaui-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm font-medium"
        >
          <span>+</span> Novo Documento
        </router-link>
      </template>
    </PageHeader>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="documentos.length === 0"
    >
      <template #empty>
        <div class="mb-2 text-4xl text-gray-300">
          <FolderOpenIcon class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-gray-500 text-lg">Nenhum documento encontrado.</p>
      </template>

      <BaseTable :columns="tableColumns" :items="documentos">
        
        <template #cell-info="{ item: doc }">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-gray-50 shrink-0">
              <LinkIcon v-if="doc.urlLink" class="w-6 h-6 text-blue-500" />
              <DocumentTextIcon v-else class="w-6 h-6 text-orange-500" />
            </div>
            
            <div>
              <p class="font-bold text-gray-800">{{ doc.titulo }}</p>
              <p class="text-xs text-gray-500 line-clamp-1">{{ doc.descricao || 'Sem descrição' }}</p>
            </div>
          </div>
        </template>

        <template #cell-tipo="{ item: doc }">
          <BaseBadge :variant="doc.urlLink ? 'info' : 'warning'">
            {{ doc.urlLink ? 'Link Externo' : 'Arquivo' }}
          </BaseBadge>
        </template>

        <template #cell-actions="{ item: doc }">
          <div class="flex items-center justify-end gap-2">
            
            <BaseActionBtn 
              v-if="doc.urlLink"
              :icon="ArrowTopRightOnSquareIcon"
              label="Abrir Link Externo"
              color="text-blue-500 hover:bg-blue-50"
              @click="abrirLink(doc.urlLink)"
            />

            <BaseActionBtn 
              v-else
              :icon="ArrowDownTrayIcon"
              label="Baixar Arquivo"
              color="text-green-600 hover:bg-green-50"
              @click="downloadArquivo(doc)"
            />

            <div class="h-4 w-px bg-gray-200 mx-1"></div>

            <BaseActionBtn 
              action="delete" 
              @click="excluir(doc.id)" 
            />

          </div>
        </template>

      </BaseTable>

      <template #pagination>
        <BasePagination 
          :page="pageAtual" 
          :total-pages="totalPages" 
          :first="first" 
          :last="last"
          @change-page="fetch" 
        />
      </template>

    </BaseListLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../services/api';
import type { DocumentoDTO, Page } from '../../../types/documento';
import { toast } from 'vue-sonner';

// Ícones
import { 
  FolderOpenIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  ArrowDownTrayIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/vue/24/outline';

// Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseListLayout from '../../../components/layout/BaseListLayout.vue';
import BaseTable from '../../../components/common/BaseTable.vue';
import type { TableColumn } from '../../../types/table';
import BaseBadge from '../../../components/common/BaseBadge.vue';
import BasePagination from '../../../components/common/BasePagination.vue';
import BaseActionBtn from '../../../components/common/BaseActionBtn.vue';

const documentos = ref<DocumentoDTO[]>([]);
const loading = ref(true);

// Paginação
const pageAtual = ref(0);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Colunas
const tableColumns: TableColumn[] = [
  { key: 'info', label: 'Documento' },
  { key: 'tipo', label: 'Tipo', align: 'center', width: '150px' },
  { key: 'actions', label: 'Acesso / Ações', align: 'right', width: '140px' }
];

const fetch = async (page = 0) => {
  loading.value = true;
  try {
    const { data } = await api.get<Page<DocumentoDTO>>(`/documentos?page=${page}&size=10&sort=id,desc`);
    documentos.value = data.content;
    pageAtual.value = data.number;
    totalPages.value = data.totalPages;
    first.value = data.first;
    last.value = data.last;
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    toast.error('Erro ao carregar lista de documentos.');
  } finally {
    loading.value = false;
  }
};

const abrirLink = (url: string) => {
  window.open(url, '_blank');
};

const downloadArquivo = async (doc: DocumentoDTO) => {
  const toastId = toast.loading('Baixando arquivo...');
  try {
    const response = await api.get(`/documentos/${doc.id}/download`, {
      responseType: 'blob'
    });
    
    // Cria link temporário
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Tenta definir extensão padrão (idealmente viria do Content-Disposition)
    link.setAttribute('download', `${doc.titulo}.pdf`); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.dismiss(toastId);
    toast.success('Download concluído.');
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Erro ao baixar arquivo. Verifique se ele ainda existe.');
  }
};

const excluir = async (id: number) => {
  if(!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
  try {
    await api.delete(`/documentos/${id}`);
    toast.success('Documento excluído.');
    fetch(pageAtual.value);
  } catch (error) {
    toast.error('Erro ao excluir documento.');
  }
};

onMounted(() => fetch());
</script>