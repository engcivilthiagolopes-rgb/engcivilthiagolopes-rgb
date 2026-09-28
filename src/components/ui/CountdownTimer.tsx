import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  closesAt: string;
  biddingStartsAt?: string | null;
}

export function CountdownTimer({ closesAt, biddingStartsAt }: CountdownProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const closeTime = new Date(closesAt).getTime();
  const diff = closeTime - now;

  if (diff <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-error/10 px-2 py-1 text-xs font-bold text-error">
        <span className="h-1.5 w-1.5 rounded-full bg-error" />
        Encerrado
      </span>
    );
  }

  const hours = Math.floor(diff / 3600_000);
  const minutes = Math.floor((diff % 3600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  const isUrgent = hours < 1;
  const isSoon = hours < 4;

  const colorClass = isUrgent
    ? 'bg-error/10 text-error border-error/20'
    : isSoon
      ? 'bg-warning/10 text-warning border-warning/20'
      : 'bg-primary/10 text-primary border-primary/20';

  if (biddingStartsAt) {
    const bidTime = new Date(biddingStartsAt).getTime();
    if (bidTime > now) {
      const bidDiff = bidTime - now;
      const bHours = Math.floor(bidDiff / 3600_000);
      const bMins = Math.floor((bidDiff % 3600_000) / 60_000);
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${colorClass}`}>
          <Clock className="h-3 w-3" />
          Proposta em {bHours}h {bMins}m
        </span>
      );
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${colorClass} ${isUrgent ? 'animate-countdown' : ''}`}>
      <Clock className="h-3 w-3" />
      {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`}
    </span>
  );
}
