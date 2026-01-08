export interface AvisoDTO {
  id: number;
  titulo: string;
  conteudo: string; 
  tipo: 'INFO' | 'ALERTA' | 'URGENTE';
  prioridade: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  criadoPorNome?: string;
}

export interface AvisoForm {
  titulo: string;
  conteudo: string; 
  tipo: 'INFO' | 'ALERTA' | 'URGENTE';
  prioridade: number;
  ativo: boolean;
  dataInicio: string;
  dataFim: string;
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