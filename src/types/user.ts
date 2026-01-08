// DTO para o Cadastro Simplificado (Cria Usuário + Colaborador)
export interface CadastroUsuarioSimplificado {
  // Dados Pessoais
  nome: string;
  sobrenome: string;
  matricula: string;
  
  // Dados de Acesso
  email: string;
  senha: string;
  roles: string[]; // ["ROLE_ADMIN", "ROLE_GESTOR"]
}

// O que volta da API após criar
export interface UsuarioResponse {
  id: number;
  username: string; // O login gerado (ex: jose.silva)
  email: string;
  ativo: boolean;
  roles: string[];
  colaborador?: {
    id: number;
    nome: string;
    sobrenome: string;
  };
}

// (Mantém os outros tipos existentes para a listagem funcionar)
export interface UsuarioDTO {
  id: number;
  username: string;
  email: string;
  ativo: boolean;
  roles: string[];
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