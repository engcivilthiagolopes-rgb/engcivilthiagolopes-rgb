export type Portal = 'PNCP' | 'Compras.gov.br' | 'SIGA-RJ';

export type KanbanColumn =
  | 'triagem'
  | 'analise'
  | 'proposta'
  | 'disputa'
  | 'homologada';

export interface Cnae {
  id: string;
  code: string;
  name: string;
  enabled: boolean;
}

export interface ProcurementItem {
  id: string;
  title: string;
  objectDescription: string;
  portal: Portal;
  estimatedValue: number;
  buyerOrgan: string;
  municipality: string;
  region: string;
  cnaeMatch: string;
  closesAt: string; // ISO
  biddingStartsAt: string | null; // ISO or null
  status: 'open' | 'in_dispute';
  column: KanbanColumn;
  riskScore: number;
  meEppExclusive: boolean;
  requiredCertificates: string[];
  objectBreakdown: { item: string; qty: number; unit: string; unitPrice: number }[];
  deliveryAddress: string;
  publicPortalUrl: string;
  competitorCount: number;
}

export interface AlertSettings {
  whatsapp: boolean;
  telegram: boolean;
  push: boolean;
  email: boolean;
}

export interface Competitor {
  name: string;
  avgDiscount: number;
  wins: number;
  cnaeFocus: string;
}

export interface BuyingOrganStat {
  organ: string;
  municipality: string;
  totalValue: number;
  contracts: number;
  region: string;
}

export interface LowCompetitionRegion {
  region: string;
  organs: string[];
  avgBidders: number;
  riskLevel: 'high' | 'medium' | 'low';
}
