/**
 * Formata strings ISO de Data e Hora (yyyy-MM-ddTHH:mm:ss) vindas do LocalDateTime do Java.
 * Exemplo: 2023-12-25T14:30:00 -> 25 de dezembro, 14:30
 */
export const formatarDataHora = (dataISO: string): string => {
  if (!dataISO) return '';

  const data = new Date(dataISO);

  if (isNaN(data.getTime())) return '';

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};


/**
 * Formata apenas a hora (HH:mm) de um LocalDateTime
 */
export const formatarHora = (dataISO: string): string => {
  if (!dataISO) return '';

  const data = new Date(dataISO);

  if (isNaN(data.getTime())) return '';

  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};


/**
 * Formata Apenas Datas (yyyy-MM-dd) vindas do LocalDate do Java.
 * CORRIGE O BUG DO DIA ANTERIOR:
 * O Java manda "2023-05-10". O navegador converte para UTC e subtrai o fuso (-3h), virando dia 09.
 * Esta função força a interpretação correta.
 */
export const formatarDataSimples = (dataString: string): string => {
  if (!dataString) return '';

  const partes = dataString.split('-');
  if (partes.length !== 3) return '';

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  if (isNaN(ano) || isNaN(mes) || isNaN(dia)) return '';

  // Cria a data local sem conversão de timezone
  const data = new Date(ano, mes - 1, dia);

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};


/**
 * Exibe apenas o dia e o mês curto (ex: 25 JAN).
 * Útil para cards de agenda/aniversário.
 * Aceita LocalDate (yyyy-MM-dd) e LocalDateTime (yyyy-MM-ddTHH:mm:ss)
 */
export const formatarDiaMes = (dataString: string): { dia: string; mes: string } => {
  if (!dataString) return { dia: '--', mes: '--' };

  let data: Date;

  if (dataString.includes('T')) {
    data = new Date(dataString);
  } else {
    const partes = dataString.split('-');
    if (partes.length !== 3) return { dia: '--', mes: '--' };

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) return { dia: '--', mes: '--' };

    data = new Date(ano, mes - 1, dia);
  }

  if (isNaN(data.getTime())) return { dia: '--', mes: '--' };

  const diaStr = data.getDate().toString().padStart(2, '0');
  const mesStr = data
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .toUpperCase();

  return { dia: diaStr, mes: mesStr };
};


// ... (outras funções de data mantêm-se aqui)

/**
 * Converte bytes para tamanho legível (KB, MB, GB).
 * Ex: 1073741824 -> "1.00 GB"
 */
export const formatarBytes = (bytes: number, decimais = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimais < 0 ? 0 : decimais;
  const tamanhos = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + tamanhos[i];
};
