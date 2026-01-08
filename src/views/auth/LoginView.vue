<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-piaui-blue">
      
      <div class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <span class="text-3xl">🏛️</span>
        </div>
        <h1 class="text-2xl font-bold text-piaui-blue">Central DPP</h1>
        <p class="text-gray-500 mt-2 text-sm">Diretoria de Pagamento de Pessoal</p>
      </div>

      <form @submit.prevent="handleLogin" class="p-8 pt-0 space-y-6">
        
        <div v-if="erro" class="bg-red-50 text-piaui-red p-3 rounded text-sm text-center border border-red-100">
          {{ erro }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail Institucional</label>
          <input 
            v-model="email"
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue focus:border-piaui-blue outline-none transition"
            placeholder="seu.nome@sead.pi.gov.br"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            v-model="senha"
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue focus:border-piaui-blue outline-none transition"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-piaui-blue text-white py-2.5 rounded-md hover:bg-opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          <span v-if="loading" class="animate-spin mr-2">⚪</span>
          {{ loading ? 'Entrando...' : 'Acessar Central' }}
        </button>

        <div class="text-center mt-4">
            <a href="#" class="text-sm text-piaui-green hover:underline">Esqueceu a senha?</a>
        </div>
      </form>
      
      <div class="bg-gray-50 p-4 text-center border-t border-gray-100">
        <p class="text-xs text-gray-400">Governo do Estado do Piauí</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const email = ref('');
const senha = ref('');
const loading = ref(false);
const erro = ref('');

const handleLogin = async () => {
  loading.value = true;
  erro.value = '';
  
  try {
    await authStore.login(email.value, senha.value);
  } catch (error) {
    erro.value = 'Falha ao entrar. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
};
</script>