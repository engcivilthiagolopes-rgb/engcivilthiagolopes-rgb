import { Bell, Menu, Moon, RefreshCw, Search, Sun, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { USER_PROFILE } from '@/data/mockData';
import { useProcurementSocket } from '@/context/ProcurementContext';

interface HeaderProps {
  onMenuClick: () => void;
  notificationCount: number;
  onNotificationClick: () => void;
}

export function Header({ onMenuClick, notificationCount, onNotificationClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { socketStatus, lastSync } = useProcurementSocket();

  const isConnected = socketStatus === 'connected';
  const syncTime = lastSync.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-tertiary lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 rounded-lg border bg-secondary px-3 py-1.5">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar licitação, órgão, CNAE..."
            className="w-48 bg-transparent text-sm text-default placeholder:text-muted focus:outline-none lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Sync Indicator */}
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors ${
            isConnected
              ? 'border-success/20 bg-success/5'
              : 'border-warning/20 bg-warning/5'
          }`}
          title={isConnected ? 'PNCP Live Sync Active' : 'Reconnecting to PNCP...'}
        >
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5 text-success" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-warning" />
          )}
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'
              }`}
            />
            <span className={`font-semibold ${isConnected ? 'text-success' : 'text-warning'}`}>
              {isConnected ? 'PNCP Live Sync Active' : 'Reconnecting...'}
            </span>
          </div>
        </div>

        {/* Last sync time */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border bg-secondary px-3 py-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-success" />
          <div className="text-xs">
            <span className="font-semibold text-secondary">Sincronizado</span>
            <span className="text-muted"> · {syncTime}</span>
          </div>
        </div>

        {/* Portal dots */}
        <div className="hidden lg:flex items-center gap-1.5">
          <PortalSyncDot label="PNCP" color="bg-blue-500" />
          <PortalSyncDot label="Compras.gov" color="bg-emerald-500" />
          <PortalSyncDot label="SIGA-RJ" color="bg-amber-500" />
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-secondary hover:bg-tertiary transition-colors"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button
          onClick={onNotificationClick}
          className="relative rounded-lg p-2 text-secondary hover:bg-tertiary transition-colors"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 rounded-lg border bg-secondary py-1 pl-1 pr-2 sm:pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
            {USER_PROFILE.avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-default">{USER_PROFILE.name}</p>
            <p className="text-[10px] text-muted">{USER_PROFILE.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function PortalSyncDot({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-1" title={`Sincronizando com ${label}`}>
      <span className={`h-2 w-2 rounded-full ${color} animate-pulse`} />
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  );
}
