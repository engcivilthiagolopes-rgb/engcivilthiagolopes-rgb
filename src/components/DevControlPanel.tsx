import { useState } from 'react';
import { ChevronUp, ChevronDown, Zap, Radio, Activity, Terminal } from 'lucide-react';
import { useProcurementSocket } from '@/context/ProcurementContext';

export function DevControlPanel() {
  const [open, setOpen] = useState(false);
  const { socketStatus, lastSync, items, injectUrgentItem } = useProcurementSocket();

  const triagemCount = items.filter((i) => i.column === 'triagem').length;
  const disputaCount = items.filter((i) => i.column === 'disputa').length;

  const handleInject = () => {
    const item = injectUrgentItem();
    console.log('[DEV] Dispensa urgente injetada:', item.id, item.title);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-[55] -translate-x-1/2">
      {/* Collapsed bar */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-t-lg border border-b-0 border-strong bg-card px-4 py-1.5 shadow-card transition-colors hover:bg-secondary"
        >
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-secondary">Dev Control Panel</span>
          <ChevronUp className="h-3.5 w-3.5 text-muted" />
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="w-[min(92vw,640px)] rounded-t-xl border border-b-0 border-strong bg-card shadow-lg-card">
          {/* Header */}
          <button
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between border-b px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-default">Developer Tech Control Panel</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>

          {/* Body */}
          <div className="space-y-3 p-4">
            {/* Status row */}
            <div className="grid grid-cols-3 gap-2">
              <StatusMetric
                icon={Radio}
                label="Socket"
                value={socketStatus === 'connected' ? 'CONECTADO' : 'RECONNECTING'}
                color={socketStatus === 'connected' ? 'text-success' : 'text-warning'}
              />
              <StatusMetric
                icon={Activity}
                label="Triagem"
                value={String(triagemCount)}
                color="text-primary"
              />
              <StatusMetric
                icon={Activity}
                label="Em Disputa"
                value={String(disputaCount)}
                color="text-error"
              />
            </div>

            {/* Sync info */}
            <div className="flex items-center justify-between rounded-lg border bg-secondary px-3 py-2 text-xs">
              <span className="text-muted">Última sincronização:</span>
              <span className="font-semibold text-secondary">
                {lastSync.toLocaleTimeString('pt-BR')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleInject}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                <Zap className="h-4 w-4" />
                Forçar Injeção de Dispensa Urgente
              </button>
            </div>

            <p className="text-center text-[10px] text-muted">
              Background worker ativo: polling a cada 45s · Bidding updates a cada 15-30s
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusMetric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Radio;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border bg-secondary p-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}
