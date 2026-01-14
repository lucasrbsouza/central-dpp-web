<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      
      <thead>
        <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
          <th 
            v-for="col in columns" 
            :key="col.key"
            class="p-4 font-semibold"
            :class="[
              alignClass(col.align),
              col.width ? '' : 'flex-1' // Se não tiver largura, ocupa espaço
            ]"
            :style="{ width: col.width }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100">
        <tr 
          v-for="(item, rowIndex) in items" 
          :key="item.id || rowIndex"
          class="hover:bg-blue-50/40 transition group"
        >
          <td 
            v-for="col in columns" 
            :key="col.key"
            class="p-4 align-middle text-sm text-gray-700"
            :class="alignClass(col.align)"
          >
            <slot 
              :name="`cell-${col.key}`" 
              :item="item" 
              :value="getValue(item, col)"
              :index="rowIndex"
            >
              {{ getValue(item, col) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '../../types/table'; // Crie esse type ou defina aqui

const props = defineProps<{
  columns: TableColumn[];
  items: any[];
}>();

// Utilitário para pegar o valor, resolvendo formatadores
const getValue = (item: any, col: TableColumn) => {
  if (!col.prop) return '';
  const value = item[col.prop]; // Aqui você pode usar lodash.get para 'usuario.nome'
  if (col.formatter) {
    return col.formatter(value);
  }
  return value;
};

// Classes de alinhamento
const alignClass = (align?: string) => {
  switch (align) {
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
};
</script>
