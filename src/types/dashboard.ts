export interface AvisoDashboard {
  id: number;
  titulo: string;
  tipo: 'INFO' | 'ALERTA' | 'URGENTE';
  prioridade: number;
  dataInicio: string;
}

export interface Aniversariante {
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  equipeNome: string;
}

export interface EventoDashboard {
  id: number;
  titulo: string;
  tipo: string;
  dataInicio: string;
  local: string;
}

export interface Estatisticas {
  totalColaboradores: number;
  totalEquipes: number;
  totalFerramentas: number;
}

export interface DashboardData {
  estatisticas: Estatisticas;
  aniversariantesMes: Aniversariante[];
  avisosVigentes: AvisoDashboard[];
  agendaSemana: EventoDashboard[];
}