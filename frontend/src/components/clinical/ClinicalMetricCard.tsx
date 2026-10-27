import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from 'lucide-react';

interface ClinicalMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
  normalRange?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  className?: string;
}

export const ClinicalMetricCard: React.FC<ClinicalMetricCardProps> = ({
  label,
  value,
  unit,
  status = 'normal',
  normalRange,
  trend = 'stable',
  icon,
  className = '',
}) => {
  const statusStyles = {
    normal: {
      border: 'border-slate-200',
      bg: 'bg-white',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    warning: {
      border: 'border-amber-300',
      bg: 'bg-amber-50/30',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
    },
    critical: {
      border: 'border-rose-300',
      bg: 'bg-rose-50/40',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
      dot: 'bg-rose-500 animate-pulse',
    },
  }[status];

  return (
    <div className={`p-3.5 rounded-xl border ${statusStyles.border} ${statusStyles.bg} flex flex-col justify-between transition-all hover:shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-slate-500">
          {icon || <Activity size={14} className="text-slate-400" />}
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
          {status === 'critical' && <AlertCircle size={12} className="text-rose-600" />}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 mt-1">
        {normalRange ? (
          <span>Target: {normalRange}</span>
        ) : (
          <span className="capitalize">{status}</span>
        )}
        <span className="flex items-center gap-0.5 font-medium">
          {trend === 'up' && <ArrowUpRight size={13} className="text-rose-500" />}
          {trend === 'down' && <ArrowDownRight size={13} className="text-blue-500" />}
          {trend === 'stable' && <Minus size={13} className="text-slate-400" />}
          <span className="capitalize">{trend}</span>
        </span>
      </div>
    </div>
  );
};
