<template>
  <button 
    type="button"
    class="rounded-md transition duration-200 flex items-center justify-center border border-transparent"
    :class="[
      loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      // Se tiver slot (texto), usa padding maior, senão usa p-1 (quadrado)
      hasSlotContent ? 'px-3 py-1 gap-2' : 'p-1', 
      colorClasses
    ]"
    :title="computedLabel"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    
    <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <slot v-else>
      <component 
        :is="computedIcon" 
        class="h-5 w-5" 
      />
    </slot>

  </button>
</template>

<script setup lang="ts">
import { computed, useSlots, type Component } from 'vue';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline';

// Definição dos tipos
type ActionType = 'edit' | 'delete' | 'view' | 'block' | 'activate' | 'restore';

const props = defineProps<{
  action?: ActionType;
  label?: string;        // Texto do tooltip
  icon?: Component;      // NOVO: Ícone customizado (sobrescreve o da action)
  color?: string;        // Classes de cor manuais
  loading?: boolean;
  disabled?: boolean;
}>();

defineEmits(['click']);

const slots = useSlots();
// Verifica se algo foi passado dentro do componente (<BaseBtn>Texto</BaseBtn>)
const hasSlotContent = computed(() => !!slots.default);

const config = {
  edit: {
    icon: PencilSquareIcon,
    label: 'Editar',
    class: 'text-gray-400 hover:text-piaui-blue hover:bg-blue-50'
  },
  delete: {
    icon: TrashIcon,
    label: 'Excluir',
    class: 'text-gray-400 hover:text-piaui-red hover:bg-red-50'
  },
  view: {
    icon: EyeIcon,
    label: 'Visualizar',
    class: 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
  },
  block: {
    icon: XMarkIcon,
    label: 'Bloquear',
    class: 'text-gray-400 hover:text-piaui-red hover:bg-red-50'
  },
  activate: {
    icon: CheckCircleIcon,
    label: 'Ativar',
    class: 'text-gray-400 hover:text-piaui-green hover:bg-green-50'
  },
  restore: {
    icon: ArrowPathIcon,
    label: 'Restaurar',
    class: 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
  }
};

const computedIcon = computed(() => {
  if (props.icon) return props.icon; // 1. Prioridade para prop 'icon'
  if (props.action && config[props.action]) return config[props.action].icon; // 2. Configuração
  return PencilSquareIcon; // 3. Fallback
});

const computedLabel = computed(() => {
  if (props.label) return props.label;
  if (props.action && config[props.action]) return config[props.action].label;
  return '';
});

const colorClasses = computed(() => {
  if (props.color) return props.color;
  if (props.action && config[props.action]) return config[props.action].class;
  return 'text-gray-400 hover:text-piaui-blue hover:bg-gray-50';
});
</script>