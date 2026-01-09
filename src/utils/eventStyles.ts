// Mapeamento centralizado de cores
// Chave: TipoEvento (do Java)
// Valor: { color: Hex para o calendário, headerClass: Tailwind para o modal }

interface EventStyle {
  color: string;       // Cor de fundo/borda no calendário (HEX)
  headerClass: string; // Classe Tailwind para o topo do Modal
  label: string;       // Nome legível para legendas
}

export const EVENT_STYLES: Record<string, EventStyle> = {
  REUNIAO: { 
    color: '#2563eb', // Blue-600
    headerClass: 'bg-blue-600',
    label: 'Reunião'
  },
  TREINAMENTO: { 
    color: '#9333ea', // Purple-600
    headerClass: 'bg-purple-600',
    label: 'Treinamento'
  },
  FERIADO: { 
    color: '#16a34a', // Green-600
    headerClass: 'bg-green-600',
    label: 'Feriado'
  },
  ANIVERSARIO: { 
    color: '#eab308', // Yellow-500
    headerClass: 'bg-yellow-500',
    label: 'Aniversário'
  },
  OUTRO: { 
    color: '#4b5563', // Gray-600
    headerClass: 'bg-gray-600',
    label: 'Outro'
  }
};

// Fallback para tipos desconhecidos (segurança)
const DEFAULT_STYLE: EventStyle = {
  color: '#6b7280', 
  headerClass: 'bg-gray-500',
  label: 'Evento'
};

// Funções Helpers para usar nos componentes
export const getEventColor = (tipo: string): string => {
  return EVENT_STYLES[tipo]?.color || DEFAULT_STYLE.color;
};

export const getEventHeaderClass = (tipo: string): string => {
  return EVENT_STYLES[tipo]?.headerClass || DEFAULT_STYLE.headerClass;
};

export const getEventLabel = (tipo: string): string => {
  return EVENT_STYLES[tipo]?.label || tipo;
};