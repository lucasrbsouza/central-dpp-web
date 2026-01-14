<template>
  <div class="bg-white rounded-lg shadow p-6 relative">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h3 class="text-lg font-bold text-gray-800">{{ titulo }}</h3>
      
      <div class="flex flex-1 w-full md:w-auto gap-3 justify-end">
        <div class="relative w-full md:w-64">
          <input 
            v-model="termoBusca"
            type="text" 
            placeholder="Buscar..." 
            class="pl-10 input-padrao w-full text-sm"
            @input="handleBusca"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <button @click="abrirModalCriacao" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm text-sm font-medium">
          <span>+ Novo</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto min-h-[300px]">
      <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 text-gray-600 text-sm uppercase">
            <th v-for="col in colunasVisiveis" :key="col.key" class="p-3 border-b">
              {{ col.label }}
            </th>
            <th class="p-3 border-b text-center w-24">Status</th>
            <th class="p-3 border-b text-right w-32">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-b hover:bg-gray-50 transition-colors">
            
            <td v-for="col in colunasVisiveis" :key="col.key" class="p-3 align-middle">
              <div v-if="col.type === 'color'" class="flex items-center gap-2">
                <div 
                  class="w-6 h-6 rounded-full border border-gray-200 shadow-sm" 
                  :style="{ backgroundColor: item[col.key] }"
                ></div>
                <span class="text-xs text-gray-500 uppercase">{{ item[col.key] }}</span>
              </div>
              <span v-else>{{ item[col.key] }}</span>
            </td>

            <td class="p-3 text-center align-middle">
              <span 
                class="px-2 py-1 rounded-full text-xs font-bold inline-block"
                :class="item.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            
            <td class="p-3 text-right space-x-2 align-middle">
              <button @click="abrirModalEdicao(item)" class="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
              <button @click="confirmarExclusao(item)" class="text-red-600 hover:text-red-800 font-medium text-sm">Excluir</button>
            </td>
          </tr>
          
          <tr v-if="!loading && items.length === 0">
            <td :colspan="colunasVisiveis.length + 2" class="p-8 text-center text-gray-500">
              Nenhum registro encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
      <span class="text-sm text-gray-600">
        Página <strong>{{ page + 1 }}</strong> de <strong>{{ totalPages }}</strong>
      </span>
      <div class="flex gap-2">
        <button 
          @click="mudarPagina(page - 1)" 
          :disabled="first"
          class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button 
          @click="mudarPagina(page + 1)" 
          :disabled="last"
          class="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>

    <div v-if="modalAberto" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <h4 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
          {{ editando ? 'Editar' : 'Novo' }} {{ titulo }}
        </h4>
        
        <form @submit.prevent="salvar">
          <div v-for="campo in camposConfig" :key="campo.key" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ campo.label }} <span v-if="campo.required" class="text-red-500">*</span>
            </label>
            
            <input 
              v-if="campo.type === 'text'"
              v-model="form[campo.key]" 
              type="text" 
              class="input-padrao w-full" 
              :required="campo.required"
            />

            <div v-else-if="campo.type === 'color'" class="flex items-center gap-3">
              <input 
                v-model="form[campo.key]" 
                type="color" 
                class="h-10 w-20 p-1 border rounded cursor-pointer" 
              />
              <span class="text-gray-600 font-mono text-sm">{{ form[campo.key] }}</span>
            </div>
          </div>
          
          <div class="mb-6 flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
            <input v-model="form.ativo" type="checkbox" id="ativoInput" class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label for="ativoInput" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none">Registro Ativo</label>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="fecharModal" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
              <span v-if="salvando" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { CampoConfig, PageResponse } from '../../../types/auxiliares';

const props = defineProps<{
  titulo: string;
  camposConfig: CampoConfig[]; // Configuração dos campos/colunas
  // Funções de serviço passadas pelo pai
  listarAction: (page: number, size: number, termo: string) => Promise<PageResponse<any>>;
  criarAction: (dados: any) => Promise<any>;
  atualizarAction: (id: number, dados: any) => Promise<any>;
  excluirAction: (id: number) => Promise<any>;
}>();

// State da Tabela
const items = ref<any[]>([]);
const loading = ref(false);
const salvando = ref(false);
const termoBusca = ref('');
const timeoutBusca = ref<number | null>(null);

// State da Paginação
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);
const first = ref(true);
const last = ref(true);

// State do Modal
const modalAberto = ref(false);
const editando = ref(false);
const idEmEdicao = ref<number | null>(null);
const form = ref<any>({});

// Computeds
const colunasVisiveis = computed(() => props.camposConfig.filter(c => c.listavel !== false));

// --- Métodos de Dados ---

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
    // Aqui poderia entrar um Toast de erro
  } finally {
    loading.value = false;
  }
};

// Debounce para a busca
const handleBusca = () => {
  if (timeoutBusca.value) clearTimeout(timeoutBusca.value);
  timeoutBusca.value = setTimeout(() => {
    page.value = 0; // Resetar para primeira página ao buscar
    carregar();
  }, 500) as unknown as number;
};

const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 0 && novaPagina < totalPages.value) {
    page.value = novaPagina;
    carregar();
  }
};

// --- Métodos do Modal ---

const abrirModalCriacao = () => {
  editando.value = false;
  idEmEdicao.value = null;
  // Resetar form baseado na config + default ativo
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
  // Copiar dados para o form
  form.value = { ...item };
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
    } else {
      await props.criarAction(form.value);
    }
    await carregar();
    fecharModal();
  } catch (error) {
    alert("Erro ao salvar. Verifique se os dados são válidos.");
  } finally {
    salvando.value = false;
  }
};

const confirmarExclusao = async (item: any) => {
  if (confirm(`Deseja realmente excluir "${item.nome || 'este registro'}"?`)) {
    loading.value = true;
    try {
      await props.excluirAction(item.id);
      // Se era o último item da página, voltar uma página
      if (items.value.length === 1 && page.value > 0) {
        page.value--;
      }
      await carregar();
    } catch (error) {
      alert("Não é possível excluir este item pois ele está vinculado a outros registros.");
    } finally {
      loading.value = false;
    }
  }
};

// Hooks
onMounted(carregar);

// Watcher para recarregar se o serviço mudar (ex: troca de aba mantendo componente)
watch(() => props.listarAction, () => {
  page.value = 0;
  termoBusca.value = '';
  carregar();
});
</script>