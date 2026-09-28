import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  KanbanSquare,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import type { KanbanColumn, ProcurementItem } from '@/types';
import { formatBRL } from '@/data/mockData';
import { PortalBadge } from '@/components/ui/PortalBadge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface KanbanPageProps {
  items: ProcurementItem[];
  onMoveItem: (id: string, column: KanbanColumn) => void;
  onViewItem: (item: ProcurementItem) => void;
}

const COLUMNS: { id: KanbanColumn; label: string; color: string; dotColor: string }[] = [
  { id: 'triagem', label: 'Triagem / Novas', color: 'border-slate-400', dotColor: 'bg-slate-400' },
  { id: 'analise', label: 'Edital em Análise', color: 'border-blue-400', dotColor: 'bg-blue-400' },
  { id: 'proposta', label: 'Proposta Cadastrada', color: 'border-amber-400', dotColor: 'bg-amber-400' },
  { id: 'disputa', label: 'Em Disputa', color: 'border-red-400', dotColor: 'bg-red-400' },
  { id: 'homologada', label: 'Homologada / Encerrada', color: 'border-emerald-400', dotColor: 'bg-emerald-400' },
];

export function KanbanPage({ items, onMoveItem, onViewItem }: KanbanPageProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanColumn | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, col: KanbanColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(col);
  };

  const handleDrop = (e: React.DragEvent, col: KanbanColumn) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onMoveItem(id, col);
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleQuickMove = (id: string, currentCol: KanbanColumn) => {
    const currentIndex = COLUMNS.findIndex((c) => c.id === currentCol);
    if (currentIndex < COLUMNS.length - 1) {
      onMoveItem(id, COLUMNS[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-default">Kanban de Licitações</h1>
          <p className="mt-1 text-sm text-muted">
            Arraste cartões entre colunas ou use as setas para mover
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
          <KanbanSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-secondary">{items.length} itens</span>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto scrollbar-thin">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {COLUMNS.map((col) => {
            const colItems = items.filter((i) => i.column === col.id);
            const isDragOver = dragOverCol === col.id;
            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={() => setDragOverCol(null)}
                className={`flex w-80 flex-col rounded-xl border-2 bg-secondary transition-colors ${
                  isDragOver ? 'border-primary bg-primary-light' : `${col.color} border-dashed`
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor} ${col.id === 'disputa' ? 'animate-pulse' : ''}`} />
                    <h3 className="text-sm font-bold text-default">{col.label}</h3>
                  </div>
                  <span className="rounded-md bg-tertiary px-2 py-0.5 text-xs font-semibold text-secondary">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2.5 overflow-y-auto p-3 scrollbar-thin" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {colItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onViewItem(item)}
                      className={`group cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-card ${
                        draggedId === item.id ? 'opacity-40' : ''
                      } ${item.column === 'disputa' ? 'animate-pulse-red border-error/30' : ''}`}
                    >
                      {/* Card top */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <PortalBadge portal={item.portal} />
                        {item.column === 'disputa' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-error">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-error" />
                            AO VIVO
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-default leading-snug">{item.title}</h4>

                      {/* Info */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1 text-[11px] text-secondary">
                          <Building2 className="h-3 w-3 shrink-0 text-muted" />
                          <span className="truncate">{item.buyerOrgan}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {item.municipality} - RJ
                        </div>
                      </div>

                      {/* Value */}
                      <div className="mt-2 flex items-center justify-between rounded-md bg-secondary px-2 py-1.5">
                        <span className="text-[10px] text-muted">Valor</span>
                        <span className="text-sm font-bold text-primary">{formatBRL(item.estimatedValue)}</span>
                      </div>

                      {/* Footer */}
                      <div className="mt-2 flex items-center justify-between">
                        <CountdownTimer closesAt={item.closesAt} biddingStartsAt={item.biddingStartsAt} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickMove(item.id, item.column);
                          }}
                          className="flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary-light"
                          title="Mover para próxima coluna"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {colItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
                      <p className="text-xs text-muted">Arraste itens para cá</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
