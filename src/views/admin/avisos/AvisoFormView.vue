<template>
  <BaseFormLayout 
    max-width="2xl" 
    :loading="loadingInicial" 
    @submit="salvar"
  >
    
    <template #header>
      <PageHeader 
        :title="isEdicao ? 'Editar Aviso' : 'Nova Publicação'"
        subtitle="Preencha os dados do comunicado para o mural."
      >
        <template #back-button>
          <router-link 
            to="/admin/avisos" 
            class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5"/>
          </router-link>
        </template>
      </PageHeader>
    </template>

    <div class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <BaseInput 
            v-model="form.titulo" 
            label="Título do Aviso" 
            placeholder="Ex: Manutenção no Sistema"
            maxlength="150"
            required 
          />
        </div>

        <div class="md:col-span-1">
          <BaseSelect 
            v-model="form.tipo" 
            label="Tipo / Gravidade"
            :options="opcoesTipo"
            option-label="label"
            option-value="value"
            required
            @change="atualizarPrioridadeAuto"
          />
        </div>
      </div>

      <BaseTextarea 
        v-model="form.conteudo" 
        label="Conteúdo" 
        placeholder="Digite os detalhes do aviso aqui..."
        rows="5"
        required 
      />

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <CalendarDateRangeIcon class="w-4 h-4" /> Período de Exibição
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput 
            v-model="form.dataInicio" 
            type="datetime-local" 
            label="Data/Hora Início" 
            required 
          />
          <BaseInput 
            v-model="form.dataFim" 
            type="datetime-local" 
            label="Data/Hora Fim" 
            required 
          />
        </div>
      </div>

    </div>

    <template #actions>
      <BaseButton variant="outline" @click="$router.push('/admin/avisos')">
        Cancelar
      </BaseButton>
      
      <BaseButton type="submit" :loading="salvando">
        {{ isEdicao ? 'Atualizar Aviso' : 'Publicar Agora' }}
      </BaseButton>
    </template>

  </BaseFormLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { AvisoForm } from '../../../types/aviso';
import { ArrowLeftIcon, CalendarDateRangeIcon } from '@heroicons/vue/24/outline';
import { toast } from 'vue-sonner';

// Componentes UI Padronizados
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseSelect from '../../../components/common/BaseSelect.vue';
import BaseTextarea from '../../../components/common/BaseTextarea.vue'; // Novo componente
import BaseButton from '../../../components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();

const loadingInicial = ref(false);
const salvando = ref(false);
const isEdicao = computed(() => route.params.id !== undefined);

// Datas Iniciais
const hoje = new Date();
const semanaQueVem = new Date();
semanaQueVem.setDate(hoje.getDate() + 7);

const toInputDate = (date: Date) => date.toISOString().slice(0, 16);

// Opções para o Select (Manual, pois são fixas do sistema)
const opcoesTipo = [
  { label: '🔵 Informativo', value: 'INFO' },
  { label: '🟡 Alerta', value: 'ALERTA' },
  { label: '🔴 Urgente', value: 'URGENTE' }
];

const form = ref<AvisoForm>({
  titulo: '',
  conteudo: '',
  tipo: 'INFO',
  prioridade: 1,
  ativo: true,
  dataInicio: toInputDate(hoje),
  dataFim: toInputDate(semanaQueVem)
});

// Lógica de Negócio
const atualizarPrioridadeAuto = () => {
  switch (form.value.tipo) {
    case 'URGENTE': form.value.prioridade = 3; break;
    case 'ALERTA': form.value.prioridade = 2; break;
    default: form.value.prioridade = 1;
  }
};

onMounted(async () => {
  if (isEdicao.value) {
    loadingInicial.value = true;
    try {
      const { data } = await api.get(`/avisos/${route.params.id}`);
      form.value = {
        titulo: data.titulo,
        conteudo: data.conteudo,
        tipo: data.tipo,
        prioridade: data.prioridade,
        ativo: data.ativo,
        dataInicio: data.dataInicio?.slice(0, 16) || '', // Safe check
        dataFim: data.dataFim?.slice(0, 16) || ''
      };
    } catch (error) {
      console.error('Erro ao carregar aviso', error);
      toast.error('Erro ao carregar dados do aviso.');
      router.push('/admin/avisos');
    } finally {
      loadingInicial.value = false;
    }
  }
});

const salvar = async () => {
  if (form.value.dataFim <= form.value.dataInicio) {
    toast.warning('A data de fim deve ser posterior à data de início.');
    return;
  }

  salvando.value = true;
  try {
    const payload = { ...form.value };
    
    // Ajuste para formato Java LocalDateTime (yyyy-MM-ddTHH:mm:ss)
    if (payload.dataInicio.length === 16) payload.dataInicio += ':00';
    if (payload.dataFim.length === 16) payload.dataFim += ':00';

    if (isEdicao.value) {
      await api.put(`/avisos/${route.params.id}`, payload);
      toast.success('Aviso atualizado com sucesso!');
    } else {
      await api.post('/avisos', payload);
      toast.success('Aviso publicado com sucesso!');
    }
    
    router.push('/admin/avisos');
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    const msg = error.response?.data?.message || 'Verifique os campos obrigatórios.';
    toast.error(`Erro: ${msg}`);
  } finally {
    salvando.value = false;
  }
};
</script>