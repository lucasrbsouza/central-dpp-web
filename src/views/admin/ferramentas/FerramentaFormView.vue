<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="salvando" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        :title="isEdicao ? 'Editar Ferramenta' : 'Nova Ferramenta'"
        subtitle="Adicione links para sistemas externos ou internos."
      >
        <template #back-button>
          <router-link 
            to="/admin/ferramentas" 
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
        v-model="form.titulo" 
        label="Título do Sistema/Site" 
        placeholder="Ex: Portal do Servidor"
        maxlength="100"
        required 
      />

      <BaseInput 
        v-model="form.descricao" 
        label="Descrição Curta" 
        placeholder="Ex: Acesso ao contracheque e dados funcionais"
        maxlength="255"
      />

      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">
          URL (Link) <span class="text-red-500">*</span>
        </label>
        
        <div class="grid grid-cols-4 gap-3">
          <div class="col-span-3">
            <BaseInput 
              v-model="linkInput" 
              placeholder="www.exemplo.pi.gov.br ou https://exemplo.com"
              required 
            />
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Você pode colar com ou sem http/https. O sistema ajusta automaticamente.
        </p>
      </div>

      <BaseCheckbox 
        v-model="form.ativo" 
        label="Ferramenta Ativa (Visível para usuários)" 
      />

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/ferramentas')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ isEdicao ? 'Salvar Alterações' : 'Salvar' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { FerramentaForm } from '../../../types/ferramenta';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseCheckbox from '../../../components/common/BaseCheckbox.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

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

// Input livre do usuário (com ou sem protocolo)
const linkInput = ref('');

/**
 * Normaliza o link:
 * - se não tiver http/https, adiciona https://
 * - se já tiver, mantém
 */
watch(linkInput, () => {
  let valor = linkInput.value.trim();

  if (!valor) {
    form.value.link = '';
    return;
  }

  // Bloqueia esquemas perigosos
  if (/^(javascript:|data:)/i.test(valor)) {
    form.value.link = '';
    return;
  }

  // Se não começar com http:// ou https://, adiciona https://
  if (!/^https?:\/\//i.test(valor)) {
    valor = `https://${valor}`;
  }

  form.value.link = valor;
});

onMounted(async () => {
  if (isEdicao.value) {
    salvando.value = true;
    try {
      const { data } = await api.get(`/ferramentas/${route.params.id}`);
      form.value = data;

      // Preenche o input exatamente como veio do backend
      linkInput.value = data.link || '';
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar ferramenta.');
      router.push('/admin/ferramentas');
    } finally {
      salvando.value = false;
    }
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    if (isEdicao.value) {
      await api.put(`/ferramentas/${route.params.id}`, form.value);
      toast.success('Ferramenta atualizada!');
    } else {
      await api.post('/ferramentas', form.value);
      toast.success('Ferramenta criada com sucesso!');
    }
    router.push('/admin/ferramentas');
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.message || 'Erro ao salvar.';
    toast.error(msg);
  } finally {
    salvando.value = false;
  }
};
</script>
