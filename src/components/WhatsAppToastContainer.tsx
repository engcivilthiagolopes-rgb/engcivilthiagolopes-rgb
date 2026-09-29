import { useEffect, useState } from 'react';
import { MessageCircle, X, ArrowRight, Check } from 'lucide-react';
import { useProcurementSocket, type WhatsAppToastData } from '@/context/ProcurementContext';
import { formatBRL } from '@/data/mockData';

interface WhatsAppToastContainerProps {
  onOpenInFunnel: (itemId: string) => void;
}

export function WhatsAppToastContainer({ onOpenInFunnel }: WhatsAppToastContainerProps) {
  const { waToasts, dismissWaToast } = useProcurementSocket();

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[62] flex w-full max-w-xs flex-col gap-3">
      {waToasts.map((toast) => (
        <WhatsAppPhoneToast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissWaToast(toast.id)}
          onOpen={() => {
            onOpenInFunnel(toast.itemId);
            dismissWaToast(toast.id);
          }}
        />
      ))}
    </div>
  );
}

function WhatsAppPhoneToast({
  toast,
  onDismiss,
  onOpen,
}: {
  toast: WhatsAppToastData;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`pointer-events-auto overflow-hidden rounded-2xl border border-green-600/30 bg-card shadow-2xl transition-all duration-400 ${
        entering ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      {/* Phone notch bar */}
      <div className="flex items-center justify-between bg-green-600 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">MEU FILTRO Bot</p>
            <p className="text-[9px] text-white/70">online agora</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
          <span className="text-[9px] font-medium text-white/80">push</span>
          <button
            onClick={onDismiss}
            className="ml-1 rounded-md p-0.5 text-white/70 hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Message body */}
      <div className="relative bg-[#e5ddd5] px-3 py-3 dark:bg-gray-800">
        {/* Speech bubble tail */}
        <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 bg-[#e5ddd5] dark:bg-gray-800" />

        <div className="rounded-lg bg-white px-3 py-2.5 shadow-sm dark:bg-gray-700">
          <p className="text-[11px] font-bold text-red-600">
            ALERTA DE DISPENSA ELETRONICA RELAMPAGO
          </p>
          <div className="mt-1.5 space-y-0.5 text-[10px] leading-relaxed text-gray-700 dark:text-gray-200">
            <p>
              <span className="font-semibold">Orgao:</span> {toast.organ}
            </p>
            <p>
              <span className="font-semibold">Objeto:</span> {toast.objeto}
            </p>
            <p>
              <span className="font-semibold">Valor:</span> {formatBRL(toast.valor)}
            </p>
            <p>
              <span className="font-semibold">Margem Est:</span> ~{toast.margemEst}%
            </p>
            <p>
              <span className="font-semibold">Fase:</span> {toast.faseLances}
            </p>
          </div>
          <p className="mt-1.5 text-[9px] text-blue-600 underline">meufiltro.com.br</p>
          <p className="mt-0.5 text-right text-[8px] text-gray-400">
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{' '}
            <Check className="inline h-2.5 w-2.5 text-blue-500" />
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={onOpen}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 px-2 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-green-700"
          >
            Abrir no Funil
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
