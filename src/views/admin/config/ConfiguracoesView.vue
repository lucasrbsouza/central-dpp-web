<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Cadastros Auxiliares</h1>
        <p class="text-gray-600 mt-1">Gerencie as listas de opções utilizadas nos formulários do sistema.</p>
      </div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="abaAtual = tab.id"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none"
          :class="[
            abaAtual === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.nome }}
        </button>
      </nav>
    </div>

    <div class="mt-6 transition-all duration-300">
      
      <GerenciadorAuxiliar
        v-if="abaAtual === 'cargos'"
        titulo="Cargos"
        :campos-config="[
          { key: 'nome', label: 'Nome do Cargo', type: 'text', required: true }
        ]"
        :listar-action="service.listarCargos"
        :criar-action="service.criarCargo"
        :atualizar-action="service.atualizarCargo"
        :excluir-action="service.excluirCargo"
      />

      <GerenciadorAuxiliar
        v-if="abaAtual === 'escolaridades'"
        titulo="Níveis de Escolaridade"
        :campos-config="[
          { key: 'nome', label: 'Descrição', type: 'text', required: true }
        ]"
        :listar-action="service.listarEscolaridades"
        :criar-action="service.criarEscolaridade"
        :atualizar-action="service.atualizarEscolaridade"
        :excluir-action="service.excluirEscolaridade"
      />

      <GerenciadorAuxiliar
        v-if="abaAtual === 'formacoes'"
        titulo="Áreas de Formação"
        :campos-config="[
          { key: 'nome', label: 'Nome da Área', type: 'text', required: true }
        ]"
        :listar-action="service.listarFormacoes"
        :criar-action="service.criarFormacao"
        :atualizar-action="service.atualizarFormacao"
        :excluir-action="service.excluirFormacao"
      />

      <GerenciadorAuxiliar
        v-if="abaAtual === 'eventos'"
        titulo="Tipos de Eventos"
        :campos-config="[
          { key: 'nome', label: 'Nome do Tipo', type: 'text', required: true },
          { key: 'cor', label: 'Cor da Etiqueta', type: 'color', required: true }
        ]"
        :listar-action="service.listarTiposEventos"
        :criar-action="service.criarTipoEvento"
        :atualizar-action="service.atualizarTipoEvento"
        :excluir-action="service.excluirTipoEvento"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AuxiliaresService from '../../../services/AuxiliaresService';
import GerenciadorAuxiliar from '../../../components/admin/config/GerenciadorAuxiliar.vue';

// Estado da Aba Atual
const abaAtual = ref('cargos');

// Definição das Abas
const tabs = [
  { id: 'cargos', nome: 'Cargos' },
  { id: 'escolaridades', nome: 'Escolaridade' },
  { id: 'formacoes', nome: 'Formação' },
  { id: 'eventos', nome: 'Tipos de Eventos' },
];

const service = AuxiliaresService;
</script>