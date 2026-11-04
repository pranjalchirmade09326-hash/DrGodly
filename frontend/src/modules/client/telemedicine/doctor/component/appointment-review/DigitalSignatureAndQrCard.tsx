"use client";

import { useState } from "react";
import { QrCode, ShieldCheck, CheckCircle2, Download, Printer, Lock, FileSignature } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DigitalSignatureAndQrCardProps {
  doctorName?: string;
  regNumber?: string;
  patientName?: string;
  appointmentId?: number | string;
}

export function DigitalSignatureAndQrCard({
  doctorName = "Dr. Priya Sharma",
  regNumber = "MCI-2018-98421",
  patientName = "Anjali Menon",
  appointmentId = "101",
}: DigitalSignatureAndQrCardProps) {
  const [syncedAbha, setSyncedAbha] = useState(false);

  const handleAbhaSync = () => {
    setSyncedAbha(true);
    toast.success("Prescription & Encounter pushed to Patient's ABHA Health Locker (M1/M2)");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/15 to-emerald-50/20 rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-teal-100/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Digital Signature & ABDM Verification
            </CardTitle>
            <p className="text-xs text-slate-500">
              Legally compliant electronic signature & tamper-evident QR stamp
            </p>
          </div>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs">
          MCI Validated
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Clinician Signature Stamp */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="font-bold text-slate-900 text-sm">{doctorName}, MD</span>
            <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">
              Reg #{regNumber}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Cardiology & Internal Medicine • Apollo Clinic / DrGodly Telemedicine Network
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-mono">
            <Lock className="h-3 w-3 text-teal-600" />
            <span>SHA-256: e82b7...d419a (Encrypted & Tamper-Evident)</span>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap justify-center md:justify-start">
            <Button
              size="sm"
              onClick={handleAbhaSync}
              className={`h-8 text-xs rounded-xl font-medium shadow-xs ${
                syncedAbha
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {syncedAbha ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Synced with ABHA Locker
                </>
              ) : (
                <>
                  <FileSignature className="h-3.5 w-3.5 mr-1" />
                  Push to ABHA Health Locker
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs rounded-xl border-slate-200 text-slate-700 gap-1"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print Prescription</span>
            </Button>
          </div>
        </div>

        {/* QR Code Graphic Box */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center shrink-0">
          {/* Simulated clean QR SVG */}
          <div className="w-24 h-24 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center relative overflow-hidden">
            <div className="w-full h-full bg-white p-1 rounded grid grid-cols-5 grid-rows-5 gap-0.5">
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-white" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-transparent" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
              <div className="bg-slate-900 rounded-xs" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 font-medium">
            Scan to Verify Rx
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
