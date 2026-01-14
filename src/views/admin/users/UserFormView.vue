<template>
  <div>
    <BaseFormLayout 
      max-width="xl" 
      :loading="salvando" 
      @submit="salvar"
    >
      
      <template #header>
        <PageHeader 
          :title="isEdicao ? 'Editar Usuário' : 'Novo Cadastro Unificado'"
          :subtitle="isEdicao ? 'Gerencie as permissões de acesso.' : 'Cadastre o colaborador e crie o login em um único passo.'"
        >
          <template #back-button>
            <router-link 
              to="/admin/usuarios" 
              class="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition mr-2"
              title="Voltar"
            >
              <ArrowLeftIcon class="w-5 h-5"/>
            </router-link>
          </template>
        </PageHeader>
      </template>

      <div class="space-y-8">
        
        <div v-if="!isEdicao">
          <h3 class="text-lg font-bold text-piaui-blue border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
            <UserIcon class="h-5 w-5" /> Dados do Colaborador
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BaseInput 
              v-model="form.matricula" 
              label="Matrícula" 
              placeholder="Ex: 123456-X" 
              required 
            />
            <BaseInput 
              v-model="form.nome" 
              label="Nome" 
              placeholder="Ex: Maria" 
              required 
            />
            <BaseInput 
              v-model="form.sobrenome" 
              label="Sobrenome" 
              placeholder="Ex: Silva" 
              required 
            />
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-piaui-blue border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
            <KeyIcon class="h-5 w-5" /> Dados de Acesso
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BaseInput 
              v-model="form.email" 
              type="email" 
              label="E-mail Institucional" 
              placeholder="nome.sobrenome@sead.pi.gov.br" 
              required 
            />
            
            <BaseInput 
              v-if="!isEdicao" 
              v-model="form.senha" 
              label="Senha Inicial" 
              placeholder="Mínimo 6 caracteres" 
              required 
              minlength="6"
              class="font-mono"
            />
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
      </div>

      <template #actions>
        <BaseButton 
          variant="outline" 
          @click="$router.push('/admin/usuarios')"
        >
          Cancelar
        </BaseButton>
        
        <BaseButton 
          type="submit" 
          :loading="salvando"
        >
          {{ isEdicao ? 'Salvar Alterações' : 'Cadastrar Usuário' }}
        </BaseButton>
      </template>

    </BaseFormLayout>

    <div v-if="usuarioCriado" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in">
        <div class="bg-piaui-green p-6 text-center">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg text-piaui-green">
            <CheckIcon class="w-8 h-8" />
          </div>
          <h3 class="text-white text-xl font-bold">Cadastro Realizado!</h3>
        </div>

        <div class="p-6">
          <p class="text-gray-600 text-sm mb-4 text-center">Utilize o botão abaixo para copiar os dados.</p>
          
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">E-mail</label>
              <div class="font-mono text-lg font-medium">{{ usuarioCriado.email }}</div>
            </div>
            <div class="border-t border-gray-200 pt-3">
              <label class="text-xs font-bold text-gray-500 uppercase">Senha</label>
              <div class="text-piaui-blue font-mono text-xl font-bold">{{ form.senha }}</div>
            </div>
          </div>

          <button 
            @click="copiarCredenciais"
            class="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all"
            :class="copiado ? 'bg-green-100 text-green-700' : 'bg-piaui-blue text-white hover:bg-blue-800'"
          >
            <ClipboardIcon v-if="!copiado" class="h-5 w-5" />
            <CheckIcon v-else class="h-5 w-5" />
            {{ copiado ? 'Copiado!' : 'Copiar Dados' }}
          </button>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button @click="fecharModal" class="text-gray-500 hover:underline text-sm">Fechar</button>
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

// Componentes Novos
import PageHeader from '../../../components/common/PageHeader.vue';
import BaseFormLayout from '../../../components/layout/BaseFormLayout.vue';
import BaseInput from '../../../components/common/BaseInput.vue';
import BaseButton from '../../../components/common/BaseButton.vue';

// Ícones
import { UserIcon, CheckIcon, ClipboardIcon, ArrowLeftIcon, KeyIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

// Estado
const isEdicao = computed(() => route.params.id !== undefined);
const salvando = ref(false);
const usuarioCriado = ref<UsuarioResponse | null>(null);
const copiado = ref(false);

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
    alert('Funcionalidade de edição em desenvolvimento.');
    router.push('/admin/usuarios');
  }
});

const salvar = async () => {
  salvando.value = true;
  try {
    const { data } = await api.post<UsuarioResponse>('/usuarios', form.value);
    usuarioCriado.value = data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erro desconhecido.';
    alert(`Erro ao cadastrar: ${msg}`);
  } finally {
    salvando.value = false;
  }
};

const copiarCredenciais = async () => {
  if (!usuarioCriado.value) return;
  const msg = `Login Central DPP:\nEmail: ${usuarioCriado.value.email}\nSenha: ${form.value.senha}`;
  
  try {
    await navigator.clipboard.writeText(msg);
    copiado.value = true;
    setTimeout(() => copiado.value = false, 3000);
  } catch (err) {
    alert('Erro ao copiar.');
  }
};

const fecharModal = () => {
  usuarioCriado.value = null;
  router.push('/admin/usuarios');
};
</script>

<style scoped>
/* Animação simples para o modal */
.animate-bounce-in {
  animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes bounce-in {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>