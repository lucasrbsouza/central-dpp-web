export interface EquipeDTO {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  
  idEquipePai?: number;
  nomeEquipePai?: string;
  
  idLider?: number;
  nomeLider?: string;
}

export interface EquipeForm {
  nome: string;
  descricao: string;
  ativo: boolean;
  idEquipePai: number | null; 
  idLider: number | null;
}

// Interface de Paginação
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