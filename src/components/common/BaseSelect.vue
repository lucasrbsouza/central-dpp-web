<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} 
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-piaui-blue outline-none appearance-none bg-white transition disabled:bg-gray-100 disabled:text-gray-500"
        :class="{ 'border-red-500 focus:ring-red-200': error }"
        :disabled="$attrs.disabled as boolean"
        v-bind="$attrs"
      >
        <option value="" disabled selected>{{ placeholder || 'Selecione...' }}</option>
        
        <option 
          v-for="opt in normalizedOptions" 
          :key="String(opt.value)" 
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>

    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Aceita string[] ou objetos { label, value } ou { id, nome }
interface OptionItem {
  label: string;
  value: string | number | null;
}

const props = defineProps<{
  label?: string;
  modelValue: string | number | null | undefined;
  options: any[]; // Flexível para aceitar vários formatos
  required?: boolean;
  placeholder?: string;
  error?: string;
  // Nomes das chaves para mapear objetos diferentes (ex: id/nome vs value/label)
  optionLabel?: string;
  optionValue?: string;
}>();

defineEmits(['update:modelValue']);

// Normaliza as opções para sempre ter { label, value }
const normalizedOptions = computed<OptionItem[]>(() => {
  return props.options.map(opt => {
    // Se for string simples
    if (typeof opt !== 'object') {
      return { label: opt, value: opt };
    }
    // Se for objeto, usa as props de mapeamento ou defaults
    const labelKey = props.optionLabel || 'label';
    const valueKey = props.optionValue || 'value';
    
    // Fallback para id/nome se não achar label/value e não tiver config
    const finalLabel = opt[labelKey] || opt['nome'] || opt['titulo'];
    const finalValue = opt[valueKey] !== undefined ? opt[valueKey] : opt['id'];

    return { label: finalLabel, value: finalValue };
  });
});
</script>