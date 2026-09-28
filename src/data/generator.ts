import type { Portal, ProcurementItem } from '@/types';

interface CnaeProfile {
  code: string;
  name: string;
  titleTemplates: string[];
  breakdownTemplates: { item: string; unit: string; unitPriceRange: [number, number] }[];
  descriptions: string[];
}

const CNAE_PROFILES: CnaeProfile[] = [
  {
    code: '4761-0/03',
    name: 'Papelaria e Escritório',
    titleTemplates: [
      'Aquisição de Material de Expediente e Papelaria',
      'Fornecimento de Suprimentos de Escritório - Lote Único',
      'Aquisição de Materiais de Expediente para Setores Administrativos',
    ],
    breakdownTemplates: [
      { item: 'Papel A4 branco 75g (resma)', unit: 'resma', unitPriceRange: [25, 35] },
      { item: 'Cartucho HP 667 preto', unit: 'unid', unitPriceRange: [70, 95] },
      { item: 'Caneta esferográfica azul', unit: 'unid', unitPriceRange: [0.8, 2.0] },
      { item: 'Pasta suspensiva azul', unit: 'unid', unitPriceRange: [6, 12] },
      { item: 'Bloco de notas adesivas', unit: 'unid', unitPriceRange: [3, 8] },
    ],
    descriptions: [
      'Aquisição de materiais de expediente e papelaria para abastecimento dos setores administrativos.',
      'Fornecimento de suprimentos de escritório para as unidades municipais.',
    ],
  },
  {
    code: '4754-7/01',
    name: 'Móveis Corporativos',
    titleTemplates: [
      'Fornecimento de Móveis Corporativos para Recepção',
      'Aquisição de Móveis para Unidades Administrativas',
      'Fornecimento de Móveis e Arquivos para Setores Públicos',
    ],
    breakdownTemplates: [
      { item: 'Cadeira ergonômica executiva', unit: 'unid', unitPriceRange: [800, 2400] },
      { item: 'Mesa de reunião 1,8m', unit: 'unid', unitPriceRange: [600, 1800] },
      { item: 'Arquivo de aço 4 gavetas', unit: 'unid', unitPriceRange: [450, 1200] },
      { item: 'Poltrona de espera 2 lugares', unit: 'unid', unitPriceRange: [1200, 3200] },
    ],
    descriptions: [
      'Fornecimento e instalação de móveis corporativos para as instalações administrativas.',
      'Aquisição de móveis para equipar novas recepções e setores de atendimento ao público.',
    ],
  },
  {
    code: '4789-0/05',
    name: 'Limpeza e Higiene',
    titleTemplates: [
      'Aquisição de Produtos de Limpeza - Entrega Parcelada',
      'Fornecimento de Materiais de Higiene e Limpeza Institucional',
      'Aquisição de Produtos de Limpeza para Escolas Municipais',
    ],
    breakdownTemplates: [
      { item: 'Detergente neutro 5L', unit: 'galão', unitPriceRange: [18, 28] },
      { item: 'Desinfetante concentrado 1L', unit: 'unid', unitPriceRange: [6, 12] },
      { item: 'Saco de lixo 100L (pacote 100un)', unit: 'pct', unitPriceRange: [30, 48] },
      { item: 'Pano multiuso (pacote 50un)', unit: 'pct', unitPriceRange: [12, 22] },
      { item: 'Água sanitária 5L', unit: 'galão', unitPriceRange: [15, 25] },
    ],
    descriptions: [
      'Aquisição de produtos de limpeza e higiene para manutenção das instalações públicas.',
      'Fornecimento de materiais de limpeza para abastecimento das escolas municipais.',
    ],
  },
  {
    code: '4744-0/01',
    name: 'Ferragens e Ferramentas',
    titleTemplates: [
      'Aquisição de Ferragens e Ferramentas para Manutenção',
      'Fornecimento de Ferramentas Manuais para Equipe Técnica',
      'Aquisição de Materiais de Ferragens para Manutenção Predial',
    ],
    breakdownTemplates: [
      { item: 'Kit chave combinada (8-19mm)', unit: 'kit', unitPriceRange: [200, 380] },
      { item: 'Furadeira de impacto 750W', unit: 'unid', unitPriceRange: [320, 520] },
      { item: 'Dobradiça em aço 3"', unit: 'par', unitPriceRange: [8, 18] },
      { item: 'Cadeado latão 40mm', unit: 'unid', unitPriceRange: [12, 28] },
      { item: 'Martelo unha 27mm', unit: 'unid', unitPriceRange: [25, 55] },
    ],
    descriptions: [
      'Aquisição de ferragens e ferramentas manuais para a equipe de manutenção dos prédios públicos.',
      'Fornecimento de ferragens para reparos nas instalações municipais.',
    ],
  },
  {
    code: '4742-3/00',
    name: 'Material Elétrico',
    titleTemplates: [
      'Aquisição de Material Elétrico para Reforma de Iluminação',
      'Fornecimento de Materiais Elétricos para Manutenção',
      'Aquisição de Luminárias LED e Acessórios Elétricos',
    ],
    breakdownTemplates: [
      { item: 'Luminária LED 100W', unit: 'unid', unitPriceRange: [120, 250] },
      { item: 'Cabo flexível 2,5mm (rolo 100m)', unit: 'rolo', unitPriceRange: [250, 420] },
      { item: 'Disjuntor 20A', unit: 'unid', unitPriceRange: [18, 42] },
      { item: 'Fita isolante 20m (pacote 10un)', unit: 'pct', unitPriceRange: [32, 58] },
      { item: 'Tomada 2P+T padrão', unit: 'unid', unitPriceRange: [6, 15] },
    ],
    descriptions: [
      'Aquisição de materiais elétricos para substituição e manutenção do sistema de iluminação.',
      'Fornecimento de materiais elétricos para reformas nas instalações públicas.',
    ],
  },
  {
    code: '4744-0/03',
    name: 'Material Hidráulico',
    titleTemplates: [
      'Aquisição de Material Hidráulico para Reparos Emergenciais',
      'Fornecimento de Materiais Hidráulicos para Manutenção Predial',
      'Aquisição de Material Hidráulico para Banheiros Escolares',
    ],
    breakdownTemplates: [
      { item: 'Válvula de descarga', unit: 'unid', unitPriceRange: [25, 52] },
      { item: 'Tubo PVC 100mm (6m)', unit: 'barra', unitPriceRange: [48, 95] },
      { item: 'Torneira lavatório cromada', unit: 'unid', unitPriceRange: [55, 125] },
      { item: 'Sifão cromado', unit: 'unid', unitPriceRange: [15, 35] },
      { item: 'Registro de gaveta 1/2"', unit: 'unid', unitPriceRange: [12, 28] },
    ],
    descriptions: [
      'Aquisição de materiais hidráulicos para reparo emergencial das instalações sanitárias.',
      'Fornecimento de materiais hidráulicos para manutenção das escolas municipais.',
    ],
  },
  {
    code: '4741-5/00',
    name: 'Construção Geral e Pintura',
    titleTemplates: [
      'Serviços de Pintura e Fornecimento de Material de Construção',
      'Aquisição de Materiais de Construção e Pintura Predial',
      'Fornecimento de Tintas e Materiais para Revitalização Predial',
    ],
    breakdownTemplates: [
      { item: 'Tinta acrílica branca 18L', unit: 'galão', unitPriceRange: [220, 450] },
      { item: 'Massa acrílica 5kg', unit: 'pote', unitPriceRange: [35, 75] },
      { item: 'Rolo de lã 9" (c/ refil)', unit: 'kit', unitPriceRange: [20, 42] },
      { item: 'Lixa d\'água 220 (pacote 25un)', unit: 'pct', unitPriceRange: [25, 48] },
      { item: 'Cimento Votoran 50kg', unit: 'saco', unitPriceRange: [28, 45] },
    ],
    descriptions: [
      'Serviços de pintura e fornecimento de material de construção para revitalização de prédios públicos.',
      'Aquisição de materiais de construção e pintura para reforma das instalações administrativas.',
    ],
  },
  {
    code: '4789-0/07',
    name: 'Informática e Automação',
    titleTemplates: [
      'Aquisição de Computadores e Periféricos para Laboratório',
      'Fornecimento de Suprimentos de Informática - Lote Anual',
      'Aquisição de Equipamentos de Informática para Setores Públicos',
    ],
    breakdownTemplates: [
      { item: 'Desktop Intel i5 / 8GB / 256SSD', unit: 'unid', unitPriceRange: [1600, 2800] },
      { item: 'Monitor LED 24"', unit: 'unid', unitPriceRange: [380, 650] },
      { item: 'Teclado + Mouse sem fio', unit: 'kit', unitPriceRange: [70, 130] },
      { item: 'Toner compatível HP 85A', unit: 'unid', unitPriceRange: [45, 85] },
      { item: 'Adaptador USB-C Hub', unit: 'unid', unitPriceRange: [95, 200] },
    ],
    descriptions: [
      'Aquisição de computadores, monitores e periféricos para equipar setores administrativos.',
      'Fornecimento de suprimentos de informática e acessórios para as unidades municipais.',
    ],
  },
];

