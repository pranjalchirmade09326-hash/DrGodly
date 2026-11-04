'use client';

import React from 'react';
import { ShieldCheck, Phone, AlertCircle, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { DrGodlyLogoMark } from '@/components/shared/DrGodlyLogo';

export interface GlobalFooterProps {
  showEmergencyBanner?: boolean;
  className?: string;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  showEmergencyBanner = true,
  className = '',
}) => {
  return (
    <footer className={`bg-slate-950 text-slate-400 text-xs border-t border-slate-800 ${className}`}>
      {/* ── US Standard Emergency Notice Banner ── */}
      {showEmergencyBanner && (
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle size={15} className="text-amber-400 shrink-0" />
              <span>
                <strong>Medical Notice:</strong> If you are experiencing a medical emergency (such as severe chest pain or shortness of breath), call <strong>911</strong> immediately or proceed to the nearest emergency department.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">Suicide & Crisis Lifeline: <strong>988</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Column 1: Brand & Architecture */}
          <div className="md:col-span-2 flex flex-col gap-3.5 pr-4">
            <div className="flex items-center gap-2.5">
              <DrGodlyLogoMark sizePx={32} />
              <div className="flex flex-col">
                <span className="text-base font-black text-white tracking-tight">DrGodly</span>
                <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">Clinical Intelligence OS</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation longitudinal clinical operating system. Ambient AI preparation, board-certified physician consultations, and HL7 FHIR R4 longitudinal context.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 size={11} /> HIPAA Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-blue-400">
                <Lock size={10} /> SOC 2 Type II
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-purple-400">
                HL7 FHIR R4
              </span>
            </div>
          </div>

          {/* Column 2: Clinical Platform */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-bold text-xs uppercase tracking-wider">Platform</span>
            <Link href="/en/screens" className="hover:text-white transition-colors">Telehealth Cockpit</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">Ambient AI Scribe</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">Clinical Decision Support</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">Digital e-Prescriptions</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">Longitudinal Patient Chart</Link>
          </div>

          {/* Column 3: For Providers */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-bold text-xs uppercase tracking-wider">For Providers</span>
            <Link href="/en/login" className="hover:text-white transition-colors">Clinician Portal</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">EHR / Epic Integration</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">NPI Verification</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">SOAP Note Automation</Link>
            <Link href="/en/screens" className="hover:text-white transition-colors">ICD-10 / CPT Scribe</Link>
          </div>

          {/* Column 4: Security & Legal */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-bold text-xs uppercase tracking-wider">Trust & Security</span>
            <Link href="#" className="hover:text-white transition-colors">HIPAA BAA Agreement</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Patient Rights</Link>
            <Link href="#" className="hover:text-white transition-colors">Security Whitepaper</Link>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} DrGodly Health Technologies, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All Systems Operational (99.99%)
            </span>
            <span>&middot;</span>
            <span>256-Bit TLS End-to-End Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
