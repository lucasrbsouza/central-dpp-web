export interface DocumentoDTO {
  id: number;
  titulo: string;
  descricao: string;
  equipeId?: number;
  // O backend retorna urlLink, mas se for arquivo, o download é por endpoint específico
  urlLink?: string; 
  // Podemos inferir o tipo (LINK ou ARQUIVO) baseando-se se tem urlLink preenchido ou não
}

// Interface apenas para controle do formulário Vue (não é o que vai para a API diretamente)
export interface DocumentoFormState {
  titulo: string;
  descricao: string;
  equipeId: number | null;
  tipo: 'ARQUIVO' | 'LINK'; // Controle visual
  urlLink: string;
  arquivo: File | null;     // O arquivo selecionado do PC
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