interface MunicipalityProfile {
  name: string;
  region: string;
  organs: string[];
}

const MUNICIPALITIES: MunicipalityProfile[] = [
  { name: 'Duque de Caxias', region: 'Metropolitana', organs: ['Prefeitura de Duque de Caxias', 'Secretaria de Educação - Duque de Caxias'] },
  { name: 'Petrópolis', region: 'Serrana', organs: ['Prefeitura de Petrópolis', 'Câmara Municipal de Petrópolis'] },
  { name: 'Angra dos Reis', region: 'Costa Verde', organs: ['Prefeitura de Angra dos Reis', 'Secretaria de Obras - Angra dos Reis'] },
  { name: 'Niterói', region: 'Metropolitana', organs: ['Prefeitura de Niterói', 'Fundação Municipal de Saúde de Niterói'] },
  { name: 'Nova Friburgo', region: 'Serrana', organs: ['Prefeitura de Nova Friburgo', 'Câmara Municipal de Nova Friburgo'] },
  { name: 'Macaé', region: 'Norte Fluminense', organs: ['Secretaria de Saúde - Macaé', 'Prefeitura de Macaé'] },
  { name: 'Campos dos Goytacazes', region: 'Norte Fluminense', organs: ['Prefeitura de Campos dos Goytacazes', 'Universidade Estadual do Norte Fluminense'] },
  { name: 'Teresópolis', region: 'Serrana', organs: ['Prefeitura de Teresópolis', 'Secretaria de Obras - Teresópolis'] },
  { name: 'Rio de Janeiro', region: 'Capital', organs: ['DETRAN - RJ', 'Tribunal de Justiça - RJ', 'ALERJ - Assembleia Legislativa', 'Secretaria Municipal de Educação - RJ'] },
  { name: 'Saquarema', region: 'Baixada Litorânea', organs: ['Prefeitura de Saquarema'] },
  { name: 'Itaboraí', region: 'Metropolitana', organs: ['Prefeitura de Itaboraí', 'Câmara Municipal de Itaboraí'] },
  { name: 'Volta Redonda', region: 'Sul Fluminense', organs: ['Prefeitura de Volta Redonda', 'Secretaria de Administração - Volta Redonda'] },
  { name: 'Barra Mansa', region: 'Sul Fluminense', organs: ['Prefeitura de Barra Mansa'] },
  { name: 'Cantagalo', region: 'Serrana', organs: ['Câmara Municipal de Cantagalo', 'Prefeitura de Cantagalo'] },
  { name: 'Resende', region: 'Sul Fluminense', organs: ['Prefeitura de Resende'] },
];

