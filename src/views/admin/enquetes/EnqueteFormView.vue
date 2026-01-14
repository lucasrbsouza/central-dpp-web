<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="salvando" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        title="Nova Enquete" 
        subtitle="Defina a pergunta e as opções de voto para os colaboradores."
      >
        <template #back-button>
          <router-link 
            to="/admin/enquetes" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-6">
      
      <BaseInput 
        v-model="form.pergunta" 
        label="Pergunta Principal" 
        placeholder="Ex: Qual o tema do próximo workshop?" 
        required 
      />

      <BaseTextarea 
        v-model="form.descricao" 
        label="Descrição (Opcional)" 
        rows="2" 
      />

      <div class="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-bold text-gray-700">
            Opções de Resposta <span class="text-red-500">*</span>
          </label>
          <span class="text-xs text-gray-500">Mínimo de 2 opções</span>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="(opcao, index) in form.opcoesTexto" 
            :key="index" 
            class="flex items-start gap-3"
          >
            <span class="pt-3 text-gray-400 font-mono text-sm font-bold w-6 text-right">
              {{ index + 1 }}.
            </span>
            
            <div class="flex-1">
              <BaseInput 
                v-model="form.opcoesTexto[index]" 
                placeholder="Digite uma opção..." 
                required 
              />
            </div>

            <button 
              type="button" 
              @click="removerOpcao(index)" 
              class="mt-2 text-gray-400 hover:text-red-500 p-1 rounded-md transition hover:bg-red-50"
              :class="{ 'opacity-0 pointer-events-none': form.opcoesTexto.length <= 2 }"
              title="Remover opção"
              :disabled="form.opcoesTexto.length <= 2"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="mt-4 pl-9">
          <button 
            type="button" 
            @click="adicionarOpcao"
            class="text-sm text-piaui-blue font-bold hover:text-blue-700 flex items-center gap-1 transition"
          >
            <PlusCircleIcon class="w-5 h-5" />
            Adicionar outra opção
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <BaseInput 
          v-model="form.dataFim" 
          type="datetime-local" 
          label="Data de Encerramento" 
          required 
        />
        
        <div class="pb-3">
          <BaseCheckbox 
            v-model="form.multiplaEscolha" 
            label="Permitir Múltipla Escolha" 
          />
        </div>
      </div>

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/enquetes')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        Publicar Enquete
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../services/api';
import type { EnqueteForm } from '../../../types/enquete';
import { ArrowLeftIcon, TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseTextarea from '../../../components/common/BaseTextarea.vue';
import BaseCheckbox from '../../../components/common/BaseCheckbox.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

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
  opcoesTexto: ['', ''] // Começa com 2 vazias obrigatórias
});

const adicionarOpcao = () => {
  form.value.opcoesTexto.push('');
};

const removerOpcao = (index: number) => {
  if (form.value.opcoesTexto.length > 2) {
    form.value.opcoesTexto.splice(index, 1);
  }
};

const salvar = async () => {
  // Validação: Remover opções vazias e checar mínimo
  const opcoesValidas = form.value.opcoesTexto
    .map(t => t.trim())
    .filter(t => t !== '');
    
  if (opcoesValidas.length < 2) {
    toast.warning('A enquete precisa ter pelo menos 2 opções preenchidas.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { 
      ...form.value, 
      opcoesTexto: opcoesValidas 
    };
    
    // Ajuste de data para o Java (adiciona segundos)
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    await api.post('/enquetes', payload);
    toast.success('Enquete publicada com sucesso!');
    router.push('/admin/enquetes');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao criar enquete.';
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};
</script>