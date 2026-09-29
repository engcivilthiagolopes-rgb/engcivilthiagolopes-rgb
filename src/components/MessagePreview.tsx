import { useMemo } from 'react';
import { MessageCircle, Eye } from 'lucide-react';
import { useProcurementSocket } from '@/context/ProcurementContext';
import { formatBRL } from '@/data/mockData';
import type { ProcurementItem } from '@/types';

interface MessagePreviewProps {
  item?: ProcurementItem;
}

export function MessagePreview({ item }: MessagePreviewProps) {
  const { items } = useProcurementSocket();

  // Use the provided item, or fall back to the most recent triagem item
  const previewItem = item || useMemo(() => {
    const triagem = items.filter((i) => i.column === 'triagem');
    return triagem[0] || items[0];
  }, [items]);

  const messageLines = useMemo(() => {
    if (!previewItem) return [];
    const cnaeName = formatCnaeName(previewItem.cnaeMatch);
    const meEpp = previewItem.meEppExclusive ? 'Exclusivo ME/EPP' : 'Aberta a todos';
    const faseTime = formatBiddingTime(previewItem.biddingStartsAt, previewItem.closesAt);
    const margem = 15 + Math.floor((previewItem.riskScore % 20));
    return [
      { prefix: '', text: 'ALERTA DE DISPENSA ELETRONICA RELAMPAGO', bold: true, emoji: '🚨' },
      { prefix: 'Orgao:', text: `${previewItem.buyerOrgan} - RJ`, bold: false, emoji: '🏢' },
      { prefix: 'Objeto:', text: `[${cnaeName}] ${previewItem.title}`, bold: false, emoji: '📦' },
      { prefix: 'Valor Limite:', text: formatBRL(previewItem.estimatedValue), bold: false, emoji: '💰' },
      { prefix: 'Avaliacao:', text: `${meEpp} | Menor Preco por Item`, bold: false, emoji: '⚖️' },
      { prefix: 'Fornecedores:', text: `3 Distribuidores Mapeados no RJ (Margem Est: ~${margem}%)`, bold: false, emoji: '🏭' },
      { prefix: 'Fase de Lances:', text: faseTime, bold: false, emoji: '⏱️' },
      { prefix: '', text: 'Acesse a Sala de Disputa e Mova o Card:', bold: false, emoji: '🔗' },
      { prefix: '', text: 'https://meufiltro.com.br', bold: false, emoji: '' },
    ];
  }, [previewItem]);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b bg-secondary px-5 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-default">
            Preview da Mensagem WhatsApp
          </h3>
        </div>
        <span className="flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">
          <MessageCircle className="h-3 w-3" />
          Template dinamico
        </span>
      </div>

      {/* Phone mockup frame */}
      <div className="p-5">
        <div className="mx-auto max-w-sm">
          {/* WhatsApp chat frame */}
          <div className="overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700">
            {/* Chat header */}
            <div className="flex items-center gap-2 bg-green-600 px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">MEU FILTRO Bot</p>
                <p className="text-[9px] text-white/70">online</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[9px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                API Ativa
              </span>
            </div>

            {/* Message bubble */}
            <div className="bg-[#e5ddd5] px-4 py-4 dark:bg-gray-800">
              <div className="relative rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-700">
                {/* Tail */}
                <div className="absolute -top-1.5 left-3 h-3 w-3 rotate-45 bg-white dark:bg-gray-700" />

                <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                  {messageLines.map((line, i) => (
                    <p
                      key={i}
                      className={`text-gray-800 dark:text-gray-100 ${
                        line.bold ? 'font-bold text-red-600' : ''
                      }`}
                    >
                      {line.emoji && <span className="mr-1">{line.emoji}</span>}
                      {line.prefix && <span className="font-bold">*{line.prefix}*</span>}
                      {line.prefix && ' '}
                      {line.bold ? `*${line.text}*` : line.text}
                    </p>
                  ))}
                  <p className="mt-1 text-right text-[8px] text-gray-400">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{' '}
                    <span className="text-blue-500">✓✓</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-muted">
            Este e exatamente o formato enviado para o WhatsApp do usuario quando uma nova
            dispensa e detectada
          </p>
        </div>
      </div>
    </div>
  );
}

function formatCnaeName(code: string): string {
  const names: Record<string, string> = {
    '4761-0/03': 'Papelaria e Escritorio',
    '4754-7/01': 'Moveis Corporativos',
    '4789-0/05': 'Limpeza e Higiene',
    '4744-0/01': 'Ferragens e Ferramentas',
    '4742-3/00': 'Material Eletrico',
    '4744-0/03': 'Material Hidraulico',
    '4741-5/00': 'Construcao Geral e Pintura',
    '4789-0/07': 'Informatica e Automacao',
  };
  return names[code] || code;
}

function formatBiddingTime(biddingStartsAt: string | null, closesAt: string): string {
  const target = biddingStartsAt || closesAt;
  const date = new Date(target);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return isToday ? `HOJE as ${time} (Prazo Curto!)` : `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} as ${time}`;
}
