'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Building2, 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Pill
} from 'lucide-react';
import { ClinicalStatusBadge } from '@/components/clinical/ClinicalStatusBadge';
import { ConsultationSlotPicker, ConsultationSlot } from '@/components/clinical/ConsultationSlotPicker';

export interface DoctorProfileSummary {
  id: string;
  name: string;
  degrees: string;
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  hospitalAffiliation: string;
  location: string;
  nmcRegistrationNumber: string;
  avatarUrl?: string;
  nextAvailableSlot: string;
  isAvailableToday: boolean;
  acceptsABDM: boolean;
  availableSlots: ConsultationSlot[];
}

interface DoctorSearchResultCardProps {
  doctor: DoctorProfileSummary;
  onBookConsultation: (doctorId: string, selectedSlotId?: string) => void;
  onViewProfile?: (doctorId: string) => void;
  className?: string;
}

export const DoctorSearchResultCard: React.FC<DoctorSearchResultCardProps> = ({
  doctor,
  onBookConsultation,
  onViewProfile,
  className = '',
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    doctor.availableSlots.find((s) => s.available)?.id || null
  );

  const selectedSlot = doctor.availableSlots.find((s) => s.id === selectedSlotId);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 ${className}`}>
      {/* Top Details & Demographics */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Avatar & Identifiers */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            {doctor.avatarUrl ? (
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-2 ring-slate-100"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                {doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
            )}
            {doctor.isAvailableToday && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-1 -right-1 shadow-xs flex items-center justify-center" title="Available Today for Video Consultation">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <h4 className="text-base font-extrabold text-slate-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors" onClick={() => onViewProfile && onViewProfile(doctor.id)}>
                {doctor.name}
              </h4>
              <span className="text-xs text-slate-500 font-semibold">({doctor.degrees})</span>
            </div>

            <p className="text-xs font-semibold text-blue-700">
              {doctor.specialty} {doctor.subSpecialty && `• ${doctor.subSpecialty}`}
            </p>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                {doctor.hospitalAffiliation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                {doctor.location}
              </span>
            </div>

            {/* Credential Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <ClinicalStatusBadge variant="verified" label={`NMC #${doctor.nmcRegistrationNumber}`} size="sm" />
              <ClinicalStatusBadge variant="top-rated" label={`${doctor.rating} (${doctor.reviewCount} reviews)`} size="sm" />
              {doctor.acceptsABDM && (
                <ClinicalStatusBadge variant="abdm" label="ABDM Health Locker" size="sm" />
              )}
            </div>
          </div>
        </div>

        {/* Fee & Experience Box */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Consultation Fee</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{doctor.consultationFee}</span>
              <span className="text-xs text-slate-500 font-medium">/ session</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 mt-1">
            {doctor.experienceYears} Years Exp.
          </span>
        </div>
      </div>

      {/* Interactive Slot Selector Section */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-600" />
            <span>Select Consultation Slot:</span>
          </span>
          {selectedSlot ? (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Selected: {selectedSlot.time} ({selectedSlot.period})
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Click a slot to reserve</span>
          )}
        </div>

        <ConsultationSlotPicker
          slots={doctor.availableSlots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={(slotId) => setSelectedSlotId(slotId)}
        />
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
          <Pill size={14} className="text-teal-600" />
          <span>Jan Aushadhi Generic Prescribing Verified</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(doctor.id)}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-xl transition-all"
            >
              Profile
            </button>
          )}

          <button
            type="button"
            onClick={() => onBookConsultation(doctor.id, selectedSlotId || undefined)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <Video size={13} />
            <span>Book Video Consult</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
