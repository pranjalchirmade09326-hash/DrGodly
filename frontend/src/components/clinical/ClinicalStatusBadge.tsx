import React from 'react';
import { ShieldCheck, Star, AlertTriangle, Pill, Video, CheckCircle2 } from 'lucide-react';

export type ClinicalBadgeVariant = 
  | 'verified'
  | 'top-rated'
  | 'emergency'
  | 'generic-savings'
  | 'telemedicine'
  | 'abdm';

interface ClinicalStatusBadgeProps {
  variant: ClinicalBadgeVariant;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const ClinicalStatusBadge: React.FC<ClinicalStatusBadgeProps> = ({
  variant,
  label,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = size === 'sm' ? 12 : 14;

  switch (variant) {
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-full ${sizeClasses} ${className}`}>
          <ShieldCheck size={iconSize} className="text-emerald-600" />
          <span>{label || 'NMC / MCI Verified'}</span>
        </span>
      );

    case 'top-rated':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 rounded-full ${sizeClasses} ${className}`}>
          <Star size={iconSize} className="text-amber-500 fill-amber-400" />
          <span>{label || 'Top Rated'}</span>
        </span>
      );

    case 'emergency':
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold text-rose-800 bg-rose-50 border border-rose-300 rounded-full animate-pulse ${sizeClasses} ${className}`}>
          <AlertTriangle size={iconSize} className="text-rose-600" />
          <span>{label || 'Emergency Red-Flag'}</span>
        </span>
      );

    case 'generic-savings':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-full ${sizeClasses} ${className}`}>
          <Pill size={iconSize} className="text-teal-600" />
          <span>{label || 'Jan Aushadhi 76% Savings'}</span>
        </span>
      );

    case 'telemedicine':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-full ${sizeClasses} ${className}`}>
          <Video size={iconSize} className="text-blue-600" />
          <span>{label || '1080p WebRTC Video'}</span>
        </span>
      );

    case 'abdm':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-full ${sizeClasses} ${className}`}>
          <CheckCircle2 size={iconSize} className="text-indigo-600" />
          <span>{label || 'ABHA / ABDM Linked'}</span>
        </span>
      );

    default:
      return null;
  }
};
