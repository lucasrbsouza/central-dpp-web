<template>
  <div>
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      
      <div class="flex-1">
        <BaseSearchFilter 
          v-model="termoBusca" 
          @search="handleBusca" 
          placeholder="Buscar registro..."
        />
      </div>

      <div class="md:mt-0"> <BaseButton @click="abrirModalCriacao">
           <span>+</span> Novo {{ titulo }}
         </BaseButton>
      </div>

    </div>

    <BaseListLayout 
      :loading="loading" 
      :is-empty="items.length === 0"
    >
      
      <BaseTable :columns="colunasTabela" :items="items">
        
        <template v-for="col in camposConfig" :key="col.key" #[`cell-${col.key}`]="{ item }">
          
          <div v-if="col.type === 'color'" class="flex items-center gap-2">
             <div 
               class="w-6 h-6 rounded-full border border-gray-200 shadow-sm" 
               :style="{ backgroundColor: item[col.key] }"
             ></div>
             <span class="text-xs text-gray-500 font-mono">{{ item[col.key] }}</span>
          </div>

          <span v-else>{{ item[col.key] }}</span>

        </template>

        <template #cell-status="{ item }">
          <BaseBadge 
            :variant="item.ativo ? 'success' : 'danger'" 
            show-dot
          >
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </BaseBadge>
        </template>

        <template #cell-actions="{ item }">
          <div class="flex justify-end gap-2">
            <BaseActionBtn action="edit" @click="abrirModalEdicao(item)" />
            <BaseActionBtn action="delete" @click="confirmarExclusao(item)" />
          </div>
        </template>

      </BaseTable>

      <template #pagination>
        <BasePagination 
          :page="page" 
          :total-pages="totalPages" 
          :first="first" 
          :last="last"
          @change-page="mudarPagina"
        />
      </template>

    </BaseListLayout>

    <BaseModal 
      :is-open="modalAberto" 
      :title="`${editando ? 'Editar' : 'Novo'} ${titulo}`"
      @close="fecharModal"
    >
      <form id="formAuxiliar" @submit.prevent="salvar" class="space-y-4">
        
        <div v-for="campo in camposConfig" :key="campo.key">
          
          <BaseInput 
            v-if="campo.type === 'text'"
            v-model="form[campo.key]"
            :label="campo.label"
            :required="campo.required"
          />

          <div v-else-if="campo.type === 'color'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ campo.label }} <span v-if="campo.required" class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-3">
              <input 
                v-model="form[campo.key]" 
                type="color" 
                class="h-10 w-20 p-1 border border-gray-300 rounded cursor-pointer" 
              />
              <span class="text-gray-600 font-mono text-sm uppercase">{{ form[campo.key] }}</span>
            </div>
          </div>

        </div>

        <BaseCheckbox 
          v-model="form.ativo" 
          label="Registro Ativo" 
        />
      </form>

      <template #footer>
        <BaseButton variant="outline" @click="fecharModal">Cancelar</BaseButton>
        <BaseButton type="submit" form="formAuxiliar" :loading="salvando">Salvar</BaseButton>
      </template>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { CampoConfig, PageResponse } from '../../../types/auxiliares';
import type { TableColumn } from '../../../types/table';
import { toast } from 'vue-sonner';

// Componentes Padronizados
import BaseListLayout from '../../layout/BaseListLayout.vue';
import BaseSearchFilter from '../../common/BaseSearchFilter.vue';
import BaseTable from '../../common/BaseTable.vue';
import BasePagination from '../../common/BasePagination.vue';
import BaseBadge from '../../common/BaseBadge.vue';
import BaseActionBtn from '../../common/BaseActionBtn.vue';
import BaseButton from '../../common/BaseButton.vue';
import BaseModal from '../../common/BaseModal.vue';
import BaseInput from '../../common/BaseInput.vue';
import BaseCheckbox from '../../common/BaseCheckbox.vue';

