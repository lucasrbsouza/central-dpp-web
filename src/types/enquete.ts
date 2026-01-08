// Estrutura de uma Opção dentro da Enquete (Response)
export interface OpcaoDTO {
  id: number;
  texto: string;
  totalVotos: number;
}

// A Enquete completa que vem do Backend
export interface EnqueteDTO {
  id: number;
  pergunta: string;
  descricao?: string;
  multiplaEscolha: boolean;
  dataFim: string; // LocalDateTime ISO
  ativo: boolean;
  usuarioJaVotou: boolean;
  opcoes: OpcaoDTO[];
}

// Payload para CRIAR uma enquete (Admin)
export interface EnqueteForm {
  pergunta: string;
  descricao: string;
  multiplaEscolha: boolean;
  dataFim: string;
  opcoesTexto: string[]; // Lista de strings simples para criar
}

// Payload para VOTAR (Usuário)
export interface VotoForm {
  opcoesIds: number[]; // Lista de IDs das opções escolhidas
}

// Paginação
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