interface StatPillProps {
  riskScore: number;
}

export function RiskBadge({ riskScore }: StatPillProps) {
  const level = riskScore < 30 ? 'low' : riskScore < 50 ? 'medium' : 'high';
  const config = {
    low: { label: 'Baixo Risco', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    medium: { label: 'Médio Risco', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    high: { label: 'Alto Risco', bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
  }[level];

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}>
      {config.label} · {riskScore}/100
    </span>
  );
}
