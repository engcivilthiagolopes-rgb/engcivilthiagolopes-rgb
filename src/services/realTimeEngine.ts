// Engine de Tempo Real do MEU FILTRO - Correção de Cronômetro Independente
export interface LicitacaoCronometro {
  id: string;
  orgao: string;
  objeto: string;
  valorMaximo: number;
  segundosRestantes: number; // Tempo dinâmico em segundos
  fechada: boolean;
}

export class RealTimeEngine {
  // Gera um tempo de encerramento aleatório entre 5 minutos (300s) e 3 horas (10800s)
  private gerarTempoAleatorio(): number {
    return Math.floor(Math.random() * (10800 - 300 + 1)) + 300;
  }

  // Injeta novas licitações garantindo prazos de encerramento totalmente diferentes
  public injetarNovaDispensa(listaAtual: LicitacaoCronometro[]): LicitacaoCronometro[] {
    const orgaosRJ = [
      'Prefeitura de Niterói - RJ', 
      'DETRAN - RJ', 
      'Câmara Municipal de Cantagalo - RJ',
      'Secretaria de Saúde - SEFAZ/RJ',
      'Prefeitura de Duque de Caxias - RJ'
    ];
    const objetosCNAE = [
      'Aquisição de Papel A4 e Suprimentos de Escritório',
      'Lote de Cadeiras Operacionais e Longarinas para Recepção',
      'Material Hidráulico e Reparos para Vaso Sanitário',
      'Suprimentos de Informática - Toners e Mouses Sem Fio',
      'Kit de Produtos de Limpeza Pesada e Sacos de Lixo'
    ];

    const novoItem: LicitacaoCronometro = {
      id: Math.random().toString(36).substr(2, 9),
      orgao: orgaosRJ[Math.floor(Math.random() * orgaosRJ.length)],
      objeto: objetosCNAE[Math.floor(Math.random() * objetosCNAE.length)],
      valorMaximo: parseFloat((Math.random() * (95000 - 5000) + 5000).toFixed(2)),
      segundosRestantes: this.gerarTempoAleatorio(), // Cada uma nasce com seu próprio tempo único
      fechada: false
    };

    return [novoItem, ...listaAtual];
  }

  // Atualiza a fila decrementando 1 segundo de cada licitação individualmente
  public atualizarCronometros(lista: LicitacaoCronometro[]): LicitacaoCronometro[] {
    return lista.map(item => {
      if (item.segundosRestantes <= 0) {
        return { ...item, segundosRestantes: 0, fechada: true };
      }
      return { ...item, segundosRestantes: item.segundosRestantes - 1 };
    });
  }

  // Converte segundos restantes em string legível (HH:MM:SS) para o componente visual
  public formatarTempo(segundos: number): string {
    if (segundos <= 0) return "Encerrada";
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
