<template>
  <div class="h-full flex flex-col">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Agenda da Equipe</h2>
        <p class="text-gray-600 mt-1">Visualize reuniões, eventos e datas importantes.</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex-1 calendar-container">
      
      <div v-if="loading" class="h-96 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-piaui-blue"></div>
      </div>

      <FullCalendar v-else :options="calendarOptions" class="h-full" />
    </div>

    <div class="mt-6 flex flex-wrap gap-4 justify-center">
      <div 
        v-for="(style, tipo) in styles" 
        :key="tipo" 
        class="flex items-center gap-2 text-sm text-gray-600"
      >
        <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: style.color }"></span> 
        {{ style.label }}
      </div>
    </div>

    <div v-if="eventoSelecionado" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="fecharModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        
        <div :class="['p-4 text-white flex justify-between items-start', getEventHeaderClass(eventoSelecionado.extendedProps.tipo)]">
          <div>
            <p class="text-xs font-bold uppercase opacity-90">{{ getEventLabel(eventoSelecionado.extendedProps.tipo) }}</p>
            <h3 class="text-xl font-bold leading-tight">{{ eventoSelecionado.title }}</h3>
          </div>
          <button @click="fecharModal" class="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3 text-gray-700">
            <span class="text-2xl">📅</span>
            <div>
              <p class="text-sm font-bold">Início: <span class="font-normal">{{ formatarDataFull(eventoSelecionado.start) }}</span></p>
              <p class="text-sm font-bold">Fim: <span class="font-normal">{{ formatarDataFull(eventoSelecionado.end || eventoSelecionado.start) }}</span></p>
            </div>
          </div>

          <div v-if="eventoSelecionado.extendedProps.descricao" class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100">
            {{ eventoSelecionado.extendedProps.descricao }}
          </div>
          <p v-else class="text-sm text-gray-400 italic">Sem descrição detalhada.</p>
        </div>

        <div class="p-4 bg-gray-50 text-right">
          <button @click="fecharModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-bold">
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
import type { EventoDTO, Page } from '../../types/evento';

// Importação das configurações de Cores
import { EVENT_STYLES, getEventColor, getEventHeaderClass, getEventLabel } from '../../utils/eventStyles';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth'; // <--- NOVO PLUGIN
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

const loading = ref(true);
const eventoSelecionado = ref<any>(null);
const styles = EVENT_STYLES; // Para usar no v-for da legenda

const calendarOptions = reactive({
  plugins: [
    dayGridPlugin, 
    timeGridPlugin, 
    listPlugin, 
    multiMonthPlugin, // <--- Registra o plugin
    interactionPlugin
  ],
  initialView: 'dayGridMonth',
  locale: ptBrLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    // Adicionei 'multiMonthYear' aqui
    right: 'multiMonthYear,dayGridMonth,timeGridWeek,listWeek' 
  },
  buttonText: {
    today: 'Hoje',
    year: 'Ano', // Texto do botão
    month: 'Mês',
    week: 'Semana',
    list: 'Lista'
  },
  // Configuração específica para a visão anual ficar bonita
  multiMonthMaxColumns: 4, // 1 coluna em mobile (responsivo automático geralmente funciona, mas pode forçar)
  events: [] as any[],
  eventClick: handleEventClick,
  editable: false,
  height: 'auto',
  dayMaxEvents: true,
  allDaySlot: true,
});

const fetchEventos = async () => {
  try {
    const { data } = await api.get<Page<EventoDTO>>('/eventos?size=200&sort=dataInicio,desc');
    
    calendarOptions.events = data.content.map(evento => ({
      id: String(evento.id),
      title: evento.titulo,
      start: evento.dataInicio,
      end: evento.dataFim,
      // Usa a função do arquivo de config
      backgroundColor: getEventColor(evento.tipo),
      borderColor: getEventColor(evento.tipo),
      extendedProps: {
        descricao: evento.descricao,
        tipo: evento.tipo
      }
    }));

  } catch (error) {
    console.error('Erro ao carregar calendário:', error);
  } finally {
    loading.value = false;
  }
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
    dateStyle: 'full',
    timeStyle: 'short'
  });
};

onMounted(() => {
  fetchEventos();
});
</script>

<style>
/* CSS Global do Calendário */
.fc-toolbar-title {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  text-transform: capitalize;
  color: #1f2937;
}
.fc-button-primary {
  background-color: #093089 !important;
  border-color: #093089 !important;
}
.fc-button-primary:hover {
  background-color: #07256e !important;
}
.fc-button-active {
  background-color: #fdb913 !important;
  border-color: #fdb913 !important;
  color: #093089 !important;
}
.fc-event {
  cursor: pointer;
  border-radius: 4px;
  border: none; /* Remove bordas padrão para ficar mais clean */
}
a.fc-col-header-cell-cushion, a.fc-daygrid-day-number {
  text-decoration: none;
  color: #4b5563;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>