import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AlertSettings, Cnae, KanbanColumn, MultiChannelAlertConfig, ProcurementItem, Portal } from '@/types';
import { INITIAL_CNAES, INITIAL_ITEMS } from '@/data/mockData';
import { generateProcurementItem } from '@/data/generator';
import type { AppNotification } from '@/components/NotificationPanel';

export type SocketStatus = 'connected' | 'reconnecting';

export interface ToastData {
  id: string;
  title: string;
  message: string;
  itemId: string;
}

export interface WhatsAppToastData {
  id: string;
  organ: string;
  objeto: string;
  cnaeName: string;
  valor: number;
  margemEst: number;
  faseLances: string;
  itemId: string;
}

export interface TestMessageState {
  status: 'idle' | 'loading' | 'success';
}

interface ProcurementContextValue {
  // Items
  items: ProcurementItem[];
  addItem: (item: ProcurementItem) => void;
  moveItem: (id: string, column: KanbanColumn) => void;
  updateItem: (id: string, patch: Partial<ProcurementItem>) => void;

  // CNAEs
  cnaes: Cnae[];
  toggleCnae: (id: string) => void;

  // Alerts
  alerts: AlertSettings;
  setAlerts: (alerts: AlertSettings) => void;

  // Multi-channel alert config
  channelConfig: MultiChannelAlertConfig;
  setChannelConfig: (cfg: MultiChannelAlertConfig) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (n: AppNotification) => void;
  clearNotifications: () => void;

  // Socket
  socketStatus: SocketStatus;
  lastSync: Date;

  // Toasts
  toasts: ToastData[];
  dismissToast: (id: string) => void;

  // WhatsApp toasts
  waToasts: WhatsAppToastData[];
  dismissWaToast: (id: string) => void;

  // Test message
  testMessageState: TestMessageState;
  sendTestMessage: () => void;

  // Manual injection
  injectUrgentItem: () => ProcurementItem;
}

const ProcurementContext = createContext<ProcurementContextValue | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'new',
    title: 'Nova Dispensa Eletrônica',
    message: 'Câmara Municipal de Cantagalo - Papelaria e Escritório',
    timestamp: new Date(Date.now() - 5 * 60_000),
  },
  {
    id: 'n2',
    type: 'closing',
    title: 'Edital encerra em 30 minutos',
    message: 'Prefeitura de Niterói - Produtos de Limpeza',
    timestamp: new Date(Date.now() - 12 * 60_000),
  },
  {
    id: 'n3',
    type: 'low_competition',
    title: 'Baixa concorrência detectada',
    message: 'Nova Friburgo: apenas 1 competidor identificado',
    timestamp: new Date(Date.now() - 25 * 60_000),
  },
];

