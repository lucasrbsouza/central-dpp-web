export interface ColaboradorPerfil {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  genero: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  cargo: string;
  atribuicao?: string;
  dataEntradaSetor?: string;
  escolaridade?: string;
  formacao?: string;
  dataDeNascimento: string;
  telefone: string;
  ativo: boolean;

    // vem do usuario associado
  email?: string;
  equipe?: {
    id: number;
    nome: string;
  };
}

// Interface para o PUT /meu-perfil
export interface AtualizarPerfilForm {
  nome: string;
  sobrenome: string;
  genero: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  dataDeNascimento: string;
  telefone: string;
  cargo: string;
  escolaridade: string;
  formacao: string;
  atribuicao: string;
  dataEntradaSetor?: string;
}

export interface ColaboradorDTO {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  cargo: string;
  equipeId?: number;
  equipeNome?: string;
}

export interface ColaboradorRespostaDTO {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  genero: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  cargo: string;
  atribuicao?: string;
  
  dataEntradaSetor?: string;
  escolaridade?: string;
  formacao?: string;
  
  dataDeNascimento?: string;
  telefone?: string;
  ativo: boolean;

  // vem do usuario associado
  email?: string;
  
  equipe?: {
    id: number;
    nome: string;
  };
}

export interface ColaboradorAdminForm {
  nome: string;
  sobrenome: string;
  matricula: string;
  genero: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  cargo: string;
  atribuicao: string;
  dataEntradaSetor: string;
  escolaridade: string;
  formacao: string;
  dataDeNascimento: string;
  telefone: string;
  ativo: boolean;
  equipeId: number | null;
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