import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProcurementProvider, useProcurementSocket } from '@/context/ProcurementContext';
import { Sidebar, type Page } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NotificationPanel } from '@/components/NotificationPanel';
import { DetailModal } from '@/components/DetailModal';
import { ToastContainer } from '@/components/ToastContainer';
import { DevControlPanel } from '@/components/DevControlPanel';
import { DashboardPage } from '@/pages/DashboardPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { UrgentPage } from '@/pages/UrgentPage';
import { SettingsPage } from '@/pages/SettingsPage';
import type { KanbanColumn, ProcurementItem } from '@/types';

function AppContent() {
  const {
    items,
    moveItem,
    cnaes,
    toggleCnae,
    alerts,
    setAlerts,
    notifications,
    addNotification,
    socketStatus,
    lastSync,
    injectUrgentItem,
  } = useProcurementSocket();

  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProcurementItem | null>(null);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

  // Track which items are "new" for the fade-in animation
  const prevItemIdsRef = useRef<Set<string>>(new Set(items.map((i) => i.id)));

  useEffect(() => {
    const currentIds = new Set(items.map((i) => i.id));
    const newIds = new Set<string>();
    currentIds.forEach((id) => {
      if (!prevItemIdsRef.current.has(id)) {
        newIds.add(id);
      }
    });
    if (newIds.size > 0) {
      setNewItemIds((prev) => new Set([...prev, ...newIds]));
      // Clear "new" badge after 5 seconds
      setTimeout(() => {
        setNewItemIds((prev) => {
          const next = new Set(prev);
          newIds.forEach((id) => next.delete(id));
          return next;
        });
      }, 5000);
    }
    prevItemIdsRef.current = currentIds;
  }, [items]);

  const handleSendToKanban = useCallback(
    (id: string) => {
      moveItem(id, 'triagem');
      setPage('kanban');
    },
    [moveItem],
  );

  const handleOpenInFunnel = useCallback(
    (itemId: string) => {
      handleSendToKanban(itemId);
    },
    [handleSendToKanban],
  );

  const handleTestNotification = useCallback(() => {
    const item = injectUrgentItem();
    window.alert(
      'MEU FILTRO - Nova notificação!\n\nNova Dispensa Eletrônica detectada:\n' +
        item.buyerOrgan +
        '\nValor: R$ ' +
        item.estimatedValue.toLocaleString('pt-BR') +
        '\nEncerra em breve\n\nCanais ativos: WhatsApp, Push, E-mail',
    );
  }, [injectUrgentItem]);

  const handleNavigate = (p: Page) => {
    setPage(p);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={notifications.length}
          onNotificationClick={() => setNotifOpen(true)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'kanban' && (
            <KanbanPage
              items={items}
              onMoveItem={moveItem}
              onViewItem={setSelectedItem}
              newItemIds={newItemIds}
            />
          )}
          {page === 'urgent' && (
            <UrgentPage
              items={items}
              onViewItem={setSelectedItem}
              onSendToKanban={handleSendToKanban}
            />
          )}
          {page === 'settings' && (
            <SettingsPage
              cnaes={cnaes}
              onToggleCnae={toggleCnae}
              alerts={alerts}
              onAlertsChange={setAlerts}
              onTestNotification={handleTestNotification}
            />
          )}
        </main>
      </div>

      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />
      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSendToKanban={handleSendToKanban}
      />
      <ToastContainer onOpenInFunnel={handleOpenInFunnel} />
      <DevControlPanel />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProcurementProvider>
        <AppContent />
      </ProcurementProvider>
    </ThemeProvider>
  );
}
