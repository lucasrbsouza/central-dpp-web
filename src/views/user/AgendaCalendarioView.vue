<template>
  <div class="h-full flex flex-col">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Agenda da Equipe</h2>
        <p class="text-gray-600 mt-1">Visualize reuniões, eventos e datas importantes.</p>
      </div>
      
      <button 
        @click="recarregarTudo" 
        class="text-sm text-blue-600 hover:underline flex items-center gap-1"
        :disabled="loading"
      >
        <ArrowPathIcon class="w-4 h-4" /> Atualizar
      </button>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex-1 calendar-container relative">
      
      <div v-if="loading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
      </div>

      <FullCalendar :options="calendarOptions" class="h-full" />
    </div>

    <div class="mt-6 flex flex-wrap gap-4 justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
      <span class="text-xs font-bold uppercase text-gray-400 self-center mr-2">Legenda:</span>
      <div 
        v-for="tipo in store.tiposEventos" 
        :key="tipo.id" 
        v-show="tipo.ativo"
        class="flex items-center gap-2 text-sm text-gray-600"
      >
        <span class="w-3 h-3 rounded-full shadow-sm" :style="{ backgroundColor: tipo.cor }"></span> 
        {{ tipo.nome }}
      </div>
    </div>

    <div v-if="eventoSelecionado" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" @click.self="fecharModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        <div 
          class="p-4 text-white flex justify-between items-start shadow-md"
          :style="{ backgroundColor: getCorEvento(eventoSelecionado.extendedProps.tipo) }"
        >
          <div>
            <p class="text-xs font-bold uppercase opacity-90 tracking-wider">
              {{ eventoSelecionado.extendedProps.tipo }}
            </p>
            <h3 class="text-xl font-bold leading-tight mt-1">{{ eventoSelecionado.title }}</h3>
          </div>
          <button @click="fecharModal" class="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div class="p-6 space-y-5">
          <div class="flex items-start gap-3 text-gray-700">
            <span class="text-2xl mt-1">📅</span>
            <div class="space-y-1">
              <p class="text-sm">
                <span class="font-bold text-gray-900">Início:</span> 
                {{ formatarDataFull(eventoSelecionado.start) }}
              </p>
              <p class="text-sm">
                <span class="font-bold text-gray-900">Fim:</span> 
                {{ formatarDataFull(eventoSelecionado.end || eventoSelecionado.start) }}
              </p>
            </div>
          </div>

          <div v-if="eventoSelecionado.extendedProps.equipeNome || eventoSelecionado.extendedProps.colaboradorNome" class="flex items-start gap-3 text-gray-700 border-t border-gray-100 pt-4">
            <span class="text-2xl mt-1">👥</span>
            <div class="space-y-1 text-sm">
              <p v-if="eventoSelecionado.extendedProps.equipeNome">
                <span class="font-bold text-gray-900">Equipe:</span> {{ eventoSelecionado.extendedProps.equipeNome }}
              </p>
              <p v-if="eventoSelecionado.extendedProps.colaboradorNome">
                 <span class="font-bold text-gray-900">Responsável:</span> {{ eventoSelecionado.extendedProps.colaboradorNome }}
              </p>
            </div>
          </div>

          <div v-if="eventoSelecionado.extendedProps.descricao" class="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-200 leading-relaxed">
            {{ eventoSelecionado.extendedProps.descricao }}
          </div>
          <p v-else class="text-sm text-gray-400 italic text-center py-2">Sem descrição detalhada.</p>
        </div>

        <div class="p-4 bg-gray-50 text-right border-t border-gray-100">
          <button @click="fecharModal" class="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api';
import { useAuxiliaresStore } from '../../stores/auxiliares';
import type { EventoDTO, Page } from '../../types/evento';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

// Store
const store = useAuxiliaresStore();

// State
const loading = ref(true);
const eventoSelecionado = ref<any>(null);

// FullCalendar Config
const calendarOptions = reactive({
  plugins: [
    dayGridPlugin, 
    timeGridPlugin, 
    listPlugin, 
    multiMonthPlugin, 
    interactionPlugin
  ],
  initialView: 'dayGridMonth',
  locale: ptBrLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'multiMonthYear,dayGridMonth,timeGridWeek,listWeek' 
  },
  buttonText: {
    today: 'Hoje',
    year: 'Ano',
    month: 'Mês',
    week: 'Semana',
    list: 'Lista'
  },
  multiMonthMaxColumns: 4,
  events: [] as any[],
  eventClick: handleEventClick,
  editable: false,
  height: 'auto',
  dayMaxEvents: true,
  allDaySlot: true,
});

// Métodos

const getCorEvento = (tipo: string) => {
  return store.mapaCoresEventos[tipo] || '#3B82F6'; // Azul padrão se não achar
};

const fetchEventos = async () => {
  try {
    // Busca 500 eventos (ajuste conforme necessidade ou implemente lazy loading real do FullCalendar via function events)
    const { data } = await api.get<Page<EventoDTO>>('/eventos?size=500&sort=dataInicio,desc');
    
    calendarOptions.events = data.content.map(evento => {
      const cor = getCorEvento(evento.tipo);
      return {
        id: String(evento.id),
        title: evento.titulo,
        start: evento.dataInicio,
        end: evento.dataFim,
        backgroundColor: cor,
        borderColor: cor,
        extendedProps: {
          descricao: evento.descricao,
          tipo: evento.tipo,
          equipeNome: evento.equipeNome,           // DTO precisa ter esse campo
          colaboradorNome: evento.colaboradorNome  // DTO precisa ter esse campo
        }
      };
    });

  } catch (error) {
    console.error('Erro ao carregar calendário:', error);
  }
};

const recarregarTudo = async () => {
  loading.value = true;
  await Promise.all([
    store.forceRefresh(), // Força recarga das cores caso tenha mudado
    fetchEventos()
  ]);
  loading.value = false;
};

function handleEventClick(info: any) {
  eventoSelecionado.value = info.event;
}

const fecharModal = () => {
  eventoSelecionado.value = null;
};

const formatarDataFull = (date: Date | string) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  loading.value = true;
  // Carrega configurações (cores) e eventos em paralelo
  await Promise.all([
    store.buscarDadosSeNecessario(),
    fetchEventos()
  ]);
  loading.value = false;
});
</script>

<style>
/* CSS Global do Calendário */
.fc-toolbar-title {
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  text-transform: capitalize;
  color: #1f2937;
}
.fc-button-primary {
  background-color: #093089 !important;
  border-color: #093089 !important;
  font-weight: 500 !important;
}
.fc-button-primary:hover {
  background-color: #07256e !important;
}
.fc-button-active {
  background-color: #fdb913 !important;
  border-color: #fdb913 !important;
  color: #093089 !important;
  font-weight: 700 !important;
}
.fc-event {
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  font-size: 0.85em;
  padding: 1px 2px;
}
/* Melhora a leitura dos links dos dias */
a.fc-col-header-cell-cushion {
  text-decoration: none;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
a.fc-daygrid-day-number {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
}

/* Animação do Modal */
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>