<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="salvando" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        title="Novo Documento" 
        subtitle="Faça upload de arquivos ou cadastre links oficiais."
      >
        <template #back-button>
          <router-link 
            to="/admin/documentos" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-6">
      
      <div class="flex justify-center">
        <div class="bg-gray-100 p-1 rounded-lg flex shadow-inner">
          <button 
            type="button"
            @click="form.tipo = 'ARQUIVO'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-bold transition flex items-center gap-2', 
              form.tipo === 'ARQUIVO' ? 'bg-white shadow text-piaui-blue' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <DocumentArrowUpIcon class="w-4 h-4" /> Upload de Arquivo
          </button>
          <button 
            type="button"
            @click="form.tipo = 'LINK'"
            :class="[
              'px-6 py-2 rounded-md text-sm font-bold transition flex items-center gap-2', 
              form.tipo === 'LINK' ? 'bg-white shadow text-piaui-blue' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <LinkIcon class="w-4 h-4" /> Link Externo
          </button>
        </div>
      </div>

      <BaseInput 
        v-model="form.titulo" 
        label="Título do Documento" 
        placeholder="Ex: Manual de Conduta 2024" 
        required 
      />

      <BaseTextarea 
        v-model="form.descricao" 
        label="Descrição" 
        placeholder="Breve resumo do conteúdo..."
        rows="3" 
      />

      <BaseSelect 
        v-model="form.equipeId" 
        label="Vincular a uma Equipe/Setor" 
        :options="equipesOptions"
        option-label="label"
        option-value="id"
        placeholder="-- Geral (Sem vínculo) --"
      />

      <Transition name="fade" mode="out-in">
        
        <div v-if="form.tipo === 'ARQUIVO'" key="arquivo">
          <BaseFileUpload 
            v-model="form.arquivo" 
            label="Selecione o Arquivo" 
            required
            help-text="Suporta PDF, DOCX, XLSX ou Imagens (Máx 20MB)"
          />
        </div>

        <div v-else key="link">
          <BaseInput 
            v-model="form.urlLink" 
            label="URL de Destino" 
            placeholder="https://..." 
            required 
            type="url"
          />
        </div>

      </Transition>

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/documentos')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ form.tipo === 'ARQUIVO' ? 'Enviar Arquivo' : 'Salvar Link' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import uploadApi from '../../../services/uploadApi';
import EquipeService from '../../../services/EquipeService';
import { ArrowLeftIcon, DocumentArrowUpIcon, LinkIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseTextarea from '../../../components/common/BaseTextarea.vue';
import BaseSelect from '../../../components/common/BaseSelect.vue';
import BaseButton from '../../../components/common/BaseButton.vue';
import BaseFileUpload from '../../../components/common/BaseFileUpload.vue';

import type { DocumentoFormState } from '../../../types/documento';
import type { OptionDTO } from '../../../types/auxiliares';

const router = useRouter();
const salvando = ref(false);
const equipesOptions = ref<OptionDTO[]>([]);

const form = ref<DocumentoFormState>({
  titulo: '',
  descricao: '',
  equipeId: null,
  tipo: 'ARQUIVO',
  urlLink: '',
  arquivo: null
});

onMounted(async () => {
  try {
    equipesOptions.value = await EquipeService.getEquipesDropdown();
  } catch (error) {
    console.error('Erro ao carregar equipes');
  }
});

const salvar = async () => {
  // 1. Validações prévias
  if (form.value.tipo === 'ARQUIVO' && !form.value.arquivo) {
    toast.warning('Selecione um arquivo para continuar.');
    return;
  }
  if (form.value.tipo === 'LINK' && !form.value.urlLink) {
    toast.warning('Informe a URL do link.');
    return;
  }

  salvando.value = true;
  try {
    // 2. Construção do FormData
    const formData = new FormData();
    
    // --- Campos Comuns ---
    formData.append('titulo', form.value.titulo);
    // Envia string vazia se for null/undefined para não quebrar o backend
    formData.append('descricao', form.value.descricao || '');
    
    // Só envia equipeId se tiver valor
    if (form.value.equipeId) {
      formData.append('equipeId', form.value.equipeId.toString());
    }

    // --- Lógica de Exclusão Mútua (Arquivo OU Link) ---
    if (form.value.tipo === 'LINK') {
      // Caso LINK: Envia urlLink. NÃO ENVIA o campo 'arquivo'.
      formData.append('urlLink', form.value.urlLink);
    } else {
      // Caso ARQUIVO: Envia arquivo. NÃO ENVIA o campo 'urlLink'.
      formData.append('arquivo', form.value.arquivo as File);
    }

    // 3. Envio (O Axios detecta FormData e configura o header multipart automaticamente)
    await uploadApi.post('/documentos', formData);
    
    toast.success('Documento salvo com sucesso!');
    router.push('/admin/documentos');

  } catch (error: any) {
    console.error('Erro upload:', error);
    const msg = error.response?.data?.message || 'Erro ao processar a requisição.';
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>