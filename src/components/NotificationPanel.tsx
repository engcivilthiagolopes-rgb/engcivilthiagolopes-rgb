import { useEffect, useState } from 'react';
import { AlertTriangle, FileText, TrendingDown, Trophy, X } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'new' | 'closing' | 'low_competition' | 'won';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
}

const typeConfig = {
  new: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  closing: { icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10' },
  low_competition: { icon: TrendingDown, color: 'text-warning', bg: 'bg-warning/10' },
  won: { icon: Trophy, color: 'text-success', bg: 'bg-success/10' },
};

export function NotificationPanel({ isOpen, onClose, notifications }: NotificationPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm flex-col bg-card shadow-lg-card transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-bold text-default">Notificações</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-tertiary"
            aria-label="Fechar notificações"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <Bell className="h-8 w-8 text-muted" />
              <p className="text-sm text-muted">Nenhuma notificação no momento</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const config = typeConfig[n.type];
                const Icon = config.icon;
                return (
                  <div key={n.id} className="flex gap-3 p-4 hover:bg-secondary transition-colors">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-default">{n.title}</p>
                      <p className="mt-0.5 text-xs text-secondary">{n.message}</p>
                      <p className="mt-1 text-[10px] text-muted">
                        {n.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { Bell } from 'lucide-react';