const PORTALS: Portal[] = ['PNCP', 'Compras.gov.br', 'SIGA-RJ'];

const CERTIFICATE_COMBOS = [
  ['CND Federal', 'CNDT'],
  ['CND Federal', 'CNDT', 'CND Municipal'],
  ['CND Federal', 'CNDT', 'CND Estadual', 'Alvará de Funcionamento'],
  ['CND Municipal', 'CNDT'],
  ['CND Federal', 'CNDT', 'Alvará de Funcionamento', 'Certidão FGTS'],
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateId(): string {
  return `rt${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

export function generateProcurementItem(urgent: boolean): ProcurementItem {
  const cnae = randomFrom(CNAE_PROFILES);
  const mun = randomFrom(MUNICIPALITIES);
  const organ = randomFrom(mun.organs);
  const portal = randomFrom(PORTALS);
  const title = randomFrom(cnae.titleTemplates);
  const description = randomFrom(cnae.descriptions);

  // Generate breakdown: 2-4 items
  const itemCount = randomInt(2, 4);
  const shuffled = [...cnae.breakdownTemplates].sort(() => Math.random() - 0.5).slice(0, itemCount);
  const breakdown = shuffled.map((b) => {
    const qty = randomInt(10, 200);
    const unitPrice = Math.round(randomFloat(b.unitPriceRange[0], b.unitPriceRange[1]) * 100) / 100;
    return { item: b.item, qty, unit: b.unit, unitPrice };
  });

  const totalValue = breakdown.reduce((s, r) => s + r.qty * r.unitPrice, 0);

  // Clamp to R$ 100.000,00 max budget
  const estimatedValue = Math.min(Math.round(totalValue), 99000);

  const riskScore = randomInt(15, 65);
  const meEppExclusive = Math.random() < 0.35;
  const certificates = randomFrom(CERTIFICATE_COMBOS);
  const competitorCount = randomInt(0, 8);

  // Timing: urgent items close in 0.5-4h, normal in 4-48h
  const closeHours = urgent ? randomFloat(0.5, 4) : randomFloat(4, 48);
  const closesAt = new Date(Date.now() + closeHours * 3600_000).toISOString();
  const hasBiddingStart = Math.random() < 0.3;
  const biddingStartsAt = hasBiddingStart
    ? new Date(Date.now() + randomFloat(1, closeHours * 0.5) * 3600_000).toISOString()
    : null;

  const streetNames = ['Rua das Flores', 'Av. Brasil', 'Rua da Conceição', 'Praça Central', 'Av. Presidente Vargas', 'Rua 13 de Maio', 'Rua Alberto Braune', 'Av. Rui Barbosa'];
  const street = randomFrom(streetNames);
  const streetNumber = randomInt(50, 1200);
  const cep = `${randomInt(20000, 28999)}-${String(randomInt(0, 999)).padStart(3, '0')}`;

  const portalUrlMap: Record<Portal, string> = {
    'PNCP': `https://pncp.gov.br/app/editais/${generateId().slice(-8)}`,
    'Compras.gov.br': `https://www.gov.br/compras/editais/${generateId().slice(-8)}`,
    'SIGA-RJ': `https://www.siga.rj.gov.br/editais/${generateId().slice(-8)}`,
  };

  return {
    id: generateId(),
    title,
    objectDescription: description,
    portal,
    estimatedValue,
    buyerOrgan: organ,
    municipality: mun.name,
    region: mun.region,
    cnaeMatch: cnae.code,
    closesAt,
    biddingStartsAt,
    status: 'open',
    column: 'triagem',
    riskScore,
    meEppExclusive,
    requiredCertificates: certificates,
    objectBreakdown: breakdown,
    deliveryAddress: `${street}, ${streetNumber} - Centro, ${mun.name} - RJ, ${cep}`,
    publicPortalUrl: portalUrlMap[portal],
    competitorCount,
  };
}
