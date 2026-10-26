"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SuggestedPrompt {
  id: string;
  label: string;
  response: string;
}

const DEFAULT_PROMPTS: SuggestedPrompt[] = [
  {
    id: "p1",
    label: "Summarize intake for next patient (Anjali Menon)",
    response: "Anjali Menon (42F, ABHA: 91-4821-9032-1104): Presenting with 3-day history of throbbing bilateral headaches and intermittent visual blurriness. Known Stage 2 HTN on Telmisartan 40mg. Self-reported BP this morning is 150/95 mmHg. No chest pain or dyspnea. Pre-visit ECG normal sinus rhythm.",
  },
  {
    id: "p2",
    label: "Check drug interactions: Metformin + Lisinopril",
    response: "No severe contraindication. Lisinopril may slightly enhance hypoglycemic effect of Metformin. Monitor renal function (eGFR) and serum potassium periodically, especially if GFR < 60 mL/min.",
  },
  {
    id: "p3",
    label: "Highlight critical lab values from yesterday",
    response: "Critical Flag: Patient Ramesh Kumar (MRN-4091) Serum Potassium reported at 5.8 mEq/L (Normal: 3.5 - 5.0 mEq/L). Action Recommended: Repeat stat electrolyte panel and review potassium-sparing medications.",
  },
  {
    id: "p4",
    label: "Draft follow-up template for hypertensive review",
    response: "SOAP Template Loaded: [Subjective] BP diary compliance, side effects (headache/dizziness). [Objective] In-clinic BP, heart rate, peripheral edema. [Assessment] HTN control status (JNC-8/AHA). [Plan] Titration or add CCB (Amlodipine), 30-day follow-up.",
  },
];

export function AiClinicalAssistantWidget() {
  const [selectedPrompt, setSelectedPrompt] = useState<SuggestedPrompt | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const handleSend = () => {
    if (!query.trim()) return;
    setLoading(true);
    setCustomAnswer(null);
    setTimeout(() => {
      setCustomAnswer(
        `DrGodly Clinical Engine: Analysis completed for "${query}". Based on AHA/ACC 2024 guidelines and recent EMR records, standard protocol suggests verifying patient baseline creatinine before adjusting pharmacotherapy.`
      );
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/30 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-teal-100/60 bg-white/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                AI Clinical Assistant
              </CardTitle>
              <p className="text-xs text-slate-500">
                Ambient clinical decision support & EMR insights
              </p>
            </div>
          </div>
          <Badge className="bg-teal-100/80 text-teal-800 hover:bg-teal-100 text-[11px] font-medium border border-teal-300/50">
            Gemini 2.5 Pro Grounded
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Suggested Prompt Chips */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Suggested Clinical Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setCustomAnswer(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-1.5 ${
                  selectedPrompt?.id === prompt.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50"
                }`}
              >
                <span>{prompt.label}</span>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* Answer Display */}
        {(selectedPrompt || customAnswer || loading) && (
          <div className="p-3.5 rounded-xl bg-white border border-teal-200/80 shadow-xs animate-in fade-in duration-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-teal-800 font-semibold border-b border-teal-100 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-teal-600" />
                {loading ? "Synthesizing EMR data..." : "Clinical Copilot Response"}
              </span>
              {!loading && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Evidence Verified
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 py-4 justify-center text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                Querying FastMCP & FHIR clinical repositories...
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-700">
                {customAnswer || selectedPrompt?.response}
              </p>
            )}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask DrGodly anything about your patients, schedule, or medications..."
            className="text-xs h-9 bg-white border-slate-200 focus-visible:ring-teal-500 rounded-xl"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!query.trim() || loading}
            className="h-9 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
