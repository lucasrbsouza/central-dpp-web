export interface FerramentaDTO {
  id: number;
  titulo: string; 
  descricao: string;
  link: string;
  ativo: boolean;
}

export interface FerramentaForm {
  titulo: string;
  descricao: string;
  link: string;
  ativo: boolean;
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