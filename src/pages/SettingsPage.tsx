import { useState } from 'react';
import {
  Bell,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Settings2,
  Shield,
  SlidersHorizontal,
  Tag,
  Zap,
} from 'lucide-react';
import type { AlertSettings, Cnae } from '@/types';
import { PERMANENT_FILTERS, USER_PROFILE, formatBRL } from '@/data/mockData';
import { Toggle } from '@/components/ui/Toggle';
import { useProcurementSocket } from '@/context/ProcurementContext';
import { MessagePreview } from '@/components/MessagePreview';

interface SettingsPageProps {
  cnaes: Cnae[];
  onToggleCnae: (id: string) => void;
  alerts: AlertSettings;
  onAlertsChange: (alerts: AlertSettings) => void;
  onTestNotification: () => void;
}

export function SettingsPage({
  cnaes,
  onToggleCnae,
  alerts,
  onAlertsChange,
  onTestNotification,
}: SettingsPageProps) {
  const {
    channelConfig,
    setChannelConfig,
    testMessageState,
    sendTestMessage,
    injectUrgentItem,
  } = useProcurementSocket();

  const [testSent, setTestSent] = useState(false);

  const handleTest = () => {
    onTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleWhatsAppTest = () => {
    sendTestMessage();
  };

  const handleInjectPreview = () => {
    injectUrgentItem();
  };

  const activeCount = cnaes.filter((c) => c.enabled).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-default">Filtros & Configuracao</h1>
        <p className="mt-1 text-sm text-muted">
          Gerencie seu perfil, CNAEs monitorados e canais de alerta
        </p>
      </div>

      {/* User Profile */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b bg-secondary px-5 py-3">
          <Building2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-default">Perfil Cadastrado</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="Razao Social" value={USER_PROFILE.company} />
          <ProfileField label="CNPJ" value={USER_PROFILE.cnpj} />
          <ProfileField label="Responsavel" value={USER_PROFILE.name} />
          <ProfileField label="E-mail" value={USER_PROFILE.email} />
          <ProfileField label="Telefone / WhatsApp" value={USER_PROFILE.phone} />
          <ProfileField label="Cargo" value={USER_PROFILE.role} />
        </div>
      </div>

      {/* Permanent Filters */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b bg-secondary px-5 py-3">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-default">Restricoes Permanentes de Filtro</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <FilterField icon={MapPin} label="Estado" value={PERMANENT_FILTERS.state}>
            <span className="text-xs text-muted">Todos os {PERMANENT_FILTERS.municipalities} municipios</span>
          </FilterField>
          <FilterField icon={Tag} label="Modalidade" value={PERMANENT_FILTERS.modality}>
            <span className="text-xs text-muted">{PERMANENT_FILTERS.law}</span>
          </FilterField>
          <FilterField icon={Zap} label="Status" value={PERMANENT_FILTERS.status.join(', ')}>
            <span className="text-xs text-muted">Apenas editais ativos</span>
          </FilterField>
          <FilterField icon={Settings2} label="Orcamento Maximo" value={formatBRL(PERMANENT_FILTERS.maxBudget)}>
            <span className="text-xs text-muted">Por licitacao</span>
          </FilterField>
        </div>
      </div>

      {/* CNAEs */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b bg-secondary px-5 py-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-default">CNAEs Monitorados</h2>
          </div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {activeCount} de {cnaes.length} ativos
          </span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {cnaes.map((cnae) => (
            <div
              key={cnae.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                cnae.enabled
                  ? 'border-primary/30 bg-primary-light'
                  : 'border-default bg-secondary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                    cnae.enabled
                      ? 'bg-primary text-white'
                      : 'bg-tertiary text-muted'
                  }`}
                >
                  {cnae.code.split('-')[0].slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-default">{cnae.name}</p>
                  <p className="text-xs text-muted">CNAE {cnae.code}</p>
                </div>
              </div>
              <Toggle
                checked={cnae.enabled}
                onChange={() => onToggleCnae(cnae.id)}
                label={`Alternar ${cnae.name}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Channel Instant Dispatch Configuration */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b bg-secondary px-5 py-3">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-default">
            Configuracao de Disparos Instantaneos
          </h2>
        </div>
        <div className="space-y-5 p-5">
          {/* WhatsApp Integration */}
          <div className="rounded-lg border border-green-600/20 bg-green-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-default">WhatsApp Business API</p>
                  <p className="text-xs text-muted">Notificacoes instantaneas no celular</p>
                </div>
              </div>
              <Toggle
                checked={channelConfig.whatsapp.enabled}
                onChange={(v) =>
                  setChannelConfig({
                    ...channelConfig,
                    whatsapp: { ...channelConfig.whatsapp, enabled: v },
                  })
                }
                label="Ativar WhatsApp"
              />
            </div>

            {/* Status badge + phone input */}
            {channelConfig.whatsapp.enabled && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                    API Conectada: Instancia Ativa
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="text-xs font-semibold text-secondary">Numero destino:</label>
                  <div className="flex flex-1 items-center gap-2 rounded-lg border bg-secondary px-3 py-2">
                    <Phone className="h-3.5 w-3.5 text-muted" />
                    <input
                      type="text"
                      value={channelConfig.whatsapp.phoneNumber}
                      onChange={(e) =>
                        setChannelConfig({
                          ...channelConfig,
                          whatsapp: { ...channelConfig.whatsapp, phoneNumber: e.target.value },
                        })
                      }
                      className="flex-1 bg-transparent text-sm text-default placeholder:text-muted focus:outline-none"
                      placeholder="(21) 99999-9999"
                    />
                  </div>
                </div>

                {/* Test message button with loading/success states */}
                <button
                  onClick={handleWhatsAppTest}
                  disabled={testMessageState.status === 'loading'}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                    testMessageState.status === 'success'
                      ? 'bg-success text-white'
                      : testMessageState.status === 'loading'
                        ? 'bg-secondary text-secondary cursor-wait'
                        : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {testMessageState.status === 'loading' && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando pacote de dados...
                    </>
                  )}
                  {testMessageState.status === 'success' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Mensagem disparada com sucesso para a fila da API!
                    </>
                  )}
                  {testMessageState.status === 'idle' && (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Mensagem de Teste
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Telegram Bot Integration */}
          <div className="rounded-lg border border-blue-600/20 bg-blue-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-default">Telegram Bot</p>
                  <p className="text-xs text-muted">Bot dedicado envia alertas em tempo real</p>
                </div>
              </div>
              <Toggle
                checked={channelConfig.telegram.enabled}
                onChange={(v) =>
                  setChannelConfig({
                    ...channelConfig,
                    telegram: { ...channelConfig.telegram, enabled: v },
                  })
                }
                label="Ativar Telegram"
              />
            </div>

            {channelConfig.telegram.enabled && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="text-xs font-semibold text-secondary">Chat ID:</label>
                  <div className="flex flex-1 items-center gap-2 rounded-lg border bg-secondary px-3 py-2">
                    <span className="text-sm text-muted">@</span>
                    <input
                      type="text"
                      value={channelConfig.telegram.chatId.replace('@', '')}
                      onChange={(e) =>
                        setChannelConfig({
                          ...channelConfig,
                          telegram: { ...channelConfig.telegram, chatId: `@${e.target.value.replace('@', '')}` },
                        })
                      }
                      className="flex-1 bg-transparent text-sm text-default placeholder:text-muted focus:outline-none"
                      placeholder="matiaslicitacoes"
                    />
                  </div>
                </div>

                <a
                  href="https://t.me/meufiltro_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Abrir @meufiltro_bot no Telegram
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Minimum ROI Filter */}
          <div className="rounded-lg border bg-secondary p-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold text-default">
                Filtro de Margem Minima para Alertas
              </p>
            </div>
            <p className="mt-1 text-xs text-muted">
              Apenas alertar no celular se a margem estimada do distribuidor for superior ao valor definido
            </p>

            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={channelConfig.minMarginROI}
                onChange={(e) =>
                  setChannelConfig({ ...channelConfig, minMarginROI: Number(e.target.value) })
                }
                className="flex-1 accent-primary"
              />
              <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-1.5">
                <span className="text-lg font-bold text-primary">{channelConfig.minMarginROI}</span>
                <span className="text-sm font-semibold text-muted">%</span>
              </div>
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-muted">
              <span>5% (mais alertas)</span>
              <span>40% (apenas alta margem)</span>
            </div>
          </div>

          {/* Legacy alert channels */}
          <div className="border-t pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Outros Canais
            </p>
            <div className="space-y-2">
              <SimpleAlertRow
                icon={Bell}
                name="Push do Navegador"
                color="text-amber-600"
                bg="bg-amber-500/10"
                checked={alerts.push}
                onChange={(v) => onAlertsChange({ ...alerts, push: v })}
              />
              <SimpleAlertRow
                icon={Mail}
                name="E-mail"
                color="text-sky-600"
                bg="bg-sky-500/10"
                checked={alerts.email}
                onChange={(v) => onAlertsChange({ ...alerts, email: v })}
              />
            </div>
          </div>

          {/* Test notification */}
          <div className="flex items-center justify-between rounded-lg border bg-tertiary p-4">
            <div>
              <p className="text-sm font-semibold text-default">Notificacao de Teste</p>
              <p className="text-xs text-muted">Simule o recebimento de um novo edital</p>
            </div>
            <button
              onClick={handleTest}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                testSent
                  ? 'bg-success text-white'
                  : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              {testSent ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Enviado!
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Testar Notificacao
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Message Preview */}
      <MessagePreview />

      {/* Inject for preview button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={handleInjectPreview}
          className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold text-secondary shadow-card transition-all hover:bg-secondary"
        >
          <Zap className="h-4 w-4 text-primary" />
          Injetar Dispensa para Atualizar Preview
        </button>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-secondary p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-default">{value}</p>
    </div>
  );
}

function FilterField({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-secondary p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      </div>
      <p className="mt-1 text-sm font-bold text-default">{value}</p>
      {children}
    </div>
  );
}

function SimpleAlertRow({
  icon: Icon,
  name,
  color,
  bg,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  name: string;
  color: string;
  bg: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <p className="text-sm font-semibold text-default">{name}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={name} />
    </div>
  );
}
