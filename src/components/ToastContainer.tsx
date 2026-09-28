import { useEffect, useState } from 'react';
import { Zap, X, ArrowRight } from 'lucide-react';
import { useProcurementSocket, type ToastData } from '@/context/ProcurementContext';

interface ToastContainerProps {
  onOpenInFunnel: (itemId: string) => void;
}

export function ToastContainer({ onOpenInFunnel }: ToastContainerProps) {
  const { toasts, dismissToast } = useProcurementSocket();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onOpenInFunnel={() => {
            onOpenInFunnel(toast.itemId);
            dismissToast(toast.id);
          }}
        />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
  onOpenInFunnel,
}: {
  toast: ToastData;
  onDismiss: () => void;
  onOpenInFunnel: () => void;
}) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`pointer-events-auto overflow-hidden rounded-xl border border-primary/30 bg-card shadow-lg-card transition-all duration-300 ${
        entering ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      {/* Accent bar */}
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold text-primary">{toast.title}</span>
        <button
          onClick={onDismiss}
          className="ml-auto rounded-md p-0.5 text-muted hover:bg-tertiary"
          aria-label="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-default leading-snug">{toast.message}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onOpenInFunnel}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Abrir no Funil
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-tertiary"
          >
            Ignorar
          </button>
        </div>
      </div>
    </div>
  );
}
