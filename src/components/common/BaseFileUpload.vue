<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center transition hover:bg-gray-50 hover:border-piaui-blue cursor-pointer"
      :class="{ 'border-red-500 bg-red-50': error }"
      @click="triggerInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input 
        type="file" 
        ref="fileInputRef" 
        class="hidden" 
        @change="handleFileChange"
        :accept="accept"
      />
      
      <div v-if="!modelValue">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-1 text-sm text-gray-600">
          <span class="font-medium text-piaui-blue hover:text-blue-500">Clique para enviar</span> ou arraste e solte
        </p>
        <p class="mt-1 text-xs text-gray-500">{{ helpText || 'PDF, DOC, DOCX ou Imagens até 10MB' }}</p>
      </div>

      <div v-else class="flex items-center gap-3 w-full max-w-xs bg-white border border-gray-200 p-2 rounded shadow-sm">
        <div class="bg-blue-100 p-2 rounded text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-medium text-gray-900 truncate">{{ modelValue.name }}</p>
          <p class="text-xs text-gray-500">{{ (modelValue.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
        <button @click.stop="removeFile" class="text-gray-400 hover:text-red-500">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
    
    <span v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  label?: string;
  modelValue: File | null;
  required?: boolean;
  error?: string;
  accept?: string;
  helpText?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerInput = () => fileInputRef.value?.click();

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    emit('update:modelValue', target.files[0]);
  }
};

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    emit('update:modelValue', e.dataTransfer.files[0]);
  }
};

const removeFile = () => {
  emit('update:modelValue', null);
  if (fileInputRef.value) fileInputRef.value.value = '';
};
</script>