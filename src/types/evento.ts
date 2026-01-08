export type TipoEvento = 'REUNIAO' | 'TREINAMENTO' | 'FERIADO' | 'ANIVERSARIO' | 'OUTRO';

export interface EventoDTO {
  id: number;
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  equipeNome?: string;
}

export interface EventoForm {
  titulo: string;
  descricao: string;
  tipo: TipoEvento;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  equipeId?: number | null;     // Opcional
  colaboradorId?: number | null; // Organizador
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}