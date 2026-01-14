// src/types/evento.ts

// Mudamos de Union Type fixo para string, pois agora vem do banco
export type TipoEvento = string; 

export interface EventoDTO {
  id: number;
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  dataInicio: string; // ISO String
  dataFim: string;    // ISO String
  ativo: boolean;
  equipeNome?: string;
  equipeId?: number;
  colaboradorNome?: string;
}

export interface EventoForm {
  titulo: string;
  descricao: string;
  tipo: TipoEvento;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  equipeId: number | null;     
  colaboradorId: number | null; 
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