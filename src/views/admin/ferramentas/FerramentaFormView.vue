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
          <div class="col-span-1">
            <BaseSelect 
              v-model="protocolo" 
              :options="['https://', 'http://']"
              placeholder=""
              class="font-mono text-sm"
            />
          </div>
          
          <div class="col-span-3">
            <BaseInput 
              v-model="linkSemProtocolo" 
              placeholder="www.exemplo.pi.gov.br" 
              required 
            />
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Selecione o protocolo e digite o endereço.</p>
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
import BaseSelect from '../../../components/common/BaseSelect.vue';
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

// Lógica local para separar protocolo do domínio
const linkSemProtocolo = ref('');
const protocolo = ref('https://');

// Atualiza o link completo no form sempre que as partes mudam
watch([linkSemProtocolo, protocolo], () => {
  // Remove qualquer protocolo que o usuário tenha colado sem querer no input de texto
  const limpo = linkSemProtocolo.value.replace(/^https?:\/\//, '');
  form.value.link = `${protocolo.value}${limpo}`;
});

onMounted(async () => {
  if (isEdicao.value) {
    salvando.value = true; // Usa o loading do layout enquanto carrega
    try {
      const { data } = await api.get(`/ferramentas/${route.params.id}`);
      form.value = data;

      // Separa o link vindo do banco para preencher os campos
      if (data.link.startsWith('https://')) {
        protocolo.value = 'https://';
      } else if (data.link.startsWith('http://')) {
        protocolo.value = 'http://';
      }
      
      linkSemProtocolo.value = data.link.replace(/^https?:\/\//, '');
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