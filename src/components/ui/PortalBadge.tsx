import type { Portal } from '@/types';

const portalStyles: Record<Portal, { bg: string; text: string; border: string; label: string }> = {
  'PNCP': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border border-blue-500/20',
    label: 'PNCP',
  },
  'Compras.gov.br': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border border-emerald-500/20',
    label: 'Compras.gov.br',
  },
  'SIGA-RJ': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border border-amber-500/20',
    label: 'SIGA-RJ',
  },
};

export function PortalBadge({ portal }: { portal: Portal }) {
  const style = portalStyles[portal];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  );
}
