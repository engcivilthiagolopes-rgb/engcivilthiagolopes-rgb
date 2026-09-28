import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  Package,
  Shield,
  ShieldCheck,
  ShieldAlert,
  X,
} from 'lucide-react';
import type { ProcurementItem } from '@/types';
import { formatBRL } from '@/data/mockData';
import { PortalBadge } from '@/components/ui/PortalBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface DetailModalProps {
  item: ProcurementItem | null;
  onClose: () => void;
  onSendToKanban: (id: string) => void;
}

export function DetailModal({ item, onClose, onSendToKanban }: DetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (item) {
      setMounted(true);
    } else {
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [item]);

  if (!mounted || !item) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${item ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col bg-card shadow-lg-card transition-transform duration-300 ${
          item ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b p-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <PortalBadge portal={item.portal} />
              <RiskBadge riskScore={item.riskScore} />
              <CountdownTimer closesAt={item.closesAt} biddingStartsAt={item.biddingStartsAt} />
            </div>
            <h2 className="text-lg font-bold text-default">{item.title}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-secondary">
              <Building2 className="h-4 w-4" />
              {item.buyerOrgan} · {item.municipality} - RJ
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-tertiary"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Value highlight */}
          <div className="border-b bg-secondary p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Valor Estimado</p>
            <p className="mt-1 text-3xl font-bold text-primary">{formatBRL(item.estimatedValue)}</p>
            <p className="mt-1 text-xs text-muted">CNAE {item.cnaeMatch}</p>
          </div>

          {/* Object Description */}
          <div className="border-b p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-default">Demonstrativo do Objeto</h3>
            </div>
            <p className="text-sm text-secondary leading-relaxed">{item.objectDescription}</p>
          </div>

          {/* Object Breakdown */}
          <div className="border-b p-5">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-default">Itens do Edital</h3>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-tertiary">
                  <tr className="text-left text-xs font-semibold text-muted">
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2 text-center">Qtd</th>
                    <th className="px-3 py-2 text-right">Preço Unit.</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {item.objectBreakdown.map((row, i) => (
                    <tr key={i} className="text-default">
                      <td className="px-3 py-2 text-xs">{row.item}</td>
                      <td className="px-3 py-2 text-center text-xs text-secondary">
                        {row.qty} {row.unit}
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-secondary">{formatBRL(row.unitPrice)}</td>
                      <td className="px-3 py-2 text-right text-xs font-semibold">{formatBRL(row.qty * row.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-tertiary">
                    <td colSpan={3} className="px-3 py-2 text-right text-xs font-bold text-default">
                      Total Estimado:
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-bold text-primary">
                      {formatBRL(item.objectBreakdown.reduce((s, r) => s + r.qty * r.unitPrice, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-b p-5">
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-default">Local de Entrega</h3>
            </div>
            <p className="text-sm text-secondary leading-relaxed">{item.deliveryAddress}</p>
          </div>

          {/* Risk Assessment */}
          <div className="border-b p-5">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-default">Análise Automatizada de Riscos do Edital</h3>
            </div>

            <div className="space-y-3">
              {/* ME/EPP Exclusivity */}
              <div
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  item.meEppExclusive
                    ? 'border-success/20 bg-success/5'
                    : 'border-error/20 bg-error/5'
                }`}
              >
                {item.meEppExclusive ? (
                  <ShieldCheck className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-error shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-default">
                    Exclusividade ME/EPP
                  </p>
                  <p className="text-xs text-secondary">
                    {item.meEppExclusive
                      ? 'Edital reservado para Microempresas e Empresas de Pequeno Porte. Vantagem competitiva alta.'
                      : 'Sem exclusividade ME/EPP. Concorrência aberta a empresas de todos os portes.'}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    item.meEppExclusive
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  {item.meEppExclusive ? 'RESERVADO' : 'ABERTO'}
                </span>
              </div>

              {/* Habilitation Complexity */}
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-sm font-semibold text-default">
                    Complexidade de Habilitação
                  </p>
                </div>
                <p className="mb-2 text-xs text-secondary">
                  Documentos obrigatórios para habilitação no certame:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.requiredCertificates.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 rounded-md border bg-tertiary px-2 py-1 text-xs text-secondary"
                    >
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Competitor count */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary">
                    <span className="text-sm font-bold text-secondary">{item.competitorCount}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-default">Competidores Identificados</p>
                    <p className="text-xs text-muted">
                      {item.competitorCount < 3
                        ? 'Baixa concorrência - alta probabilidade de vitória'
                        : item.competitorCount < 6
                          ? 'Concorrência moderada'
                          : 'Alta concorrência esperada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 border-t p-4">
          <a
            href={item.publicPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Acessar Sala Pública no Portal
          </a>
          <button
            onClick={() => {
              onSendToKanban(item.id);
              onClose();
            }}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Enviar para Kanban
          </button>
        </div>
      </div>
    </>
  );
}