const props = defineProps<{
  titulo: string;
  camposConfig: CampoConfig[]; 
  listarAction: (page: number, size: number, termo: string) => Promise<PageResponse<any>>;
  criarAction: (dados: any) => Promise<any>;
  atualizarAction: (id: number, dados: any) => Promise<any>;
  excluirAction: (id: number) => Promise<any>;
}>();

// State
const items = ref<any[]>([]);
const loading = ref(false);
const salvando = ref(false);
const termoBusca = ref('');
const timeoutBusca = ref<number | null>(null);

// Paginação
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// Modal
const modalAberto = ref(false);
const editando = ref(false);
const idEmEdicao = ref<number | null>(null);
const form = ref<any>({});

// --- Transformação de Config para Colunas do BaseTable ---
const colunasTabela = computed<TableColumn[]>(() => {
  // Pega as colunas vindas da prop
  const cols = props.camposConfig
    .filter(c => c.listavel !== false)
    .map(c => ({
      key: c.key,
      label: c.label
    }));

  // Adiciona Status e Ações automaticamente
  return [
    ...cols,
    { key: 'status', label: 'Status', align: 'center', width: '100px' },
    { key: 'actions', label: 'Ações', align: 'right', width: '100px' }
  ];
});

// --- Métodos ---

const carregar = async () => {
  loading.value = true;
  try {
    const res = await props.listarAction(page.value, size.value, termoBusca.value);
    items.value = res.content;
    totalPages.value = res.totalPages;
    first.value = res.first;
    last.value = res.last;
  } catch (error) {
    console.error("Erro ao carregar dados", error);
    toast.error("Erro ao carregar lista.");
  } finally {
    loading.value = false;
  }
};

const handleBusca = () => {
  // O BaseSearchFilter já faz debounce no v-model ou enter no search
  // Se quiser debounce manual aqui:
  if (timeoutBusca.value) clearTimeout(timeoutBusca.value);
  timeoutBusca.value = setTimeout(() => {
    page.value = 0;
    carregar();
  }, 500) as unknown as number;
};

// Se o componente de busca já tiver botão de "Pesquisar", use direto:
const pesquisarAgora = () => {
  page.value = 0;
  carregar();
}

const mudarPagina = (novaPagina: number) => {
  page.value = novaPagina;
  carregar();
};

// --- Modal ---

const abrirModalCriacao = () => {
  editando.value = false;
  idEmEdicao.value = null;
  const novoForm: any = { ativo: true };
  props.camposConfig.forEach(c => {
    novoForm[c.key] = c.type === 'color' ? '#000000' : '';
  });
  form.value = novoForm;
  modalAberto.value = true;
};

const abrirModalEdicao = (item: any) => {
  editando.value = true;
  idEmEdicao.value = item.id;
  form.value = { ...item }; // Clona para não editar a tabela em tempo real
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
};

const salvar = async () => {
  salvando.value = true;
  try {
    if (editando.value && idEmEdicao.value) {
      await props.atualizarAction(idEmEdicao.value, form.value);
      toast.success('Registro atualizado!');
    } else {
      await props.criarAction(form.value);
      toast.success('Registro criado com sucesso!');
    }
    await carregar();
    fecharModal();
  } catch (error) {
    console.error(error);
    toast.error("Erro ao salvar dados.");
  } finally {
    salvando.value = false;
  }
};

const confirmarExclusao = async (item: any) => {
  if (confirm(`Deseja realmente excluir "${item.nome || item.descricao || 'este item'}"?`)) {
    try {
      await props.excluirAction(item.id);
      toast.success('Item excluído.');
      if (items.value.length === 1 && page.value > 0) page.value--;
      await carregar();
    } catch (error) {
      toast.error("Não é possível excluir este item (provavelmente em uso).");
    }
  }
};

// --- Hooks ---
onMounted(carregar);

// Recarrega se mudar a aba (prop listarAction mudou)
watch(() => props.listarAction, () => {
  page.value = 0;
  termoBusca.value = '';
  carregar();
});

// Watch no termoBusca se quiser busca automática pelo BaseSearchFilter (v-model)
watch(termoBusca, () => {
  handleBusca();
});
</script>