export function ProcurementProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProcurementItem[]>(INITIAL_ITEMS);
  const [cnaes, setCnaes] = useState<Cnae[]>(INITIAL_CNAES);
  const [alerts, setAlerts] = useState<AlertSettings>({
    whatsapp: true,
    telegram: false,
    push: true,
    email: true,
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('connected');
  const [lastSync, setLastSync] = useState(new Date());
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [waToasts, setWaToasts] = useState<WhatsAppToastData[]>([]);
  const [channelConfig, setChannelConfig] = useState<MultiChannelAlertConfig>({
    whatsapp: {
      enabled: true,
      phoneNumber: '(21) 98675-9394',
      apiConnected: true,
    },
    telegram: {
      enabled: false,
      chatId: '@matiaslicitacoes',
    },
    minMarginROI: 15,
  });
  const [testMessageState, setTestMessageState] = useState<TestMessageState>({ status: 'idle' });

  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;
  const channelConfigRef = useRef(channelConfig);
  channelConfigRef.current = channelConfig;

  // --- Core mutations ---

  const addItem = useCallback((item: ProcurementItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const moveItem = useCallback((id: string, column: KanbanColumn) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, column } : i)));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<ProcurementItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const toggleCnae = useCallback((id: string) => {
    setCnaes((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  }, []);

  const addNotification = useCallback((n: AppNotification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissWaToast = useCallback((id: string) => {
    setWaToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Toast + notification pipeline ---

  const emitNewDispensa = useCallback(
    (item: ProcurementItem) => {
      // Add item to top of Triagem
      addItem({ ...item, column: 'triagem' });

      // Push notification
      addNotification({
        id: `n${Date.now()}`,
        type: 'new',
        title: 'Nova Dispensa Eletrônica',
        message: `${item.buyerOrgan} - ${formatCnaeName(item.cnaeMatch)} - ${formatBRLShort(item.estimatedValue)}`,
        timestamp: new Date(),
      });

      // Show toast
      const toastId = `t${Date.now()}`;
      setToasts((prev) => [
        ...prev,
        {
          id: toastId,
          title: 'NOVA DISPENSA DETECTADA',
          message: `${item.buyerOrgan} - ${formatCnaeName(item.cnaeMatch)} - ${formatBRLShort(item.estimatedValue)}`,
          itemId: item.id,
        },
      ]);

      // Auto-dismiss toast after 8 seconds
      setTimeout(() => dismissToast(toastId), 8000);

      // --- Multi-channel alert routing ---
      // If WhatsApp alerts are enabled and the estimated margin exceeds the ROI threshold,
      // trigger a smartphone-style WhatsApp push toast.
      const cfg = channelConfigRef.current;
      const estimatedMargin = estimateMargin(item);
      if (cfg.whatsapp.enabled && cfg.whatsapp.apiConnected && estimatedMargin >= cfg.minMarginROI) {
        const waId = `wa${Date.now()}`;
        setWaToasts((prev) => [
          ...prev,
          {
            id: waId,
            organ: `${item.buyerOrgan} - RJ`,
            objeto: `[${formatCnaeName(item.cnaeMatch)}] ${item.title}`,
            cnaeName: formatCnaeName(item.cnaeMatch),
            valor: item.estimatedValue,
            margemEst: estimatedMargin,
            faseLances: formatBiddingTime(item.biddingStartsAt, item.closesAt),
            itemId: item.id,
          },
        ]);
        setTimeout(() => dismissWaToast(waId), 12000);
      }
    },
    [addItem, addNotification, dismissToast, dismissWaToast],
  );

  // --- Manual injection ---

  const injectUrgentItem = useCallback(() => {
    const item = generateProcurementItem(true);
    emitNewDispensa(item);
    return item;
  }, [emitNewDispensa]);

  // --- Background worker: poll every 45 seconds ---

  useEffect(() => {
    const poll = () => {
      setLastSync(new Date());

      // Simulate occasional reconnect
      if (Math.random() < 0.05) {
        setSocketStatus('reconnecting');
        setTimeout(() => setSocketStatus('connected'), 2000 + Math.random() * 2000);
      }

      // 50% chance to find a new opportunity on each poll
      if (Math.random() < 0.5) {
        const item = generateProcurementItem(false);
        emitNewDispensa(item);
      }
    };

    const interval = setInterval(poll, 45_000);
    return () => clearInterval(interval);
  }, [emitNewDispensa]);

  // --- Live bidding simulation: update competing prices every 15-30 seconds ---

  useEffect(() => {
    const updateBiddingPrices = () => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.column !== 'disputa') return item;
          // Drop the current low-bid value by a random safe interval (0.5% - 3%)
          const dropPercent = 0.005 + Math.random() * 0.025;
          const newValue = Math.round(item.estimatedValue * (1 - dropPercent));
          return {
            ...item,
            estimatedValue: Math.max(newValue, Math.round(item.estimatedValue * 0.7)),
            competitorCount: item.competitorCount + (Math.random() < 0.3 ? 1 : 0),
          };
        }),
      );
    };

    const interval = setInterval(updateBiddingPrices, 15_000 + Math.random() * 15_000);
    return () => clearInterval(interval);
  }, []);

  const sendTestMessage = useCallback(() => {
    setTestMessageState({ status: 'loading' });
    setTimeout(() => {
      setTestMessageState({ status: 'success' });
      setTimeout(() => setTestMessageState({ status: 'idle' }), 3000);
    }, 2500);
  }, []);

  const value: ProcurementContextValue = {
    items,
    addItem,
    moveItem,
    updateItem,
    cnaes,
    toggleCnae,
    alerts,
    setAlerts,
    channelConfig,
    setChannelConfig,
    notifications,
    addNotification,
    clearNotifications,
    socketStatus,
    lastSync,
    toasts,
    dismissToast,
    waToasts,
    dismissWaToast,
    testMessageState,
    sendTestMessage,
    injectUrgentItem,
  };

  return <ProcurementContext.Provider value={value}>{children}</ProcurementContext.Provider>;
}

export function useProcurementSocket() {
  const ctx = useContext(ProcurementContext);
  if (!ctx) throw new Error('useProcurementSocket must be used within ProcurementProvider');
  return ctx;
}

// --- Helpers ---

function formatBRLShort(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function estimateMargin(_item: ProcurementItem): number {
  return 15 + Math.floor(Math.random() * 20);
}

function formatBiddingTime(biddingStartsAt: string | null, closesAt: string): string {
  const target = biddingStartsAt || closesAt;
  const date = new Date(target);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return isToday ? `HOJE às ${time} (Prazo Curto!)` : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ` às ${time}`;
}

function formatCnaeName(code: string): string {
  const names: Record<string, string> = {
    '4761-0/03': 'Papelaria e Escritório',
    '4754-7/01': 'Móveis Corporativos',
    '4789-0/05': 'Limpeza e Higiene',
    '4744-0/01': 'Ferragens e Ferramentas',
    '4742-3/00': 'Material Elétrico',
    '4744-0/03': 'Material Hidráulico',
    '4741-5/00': 'Construção Geral e Pintura',
    '4789-0/07': 'Informática e Automação',
  };
  return names[code] || code;
}
