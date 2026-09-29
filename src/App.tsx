import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProcurementProvider, useProcurementSocket } from '@/context/ProcurementContext';
import { Sidebar, type Page } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NotificationPanel } from '@/components/NotificationPanel';
import { DetailModal } from '@/components/DetailModal';
import { ToastContainer } from '@/components/ToastContainer';
import { WhatsAppToastContainer } from '@/components/WhatsAppToastContainer';
import { DevControlPanel } from '@/components/DevControlPanel';
import { DashboardPage } from '@/pages/DashboardPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { UrgentPage } from '@/pages/UrgentPage';
import { SettingsPage } from '@/pages/SettingsPage';
// 👇 NOVA IMPORTAÇÃO: Ícone para a listagem B2B de suporte
import { Truck, Mail, Phone, Tag } from 'lucide-react';
import type { KanbanColumn, ProcurementItem } from '@/types';

// 👇 COMPONENTE INTERNO DA NOVA PÁGINA DE FORNECEDORES POR CNAE
function SuppliersPage() {
  const fornecedores = [
    {
      id: 'f1',
      nome: 'Atacadão Posto 13 Distribuidora',
      cnae: '4761-0/03',
      ramo: 'Papelaria e Escritório',
      contato: 'comercial@posto13atacado.com.br',
      telefone: '(21) 98484-9303',
      regiao: 'Região Metropolitana e Baixada Fluminense',
      itens: ['Papel A4/Ofício', 'Pastas AZ', 'Bobinas Térmicas', 'Envelopes']
    },
    {
      id: 'f2',
      nome: 'Rio Elétrica & Insumos Industriais',
      cnae: '4742-3/00',
      ramo: 'Material Elétrico',
      contato: 'b2b@rioeletricainsumos.com',
      telefone: '(21) 2233-4455',
      regiao: 'Capital, Niterói e São Gonçalo',
      itens: ['Lâmpadas LED', 'Cabos Flexíveis', 'Disjuntores DIN', 'Canaletas PVC']
    },
    {
      id: 'f3',
      nome: 'Norte Hidráulica Distribuição',
      cnae: '4744-0/03',
      ramo: 'Material Hidráulico',
      contato: 'cotacao@nortehidraulica.com.br',
      telefone: '(24) 2244-5566',
      regiao: 'Baixada Fluminense e Região Serrana',
      itens: ['Tubos PVC Soldáveis', 'Torneiras ABS/Metal', 'Registros', 'Ralos e Grelhas']
    },
    {
      id: 'f4',
      nome: 'Supratudo Tecnologia & Informática',
      cnae: '4751-2/01',
      ramo: 'Informática e Automação',
      contato: 'atendimento@supratudob2b.com.br',
      telefone: '(21) 4004-9876',
      regiao: 'Fulfillment e Entrega em Todo o Estado do RJ',
      itens: ['Toners Compatíveis', 'Cartuchos de Tinta', 'Mouses e Teclados', 'SSDs']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Truck className="text-blue-500" /> Fornecedores Vinculados aos CNAEs
        </h2>
        <p className="text-sm text-slate-400">Distribuidores atacadistas mapeados para atendimento no Rio de Janeiro.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {fornecedores.map((fornecedor) => (
          <div key={fornecedor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-100">{fornecedor.nome}</h3>
                  <span className="text-xs text-blue-400 font-semibold">{fornecedor.ramo}</span>
                </div>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                  CNAE {fornecedor.cnae}
                </span>
              </div>

              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/60 text-xs space-y-2">
                <div className="text-slate-300 font-medium">🚚 Logística: {fornecedor.regiao}</div>
                <div className="text-slate-400 flex items-center gap-1.5"><Phone size={12} className="text-emerald-400" /> {fornecedor.telefone}</div>
                <div className="text-slate-400 flex items-center gap-1.5"><Mail size={12} className="text-blue-400" /> {fornecedor.contato}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1"><Tag size={10} /> Insumos Mapeados</span>
                <div className="flex flex-wrap gap-1.5">
                  {fornecedor.itens.map((item, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md font-medium">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const prevItemIdsRef = useRef<Set<string>>(new Set(items.map((i) => i.id)));

  useEffect(() => {
    // Substitua ou adicione este bloco para sincronização contínua na Vercel
useEffect(() => {
  // 1. Faz a primeira busca imediatamente ao carregar a página
  carregarDados();

  // 2. Cria um temporizador que "acorda" a cada 2 minutos (120000ms) 
  // para bater na API do PNCP e trazer as novas licitações em tempo real
  const sincronizadorGeral = setInterval(() => {
    console.log("🔄 MEU FILTRO - Buscando novas dispensas em andamento no RJ...");
    buscarDispensasReaisRJ().then(novosDados => {
      setLicitacoes(novosDados);
    });
  }, 120000); 

  // Limpa o processo caso a página seja fechada, evitando travar o navegador
  return () => clearInterval(sincronizadorGeral);
}, []);

    const currentIds = new Set(items.map((i) => i.id));
    const newIds = new Set<string>();
    currentIds.forEach((id) => {
      if (!prevItemIdsRef.current.has(id)) {
        newIds.add(id);
      }
    });
    if (newIds.size > 0) {
      setNewItemIds((prev) => new Set([...prev, ...newIds]));
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
          {/* 👇 NOVA ROTA: SE A PAGE ATIVA FOR FORNECEDORES, SEU PAINEL EXIBE O NOVO COMPONENTE B2B */}
          {page === 'fornecedores' && <SuppliersPage />}
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
      <WhatsAppToastContainer onOpenInFunnel={handleOpenInFunnel} />
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
