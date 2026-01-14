// src/types/auxiliares.ts

// Interface genérica para resposta paginada do Spring Boot
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // índice da página atual
    first: boolean;
    last: boolean;
    empty: boolean;
}

// Interface base para itens (Cargo, Escolaridade, Formação)
export interface ItemAuxiliar {
    id: number;
    nome: string;
    ativo: boolean;
}

// Interface específica para Tipo de Evento
export interface TipoEventoAuxiliar extends ItemAuxiliar {
    cor: string; // Ex: "#FF0000"
}

// DTO para Dropdown simples
export interface OptionDTO {
    id: number;
    label: string;
}

// Definição de configuração de campo para o componente genérico
export interface CampoConfig {
    key: string;
    label: string;
    type: 'text' | 'color' | 'boolean'| 'number';
    required?: boolean;
    listavel?: boolean; // Se aparece na tabela
}


export interface ConfigAuxiliar {
  titulo: string;
  campos: CampoConfig[];
  // Funções que o componente vai chamar
  listar: (page: number, size: number, termo: string) => Promise<any>;
  criar: (dados: any) => Promise<any>;
  atualizar: (id: number, dados: any) => Promise<any>;
  excluir: (id: number) => Promise<any>;
}