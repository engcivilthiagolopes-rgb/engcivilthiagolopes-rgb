export interface FornecedorCnae {
  id: string;
  nome: string;
  cnaeAlvo: string;
  ramo: string;
  contato: string;
  regiaoAtendimento: string;
  itensPrincipais: string[];
}

export const listaFornecedoresCnae: FornecedorCnae[] = [
  {
    id: 'f1',
    nome: 'Atacadão Posto 13',
    cnaeAlvo: '4761-0/03',
    ramo: 'Papelaria e Escritório',
    contato: '(21) 98484-9303',
    regiaoAtendimento: 'Região Metropolitana e Baixada Fluminense',
    itensPrincipais: ['Papel A4/Ofício', 'Pastas AZ', 'Bobinas Térmicas', 'Envelopes']
  },
  {
    id: 'f2',
    nome: 'Coisa e Tal de Madureira',
    cnaeAlvo: '4761-0/03',
    ramo: 'Papelaria e Escritório',
    contato: 'contato@coisaetalpapelaria.com.br',
    regiaoAtendimento: 'Zona Norte e Distribuição Capital',
    itensPrincipais: ['Canetas', 'Marca-texto', 'Clips', 'Organizadores de Mesa']
  },
  {
    id: 'f3',
    nome: 'Serdal Atacado de Papelaria',
    cnaeAlvo: '4761-0/03',
    ramo: 'Papelaria e Escritório',
    contato: 'Exclusivo B2B via CNPJ',
    regiaoAtendimento: 'Despacho e Entrega em Todo o Estado do RJ',
    itensPrincipais: ['Material de Escritório Geral', 'Pastas Catálogo', 'Agendas']
  },
  {
    id: 'f4',
    nome: 'Rio Elétrica e Insumos Ltda',
    cnaeAlvo: '4742-3/00',
    ramo: 'Material Elétrico',
    contato: '(21) 2233-4455',
    regiaoAtendimento: 'Capital, Niterói e Região Metropolitana',
    itensPrincipais: ['Lâmpadas LED', 'Cabos Flexíveis', 'Disjuntores DIN', 'Canaletas']
  },
  {
    id: 'f5',
    nome: 'Norte Hidráulica Atacadista',
    cnaeAlvo: '4744-0/03',
    ramo: 'Material Hidráulico',
    contato: 'vendas@nortehidraulica.com.br',
    regiaoAtendimento: 'Baixada Fluminense e Região Serrana',
    itensPrincipais: ['Tubos PVC Soldáveis', 'Torneiras ABS/Metal', 'Registros', 'Ralos']
  },
  {
    id: 'f6',
    nome: 'Supratudo Informática Distribuidora',
    cnaeAlvo: '4751-2/01',
    ramo: 'Informática e Automação',
    contato: 'atendimento@supratudob2b.com.br',
    regiaoAtendimento: 'Todo o Estado do Rio de Janeiro',
    itensPrincipais: ['Toners Compatíveis', 'Cartuchos de Tinta', 'Mouses e Teclados']
  }
];
