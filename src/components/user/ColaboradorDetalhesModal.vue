<template>
  <div class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative">
      
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10 transition-colors"
      >
        &times;
      </button>

      <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center relative">
        <div class="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-3">
          <img 
            v-if="fotoUrl" 
            :src="fotoUrl" 
            class="w-full h-full rounded-full object-cover" 
            alt="Foto"
          >
          <div v-else class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
            {{ getIniciais(colaborador.nome, colaborador.sobrenome) }}
          </div>
        </div>
        
        <h3 class="text-white text-xl font-bold">{{ colaborador.nome }} {{ colaborador.sobrenome }}</h3>
        <p class="text-blue-200 text-sm font-medium">{{ colaborador.cargo }}</p>
      </div>

      <div class="p-6 space-y-4">
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Setor / Equipe</p>
            <p class="text-sm font-semibold text-gray-800">{{ colaborador.equipe?.nome || 'Não vinculado' }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Matrícula</p>
            <p class="text-sm font-semibold text-gray-800">{{ colaborador.matricula }}</p>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <div class="flex items-center gap-3 text-sm">
            <span class="w-6 text-center text-xl"><EnvelopeIcon class="w-4 h-4" /></span>
            <span v-if="colaborador.email" class="text-gray-700 font-medium truncate" :title="colaborador.email">
              {{ colaborador.email }}
            </span>
            <span v-else class="text-gray-400 italic">Email não disponível</span>
          </div>

          <div class="flex items-center gap-3 text-sm">
            <span class="w-6 text-center text-xl"><PhoneIcon class="w-4 h-4" /></span>
            <span v-if="colaborador.telefone" class="text-gray-700 font-medium">{{ colaborador.telefone }}</span>
            <span v-else class="text-gray-400 italic">Telefone não informado</span>
          </div>
          
          <div class="flex items-center gap-3 text-sm">
            <span class="w-6 text-center text-xl"><CakeIcon class="w-4 h-4" /></span>
            <span v-if="colaborador.dataDeNascimento" class="text-gray-700 font-medium">{{ formatarData(colaborador.dataDeNascimento) }}</span>
            <span v-else class="text-gray-400 italic">Data não informada</span>
          </div>
        </div>

        <div v-if="colaborador.atribuicao" class="pt-4 border-t border-gray-100 mt-4">
          <p class="text-xs text-gray-400 uppercase font-bold mb-1">Atribuições</p>
          <p class="text-sm text-gray-600 leading-relaxed">{{ colaborador.atribuicao }}</p>
        </div>

      </div>
      
      <div class="bg-gray-50 p-4 text-center border-t border-gray-100">
        <button @click="$emit('close')" class="text-piaui-blue font-bold text-sm hover:underline">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';
import api from '../../services/api';
import type { ColaboradorRespostaDTO } from '../../types/colaborador';
import { getIniciais, formatarData } from '../../utils/formatters'; 
import { CakeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  colaborador: ColaboradorRespostaDTO;
}>();

const emit = defineEmits(['close']);
const fotoUrl = ref<string | null>(null);

const fetchFoto = async () => {
  if (fotoUrl.value) URL.revokeObjectURL(fotoUrl.value);
  fotoUrl.value = null;

  try {
    const response = await api.get(`/colaboradores/${props.colaborador.id}/foto`, { responseType: 'blob' });
    fotoUrl.value = URL.createObjectURL(response.data);
  } catch (e) {
    // Foto não encontrada
  }
};

watch(() => props.colaborador, fetchFoto, { immediate: true });

onUnmounted(() => {
  if (fotoUrl.value) URL.revokeObjectURL(fotoUrl.value);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>