import { useState } from 'react';
import {
  Bell,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Settings2,
  Shield,
  Tag,
  Zap,
} from 'lucide-react';
import type { AlertSettings, Cnae } from '@/types';
import { PERMANENT_FILTERS, USER_PROFILE } from '@/data/mockData';
import { Toggle } from '@/components/ui/Toggle';
import { formatBRL } from '@/data/mockData';

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
  const [testSent, setTestSent] = useState(false);

  const handleTest = () => {
    onTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const activeCount = cnaes.filter((c) => c.enabled).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-default">Filtros & Configuração</h1>
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
          <ProfileField label="Razão Social" value={USER_PROFILE.company} />
          <ProfileField label="CNPJ" value={USER_PROFILE.cnpj} />
          <ProfileField label="Responsável" value={USER_PROFILE.name} />
          <ProfileField label="E-mail" value={USER_PROFILE.email} />
          <ProfileField label="Telefone / WhatsApp" value={USER_PROFILE.phone} />
          <ProfileField label="Cargo" value={USER_PROFILE.role} />
        </div>
      </div>

      {/* Permanent Filters */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b bg-secondary px-5 py-3">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-default">Restrições Permanentes de Filtro</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <FilterField icon={MapPin} label="Estado" value={PERMANENT_FILTERS.state}>
            <span className="text-xs text-muted">Todos os {PERMANENT_FILTERS.municipalities} municípios</span>
          </FilterField>
          <FilterField icon={Tag} label="Modalidade" value={PERMANENT_FILTERS.modality}>
            <span className="text-xs text-muted">{PERMANENT_FILTERS.law}</span>
          </FilterField>
          <FilterField icon={Zap} label="Status" value={PERMANENT_FILTERS.status.join(', ')}>
            <span className="text-xs text-muted">Apenas editais ativos</span>
          </FilterField>
          <FilterField icon={Settings2} label="Orçamento Máximo" value={formatBRL(PERMANENT_FILTERS.maxBudget)}>
            <span className="text-xs text-muted">Por licitação</span>
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

      {/* Alert Integration */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b bg-secondary px-5 py-3">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-default">Canais de Alerta Automatizado</h2>
        </div>
        <div className="space-y-3 p-5">
          <AlertChannel
            icon={MessageCircle}
            name="WhatsApp Alerts"
            description="Receba notificações instantâneas no seu WhatsApp"
            color="text-green-600"
            bg="bg-green-500/10"
            checked={alerts.whatsapp}
            onChange={(v) => onAlertsChange({ ...alerts, whatsapp: v })}
          />
          <AlertChannel
            icon={Send}
            name="Telegram Bot"
            description="Bot dedicado envia alertas em tempo real"
            color="text-blue-600"
            bg="bg-blue-500/10"
            checked={alerts.telegram}
            onChange={(v) => onAlertsChange({ ...alerts, telegram: v })}
          />
          <AlertChannel
            icon={Bell}
            name="Push do Navegador"
            description="Notificações nativas do navegador"
            color="text-amber-600"
            bg="bg-amber-500/10"
            checked={alerts.push}
            onChange={(v) => onAlertsChange({ ...alerts, push: v })}
          />
          <AlertChannel
            icon={Mail}
            name="E-mail"
            description="Resumo diário de novas oportunidades"
            color="text-purple-600"
            bg="bg-purple-500/10"
            checked={alerts.email}
            onChange={(v) => onAlertsChange({ ...alerts, email: v })}
          />

          <div className="mt-4 flex items-center justify-between rounded-lg border bg-tertiary p-4">
            <div>
              <p className="text-sm font-semibold text-default">Notificação de Teste</p>
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
                  Testar Notificação
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border bg-secondary p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-sm font-medium ${highlight ? 'text-primary' : 'text-default'}`}>{value}</p>
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

function AlertChannel({
  icon: Icon,
  name,
  description,
  color,
  bg,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  name: string;
  description: string;
  color: string;
  bg: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-default">{name}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={name} />
    </div>
  );
}
