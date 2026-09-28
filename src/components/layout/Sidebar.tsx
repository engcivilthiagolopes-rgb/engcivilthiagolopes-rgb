import { LayoutDashboard, KanbanSquare, Zap, SlidersHorizontal, X } from 'lucide-react';

export type Page = 'dashboard' | 'kanban' | 'urgent' | 'settings';

interface SidebarProps {
  active: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard, description: 'BI e mercado' },
  { id: 'kanban', label: 'Kanban de Licitações', icon: KanbanSquare, description: 'Funil de compras' },
  { id: 'urgent', label: 'Compras Urgentes', icon: Zap, description: 'Tempo real' },
  { id: 'settings', label: 'Filtros & Config', icon: SlidersHorizontal, description: 'CNAEs e alertas' },
];

export function Sidebar({ active, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
              MF
            </div>
            <div>
              <h1 className="text-sm font-bold text-default">MEU FILTRO</h1>
              <p className="text-xs text-muted">GovTech Procurement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-tertiary lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 scrollbar-thin">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Navegação
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:bg-tertiary'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-muted group-hover:text-primary'}`} />
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-default'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-white/70' : 'text-muted'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-xl bg-tertiary p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary">Plano Pro</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">ATIVO</span>
            </div>
            <p className="text-xs text-muted">Monitoramento ilimitado · 92 municípios</p>
          </div>
        </div>
      </aside>
    </>
  );
}
