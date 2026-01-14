<template>
  <div class="max-w-5xl mx-auto relative">
    
    <div class="flex items-center gap-4 mb-8">
      <router-link 
        to="/admin/usuarios" 
        class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition"
        title="Voltar para lista"
      >
        ⬅
      </router-link>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isEdicao ? 'Editar Usuário' : 'Novo Cadastro Unificado' }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ isEdicao ? 'Gerencie as permissões de acesso.' : 'Cadastre o colaborador e crie o login em um único passo.' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <form @submit.prevent="salvar" class="space-y-8">
        
        <div v-if="!isEdicao">
          <h3 class="text-lg font-bold text-piaui-blue border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
            <UserIcon class="h-5 w-5" /> Dados do Colaborador
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Matrícula <span class="text-red-500">*</span></label>
              <input v-model="form.matricula" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="Ex: 123456-X">
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
              <input v-model="form.nome" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="Ex: Maria">
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sobrenome <span class="text-red-500">*</span></label>
              <input v-model="form.sobrenome" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="Ex: Silva Santos">
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-piaui-blue border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
            Dados de Acesso
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">E-mail Institucional <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none" placeholder="nome.sobrenome@sead.pi.gov.br">
            </div>
            <div v-if="!isEdicao">
              <label class="block text-sm font-medium text-gray-700 mb-1">Senha Inicial <span class="text-red-500">*</span></label>
              <input v-model="form.senha" type="text" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none font-mono" placeholder="Mínimo 6 caracteres">
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label class="block text-sm font-bold text-gray-700 mb-3">Perfil de Acesso <span class="text-red-500">*</span></label>
            <div class="flex flex-col sm:flex-row gap-4">
              <label class="flex items-center p-3 bg-white border rounded-lg hover:border-piaui-blue cursor-pointer transition flex-1 shadow-sm">
                <input type="checkbox" value="ROLE_ADMIN" v-model="form.roles" class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue">
                <div class="ml-3">
                  <span class="block text-sm font-bold text-gray-800">Administrador</span>
                  <span class="block text-xs text-gray-500">Gestão total do sistema.</span>
                </div>
              </label>
              <label class="flex items-center p-3 bg-white border rounded-lg hover:border-piaui-blue cursor-pointer transition flex-1 shadow-sm">
                <input type="checkbox" value="ROLE_GESTOR" v-model="form.roles" class="w-5 h-5 text-piaui-blue rounded focus:ring-piaui-blue">
                <div class="ml-3">
                  <span class="block text-sm font-bold text-gray-800">Gestor</span>
                  <span class="block text-xs text-gray-500">Publica avisos e documentos.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <router-link to="/admin/usuarios" class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</router-link>
          <button type="submit" :disabled="salvando" class="px-8 py-2 bg-piaui-blue text-white rounded-md hover:bg-blue-800 transition shadow-lg hover:shadow-xl flex items-center disabled:opacity-50">
            <span v-if="salvando" class="animate-spin mr-2">⚪</span>
            {{ salvando ? 'Processando...' : (isEdicao ? 'Salvar Alterações' : 'Cadastrar Usuário') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="usuarioCriado" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in">
        
        <div class="bg-piaui-green p-6 text-center">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg text-piaui-green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-white text-xl font-bold">Cadastro Realizado!</h3>
          <p class="text-green-100 text-sm">O login foi criado com sucesso.</p>
        </div>

        <div class="p-6">
          <p class="text-gray-600 text-sm mb-4 text-center">
            Verifique os dados abaixo e utilize o botão para copiar e enviar ao colaborador.
          </p>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4 relative group">
            
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">E-mail de Acesso</label>
              <div class="text-gray-900 font-mono text-lg font-medium break-all">
                {{ usuarioCriado.email }}
              </div>
            </div>

            <div class="border-t border-gray-200 pt-3">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Senha Inicial</label>
              <div class="text-piaui-blue font-mono text-xl font-bold tracking-wider">
                {{ form.senha }}
              </div>
            </div>

            <div class="text-xs text-gray-400 italic mt-2">
              * O usuário deverá alterar esta senha no primeiro acesso.
            </div>
          </div>

          <button 
            @click="copiarCredenciais"
            class="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all duration-300 transform active:scale-95"
            :class="copiado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-piaui-blue text-white hover:bg-blue-800 shadow-md hover:shadow-lg'"
          >
            <span v-if="copiado" class="flex items-center gap-2">
              <CheckIcon class="h-5 w-5" /> Dados Copiados!
            </span>
            <span v-else class="flex items-center gap-2">
              <ClipboardIcon class="h-5 w-5" /> Copiar Mensagem Pronta
            </span>
          </button>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button @click="fecharModal" class="text-gray-500 hover:text-gray-800 text-sm font-medium hover:underline">
            Fechar e voltar para a lista
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api';
import type { CadastroUsuarioSimplificado, UsuarioResponse } from '../../../types/user';
import { UserIcon, CheckIcon, ClipboardIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

// Estado
const isEdicao = computed(() => route.params.id !== undefined);
const salvando = ref(false);
const usuarioCriado = ref<UsuarioResponse | null>(null);
const copiado = ref(false); // Controle do feedback de cópia

// Formulário
const form = ref<CadastroUsuarioSimplificado>({
  nome: '',
  sobrenome: '',
  matricula: '',
  email: '',
  senha: '',
  roles: [] 
});

onMounted(async () => {
  if (isEdicao.value) {
    alert('Edição ainda não adaptada.');
    router.push('/admin/usuarios');
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    const payload = { ...form.value };
    const { data } = await api.post<UsuarioResponse>('/usuarios', payload);
    usuarioCriado.value = data; // Abre o modal
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    const msg = error.response?.data?.message || 'Verifique se o e-mail ou matrícula já existem.';
    alert(`Erro ao cadastrar: ${msg}`);
  } finally {
    salvando.value = false;
  }
};

// Lógica de Cópia Inteligente
const copiarCredenciais = async () => {
  if (!usuarioCriado.value) return;

  // Monta a mensagem formatada
  const mensagem = `Olá ${form.value.nome},
Esses são seus dados de login da Central DPP:
Email: ${usuarioCriado.value.email}
Senha: ${form.value.senha}`;

  try {
    // API da área de transferência
    await navigator.clipboard.writeText(mensagem);
    
    // Feedback visual
    copiado.value = true;
    setTimeout(() => {
      copiado.value = false;
    }, 3000); // Volta ao normal após 3 segundos
  } catch (err) {
    console.error('Falha ao copiar:', err);
    alert('Não foi possível copiar automaticamente. Por favor, selecione e copie manualmente.');
  }
};

const fecharModal = () => {
  usuarioCriado.value = null;
  copiado.value = false;
  router.push('/admin/usuarios');
};
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>