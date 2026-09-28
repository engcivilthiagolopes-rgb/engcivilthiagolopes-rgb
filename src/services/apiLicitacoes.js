// Conexão Real com a API do PNCP para o Estado do Rio de Janeiro
export async function buscarDispensasReaisRJ() {
  try {
    // API Oficial do Governo - Filtros: UF=RJ e modalidade de dispensa (6)
    const url = 'https://pncp.gov.br';
    
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Mapeamento semântico dos seus CNAEs
    const palavrasChave = ['papel', 'cadeira', 'alcool', 'parafuso', 'lampada', 'led', 'tubo', 'tinta', 'toner', 'teclado', 'mouse', 'limpeza'];

    return data.data
      .map(item => ({
        id: item.id || String(Math.random()),
        orgao: item.orgaoSubordinadoNome || item.orgaoEntidadeNome || 'Órgão Fluminense',
        objeto: item.objeto || '',
        valorMaximo: item.valorTotalEstimado || 0,
        dataEncerramento: item.dataFimTermo || new Date(Date.now() + 7200000).toISOString(),
        linkOficial: `https://pncp.gov.br{item.orgaoEntidadeCnpj}/${item.anoContratacao}/${item.sequencialContratacao}`
      }))
      // Filtros do SEU FILTRO: Máximo de R\$ 100 mil e que dê match com seus produtos
      .filter(lic => lic.valorMaximo <= 100000 && palavrasChave.some(p => lic.objeto.toLowerCase().includes(p)));
  } catch (error) {
    console.error('Erro na requisição PNCP:', error);
    return [];
  }
}
