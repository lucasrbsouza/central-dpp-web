export interface LogResumo {
  usuario: string;
  acao: string;
  data: string;
}

export interface AdminDashboardData {
  totalUsuarios: number;
  totalUsuariosAtivos: number;
  totalEquipes: number;
  totalDocumentos: number;
  armazenamentoUsadoBytes: number;
  ultimasAcoesDoSistema: LogResumo[];
}