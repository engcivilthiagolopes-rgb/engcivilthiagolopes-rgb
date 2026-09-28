// Motor de Integração Real do MEU FILTRO - Consumo Direto da API do PNCP
export interface LicitacaoReal {
  id: string;
  orgao: string;
  objeto: string;
  ramo: string;
  valorMaximo: number;
  dataEncerramento: string;
  linkOficial: string;
}

export class ApiLicitacoesService {
  // Palavras-chave dos seus 8 ramos de CNAEs para filtragem semântica
  private dicionarioCNAE: { [key: string]: string[] } = {
    'Papelaria': ['papel', 'sulfite', 'envelope', 'caneta', 'pasta az', 'grampeador', 'escritorio'],
    'Moveis': ['cadeira', 'mesa', 'armario', 'estante', 'longarina', 'gaveteiro', 'mobiliario'],
    'Limpeza': ['alcool', 'desinfetante', 'sabonete', 'toalha', 'higienico', 'lixo', 'vassoura'],
    'Ferragens': ['parafuso', 'bucha', 'fechadura', 'cadeado', 'trena', 'alicate', 'disco de corte'],
    'Eletrica': ['fio', 'cabo', 'lampada', 'led', 'disjuntor', 'tomada', 'conduite'],
    'Hidraulica': ['tubo', 'cano', 'pvc', 'torneira', 'registro', 'ralo', 'conexao'],
    'Pintura': ['tinta', 'massa', 'verniz', 'solvente', 'rolo', 'pincel', 'lixa'],
    'Informatica': ['cartucho', 'toner', 'mouse', 'teclado', 'ssd', 'nobreak', 'impressora']
  };

  /**
   * Mapeia o ramo da licitação com base nas palavras contidas no objeto
   */
  private identificarRamo(texto: string): string {
    const textoMinusculo = texto.toLowerCase();
    for (const [ramo, palavras] of Object.entries(this.dicionarioCNAE)) {
      if (palavras.some(palavra => textoMinusculo.includes(palavra))) {
        return ramo;
      }
    }
    return 'Geral';
  }

  /**
   * Consome dados reais da API Oficial do PNCP para o Estado do Rio de Janeiro
   */
  async buscarDispensasRJ(): Promise<LicitacaoReal[]> {
    try {
      // Endpoint oficial de contratações do PNCP (Filtros: UF=RJ e modalidade de dispensa)
      const url = `https://pncp.gov.br`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha na comunicação com o servidor do PNCP');
      
      const data = await response.json();
      
      // Processa e limpa os dados reais recebidos do Governo
      const resultadosFiltrados: LicitacaoReal[] = data.data
        .map((item: any) => {
          const descricaoObjeto = item.objeto || '';
          const ramoIdentificado = this.identificarRamo(descricaoObjeto);

          return {
            id: item.id || Math.random().toString(),
            orgao: item.orgaoSubordinadoNome || item.orgaoEntidadeNome || 'Órgão Fluminense',
            objeto: descricaoObjeto,
            ramo: ramoIdentificado,
            valorMaximo: item.valorTotalEstimado || 0,
            dataEncerramento: item.dataFimTermo || new Date(Date.now() + 7200000).toISOString(), // Fallback de 2 horas caso não tenha data
            linkOficial: `https://pncp.gov.br{item.orgaoEntidadeCnpj}/${item.anoContratacao}/${item.sequencialContratacao}`
          };
        })
        // Aplica o filtro de segurança permanente do MEU FILTRO (Teto de R\$ 100 mil)
        .filter((licitacao: LicitacaoReal) => licitacao.valorMaximo <= 100000 && licitacao.ramo !== 'Geral');

      return resultadosFiltrados;
    } catch (error) {
      console.error('Erro ao conectar com as bases governamentais:', error);
      return [];
    }
  }
}
