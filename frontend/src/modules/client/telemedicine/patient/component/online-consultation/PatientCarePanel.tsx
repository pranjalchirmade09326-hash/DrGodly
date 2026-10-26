"use client";

import { useState } from "react";
import { Stethoscope, CheckCircle2, FileText, Pill, ShieldCheck, MessageSquare, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientCarePanelProps {
  doctorName?: string;
  specialty?: string;
}

export function PatientCarePanel({
  doctorName = "Dr. Priya Sharma",
  specialty = "Cardiology & Internal Medicine",
}: PatientCarePanelProps) {
  const [messages, setMessages] = useState<string[]>([
    "Dr. Priya Sharma joined the consultation.",
    "Pre-visit AI Intake & ECG reviewed by clinician.",
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `You: ${input.trim()}`]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Doctor Care Profile Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/40 via-white to-emerald-50/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            {doctorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900">{doctorName}</h4>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold py-0">
                Verified MD
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{specialty}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
        {/* Pre-Visit AI Intake Status */}
        <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-teal-800 font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Pre-Visit Clinical Intake
            </span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
              Ready for Review
            </Badge>
          </div>
          <p className="text-[11px] text-teal-900/80 leading-relaxed">
            Your reported headache symptoms, morning BP (150/95), and uploaded ECG have been synthesized for Dr. Priya.
          </p>
        </div>

        {/* Prescription Dispatch Notice */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
            <Pill className="h-3.5 w-3.5 text-indigo-600" />
            Post-Consultation Prescription
          </span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            After the call, your verified e-prescription will be generated with a secure QR code and synced to your ABHA health locker.
          </p>
        </div>

        {/* In-Call Notes & Chat Messages */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
            <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
            In-Call Chat & Instructions
          </span>

          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                {msg}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Send message to doctor..."
              className="h-8 text-xs bg-white rounded-xl"
            />
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-8 px-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
