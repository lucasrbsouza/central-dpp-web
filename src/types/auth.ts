export interface UserProfile {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  cargo: string;
  atribuicao: string;
  email?: string;
  ativo: boolean;
}

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  roles: string[];
}