export interface TableColumn {
  key: string;            // Identificador único (ex: 'actions', 'status')
  label: string;          // O que aparece no cabeçalho (ex: 'Nome', 'Ações')
  prop?: string;          // O campo do objeto a ser exibido (ex: 'email', 'nome')
  width?: string;         // Largura fixa opcional (ex: '150px')
  align?: 'left' | 'center' | 'right'; // Alinhamento
  formatter?: (value: any) => string; // Função para formatar (ex: datas)
}